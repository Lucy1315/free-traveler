// 방문 국가 Chip 목록(30개 이상, 대륙별 그룹). SCR-002(`/about`).
// design-reference/D-001/DESIGN.md §8(Chip), UI_CONTRACT.md 2장 기준.
// REQ-FUNC-059.

import Chip from "@/components/ui/Chip";
import { aboutProfile } from "@/data/about";

const CONTINENT_ORDER = [
  "아시아",
  "유럽",
  "북아메리카",
  "남아메리카",
  "아프리카",
  "오세아니아",
] as const;

export default function CountryChips() {
  const groups = CONTINENT_ORDER.map((continent) => ({
    continent,
    countries: aboutProfile.visitedCountries.filter(
      (country) => country.continent === continent,
    ),
  })).filter((group) => group.countries.length > 0);

  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        방문 국가
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        지금까지 {aboutProfile.visitedCountries.length}개국을 여행했습니다.
      </p>

      <div className="mt-6 flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.continent}>
            <h3 className="text-[17px] font-semibold text-[#26282C]">
              {group.continent}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {group.countries.map((country) => (
                <Chip key={country.name} tabIndex={-1}>
                  {country.name}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
