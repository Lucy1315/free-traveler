// SCR-004 신고·차단 액션(동행 상세 하단). design-reference/D-001/DESIGN.md
// §13(Toast — 접수 결과 표시)·§14(Unauthorized·Error), UI_CONTRACT.md 4장.
// REQ-FUNC-039(글·사용자를 사유 코드+설명으로 신고), REQ-FUNC-040(차단·해제).
//
// - 신고는 전용 Route Handler가 없어(API-MATES-ROUTES 범위 밖, src/app/api/
//   blocks/route.ts 주석 참고) 브라우저 Supabase 클라이언트로 report에 직접
//   insert한다. RLS(report_insert_self)가 reporter_id = 본인만 허용한다.
// - 차단은 /api/blocks를 쓴다. 현재 차단 상태(blockId)는 부모가 /api/blocks로
//   불러와 넘기고, 변경되면 onBlockChange로 알린다 — 부모는 차단한 사용자의
//   글을 목록에서 뺀다(applyMateFilters의 blockedUserIds).
// - 접수 결과는 Toast로 보여주므로 이 컴포넌트는 ToastProvider 안에 있어야 한다.

"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createBrowserSupabaseClient } from "@/lib/db/browser";
import { createReport, type ReportTargetType } from "@/lib/db/queries";

export const REPORT_REASONS = [
  { code: "SPAM", label: "스팸·광고" },
  { code: "CONTACT_SOLICITATION", label: "외부 연락처 요구" },
  { code: "HARASSMENT", label: "욕설·괴롭힘" },
  { code: "SEXUAL", label: "성적인 내용·만남 목적" },
  { code: "FRAUD", label: "사기·금전 요구" },
  { code: "OTHER", label: "기타" },
] as const;

const REPORT_DESCRIPTION_MAX = 500;

export interface ReportBlockActionsProps {
  postId: string;
  authorId: string;
  /** 내가 이 작성자를 차단한 기록의 id. 차단하지 않았으면 null. */
  blockId: string | null;
  onBlockChange: (blockId: string | null) => void;
}

type Panel = "none" | "report" | "login";

