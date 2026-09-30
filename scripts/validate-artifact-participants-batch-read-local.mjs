#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root=process.cwd();
const migrationRel='supabase/migrations/20260929175000_artifact_participants_batch_read_v1.sql';
const boardRel='community/board/board.js';
const migration=fs.readFileSync(path.join(root,migrationRel),'utf8');
const board=fs.readFileSync(path.join(root,boardRel),'utf8');

const failures=[];
const expect=(ok,label)=>{if(!ok)failures.push(label)};
const includesAll=(source,parts,label)=>expect(parts.every(part=>source.includes(part)),label);

expect(/create or replace function public\.dc_artifact_participants_batch_read_v1\s*\(\s*p_artifact_ids uuid\[\]/i.test(migration),'batch RPC signature missing');
includesAll(migration,[
  'artifact_id uuid',
  'profile_id uuid',
  'display_name text',
  'nickname text',
  'avatar_url text',
  'participation_state text',
  'state_changed_at timestamptz'
],'batch RPC result shape drifted');
expect(migration.includes('coalesce(cardinality(p_artifact_ids), 0) > 50'),'bounded max-50 input guard missing');
expect(migration.includes("raise exception 'ARTIFACT_BATCH_TOO_LARGE'"),'bounded input error missing');
expect(migration.includes('public.dc_can_read_artifact_v1(r.artifact_id)'),'canonical Artifact ACL helper not reused');
expect(migration.includes('public.dc_artifact_participation_events'),'canonical participation ledger not reused');
expect(migration.includes("where l.state in ('INVITED','JOINED')"),'terminal participation states are not filtered');
includesAll(migration,[
  "nullif(btrim(p.display_name),'')",
  "nullif(btrim(p.nickname),'')",
  "'Пользователь ' || upper(left(p.id::text,8))"
],'display-name fallback drifted from single read');
expect(migration.includes('order by r.input_order, l.created_at, p.id'),'per-Artifact participant ordering is not stable');
expect(/revoke all on function public\.dc_artifact_participants_batch_read_v1\(uuid\[\]\)[\s\S]*from public, anon, authenticated;/i.test(migration),'batch RPC broad EXECUTE revoke missing');
expect(/grant execute on function public\.dc_artifact_participants_batch_read_v1\(uuid\[\]\)[\s\S]*to authenticated;/i.test(migration),'batch RPC authenticated grant missing');
expect(!/create\s+(table|materialized\s+view|view)\b/i.test(migration),'migration creates a parallel table/view owner');

const nPlusOneAtBase=/ideaIds\.map\([\s\S]{0,300}dc_artifact_participants_read_v1/.test(board);
const requestCountBaseline=[1,5,20].map(ideas=>({
  ideas,
  before_participant_requests:ideas,
  after_batch_requests:1
}));

if(failures.length){
  console.error('ARTIFACT PARTICIPANTS BATCH READ STATIC VALIDATION FAIL');
  for(const failure of failures)console.error('- '+failure);
  process.exit(1);
}

const staticResult={
  static_validation:'PASS',
  baseline_base:'a24f8d900cc29e5ae922a9a62b751cc02e88f8d9',
  baseline_n_plus_one_detected:nPlusOneAtBase,
  request_count:requestCountBaseline,
  runtime_validation:'NOT_RUN'
};

const staticOnly=process.argv.includes('--static');
if(staticOnly){
  staticResult.runtime_validation='SKIPPED_STATIC_ONLY';
  process.stdout.write(JSON.stringify(staticResult,null,2)+'\n');
  process.exit(0);
}

const container=process.argv.find(arg=>/^supabase_db_/.test(arg));
if(!container){
  throw new Error('local Supabase DB container argument required, or use --static');
}

function psql(sql){
  return execFileSync('docker',[
    'exec','-i',container,
    'psql','-U','postgres','-d','postgres',
    '-v','ON_ERROR_STOP=1','-Atq'
  ],{
    input:sql,
    encoding:'utf8',
    stdio:['pipe','pipe','pipe']
  }).trim();
}

function psqlAs(userId,sql){
  const claims=JSON.stringify({sub:userId,role:'authenticated'}).replaceAll("'","''");
  return psql([
    'set role authenticated;',
    "set request.jwt.claim.sub = '"+userId+"';",
    "set request.jwt.claim.role = 'authenticated';",
    "set request.jwt.claims = '"+claims+"';",
    sql
  ].join('\n'));
}

function expectEqual(actual,expected,label){
  if(actual!==expected)throw new Error(label+': expected '+expected+', got '+actual);
}

function expectError(userId,sql,expected,label){
  try{
    psqlAs(userId,sql);
  }catch(error){
    const message=String(error.stderr||'')+'\n'+String(error.stdout||'')+'\n'+String(error.message||'');
    if(message.includes(expected))return;
    throw new Error(label+': expected '+expected+', got '+message);
  }
  throw new Error(label+': expected error '+expected);
}

const AUTHOR='a1111111-1111-4111-8111-111111111111';
const INVITED='a2222222-2222-4222-8222-222222222222';
const JOINED='b3333333-3333-4333-8333-333333333333';
const OUTSIDER='c4444444-4444-4444-8444-444444444444';
const ACTIVE='d5555555-5555-4555-8555-555555555555';
const LEFT='e6666666-6666-4666-8666-666666666666';
const REMOVED='f7777777-7777-4777-8777-777777777777';
const DECLINED='a8888888-8888-4888-8888-888888888888';
const CROSS='b9999999-9999-4999-8999-999999999999';

const COMMUNITY='10000000-0000-4000-8000-000000000001';
const CIRCLE_INVITED='10000000-0000-4000-8000-000000000002';
const CIRCLE_JOINED='10000000-0000-4000-8000-000000000003';
const CIRCLE_HIDDEN='10000000-0000-4000-8000-000000000004';
const MISSING='10000000-0000-4000-8000-000000009999';

const USERS=[AUTHOR,INVITED,JOINED,OUTSIDER,ACTIVE,LEFT,REMOVED,DECLINED,CROSS];
const ARTIFACTS=[COMMUNITY,CIRCLE_INVITED,CIRCLE_JOINED,CIRCLE_HIDDEN];

const uuidArray=ids=>ids.length
  ? 'array['+ids.map(id=>"'"+id+"'::uuid").join(',')+']::uuid[]'
  : "'{}'::uuid[]";

function rows(userId,ids){
  const raw=psqlAs(userId,
    "select coalesce(json_agg(row_to_json(q)),'[]'::json)::text from public.dc_artifact_participants_batch_read_v1("+uuidArray(ids)+") q;"
  );
  return JSON.parse(raw.split(/\r?\n/).filter(Boolean).at(-1)||'[]');
}

function singleRows(userId,artifactId){
  const raw=psqlAs(userId,
    "select coalesce(json_agg(row_to_json(q)),'[]'::json)::text from public.dc_artifact_participants_read_v1('"+artifactId+"'::uuid) q;"
  );
  return JSON.parse(raw.split(/\r?\n/).filter(Boolean).at(-1)||'[]');
}

function cleanup(){
  psql([
    "delete from public.dc_artifact_participation_events where artifact_id in ("+ARTIFACTS.map(id=>"'"+id+"'::uuid").join(',')+");",
    "delete from public.dc_artifacts where id in ("+ARTIFACTS.map(id=>"'"+id+"'::uuid").join(',')+");",
    "delete from auth.users where id in ("+USERS.map(id=>"'"+id+"'::uuid").join(',')+");"
  ].join('\n'));
}

const runtime={};
try{
  psql(migration);
  cleanup();

  const userValues=USERS.map((id,index)=>
    "('"+id+"','authenticated','authenticated','batch-"+index+"@example.invalid','{}','{}',now(),now(),false,false)"
  ).join(',\n');
  psql([
    'insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,is_sso_user,is_anonymous)',
    'values '+userValues,
    'on conflict(id) do nothing;',
    "update public.profiles set display_name='Batch Author',nickname=null where id='"+AUTHOR+"'::uuid;",
    "update public.profiles set display_name='Batch Invited',nickname='batch_invited' where id='"+INVITED+"'::uuid;",
    "update public.profiles set display_name='Batch Joined',nickname='batch_joined' where id='"+JOINED+"'::uuid;",
    "update public.profiles set display_name='Batch Outsider',nickname=null where id='"+OUTSIDER+"'::uuid;",
    "update public.profiles set display_name='Batch Active',nickname=null where id='"+ACTIVE+"'::uuid;",
    "update public.profiles set display_name='Batch Left',nickname=null where id='"+LEFT+"'::uuid;",
    "update public.profiles set display_name='Batch Removed',nickname=null where id='"+REMOVED+"'::uuid;",
    "update public.profiles set display_name='Batch Declined',nickname=null where id='"+DECLINED+"'::uuid;",
    "update public.profiles set display_name=null,nickname='fallback_cross' where id='"+CROSS+"'::uuid;"
  ].join('\n'));

  expectEqual(psql("select count(*)::text from public.profiles where id in ("+USERS.map(id=>"'"+id+"'::uuid").join(',')+");"),String(USERS.length),'fixture profiles created');

  psql([
    'insert into public.dc_artifacts(id,author_profile_id,artifact_type,title,body,status,visibility,published_at,source_system,provenance_status) values',
    "('"+COMMUNITY+"','"+AUTHOR+"','idea','Batch Community','batch community','active','community',now(),'local-batch-validator','confirmed'),",
    "('"+CIRCLE_INVITED+"','"+AUTHOR+"','idea','Batch Circle Invited','batch circle invited','active','circle',now(),'local-batch-validator','confirmed'),",
    "('"+CIRCLE_JOINED+"','"+AUTHOR+"','idea','Batch Circle Joined','batch circle joined','active','circle',now(),'local-batch-validator','confirmed'),",
    "('"+CIRCLE_HIDDEN+"','"+AUTHOR+"','idea','Batch Circle Hidden','batch circle hidden','active','circle',now(),'local-batch-validator','confirmed');",
    '',
    'insert into public.dc_artifact_participation_events(artifact_id,profile_id,transition_no,state,actor_profile_id,created_at) values',
    "('"+COMMUNITY+"','"+ACTIVE+"',1,'JOINED','"+AUTHOR+"',now()-interval '20 minutes'),",
    "('"+COMMUNITY+"','"+INVITED+"',1,'INVITED','"+AUTHOR+"',now()-interval '19 minutes'),",
    "('"+COMMUNITY+"','"+LEFT+"',1,'JOINED','"+AUTHOR+"',now()-interval '18 minutes'),",
    "('"+COMMUNITY+"','"+LEFT+"',2,'LEFT','"+LEFT+"',now()-interval '17 minutes'),",
    "('"+COMMUNITY+"','"+REMOVED+"',1,'JOINED','"+AUTHOR+"',now()-interval '16 minutes'),",
    "('"+COMMUNITY+"','"+REMOVED+"',2,'REMOVED','"+AUTHOR+"',now()-interval '15 minutes'),",
    "('"+COMMUNITY+"','"+DECLINED+"',1,'INVITED','"+AUTHOR+"',now()-interval '14 minutes'),",
    "('"+COMMUNITY+"','"+DECLINED+"',2,'DECLINED','"+DECLINED+"',now()-interval '13 minutes'),",
    "('"+CIRCLE_INVITED+"','"+INVITED+"',1,'INVITED','"+AUTHOR+"',now()-interval '12 minutes'),",
    "('"+CIRCLE_INVITED+"','"+CROSS+"',1,'JOINED','"+AUTHOR+"',now()-interval '11 minutes'),",
    "('"+CIRCLE_JOINED+"','"+JOINED+"',1,'JOINED','"+AUTHOR+"',now()-interval '10 minutes'),",
    "('"+CIRCLE_JOINED+"','"+ACTIVE+"',1,'JOINED','"+AUTHOR+"',now()-interval '9 minutes'),",
    "('"+CIRCLE_HIDDEN+"','"+ACTIVE+"',1,'JOINED','"+AUTHOR+"',now()-interval '8 minutes');"
  ].join('\n'));

  const zero=rows(OUTSIDER,[]);
  expectEqual(String(zero.length),'0','0 Artifact ids returns no rows');
  runtime.zero_ids='PASS';

  const one=rows(AUTHOR,[COMMUNITY]);
  const single=singleRows(AUTHOR,COMMUNITY);
  expectEqual(String(one.length),String(single.length),'1 Artifact batch row count matches canonical single read');
  expectEqual(
    JSON.stringify(one.map(({artifact_id,...rest})=>rest)),
    JSON.stringify(single),
    '1 Artifact batch fields/order match canonical single read'
  );
  runtime.one_id_shape_and_order='PASS';

  const communityOutsider=rows(OUTSIDER,[COMMUNITY]);
  if(!communityOutsider.length)throw new Error('COMMUNITY must remain readable to authenticated outsider');
  runtime.community='PASS';

  const circleAuthor=rows(AUTHOR,[CIRCLE_HIDDEN]);
  if(!circleAuthor.length)throw new Error('CIRCLE author must read participant projection');
  runtime.circle_author='PASS';

  const circleInvited=rows(INVITED,[CIRCLE_INVITED,CIRCLE_HIDDEN]);
  if(!circleInvited.some(row=>row.artifact_id===CIRCLE_INVITED))throw new Error('CIRCLE INVITED reader lost readable Artifact');
  if(circleInvited.some(row=>row.artifact_id===CIRCLE_HIDDEN))throw new Error('INVITED reader leaked unreadable CIRCLE Artifact');
  runtime.circle_invited='PASS';

  const circleJoined=rows(JOINED,[CIRCLE_JOINED]);
  if(!circleJoined.some(row=>row.artifact_id===CIRCLE_JOINED))throw new Error('CIRCLE JOINED reader lost readable Artifact');
  runtime.circle_joined='PASS';

  const hidden=rows(OUTSIDER,[CIRCLE_HIDDEN,MISSING]);
  expectEqual(String(hidden.length),'0','outsider must not see hidden/missing CIRCLE rows');
  runtime.outsider_hidden_circle='PASS';
  runtime.missing_omitted='PASS';

  const communityProfiles=new Set(one.map(row=>row.profile_id));
  for(const terminal of [LEFT,REMOVED,DECLINED]){
    if(communityProfiles.has(terminal))throw new Error('terminal participant leaked into batch projection: '+terminal);
  }
  runtime.terminal_states_absent='PASS';

  const nRows=rows(AUTHOR,[COMMUNITY,CIRCLE_INVITED,CIRCLE_JOINED,CIRCLE_HIDDEN,MISSING]);
  const crossArtifacts=nRows.filter(row=>row.profile_id===CROSS).map(row=>row.artifact_id);
  expectEqual(JSON.stringify(crossArtifacts),JSON.stringify([CIRCLE_INVITED]),'cross-Artifact participant leakage');
  if(nRows.some(row=>row.artifact_id===MISSING))throw new Error('missing Artifact became observable');
  runtime.n_ids='PASS';
  runtime.no_cross_artifact_leakage='PASS';

  const fallback=nRows.find(row=>row.artifact_id===CIRCLE_INVITED&&row.profile_id===CROSS);
  expectEqual(fallback?.display_name,'fallback_cross','display-name nickname fallback');
  runtime.display_name_fallback='PASS';

  const duplicateRows=rows(AUTHOR,[CIRCLE_INVITED,CIRCLE_INVITED]);
  expectEqual(String(duplicateRows.length),String(rows(AUTHOR,[CIRCLE_INVITED]).length),'duplicate Artifact ids must not duplicate participants');
  runtime.duplicate_ids_deduped='PASS';

  const tooMany=Array.from({length:51},()=>COMMUNITY);
  expectError(AUTHOR,
    "select count(*) from public.dc_artifact_participants_batch_read_v1("+uuidArray(tooMany)+");",
    'ARTIFACT_BATCH_TOO_LARGE',
    'batch bound'
  );
  runtime.bound_50='PASS';

  staticResult.runtime_validation='PASS_LOCAL_SUPABASE';
  staticResult.runtime=runtime;
}finally{
  try{cleanup()}catch{}
}

process.stdout.write(JSON.stringify(staticResult,null,2)+'\n');
