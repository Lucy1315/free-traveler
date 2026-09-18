-- 테이블 권한(GRANT) 명시. REQ-NF-013.
-- 호스팅 Supabase는 프로젝트 설정에 따라 public 스키마 새 테이블의 기본 권한이
-- 다를 수 있다. RLS는 "허용된 역할이 어떤 행을 보는지"만 정하고, 역할이 테이블에
-- 접근할 권한(GRANT) 자체는 따로 필요하다(service_role도 마찬가지). 로컬 기본값에
-- 기대지 않도록 필요한 권한을 명시한다. 행 단위 접근은 여전히 0002_rls.sql의
-- 정책이 제한한다.

grant usage on schema public to anon, authenticated, service_role;

-- 비로그인: 공개 목록(동행글)과 외부 URL 설정만 읽는다.
grant select on mate_post, external_url_setting to anon;

-- 로그인 사용자: 6개 테이블 모두 RLS 정책 범위 안에서 읽기·쓰기.
grant select, insert, update, delete on
  user_profile,
  mate_post,
  mate_application,
  user_block,
  report,
  external_url_setting
to authenticated;

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
