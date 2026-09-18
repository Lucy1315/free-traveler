// SCR-005 계정·관리 Page Owner(`/account`). design-reference/UI_CONTRACT.md 5장,
// D-001 §10(Tabs)·§14. REQ-FUNC-027~029·036·038·040~042·062·066·068·077.
//
// Depends On의 CMP-SCR005-* 산출물을 조립한다(새 Component 파일 없음).
// 세 상태를 역할에 따라 분기한다:
// - Guest: AuthGuest(Intro → 로그인·가입·재설정 → 로그인 후 기능 → 보안 안내)
// - Member: 좌측 세로 탭 5개(프로필·내 글·참가 요청·차단 목록·즐겨찾기)
// - Admin(Moderator/Admin): Member 5탭 + 구분선 "관리자 설정" + 관리자 탭 2개.
//   권한이 없으면 관리자 탭은 아예 렌더링하지 않는다(서버·RLS도 따로 막는다).
// 비로그인으로 ?tab=… 에 직접 들어와도 Guest 뷰로 대체한다.
//
// 세션 상태를 구독해야 해서 Client Component로 두고, 메타데이터는 같은 폴더의
// layout.tsx가 맡는다.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AuthGuest, {
  isRecoveryReturn,
  PasswordRecoveryForm,
  SignOutButton,
} from "@/components/scr005/AuthGuest";
import ProfileTab from "@/components/scr005/ProfileTab";
import {
  MyApplicationsTab,
  MyPostsTab,
} from "@/components/scr005/MyActivityPosts";
import {
  BlocksTab,
  FavoritesTab,
} from "@/components/scr005/BlocksFavoritesTab";
import {
  AdminReportsTab,
  AdminUrlSettingsTab,
} from "@/components/scr005/AdminTabs";
import { createBrowserSupabaseClient } from "@/lib/db/browser";
import type { UserRole } from "@/lib/db/queries";

type Viewer =
  | { kind: "loading" }
  | { kind: "guest" }
  | { kind: "member"; userId: string; email: string | null; role: UserRole };

const MEMBER_TABS = [
  { id: "profile", label: "프로필" },
  { id: "posts", label: "내 글" },
  { id: "applications", label: "참가 요청" },
  { id: "blocks", label: "차단 목록" },
  { id: "favorites", label: "즐겨찾기" },
] as const;

const ADMIN_TABS = [
  { id: "admin-reports", label: "신고 상태 변경" },
  { id: "admin-urls", label: "외부 URL 설정" },
] as const;

type TabId =
  (typeof MEMBER_TABS)[number]["id"] | (typeof ADMIN_TABS)[number]["id"];

// 현재 세션과 역할을 조회한다(상태 변경 없이 결과만 돌려준다).
async function resolveViewer(): Promise<Viewer> {
  try {
    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { kind: "guest" };
    const { data: profile } = await supabase
      .from("user_profile")
      .select("role")
      .eq("id", user.id)
      .maybeSingle<{ role: UserRole }>();
    return {
      kind: "member",
      userId: user.id,
      email: user.email ?? null,
      role: profile?.role ?? "member",
    };
  } catch {
    // Supabase 설정이 없거나 세션 확인에 실패하면 Guest로 본다.
    return { kind: "guest" };
  }
}

function readTabParam(): string | null {
  return new URLSearchParams(window.location.search).get("tab");
}

