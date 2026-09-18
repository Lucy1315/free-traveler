// SCR-005 Guest 뷰: 계정 기능 Intro → 로그인·가입·비밀번호 재설정 Card →
// 로그인 후 가능한 기능 → 보안 안내. design-reference/UI_CONTRACT.md 5장(Guest),
// D-001 §10(Form·Tabs). REQ-FUNC-027·066.
//
// Supabase Auth(이메일+비밀번호)를 브라우저 클라이언트로 호출한다. 세션은
// @supabase/ssr가 SameSite=Lax 쿠키로 관리하고, 서버(Route Handler)는 요청마다
// auth.getUser()로 세션을 다시 검증한다(Security AC). 비밀번호 등 입력값은
// 로그·저장소에 남기지 않는다.
//
// 함께 export: SignOutButton(로그아웃), PasswordRecoveryForm(재설정 메일 링크로
// 돌아왔을 때 새 비밀번호 저장), isRecoveryReturn(재설정 복귀 여부).

"use client";

import { useState } from "react";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import { createBrowserSupabaseClient } from "@/lib/db/browser";

type Mode = "login" | "signup" | "reset";

const MODE_TABS: { id: Mode; label: string }[] = [
  { id: "login", label: "로그인" },
  { id: "signup", label: "회원가입" },
  { id: "reset", label: "비밀번호 재설정" },
];

export const PASSWORD_MIN_LENGTH = 8;
const RECOVERY_QUERY = "recovery";

/** 비밀번호 재설정 메일 링크로 /account에 돌아왔는지. */
export function isRecoveryReturn(search: string): boolean {
  return new URLSearchParams(search).get(RECOVERY_QUERY) === "1";
}

