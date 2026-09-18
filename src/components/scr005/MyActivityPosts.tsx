// SCR-005 Member 탭 "내 글"과 "참가 요청". design-reference/UI_CONTRACT.md 5장
// (내 모집글 수정/마감/삭제, 참가 요청 상태 리스트 + 승인/거절 버튼), D-001 §14.
// REQ-FUNC-036(작성자가 요청을 ACCEPTED/REJECTED로 변경), REQ-FUNC-038(수동
// 마감·수정·삭제).
//
// - 쓰기는 모두 Route Handler(/api/mates/[id], /api/applications/[id])를 거친다.
//   서버가 세션을 확인하고 RLS가 작성자 본인만 허용한다(비작성자 변경은 거부).
// - 읽기는 브라우저 Supabase 클라이언트로 본인 데이터만 조회한다(RLS 범위).
// - 모집글 수정 시 연락처 패턴은 작성 폼(SCR-003)과 같은 규칙으로 막는다.

"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { detectContactInfo } from "@/components/scr003/MateWriteForm";
import { createBrowserSupabaseClient } from "@/lib/db/browser";
import type {
  MateApplicationRow,
  MateApplicationStatus,
  MatePostRow,
  MatePostStatus,
} from "@/lib/db/queries";

const APPLICATION_STATUS: Record<
  MateApplicationStatus,
  { label: string; variant: "info" | "success" | "neutral" }
> = {
  PENDING: { label: "검토 중 (PENDING)", variant: "info" },
  ACCEPTED: { label: "승인됨 (ACCEPTED)", variant: "success" },
  REJECTED: { label: "거절됨 (REJECTED)", variant: "neutral" },
};

const emptyBoxClass = "rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-6";
const primaryLinkClass =
  "mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]";

function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function effectiveStatus(post: MatePostRow): MatePostStatus {
  return post.status === "CLOSED" || post.end_date < localToday()
    ? "CLOSED"
    : "RECRUITING";
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

function ErrorBox({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div role="alert" className="rounded-[14px] border-2 border-[#C7284B] p-5">
      <p className="text-[16px] font-medium text-[#C7284B]">오류: {message}</p>
      <div className="mt-3">
        <Button variant="secondary" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    </div>
  );
}

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  return body?.error ?? fallback;
}

// ---------------------------------------------------------------------------
// 받은 참가 요청(작성자 전용)
// ---------------------------------------------------------------------------

