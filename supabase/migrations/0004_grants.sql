-- 테이블 권한(GRANT) 명시. REQ-NF-013.
-- 호스팅 Supabase는 프로젝트 설정에 따라 public 스키마 새 테이블의 기본 권한이
-- 다를 수 있다. RLS는 "허용된 역할이 어떤 행을 보는지"만 정하고, 역할이 테이블에
-- 접근할 권한(GRANT) 자체는 따로 필요하다(service_role도 마찬가지). 로컬 기본값에
-- 기대지 않도록 필요한 권한을 명시한다. 행 단위 접근은 여전히 0002_rls.sql의
-- 정책이 제한한다.

grant usage on schema public to anon, authenticated, service_role;

-- 비로그인: 공개 목록(동행글)과 외부 URL 설정만 읽는다.
grant select on mate_post, external_url_setting to anon;

-- 로그인 사용자: RLS 정책 범위 안에서 읽기·쓰기.
grant select, insert, update, delete on
  mate_post,
  mate_application,
  user_block,
  external_url_setting
to authenticated;

-- user_profile: RLS(update_self·insert_self)는 "본인 행"만 보장하고 열은 가리지
-- 않는다. role 열까지 열어 두면 본인이 role을 'admin'으로 바꿔 관리자 권한을
-- 얻을 수 있으므로, 쓰기는 role·id(수정 시)를 뺀 열로만 허용한다.
-- Supabase 기본 권한이 이미 테이블 전체 INSERT/UPDATE를 줬을 수 있어, 먼저
-- 회수한 뒤 열 단위로 다시 준다(열 GRANT만으로는 테이블 GRANT를 좁히지 못한다).
revoke insert, update on user_profile from anon, authenticated;
grant select, delete on user_profile to authenticated;
grant insert (
  id, nickname, age_range, gender, travel_style, bio, is_adult, adult_verified_at
) on user_profile to authenticated;
grant update (
  nickname, age_range, gender, travel_style, bio, is_adult, adult_verified_at
) on user_profile to authenticated;

-- report: 신고자는 접수 열만 쓴다(status·resolved_* 는 Moderator/Admin 경로 전용).
revoke insert, update on report from anon, authenticated;
grant select on report to authenticated;
grant insert (
  reporter_id, target_type, target_id, reason_code, description
) on report to authenticated;
grant update (status, resolved_by, resolved_at) on report to authenticated;

-- 서버 전용 Service Role(RLS 우회)도 테이블 권한은 따로 필요하다.
grant all on
  user_profile,
  mate_post,
  mate_application,
  user_block,
  report,
  external_url_setting
to service_role;

-- RLS 정책 안에서 호출하는 역할 확인 함수.
grant execute on function is_moderator_or_admin(uuid)
  to anon, authenticated, service_role;