export default function AccountPage() {
  const [viewer, setViewer] = useState<Viewer>({ kind: "loading" });
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [recovering, setRecovering] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const loadViewer = useCallback(() => {
    void resolveViewer().then(setViewer);
  }, []);

  // 최초 세션 확인 + 로그인·로그아웃·재설정 링크 복귀를 구독한다.
  useEffect(() => {
    const requested = readTabParam();
    const initialTab = [...MEMBER_TABS, ...ADMIN_TABS].find(
      (tab) => tab.id === requested,
    );
    let supabase: ReturnType<typeof createBrowserSupabaseClient> | null = null;
    try {
      supabase = createBrowserSupabaseClient();
    } catch {
      supabase = null;
    }
    void resolveViewer().then((next) => {
      setViewer(next);
      if (initialTab) setActiveTab(initialTab.id);
      if (isRecoveryReturn(window.location.search)) setRecovering(true);
    });
    const subscription = supabase?.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") loadViewer();
    }).data.subscription;
    return () => subscription?.unsubscribe();
  }, [loadViewer]);

  const isAdmin =
    viewer.kind === "member" &&
    (viewer.role === "admin" || viewer.role === "moderator");
  const visibleTabs: { id: TabId; label: string }[] = [
    ...MEMBER_TABS,
    ...(isAdmin ? ADMIN_TABS : []),
  ];
  // 권한이 없는 탭 id로 들어오면 프로필로 대체한다(관리자 탭 미렌더링).
  const currentTab = visibleTabs.some((tab) => tab.id === activeTab)
    ? activeTab
    : "profile";

  function selectTab(id: TabId) {
    setActiveTab(id);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", url);
  }

  function handleTabKeyDown(event: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: visibleTabs.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next =
      visibleTabs[(keys[event.key] + visibleTabs.length) % visibleTabs.length];
    selectTab(next.id);
    tabRefs.current[next.id]?.focus();
  }

  function renderTabButton(tab: { id: TabId; label: string }, index: number) {
    const active = tab.id === currentTab;
    return (
      <button
        key={tab.id}
        ref={(node) => {
          tabRefs.current[tab.id] = node;
        }}
        type="button"
        role="tab"
        id={`account-tab-${tab.id}`}
        aria-selected={active}
        aria-controls="account-tabpanel"
        tabIndex={active ? 0 : -1}
        onClick={() => selectTab(tab.id)}
        onKeyDown={(event) => handleTabKeyDown(event, index)}
        className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-[8px] px-4 text-left text-[16px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] md:w-full ${
          active
            ? "bg-[#FFE3D8] text-[#E5502F]"
            : "text-[#4B4E54] hover:bg-[#F7F6F4] hover:text-[#26282C]"
        }`}
      >
        {tab.label}
      </button>
    );
  }

  let content: React.ReactNode;
  if (viewer.kind === "loading") {
    content = (
      <div
        aria-busy="true"
        aria-label="계정 정보를 확인하는 중"
        className="flex flex-col gap-4"
      >
        <div className="h-10 w-48 animate-pulse rounded-[8px] bg-[#F0EFEC]" />
        <div className="h-64 animate-pulse rounded-[14px] bg-[#F0EFEC]" />
      </div>
    );
  } else if (viewer.kind === "guest") {
    content = <AuthGuest onSignedIn={loadViewer} />;
  } else if (recovering) {
    content = (
      <PasswordRecoveryForm
        onDone={() => {
          setRecovering(false);
          const url = new URL(window.location.href);
          url.searchParams.delete("recovery");
          window.history.replaceState(null, "", url);
        }}
      />
    );
  } else {
    const panels: Record<TabId, React.ReactNode> = {
      profile: <ProfileTab userId={viewer.userId} email={viewer.email} />,
      posts: <MyPostsTab userId={viewer.userId} />,
      applications: <MyApplicationsTab userId={viewer.userId} />,
      blocks: <BlocksTab />,
      favorites: <FavoritesTab />,
      "admin-reports": <AdminReportsTab />,
      "admin-urls": <AdminUrlSettingsTab />,
    };
    content = (
      <div data-testid="account-member" className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-bold leading-[1.35] text-[#26282C]">
              내 계정
            </h1>
            <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
              프로필과 동행 활동, 차단·즐겨찾기를 한 곳에서 관리하세요.
            </p>
          </div>
          <SignOutButton onSignedOut={() => setViewer({ kind: "guest" })} />
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <div
            role="tablist"
            aria-label="계정 메뉴"
            aria-orientation="vertical"
            className="flex shrink-0 gap-2 overflow-x-auto md:w-56 md:flex-col md:overflow-visible"
          >
            {MEMBER_TABS.map((tab, index) => renderTabButton(tab, index))}
            {isAdmin && (
              <>
                <div
                  role="presentation"
                  className="hidden border-t border-[#E3E2DF] md:mt-2 md:block"
                />
                <p
                  role="presentation"
                  className="hidden px-4 pt-2 text-[13px] font-medium text-[#84878D] md:block"
                >
                  관리자 설정
                </p>
                {ADMIN_TABS.map((tab, index) =>
                  renderTabButton(tab, MEMBER_TABS.length + index),
                )}
              </>
            )}
          </div>
          <div
            role="tabpanel"
            id="account-tabpanel"
            aria-labelledby={`account-tab-${currentTab}`}
            className="min-w-0 flex-1"
          >
            <div key={currentTab}>{panels[currentTab]}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-12 md:px-8 md:py-20">
      {content}
    </div>
  );
}