// Supabase Auth 오류 메시지(영문)를 사용자 안내 문장으로 바꾼다. 알 수 없는
// 오류는 원문을 노출하지 않고 일반 문장으로 대신한다.
function toKoreanAuthError(message: string | undefined): string {
  const text = (message ?? "").toLowerCase();
  if (text.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (text.includes("email not confirmed")) {
    return "이메일 인증이 아직 끝나지 않았습니다. 받은 편지함의 인증 메일을 확인해 주세요.";
  }
  if (text.includes("already registered")) {
    return "이미 가입된 이메일입니다. 로그인하거나 비밀번호를 재설정해 주세요.";
  }
  if (text.includes("rate limit") || text.includes("too many")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  }
  if (text.includes("different from the old password")) {
    return "이전과 다른 비밀번호를 입력해 주세요.";
  }
  if (text.includes("password") && text.includes("at least")) {
    return `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상으로 입력해 주세요.`;
  }
  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AuthGuestProps {
  /** 로그인에 성공하면 호출(부모가 Member 뷰로 전환). */
  onSignedIn?: () => void;
}

function AuthCard({ onSignedIn }: AuthGuestProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const emailError = !email
    ? "이메일을 입력해 주세요."
    : EMAIL_PATTERN.test(email)
      ? null
      : "이메일 형식이 올바르지 않습니다.";
  const passwordError =
    mode === "reset"
      ? null
      : !password
        ? "비밀번호를 입력해 주세요."
        : mode === "signup" && password.length < PASSWORD_MIN_LENGTH
          ? `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`
          : null;
  const confirmError =
    mode === "signup" && password !== passwordConfirm
      ? "비밀번호가 서로 다릅니다."
      : null;

  function switchMode(next: string) {
    setMode(next as Mode);
    setSubmitted(false);
    setError(null);
    setNotice(null);
    setPassword("");
    setPasswordConfirm("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    setNotice(null);
    if (emailError || passwordError || confirmError || busy) return;

    setBusy(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const origin = window.location.origin;
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) {
          setError(toKoreanAuthError(authError.message));
          return;
        }
        setPassword("");
        onSignedIn?.();
      } else if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${origin}/account` },
        });
        if (authError) {
          setError(toKoreanAuthError(authError.message));
          return;
        }
        setPassword("");
        setPasswordConfirm("");
        if (data.session) {
          onSignedIn?.();
        } else {
          setNotice(
            `${email}로 인증 메일을 보냈습니다. 메일의 링크를 누르면 가입이 완료되고 이 화면으로 돌아옵니다.`,
          );
        }
      } else {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: `${origin}/account?${RECOVERY_QUERY}=1` },
        );
        if (authError) {
          setError(toKoreanAuthError(authError.message));
          return;
        }
        // 가입 여부를 알려주지 않도록 결과와 관계없이 같은 문장을 보여준다.
        setNotice(
          "가입된 이메일이라면 비밀번호 재설정 링크를 보냈습니다. 메일의 링크를 눌러 새 비밀번호를 정하세요.",
        );
      }
    } catch {
      setError(
        "로그인 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setBusy(false);
    }
  }

  const submitLabel =
    mode === "login"
      ? "로그인"
      : mode === "signup"
        ? "가입하고 인증 메일 받기"
        : "재설정 링크 보내기";

  return (
    <div
      data-testid="auth-card"
      className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-6"
    >
      <Tabs
        tabs={MODE_TABS.map((tab) => ({
          id: `auth-${tab.id}`,
          label: tab.label,
        }))}
        activeTabId={`auth-${mode}`}
        onChange={(id) => switchMode(id.replace("auth-", ""))}
        ariaLabel="계정 작업 선택"
      />
      <div
        role="tabpanel"
        id={`tabpanel-auth-${mode}`}
        aria-labelledby={`tab-auth-${mode}`}
        className="mt-6"
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <TextInput
            label="이메일"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={submitted ? (emailError ?? undefined) : undefined}
          />
          {mode !== "reset" && (
            <TextInput
              label="비밀번호"
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={submitted ? (passwordError ?? undefined) : undefined}
              helperText={
                mode === "signup"
                  ? `${PASSWORD_MIN_LENGTH}자 이상으로 정해 주세요.`
                  : undefined
              }
            />
          )}
          {mode === "signup" && (
            <TextInput
              label="비밀번호 확인"
              type="password"
              autoComplete="new-password"
              required
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              error={submitted ? (confirmError ?? undefined) : undefined}
            />
          )}
          {error && (
            <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
              오류: {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="rounded-[8px] bg-[#F7F6F4] p-3 text-[14px] leading-[1.55] text-[#26282C]"
            >
              {notice}
            </p>
          )}
          <div>
            <Button type="submit" disabled={busy}>
              {busy ? "처리 중…" : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const MEMBER_FEATURES = [
  {
    title: "동행 모집글 작성",
    description: "여행 준비 화면에서 일정과 조건을 적어 함께할 동행을 모아요.",
  },
  {
    title: "참가 요청과 승인",
    description:
      "마음에 드는 모집글에 참가 요청을 보내고, 내 글에 온 요청을 승인·거절해요.",
  },
  {
    title: "즐겨찾기와 차단 관리",
    description:
      "저장한 여행지를 모아 보고, 불편한 사용자를 차단하거나 해제해요.",
  },
] as const;

export default function AuthGuest({ onSignedIn }: AuthGuestProps) {
  return (
    <div data-testid="account-guest" className="flex flex-col gap-12">
      <section>
        <h1 className="text-[32px] font-bold leading-[1.35] text-[#26282C]">
          계정
        </h1>
        <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
          로그인하면 동행 모집글을 쓰고, 참가 요청과 즐겨찾기·차단 목록을 한
          곳에서 관리할 수 있습니다. 여행지와 동행글 열람은 로그인 없이도
          가능합니다.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AuthCard onSignedIn={onSignedIn} />

        <section>
          <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
            로그인하면 할 수 있어요
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {MEMBER_FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
              >
                <p className="text-[17px] font-semibold text-[#26282C]">
                  {feature.title}
                </p>
                <p className="mt-1 text-[14px] leading-[1.55] text-[#4B4E54]">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-[14px] bg-[#F7F6F4] p-6">
        <h2 className="text-[20px] font-semibold text-[#26282C]">보안 안내</h2>
        <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-[14px] leading-[1.55] text-[#4B4E54]">
          <li>
            비밀번호는 다른 사이트와 다르게 정하고 누구에게도 알려주지 마세요.
          </li>
          <li>
            동행 기능은 이메일 인증을 마치고 만 19세 이상 확인을 한 회원만 쓸 수
            있습니다.
          </li>
          <li>
            생년월일은 저장하지 않고 만 19세 이상 확인 여부와 확인 시각만
            기록합니다.
          </li>
        </ul>
      </section>
    </div>
  );
}

/** 로그아웃 버튼(Member 뷰에서 사용). */
export function SignOutButton({ onSignedOut }: { onSignedOut?: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setBusy(true);
    setError(null);
    try {
      const { error: authError } =
        await createBrowserSupabaseClient().auth.signOut();
      if (authError) {
        setError("로그아웃하지 못했습니다. 다시 시도해 주세요.");
        return;
      }
      onSignedOut?.();
    } catch {
      setError("로그아웃하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="secondary" onClick={signOut} disabled={busy}>
        {busy ? "로그아웃 중…" : "로그아웃"}
      </Button>
      {error && (
        <p role="alert" className="text-[13px] font-medium text-[#C7284B]">
          {error}
        </p>
      )}
    </div>
  );
}

/** 재설정 메일 링크로 돌아온 사용자가 새 비밀번호를 저장하는 폼. */
export function PasswordRecoveryForm({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordError =
    password.length < PASSWORD_MIN_LENGTH
      ? `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`
      : null;
  const confirmError =
    password !== passwordConfirm ? "비밀번호가 서로 다릅니다." : null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    if (passwordError || confirmError || busy) return;
    setBusy(true);
    try {
      const { error: authError } =
        await createBrowserSupabaseClient().auth.updateUser({ password });
      if (authError) {
        setError(toKoreanAuthError(authError.message));
        return;
      }
      onDone();
    } catch {
      setError("새 비밀번호를 저장하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="password-recovery-title"
      className="max-w-lg rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-6"
    >
      <h2
        id="password-recovery-title"
        className="text-[24px] font-semibold leading-[1.35] text-[#26282C]"
      >
        새 비밀번호 정하기
      </h2>
      <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
        재설정 링크로 들어오셨습니다. 앞으로 쓸 새 비밀번호를 입력해 주세요.
      </p>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-4"
      >
        <TextInput
          label="새 비밀번호"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={submitted ? (passwordError ?? undefined) : undefined}
        />
        <TextInput
          label="새 비밀번호 확인"
          type="password"
          autoComplete="new-password"
          required
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          error={submitted ? (confirmError ?? undefined) : undefined}
        />
        {error && (
          <p role="alert" className="text-[14px] font-medium text-[#C7284B]">
            오류: {error}
          </p>
        )}
        <div>
          <Button type="submit" disabled={busy}>
            {busy ? "저장 중…" : "새 비밀번호 저장"}
          </Button>
        </div>
      </form>
    </section>
  );
}
