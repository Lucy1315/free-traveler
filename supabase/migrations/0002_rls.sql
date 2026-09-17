-- DB-RLS-BASE: Row Level Security 정책. REQ-FUNC-044, REQ-NF-013.
-- 0001_schema.sql의 6개 테이블에 RLS를 켜고 SELECT/INSERT/UPDATE/DELETE
-- 정책을 정의한다. CLAUDE.md 규칙 14(RLS 우회 Client 코드 금지)에 따라
-- 권한 판단은 서버(Postgres) 쪽 정책으로만 하고, 여기 정의된 정책 밖의
-- 접근은 403 또는 빈 결과로 막힌다.

-- user_profile.role을 SECURITY DEFINER로 조회하는 헬퍼. user_profile 자신의
-- RLS 정책 안에서 user_profile을 다시 조회하면 재귀 평가가 발생하므로,
-- RLS를 우회해 role만 안전하게 확인하는 함수로 분리한다.
create or replace function is_moderator_or_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from user_profile
    where id = check_user_id
      and role in ('moderator', 'admin')
  );
$$;

-- =============================================================
-- user_profile
-- 공개 SELECT: 여행지 없음. 동행 카드·상세에 작성자 닉네임을 표시해야 하므로
-- (REQ-FUNC-033) 로그인 사용자에게는 프로필 조회를 허용한다. user_profile에는
-- 이메일 등 민감 정보 컬럼이 없다(이메일은 auth.users에만 있다).
-- =============================================================
alter table user_profile enable row level security;

create policy user_profile_select_authenticated
  on user_profile
  for select
  to authenticated
  using (true);

create policy user_profile_insert_self
  on user_profile
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy user_profile_update_self
  on user_profile
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy user_profile_delete_self
  on user_profile
  for delete
  to authenticated
  using (auth.uid() = id);

-- =============================================================
-- mate_post — 동행 모집글은 공개 게시판 콘텐츠다(REQ-FUNC-030 필터·SCR-004
-- 핵심 화면). 비로그인 방문자도 목록·상세를 볼 수 있어야 하므로 SELECT는
-- anon에게도 연다. 쓰기는 본인(auth.uid() = author_id)만 가능하다.
-- =============================================================
alter table mate_post enable row level security;

create policy mate_post_select_public
  on mate_post
  for select
  to anon, authenticated
  using (true);

create policy mate_post_insert_self
  on mate_post
  for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy mate_post_update_self
  on mate_post
  for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy mate_post_delete_self
  on mate_post
  for delete
  to authenticated
  using (auth.uid() = author_id);

-- =============================================================
-- mate_application — REQ-FUNC-044: 본인(신청자) 요청, 요청 대상 글
-- 작성자, Moderator/Admin만 열람한다. 생성·취소(DELETE)는 신청자 본인만,
-- 상태(ACCEPTED/REJECTED) 변경은 대상 글 작성자만 할 수 있다.
-- =============================================================
alter table mate_application enable row level security;

create policy mate_application_select_related
  on mate_application
  for select
  to authenticated
  using (
    applicant_id = auth.uid()
    or exists (
      select 1
      from mate_post
      where mate_post.id = mate_application.post_id
        and mate_post.author_id = auth.uid()
    )
    or is_moderator_or_admin(auth.uid())
  );

create policy mate_application_insert_self
  on mate_application
  for insert
  to authenticated
  with check (applicant_id = auth.uid());

-- 상태 변경(ACCEPTED/REJECTED)은 대상 글 작성자만, PENDING 요청에 한해 허용한다.
create policy mate_application_update_by_post_author
  on mate_application
  for update
  to authenticated
  using (
    status = 'PENDING'
    and exists (
      select 1
      from mate_post
      where mate_post.id = mate_application.post_id
        and mate_post.author_id = auth.uid()
    )
  )
  with check (status in ('ACCEPTED', 'REJECTED'));

-- 취소(DELETE)는 신청자 본인이 PENDING 상태일 때만 할 수 있다.
create policy mate_application_delete_self_pending
  on mate_application
  for delete
  to authenticated
  using (applicant_id = auth.uid() and status = 'PENDING');

-- =============================================================
-- user_block — 본인의 차단 목록만 보고 관리한다(REQ-FUNC-040).
-- =============================================================
alter table user_block enable row level security;

create policy user_block_select_self
  on user_block
  for select
  to authenticated
  using (blocker_id = auth.uid() or is_moderator_or_admin(auth.uid()));

create policy user_block_insert_self
  on user_block
  for insert
  to authenticated
  with check (blocker_id = auth.uid());

create policy user_block_delete_self
  on user_block
  for delete
  to authenticated
  using (blocker_id = auth.uid());

-- =============================================================
-- report — 신고자 본인 또는 Moderator/Admin만 열람한다(REQ-FUNC-039·041).
-- 상태 변경은 Moderator/Admin만 한다(REQ-FUNC-042, 축소: 상태 변경만).
-- =============================================================
alter table report enable row level security;

create policy report_select_own_or_moderator
  on report
  for select
  to authenticated
  using (reporter_id = auth.uid() or is_moderator_or_admin(auth.uid()));

create policy report_insert_self
  on report
  for insert
  to authenticated
  with check (reporter_id = auth.uid());

create policy report_update_moderator_only
  on report
  for update
  to authenticated
  using (is_moderator_or_admin(auth.uid()))
  with check (is_moderator_or_admin(auth.uid()));

-- =============================================================
-- external_url_setting — 항공·숙소 외부 URL은 SCR-003(로그인 불필요)에서
-- 읽어야 하므로 SELECT는 공개한다(REQ-FUNC-016·024). 쓰기는 Moderator/Admin
-- 전용이다(REQ-FUNC-077).
-- =============================================================
alter table external_url_setting enable row level security;

create policy external_url_setting_select_public
  on external_url_setting
  for select
  to anon, authenticated
  using (true);

create policy external_url_setting_insert_moderator
  on external_url_setting
  for insert
  to authenticated
  with check (is_moderator_or_admin(auth.uid()));

create policy external_url_setting_update_moderator
  on external_url_setting
  for update
  to authenticated
  using (is_moderator_or_admin(auth.uid()))
  with check (is_moderator_or_admin(auth.uid()));
