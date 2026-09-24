#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import net from 'node:net';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SOURCE_SUPABASE = path.join(ROOT, 'supabase');
const SOURCE_MIGRATIONS = path.join(SOURCE_SUPABASE, 'migrations');
const FIXTURE_DIR = path.join(SOURCE_SUPABASE, 'bootstrap', 'prehistory');
const OUTPUT = path.join(ROOT, 'local-baseline-structural-diagnostic.json');

const BRANCH = 'result/artifact-collaboration-v1';
const EPHEMERAL_NAME = '20260827212519_pre_dementor_replay_fixture.sql';
const ARTIFACT_MIGRATION = '20260924002500_artifact_collaboration_v1.sql';
const PROJECT_ID = `dc-baseline-diff-${process.pid}`;

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

const env = { ...process.env, SUPABASE_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1' };
for (const key of [
  'SUPABASE_ACCESS_TOKEN',
  'SUPABASE_DB_PASSWORD',
  'SUPABASE_PROJECT_REF',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_SECRET_KEY',
]) delete env[key];

function fail(message) { throw new Error(message); }

function run(file, args, cwd, options = {}) {
  const printable = [file, ...args].join(' ');
  for (const needle of ['link', 'db push', '--linked', 'migration repair', 'projects']) {
    if (printable.includes(needle)) fail(`unsafe command rejected: ${printable}`);
  }
  return execFileSync(file, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: options.capture === false ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

function git(...args) { return run('git', args, ROOT).trim(); }
function gitBlob(file) { return git('hash-object', file); }

function assertSourceBoundary() {
  if (git('branch', '--show-current') !== BRANCH) fail(`expected branch ${BRANCH}`);
  if (fs.existsSync(path.join(SOURCE_SUPABASE, '.temp', 'project-ref'))) {
    fail('linked Supabase project metadata detected; diagnostic refuses linked execution');
  }
  if (fs.existsSync(path.join(SOURCE_MIGRATIONS, EPHEMERAL_NAME))) {
    fail(`${EPHEMERAL_NAME} must not exist permanently in supabase/migrations`);
  }
  for (const [name, expected] of EXPECTED_BLOBS) {
    const file = path.join(SOURCE_MIGRATIONS, name);
    if (!fs.existsSync(file)) fail(`missing migration: ${name}`);
    const actual = gitBlob(file);
    if (actual !== expected) fail(`migration drift: ${name} expected ${expected}, got ${actual}`);
  }
  for (const part of FIXTURE_PARTS) {
    if (!fs.existsSync(path.join(FIXTURE_DIR, part))) fail(`missing fixture part: ${part}`);
  }
}

function portFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen({ host: '127.0.0.1', port }, () => server.close(() => resolve(true)));
  });
}

