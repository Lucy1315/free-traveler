// 여행 동기(테마) Chip 목록. SCR-001(`/`). design-reference/D-001/DESIGN.md
// §8(필터 Chip), §17(SCR-001 2번 영역 — 테마·계절 Chip 6개 이상) 기준.
// REQ-FUNC-002.
//
// 범위 참고(Depends On 밖 참조 — 투명하게 공개): 이 Task의 Depends On은
// SHARED-UI-KIT-PRIMITIVES뿐이지만, "클릭 시 카드 목록 필터 연동"(Functional
// AC)을 실제로 동작시키려면 CMP-SCR001-DOMESTIC/OVERSEAS-DEST-CARDS가 읽는
// domesticTheme/overseasTheme 쿼리 값과 같은 문자열이어야 한다. 두 Task가
// 만든 destinations.domestic.ts/destinations.overseas.ts의 theme 필드가
// "자연·해안"처럼 복합 문자열이라, 별도의 짧은 "동기" 태그(예: "자연")를
// 새로 만들면 그리드가 정확히 일치하는 문자열이 없어 필터가 항상 0건이
// 된다. 그래서 실제 존재하는 theme 값을 그대로 Chip 라벨로 재사용한다
// (destinations 데이터를 import하지만, 이미 완료된 Task라 런타임에는
// 문제가 없다 — 다만 TASK_MANIFEST.csv의 depends_on에는 반영돼 있지
// 않으므로 Task 문서 정합성 관점에서 별도로 확인이 필요하다).

"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Chip from "@/components/ui/Chip";
import { domesticDestinations } from "@/data/destinations.domestic";
import { overseasDestinations } from "@/data/destinations.overseas";

interface ThemeOption {
  label: string;
  inDomestic: boolean;
  inOverseas: boolean;
}

function buildThemeOptions(): ThemeOption[] {
  const domesticThemes = new Set(domesticDestinations.map((d) => d.theme));
  const overseasThemes = new Set(overseasDestinations.map((d) => d.theme));

  const labels = Array.from(
    new Set([
      ...Array.from(domesticThemes).slice(0, 4),
      ...Array.from(overseasThemes).slice(0, 4),
    ]),
  );

  return labels.map((label) => ({
    label,
    inDomestic: domesticThemes.has(label),
    inOverseas: overseasThemes.has(label),
  }));
}

export default function ThemeChips() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const options = useMemo(() => buildThemeOptions(), []);

  const activeDomesticTheme = searchParams.get("domesticTheme") ?? "";
  const activeOverseasTheme = searchParams.get("overseasTheme") ?? "";

  function handleSelect(option: ThemeOption) {
    const params = new URLSearchParams(searchParams.toString());
    const isActive =
      (option.inDomestic && activeDomesticTheme === option.label) ||
      (option.inOverseas && activeOverseasTheme === option.label);

    if (isActive) {
      params.delete("domesticTheme");
      params.delete("overseasTheme");
    } else {
      if (option.inDomestic) {
        params.set("domesticTheme", option.label);
      }
      if (option.inOverseas) {
        params.set("overseasTheme", option.label);
      }
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        테마로 여행 동기 찾기
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        관심 있는 테마를 선택하면 아래 여행지 목록이 그 테마로 좁혀집니다.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const active =
            (option.inDomestic && activeDomesticTheme === option.label) ||
            (option.inOverseas && activeOverseasTheme === option.label);
          return (
            <Chip
              key={option.label}
              active={active}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </Chip>
          );
        })}
      </div>
    </section>
  );
}
