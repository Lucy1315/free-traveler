// SCR-004 참가 요청 폼(동행 상세 하단). design-reference/D-001/DESIGN.md
// §10(Form)·§14(Unauthorized·Error), UI_CONTRACT.md 4장.
// REQ-FUNC-034(모집중 글에 500자 이하 비공개 메시지), REQ-FUNC-035(동일 글
// PENDING·ACCEPTED 중복 차단), REQ-FUNC-027·028(로그인·만 19세 확인 필요),
// REQ-NF-019(제출 즉시 접수 표시).
//
// 상태: 확인 중 → 비로그인(SCR-005 로그인 유도) / 성인 확인 필요 / 내 글 /
// 마감 / 이미 요청함 / 작성 가능. 메시지는 작성자와 운영자만 볼 수 있다(RLS).

"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { createBrowserSupabaseClient } from "@/lib/db/browser";
import {
  getUserProfile,
  type MateApplicationRow,
  type MateApplicationStatus,
  type MatePostStatus,
} from "@/lib/db/queries";

export const PARTICIPATION_MESSAGE_MAX = 500;

export interface ParticipationRequestFormProps {
  postId: string;
  authorId: string;
  /** 조회 시점에 계산한 모집 상태(REQ-FUNC-037). */
  postStatus: MatePostStatus;
}

type ViewerState =
  | { kind: "checking" }
  | { kind: "guest" }
  | { kind: "needs_adult" }
  | { kind: "author" }
  | { kind: "applied"; status: MateApplicationStatus }
  | { kind: "ready" };

const APPLICATION_STATUS_LABEL: Record<MateApplicationStatus, string> = {
  PENDING: "검토 중 (PENDING)",
  ACCEPTED: "승인됨 (ACCEPTED)",
  REJECTED: "거절됨 (REJECTED)",
};

const noticeClass =
  "rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-5 text-[14px] leading-[1.55] text-[#4B4E54]";
const linkButtonClass =
  "mt-3 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]";

