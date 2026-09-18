// SCR-004 동행 조회 Page Owner(`/mates`). design-reference/D-001/DESIGN.md
// §17(SCR-004 6 Section), UI_CONTRACT.md 4장. REQ-FUNC-030·033·034·035·037·
// 039·040, REQ-NF-019.
//
// Depends On의 CMP-SCR004-* 산출물을 조립한다(새 Component 파일 없음):
// Intro+CTA → Filter+결과 요약 → Card Grid(8개 우선) → 목록+상세 분할(Desktop)
// / 바텀시트 Drawer(Mobile) → 동행 신청 3단계 안내 → 안전·신고·차단 안내+CTA.
//
// - 필터·선택·차단 상태를 한 곳에서 관리해야 해서 페이지 자체를 Client
//   Component로 둔다. 제목·설명 메타데이터는 같은 폴더의 layout.tsx가 맡는다.
// - 카드를 고르기 전에는 Card Grid를 전체 폭(3~4열)으로, 고르면 목록 40 :
//   상세 60 분할로 전환한다(Visual AC 3~4열과 분할 패널 규칙을 함께 충족).
// - 목록·상세 열람은 Public. 로그인하면 차단 목록(/api/blocks)과 작성자 프로필
//   (닉네임·연령대·성별 — RLS상 로그인 사용자만 조회 가능)을 추가로 불러온다.

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import IntroCta from "@/components/scr004/IntroCta";
import FilterSummary, {
  applyMateFilters,
  EMPTY_MATE_FILTER,
  isMateFilterEmpty,
  type MateAuthorProfile,
  type MateFilterValue,
} from "@/components/scr004/FilterSummary";
import MateCardGrid from "@/components/scr004/MateCardGrid";
import MateDetailPanel, {
  MateSplitLayout,
  type MatePostView,
} from "@/components/scr004/MateDetailPanel";
import ParticipationRequestForm from "@/components/scr004/ParticipationRequestForm";
import ReportBlockActions from "@/components/scr004/ReportBlockActions";
import type { LocationOption } from "@/components/scr003/FlightForm";
import { ToastProvider } from "@/components/ui/Toast";
import { domesticDestinations } from "@/data/destinations.domestic";
import { overseasDestinations } from "@/data/destinations.overseas";
import { createBrowserSupabaseClient } from "@/lib/db/browser";
import type { UserBlockRow } from "@/lib/db/queries";

// 필터 드롭다운용 국가·지역 목록(SCR-003과 같은 정적 여행지 데이터 기준).
function buildLocations(): LocationOption[] {
  const overseasByCountry = new Map<string, string[]>();
  for (const destination of overseasDestinations) {
    const regions = overseasByCountry.get(destination.country) ?? [];
    regions.push(destination.name);
    overseasByCountry.set(destination.country, regions);
  }
  return [
    {
      country: "대한민국",
      regions: domesticDestinations.map((destination) => destination.name),
    },
    ...Array.from(overseasByCountry, ([country, regions]) => ({
      country,
      regions,
    })),
  ];
}

const APPLY_STEPS = [
  {
    title: "모집글 살펴보기",
    description:
      "필터로 여행지·기간·스타일이 맞는 모집글을 찾고 일정과 조건을 확인해요.",
  },
  {
    title: "참가 요청 보내기",
    description:
      "로그인 후 500자 이내의 소개 메시지를 보내요. 메시지는 작성자만 볼 수 있어요.",
  },
  {
    title: "승인 후 일정 조율",
    description:
      "작성자가 승인하면 계정 화면의 내 활동에서 결과를 확인하고 일정을 맞춰요.",
  },
] as const;

interface ViewerData {
  signedIn: boolean;
  /** 차단한 사용자 id → 차단 기록 id. */
  blocks: Map<string, string>;
  profiles: Map<string, MateAuthorProfile & { nickname: string }>;
}

const GUEST_VIEWER: ViewerData = {
  signedIn: false,
  blocks: new Map(),
  profiles: new Map(),
};

