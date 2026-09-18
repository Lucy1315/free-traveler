// SCR-005 관리자 설정 탭 2개(신고 상태 변경 · 외부 URL 설정).
// design-reference/UI_CONTRACT.md 5장(Admin: 정확히 2개 탭, 통계 차트·Dashboard
// 금지), D-001 §10(Form)·§14(Empty·Error).
// REQ-FUNC-041(축소: 상태별 필터 목록)·042(축소: 상태 변경)·062(문의·SNS 링크)·077.
//
// 권한: 이 컴포넌트는 Moderator/Admin에게만 렌더링돼야 한다 — 부모(PO-SCR-005)가
// 역할을 확인해 권한 없는 계정에는 탭 자체를 그리지 않는다. 서버(/api/admin/*)도
// 요청마다 역할을 다시 확인하고 RLS가 최종 방어선이다.

"use client";

import { useEffect, useId, useState } from "react";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import {
  EXTERNAL_URL_CATEGORIES,
  isAllowedExternalUrl,
  type ExternalUrlCategory,
  type ExternalUrlSettingRow,
  type ReportRow,
  type ReportStatus,
} from "@/lib/db/queries";

// ---------------------------------------------------------------------------
// 신고 상태 변경
// ---------------------------------------------------------------------------

const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: "접수",
  WARNED: "경고",
  CONTENT_HIDDEN: "콘텐츠 숨김",
  ACCOUNT_RESTRICTED: "계정 일시 제한",
  DISMISSED: "기각",
};

const REPORT_STATUS_VARIANT: Record<ReportStatus, BadgeVariant> = {
  PENDING: "warning",
  WARNED: "info",
  CONTENT_HIDDEN: "info",
  ACCOUNT_RESTRICTED: "error",
  DISMISSED: "neutral",
};

const REPORT_TARGET_LABEL: Record<ReportRow["target_type"], string> = {
  mate_post: "모집글",
  user_profile: "사용자",
  mate_application: "참가 요청",
};

const UPDATABLE_STATUSES: Exclude<ReportStatus, "PENDING">[] = [
  "WARNED",
  "CONTENT_HIDDEN",
  "ACCOUNT_RESTRICTED",
  "DISMISSED",
];

const FILTERS: { value: ReportStatus | ""; label: string }[] = [
  { value: "", label: "전체" },
  ...(Object.keys(REPORT_STATUS_LABEL) as ReportStatus[]).map((status) => ({
    value: status,
    label: REPORT_STATUS_LABEL[status],
  })),
];

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function SkeletonList() {
  return (
    <ul
      aria-busy="true"
      aria-label="불러오는 중"
      className="flex flex-col gap-3"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <li
          key={index}
          aria-hidden="true"
          className="h-24 animate-pulse rounded-[14px] bg-[#F0EFEC]"
        />
      ))}
    </ul>
  );
}

