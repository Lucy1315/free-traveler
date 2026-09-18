// SCR-005 Member 탭 중 "차단 목록"과 "즐겨찾기". design-reference/UI_CONTRACT.md
// 5장(차단 목록 + 해제 버튼, destination-card 소형), D-001 §9·§14.
// REQ-FUNC-040(차단 해제), REQ-FUNC-068(즐겨찾기 조회·해제).
//
// - 차단 목록은 /api/blocks(RLS: 본인 차단만)로 읽고 해제한다. 상대 닉네임은
//   로그인 사용자에게 열린 user_profile에서 닉네임 열만 읽는다.
// - 즐겨찾기는 서버로 보내지 않는 localStorage(src/lib/favorites.ts) 값이다.
//   메인 화면과 같은 커스텀 이벤트로 변경을 구독한다.

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { createBrowserSupabaseClient } from "@/lib/db/browser";
import type { UserBlockRow } from "@/lib/db/queries";
import { getFavorites, removeFavorite } from "@/lib/favorites";
import { domesticDestinations } from "@/data/destinations.domestic";
import { overseasDestinations } from "@/data/destinations.overseas";

const emptyBoxClass = "rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-6";
const primaryLinkClass =
  "mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]";

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
          className="h-16 animate-pulse rounded-[14px] bg-[#F0EFEC]"
        />
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// 차단 목록
// ---------------------------------------------------------------------------

interface BlockItem extends UserBlockRow {
  nickname: string | null;
}

export function BlocksTab() {
  const [blocks, setBlocks] = useState<BlockItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/blocks");
        const body = (await response.json().catch(() => null)) as {
          blocks?: UserBlockRow[];
        } | null;
        if (!response.ok || !body?.blocks) {
          if (!cancelled) setError("차단 목록을 불러오지 못했습니다.");
          return;
        }
        const nicknames = new Map<string, string>();
        const ids = body.blocks.map((block) => block.blocked_id);
        if (ids.length > 0) {
          const { data } = await createBrowserSupabaseClient()
            .from("user_profile")
            .select("id, nickname")
            .in("id", ids);
          for (const row of data ?? []) nicknames.set(row.id, row.nickname);
        }
        if (cancelled) return;
        setError(null);
        setBlocks(
          body.blocks.map((block) => ({
            ...block,
            nickname: nicknames.get(block.blocked_id) ?? null,
          })),
        );
      } catch {
        if (!cancelled)
          setError("네트워크 오류로 차단 목록을 불러오지 못했습니다.");
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function unblock(blockId: string) {
    setPendingId(blockId);
    setActionError(null);
    try {
      const response = await fetch(
        `/api/blocks?blockId=${encodeURIComponent(blockId)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        setActionError("차단을 해제하지 못했습니다. 다시 시도해 주세요.");
        return;
      }
      setBlocks(
        (prev) => prev?.filter((block) => block.id !== blockId) ?? null,
      );
    } catch {
      setActionError(
        "네트워크 오류로 차단을 해제하지 못했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section aria-labelledby="blocks-title" className="flex flex-col gap-4">
      <div>
        <h2
          id="blocks-title"
          className="text-[24px] font-semibold leading-[1.35] text-[#26282C]"
        >
          차단 목록
        </h2>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4E54]">
          차단한 사용자의 모집글은 동행 찾기 목록에 보이지 않습니다. 해제하면
          다시 볼 수 있어요.
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
                setBlocks(null);
                setReloadKey((key) => key + 1);
              }}
            >
              다시 시도
            </Button>
          </div>
        </div>
      ) : blocks === null ? (
        <SkeletonList />
      ) : blocks.length === 0 ? (
        <div data-testid="blocks-empty" className={emptyBoxClass}>
          <p className="text-[17px] font-semibold text-[#26282C]">
            아직 차단한 사용자가 없습니다
          </p>
          <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
            동행 찾기에서 불편한 사용자를 만나면 모집글 상세의 &quot;작성자
            차단&quot;으로 목록에서 숨길 수 있어요.
          </p>
          <Link href="/mates" className={primaryLinkClass}>
            동행 찾기로 이동
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {blocks.map((block) => (
            <li
              key={block.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-4"
            >
              <div>
                <p className="text-[16px] font-semibold text-[#26282C]">
                  {block.nickname ?? "알 수 없는 사용자"}
                </p>
                <p className="text-[13px] text-[#84878D]">
                  {new Date(block.created_at).toLocaleDateString("ko-KR")} 차단
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => unblock(block.id)}
                disabled={pendingId === block.id}
              >
                {pendingId === block.id ? "해제 중…" : "차단 해제"}
              </Button>
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

// ---------------------------------------------------------------------------
// 즐겨찾기
// ---------------------------------------------------------------------------

// 메인 화면(SCR-001)의 즐겨찾기 토글과 같은 이벤트 이름.
const FAVORITES_CHANGED_EVENT = "free-traveler:favorites-changed";

function subscribeFavorites(onStoreChange: () => void) {
  window.addEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

const ALL_DESTINATIONS = [
  ...domesticDestinations.map((destination) => ({
    id: destination.id,
    name: destination.name,
    meta: destination.region,
    image: destination.image,
  })),
  ...overseasDestinations.map((destination) => ({
    id: destination.id,
    name: destination.name,
    meta: destination.country,
    image: destination.image,
  })),
];

export function FavoritesTab() {
  const snapshot = useSyncExternalStore(
    subscribeFavorites,
    () => getFavorites().join(","),
    () => "",
  );
  const favoriteIds = snapshot ? snapshot.split(",") : [];
  const favorites = favoriteIds
    .map((id) => ALL_DESTINATIONS.find((destination) => destination.id === id))
    .filter((destination) => destination !== undefined);

  function remove(id: string) {
    removeFavorite(id);
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  }

  return (
    <section aria-labelledby="favorites-title" className="flex flex-col gap-4">
      <div>
        <h2
          id="favorites-title"
          className="text-[24px] font-semibold leading-[1.35] text-[#26282C]"
        >
          즐겨찾기
        </h2>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4E54]">
          하트로 저장한 여행지입니다. 이 브라우저에만 저장되며 서버로 보내지
          않습니다.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div data-testid="favorites-empty" className={emptyBoxClass}>
          <p className="text-[17px] font-semibold text-[#26282C]">
            아직 즐겨찾기한 여행지가 없습니다
          </p>
          <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
            메인 화면의 여행지 카드에서 하트를 누르면 여기에 모아 볼 수 있어요.
          </p>
          <Link href="/#domestic-destinations" className={primaryLinkClass}>
            여행지 둘러보기
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((destination) => (
            <li
              key={destination.id}
              className="overflow-hidden rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF]"
            >
              <Link
                href={`/?destinationId=${encodeURIComponent(destination.id)}`}
                className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={destination.image.url}
                  alt={destination.image.alt}
                  title={destination.image.credit}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-3">
                  <p className="text-[17px] font-semibold text-[#26282C]">
                    {destination.name}
                  </p>
                  <p className="text-[14px] text-[#84878D]">
                    {destination.meta}
                  </p>
                </div>
              </Link>
              <div className="px-3 pb-3">
                <button
                  type="button"
                  onClick={() => remove(destination.id)}
                  className="min-h-[44px] rounded-[8px] px-2 text-[14px] font-semibold text-[#26282C] underline hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                >
                  즐겨찾기 해제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function BlocksFavoritesTab() {
  return (
    <div className="flex flex-col gap-12">
      <BlocksTab />
      <FavoritesTab />
    </div>
  );
}
