-- 문의·SNS 링크를 external_url_setting에서 관리하도록 category를 넓힌다.
-- REQ-FUNC-062, docs/PROJECT_SCOPE.md("문의·SNS 링크를 관리자 외부 URL 설정
-- 범위에 포함해 관리하고, 빈 값은 렌더링하지 않는다").
--
-- 0001_schema.sql은 category를 flight/hotel로만 제한했다. 이미 적용됐을 수
-- 있는 마이그레이션을 고치지 않고, 여기서 제약만 교체한다(테이블 수는 그대로
-- 6개). 허용 프로토콜: 모든 category는 https, 문의(contact)만 mailto도 허용.

alter table external_url_setting
  drop constraint if exists external_url_setting_category_check;

alter table external_url_setting
  add constraint external_url_setting_category_check check (
    category in ('flight', 'hotel', 'contact', 'instagram', 'youtube', 'blog')
  );

alter table external_url_setting
  drop constraint if exists external_url_setting_url_check;

alter table external_url_setting
  add constraint external_url_setting_url_check check (
    url like 'https://%'
    or (category = 'contact' and url like 'mailto:%')
  );
