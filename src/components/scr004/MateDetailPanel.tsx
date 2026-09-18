// SCR-004 동행 상세. Desktop은 목록 옆 분할 패널(좌 40 : 우 60), Mobile은
// 하단 바텀시트 Drawer로 보여준다. design-reference/D-001/DESIGN.md §11(Mate
// Post Card — 연락처·가격·별점 금지)·§12(Drawer·Modal), UI_CONTRACT.md 4장.
// REQ-FUNC-033: 작성자·상태·조건·설명을 보여주되 이메일·외부 연락처는 노출하지
// 않는다 — 본문에 연락처 패턴이 섞여 있어도 화면에는 가려서 보여준다(작성 폼의
// 클라이언트 차단만으로는 API 직접 호출을 막을 수 없으므로 표시 단계에서 한 번 더).
//
// 참가 요청 폼·신고·차단 버튼은 다른 Task(CMP-SCR004-PARTICIPATION-REQUEST·
// REPORT-BLOCK-ACTIONS)가 만들므로 `actions` 슬롯으로 받아 상세 하단에 둔다.

"use client";

import { useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Chip from "@/components/ui/Chip";
import Drawer from "@/components/ui/Drawer";
import type { MatePostRow, MatePostStatus } from "@/lib/db/queries";
import { shareUrl } from "@/lib/share";

/** /api/mates 응답 형태(조회 시 종료일 경과를 반영한 effectiveStatus 포함). */
export type MatePostView = MatePostRow & { effectiveStatus: MatePostStatus };

export interface MateDetailPanelProps {
  /** 선택된 모집글. null이면 Desktop은 안내, Mobile은 Drawer를 닫는다. */
  post: MatePostView | null;
  /**
   * 작성자 닉네임. user_profile은 로그인 사용자만 조회할 수 있어(RLS) 비로그인
   * 상태에서는 null일 수 있다.
   */
  authorNickname?: string | null;
  /** Mobile Drawer 닫기(배경·Esc·닫기 버튼). Desktop 패널에는 쓰지 않는다. */
  onClose: () => void;
  /** 참가 요청·신고·차단 영역(다른 Component Task 산출물). */
  actions?: ReactNode;
}

// D-001 §5 브레이크포인트 md(768px) 이상을 Desktop 분할 패널로 본다.
const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

// REQ-FUNC-033: 표시 직전에 연락처로 보이는 부분을 가린다. 패턴은 작성 폼의
// 탐지 규칙(MateWriteForm의 detectContactInfo)과 같은 기준을 쓴다.
const CONTACT_MASK_PATTERNS: RegExp[] = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  /(?:\+82[\s.-]?1\d|\+82[\s.-]?0?[2-6]\d?|0\d{1,2})[\s.-]?\d{3,4}[\s.-]?\d{4}/g,
  /01[016789]\d{7,8}(?!\d)/g,
  /(?:카카오톡|카톡|kakao(?:talk)?|라인|\bline\b|텔레그램|telegram|위챗|wechat|인스타(?:그램)?|instagram|디엠|\bdm\b)\s*(?:아이디|id)?\s*[:：]?\s*@?[A-Za-z0-9._-]{3,}/gi,
  /open\.kakao\.com\/\S+/gi,
];
const CONTACT_MASK_LABEL = "[연락처 비공개]";

