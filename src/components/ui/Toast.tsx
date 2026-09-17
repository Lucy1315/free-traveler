// Toast 알림. design-reference/D-001/DESIGN.md §13(Alert·Toast) 기준.
// Mobile: 화면 하단 중앙, Desktop: 우하단. 4초 후 자동 소멸.
// color-success(성공)·color-error(오류)·color-info(정보) 3종, 아이콘+텍스트 병기.
//
// REQ-FUNC-043: 참가 요청 접수·승인·거절·신고 처리 결과를 이 Toast로만 안내한다.
// 이 파일은 이메일 발송 코드를 포함하지 않는다 — 실제 이메일 발송이 전혀 없다는
// 사실 자체가 Security/Privacy AC(실제 이메일 미발송 확인)를 충족한다.

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

export type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToastContextValue {
  showToast: (variant: ToastVariant, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 4000;

const VARIANT_META: Record<ToastVariant, { color: string; label: string }> = {
  success: { color: "#1F8A4C", label: "성공" },
  error: { color: "#C7284B", label: "오류" },
  info: { color: "#2563A9", label: "안내" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, variant, message }]);
      const timer = setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
      timersRef.current.set(id, timer);
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast는 ToastProvider 내부에서만 쓸 수 있습니다.");
  }
  return context;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 md:inset-x-auto md:right-6 md:items-end"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const meta = VARIANT_META[toast.variant];

  return (
    <div
      role="status"
      className="flex w-full max-w-sm items-start gap-3 rounded-[14px] bg-[#FFFFFF] px-4 py-3 shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)]"
    >
      <ToastIcon variant={toast.variant} />
      <p
        className="flex-1 text-[14px] leading-[1.55]"
        style={{ color: meta.color }}
      >
        <span className="sr-only">{meta.label}: </span>
        {toast.message}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="알림 닫기"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#84878D] hover:bg-[#F0EFEC]"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
    </div>
  );
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const color = VARIANT_META[variant].color;

  if (variant === "success") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        aria-hidden="true"
        className="mt-0.5 shrink-0"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9.5" />
      </svg>
    );
  }

  if (variant === "error") {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        aria-hidden="true"
        className="mt-0.5 shrink-0"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9l6 6M15 9l-6 6" />
      </svg>
    );
  }

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5v5.5M12 7.5v.5" />
    </svg>
  );
}