const secondaryButtonClass =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-4 text-[14px] font-semibold text-[#26282C] hover:bg-[#F7F6F4] disabled:text-[#84878D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]";

async function getSignedInUserId(): Promise<string | null> {
  try {
    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

export default function ReportBlockActions({
  postId,
  authorId,
  blockId,
  onBlockChange,
}: ReportBlockActionsProps) {
  const fieldId = useId();
  const { showToast } = useToast();
  const [panel, setPanel] = useState<Panel>("none");
  const [targetType, setTargetType] = useState<ReportTargetType>("mate_post");
  const [reasonCode, setReasonCode] = useState("");
  const [description, setDescription] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openReport() {
    setError(null);
    const userId = await getSignedInUserId();
    setPanel(userId ? "report" : "login");
  }

  async function handleReportSubmit(event: React.FormEvent) {
    event.preventDefault();
    setReportSubmitted(true);
    setError(null);
    if (!reasonCode || description.length > REPORT_DESCRIPTION_MAX || busy) {
      return;
    }
    setBusy(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setPanel("login");
        return;
      }
      const { data, error: insertError } = await createReport(supabase, {
        reporterId: user.id,
        targetType,
        targetId: targetType === "mate_post" ? postId : authorId,
        reasonCode,
        description: description.trim() || undefined,
      });
      if (insertError || !data) {
        setError("신고를 접수하지 못했습니다.");
        return;
      }
      // REQ-NF-019: 접수 즉시 접수번호와 함께 알린다.
      showToast(
        "success",
        `신고가 접수되었습니다. 접수번호 ${data.id.slice(0, 8).toUpperCase()}`,
      );
      setPanel("none");
      setReasonCode("");
      setDescription("");
      setReportSubmitted(false);
    } catch {
      setError("네트워크 오류로 신고를 접수하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function handleBlockToggle() {
    setError(null);
    if (busy) return;
    const userId = await getSignedInUserId();
    if (!userId) {
      setPanel("login");
      return;
    }
    setBusy(true);
    try {
      if (blockId) {
        const response = await fetch(
          `/api/blocks?blockId=${encodeURIComponent(blockId)}`,
          { method: "DELETE" },
        );
        if (!response.ok) {
          setError("차단을 해제하지 못했습니다.");
          return;
        }
        onBlockChange(null);
        showToast("info", "차단을 해제했습니다.");
        return;
      }
      const response = await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockedId: authorId }),
      });
      const body = (await response.json().catch(() => null)) as {
        block?: { id: string };
        error?: string;
      } | null;
      if (response.status === 201 && body?.block) {
        onBlockChange(body.block.id);
        showToast(
          "success",
          "작성자를 차단했습니다. 이 사용자의 모집글은 목록에서 보이지 않습니다.",
        );
        return;
      }
      setError(body?.error ?? "작성자를 차단하지 못했습니다.");
    } catch {
      setError("네트워크 오류로 요청을 처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }

  const reasonError =
    reportSubmitted && !reasonCode ? "신고 사유를 선택해 주세요." : null;
  const selectClass =
    "h-12 w-full rounded-[8px] border bg-[#FFFFFF] px-3 text-[16px] text-[#26282C] focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]";

  return (
    <section aria-label="신고·차단" className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openReport}
          aria-expanded={panel === "report"}
          className={secondaryButtonClass}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M5 21V4h11l-1.5 4L16 12H5" />
          </svg>
          신고
        </button>
        <button
          type="button"
          onClick={handleBlockToggle}
          disabled={busy}
          className={secondaryButtonClass}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M6 6l12 12" />
          </svg>
          {blockId ? "차단 해제" : "작성자 차단"}
        </button>
      </div>

      {panel === "login" && (
        <div
          data-testid="mate-report-login-notice"
          className="rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-5 text-[14px] leading-[1.55] text-[#4B4E54]"
        >
          <p className="text-[17px] font-semibold text-[#26282C]">
            로그인이 필요합니다
          </p>
          <p className="mt-2">신고와 차단은 로그인한 회원만 할 수 있습니다.</p>
          <Link
            href="/account"
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            로그인하러 가기
          </Link>
        </div>
      )}

      {panel === "report" && (
        <form
          noValidate
          onSubmit={handleReportSubmit}
          className="flex flex-col gap-3 rounded-[14px] border border-[#E3E2DF] p-5"
        >
          <fieldset className="flex flex-wrap gap-4">
            <legend className="mb-2 text-[13px] font-medium text-[#26282C]">
              신고 대상
            </legend>
            <label className="flex min-h-[44px] items-center gap-2 text-[14px] text-[#26282C]">
              <input
                type="radio"
                name={`${fieldId}-target`}
                checked={targetType === "mate_post"}
                onChange={() => setTargetType("mate_post")}
              />
              이 모집글
            </label>
            <label className="flex min-h-[44px] items-center gap-2 text-[14px] text-[#26282C]">
              <input
                type="radio"
                name={`${fieldId}-target`}
                checked={targetType === "user_profile"}
                onChange={() => setTargetType("user_profile")}
              />
              작성자
            </label>
          </fieldset>

          <label
            htmlFor={`${fieldId}-reason`}
            className="text-[13px] font-medium text-[#26282C]"
          >
            신고 사유 *
          </label>
          <select
            id={`${fieldId}-reason`}
            value={reasonCode}
            onChange={(event) => setReasonCode(event.target.value)}
            aria-invalid={reasonError !== null}
            aria-describedby={
              reasonError ? `${fieldId}-reason-error` : undefined
            }
            className={`${selectClass} ${reasonError ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
          >
            <option value="">사유 선택</option>
            {REPORT_REASONS.map((reason) => (
              <option key={reason.code} value={reason.code}>
                {reason.label}
              </option>
            ))}
          </select>
          {reasonError && (
            <p
              id={`${fieldId}-reason-error`}
              className="text-[13px] font-medium text-[#C7284B]"
            >
              {reasonError}
            </p>
          )}

          <label
            htmlFor={`${fieldId}-description`}
            className="text-[13px] font-medium text-[#26282C]"
          >
            설명(선택)
          </label>
          <textarea
            id={`${fieldId}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={REPORT_DESCRIPTION_MAX}
            className="w-full rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-3 py-3 text-[16px] leading-[1.6] text-[#26282C] focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]"
          />
          <p className="text-right text-[13px] text-[#84878D]">
            {description.length}/{REPORT_DESCRIPTION_MAX}
          </p>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? "접수 중…" : "신고 접수"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPanel("none");
                setReportSubmitted(false);
                setError(null);
              }}
            >
              취소
            </Button>
          </div>
        </form>
      )}

      {error && (
        <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
          오류: {error} 다시 시도해 주세요.
        </p>
      )}
    </section>
  );
}
