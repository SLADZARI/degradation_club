import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const fail=[];
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const expect=(ok,message)=>{if(!ok)fail.push(message)};

const join=read('join/index.html');
const apply=read('join/apply/index.html');
const baseline=read('join/dc9-baseline-v1.js');
const sync=read('join/apply/dc9-baseline-sync-v1.js');
const entry=read('join/apply/apply-entry-v1.js');
const storageGuard=read('join-storage-guard.js');
const accountSync=read('dementor-account-sync-v8.js');
const support=read('support-v1.js');
const migration=read('supabase/migrations/20260905084028_dc9_immutable_first_baseline_v1.sql');
const migrationFix=read('supabase/migrations/20260905084118_dc9_immutable_first_baseline_v1_fix_jsonb_key_count.sql');

expect(join.includes('/join/dc9-baseline-v1.js'),'Join: baseline preservation runtime missing');
expect(join.indexOf('/join/dc9-baseline-v1.js')<join.indexOf('/join/dc9-immersive-v1.js'),'Join: baseline runtime must load before DC-9 runtime');
expect(join.includes('/join-storage-guard.js'),'Join: storage capability guard must load directly on canonical DC-9 entry');
expect(!join.includes('src="/script.js"'),'Join: obsolete presentation runtime must not own canonical DC-9 entry');
expect(storageGuard.includes('.dc9-sphere')&&storageGuard.includes('.dc9-answer'),'Join storage guard: current DC-9 controls are not protected when storage is unavailable');
expect(storageGuard.includes("document.querySelector('.dc9-shell')"),'Join storage guard: warning is not attached to canonical DC-9 shell');
expect(accountSync.includes('never render another')&&accountSync.includes('removePanel();'),'Join account sync: duplicate guest auth panel may return above canonical Header');
expect(support.includes('suppressTimedPrompts')&&support.includes("runtimePath.startsWith('/join/')")&&support.includes('if(!suppressTimedPrompts)'),'Join support: timed support prompts are not suppressed across assessment/application/result flow');
expect(apply.includes('/join/apply/apply-entry-v1.js'),'Application: guarded entry runtime missing');
expect(!apply.includes('src="/join/apply/apply.js"'),'Application: direct apply runtime bypasses history sync');
expect(entry.includes('await syncDc9LocalHistory'),'Application: local history sync is not awaited');
expect(entry.indexOf('await syncDc9LocalHistory')<entry.indexOf("import('/join/apply/apply.js')"),'Application: apply loads before history sync');
for(const token of ['firstBaseline','repeatRuns','results'])expect(sync.includes(token),`Application sync: ${token} evidence missing`);
expect(baseline.includes("first-complete-9of9-v1"),'Local baseline: canonical rule missing');
expect(baseline.includes('prev.firstBaseline'),'Local baseline: previous immutable snapshot is not preserved');
expect(baseline.includes('repeatRuns'),'Local baseline: repeat history is not separated');

expect(!/create\s+table[\s\S]{0,120}baseline/i.test(migration),'DB: parallel baseline table must not be introduced');
for(const token of ["self-development","self_development","min(completed_at)","max(first_completed_at)","cr.completed_at <= c.baseline_completed_at","before insert on public.join_applications","new.candidate_snapshot := v_baseline->'snapshot'","dc9_baseline_rule","dc9_baseline_completed_at"]){
  expect(migration.includes(token),`DB baseline contract missing: ${token}`);
}
expect(migration.includes('revoke all on table public.assessment_runs from authenticated'),'assessment_runs: append-only privilege hardening missing');
expect(migration.includes('grant select, insert on table public.assessment_runs to authenticated'),'assessment_runs: required append-only client privileges missing');
expect(migrationFix.includes('create or replace function public.dc_lock_join_application_baseline_v1()'),'DB corrective migration: trigger function replacement missing');
expect(migrationFix.includes('pg_catalog.jsonb_object_keys'),'DB corrective migration: PostgreSQL JSONB key enumeration missing');
expect(migrationFix.includes('coalesce(v_snapshot_key_count,0) <> 9'),'DB corrective migration: exact 9-key gate missing');
expect(!migrationFix.includes('jsonb_object_length('),'DB corrective migration: nonexistent jsonb_object_length must not be used');

class MockStorage{
  constructor(){this.map=new Map()}
  getItem(k){return this.map.has(k)?this.map.get(k):null}
  setItem(k,v){this.map.set(String(k),String(v))}
  removeItem(k){this.map.delete(String(k))}
}
const context={Storage:MockStorage,localStorage:new MockStorage(),console,Date,JSON,Object,Array,String,Number,Math,globalThis:null};
context.globalThis=context;
vm.createContext(context);
vm.runInContext(baseline,context,{filename:'join/dc9-baseline-v1.js'});
const ids=['personality','work','consumption','relationships','control','information','self_development','meaning','technology'];
const make=(i,minute=0)=>({date:new Date(Date.UTC(2026,8,4,10,i,minute)).toISOString(),level:i%6});
const state={results:{},drafts:{},active:null,quizVersion:'dc9-immersive-v1'};
for(let i=0;i<8;i++){state.results[ids[i]]=make(i);context.localStorage.setItem('dementorClubOnboardingV3',JSON.stringify(state))}
let stored=JSON.parse(context.localStorage.getItem('dementorClubOnboardingV3'));
expect(!stored.firstBaseline,'Local baseline locked before 9/9');
state.results[ids[8]]=make(8);context.localStorage.setItem('dementorClubOnboardingV3',JSON.stringify(state));
stored=JSON.parse(context.localStorage.getItem('dementorClubOnboardingV3'));
expect(Object.keys(stored.firstBaseline?.results||{}).length===9,'Local baseline did not lock at first 9/9');
const originalDate=stored.firstBaseline.results.personality.date;
state.results.personality=make(0,30);context.localStorage.setItem('dementorClubOnboardingV3',JSON.stringify(state));
stored=JSON.parse(context.localStorage.getItem('dementorClubOnboardingV3'));
expect(stored.firstBaseline.results.personality.date===originalDate,'Repeat overwrote immutable baseline');
expect(stored.repeatRuns?.personality?.some(x=>x.date===state.results.personality.date),'Repeat was not separated from baseline');
context.localStorage.setItem('dementorClubOnboardingV3',JSON.stringify({results:{},drafts:{},active:null,quizVersion:'dc9-immersive-v1'}));
stored=JSON.parse(context.localStorage.getItem('dementorClubOnboardingV3'));
expect(stored.firstBaseline.results.personality.date===originalDate,'Reset erased immutable baseline');

if(fail.length){console.error('DC-9 immutable baseline validation failed:');for(const item of fail)console.error(`- ${item}`);process.exit(1)}
console.log('DC-9 immutable baseline contract PASS (local first 9/9 + repeat history + application sync + Join ownership guards + server first-complete snapshot + corrective PostgreSQL key-count migration)');
