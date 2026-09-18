// 최근 동행글 카드 3개. SCR-001(`/`). design-reference/D-001/DESIGN.md
// §11(Mate Post Card), UI_CONTRACT.md 1장 기준. REQ-FUNC-069.
//
// 작성자 연락처(이메일·전화번호·메신저 ID)는 mate_post 테이블 자체에
// 없어 카드·상세 어디에도 노출되지 않는다(Forbidden 절, D-001 §11).

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { shareUrl } from "@/lib/share";

interface MatePostSummary {
  id: string;
  title: string;
  country: string;
  region: string | null;
  capacity: number;
  travel_style: string[];
  effectiveStatus: "RECRUITING" | "CLOSED";
}

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; posts: MatePostSummary[] };

export default function RecentMateCards() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/mates?status=RECRUITING")
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to load mate posts");
        }
        return response.json() as Promise<{ posts: MatePostSummary[] }>;
      })
      .then((data) => {
        if (!cancelled) {
          setState({ status: "success", posts: data.posts.slice(0, 3) });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleShare(post: MatePostSummary) {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/mates?postId=${post.id}`
        : `/mates?postId=${post.id}`;
    void shareUrl({ title: post.title, url });
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
            최근 동행 모집글
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
            지금 모집 중인 동행 글을 확인해 보세요.
          </p>
        </div>
        <Link
          href="/mates"
          className="text-[14px] font-semibold text-[#26282C] underline"
        >
          동행 찾기 전체 보기
        </Link>
      </div>

      {state.status === "loading" && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-[14px] bg-[#F0EFEC]"
            />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div className="mt-8 rounded-[14px] bg-[#F7F6F4] p-6 text-center">
          <p className="text-[16px] leading-[1.6] text-[#4B4E54]">
            최근 동행 모집글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
      )}

      {state.status === "success" && state.posts.length === 0 && (
        // 완성형 Empty(D-001 §18): 문장 + 이용 방법 + 다음 행동 CTA.
        <div className="mt-8 rounded-[14px] bg-[#F7F6F4] p-6 text-center">
          <p className="text-[16px] leading-[1.6] text-[#4B4E54]">
            아직 모집 중인 동행 글이 없습니다. 여행 준비에서 동행 모집글을
            작성하면 여기에 가장 먼저 표시됩니다.
          </p>
          <Link
            href="/travel-tools"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F]"
          >
            동행 모집글 작성하기
          </Link>
        </div>
      )}

      {state.status === "success" && state.posts.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {state.posts.map((post) => (
            <div
              key={post.id}
              className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[17px] font-semibold text-[#26282C]">
                  {post.title}
                </p>
                <Badge
                  variant={
                    post.effectiveStatus === "RECRUITING"
                      ? "success"
                      : "neutral"
                  }
                >
                  {post.effectiveStatus === "RECRUITING" ? "모집중" : "마감"}
                </Badge>
              </div>
              <p className="mt-1 text-[14px] text-[#84878D]">
                {post.country}
                {post.region ? ` · ${post.region}` : ""} · 최대 {post.capacity}
                명
              </p>
              {post.travel_style.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.travel_style.slice(0, 2).map((style) => (
                    <span
                      key={style}
                      className="rounded-full bg-[#F0EFEC] px-2 py-0.5 text-[13px] text-[#26282C]"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/mates?postId=${post.id}`}
                  className="text-[14px] font-semibold text-[#26282C] underline"
                >
                  자세히 보기
                </Link>
                <button
                  type="button"
                  onClick={() => handleShare(post)}
                  className="text-[14px] font-semibold text-[#4B4E54] underline"
                >
                  공유
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
