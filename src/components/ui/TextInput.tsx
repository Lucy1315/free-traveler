// 공통 TextInput. design-reference/D-001/DESIGN.md §10(Form) 기준.
// 흰 배경, radius-sm(8px), 높이 48px, 1px color-hairline 테두리, padding 14px 12px.
// 라벨은 caption(입력 위 고정), 오류는 color-error 텍스트 + 2px 오류 테두리 +
// aria-describedby로 필드와 연결(REQ-FUNC-079).

"use client";

import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className" | "id"
> {
  label: string;
  error?: string;
  helperText?: string;
}

export default function TextInput({
  label,
  error,
  helperText,
  required,
  ...rest
}: TextInputProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-[13px] font-medium leading-[1.4] text-[#26282C]"
      >
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
        className={`h-12 rounded-[8px] border bg-[#FFFFFF] px-3 py-3.5 text-[16px] text-[#26282C] outline-none focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8] ${
          error ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"
        }`}
      />
      {error ? (
        <p
          id={errorId}
          className="text-[13px] font-medium leading-[1.4] text-[#C7284B]"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          className="text-[13px] font-medium leading-[1.4] text-[#84878D]"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