export function maskContactInfo(text: string): string {
  return CONTACT_MASK_PATTERNS.reduce(
    (masked, pattern) => masked.replace(pattern, CONTACT_MASK_LABEL),
    text,
  );
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${year}.${month}.${day}`;
}

function MateDetailContent({
  post,
  authorNickname,
  actions,
}: {
  post: MatePostView;
  authorNickname?: string | null;
  actions?: ReactNode;
}) {
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const isRecruiting = post.effectiveStatus === "RECRUITING";
  const location = post.region
    ? `${post.country} · ${post.region}`
    : post.country;

  async function handleShare() {
    const outcome = await shareUrl({
      title: post.title,
      text: `${location} 동행 모집글`,
      url: `${window.location.origin}/mates?postId=${encodeURIComponent(post.id)}`,
    });
    if (outcome.method === "clipboard") {
      setShareMessage("링크를 복사했습니다.");
    } else if (outcome.method === "failed") {
      setShareMessage(outcome.message);
    } else {
      setShareMessage(null);
    }
  }

  return (
    <article data-testid="mate-detail" className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isRecruiting ? "success" : "neutral"}>
            {isRecruiting ? "모집중" : "마감"}
          </Badge>
          <p className="text-[14px] text-[#84878D]">
            {location} · {formatDate(post.start_date)}~
            {formatDate(post.end_date)}
          </p>
        </div>
        <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
          {post.title}
        </h2>
        <p className="text-[14px] text-[#4B4E54]">
          작성자{" "}
          <span className="font-semibold text-[#26282C]">
            {authorNickname ?? "로그인 후 닉네임을 확인할 수 있어요"}
          </span>
        </p>
      </header>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[14px] text-[#4B4E54]">
        <dt className="font-medium text-[#26282C]">여행 기간</dt>
        <dd>
          {formatDate(post.start_date)} ~ {formatDate(post.end_date)}
        </dd>
        <dt className="font-medium text-[#26282C]">모집 인원</dt>
        <dd>{post.capacity}명</dd>
        {post.preferred_conditions && (
          <>
            <dt className="font-medium text-[#26282C]">선호 조건</dt>
            <dd>{maskContactInfo(post.preferred_conditions)}</dd>
          </>
        )}
      </dl>

      {post.travel_style.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="여행 스타일">
          {post.travel_style.map((style) => (
            <li key={style}>
              <Chip>{style}</Chip>
            </li>
          ))}
        </ul>
      )}

      <section>
        <h3 className="text-[17px] font-semibold text-[#26282C]">
          여행 계획과 소개
        </h3>
        <p className="mt-2 whitespace-pre-line text-[16px] leading-[1.6] text-[#4B4E54]">
          {maskContactInfo(post.description)}
        </p>
      </section>

      <p className="rounded-[14px] bg-[#F7F6F4] p-4 text-[14px] leading-[1.55] text-[#4B4E54]">
        연락처는 공개하지 않습니다. 참가 요청이 승인되면 계정 화면에서 함께
        일정을 조율하고, 첫 만남은 공개된 장소에서 가지세요.
      </p>

      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-5 text-[16px] font-semibold text-[#26282C] hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          공유하기
        </button>
        {shareMessage && (
          <p role="status" className="text-[13px] text-[#4B4E54]">
            {shareMessage}
          </p>
        )}
      </div>

      {actions}
    </article>
  );
}

export default function MateDetailPanel({
  post,
  authorNickname,
  onClose,
  actions,
}: MateDetailPanelProps) {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <Drawer open={post !== null} onClose={onClose} title="동행 상세">
        {post && (
          <MateDetailContent
            key={post.id}
            post={post}
            authorNickname={authorNickname}
            actions={actions}
          />
        )}
      </Drawer>
    );
  }

  return (
    <aside
      aria-label="동행 상세"
      className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-6"
    >
      {post ? (
        <MateDetailContent
          key={post.id}
          post={post}
          authorNickname={authorNickname}
          actions={actions}
        />
      ) : (
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-[20px] font-semibold text-[#26282C]">
            동행글을 선택해 주세요
          </h2>
          <p className="text-[16px] leading-[1.6] text-[#4B4E54]">
            왼쪽 목록에서 모집글을 누르면 일정·조건·소개를 여기에서 바로 확인할
            수 있습니다. 원하는 동행이 없다면 직접 모집글을 올려 보세요.
          </p>
          <Link
            href="/travel-tools"
            className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            새 모집글 작성
          </Link>
        </div>
      )}
    </aside>
  );
}

/**
 * Desktop 좌 40 : 우 60 분할 레이아웃(D-001 §12, UI_CONTRACT 4장 4번 영역).
 * Mobile에서는 목록만 1열로 보이고 상세는 MateDetailPanel의 Drawer로 뜬다.
 */
export function MateSplitLayout({
  list,
  detail,
}: {
  list: ReactNode;
  detail: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_3fr] md:items-start">
      <div>{list}</div>
      <div className="md:sticky md:top-20">{detail}</div>
    </div>
  );
}
