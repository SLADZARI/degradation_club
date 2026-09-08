import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd();
const errors=[];
const expect=(ok,message)=>{if(!ok)errors.push(message)};
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

const syncSource=read('join/dc9-sync-state-v1.js');
const accountSync=read('dementor-account-sync-v10.js');
const siteConfig=read('site-config.js');
const storageGuard=read('join-storage-guard.js');
const historySync=read('join/apply/dc9-baseline-sync-v1.js');
const temp=path.join(root,'scripts','.dc9-sync-state-validation.mjs');
fs.writeFileSync(temp,syncSource);
let domain;
try{domain=await import(pathToFileURL(temp).href+`?t=${Date.now()}`)}finally{try{fs.unlinkSync(temp)}catch{}}

const canonicalSphere=id=>String(id||'')==='self-development'?'self_development':String(id||'');
const options={canonicalSphere,currentQuizVersion:'dc9-immersive-v1',assessmentVersion:'dc9-v1'};
const result=(date,level=1)=>({date,level});
const baseline=date=>({rule:'first-complete-9of9-v1',assessmentVersion:'dc9-v1',completedAt:date,results:{personality:result(date)}});

const local={
  quizVersion:'dc9-immersive-v1',
  unknownLocal:{preserve:true},
  results:{'self-development':result('2026-09-01T10:00:00Z',1)},
  drafts:{work:{quizVersion:'dc9-immersive-v1',sphere:'work',answers:[1,2,null,null,null,null],startedAt:'2026-09-08T09:00:00Z',updatedAt:'2026-09-08T10:00:00Z'}},
  active:{quizVersion:'dc9-immersive-v1',sphere:'work',index:2,updatedAt:'2026-09-08T10:00:00Z'},
  firstBaseline:baseline('2026-09-01T12:00:00Z'),
  repeatRuns:{'self-development':[result('2026-09-02T10:00:00Z',2)]}
};
const remote={
  quizVersion:'dc9-immersive-v1',
  unknownRemote:{preserve:true},
  results:{self_development:result('2026-09-03T10:00:00Z',3)},
  drafts:{
    work:{quizVersion:'dc9-immersive-v1',sphere:'work',answers:[null,null,3,1,null,null],startedAt:'2026-09-08T09:30:00Z',updatedAt:'2026-09-08T11:00:00Z'},
    meaning:{quizVersion:'legacy-v0',sphere:'meaning',answers:[1,null,null,null,null,null],updatedAt:'2026-09-08T12:00:00Z'}
  },
  active:{quizVersion:'legacy-v0',sphere:'meaning',index:1,updatedAt:'2026-09-08T12:00:00Z'},
  firstBaseline:baseline('2026-09-01T13:00:00Z'),
  repeatRuns:{self_development:[result('2026-09-02T10:00:00Z',2),result('2026-09-04T10:00:00Z',4)]}
};
const merged=domain.mergeAssessmentStates(local,remote,options);
expect(merged.unknownLocal?.preserve===true&&merged.unknownRemote?.preserve===true,'DC9 sync: unknown top-level fields were not preserved');
expect(JSON.stringify(merged.drafts.work?.answers)===JSON.stringify([1,2,3,1,null,null]),'DC9 sync: compatible partial answers were not preserved across merge');
expect(merged.active?.sphere==='work','DC9 sync: incompatible remote active draft became current or valid active was lost');
expect(merged.drafts.meaning?.quizVersion==='legacy-v0','DC9 sync: historical mismatched draft should be preserved as data');
expect(merged.firstBaseline?.completedAt==='2026-09-01T12:00:00Z','DC9 sync: immutable local baseline was overwritten by a newer remote baseline');
expect(merged.syncIntegrityConflicts?.some(x=>x.type==='FIRST_BASELINE_CONFLICT'),'DC9 sync: conflicting immutable baselines did not emit diagnostic evidence');
expect(merged.repeatRuns.self_development?.length===2,'DC9 sync: repeat history was not unioned/deduplicated');
expect(!Object.prototype.hasOwnProperty.call(merged.results,'self-development'),'DC9 sync: legacy sphere id survived canonical normalization');
expect(merged.results.self_development?.level===3,'DC9 sync: canonical result did not retain latest logical attempt');

const remoteOnly=domain.mergeAssessmentStates({quizVersion:'dc9-immersive-v1'},{quizVersion:'dc9-immersive-v1',drafts:{control:{quizVersion:'dc9-immersive-v1',sphere:'control',answers:[2,1,null,null,null,null],updatedAt:'2026-09-08T12:10:00Z'}},active:{quizVersion:'dc9-immersive-v1',sphere:'control',index:2,updatedAt:'2026-09-08T12:10:00Z'}},options);
expect(remoteOnly.drafts.control?.answers?.[0]===2&&remoteOnly.active?.sphere==='control','DC9 sync: clean-device remote partial draft was not restored');

const runs=domain.collectCompletedRuns(merged,options);
expect(runs.length>=3,'DC9 sync: completed history collection lost attempts');
expect(runs.every(x=>x.sphere!=='self-development'&&!x.sourceKey.includes('self-development')),'DC9 sync: a new legacy self-development server source key can still be generated');
expect(new Set(runs.map(x=>x.sourceKey)).size===runs.length,'DC9 sync: completed run source keys are not deduplicated');

expect(accountSync.includes("getClient")&&!accountSync.includes('createClient('),'DC9 sync: account sync is not using the canonical Supabase client owner');
expect(accountSync.includes("from '/join/dc9-sync-state-v1.js'"),'DC9 sync: account sync bypasses the canonical state merge primitive');
expect(siteConfig.includes('/dementor-account-sync-v10.js')&&!siteConfig.includes('/dementor-account-sync-v8.js')&&!siteConfig.includes('/dementor-account-sync-v9.js'),'DC9 sync: site config does not select exactly the v10 account sync owner');
expect(siteConfig.includes("test(runtimePath)"),'DC9 sync: Join loader is not using normalized runtime path');
expect(storageGuard.includes("replace(/^\\/degradation_club(?=\\/|$)/"),'DC9 sync: storage guard does not normalize the legacy base path');
expect(historySync.includes("collectCompletedRuns")&&historySync.includes("canonicalSphereId(sphere)"),'DC9 sync: application history sync is not sharing canonical completed-run persistence');

if(errors.length){console.error('DC9 SYNC INTEGRITY BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('DC9 sync integrity PASS: drafts + remote recovery + unknown fields + immutable baseline diagnostics + canonical source keys + single Supabase client owner');