export default function MatesPage() {
  const locations = useMemo(() => buildLocations(), []);
  const [posts, setPosts] = useState<MatePostView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useState<MateFilterValue>(EMPTY_MATE_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewer, setViewer] = useState<ViewerData>(GUEST_VIEWER);

  // 모집글 목록(Public). 공유 링크(/mates?postId=)로 들어오면 그 글을 연다.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/mates")
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as {
          posts?: MatePostView[];
          error?: string;
        } | null;
        if (cancelled) return;
        if (!response.ok || !body?.posts) {
          // 서버 오류 원문(DB 메시지 등)은 사용자에게 보여주지 않는다.
          setLoadError("잠시 후 다시 시도해 주세요.");
          setPosts([]);
          return;
        }
        setLoadError(null);
        setPosts(body.posts);
        const sharedId = new URLSearchParams(window.location.search).get(
          "postId",
        );
        if (sharedId && body.posts.some((post) => post.id === sharedId)) {
          setSelectedId(sharedId);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("네트워크 연결을 확인해 주세요.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // 로그인 사용자 전용 데이터: 차단 목록 + 작성자 프로필(필터·닉네임용).
  const authorIdsKey = useMemo(
    () => Array.from(new Set(posts.map((post) => post.author_id))).join(","),
    [posts],
  );
  useEffect(() => {
    let cancelled = false;
    async function loadViewer() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const blocksResponse = await fetch("/api/blocks");
        const blocksBody = blocksResponse.ok
          ? ((await blocksResponse.json()) as { blocks: UserBlockRow[] })
          : { blocks: [] };

        const profiles = new Map<
          string,
          MateAuthorProfile & { nickname: string }
        >();
        const authorIds = authorIdsKey ? authorIdsKey.split(",") : [];
        if (authorIds.length > 0) {
          // 연락처·성인 확인 여부 등은 가져오지 않고 필요한 열만 고른다.
          const { data } = await supabase
            .from("user_profile")
            .select("id, nickname, age_range, gender")
            .in("id", authorIds);
          for (const row of data ?? []) {
            profiles.set(row.id, {
              nickname: row.nickname,
              age_range: row.age_range,
              gender: row.gender,
            });
          }
        }

        if (cancelled) return;
        setViewer({
          signedIn: true,
          blocks: new Map(
            blocksBody.blocks.map((block) => [block.blocked_id, block.id]),
          ),
          profiles,
        });
      } catch {
        // Supabase 설정이 없거나 세션 확인에 실패하면 비로그인으로 본다.
      }
    }
    void loadViewer();
    return () => {
      cancelled = true;
    };
  }, [authorIdsKey]);

  const blockedUserIds = useMemo(
    () => Array.from(viewer.blocks.keys()),
    [viewer.blocks],
  );
  // 차단한 사용자의 글은 필터와 관계없이 제외한다(전체 건수에도 넣지 않음).
  const visiblePosts = useMemo(
    () => applyMateFilters(posts, EMPTY_MATE_FILTER, { blockedUserIds }),
    [posts, blockedUserIds],
  );
  const filteredPosts = useMemo(
    () =>
      applyMateFilters(visiblePosts, filter, {
        authorProfiles: viewer.signedIn ? viewer.profiles : undefined,
      }),
    [visiblePosts, filter, viewer],
  );
  const selectedPost =
    filteredPosts.find((post) => post.id === selectedId) ?? null;

  const handleBlockChange = useCallback(
    (authorId: string, blockId: string | null) => {
      setViewer((prev) => {
        const blocks = new Map(prev.blocks);
        if (blockId) {
          blocks.set(authorId, blockId);
        } else {
          blocks.delete(authorId);
        }
        return { ...prev, blocks };
      });
      if (blockId) setSelectedId(null);
    },
    [],
  );

  const resetFilters = () => setFilter(EMPTY_MATE_FILTER);
  const grid = (
    <MateCardGrid
      key={JSON.stringify(filter)}
      posts={filteredPosts}
      loading={loading}
      error={loadError}
      onRetry={() => {
        setLoading(true);
        setReloadKey((key) => key + 1);
      }}
      selectedId={selectedPost?.id ?? null}
      onSelect={setSelectedId}
      filtered={!isMateFilterEmpty(filter)}
      onResetFilters={resetFilters}
      layout={selectedPost ? "split" : "full"}
    />
  );
  const detail = (
    <MateDetailPanel
      post={selectedPost}
      authorNickname={
        selectedPost
          ? (viewer.profiles.get(selectedPost.author_id)?.nickname ?? null)
          : null
      }
      onClose={() => setSelectedId(null)}
      actions={
        selectedPost && (
          <>
            <ParticipationRequestForm
              postId={selectedPost.id}
              authorId={selectedPost.author_id}
              postStatus={selectedPost.effectiveStatus}
            />
            <ReportBlockActions
              postId={selectedPost.id}
              authorId={selectedPost.author_id}
              blockId={viewer.blocks.get(selectedPost.author_id) ?? null}
              onBlockChange={(blockId) =>
                handleBlockChange(selectedPost.author_id, blockId)
              }
            />
          </>
        )
      }
    />
  );

  return (
    <ToastProvider>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4 py-12 md:gap-20 md:px-8 md:py-20">
        {/* 1. Intro + 새 모집글 작성 CTA */}
        <IntroCta />

        <div className="flex flex-col gap-8">
          {/* 2. Filter + 결과 요약 */}
          <FilterSummary
            value={filter}
            onChange={(next) => {
              setFilter(next);
              setSelectedId(null);
            }}
            resultCount={filteredPosts.length}
            totalCount={visiblePosts.length}
            locations={locations}
            profileFilterAvailable={viewer.signedIn}
          />

          {/* 3·4. Card Grid(8개 우선) + 목록·상세 분할(Desktop) / Drawer(Mobile).
              선택 전에는 Card Grid만 전체 폭으로 보여준다. */}
          {selectedPost ? (
            <MateSplitLayout list={grid} detail={detail} />
          ) : (
            grid
          )}
        </div>

        {/* 5. 동행 신청 방법 3단계 */}
        <section>
          <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
            동행 신청은 이렇게 해요
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
            연락처를 주고받지 않고도 서비스 안에서 참가 요청과 승인을 진행할 수
            있어요.
          </p>
          <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {APPLY_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
              >
                <p className="text-[13px] font-medium text-[#84878D]">
                  {index + 1}단계
                </p>
                <p className="mt-1 text-[17px] font-semibold text-[#26282C]">
                  {step.title}
                </p>
                <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* 6. 안전·신고·차단 안내 + /travel-tools CTA */}
      <section className="w-full bg-[#F7F6F4]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
              안전하게 함께 떠나세요
            </h2>
            <ul className="mt-2 flex max-w-2xl list-disc flex-col gap-1 pl-5 text-[16px] leading-[1.6] text-[#4B4E54]">
              <li>
                연락처·송금 요구 등 이상한 요청은 상세 화면에서 신고하세요.
              </li>
              <li>
                불편한 사용자는 차단하면 그 사용자의 모집글이 목록에서 사라져요.
              </li>
              <li>
                첫 만남은 공개된 장소에서 가지고 일정을 가족에게 공유하세요.
              </li>
            </ul>
          </div>
          <Link
            href="/travel-tools"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            여행 조건 다시 정리하기
          </Link>
        </div>
      </section>
    </ToastProvider>
  );
}
