-- Local-only prehistory replay fixture: minimal synthetic Auth identities.
-- Stable UUIDs are copied only because they are literals in historical migrations.
-- All other identity values are synthetic and non-production.

insert into auth.users (
  id,
  aud,
  role,
  email,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user,
  is_anonymous
)
values
  (
    'e9b8ec1d-76be-4607-bb5b-63c48c1b80fa'::uuid,
    'authenticated',
    'authenticated',
    'fixture-owner-admin-1@example.invalid',
    '{}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  ),
  (
    '8c79a5a1-88a9-41cc-98d7-a487df690674'::uuid,
    'authenticated',
    'authenticated',
    'fixture-owner-admin-2@example.invalid',
    '{}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    false,
    false
  );
