import fs from 'node:fs';

const failures = [];
const expect = (ok, message) => { if (!ok) failures.push(message); };
const read = (path) => fs.readFileSync(path, 'utf8');

const migrationPath = 'supabase/migrations/20260918094000_board_relations_v1.sql';
const migration = read(migrationPath);
const workflow = read('.github/workflows/site-integrity.yml');

function extractFunction(name) {
  const escaped = name.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
  const match = migration.match(new RegExp(`create or replace function public\\.${escaped}\\([\\s\\S]*?\\$function\\$;`, 'm'));
  return match?.[0] || '';
}

const tableBlock = migration.match(/create table public\.dc_board_relations\s*\([\s\S]*?\n\);/m)?.[0] || '';
const readFn = extractFunction('dc_board_relations_read_v1');
const createFn = extractFunction('dc_board_relation_create_v1');
const deleteFn = extractFunction('dc_board_relation_delete_v1');
const guardFn = extractFunction('dc_board_relation_source_slug_guard_v1');

// Core owner and minimal audit shape.
expect(Boolean(tableBlock), 'dc_board_relations table DDL missing');
for (const column of [
  'id uuid',
  'relation_type text',
  'origin_kind text',
  'origin_source_id text',
  'target_kind text',
  'target_source_id text',
  'created_by uuid',
  'created_at timestamptz',
  'deleted_by uuid',
  'deleted_at timestamptz',
]) expect(tableBlock.includes(column), `required relation column missing: ${column}`);
expect(!/^\s*status\s+/m.test(tableBlock), 'relation lifecycle/status column is forbidden');
expect(!/^\s*(archived_at|restored_at|moderation_state)\s+/m.test(tableBlock), 'relation lifecycle/moderation state leaked into persistence');
expect(/dc_board_relations_delete_audit_check[\s\S]*deleted_at is null and deleted_by is null[\s\S]*deleted_at is not null and deleted_by is not null/m.test(tableBlock), 'soft-delete audit integrity check missing');

// Exact persisted vocabulary: no Project/Product/Person/Course/Practice endpoint namespaces.
for (const type of ['RELATED_TO','RESULT_OF','CONTINUES','ABOUT','REPORT_OF']) {
  expect(tableBlock.includes(`'${type}'`), `persisted relation type missing: ${type}`);
}
expect(!tableBlock.includes("'PARTICIPATES_IN'"), 'PARTICIPATES_IN must not be persisted');
expect(/origin_kind in \('artifact','event','program'\)/.test(tableBlock), 'origin endpoint kind allow-list drifted');
expect(/target_kind in \('artifact','event','program'\)/.test(tableBlock), 'target endpoint kind allow-list drifted');
expect(!/^\s*(origin|target)_entity_id\s+/m.test(tableBlock), 'dc_entities UUID leaked into persisted endpoint identity');
expect(!/^\s*(origin|target)_(projection|card|dom)_/m.test(tableBlock), 'Board projection/card/DOM identity leaked into persistence');
expect(!tableBlock.includes('thing_ref') && !tableBlock.includes('thing_id'), 'Thing registry identity leaked into relation persistence');

// Pair matrix and self-edge.
expect(tableBlock.includes('dc_board_relations_no_self_edge_check'), 'DB self-edge check missing');
expect(/relation_type = 'RESULT_OF' and target_kind = 'artifact'/.test(tableBlock), 'RESULT_OF matrix drifted');
expect(/relation_type = 'CONTINUES' and origin_kind = target_kind/.test(tableBlock), 'CONTINUES matrix drifted');
expect(/relation_type = 'ABOUT' and origin_kind = 'artifact'/.test(tableBlock), 'ABOUT matrix drifted');
expect(/relation_type = 'REPORT_OF' and origin_kind = 'artifact' and target_kind in \('event','program'\)/.test(tableBlock), 'REPORT_OF matrix drifted');

const kinds = ['artifact','event','program'];
const pairAllowed = (type, origin, target) => {
  if (!kinds.includes(origin) || !kinds.includes(target)) return false;
  if (type === 'RELATED_TO') return true;
  if (type === 'RESULT_OF') return target === 'artifact';
  if (type === 'CONTINUES') return origin === target;
  if (type === 'ABOUT') return origin === 'artifact';
  if (type === 'REPORT_OF') return origin === 'artifact' && ['event','program'].includes(target);
  return false;
};
expect(pairAllowed('RESULT_OF','event','artifact'), 'validator model fixture RESULT_OF failed');
expect(!pairAllowed('RESULT_OF','artifact','event'), 'validator model must reject inverse RESULT_OF');
expect(pairAllowed('CONTINUES','program','program'), 'validator model fixture CONTINUES failed');
expect(!pairAllowed('CONTINUES','event','program'), 'validator model must reject cross-kind CONTINUES');
expect(!pairAllowed('PARTICIPATES_IN','artifact','event'), 'validator model must reject generic PARTICIPATES_IN');
expect(!pairAllowed('RELATED_TO','project','artifact'), 'validator model must reject unsupported endpoint kinds');

