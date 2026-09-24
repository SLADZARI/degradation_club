#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SOURCE_SUPABASE = path.join(ROOT, 'supabase');
const SOURCE_MIGRATIONS = path.join(SOURCE_SUPABASE, 'migrations');
const FIXTURE_DIR = path.join(SOURCE_SUPABASE, 'bootstrap', 'prehistory');
const OVERLAY_DIR = path.join(SOURCE_SUPABASE, 'bootstrap', 'production-compatibility');
const G5_EVIDENCE_OUTPUT = path.join(ROOT, 'artifact-collaboration-g5-runtime-evidence.json');

const BRANCH = 'result/artifact-collaboration-v1';
const EPHEMERAL_NAME = '20260827212519_pre_dementor_replay_fixture.sql';
const OVERLAY_EPHEMERAL_NAME = '20260924002459_observed_production_compatibility_overlay.sql';
const ARTIFACT_MIGRATION = '20260924002500_artifact_collaboration_v1.sql';
const PROJECT_ID = `dc-prehistory-replay-v1-${process.pid}`;

const EXPECTED_BLOBS = new Map([
  ['20260827212520_archive_edu_and_create_dementor_core.sql', 'ad1e8762167dc1a01f023b70247abdbff808bde7'],
  ['20260827212614_secure_legacy_edu_archive.sql', 'c69bbdfdb8e5e00f6a3b569e925349e15a5076ce'],
  ['20260828170411_dc_workspace_readonly_v01.sql', '6d313eda5d8fa23713e2186dac0f39317d4f28d1'],
  [ARTIFACT_MIGRATION, 'b18b79b78643bd0509797ca1e621bf8f77edbdf3'],
]);

const FIXTURE_PARTS = [
  '01_pre_dementor_edu_schema.sql',
  '02_minimal_synthetic_auth_identities.sql',
  '03_auth_trigger_binding.sql',
];

const OVERLAY_PARTS = [
  '01_observed_production_functions.sql',
  '02_observed_production_policies.sql',
];

const PRE_OVERLAY_PARTS = 1292;
const PRE_OVERLAY_MD5 = '55e1ea1b2484f4d4516f47c06313f27b';
const PROD_BASELINE_PARTS = 1291;
const PROD_BASELINE_MD5 = 'beb6fcdf35c889bfa37fd1d725507b7e';

const PROD_FUNCTION_MD5 = new Map([
  ['dc_admin_board_hide_artifact_v1', '6fc28f04c0eff2fa5e64bbda2ca5e4b4'],
  ['dc_admin_promote_artifact_telegram_v1', '1f9a6d47a48c7c3484797512767b3be4'],
  ['dc_admin_resolve_delivery_unknown_v1', '06539d44bfda8443233bdffc5c210f2b'],
  ['dc_admin_suppress_artifact_telegram_v1', '4e01df82431ebeb3dc87deab0fbc8b1a'],
  ['dc_distribution_claim_pending_v1', '12f9b77606024aeaca8be8e5dd8c27a3'],
  ['dc_guest_board_interest_toggle_v1', 'c7f9ea81133f4247b8ddd397262ea0a6'],
  ['dc_member_entry_status_v1', '5c1f6ccc545a78ffa417d3a7e08f0ede'],
  ['dc_publish_artifact_v1', '493116fc98e49dc707ce8c95d5139289'],
  ['dc_set_artifact_activity_v1', '48ca201a438f0d2cc238aa9f4ff91945'],
  ['dc_submit_membership_application_v2', '65c6ebd469c61b01e69740450fad33a0'],
]);

const ARTIFACT_REPLACED_FUNCTION_MARKERS = new Map([
  ['dc_distribution_claim_pending_v1', ['ARTIFACT_NOT_DISTRIBUTABLE', "a.visibility='community'"]],
  ['dc_guest_board_interest_toggle_v1', ['dc_can_interact_artifact_v1']],
  ['dc_publish_artifact_v1', ['CIRCLE_IDEA_REQUIRED', "'not_applicable'"]],
]);

