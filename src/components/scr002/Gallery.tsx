// 사진 Gallery(정확히 8장, 캡션+촬영 국가). SCR-002(`/about`).
// design-reference/D-001/DESIGN.md §16(Gallery 본문 유형), UI_CONTRACT.md
// 2장 기준. REQ-FUNC-061(축소: alt·출처 URL + 저작자·라이선스 표기).

import { aboutProfile } from "@/data/about";

export default function Gallery() {
  const photos = aboutProfile.gallery;

  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        여행 사진
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        지금까지의 여행에서 담은 순간들입니다.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <figure key={index} className="overflow-hidden rounded-[14px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.alt}
              className="aspect-square w-full object-cover"
            />
            <figcaption className="mt-1 text-[13px] text-[#84878D]">
              {photo.country}
              <a
                href={photo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block underline"
              >
                {photo.credit}
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