// RELATED_TO one unordered logical edge and active dedup.
expect(tableBlock.includes('dc_board_relations_related_order_check'), 'RELATED_TO normalized-order DB check missing');
expect(/relation_type <> 'RELATED_TO'[\s\S]*\(origin_kind, origin_source_id\) < \(target_kind, target_source_id\)/m.test(tableBlock), 'RELATED_TO DB normalization invariant missing');
expect(/create unique index dc_board_relations_active_edge_uidx[\s\S]*where deleted_at is null;/m.test(migration), 'active-edge unique dedup index missing');
expect(createFn.includes("v_relation_type = 'RELATED_TO'"), 'CREATE RPC lacks RELATED_TO branch');
expect(createFn.includes('v_store_origin_kind > v_store_target_kind'), 'CREATE RPC does not normalize RELATED_TO ordering');
const normalizeRelated = (aKind, aId, bKind, bId) => {
  const a = `${aKind}\u0000${aId}`;
  const b = `${bKind}\u0000${bId}`;
  return a < b ? `${a}|${b}` : `${b}|${a}`;
};
expect(
  normalizeRelated('artifact','00000000-0000-0000-0000-000000000001','event','fuengirola') ===
  normalizeRelated('event','fuengirola','artifact','00000000-0000-0000-0000-000000000001'),
  'A RELATED_TO B and B RELATED_TO A must normalize to one logical key'
);

// Source validation must use canonical source owners only.
for (const fn of [readFn, createFn]) {
  expect(fn.includes('public.dc_artifacts'), 'Artifact canonical source validation missing');
  expect(fn.includes("visibility = 'community'"), 'Artifact community visibility validation missing');
  expect(fn.includes('published_at is not null'), 'Artifact published validation missing');
  expect(fn.includes("status in ('active','expired','archived')"), 'Artifact history-visible state validation missing');
  expect(fn.includes('public.dc_entities'), 'Event/Program canonical mirror validation missing');
  expect(fn.includes('public.dc_events'), 'Event typed extension validation missing');
  expect(fn.includes('public.dc_programs'), 'Program typed extension validation missing');
  expect(fn.includes("provenance_status = 'confirmed'"), 'confirmed entity provenance validation missing');
}
expect(!migration.includes('entity:${id}'), 'entity:${id} must never be persisted');
expect(!createFn.includes('promoted_entity_id') && !createFn.includes('promoted_entity_type'), 'legacy promoted_entity fields repurposed as relation identity');

// Authorization: exact existing helpers + scoped Dementor predicate; no read-helper broadening.
for (const fn of [createFn, deleteFn]) {
  expect(fn.includes('public.dc_is_owner_admin(v_uid)'), 'Owner Admin path missing');
  expect(fn.includes('public.dc_membership_active(v_uid)'), 'active Membership predicate missing');
  expect(fn.includes("public.dc_has_role('dementor', v_uid)"), 'system Dementor predicate missing');
  expect(fn.includes('public.dc_entity_assignments'), 'scoped entity assignment predicate missing');
  expect(fn.includes("a.role = 'dementor'"), 'exact scoped assignment role=dementor missing');
  expect(fn.includes("a.status = 'active'"), 'scoped assignment status=active missing');
  expect(fn.includes("a.provenance_status = 'confirmed'"), 'scoped assignment confirmed provenance missing');
  expect(fn.includes('a.valid_from <= now()'), 'scoped assignment valid_from predicate missing');
  expect(fn.includes('(a.valid_to is null or a.valid_to > now())'), 'scoped assignment valid_to predicate missing');
  expect(!fn.includes('dc_can_read_entity'), 'read helper dc_can_read_entity must not authorize relation writes');
  expect(!/a\.role\s*=\s*'author'/.test(fn), 'role=author must not authorize relation writes');
}
expect(/if v_relation_type = 'RELATED_TO'[\s\S]*if not \(v_can_manage_origin or v_can_manage_target\)/m.test(createFn), 'RELATED_TO create must allow manage-either-endpoint exception');
expect(/elsif not v_can_manage_origin then[\s\S]*RELATION_WRITE_FORBIDDEN/m.test(createFn), 'directional create must authorize from origin only');
expect(/if v_relation\.relation_type = 'RELATED_TO'[\s\S]*if not \(v_can_manage_origin or v_can_manage_target\)/m.test(deleteFn), 'RELATED_TO delete must allow manage-either-endpoint exception');
expect(/elsif not v_can_manage_origin then[\s\S]*RELATION_DELETE_FORBIDDEN/m.test(deleteFn), 'directional delete must authorize from origin only');