function ReportCard({
  report,
  onUpdated,
}: {
  report: ReportRow;
  onUpdated: (next: ReportRow) => void;
}) {
  const fieldId = useId();
  const [nextStatus, setNextStatus] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!nextStatus || saving) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id, status: nextStatus }),
      });
      const body = (await response.json().catch(() => null)) as {
        report?: ReportRow;
        error?: string;
      } | null;
      if (!response.ok || !body?.report) {
        setError(body?.error ?? "상태를 변경하지 못했습니다.");
        return;
      }
      onUpdated(body.report);
      setNextStatus("");
    } catch {
      setError("네트워크 오류로 상태를 변경하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <li
      data-testid="admin-report-card"
      className="flex flex-col gap-3 rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={REPORT_STATUS_VARIANT[report.status]}>
          {REPORT_STATUS_LABEL[report.status]}
        </Badge>
        <span className="text-[14px] font-medium text-[#26282C]">
          대상: {REPORT_TARGET_LABEL[report.target_type]}
        </span>
        <span className="text-[13px] text-[#84878D]">
          접수 {formatDateTime(report.created_at)} · 접수번호{" "}
          {report.id.slice(0, 8).toUpperCase()}
        </span>
      </div>
      <p className="text-[14px] text-[#4B4E54]">
        사유 코드 <span className="font-semibold">{report.reason_code}</span>
        {report.description ? ` — ${report.description}` : ""}
      </p>
      <p className="text-[13px] text-[#84878D]">대상 ID {report.target_id}</p>
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${fieldId}-status`}
            className="text-[13px] font-medium text-[#26282C]"
          >
            조치 선택
          </label>
          <select
            id={`${fieldId}-status`}
            value={nextStatus}
            onChange={(event) => setNextStatus(event.target.value)}
            className="h-12 rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-3 text-[16px] text-[#26282C] outline-none focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]"
          >
            <option value="">조치를 고르세요</option>
            {UPDATABLE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {REPORT_STATUS_LABEL[status]}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="secondary"
          onClick={save}
          disabled={!nextStatus || saving}
        >
          {saving ? "저장 중…" : "상태 변경"}
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
          오류: {error} 다시 시도해 주세요.
        </p>
      )}
    </li>
  );
}

export function AdminReportsTab() {
  const [filter, setFilter] = useState<ReportStatus | "">("PENDING");
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const query = filter ? `?status=${filter}` : "";
    fetch(`/api/admin/reports${query}`)
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as {
          reports?: ReportRow[];
          error?: string;
        } | null;
        if (cancelled) return;
        if (!response.ok || !body?.reports) {
          setError(body?.error ?? "신고 목록을 불러오지 못했습니다.");
          return;
        }
        setError(null);
        setReports(body.reports);
      })
      .catch(() => {
        if (!cancelled)
          setError("네트워크 오류로 신고 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter, reloadKey]);

  function changeFilter(next: ReportStatus | "") {
    setLoading(true);
    setFilter(next);
  }

  return (
    <section
      aria-labelledby="admin-reports-title"
      className="flex flex-col gap-4"
    >
      <div>
        <h2
          id="admin-reports-title"
          className="text-[24px] font-semibold leading-[1.35] text-[#26282C]"
        >
          신고 상태 변경
        </h2>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4E54]">
          접수된 신고를 상태별로 확인하고 경고·숨김·일시 제한·기각 중 조치를
          기록합니다.
        </p>
      </div>
      <div
        role="group"
        aria-label="신고 상태 필터"
        className="flex flex-wrap gap-2"
      >
        {FILTERS.map((option) => (
          <Chip
            key={option.label}
            active={filter === option.value}
            onClick={() => changeFilter(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>

      {loading ? (
        <SkeletonList />
      ) : error ? (
        <div
          role="alert"
          className="rounded-[14px] border-2 border-[#C7284B] p-5"
        >
          <p className="text-[16px] font-medium text-[#C7284B]">
            오류: {error}
          </p>
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={() => {
                setLoading(true);
                setReloadKey((key) => key + 1);
              }}
            >
              다시 시도
            </Button>
          </div>
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-6">
          <p className="text-[17px] font-semibold text-[#26282C]">
            {filter
              ? `${REPORT_STATUS_LABEL[filter]} 상태의 신고가 없습니다`
              : "접수된 신고가 없습니다"}
          </p>
          <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
            새 신고가 들어오면 이 목록에 접수 순으로 나타납니다. 다른 상태의
            신고를 보려면 위 필터를 바꿔 보세요.
          </p>
          {filter && (
            <div className="mt-4">
              <Button variant="secondary" onClick={() => changeFilter("")}>
                전체 신고 보기
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onUpdated={(next) =>
                setReports((prev) =>
                  filter && next.status !== filter
                    ? prev.filter((item) => item.id !== next.id)
                    : prev.map((item) => (item.id === next.id ? next : item)),
                )
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// 외부 URL 설정(항공·숙소 + 문의·SNS 링크)
// ---------------------------------------------------------------------------

const URL_FIELDS: Record<ExternalUrlCategory, { label: string; hint: string }> =
  {
    flight: {
      label: "항공 비교 사이트 URL",
      hint: "허용된 항공권 비교 사이트의 https:// 주소",
    },
    hotel: {
      label: "숙소 비교 사이트 URL",
      hint: "허용된 숙소 예약 사이트의 https:// 주소",
    },
    contact: {
      label: "문의 링크",
      hint: "https:// 주소 또는 mailto:이메일",
    },
    instagram: { label: "Instagram", hint: "https:// 주소" },
    youtube: { label: "YouTube", hint: "https:// 주소" },
    blog: { label: "블로그", hint: "https:// 주소" },
  };

function UrlSettingRow({
  category,
  initialUrl,
}: {
  category: ExternalUrlCategory;
  initialUrl: string;
}) {
  const fieldId = useId();
  const [url, setUrl] = useState(initialUrl);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    kind: "ok" | "error";
    text: string;
  } | null>(null);
  const field = URL_FIELDS[category];
  const invalid = url.length > 0 && !isAllowedExternalUrl(category, url.trim());

  async function save() {
    const trimmed = url.trim();
    if (!trimmed || invalid || saving) {
      setMessage({
        kind: "error",
        text: `${field.hint} 형식으로 입력해 주세요.`,
      });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/settings/outbound", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, url: trimmed }),
      });
      const body = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setMessage(
        response.ok
          ? { kind: "ok", text: "저장했습니다. 5분 안에 화면에 반영됩니다." }
          : {
              kind: "error",
              text: `${body?.error ?? "저장하지 못했습니다."} 다시 시도해 주세요.`,
            },
      );
    } catch {
      setMessage({
        kind: "error",
        text: "네트워크 오류로 저장하지 못했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <li className="flex flex-col gap-2">
      <label
        htmlFor={`${fieldId}-url`}
        className="text-[13px] font-medium text-[#26282C]"
      >
        {field.label}
      </label>
      <div className="flex flex-col gap-2 md:flex-row">
        <input
          id={`${fieldId}-url`}
          type="url"
          inputMode="url"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setMessage(null);
          }}
          aria-invalid={invalid}
          aria-describedby={`${fieldId}-hint`}
          className={`h-12 w-full rounded-[8px] border bg-[#FFFFFF] px-3 text-[16px] text-[#26282C] outline-none focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8] ${invalid ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
        />
        <Button variant="secondary" onClick={save} disabled={saving}>
          {saving ? "저장 중…" : "저장"}
        </Button>
      </div>
      <p id={`${fieldId}-hint`} className="text-[13px] text-[#84878D]">
        {field.hint}
      </p>
      {message && (
        <p
          role={message.kind === "error" ? "alert" : "status"}
          className={`text-[14px] font-medium ${message.kind === "error" ? "text-[#C7284B]" : "text-[#1F8A4C]"}`}
        >
          {message.kind === "error" ? `오류: ${message.text}` : message.text}
        </p>
      )}
    </li>
  );
}

export function AdminUrlSettingsTab() {
  const [settings, setSettings] = useState<ExternalUrlSettingRow[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/settings/outbound")
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as {
          settings?: ExternalUrlSettingRow[];
          error?: string;
        } | null;
        if (cancelled) return;
        if (!response.ok || !body?.settings) {
          setError(body?.error ?? "설정을 불러오지 못했습니다.");
          return;
        }
        setError(null);
        setSettings(body.settings);
      })
      .catch(() => {
        if (!cancelled) setError("네트워크 오류로 설정을 불러오지 못했습니다.");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <section aria-labelledby="admin-url-title" className="flex flex-col gap-4">
      <div>
        <h2
          id="admin-url-title"
          className="text-[24px] font-semibold leading-[1.35] text-[#26282C]"
        >
          외부 URL 설정
        </h2>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4E54]">
          여행 준비 화면의 항공·숙소 이동 주소와 대표 소개의 문의·SNS 링크를
          관리합니다. 보안을 위해 https:// 주소만 저장할 수 있고(문의는 mailto:
          허용), 비워 둔 링크는 화면에 표시되지 않습니다.
        </p>
      </div>
      {error ? (
        <div
          role="alert"
          className="rounded-[14px] border-2 border-[#C7284B] p-5"
        >
          <p className="text-[16px] font-medium text-[#C7284B]">
            오류: {error}
          </p>
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={() => {
                setError(null);
                setSettings(null);
                setReloadKey((key) => key + 1);
              }}
            >
              다시 시도
            </Button>
          </div>
        </div>
      ) : settings === null ? (
        <SkeletonList />
      ) : (
        <ul className="flex flex-col gap-6">
          {EXTERNAL_URL_CATEGORIES.map((category) => (
            <UrlSettingRow
              key={category}
              category={category}
              initialUrl={
                settings.find((row) => row.category === category)?.url ?? ""
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}

/** 관리자 탭 정의(PO-SCR-005가 Member 탭 아래 "관리자 설정" 구분선 뒤에 배치). */
export const ADMIN_TABS = [
  { id: "admin-reports", label: "신고 상태 변경", Panel: AdminReportsTab },
  { id: "admin-urls", label: "외부 URL 설정", Panel: AdminUrlSettingsTab },
] as const;

export default function AdminTabs() {
  return (
    <div className="flex flex-col gap-12">
      <AdminReportsTab />
      <AdminUrlSettingsTab />
    </div>
  );
}
