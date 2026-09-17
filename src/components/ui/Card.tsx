// 공통 Card 표면. design-reference/D-001/DESIGN.md §5(radius-md 14px)·§6(단일 elevation,
// hover에만 그림자) 기준. 콘텐츠 카드(여행지·동행·정책 안내 등)의 공용 컨테이너다.

import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "className"
> {
  children: ReactNode;
  /** 상호작용 카드(hover 시 그림자)인지 여부. 기본 false(정적 카드). */
  interactive?: boolean;
}

export default function Card({
  children,
  interactive = false,
  ...rest
}: CardProps) {
  const shadowClass = interactive
    ? "transition-shadow hover:shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)]"
    : "";

  return (
    <div
      {...rest}
      className={`rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-4 ${shadowClass}`}
    >
      {children}
    </div>
  );
}
