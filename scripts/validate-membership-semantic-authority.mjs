import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const expect=(ok,message)=>{if(!ok)errors.push(message)};
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const migration=read('supabase/migrations/20260908135500_dc9_membership_semantic_integrity_v1.sql');
const apply=read('join/apply/apply.js');
const board=read('community/board/board-user-state-v2.js');

expect(migration.includes('create or replace function public.dc_submit_membership_application_v2'),'Membership authority: application RPC replacement missing');
expect(migration.includes('v_baseline := public.dc_first_complete_baseline_v1(v_uid)'),'Membership authority: application eligibility does not use first-complete baseline');
expect(migration.includes("coalesce((v_baseline->>'sphere_count')::integer,0) <> 9")&&migration.includes('v_snapshot_key_count <> 9'),'Membership authority: application baseline does not enforce exact canonical 9/9');
expect(!/with\s+latest\s+as\s*\(/i.test(migration),'Membership authority: stale latest-per-sphere application gate survived');
expect(migration.includes('if public.dc_membership_active(v_uid) then raise exception \'ALREADY_MEMBER\''),'Membership authority: ALREADY_MEMBER does not use validity-window primitive');

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
expect(migration.includes("when v_published_artifact_count > 0 then 'MEMBER_ACTIVATED'")&&migration.includes("else 'FIRST_ARTIFACT_REQUIRED'"),'Membership authority: existing first-Artifact activation projection was not preserved');

expect(apply.includes("const member=entryStatus?.membership_active===true")&&!apply.includes("membership?.status==='active'"),'Membership UI: raw membership status still defines active membership');
expect(apply.includes("const gateComplete=entryStatus?.sphere_gate_complete===true")&&!apply.includes('sphereCount===9'),'Membership UI: raw progress count can still redefine application permission');
expect(!apply.includes('syncLocalAssessmentRuns'),'Membership UI: duplicate application assessment-sync owner survived');
expect(board.includes("entryStatus?.sphere_gate_complete===true")&&!board.includes('sphereCount===9'),'Board state: raw progress count can still redefine DC9-complete permission');

// Local DB execution is deliberately not faked here. This contract protects the tracked
// migration shape; SQL execution belongs to local Supabase when its harness is available,
// then to the separately authorized release/live-retest path.
if(errors.length){console.error('MEMBERSHIP SEMANTIC AUTHORITY BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('Membership semantic authority PASS: one DC9 baseline gate + backend Interest Map invariant + validity-window membership + client consumers');
