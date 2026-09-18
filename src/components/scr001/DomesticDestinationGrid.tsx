// 국내 여행지 카드 목록(필터 포함). SCR-001(`/`). design-reference/D-001/
// DESIGN.md §8(Search·Filter)·§9(Destination Card), UI_CONTRACT.md 1장 기준.
// REQ-FUNC-001·002·005·007(축소)·010.
//
// 범위 참고: REQ-FUNC-002가 요구하는 "국가·도시·계절·테마·권장 기간" 필터 중
// "국가"는 국내 탭에서는 의미가 없어(전부 대한민국) 생략했다. "권장 기간"도
// domesticDestinations(DATA-DESTINATIONS-DOMESTIC)에 구조화된 기간 필드가
// 없어(1일/3일 코스는 예시 일정일 뿐 "권장 기간" 속성이 아님) 구현하지
// 못했다 — 데이터 스키마에 필드를 추가해야 하는 별도 범위다. 대신 실제
// 데이터가 가진 지역(도시)·테마·계절(추천 시기 텍스트 매칭) 필터를 구현한다.

"use client";

import { useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Chip from "@/components/ui/Chip";
import { domesticDestinations } from "@/data/destinations.domestic";
import { getFavorites, toggleFavorite } from "@/lib/favorites";

const SEASONS = ["봄", "여름", "가을", "겨울"] as const;

// localStorage는 React state가 아니라 외부 저장소이므로, 마운트 시
// setState를 직접 호출하는 대신 useSyncExternalStore로 구독한다(같은 탭
// 안에서의 변경은 storage 이벤트가 발생하지 않아, 토글할 때 커스텀
// 이벤트를 직접 dispatch해 구독자에게 알린다).
const FAVORITES_CHANGED_EVENT = "free-traveler:favorites-changed";

function subscribeFavorites(onStoreChange: () => void) {
  window.addEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(FAVORITES_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getFavoritesSnapshot() {
  return getFavorites().join(",");
}

function getFavoritesServerSnapshot() {
  return "";
}

function handleToggleFavorite(destinationId: string) {
  toggleFavorite(destinationId);
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

export interface DomesticDestinationGridProps {
  onSelectDestination: (destinationId: string) => void;
}

export default function DomesticDestinationGrid({
  onSelectDestination,
}: DomesticDestinationGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const region = searchParams.get("domesticRegion") ?? "";
  const theme = searchParams.get("domesticTheme") ?? "";
  const season = searchParams.get("domesticSeason") ?? "";

  const favoritesSnapshot = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot,
  );
  const favoriteIds = favoritesSnapshot ? favoritesSnapshot.split(",") : [];

  const regionOptions = useMemo(
    () => Array.from(new Set(domesticDestinations.map((d) => d.region))),
    [],
  );
  const themeOptions = useMemo(
    () => Array.from(new Set(domesticDestinations.map((d) => d.theme))),
    [],
  );

  // REQ-FUNC-010: 필터 상태를 URL query에 반영한다.
  function setFilter(
    key: "domesticRegion" | "domesticTheme" | "domesticSeason",
    value: string,
  ) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleFilter(
    key: "domesticRegion" | "domesticTheme" | "domesticSeason",
    current: string,
    value: string,
  ) {
    setFilter(key, current === value ? "" : value);
  }

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("domesticRegion");
    params.delete("domesticTheme");
    params.delete("domesticSeason");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // D-001 §8: 필터는 항상 AND 조건으로 적용한다.
  const filtered = domesticDestinations.filter((destination) => {
    if (region && destination.region !== region) return false;
    if (theme && destination.theme !== theme) return false;
    if (season && !destination.bestSeason.includes(season)) return false;
    return true;
  });

  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        국내 여행지
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        가까운 국내 여행지를 지역·테마·계절로 찾아보세요.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {regionOptions.map((option) => (
          <Chip
            key={option}
            active={region === option}
            onClick={() => toggleFilter("domesticRegion", region, option)}
          >
            {option}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {themeOptions.map((option) => (
          <Chip
            key={option}
            active={theme === option}
            onClick={() => toggleFilter("domesticTheme", theme, option)}
          >
            {option}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {SEASONS.map((option) => (
          <Chip
            key={option}
            active={season === option}
            onClick={() => toggleFilter("domesticSeason", season, option)}
          >
            {option}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        // REQ-FUNC-005: 완성형 문장 + 조건 초기화 버튼(D-001 §18).
        <div className="mt-8 rounded-[14px] bg-[#F7F6F4] p-6 text-center">
          <p className="text-[16px] leading-[1.6] text-[#4B4E54]">
            선택하신 조건에 맞는 국내 여행지가 없습니다. 지역·테마·계절 조건을
            완화하거나 전체 초기화 후 다시 찾아보세요.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F]"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((destination) => (
            <button
              key={destination.id}
              type="button"
              data-testid="destination-card"
              onClick={() => onSelectDestination(destination.id)}
              className="relative rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] text-left transition-shadow hover:shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[14px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={destination.image.url}
                  alt={destination.image.alt}
                  title={destination.image.credit}
                  className="h-full w-full object-cover"
                />
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={
                    favoriteIds.includes(destination.id)
                      ? "즐겨찾기 해제"
                      : "즐겨찾기 추가"
                  }
                  aria-pressed={favoriteIds.includes(destination.id)}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggleFavorite(destination.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      handleToggleFavorite(destination.id);
                    }
                  }}
                  className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF]"
                >
                  <HeartIcon filled={favoriteIds.includes(destination.id)} />
                </span>
              </div>
              <div className="p-3">
                <p className="text-[17px] font-semibold text-[#26282C]">
                  {destination.name}
                </p>
                <p className="mt-1 text-[14px] text-[#84878D]">
                  {destination.region} · {destination.theme}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "#FF6A4D" : "none"}
      stroke={filled ? "#FF6A4D" : "#26282C"}
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8.2 2.4 5 5.6 5c1.8 0 3.2 1 4.4 2.6C11.2 6 12.6 5 14.4 5c3.2 0 4.8 3.2 3.1 6.5C19 15.65 12 20 12 20z" />
    </svg>
  );
}
