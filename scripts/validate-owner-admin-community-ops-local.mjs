#!/usr/bin/env node
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const migrationRel='supabase/migrations/20260930180000_owner_admin_community_ops_read_v1.sql';
const migration=fs.readFileSync(migrationRel,'utf8');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};

expect(migration.includes('create or replace function public.dc_admin_profile_search_v1'),'profile search RPC missing');
expect(migration.includes('create or replace function public.dc_admin_artifact_slot_status_v1'),'slot status RPC missing');
expect((migration.match(/OWNER_ADMIN_REQUIRED/g)||[]).length>=2,'Owner Admin checks missing');
expect(migration.includes("'USER-' || upper(left(p.id::text,8))"),'safe USER-ref missing');
expect(!/\bemail\b/i.test(migration.match(/create or replace function public\.dc_admin_profile_search_v1[\s\S]*?\$function\$;/i)?.[0]||''),'profile search exposes email');
expect(migration.includes("a.status in ('publishing','active')"),'consuming formula drift');
expect(migration.includes('greatest(v_granted-v_consuming,0)'),'available formula drift');
expect(migration.includes('public.dc_artifact_slot_grants'),'canonical grant ledger not reused');
expect(!/\bcreate\s+(?:table|view|materialized\s+view)\b/i.test(migration),'parallel persistent state created');
expect(!/\binsert\s+into\b|\bupdate\s+public\.|\bdelete\s+from\b/i.test(migration),'read-only migration mutates canonical data');

if(failures.length){
  console.error('OWNER ADMIN COMMUNITY OPS STATIC VALIDATION FAIL');
  failures.forEach(x=>console.error('- '+x));
  process.exit(1);
}

const result={static_validation:'PASS',runtime_validation:'NOT_RUN'};
if(process.argv.includes('--static')){
  result.runtime_validation='SKIPPED_STATIC_ONLY';
  console.log(JSON.stringify(result,null,2));
  process.exit(0);
}

const container=process.argv.find(arg=>/^supabase_db_/.test(arg));
if(!container)throw new Error('local Supabase DB container argument required, or use --static');

function psql(sql){
  return execFileSync('docker',['exec','-i',container,'psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-Atq'],{
    input:sql,encoding:'utf8',stdio:['pipe','pipe','pipe']
  }).trim();
}
function asUser(userId,sql){
  const claims=JSON.stringify({sub:userId,role:'authenticated'}).replaceAll("'","''");
  return psql([
    'set role authenticated;',
    "set request.jwt.claim.sub = '"+userId+"';",
    "set request.jwt.claim.role = 'authenticated';",
    "set request.jwt.claims = '"+claims+"';",
    sql
  ].join('\n'));
}
function expectError(userId,sql,needle,label){
  try{asUser(userId,sql)}
  catch(error){
    const message=String(error.stderr||'')+'\n'+String(error.message||'');
    if(message.includes(needle))return;
    throw new Error(label+': expected '+needle+', got '+message);
  }
  throw new Error(label+': expected '+needle);
}
function json(userId,sql){
  const raw=asUser(userId,sql);
  return JSON.parse(raw.split(/\r?\n/).filter(Boolean).at(-1));
}

const OWNER='91111111-1111-4111-8111-111111111111';
const MEMBER='92222222-2222-4222-8222-222222222222';
const SAME1='93333333-3333-4333-8333-333333333333';
const SAME2='94444444-4444-4444-8444-444444444444';
const ACTIVE_ART='95555555-5555-4555-8555-555555555555';
const ARCHIVED_ART='96666666-6666-4666-8666-666666666666';
const USERS=[OWNER,MEMBER,SAME1,SAME2];

function cleanup(){
  psql([
    "delete from public.dc_artifacts where id in ('"+ACTIVE_ART+"'::uuid,'"+ARCHIVED_ART+"'::uuid);",
    "delete from public.dc_artifact_slot_grants where profile_id in ("+USERS.map(x=>"'"+x+"'::uuid").join(',')+");",
    "delete from public.dc_role_assignments where profile_id in ("+USERS.map(x=>"'"+x+"'::uuid").join(',')+");",
    "delete from public.dc_system_memberships where profile_id in ("+USERS.map(x=>"'"+x+"'::uuid").join(',')+");",
    "delete from public.profiles where id in ("+USERS.map(x=>"'"+x+"'::uuid").join(',')+");",
    "delete from auth.users where id in ("+USERS.map(x=>"'"+x+"'::uuid").join(',')+");"
  ].join('\n'));
}

