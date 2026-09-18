-- DB-SEED-BASE: 개발·테스트용 시드 데이터.
-- 회원 3건(user_profile) + 동행 모집글 5건(mate_post).
--
-- 이 파일은 로컬 Supabase(`supabase start` 후 `supabase db reset`)에서만
-- 실행되는 것을 전제로 한다 — auth.users에 직접 행을 넣는 방식은 로컬
-- 개발용 관례이며, 호스팅된 Supabase 프로젝트에는 그대로 적용되지 않을 수
-- 있다(Auth Admin API 또는 대시보드로 별도 생성 필요). 이 시드 사용자들은
-- 로그인 자격 증명이 필요한 E2E-MATE-AUTH의 실제 테스트 계정
-- (E2E_TEST_USER_EMAIL/PASSWORD)과는 별개다 — 화면에 표시할 콘텐츠 확보가
-- 목적이며 로그인 가능 여부는 보장하지 않는다.
--
-- Security/Privacy AC: 닉네임·자기소개·모집글 어디에도 전화번호·이메일·
-- 메신저 ID 등 연락처 패턴을 넣지 않는다.

-- =============================================================
-- auth.users (FK 대상 — 최소 컬럼만 채운다, 로그인 목적 아님)
-- =============================================================
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'seed-yuna@example.com',
    crypt('seed-password-not-for-login', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222222',
    'authenticated',
    'authenticated',
    'seed-minjun@example.com',
    crypt('seed-password-not-for-login', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333333',
    'authenticated',
    'authenticated',
    'seed-jiwoo@example.com',
    crypt('seed-password-not-for-login', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
on conflict (id) do nothing;

-- =============================================================
-- user_profile — 회원 3건.
-- =============================================================
insert into user_profile (
  id, nickname, age_range, gender, travel_style, bio, is_adult, adult_verified_at, role
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '여행하는유나',
    '20s',
    'female',
    array['자연', '사진'],
    '주말마다 근교 여행을 다니는 걸 좋아합니다. 함께 걸으며 사진 찍는 여행 스타일을 선호해요.',
    true,
    now(),
    'member'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '민준의배낭',
    '30s',
    'male',
    array['미식', '도심'],
    '맛집 탐방과 도심 산책을 좋아하는 배낭여행자입니다. 여유로운 일정을 선호해요.',
    true,
    now(),
    'member'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '지우트래블',
    '20s',
    'other',
    array['액티비티', '자연'],
    '트레킹과 액티비티 위주의 활동적인 여행을 좋아합니다.',
    true,
    now(),
    'member'
  )
on conflict (id) do nothing;

-- =============================================================
-- mate_post — 동행 모집글 5건.
-- =============================================================
insert into mate_post (
  author_id, title, country, region, start_date, end_date, capacity,
  preferred_conditions, travel_style, description, safety_agreement_consented_at, status
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '제주 오름 트레킹 동행 구해요',
    '대한민국',
    '제주',
    current_date + interval '20 day',
    current_date + interval '22 day',
    3,
    '오전 일찍 움직일 수 있는 분',
    array['자연', '사진'],
    '제주 동쪽 오름 3곳을 2박 3일 동안 천천히 돌아볼 계획입니다. 사진 찍는 걸 좋아하시는 분과 함께하면 좋겠어요.',
    now(),
    'RECRUITING'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '오사카 미식 여행 같이 가실 분',
    '일본',
    '오사카',
    current_date + interval '35 day',
    current_date + interval '38 day',
    2,
    '평일 일정 가능하신 분',
    array['미식', '도심'],
    '오사카 3박 4일 일정으로 다코야키부터 스시까지 먹으러 다닐 계획입니다. 여유롭게 도심을 구경하고 싶어요.',
    now(),
    'RECRUITING'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '다낭 액티비티 투어 동행',
    '베트남',
    '다낭',
    current_date + interval '10 day',
    current_date + interval '13 day',
    4,
    '수영 가능하신 분',
    array['액티비티', '자연'],
    '바나힐과 해양 스포츠를 함께 즐길 동행을 구합니다. 활동적인 일정을 선호하시는 분 환영합니다.',
    now(),
    'RECRUITING'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    '부산 사진 여행 마감되었습니다',
    '대한민국',
    '부산',
    current_date - interval '10 day',
    current_date - interval '8 day',
    2,
    '카메라 있으신 분',
    array['자연', '사진'],
    '감천문화마을과 해운대 야경을 함께 촬영할 동행을 구했던 모집글입니다. 이미 마감되었습니다.',
    now() - interval '30 day',
    'CLOSED'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '방콕 야시장 투어 동행 모집',
    '태국',
    '방콕',
    current_date + interval '50 day',
    current_date + interval '53 day',
    3,
    '매운 음식 잘 드시는 분',
    array['미식'],
    '방콕 야시장과 로컬 맛집을 위주로 다닐 예정입니다. 낯선 음식에 도전하는 걸 좋아하는 분과 함께하고 싶어요.',
    now(),
    'RECRUITING'
  );
