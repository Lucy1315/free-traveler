// 공통 Chip(필터·국가 태그). design-reference/D-001/DESIGN.md §8(chip/chip-active) 기준.
// radius-full, 비활성 color-surface-strong+color-ink, 활성 color-coral-100+color-coral-600.

import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ChipProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> {
  children: ReactNode;
  active?: boolean;
}

export default function Chip({ children, active = false, ...rest }: ChipProps) {
  const stateClass = active
    ? "bg-[#FFE3D8] text-[#E5502F]"
    : "bg-[#F0EFEC] text-[#26282C] hover:bg-[#E3E2DF]";

  return (
    <button
      type="button"
      aria-pressed={active}
      {...rest}
      className={`inline-flex min-h-[44px] items-center rounded-full px-4 text-[14px] font-medium leading-[1.55] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${stateClass}`}
    >
      {children}
    </button>
  );
}