try{
  psql(migration);
  psql(migration);
  cleanup();

  const values=USERS.map((id,i)=>"('"+id+"','authenticated','authenticated','ops-"+i+"@example.invalid','{}','{}',now(),now(),false,false)").join(',');
  psql([
    'insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,is_sso_user,is_anonymous) values '+values+' on conflict(id) do nothing;',
    "insert into public.profiles(id,email,display_name,nickname) values",
    "('"+OWNER+"','ops-owner@example.invalid','Ops Owner','owner'),",
    "('"+MEMBER+"','ops-member@example.invalid','Gabil QA','gabil-qa'),",
    "('"+SAME1+"','ops-same1@example.invalid','Alex Same','alex-one'),",
    "('"+SAME2+"','ops-same2@example.invalid','Alex Same','alex-two')",
    "on conflict(id) do update set display_name=excluded.display_name,nickname=excluded.nickname;",
    "insert into public.dc_role_assignments(profile_id,role,scope_type,status,source_system,source_ref,provenance_status) values",
    "('"+OWNER+"','owner_admin','system','active','local-validator','owner-admin-community-ops','confirmed');",
    "insert into public.dc_system_memberships(profile_id,status,source_system,source_ref,provenance_status) values",
    "('"+MEMBER+"','active','local-validator','owner-admin-community-ops','confirmed')",
    "on conflict(profile_id) do update set status=excluded.status;",
    "insert into public.dc_artifact_slot_grants(profile_id,amount,grant_key,reason,source_system,source_ref,provenance_status,granted_by_profile_id) values",
    "('"+MEMBER+"',1,'ops-baseline','baseline','local-validator','seed-1','confirmed','"+OWNER+"'),",
    "('"+MEMBER+"',3,'ops-extra','extra','local-validator','seed-2','confirmed','"+OWNER+"');",
    "insert into public.dc_artifacts(id,author_profile_id,artifact_type,title,body,status,visibility,published_at,source_system,provenance_status) values",
    "('"+ACTIVE_ART+"','"+MEMBER+"','idea','Ops active','body','active','community',now(),'local-validator','confirmed'),",
    "('"+ARCHIVED_ART+"','"+MEMBER+"','idea','Ops archived','body','archived','community',now()-interval '1 day','local-validator','confirmed');"
  ].join('\n'));

  const search=json(OWNER,"select coalesce(json_agg(row_to_json(q)),'[]'::json)::text from public.dc_admin_profile_search_v1('Alex',12) q;");
  if(search.length!==2)throw new Error('same-name search expected 2 rows, got '+search.length);
  if(new Set(search.map(x=>x.profile_ref)).size!==2)throw new Error('safe profile refs are not unique');
  if(search.some(x=>'email' in x))throw new Error('private email leaked from profile projection');

  expectError(MEMBER,"select count(*) from public.dc_admin_profile_search_v1('Alex',12);",'OWNER_ADMIN_REQUIRED','member profile search');
  expectError(MEMBER,"select public.dc_admin_artifact_slot_status_v1('"+MEMBER+"'::uuid);",'OWNER_ADMIN_REQUIRED','member slot status');
  expectError(OWNER,"select count(*) from public.dc_admin_profile_search_v1('A',12);",'PROFILE_QUERY_INVALID','short profile query');

  const status=json(OWNER,"select public.dc_admin_artifact_slot_status_v1('"+MEMBER+"'::uuid)::text;");
  if(status.artifact_slots_granted!==4)throw new Error('granted expected 4');
  if(status.artifact_slots_consuming!==1)throw new Error('consuming expected 1');
  if(status.artifact_slots_available!==3)throw new Error('available expected 3');
  if(status.published_artifact_count!==2)throw new Error('published expected 2');
  if(!Array.isArray(status.grant_history)||status.grant_history.length!==2)throw new Error('grant history expected 2');
  if(status.profile?.membership_status!=='active')throw new Error('membership status projection drift');

  result.runtime_validation='PASS_LOCAL_SUPABASE';
  result.runtime={
    repeatable_migration:'PASS',
    owner_admin_gate:'PASS',
    same_name_disambiguation:'PASS',
    no_email_projection:'PASS',
    slot_formula:'PASS',
    grant_history:'PASS',
    membership_status:'PASS'
  };
}finally{
  try{cleanup()}catch{}
}

console.log(JSON.stringify(result,null,2));