export default function ParticipationRequestForm({
  postId,
  authorId,
  postStatus,
}: ParticipationRequestFormProps) {
  const fieldId = useId();
  const [viewer, setViewer] = useState<ViewerState>({ kind: "checking" });
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 로그인·성인 확인·기존 요청 여부를 확인한다. Supabase 설정이 없는 환경에서는
  // 세션을 만들 수 없으므로 비로그인으로 본다.
  useEffect(() => {
    let cancelled = false;
    async function loadViewer() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) setViewer({ kind: "guest" });
          return;
        }
        if (user.id === authorId) {
          if (!cancelled) setViewer({ kind: "author" });
          return;
        }
        const { data: profile } = await getUserProfile(supabase, user.id);
        if (!profile?.is_adult) {
          if (!cancelled) setViewer({ kind: "needs_adult" });
          return;
        }
        // REQ-FUNC-035: 이미 보낸 요청이 있으면 폼 대신 상태를 보여준다.
        // RLS가 신청자 본인 요청만 돌려준다(작성자가 아니므로).
        const response = await fetch(
          `/api/mates/${encodeURIComponent(postId)}/applications`,
        );
        const body = response.ok
          ? ((await response.json()) as { applications: MateApplicationRow[] })
          : { applications: [] };
        const mine = body.applications.find(
          (application) => application.applicant_id === user.id,
        );
        if (cancelled) return;
        setViewer(
          mine && mine.status !== "REJECTED"
            ? { kind: "applied", status: mine.status }
            : { kind: "ready" },
        );
      } catch {
        if (!cancelled) setViewer({ kind: "guest" });
      }
    }
    void loadViewer();
    return () => {
      cancelled = true;
    };
  }, [postId, authorId]);

  const trimmedLength = message.trim().length;
  const messageError =
    trimmedLength === 0
      ? "참가 메시지를 입력해 주세요."
      : message.length > PARTICIPATION_MESSAGE_MAX
        ? `참가 메시지는 ${PARTICIPATION_MESSAGE_MAX}자까지 쓸 수 있습니다.`
        : null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (messageError || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/mates/${encodeURIComponent(postId)}/applications`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        },
      );
      if (response.status === 201) {
        // REQ-NF-019: 접수 즉시 화면에 반영한다.
        setViewer({ kind: "applied", status: "PENDING" });
        setMessage("");
        return;
      }
      if (response.status === 409) {
        setViewer({ kind: "applied", status: "PENDING" });
        return;
      }
      if (response.status === 401) {
        setViewer({ kind: "guest" });
        return;
      }
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setServerError(body?.error ?? "참가 요청을 보내지 못했습니다.");
    } catch {
      setServerError("네트워크 오류로 참가 요청을 보내지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  let content: React.ReactNode;
  if (viewer.kind === "checking") {
    content = (
      <p className="text-[14px] text-[#84878D]" aria-live="polite">
        참가 요청 가능 여부를 확인하고 있어요.
      </p>
    );
  } else if (postStatus === "CLOSED") {
    content = (
      <p className={noticeClass}>
        모집이 마감된 글입니다. 비슷한 일정의 다른 모집글을 찾아보거나 직접
        모집글을 올려 보세요.
      </p>
    );
  } else if (viewer.kind === "guest") {
    content = (
      <div data-testid="mate-apply-login-notice" className={noticeClass}>
        <p className="text-[17px] font-semibold text-[#26282C]">
          로그인이 필요합니다
        </p>
        <p className="mt-2">
          참가 요청은 이메일 인증을 마친 회원만 보낼 수 있습니다. 모집글 열람은
          로그인 없이도 가능합니다.
        </p>
        <Link href="/account" className={linkButtonClass}>
          로그인하러 가기
        </Link>
      </div>
    );
  } else if (viewer.kind === "needs_adult") {
    content = (
      <div className={noticeClass}>
        <p className="text-[17px] font-semibold text-[#26282C]">
          만 19세 이상 확인이 필요합니다
        </p>
        <p className="mt-2">
          계정 화면에서 성인 확인을 마치면 참가 요청을 보낼 수 있습니다.
        </p>
        <Link href="/account" className={linkButtonClass}>
          계정에서 확인하기
        </Link>
      </div>
    );
  } else if (viewer.kind === "author") {
    content = (
      <p className={noticeClass}>
        내가 올린 모집글입니다. 받은 참가 요청은 계정 화면의 내 활동에서
        승인하거나 거절할 수 있어요.
      </p>
    );
  } else if (viewer.kind === "applied") {
    content = (
      <div
        role="status"
        data-testid="participation-request-status"
        className={noticeClass}
      >
        <Badge variant={viewer.status === "ACCEPTED" ? "success" : "info"}>
          {APPLICATION_STATUS_LABEL[viewer.status]}
        </Badge>
        <p className="mt-2">
          {viewer.status === "ACCEPTED"
            ? "작성자가 참가를 승인했어요. 계정 화면에서 일정을 확인하세요."
            : "참가 요청을 보냈어요. 작성자가 확인하면 계정 화면에서 결과를 볼 수 있습니다."}
        </p>
      </div>
    );
  } else {
    const showError = submitted && messageError !== null;
    content = (
      <form
        noValidate
        onSubmit={handleSubmit}
        data-testid="mate-apply-form"
        className="flex flex-col gap-3"
      >
        <label
          htmlFor={`${fieldId}-message`}
          className="text-[13px] font-medium text-[#26282C]"
        >
          참가 메시지 *
        </label>
        <textarea
          id={`${fieldId}-message`}
          data-testid="participation-request-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          maxLength={PARTICIPATION_MESSAGE_MAX}
          aria-invalid={showError}
          aria-describedby={`${fieldId}-hint${showError ? ` ${fieldId}-error` : ""}`}
          placeholder="간단한 자기소개와 함께하고 싶은 일정을 적어 주세요."
          className={`w-full rounded-[8px] border bg-[#FFFFFF] px-3 py-3 text-[16px] leading-[1.6] text-[#26282C] focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8] ${showError ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
        />
        <p
          id={`${fieldId}-hint`}
          className="flex justify-between text-[13px] text-[#84878D]"
        >
          <span>메시지는 작성자에게만 보이며 연락처는 적지 마세요.</span>
          <span>
            {message.length}/{PARTICIPATION_MESSAGE_MAX}
          </span>
        </p>
        {showError && (
          <p
            id={`${fieldId}-error`}
            className="text-[13px] font-medium text-[#C7284B]"
          >
            {messageError}
          </p>
        )}
        {serverError && (
          <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
            오류: {serverError} 다시 시도해 주세요.
          </p>
        )}
        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "보내는 중…" : "참가 요청 보내기"}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <section aria-label="참가 요청" className="flex flex-col gap-3">
      <h3 className="text-[17px] font-semibold text-[#26282C]">참가 요청</h3>
      {content}
    </section>
  );
}
