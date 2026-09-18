// SCR-004 동행글 Card Grid. design-reference/D-001/DESIGN.md §11(Mate Post
// Card — 제목 → 국가/지역·기간 → 상태 배지 → 스타일 Chip 1~2개, 가격·별점·
// 연락처 없음, 최대 8개 우선 노출)·§14(Empty State), UI_CONTRACT.md 4장 3번 영역.
// REQ-FUNC-033(연락처 미노출), REQ-FUNC-037(조회 시 종료일 계산).
//
// 상태: Loading(스켈레톤) · Success · Empty(필터 초기화 + 글 작성 CTA + 이용
// 방법) · Error(재시도). 카드 선택 시 onSelect로 상세 패널(MateDetailPanel)을 연다.

"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { MatePostRow, MatePostStatus } from "@/lib/db/queries";
import { useLocalToday } from "@/components/scr003/FlightForm";

/** D-001 §11: 데이터가 있으면 카드 최대 8개를 우선 노출한다. */
export const MATE_CARD_PAGE_SIZE = 8;

type CardPost = Pick<
  MatePostRow,
  | "id"
  | "title"
  | "country"
  | "region"
  | "start_date"
  | "end_date"
  | "travel_style"
  | "status"
>;

/**
 * REQ-FUNC-037(방식 변경: 조회 시 계산): 수동 마감이거나 여행 종료일이 지났으면
 * CLOSED다. today는 로컬 날짜(YYYY-MM-DD) — 종료일 "다음 날"부터 마감으로 본다.
 */
export function getEffectiveMateStatus(
  post: Pick<MatePostRow, "status" | "end_date">,
  today: string,
): MatePostStatus {
  return post.status === "CLOSED" || post.end_date < today
    ? "CLOSED"
    : "RECRUITING";
}

function formatDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-");
  return `${Number(month)}.${Number(day)}`;
}

export interface MateCardGridProps {
  posts: readonly CardPost[];
  loading?: boolean;
  /** 목록 조회 실패 메시지. 있으면 오류 + 재시도를 보여준다. */
  error?: string | null;
  onRetry?: () => void;
  selectedId?: string | null;
  onSelect: (postId: string) => void;
  /** 필터가 적용돼 있는지(0건일 때 "필터 초기화"를 보여줄지). */
  filtered?: boolean;
  onResetFilters?: () => void;
  /**
   * "full": 목록만 쓰는 폭(Desktop 3~4열, UI_CONTRACT 4장).
   * "split": Desktop 좌 40% 분할 패널 안(좁은 폭이라 1~2열).
   */
  layout?: "full" | "split";
}

const GRID_CLASS: Record<"full" | "split", string> = {
  full: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  split: "grid grid-cols-1 gap-4 xl:grid-cols-2",
};

function MateCardSkeleton() {
  return (
    <li
      aria-hidden="true"
      className="flex animate-pulse flex-col gap-3 rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
    >
      <div className="h-5 w-3/4 rounded-[8px] bg-[#F0EFEC]" />
      <div className="h-4 w-1/2 rounded-[8px] bg-[#F0EFEC]" />
      <div className="h-7 w-16 rounded-full bg-[#F0EFEC]" />
    </li>
  );
}

export default function MateCardGrid({
  posts,
  loading = false,
  error = null,
  onRetry,
  selectedId = null,
  onSelect,
  filtered = false,
  onResetFilters,
  layout = "full",
}: MateCardGridProps) {
  const [visibleCount, setVisibleCount] = useState(MATE_CARD_PAGE_SIZE);
  // 사용자 로컬 날짜로 계산한다(서버 빌드 날짜에 고정되지 않도록 — 서버
  // 스냅샷은 빈 문자열이라 하이드레이션 후 실제 날짜로 다시 계산된다).
  const today = useLocalToday();

  if (loading) {
    return (
      <ul
        aria-busy="true"
        aria-label="동행글을 불러오는 중"
        className={GRID_CLASS[layout]}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <MateCardSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-[14px] border-2 border-[#C7284B] bg-[#FFFFFF] p-5"
      >
        <p className="text-[16px] font-medium text-[#C7284B]">
          동행글을 불러오지 못했습니다. {error}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-5 text-[16px] font-semibold text-[#26282C] hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        data-testid="mate-empty"
        className="flex flex-col items-start gap-4 rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-6"
      >
        <h3 className="text-[20px] font-semibold text-[#26282C]">
          {filtered
            ? "조건에 맞는 동행글이 없어요"
            : "아직 올라온 동행글이 없어요"}
        </h3>
        <p className="text-[16px] leading-[1.6] text-[#4B4E54]">
          {filtered
            ? "기간을 넓히거나 국가·스타일 조건을 줄이면 더 많은 모집글을 볼 수 있어요."
            : "가고 싶은 여행지와 일정을 정리해 첫 모집글을 올려 보세요."}
        </p>
        <ol className="flex list-decimal flex-col gap-1 pl-5 text-[14px] leading-[1.55] text-[#4B4E54]">
          <li>
            여행 준비 화면의 &quot;동행 글쓰기&quot; 탭에서 일정과 조건을
            적어요.
          </li>
          <li>안전수칙에 동의하고 모집글을 올려요.</li>
          <li>참가 요청이 오면 계정 화면에서 승인하거나 거절해요.</li>
        </ol>
        <div className="flex flex-wrap gap-3">
          {filtered && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-5 text-[16px] font-semibold text-[#26282C] hover:bg-[#F0EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              필터 초기화
            </button>
          )}
          <Link
            href="/travel-tools"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            새 모집글 작성
          </Link>
        </div>
      </div>
    );
  }

  const visiblePosts = posts.slice(0, visibleCount);
  const remaining = posts.length - visiblePosts.length;

  return (
    <div className="flex flex-col gap-4">
      <ul className={GRID_CLASS[layout]}>
        {visiblePosts.map((post) => {
          const status = getEffectiveMateStatus(post, today);
          const isSelected = post.id === selectedId;
          const location = post.region
            ? `${post.country} · ${post.region}`
            : post.country;
          return (
            <li key={post.id}>
              <button
                type="button"
                data-testid="mate-card"
                aria-pressed={isSelected}
                onClick={() => onSelect(post.id)}
                className={`flex h-full w-full flex-col items-start gap-2 rounded-[14px] border bg-[#FFFFFF] p-5 text-left transition-shadow hover:shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${isSelected ? "border-2 border-[#26282C]" : "border-[#E3E2DF]"}`}
              >
                <span className="text-[17px] font-semibold leading-[1.4] text-[#26282C]">
                  {post.title}
                </span>
                <span className="text-[14px] text-[#4B4E54]">
                  {location} · {formatDate(post.start_date)}~
                  {formatDate(post.end_date)}
                </span>
                <Badge
                  variant={status === "RECRUITING" ? "success" : "neutral"}
                >
                  {status === "RECRUITING" ? "모집중" : "마감"}
                </Badge>
                {post.travel_style.length > 0 && (
                  <span className="flex flex-wrap gap-2">
                    {post.travel_style.slice(0, 2).map((style) => (
                      <span
                        key={style}
                        className="rounded-full bg-[#F0EFEC] px-3 py-1 text-[13px] font-medium text-[#26282C]"
                      >
                        {style}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() =>
            setVisibleCount((count) => count + MATE_CARD_PAGE_SIZE)
          }
          className="inline-flex min-h-[44px] items-center justify-center self-center rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-5 text-[16px] font-semibold text-[#26282C] hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          동행글 더 보기 ({remaining}개 남음)
        </button>
      )}
    </div>
  );
}