async function assertPortsFree() {
  const ports = [54320,54321,54322,54323,54324,54325,54326,54327,54328,54329];
  const occupied = [];
  for (const port of ports) if (!(await portFree(port))) occupied.push(port);
  if (occupied.length) fail(`local Supabase ports in use: ${occupied.join(', ')}`);
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

function rewriteProjectId(configFile) {
  let config = fs.readFileSync(configFile, 'utf8');
  if (!/^project_id\s*=\s*"[^"]+"/m.test(config)) fail('project_id missing from temp config');
  config = config.replace(/^project_id\s*=\s*"[^"]+"/m, `project_id = "${PROJECT_ID}"`);
  fs.writeFileSync(configFile, config);
}

function materializeFixture(tempMigrations) {
  const body = FIXTURE_PARTS.map((part) =>
    `-- BEGIN ${part}\n${fs.readFileSync(path.join(FIXTURE_DIR, part), 'utf8').trim()}\n-- END ${part}\n`
  ).join('\n');
  fs.writeFileSync(path.join(tempMigrations, EPHEMERAL_NAME), body + '\n');
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

const PARTS_SQL = String.raw`
with parts as (
  select 'COL' as category, n.nspname||'.'||c.relname as object_key,
         'COL|'||n.nspname||'|'||c.relname||'|'||a.attnum||'|'||a.attname||'|'||
         format_type(a.atttypid,a.atttypmod)||'|'||a.attnotnull||'|'||
         coalesce(pg_get_expr(ad.adbin,ad.adrelid),'') as s
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  join pg_attribute a on a.attrelid=c.oid and a.attnum>0 and not a.attisdropped
  left join pg_attrdef ad on ad.adrelid=c.oid and ad.adnum=a.attnum
  where n.nspname in ('public','legacy_edu') and c.relkind in ('r','p')
  union all
  select 'TABLE', n.nspname||'.'||c.relname,
         'TABLE|'||n.nspname||'|'||c.relname||'|rls='||c.relrowsecurity||'|force='||c.relforcerowsecurity
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname in ('public','legacy_edu') and c.relkind in ('r','p')
  union all
  select 'CON', n.nspname||'.'||c.relname,
         'CON|'||n.nspname||'|'||c.relname||'|'||con.conname||'|'||pg_get_constraintdef(con.oid,true)
  from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace
  where n.nspname in ('public','legacy_edu')
  union all
  select 'IDX', n.nspname||'.'||t.relname,
         'IDX|'||n.nspname||'|'||t.relname||'|'||i.relname||'|'||pg_get_indexdef(i.oid)
  from pg_index x join pg_class t on t.oid=x.indrelid join pg_namespace n on n.oid=t.relnamespace
  join pg_class i on i.oid=x.indexrelid
  where n.nspname in ('public','legacy_edu')
  union all
  select 'POL', schemaname||'.'||tablename,
         'POL|'||schemaname||'|'||tablename||'|'||policyname||'|'||cmd||'|'||
         array_to_string(roles,',')||'|'||coalesce(qual,'')||'|'||coalesce(with_check,'')
  from pg_policies where schemaname in ('public','legacy_edu')
  union all
  select 'TRG', n.nspname||'.'||c.relname,
         'TRG|'||n.nspname||'|'||c.relname||'|'||t.tgname||'|'||pg_get_triggerdef(t.oid,true)
  from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace
  where not t.tgisinternal and (
    n.nspname='public' or (n.nspname='auth' and c.relname='users' and t.tgname='on_auth_user_created')
  )
  union all
  select 'ENUM', n.nspname||'.'||ty.typname,
         'ENUM|'||n.nspname||'|'||ty.typname||'|'||
    (select string_agg(e.enumlabel,',' order by e.enumsortorder) from pg_enum e where e.enumtypid=ty.oid)
  from pg_type ty join pg_namespace n on n.oid=ty.typnamespace
  where n.nspname='public' and ty.typtype='e'
  union all
  select 'FUN', n.nspname||'.'||p.proname||'('||pg_get_function_identity_arguments(p.oid)||')',
         'FUN|'||n.nspname||'|'||p.proname||'|'||pg_get_function_identity_arguments(p.oid)||'|'||
         regexp_replace(pg_get_functiondef(p.oid),'\s+',' ','g')
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and (p.proname='handle_new_user' or p.proname like 'dc_%' or p.proname like 'mp_%')
)
select json_build_object('category',category,'object_key',object_key,'s',s)::text
from parts
order by category,object_key,s;
`;

function md5(value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

function summarize(parts) {
  const byCategory = {};
  const byObject = {};
  for (const part of parts) {
    byCategory[part.category] ??= [];
    byCategory[part.category].push(part.s);
    const key = `${part.category}|${part.object_key}`;
    byObject[key] ??= [];
    byObject[key].push(part.s);
  }
  const categoryCounts = {};
  const categoryMd5 = {};
  for (const [category, values] of Object.entries(byCategory).sort()) {
    values.sort();
    categoryCounts[category] = values.length;
    categoryMd5[category] = md5(values.join('\n'));
  }
  const objectDigests = Object.entries(byObject).sort(([a],[b]) => a.localeCompare(b)).map(([key, values]) => {
    values.sort();
    const [category, ...rest] = key.split('|');
    return { category, object_key: rest.join('|'), part_count: values.length, md5: md5(values.join('\n')) };
  });
  return { categoryCounts, categoryMd5, objectDigests };
}

function assertMigration(container, version) {
  const count = psql(container,
    `select count(*)::text from supabase_migrations.schema_migrations where version='${version}';`);
  if (count !== '1') fail(`migration ${version} not applied`);
}

async function main() {
  assertSourceBoundary();
  await assertPortsFree();
  run('docker', ['info'], ROOT);

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'dc-baseline-diff-'));
  const tempSupabase = path.join(tempRoot, 'supabase');
  let started = false;

  try {
    copySupabase(SOURCE_SUPABASE, tempSupabase);
    rewriteProjectId(path.join(tempSupabase, 'config.toml'));
    const tempMigrations = path.join(tempSupabase, 'migrations');
    materializeFixture(tempMigrations);

    const artifactPath = path.join(tempMigrations, ARTIFACT_MIGRATION);
    const heldDir = path.join(tempRoot, 'held');
    fs.mkdirSync(heldDir);
    fs.renameSync(artifactPath, path.join(heldDir, ARTIFACT_MIGRATION));

    console.log('[diagnostic] replaying local baseline with Artifact Collaboration withheld');
    run('supabase', ['start'], tempRoot, { capture: false });
    started = true;
    const container = findDbContainer();

    for (const version of ['20260827212520','20260827212614','20260828170411','20260921134959']) {
      assertMigration(container, version);
    }
    const artifactCount = psql(container,
      `select count(*)::text from supabase_migrations.schema_migrations where version='20260924002500';`);
    if (artifactCount !== '0') fail('Artifact Collaboration migration must remain withheld in diagnostic');

    const raw = psql(container, PARTS_SQL);
    const parts = raw ? raw.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)) : [];
    const summary = summarize(parts);
    const sortedStrings = parts.map((p) => p.s).sort();
    const output = {
      generated_at: new Date().toISOString(),
      source_branch: git('branch','--show-current'),
      source_head: git('rev-parse','HEAD'),
      fixture_commit_present: git('merge-base','--is-ancestor','e58edb6a931c8536a7ed4cbe907d0b38c5ba4c9e','HEAD') === '',
      artifact_collaboration_withheld: true,
      applied_checkpoint: '20260921134959',
      total_parts: sortedStrings.length,
      structural_md5: md5(sortedStrings.join('\n')),
      historical_git_blob_hashes: Object.fromEntries(EXPECTED_BLOBS),
      ...summary,
      parts: parts.map((p) => ({ ...p, md5: md5(p.s) })),
    };

    fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n');
    console.log('[diagnostic] wrote ' + OUTPUT);
    console.log('[diagnostic] total_parts=' + output.total_parts + ' structural_md5=' + output.structural_md5);
    console.log('[diagnostic] categoryCounts=' + JSON.stringify(output.categoryCounts));
    console.log('[diagnostic] categoryMd5=' + JSON.stringify(output.categoryMd5));
  } finally {
    try {
      if (started) run('supabase', ['stop', '--no-backup'], tempRoot, { capture: false });
    } catch (error) {
      console.error('[cleanup] supabase stop failed:', error.message);
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
    console.log('[cleanup] temporary workspace removed');
  }
}

await main();
