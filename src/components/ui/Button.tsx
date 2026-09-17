// 공통 Button. design-reference/D-001/DESIGN.md §2(Color)·§5(Radius)·§16(button-primary/secondary) 기준.
// 44px 이상 터치 영역(§15), 키보드 포커스 시 2px color-focus-ring 아웃라인.

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const BASE_CLASS =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] px-5 text-[16px] font-semibold leading-[1.25] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] disabled:cursor-not-allowed";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-[#FF6A4D] text-[#FFFFFF] hover:bg-[#E5502F] active:bg-[#E5502F] disabled:bg-[#FFE3D8] disabled:text-[#FFFFFF]",
  secondary:
    "border border-[#C7C5C0] bg-[#FFFFFF] text-[#26282C] hover:bg-[#F7F6F4] disabled:border-[#E3E2DF] disabled:text-[#84878D]",
};

export default function Button({
  variant = "primary",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]}`}
    >
      {children}
    </button>
  );
}
