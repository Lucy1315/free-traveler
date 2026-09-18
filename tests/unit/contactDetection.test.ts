// UNIT-CONTACT-DETECTION — 연락처 패턴 탐지·오탐 샘플셋. REQ-FUNC-032·033.
// 작성 폼의 탐지(detectContactInfo)와 상세 화면의 가림(maskContactInfo)이 같은
// 샘플에서 같은 결론을 내는지도 함께 확인한다(두 곳에 규칙이 따로 있다).
import { describe, expect, it } from "vitest";
import { detectContactInfo } from "@/components/scr003/MateWriteForm";
import { maskContactInfo } from "@/components/scr004/MateDetailPanel";

const MASK = "[연락처 비공개]";

const CONTACT_SAMPLES: { text: string; kind: string }[] = [
  { text: "연락은 010-1234-5678로 주세요", kind: "phone" },
  { text: "01012345678", kind: "phone" },
  { text: "010 1234 5678", kind: "phone" },
  { text: "010.1234.5678", kind: "phone" },
  { text: "+82 10 1234 5678", kind: "phone" },
  { text: "+82-10-1234-5678", kind: "phone" },
  { text: "사무실 02-123-4567", kind: "phone" },
  { text: "메일은 travel.kim+trip@gmail.com", kind: "email" },
  { text: "USER@EXAMPLE.CO.KR", kind: "email" },
  { text: "카톡 아이디: travel_kim", kind: "messenger" },
  { text: "카카오톡 travelkim99", kind: "messenger" },
  { text: "텔레그램 @free_trip", kind: "messenger" },
  { text: "인스타 free.traveler", kind: "messenger" },
  { text: "line id: tokyo_go", kind: "messenger" },
  { text: "오픈채팅 open.kakao.com/o/gAbCdEf", kind: "messenger" },
];

const SAFE_SAMPLES = [
  "2026-09-18 출발해서 2026-09-22에 돌아와요",
  "1인 예산은 300,000원 정도 생각하고 있어요",
  "KE123편으로 12:30 도착 예정입니다",
  "페스티벌 라인업이 좋아서 같이 보러 가요",
  "숙소는 3박 4일, 인원은 2~3명이면 좋겠어요",
  "오전 9시 30분에 공항 1터미널에서 만나요",
  "카톡으로 연락하면 편하겠지만 규칙대로 서비스 안에서 이야기해요",
];

describe("detectContactInfo", () => {
  it.each(CONTACT_SAMPLES)("탐지: $text", ({ text, kind }) => {
    expect(detectContactInfo(text)).toContain(kind);
  });

  it.each(SAFE_SAMPLES)("오탐 없음: %s", (text) => {
    expect(detectContactInfo(text)).toEqual([]);
  });

  it("여러 종류가 섞이면 종류별로 한 번씩만 돌려준다", () => {
    const found = detectContactInfo(
      "010-1111-2222 / 010-3333-4444 / a@b.co / 카톡 abc123",
    );
    expect(found.sort()).toEqual(["email", "messenger", "phone"]);
  });
});

describe("maskContactInfo — 작성 폼 탐지와 같은 결론", () => {
  it.each(CONTACT_SAMPLES)("가림: $text", ({ text }) => {
    const masked = maskContactInfo(text);
    expect(masked).toContain(MASK);
    // 가린 뒤에는 더 이상 연락처로 탐지되지 않아야 한다.
    expect(detectContactInfo(masked)).toEqual([]);
  });

  it.each(SAFE_SAMPLES)("그대로 둠: %s", (text) => {
    expect(maskContactInfo(text)).toBe(text);
  });

  it("문장 안의 연락처만 가리고 나머지는 남긴다", () => {
    expect(maskContactInfo("메일 a@b.co 또는 010-1111-2222로 주세요")).toBe(
      `메일 ${MASK} 또는 ${MASK}로 주세요`,
    );
  });
});
