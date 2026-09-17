-- DB-SCHEMA-BASE: Supabase 6테이블 스키마 정의.
-- REQ-FUNC-028~043(그 중 028·029·030·031·034~043)·077. 정확히 6개 테이블만 만든다
-- (user_profile, mate_post, mate_application, user_block, report,
-- external_url_setting). 여행지·안전정보·대표소개·정책 문서는 src/data 정적
-- 데이터로 둔다(CLAUDE.md 규칙 16) — 이 파일에 관련 테이블을 만들지 않는다.
--
-- Row Level Security 정책은 이 파일에서 켜지 않는다 — DB-RLS-BASE(다음
-- migration)가 ENABLE ROW LEVEL SECURITY와 정책을 함께 정의한다.

create extension if not exists pgcrypto;

-- 공통: updated_at을 행 수정 시 자동 갱신하는 트리거 함수.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================
-- user_profile — REQ-FUNC-028·029. auth.users와 1:1.
-- REQ-FUNC-028(Security AC): 정확한 생년월일 컬럼을 두지 않는다.
-- is_adult(만 19세 이상 확인 상태)·adult_verified_at(확인 시각)만 저장한다.
-- =============================================================
create table user_profile (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null,
  age_range text not null check (
    age_range in ('10s', '20s', '30s', '40s', '50s', '60plus')
  ),
  gender text check (gender in ('female', 'male', 'other')),
  travel_style text[] not null default '{}',
  bio text,
  is_adult boolean not null default false,
  adult_verified_at timestamptz,
  -- REQ-FUNC-041·042·077: Moderator/Admin 권한 판별용 역할.
  role text not null default 'member' check (
    role in ('member', 'moderator', 'admin')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger user_profile_set_updated_at
  before update on user_profile
  for each row
  execute function set_updated_at();

-- =============================================================
-- mate_post — REQ-FUNC-030·031·037·038.
-- status는 작성자의 수동 마감만 반영한다(RECRUITING/CLOSED). 여행 종료일
-- 경과에 따른 마감 표시는 CLAUDE.md 규칙대로 조회 시 end_date를 계산해서
-- 판단한다(REQ-FUNC-037 "방식 변경: 조회 시 종료일 계산") — 별도 컬럼·배치
-- 작업으로 자동 전환하지 않는다.
-- =============================================================
create table mate_post (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references user_profile (id) on delete cascade,
  title text not null,
  country text not null,
  region text,
  start_date date not null,
  end_date date not null,
  capacity integer not null check (capacity > 0),
  preferred_conditions text,
  travel_style text[] not null default '{}',
  description text not null,
  -- REQ-FUNC-031: 안전수칙 동의를 시각으로 기록한다(src/data/policies.ts의
  -- mateSafetyConsentLabel에 대한 동의).
  safety_agreement_consented_at timestamptz not null,
  status text not null default 'RECRUITING' check (
    status in ('RECRUITING', 'CLOSED')
  ),
  closed_manually_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mate_post_date_order check (end_date >= start_date)
);

create index mate_post_country_idx on mate_post (country);
create index mate_post_author_idx on mate_post (author_id);

create trigger mate_post_set_updated_at
  before update on mate_post
  for each row
  execute function set_updated_at();

-- =============================================================
-- mate_application — REQ-FUNC-034·035·036.
-- 동일 사용자가 같은 글에 PENDING·ACCEPTED 상태로 중복 신청하는 것을
-- 부분 유니크 인덱스로 막는다(REJECTED 재신청은 허용).
-- =============================================================
create table mate_application (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references mate_post (id) on delete cascade,
  applicant_id uuid not null references user_profile (id) on delete cascade,
  message text not null check (char_length(message) <= 500),
  status text not null default 'PENDING' check (
    status in ('PENDING', 'ACCEPTED', 'REJECTED')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index mate_application_unique_active
  on mate_application (post_id, applicant_id)
  where status in ('PENDING', 'ACCEPTED');

create index mate_application_post_idx on mate_application (post_id);
create index mate_application_applicant_idx on mate_application (applicant_id);

create trigger mate_application_set_updated_at
  before update on mate_application
  for each row
  execute function set_updated_at();

-- =============================================================
-- user_block — REQ-FUNC-040.
-- =============================================================
create table user_block (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references user_profile (id) on delete cascade,
  blocked_id uuid not null references user_profile (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint user_block_not_self check (blocker_id <> blocked_id),
  constraint user_block_unique unique (blocker_id, blocked_id)
);

create index user_block_blocker_idx on user_block (blocker_id);

-- =============================================================
-- report — REQ-FUNC-039·041(축소)·042(축소).
-- target_id는 target_type에 따라 mate_post·user_profile·mate_application 중
-- 하나를 가리키는 다형(polymorphic) 참조라 단일 FK 제약을 걸지 않는다
-- (여러 테이블을 동시에 참조할 수 없는 Postgres FK의 한계).
-- REQ-FUNC-041 축소: 우선순위·증거첨부 컬럼은 만들지 않고 상태별 필터만
-- 가능한 최소 컬럼으로 둔다. REQ-FUNC-042 축소: 세부 제재 로그 테이블
-- 없이 report.status 변경 이력만 남긴다(resolved_by·resolved_at).
-- =============================================================
create table report (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references user_profile (id) on delete cascade,
  target_type text not null check (
    target_type in ('mate_post', 'user_profile', 'mate_application')
  ),
  target_id uuid not null,
  reason_code text not null,
  description text,
  status text not null default 'PENDING' check (
    status in (
      'PENDING',
      'WARNED',
      'CONTENT_HIDDEN',
      'ACCOUNT_RESTRICTED',
      'DISMISSED'
    )
  ),
  resolved_by uuid references user_profile (id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index report_status_idx on report (status);
create index report_target_idx on report (target_type, target_id);

-- =============================================================
-- external_url_setting — REQ-FUNC-077.
-- 항공·호텔 외부 URL을 각각 한 행으로 관리한다. HTTPS만 허용한다(URL
-- allowlist 자체는 애플리케이션 계층 src/lib/externalLink.ts가 검사한다 —
-- 이 컬럼 제약은 최소한의 형식 방어선이다).
-- =============================================================
create table external_url_setting (
  id uuid primary key default gen_random_uuid(),
  category text not null unique check (category in ('flight', 'hotel')),
  url text not null check (url like 'https://%'),
  updated_by uuid references user_profile (id),
  updated_at timestamptz not null default now()
);

create trigger external_url_setting_set_updated_at
  before update on external_url_setting
  for each row
  execute function set_updated_at();
