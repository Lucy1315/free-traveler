// 공통 Badge(상태 배지). design-reference/D-001/DESIGN.md §13(badge-warning:
// color-warning 텍스트 + 연한 호박색 배경, radius-full)·§11(badge-status) 기준.
// "연한" 배경색 정확한 hex가 문서에 없어, 새 색상을 만들지 않고 해당 텍스트
// 색상 토큰을 12% 투명도로 낮춰 배경에 쓴다(값 자체는 D-001 토큰 그대로 재사용).
//
// 색상만으로 상태를 표시하지 않는다 — children에 항상 텍스트 라벨을 넣어야 한다.

import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "warning" | "success" | "error" | "info" | "neutral";

interface BadgeColors {
  text: string;
  backgroundRgba: string;
}

const VARIANT_COLORS: Record<BadgeVariant, BadgeColors> = {
  warning: { text: "#B8720B", backgroundRgba: "rgba(184, 114, 11, 0.12)" },
  success: { text: "#1F8A4C", backgroundRgba: "rgba(31, 138, 76, 0.12)" },
  error: { text: "#C7284B", backgroundRgba: "rgba(199, 40, 75, 0.12)" },
  info: { text: "#2563A9", backgroundRgba: "rgba(37, 99, 169, 0.12)" },
  neutral: { text: "#84878D", backgroundRgba: "rgba(132, 135, 141, 0.12)" },
};

export interface BadgeProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "className"
> {
  children: ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({
  children,
  variant = "neutral",
  ...rest
}: BadgeProps) {
  const colors = VARIANT_COLORS[variant];

  return (
    <span
      {...rest}
      className="inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium leading-[1.4]"
      style={{ color: colors.text, backgroundColor: colors.backgroundRgba }}
    >
      {children}
    </span>
  );
}
