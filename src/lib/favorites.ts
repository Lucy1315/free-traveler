// 즐겨찾기 localStorage 로직(회원 여행지 즐겨찾기·해제·조회).
// design-reference/D-001/DESIGN.md §9(Destination Card 즐겨찾기 하트 아이콘) 기준.
// REQ-FUNC-068. 서버로 전송하지 않고 브라우저 localStorage에만 저장한다.

const FAVORITES_STORAGE_KEY = "free-traveler:favorites";

function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function readRaw(): string[] {
  if (!isBrowser()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    // 손상된 저장값은 빈 목록으로 취급한다(예외를 밖으로 전파하지 않는다).
    return [];
  }
}

function writeRaw(ids: string[]): void {
  if (!isBrowser()) {
    return;
  }
  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage 쓰기 실패(용량 초과·프라이빗 모드 등)는 조용히 무시한다.
  }
}

// 즐겨찾기한 여행지 id 목록을 조회한다. 서버 요청 없이 로컬 저장값만 읽는다.
export function getFavorites(): string[] {
  return readRaw();
}

export function isFavorite(destinationId: string): boolean {
  return readRaw().includes(destinationId);
}

// 이미 즐겨찾기된 id는 중복 추가하지 않는다.
export function addFavorite(destinationId: string): string[] {
  const current = readRaw();
  if (current.includes(destinationId)) {
    return current;
  }
  const next = [...current, destinationId];
  writeRaw(next);
  return next;
}

export function removeFavorite(destinationId: string): string[] {
  const current = readRaw();
  const next = current.filter((id) => id !== destinationId);
  writeRaw(next);
  return next;
}

export function toggleFavorite(destinationId: string): string[] {
  return isFavorite(destinationId)
    ? removeFavorite(destinationId)
    : addFavorite(destinationId);
}