// RPC surface: auth, actor, no generic UPDATE, no direct browser table mutation.
expect(Boolean(readFn) && Boolean(createFn) && Boolean(deleteFn), 'required Board Relations RPC surface incomplete');
expect(createFn.includes('v_uid uuid := auth.uid()') && deleteFn.includes('v_uid uuid := auth.uid()'), 'mutation actor must come from auth.uid()');
expect(createFn.includes("raise exception 'AUTH_REQUIRED'") && deleteFn.includes("raise exception 'AUTH_REQUIRED'"), 'mutation RPC auth guard missing');
expect(!/create or replace function public\.dc_board_relation_update/i.test(migration), 'generic relation UPDATE RPC is forbidden');
expect(/revoke all on table public\.dc_board_relations from public, anon, authenticated;/.test(migration), 'direct table browser privileges are not revoked');
expect(!/grant\s+(insert|update|delete|all)[^;]*on(?: table)? public\.dc_board_relations[^;]*to\s+(public|anon|authenticated)/i.test(migration), 'browser direct table mutation grant detected');
expect(/alter table public\.dc_board_relations enable row level security;/.test(migration), 'RLS is not enabled on relation owner');
expect(/set deleted_at = now\(\),[\s\S]*deleted_by = v_uid/m.test(deleteFn), 'DELETE RPC is not logical delete + actor audit');
expect(!/delete\s+from\s+public\.dc_board_relations/i.test(deleteFn), 'physical delete exposed by relation DELETE RPC');

// Read model privacy: canonical persisted relations only; no participation synthesis/private audit.
expect(!/created_by|deleted_by/.test(readFn.split('language plpgsql')[0]), 'read RPC exposes private audit actor fields');
expect(!readFn.includes('event_registrations'), 'read RPC must not expose/synthesize Event registrations');
expect(!readFn.includes('course_enrollments'), 'read RPC must not expose/synthesize course enrollments');
expect(!readFn.includes('PARTICIPATES_IN'), 'read RPC must not synthesize PARTICIPATES_IN');

// Slug guard must cover active + soft-deleted audit rows: no deleted_at filter is allowed.
expect(Boolean(guardFn), 'Event/Program slug rename guard function missing');
expect(guardFn.includes("old.entity_type in ('event','program')"), 'slug guard not scoped to Event/Program old canonical tuple');
expect(guardFn.includes('r.origin_kind = old.entity_type') && guardFn.includes('r.target_kind = old.entity_type'), 'slug guard does not inspect both relation endpoints');
expect(!guardFn.includes('deleted_at'), 'slug guard incorrectly excludes soft-deleted audit rows');
expect(migration.includes('before update of slug, entity_type on public.dc_entities'), 'slug rename guard trigger missing');
expect(migration.includes('RELATION_SOURCE_ID_RENAME_REQUIRES_CONTROLLED_MIGRATION'), 'controlled migration guard error missing');

// Static migration hygiene.
expect(migration.startsWith('-- Board Relations v1'), 'migration header missing');
expect(/\nbegin;/.test(migration) && /\ncommit;\s*$/.test(migration), 'migration transaction wrapper missing');
expect((migration.match(/\$function\$/g) || []).length === 8, 'unexpected function delimiter count; expected four functions');
expect(!migration.includes('create table public.event_registrations') && !migration.includes('create table public.course_enrollments'), 'unrelated domain schema mutation detected');

// Site Integrity must enforce this contract before release artifact build.
expect(workflow.includes('node scripts/validate-board-relations-v1.mjs'), 'Site Integrity does not run Board Relations v1 validator');

if (failures.length) {
  console.error('Board Relations v1 schema contract FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Board Relations v1 schema contract PASS');
console.log('RELATED_TO reverse-normalization fixture PASS');
console.log('PARTICIPATES_IN generic persistence rejection fixture PASS');
console.log('Directional origin-only authorization static contract PASS');
