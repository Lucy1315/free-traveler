// URL 공유 유틸(Web Share API 우선, 실패·미지원 시 클립보드 복사로 폴백).
// 공유 대상은 D-001 §9 Destination Card(SCR-001)·§11 Mate Post Card(SCR-004).
// REQ-FUNC-069.

export interface ShareUrlOptions {
  title: string;
  text?: string;
  url: string;
}

export type ShareOutcome =
  | { method: "web-share" }
  | { method: "clipboard" }
  | { method: "cancelled" }
  | { method: "failed"; message: string };

function isWebShareSupported(): boolean {
  return (
    typeof navigator !== "undefined" && typeof navigator.share === "function"
  );
}

function isClipboardSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  );
}

async function copyUrlToClipboard(url: string): Promise<ShareOutcome> {
  if (!isClipboardSupported()) {
    return {
      method: "failed",
      message: "이 환경에서는 공유·복사 기능을 지원하지 않습니다.",
    };
  }
  try {
    await navigator.clipboard.writeText(url);
    return { method: "clipboard" };
  } catch {
    return {
      method: "failed",
      message: "URL 복사에 실패했습니다. 주소를 직접 복사해 주세요.",
    };
  }
}

// REQ-FUNC-069: Web Share API를 우선 시도하고, 사용자가 취소하면 그대로 두며
// (재시도 대상 아님), 미지원이거나 오류가 나면 클립보드 복사로 폴백한다.
export async function shareUrl(
  options: ShareUrlOptions,
): Promise<ShareOutcome> {
  if (isWebShareSupported()) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return { method: "web-share" };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return { method: "cancelled" };
      }
      return copyUrlToClipboard(options.url);
    }
  }

  return copyUrlToClipboard(options.url);
}