function ReceivedApplications({ postId }: { postId: string }) {
  const [applications, setApplications] = useState<
    (MateApplicationRow & { nickname: string | null })[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(
          `/api/mates/${encodeURIComponent(postId)}/applications`,
        );
        const body = (await response.json().catch(() => null)) as {
          applications?: MateApplicationRow[];
        } | null;
        if (!response.ok || !body?.applications) {
          if (!cancelled) setError("받은 참가 요청을 불러오지 못했습니다.");
          return;
        }
        const nicknames = new Map<string, string>();
        const ids = body.applications.map((item) => item.applicant_id);
        if (ids.length > 0) {
          const { data } = await createBrowserSupabaseClient()
            .from("user_profile")
            .select("id, nickname")
            .in("id", ids);
          for (const row of data ?? []) nicknames.set(row.id, row.nickname);
        }
        if (cancelled) return;
        setError(null);
        setApplications(
          body.applications.map((item) => ({
            ...item,
            nickname: nicknames.get(item.applicant_id) ?? null,
          })),
        );
      } catch {
        if (!cancelled) setError("네트워크 오류로 요청을 불러오지 못했습니다.");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [postId, reloadKey]);

  async function decide(
    applicationId: string,
    status: "ACCEPTED" | "REJECTED",
  ) {
    setPendingId(applicationId);
    setActionError(null);
    try {
      const response = await fetch(
        `/api/applications/${encodeURIComponent(applicationId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (!response.ok) {
        setActionError(
          `${await readError(response, "처리하지 못했습니다.")} 다시 시도해 주세요.`,
        );
        return;
      }
      setApplications(
        (prev) =>
          prev?.map((item) =>
            item.id === applicationId ? { ...item, status } : item,
          ) ?? null,
      );
    } catch {
      setActionError(
        "네트워크 오류로 처리하지 못했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setPendingId(null);
    }
  }

  if (error) {
    return (
      <ErrorBox
        message={error}
        onRetry={() => {
          setError(null);
          setApplications(null);
          setReloadKey((key) => key + 1);
        }}
      />
    );
  }
  if (applications === null) return <SkeletonList />;
  if (applications.length === 0) {
    return (
      <p className="text-[14px] text-[#4B4E54]">
        아직 받은 참가 요청이 없습니다. 모집글을 공유하면 더 많은 여행자가 볼 수
        있어요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {applications.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 rounded-[8px] bg-[#F7F6F4] p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-semibold text-[#26282C]">
                {item.nickname ?? "알 수 없는 사용자"}
              </span>
              <Badge variant={APPLICATION_STATUS[item.status].variant}>
                {APPLICATION_STATUS[item.status].label}
              </Badge>
            </div>
            <p className="whitespace-pre-line text-[14px] leading-[1.55] text-[#4B4E54]">
              {item.message}
            </p>
            {item.status === "PENDING" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => decide(item.id, "ACCEPTED")}
                  disabled={pendingId === item.id}
                >
                  승인
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => decide(item.id, "REJECTED")}
                  disabled={pendingId === item.id}
                >
                  거절
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {actionError && (
        <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
          오류: {actionError}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 내 모집글 한 건(수정·마감·삭제)
// ---------------------------------------------------------------------------

function MyPostItem({
  post,
  onChanged,
  onDeleted,
}: {
  post: MatePostRow;
  onChanged: (next: MatePostRow) => void;
  onDeleted: (postId: string) => void;
}) {
  const fieldId = useId();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(post.title);
  const [capacity, setCapacity] = useState(String(post.capacity));
  const [conditions, setConditions] = useState(post.preferred_conditions ?? "");
  const [description, setDescription] = useState(post.description);
  const [submitted, setSubmitted] = useState(false);

  const status = effectiveStatus(post);
  const capacityNumber = Number(capacity);
  const contactFound =
    detectContactInfo(`${title}\n${conditions}\n${description}`).length > 0;
  const formErrors = {
    title: title.trim() ? null : "제목을 입력해 주세요.",
    capacity:
      Number.isInteger(capacityNumber) && capacityNumber >= 1
        ? null
        : "모집 인원은 1명 이상이어야 합니다.",
    description: description.trim() ? null : "소개를 입력해 주세요.",
  };

  async function patch(body: Record<string, unknown>, fallback: string) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/mates/${encodeURIComponent(post.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok) {
        setError(`${await readError(response, fallback)} 다시 시도해 주세요.`);
        return false;
      }
      const data = (await response.json()) as { post: MatePostRow };
      onChanged(data.post);
      return true;
    } catch {
      setError("네트워크 오류로 처리하지 못했습니다. 다시 시도해 주세요.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.values(formErrors).some(Boolean) || contactFound || busy) return;
    const ok = await patch(
      {
        title: title.trim(),
        capacity: capacityNumber,
        preferredConditions: conditions.trim() || null,
        description: description.trim(),
      },
      "수정하지 못했습니다.",
    );
    if (ok) {
      setEditing(false);
      setSubmitted(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/mates/${encodeURIComponent(post.id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        setError(
          `${await readError(response, "삭제하지 못했습니다.")} 다시 시도해 주세요.`,
        );
        return;
      }
      onDeleted(post.id);
    } catch {
      setError("네트워크 오류로 삭제하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li
      data-testid="my-post-item"
      className="flex flex-col gap-4 rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={status === "RECRUITING" ? "success" : "neutral"}>
            {status === "RECRUITING" ? "모집중" : "마감"}
          </Badge>
          <span className="text-[14px] text-[#84878D]">
            {post.region ? `${post.country} · ${post.region}` : post.country} ·{" "}
            {post.start_date} ~ {post.end_date} · {post.capacity}명
          </span>
        </div>
        <Link
          href={`/mates?postId=${encodeURIComponent(post.id)}`}
          className="text-[17px] font-semibold text-[#26282C] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          {post.title}
        </Link>
      </div>

      {editing ? (
        <form noValidate onSubmit={saveEdit} className="flex flex-col gap-4">
          <TextInput
            label="제목"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            error={submitted ? (formErrors.title ?? undefined) : undefined}
          />
          <TextInput
            label="모집 인원"
            type="number"
            min={1}
            required
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
            error={submitted ? (formErrors.capacity ?? undefined) : undefined}
          />
          <TextInput
            label="선호 조건"
            value={conditions}
            onChange={(event) => setConditions(event.target.value)}
          />
          <div className="flex flex-col gap-2">
            <label
              htmlFor={`${fieldId}-description`}
              className="text-[13px] font-medium text-[#26282C]"
            >
              소개 *
            </label>
            <textarea
              id={`${fieldId}-description`}
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-3 py-3 text-[16px] leading-[1.6] text-[#26282C] outline-none focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]"
            />
            {submitted && formErrors.description && (
              <p className="text-[13px] font-medium text-[#C7284B]">
                {formErrors.description}
              </p>
            )}
          </div>
          {contactFound && (
            <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
              전화번호·이메일·메신저 ID 같은 연락처는 모집글에 쓸 수 없습니다.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? "저장 중…" : "수정 저장"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditing(false);
                setSubmitted(false);
                setTitle(post.title);
                setCapacity(String(post.capacity));
                setConditions(post.preferred_conditions ?? "");
                setDescription(post.description);
              }}
            >
              취소
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            수정
          </Button>
          {post.status !== "CLOSED" && (
            <Button
              variant="secondary"
              onClick={() => patch({ close: true }, "마감하지 못했습니다.")}
              disabled={busy}
            >
              모집 마감
            </Button>
          )}
          {confirmDelete ? (
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-medium text-[#C7284B]">
                삭제하면 되돌릴 수 없어요.
              </span>
              <Button onClick={remove} disabled={busy}>
                삭제 확인
              </Button>
              <Button
                variant="secondary"
                onClick={() => setConfirmDelete(false)}
              >
                취소
              </Button>
            </span>
          ) : (
            <Button variant="secondary" onClick={() => setConfirmDelete(true)}>
              삭제
            </Button>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
          오류: {error}
        </p>
      )}

      <div>
        <button
          type="button"
          aria-expanded={showApplications}
          onClick={() => setShowApplications((open) => !open)}
          className="min-h-[44px] rounded-[8px] px-2 text-[14px] font-semibold text-[#26282C] underline hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          {showApplications ? "받은 참가 요청 접기" : "받은 참가 요청 보기"}
        </button>
        {showApplications && (
          <div className="mt-2">
            <ReceivedApplications postId={post.id} />
          </div>
        )}
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// 탭: 내 글
// ---------------------------------------------------------------------------

export function MyPostsTab({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<MatePostRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    createBrowserSupabaseClient()
      .from("mate_post")
      .select("*")
      .eq("author_id", userId)
      .order("created_at", { ascending: false })
      .returns<MatePostRow[]>()
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError || !data) {
          setError("내 모집글을 불러오지 못했습니다.");
          return;
        }
        setError(null);
        setPosts(data);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  return (
    <section aria-labelledby="my-posts-title" className="flex flex-col gap-4">
      <div>
        <h2
          id="my-posts-title"
          className="text-[24px] font-semibold leading-[1.35] text-[#26282C]"
        >
          내 글
        </h2>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4E54]">
          내가 올린 동행 모집글을 수정·마감·삭제하고, 받은 참가 요청을
          승인하거나 거절합니다.
        </p>
      </div>
      {error ? (
        <ErrorBox
          message={error}
          onRetry={() => {
            setError(null);
            setPosts(null);
            setReloadKey((key) => key + 1);
          }}
        />
      ) : posts === null ? (
        <SkeletonList />
      ) : posts.length === 0 ? (
        <div data-testid="my-posts-empty" className={emptyBoxClass}>
          <p className="text-[17px] font-semibold text-[#26282C]">
            아직 올린 모집글이 없습니다
          </p>
          <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
            여행 준비 화면의 &quot;동행 글쓰기&quot; 탭에서 일정과 조건을 적어
            첫 모집글을 올려 보세요.
          </p>
          <Link href="/travel-tools" className={primaryLinkClass}>
            새 모집글 작성
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post) => (
            <MyPostItem
              key={post.id}
              post={post}
              onChanged={(next) =>
                setPosts(
                  (prev) =>
                    prev?.map((item) => (item.id === next.id ? next : item)) ??
                    null,
                )
              }
              onDeleted={(postId) =>
                setPosts(
                  (prev) => prev?.filter((item) => item.id !== postId) ?? null,
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
// 탭: 참가 요청(내가 보낸 요청)
// ---------------------------------------------------------------------------

export function MyApplicationsTab({ userId }: { userId: string }) {
  const [items, setItems] = useState<
    (MateApplicationRow & { postTitle: string | null })[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const supabase = createBrowserSupabaseClient();
        const { data, error: queryError } = await supabase
          .from("mate_application")
          .select("*")
          .eq("applicant_id", userId)
          .order("created_at", { ascending: false })
          .returns<MateApplicationRow[]>();
        if (queryError || !data) {
          if (!cancelled) setError("보낸 참가 요청을 불러오지 못했습니다.");
          return;
        }
        const titles = new Map<string, string>();
        const postIds = data.map((item) => item.post_id);
        if (postIds.length > 0) {
          const { data: posts } = await supabase
            .from("mate_post")
            .select("id, title")
            .in("id", postIds);
          for (const row of posts ?? []) titles.set(row.id, row.title);
        }
        if (cancelled) return;
        setError(null);
        setItems(
          data.map((item) => ({
            ...item,
            postTitle: titles.get(item.post_id) ?? null,
          })),
        );
      } catch {
        if (!cancelled) setError("네트워크 오류로 요청을 불러오지 못했습니다.");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  async function cancel(applicationId: string) {
    setPendingId(applicationId);
    setActionError(null);
    try {
      const response = await fetch(
        `/api/applications/${encodeURIComponent(applicationId)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        setActionError(
          `${await readError(response, "요청을 취소하지 못했습니다.")} 다시 시도해 주세요.`,
        );
        return;
      }
      setItems(
        (prev) => prev?.filter((item) => item.id !== applicationId) ?? null,
      );
    } catch {
      setActionError(
        "네트워크 오류로 취소하지 못했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section
      aria-labelledby="my-applications-title"
      className="flex flex-col gap-4"
    >
      <div>
        <h2
          id="my-applications-title"
          className="text-[24px] font-semibold leading-[1.35] text-[#26282C]"
        >
          참가 요청
        </h2>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4E54]">
          내가 다른 모집글에 보낸 참가 요청과 처리 결과입니다. 검토 중인 요청은
          취소할 수 있어요.
        </p>
      </div>
      {error ? (
        <ErrorBox
          message={error}
          onRetry={() => {
            setError(null);
            setItems(null);
            setReloadKey((key) => key + 1);
          }}
        />
      ) : items === null ? (
        <SkeletonList />
      ) : items.length === 0 ? (
        <div className={emptyBoxClass}>
          <p className="text-[17px] font-semibold text-[#26282C]">
            아직 보낸 참가 요청이 없습니다
          </p>
          <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
            동행 찾기에서 일정이 맞는 모집글을 고르고 소개 메시지와 함께 참가
            요청을 보내 보세요.
          </p>
          <Link href="/mates" className={primaryLinkClass}>
            동행 찾기로 이동
          </Link>
        </div>
      ) : (
        <ul
          data-testid="participation-request-list"
          className="flex flex-col gap-3"
        >
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={APPLICATION_STATUS[item.status].variant}>
                  {APPLICATION_STATUS[item.status].label}
                </Badge>
                <Link
                  href={`/mates?postId=${encodeURIComponent(item.post_id)}`}
                  className="text-[16px] font-semibold text-[#26282C] underline-offset-2 hover:underline"
                >
                  {item.postTitle ?? "삭제되었거나 볼 수 없는 모집글"}
                </Link>
              </div>
              <p className="whitespace-pre-line text-[14px] leading-[1.55] text-[#4B4E54]">
                {item.message}
              </p>
              {item.status === "PENDING" && (
                <div>
                  <Button
                    variant="secondary"
                    onClick={() => cancel(item.id)}
                    disabled={pendingId === item.id}
                  >
                    {pendingId === item.id ? "취소 중…" : "요청 취소"}
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {actionError && (
        <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
          오류: {actionError}
        </p>
      )}
    </section>
  );
}

export default function MyActivityPosts({ userId }: { userId: string }) {
  return (
    <div className="flex flex-col gap-12">
      <MyPostsTab userId={userId} />
      <MyApplicationsTab userId={userId} />
    </div>
  );
}