const env = { ...process.env, SUPABASE_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1' };
for (const key of [
  'SUPABASE_ACCESS_TOKEN',
  'SUPABASE_DB_PASSWORD',
  'SUPABASE_PROJECT_REF',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_SECRET_KEY',
]) delete env[key];

function fail(message) {
  throw new Error(message);
}

function run(file, args, cwd, options = {}) {
  const forbidden = ['link', 'db push', '--linked', 'migration repair', 'projects'];
  const printable = [file, ...args].join(' ');
  if (forbidden.some((needle) => printable.includes(needle))) {
    fail(`unsafe command rejected: ${printable}`);
  }
  return execFileSync(file, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: options.capture === false ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

function git(...args) {
  return run('git', args, ROOT).trim();
}

function gitBlob(file) {
  return git('hash-object', file);
}

function checkSourceBoundary() {
  if (git('branch', '--show-current') !== BRANCH) {
    fail(`expected branch ${BRANCH}`);
  }
  if (fs.existsSync(path.join(SOURCE_MIGRATIONS, EPHEMERAL_NAME))) {
    fail(`${EPHEMERAL_NAME} must never exist permanently in supabase/migrations`);
  }
  if (fs.existsSync(path.join(SOURCE_MIGRATIONS, OVERLAY_EPHEMERAL_NAME))) {
    fail(`${OVERLAY_EPHEMERAL_NAME} must never exist permanently in supabase/migrations`);
  }
  for (const [name, expected] of EXPECTED_BLOBS) {
    const file = path.join(SOURCE_MIGRATIONS, name);
    if (!fs.existsSync(file)) fail(`missing migration: ${name}`);
    const actual = gitBlob(file);
    if (actual !== expected) {
      fail(`historical migration drift: ${name} expected ${expected}, got ${actual}`);
    }
  }
  for (const part of FIXTURE_PARTS) {
    if (!fs.existsSync(path.join(FIXTURE_DIR, part))) fail(`missing fixture part: ${part}`);
  }
  for (const part of OVERLAY_PARTS) {
    if (!fs.existsSync(path.join(OVERLAY_DIR, part))) fail(`missing production compatibility overlay part: ${part}`);
  }

  const artifactSql = fs.readFileSync(path.join(SOURCE_MIGRATIONS, ARTIFACT_MIGRATION), 'utf8');
  for (const [name] of ARTIFACT_REPLACED_FUNCTION_MARKERS) {
    if (!artifactSql.includes(`create or replace function public.${name}`)) {
      fail(`Artifact Collaboration migration no longer owns expected replacement function: ${name}`);
    }
  }
  for (const name of PROD_FUNCTION_MD5.keys()) {
    if (!ARTIFACT_REPLACED_FUNCTION_MARKERS.has(name)
        && artifactSql.includes(`create or replace function public.${name}`)) {
      fail(`Artifact Collaboration unexpectedly mutates unrelated production-drift function: ${name}`);
    }
  }

  const sourceLink = path.join(SOURCE_SUPABASE, '.temp', 'project-ref');
  if (fs.existsSync(sourceLink)) {
    fail('linked Supabase project metadata detected in source checkout; validator refuses to run with a linked execution path');
  }
}

function portFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen({ host: '127.0.0.1', port }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function assertDefaultPortsFree() {
  const ports = [54320,54321,54322,54323,54324,54325,54326,54327,54328,54329];
  const occupied = [];
  for (const port of ports) {
    if (!(await portFree(port))) occupied.push(port);
  }
  if (occupied.length) {
    fail(`local Supabase ports already in use: ${occupied.join(', ')}. Stop the other local stack first.`);
  }
}

function copySupabase(src, dst) {
  fs.cpSync(src, dst, {
    recursive: true,
    filter(source) {
      const base = path.basename(source);
      return base !== '.temp' && base !== '.branches';
    },
  });
  fs.rmSync(path.join(dst, '.temp'), { recursive: true, force: true });
  fs.rmSync(path.join(dst, '.branches'), { recursive: true, force: true });
}

function rewriteTempProjectId(configFile) {
  let config = fs.readFileSync(configFile, 'utf8');
  if (!/^project_id\s*=\s*"[^"]+"/m.test(config)) fail('project_id missing from temp config');
  config = config.replace(/^project_id\s*=\s*"[^"]+"/m, `project_id = "${PROJECT_ID}"`);
  fs.writeFileSync(configFile, config);
}

function materializeFixture(tempMigrations) {
  const body = FIXTURE_PARTS.map((part) => {
    return `-- BEGIN ${part}\n${fs.readFileSync(path.join(FIXTURE_DIR, part), 'utf8').trim()}\n-- END ${part}\n`;
  }).join('\n');
  fs.writeFileSync(path.join(tempMigrations, EPHEMERAL_NAME), body + '\n');
}

function buildOverlaySql() {
  return OVERLAY_PARTS.map((part) => {
    return `-- BEGIN ${part}\n${fs.readFileSync(path.join(OVERLAY_DIR, part), 'utf8').trim()}\n-- END ${part}\n`;
  }).join('\n') + '\n';
}

function findDbContainer() {
  const names = run('docker', [
    'ps',
    '--filter', `label=com.supabase.cli.project=${PROJECT_ID}`,
    '--format', '{{.Names}}',
  ], ROOT).trim().split(/\r?\n/).filter(Boolean);
  const db = names.find((name) => name.startsWith('supabase_db_'));
  if (!db) fail(`local DB container not found for ${PROJECT_ID}`);
  return db;
}

function psql(container, sql) {
  return execFileSync('docker', [
    'exec', '-i', container,
    'psql', '-U', 'postgres', '-d', 'postgres',
    '-v', 'ON_ERROR_STOP=1', '-Atq',
  ], {
    cwd: ROOT,
    env,
    input: sql,
    encoding: 'utf8',
    stdio: ['pipe','pipe','pipe'],
  }).trim();
}

function psqlAs(container, userId, sql) {
  const claims = JSON.stringify({ sub: userId, role: 'authenticated' }).replaceAll("'", "''");
  return psql(container, `
set role authenticated;
set request.jwt.claim.sub = '${userId}';
set request.jwt.claim.role = 'authenticated';
set request.jwt.claims = '${claims}';
${sql}
`);
}

function expect(value, expected, label) {
  if (value !== expected) fail(`${label}: expected ${expected}, got ${value}`);
}

function expectIncludes(value, expected, label) {
  if (!value.includes(expected)) fail(`${label}: expected output containing ${expected}, got ${value}`);
}

function expectError(container, userId, sql, expected, label) {
  try {
    psqlAs(container, userId, sql);
    fail(`${label}: expected error ${expected}`);
  } catch (error) {
    const message = `${error.stderr || ''}\n${error.stdout || ''}\n${error.message || ''}`;
    if (!message.includes(expected)) {
      throw new Error(`${label}: expected ${expected}, got ${message}`);
    }
    return expected;
  }
}

const STRUCTURAL_FINGERPRINT_SQL = String.raw`
with parts as (
  select 'COL|'||n.nspname||'|'||c.relname||'|'||a.attnum||'|'||a.attname||'|'||
         format_type(a.atttypid,a.atttypmod)||'|'||a.attnotnull||'|'||
         coalesce(pg_get_expr(ad.adbin,ad.adrelid),'') as s
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  join pg_attribute a on a.attrelid=c.oid and a.attnum>0 and not a.attisdropped
  left join pg_attrdef ad on ad.adrelid=c.oid and ad.adnum=a.attnum
  where n.nspname in ('public','legacy_edu') and c.relkind in ('r','p')
  union all
  select 'TABLE|'||n.nspname||'|'||c.relname||'|rls='||c.relrowsecurity||'|force='||c.relforcerowsecurity
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname in ('public','legacy_edu') and c.relkind in ('r','p')
  union all
  select 'CON|'||n.nspname||'|'||c.relname||'|'||con.conname||'|'||pg_get_constraintdef(con.oid,true)
  from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace
  where n.nspname in ('public','legacy_edu')
  union all
  select 'IDX|'||n.nspname||'|'||t.relname||'|'||i.relname||'|'||pg_get_indexdef(i.oid)
  from pg_index x join pg_class t on t.oid=x.indrelid join pg_namespace n on n.oid=t.relnamespace
  join pg_class i on i.oid=x.indexrelid
  where n.nspname in ('public','legacy_edu')
  union all
  select 'POL|'||schemaname||'|'||tablename||'|'||policyname||'|'||cmd||'|'||
         array_to_string(roles,',')||'|'||coalesce(qual,'')||'|'||coalesce(with_check,'')
  from pg_policies where schemaname in ('public','legacy_edu')
  union all
  select 'TRG|'||n.nspname||'|'||c.relname||'|'||t.tgname||'|'||pg_get_triggerdef(t.oid,true)
  from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace
  where not t.tgisinternal and (
    n.nspname='public' or (n.nspname='auth' and c.relname='users' and t.tgname='on_auth_user_created')
  )
  union all
  select 'ENUM|'||n.nspname||'|'||ty.typname||'|'||
    (select string_agg(e.enumlabel,',' order by e.enumsortorder) from pg_enum e where e.enumtypid=ty.oid)
  from pg_type ty join pg_namespace n on n.oid=ty.typnamespace
  where n.nspname='public' and ty.typtype='e'
  union all
  select 'FUN|'||n.nspname||'|'||p.proname||'|'||pg_get_function_identity_arguments(p.oid)||'|'||
         regexp_replace(pg_get_functiondef(p.oid),'\s+',' ','g')
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and (p.proname='handle_new_user' or p.proname like 'dc_%' or p.proname like 'mp_%')
)
select count(*)::text||'|'||md5(string_agg(s,E'\n' order by s))
from parts;
`;

function assertMigrationApplied(container, version) {
  const value = psql(container, `
select count(*)::text
from supabase_migrations.schema_migrations
where version='${version}';
`);
  expect(value, '1', `migration ${version} applied`);
}

function functionDefinition(container, name) {
  return psql(container, `
select pg_get_functiondef(p.oid)
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname='${name}'
limit 1;
`);
}

function functionDefinitionMd5(container, name) {
  return psql(container, `
select md5(pg_get_functiondef(p.oid))
from pg_proc p
join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname='${name}'
limit 1;
`);
}

function policyObjectDigest(container, tableName) {
  return psql(container, `
with parts as (
  select 'POL|'||schemaname||'|'||tablename||'|'||policyname||'|'||cmd||'|'||
         array_to_string(roles,',')||'|'||coalesce(qual,'')||'|'||coalesce(with_check,'') as s
  from pg_policies
  where schemaname='public' and tablename='${tableName}'
)
select count(*)::text||'|'||md5(string_agg(s,E'\\n' order by s))
from parts;
`);
}

function assertObservedProductionBaseline(container) {
  for (const [name, expectedMd5] of PROD_FUNCTION_MD5) {
    expect(functionDefinitionMd5(container, name), expectedMd5, `observed production function ${name}`);
  }
  expect(policyObjectDigest(container, 'dc_merch_items'), '2|f3cd3bec89b94242b9a172e2ce364675',
    'observed production merch policies');
  expect(policyObjectDigest(container, 'join_applications'), '2|95dc0ae12336dd59502be84b40c03869',
    'observed production join_applications policies');
  const insertPolicy = psql(container, `
select count(*)::text from pg_policies
where schemaname='public'
  and tablename='join_applications'
  and policyname='join_applications_auth_insert';
`);
  expect(insertPolicy, '0', 'join_applications_auth_insert absent in observed production compatibility state');
}

function assertPostArtifactProductionCompatibility(container) {
  expect(policyObjectDigest(container, 'dc_merch_items'), '2|f3cd3bec89b94242b9a172e2ce364675',
    'Artifact Collaboration leaves merch read policy production-compatible');
  expect(policyObjectDigest(container, 'join_applications'), '2|95dc0ae12336dd59502be84b40c03869',
    'Artifact Collaboration leaves join_applications policy state production-compatible');

  for (const [name, expectedMd5] of PROD_FUNCTION_MD5) {
    if (ARTIFACT_REPLACED_FUNCTION_MARKERS.has(name)) continue;
    expect(functionDefinitionMd5(container, name), expectedMd5,
      `Artifact Collaboration leaves unrelated observed-production function unchanged: ${name}`);
  }

  for (const [name, markers] of ARTIFACT_REPLACED_FUNCTION_MARKERS) {
    const actualMd5 = functionDefinitionMd5(container, name);
    if (actualMd5 === PROD_FUNCTION_MD5.get(name)) {
      fail(`Artifact Collaboration failed to replace expected function: ${name}`);
    }
    const definition = functionDefinition(container, name);
    for (const marker of markers) {
      expectIncludes(definition, marker, `Artifact Collaboration function source ${name}`);
    }
  }
}

function installRuntimeUsers(container) {
  psql(container, `
insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,is_sso_user,is_anonymous)
values
('11111111-1111-4111-8111-111111111111','authenticated','authenticated','runtime-author@example.invalid','{}','{}',now(),now(),false,false),
('22222222-2222-4222-8222-222222222222','authenticated','authenticated','runtime-participant@example.invalid','{}','{}',now(),now(),false,false),
('33333333-3333-4333-8333-333333333333','authenticated','authenticated','runtime-outsider@example.invalid','{}','{}',now(),now(),false,false)
on conflict(id) do nothing;

update public.profiles
set display_name = case id
  when '11111111-1111-4111-8111-111111111111'::uuid then 'Runtime Author'
  when '22222222-2222-4222-8222-222222222222'::uuid then 'Runtime Participant'
  when '33333333-3333-4333-8333-333333333333'::uuid then 'Runtime Outsider'
  else display_name end
where id in (
  '11111111-1111-4111-8111-111111111111'::uuid,
  '22222222-2222-4222-8222-222222222222'::uuid,
  '33333333-3333-4333-8333-333333333333'::uuid
);

insert into public.dc_system_memberships(profile_id,status,source_system,source_ref,provenance_status,confirmed_at)
select id,'active','local-g5','prehistory-replay-runtime','confirmed',now()
from public.profiles
where id in (
  '11111111-1111-4111-8111-111111111111'::uuid,
  '22222222-2222-4222-8222-222222222222'::uuid,
  '33333333-3333-4333-8333-333333333333'::uuid
)
on conflict(profile_id) do update set status='active',valid_to=null,updated_at=now();

insert into public.dc_artifact_slot_grants(profile_id,amount,grant_key,reason,source_system,source_ref,provenance_status)
values ('11111111-1111-4111-8111-111111111111',1,'runtime-base-v1','Local G5 base slot','local-g5','prehistory-replay-runtime','confirmed')
on conflict(profile_id,grant_key) do nothing;
`);
  const count = psql(container, `
select count(*)::text from public.profiles
where id in (
  '11111111-1111-4111-8111-111111111111'::uuid,
  '22222222-2222-4222-8222-222222222222'::uuid,
  '33333333-3333-4333-8333-333333333333'::uuid
);
`);
  expect(count, '3', 'auth trigger created runtime profiles');
}

function runtimeMatrix(container) {
  const AUTHOR = '11111111-1111-4111-8111-111111111111';
  const PARTICIPANT = '22222222-2222-4222-8222-222222222222';
  const OUTSIDER = '33333333-3333-4333-8333-333333333333';
  const ADMIN = 'e9b8ec1d-76be-4607-bb5b-63c48c1b80fa';
  const matrix = {};

  installRuntimeUsers(container);

  const adminState = psqlAs(container, ADMIN, `select public.dc_is_owner_admin();`);
  expect(adminState, 't', 'Owner Admin historical authority');
  matrix.owner_admin_authority = 'PASS';

  const idea = psqlAs(container, AUTHOR, `
select public.dc_create_artifact_draft_v1('Runtime Circle Idea','Runtime Circle Idea',null,null,null);
`).split(/\r?\n/).filter(Boolean).at(-1);
  if (!/^[0-9a-f-]{36}$/i.test(idea)) fail(`invalid runtime idea id: ${idea}`);

  psqlAs(container, AUTHOR, `select public.dc_set_artifact_subtype_v1('${idea}'::uuid,'idea');`);
  psqlAs(container, AUTHOR, `select public.dc_set_artifact_visibility_v1('${idea}'::uuid,'circle');`);
  psqlAs(container, AUTHOR, `select public.dc_publish_artifact_v1('${idea}'::uuid);`);
  matrix.rpc_positive_publish_circle_idea = 'PASS';

  const outsiderReadBefore = psqlAs(container, OUTSIDER, `select public.dc_can_read_artifact_v1('${idea}'::uuid);`);
  expect(outsiderReadBefore, 'f', 'outsider cannot read Circle');
  const outsiderRls = psqlAs(container, OUTSIDER, `select count(*)::text from public.dc_artifacts where id='${idea}'::uuid;`);
  expect(outsiderRls, '0', 'Artifact RLS hides Circle from outsider');
  matrix.rls_negative_circle = 'PASS';

  expectError(container, OUTSIDER,
    `select * from public.dc_artifact_participants_read_v1('${idea}'::uuid);`,
    'ARTIFACT_NOT_AVAILABLE', 'hidden Circle participants no-oracle');
  expectError(container, OUTSIDER,
    `select * from public.dc_artifact_invite_candidates_v1('${idea}'::uuid,'runtime',5);`,
    'ARTIFACT_NOT_AVAILABLE', 'hidden Circle candidate lookup no-oracle');
  expectError(container, OUTSIDER,
    `select * from public.dc_artifact_invite_candidates_v1('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid,'runtime',5);`,
    'ARTIFACT_NOT_AVAILABLE', 'missing Artifact candidate lookup no-oracle');
  matrix.circle_no_oracle = 'PASS';

  expectError(container, OUTSIDER,
    `select public.dc_artifact_invite_v1('${idea}'::uuid,'${PARTICIPANT}'::uuid);`,
    'ARTIFACT_NOT_AVAILABLE', 'non-author invite rejected');
  expectError(container, OUTSIDER,
    `select public.dc_artifact_invitation_respond_v1('${idea}'::uuid,'JOINED');`,
    'ARTIFACT_NOT_AVAILABLE', 'join without invitation rejected');
  matrix.rpc_negative = 'PASS';

  psqlAs(container, AUTHOR,
    `select public.dc_artifact_invite_v1('${idea}'::uuid,'${PARTICIPANT}'::uuid);`);
  const invitedRead = psqlAs(container, PARTICIPANT,
    `select public.dc_can_read_artifact_v1('${idea}'::uuid)||'|'||public.dc_can_interact_artifact_v1('${idea}'::uuid);`);
  expect(invitedRead, 'true|false', 'INVITED read-only state');
  const invitedRls = psqlAs(container, PARTICIPANT,
    `select count(*)::text from public.dc_artifacts where id='${idea}'::uuid;`);
  expect(invitedRls, '1', 'INVITED Circle RLS read');

  psqlAs(container, PARTICIPANT,
    `select public.dc_artifact_invitation_respond_v1('${idea}'::uuid,'JOINED');`);
  const joinedState = psqlAs(container, PARTICIPANT,
    `select public.dc_can_read_artifact_v1('${idea}'::uuid)||'|'||public.dc_can_interact_artifact_v1('${idea}'::uuid);`);
  expect(joinedState, 'true|true', 'JOINED read/interact state');
  matrix.participation_rpc = 'PASS';

  const participants = psqlAs(container, AUTHOR,
    `select participation_state from public.dc_artifact_participants_read_v1('${idea}'::uuid) where profile_id='${PARTICIPANT}'::uuid;`);
  expect(participants, 'JOINED', 'participant roster');
  matrix.rpc_positive_participants = 'PASS';

  expectError(container, AUTHOR,
    `select public.dc_admin_grant_artifact_slots_v1('${OUTSIDER}'::uuid,1,'forbidden','local-g5');`,
    'OWNER_ADMIN_REQUIRED', 'non-admin slot grant rejected');

  psqlAs(container, ADMIN,
    `select public.dc_admin_grant_artifact_slots_v1('${OUTSIDER}'::uuid,2,'Local G5 explicit grant','local-g5/prehistory-replay');`);
  const slotTotal = psql(container,
    `select coalesce(sum(amount),0)::text from public.dc_artifact_slot_grants where profile_id='${OUTSIDER}'::uuid;`);
  expect(slotTotal, '2', 'Owner Admin slot grant total');
  matrix.slots = 'PASS';

  const relation1 = psqlAs(container, PARTICIPANT, `
select public.dc_board_relation_create_v1(
  'RELATED_TO','artifact','${idea}','program','dumai-s-opasnostyu'
);
`).split(/\r?\n/).filter(Boolean).at(-1);
  if (!/^[0-9a-f-]{36}$/i.test(relation1)) fail('participant RELATED_TO did not return relation id');
  expectError(container, PARTICIPANT, `
select public.dc_board_relation_create_v1(
  'ABOUT','artifact','${idea}','program','ne-komanda'
);
`, 'RELATION_WRITE_FORBIDDEN', 'participant semantic relation rejected');
  psqlAs(container, PARTICIPANT, `select public.dc_board_relation_delete_v1('${relation1}'::uuid);`);

  const relation2 = psqlAs(container, PARTICIPANT, `
select public.dc_board_relation_create_v1(
  'RELATED_TO','artifact','${idea}','program','dengi-na-veter'
);
`).split(/\r?\n/).filter(Boolean).at(-1);
  psqlAs(container, ADMIN, `select public.dc_board_relation_delete_v1('${relation2}'::uuid);`);
  const deleted = psql(container,
    `select count(*)::text from public.dc_board_relations where id in ('${relation1}'::uuid,'${relation2}'::uuid) and deleted_at is not null;`);
  expect(deleted, '2', 'relation delete paths');
  matrix.relations = 'PASS';
  matrix.owner_admin_relation_delete = 'PASS';

  const objectPath = `${AUTHOR}/runtime-circle.txt`;
  psql(container, `
insert into storage.objects(bucket_id,name,owner,owner_id)
values ('dc-community-artifacts','${objectPath}','${AUTHOR}'::uuid,'${AUTHOR}')
on conflict(bucket_id,name) do nothing;

insert into public.dc_artifact_media(artifact_id,owner_profile_id,media_type,storage_bucket,storage_path,metadata)
values ('${idea}'::uuid,'${AUTHOR}'::uuid,'file','dc-community-artifacts','${objectPath}','{}'::jsonb)
on conflict do nothing;
`);

  const outsiderStorage = psqlAs(container, OUTSIDER,
    `select count(*)::text from storage.objects where bucket_id='dc-community-artifacts' and name='${objectPath}';`);
  expect(outsiderStorage, '0', 'Storage RLS hides Circle object');
  const joinedStorage = psqlAs(container, PARTICIPANT,
    `select count(*)::text from storage.objects where bucket_id='dc-community-artifacts' and name='${objectPath}';`);
  expect(joinedStorage, '1', 'JOINED can read Circle object');
  const adminStorage = psqlAs(container, ADMIN,
    `select count(*)::text from storage.objects where bucket_id='dc-community-artifacts' and name='${objectPath}';`);
  expect(adminStorage, '1', 'Owner Admin can read Circle object');
  matrix.storage_privacy = 'PASS';

  const idea2 = psqlAs(container, AUTHOR, `
select public.dc_create_artifact_draft_v1('Runtime Circle Idea 2','Runtime Circle Idea 2',null,null,null);
`).split(/\r?\n/).filter(Boolean).at(-1);
  if (!/^[0-9a-f-]{36}$/i.test(idea2)) fail(`invalid second runtime idea id: ${idea2}`);
  psqlAs(container, AUTHOR, `select public.dc_set_artifact_subtype_v1('${idea2}'::uuid,'idea');`);
  psqlAs(container, AUTHOR, `select public.dc_set_artifact_visibility_v1('${idea2}'::uuid,'circle');`);
  expectError(container, AUTHOR,
    `select public.dc_publish_artifact_v1('${idea2}'::uuid);`,
    'NO_ARTIFACT_SLOT_AVAILABLE', 'slot capacity ceiling');
  psqlAs(container, AUTHOR, `select public.dc_close_artifact_v1('${idea}'::uuid);`);
  psqlAs(container, AUTHOR, `select public.dc_publish_artifact_v1('${idea2}'::uuid);`);
  const idea2Status = psql(container, `select status from public.dc_artifacts where id='${idea2}'::uuid;`);
  expect(idea2Status, 'active', 'slot release allows second Idea publish');
  matrix.slot_capacity_ceiling_release = 'PASS';

  return matrix;
}

async function main() {
  checkSourceBoundary();
  await assertDefaultPortsFree();

  run('docker', ['info'], ROOT);

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dc-prehistory-replay-'));
  const tempSupabase = path.join(tempRoot, 'supabase');
  let started = false;
  const evidence = {
    branch: BRANCH,
    source_head: git('rev-parse', 'HEAD'),
    project_id: PROJECT_ID,
    temporary_workspace: tempRoot,
    historical_git_blob_hashes: Object.fromEntries(EXPECTED_BLOBS),
    pre_overlay: {},
    post_overlay: {},
    full_replay: {},
    repeatability: {},
    runtime_matrix: {},
    cleanup: 'PENDING',
  };

  try {
    copySupabase(SOURCE_SUPABASE, tempSupabase);
    rewriteTempProjectId(path.join(tempSupabase, 'config.toml'));

    const tempLink = path.join(tempSupabase, '.temp', 'project-ref');
    if (fs.existsSync(tempLink)) fail('linked project metadata present in temporary workspace');

    const tempMigrations = path.join(tempSupabase, 'migrations');
    materializeFixture(tempMigrations);

    const artifactPath = path.join(tempMigrations, ARTIFACT_MIGRATION);
    const heldDir = path.join(tempRoot, 'held');
    fs.mkdirSync(heldDir);
    const heldArtifact = path.join(heldDir, ARTIFACT_MIGRATION);
    const heldOverlay = path.join(heldDir, OVERLAY_EPHEMERAL_NAME);
    fs.renameSync(artifactPath, heldArtifact);
    fs.writeFileSync(heldOverlay, buildOverlaySql());

    console.log('[phase 1] clean tracked baseline replay with Artifact Collaboration and overlay withheld');
    run('supabase', ['start'], tempRoot, { capture: false });
    started = true;
    let container = findDbContainer();

    for (const version of ['20260827212520','20260827212614','20260828170411','20260921134959']) {
      assertMigrationApplied(container, version);
    }
    const preOverlayFingerprint = psql(container, STRUCTURAL_FINGERPRINT_SQL);
    expect(preOverlayFingerprint, `${PRE_OVERLAY_PARTS}|${PRE_OVERLAY_MD5}`, 'tracked pre-overlay structural fingerprint');
    evidence.pre_overlay = {
      migrations: ['20260827212520','20260827212614','20260828170411','20260921134959'],
      structural_parts: PRE_OVERLAY_PARTS,
      structural_md5: PRE_OVERLAY_MD5,
      status: 'PASS',
    };

    console.log('[phase 2] apply observed production compatibility overlay locally');
    psql(container, fs.readFileSync(heldOverlay, 'utf8'));
    const postOverlayFingerprint = psql(container, STRUCTURAL_FINGERPRINT_SQL);
    expect(postOverlayFingerprint, `${PROD_BASELINE_PARTS}|${PROD_BASELINE_MD5}`, 'observed production structural fingerprint after overlay');
    assertObservedProductionBaseline(container);
    evidence.post_overlay = {
      structural_parts: PROD_BASELINE_PARTS,
      structural_md5: PROD_BASELINE_MD5,
      exact_observed_production_compatibility: 'PASS',
      status: 'PASS',
    };

    fs.copyFileSync(heldOverlay, path.join(tempMigrations, OVERLAY_EPHEMERAL_NAME));
    fs.renameSync(heldArtifact, artifactPath);

    console.log('[phase 3] full clean reset including compatibility overlay + Artifact Collaboration');
    run('supabase', ['db', 'reset', '--local'], tempRoot, { capture: false });
    container = findDbContainer();
    assertMigrationApplied(container, '20260924002459');
    assertMigrationApplied(container, '20260924002500');
    const participationTable = psql(container,
      `select to_regclass('public.dc_artifact_participation_events') is not null;`);
    expect(participationTable, 't', 'Artifact Collaboration participation table');
    assertPostArtifactProductionCompatibility(container);
    evidence.full_replay = {
      compatibility_overlay: '20260924002459',
      artifact_migration: '20260924002500',
      post_artifact_unrelated_production_drift_surfaces: 'PASS',
      status: 'PASS',
    };

    console.log('[phase 4] repeatability reset');
    run('supabase', ['db', 'reset', '--local'], tempRoot, { capture: false });
    container = findDbContainer();
    assertMigrationApplied(container, '20260924002459');
    assertMigrationApplied(container, '20260924002500');
    assertPostArtifactProductionCompatibility(container);
    evidence.repeatability = { second_full_reset: 'PASS', compatibility_overlay_replayed: 'PASS' };

    console.log('[phase 5] Artifact Collaboration G5 runtime matrix');
    evidence.runtime_matrix = runtimeMatrix(container);
    evidence.status = 'PASS';

    console.log('[PASS] observed-production-compatible replay + Artifact Collaboration G5 runtime');
    console.log(JSON.stringify(evidence, null, 2));
  } catch (error) {
    evidence.status = 'FAIL';
    evidence.error = error?.message || String(error);
    throw error;
  } finally {
    try {
      if (started) run('supabase', ['stop', '--no-backup'], tempRoot, { capture: false });
    } catch (error) {
      console.error('[cleanup] supabase stop failed:', error.message);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
    evidence.cleanup = 'TEMP_WORKSPACE_REMOVED';
    fs.writeFileSync(G5_EVIDENCE_OUTPUT, JSON.stringify(evidence, null, 2) + '\n');
    console.log('[cleanup] temporary workspace removed');
    console.log('[evidence] wrote ' + G5_EVIDENCE_OUTPUT);
  }
}

await main();
