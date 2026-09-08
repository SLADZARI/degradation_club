import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const expect=(ok,message)=>{if(!ok)errors.push(message)};
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const migration=read('supabase/migrations/20260908132816_dc9_membership_semantic_integrity_v1.sql');
const apply=read('join/apply/apply.js');
const board=read('community/board/board-user-state-v2.js');
const applyEntry=read('join/apply/apply-entry-v1.js');
const historySync=read('join/apply/dc9-baseline-sync-v1.js');

expect(migration.includes('create or replace function public.dc_submit_membership_application_v2'),'Membership authority: application RPC replacement missing');
expect(migration.includes('v_baseline := public.dc_first_complete_baseline_v1(v_uid)'),'Membership authority: application eligibility does not use first-complete baseline');
expect(migration.includes("coalesce((v_baseline->>'sphere_count')::integer,0) <> 9")&&migration.includes('v_snapshot_key_count <> 9'),'Membership authority: application baseline does not enforce exact canonical 9/9');
expect(!/with\s+latest\s+as\s*\(/i.test(migration),'Membership authority: stale latest-per-sphere application gate survived');
expect(migration.includes("if public.dc_membership_active(v_uid) then raise exception 'ALREADY_MEMBER'"),'Membership authority: ALREADY_MEMBER does not use validity-window primitive');

for(const token of ['INTEREST_MAP_REQUIRED','INTEREST_MAP_INVALID_KEYS','INTEREST_MAP_INVALID_VALUE','INTEREST_MAP_TOTAL_INVALID'])expect(migration.includes(token),`Interest Map server error missing: ${token}`);
expect(migration.includes('v_interest_key_count <> 9'),'Interest Map: exact nine-key server invariant missing');
for(const sphere of ['personality','work','consumption','relationships','control','information','self_development','meaning','technology'])expect(migration.includes(`'${sphere}'`),`Interest Map/DC9 canonical key missing: ${sphere}`);
expect(migration.includes("pg_catalog.jsonb_typeof(e.value) <> 'number'")&&migration.includes('pg_catalog.trunc')&&migration.includes('> 100')&&migration.includes('< 0'),'Interest Map: integer/range server validation missing');
expect(migration.includes('if v_interest_total <> 100'),'Interest Map: exact total=100 server invariant missing');

expect(migration.includes('create or replace function public.dc_member_entry_status_v1()'),'Membership authority: Entry Status replacement missing');
expect(migration.includes("ar.assessment_version = 'dc9-v1'"),'Membership authority: informative DC9 progress is not assessment-version scoped');
expect(migration.includes("when ar.sphere_id = 'self-development' then 'self_development'"),'Membership authority: Entry Status does not canonicalize legacy self-development');
expect(migration.includes('v_baseline := public.dc_first_complete_baseline_v1(v_uid)'),'Membership authority: Entry Status does not use canonical baseline primitive');
expect(migration.includes('v_membership_active := public.dc_membership_active(v_uid)'),'Membership authority: Entry Status does not use canonical membership validity primitive');
expect(migration.includes("when v_membership_active and v_published_artifact_count > 0 then 'MEMBER_ACTIVATED'")&&migration.includes("when v_membership_active then 'FIRST_ARTIFACT_REQUIRED'")&&migration.includes("when v_sphere_gate_complete then 'IDENTITY_REQUIRED'")&&migration.includes("else 'SPHERES_IN_PROGRESS'"),'Membership authority: existing activation-state projection was not preserved');

// Entry Status is a shared RPC. Correcting its semantics must not silently shrink
// the response contract already consumed by Workspace/Join/Board surfaces.
for(const key of [
  'sphere_count','completed_spheres','missing_spheres','sphere_gate_complete',
  'identity_ready','legal_ready','membership_status','membership_active',
  'artifact_slots_granted','artifact_slots_consuming','artifact_slots_available',
  'published_artifact_count','community_activation_state'
]) expect(migration.includes(`'${key}'`),`Membership authority: Entry Status compatibility key missing: ${key}`);

expect(apply.includes("const member=entryStatus?.membership_active===true")&&!apply.includes("membership?.status==='active'"),'Membership UI: raw membership status still defines active membership');
expect(apply.includes("const gateComplete=entryStatus?.sphere_gate_complete===true")&&!apply.includes('sphereCount===9'),'Membership UI: raw progress count can still redefine application permission');
expect(applyEntry.includes('await syncDc9LocalHistory')&&historySync.includes('collectCompletedRuns'),'Membership UI: full baseline/repeat history is not synchronized by the guarded application entry');
expect(apply.includes('await syncLocalAssessmentRuns(client,uid)'),'Membership UI: canonical current-map compatibility attachment before Entry Status is missing');
expect(board.includes("entryStatus?.sphere_gate_complete===true")&&!board.includes('sphereCount===9'),'Board state: raw progress count can still redefine DC9-complete permission');

// Local DB execution is deliberately not faked here. This contract protects the tracked
// migration shape; SQL execution belongs to local Supabase when its harness is available,
// then to the separately authorized release/live-retest path.
if(errors.length){console.error('MEMBERSHIP SEMANTIC AUTHORITY BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('Membership semantic authority PASS: one DC9 baseline gate + backend Interest Map invariant + validity-window membership + preserved Entry Status shape + guarded history sync + client consumers');
