#!/usr/bin/env node
// BQA-23 local G5 proof: disposable Supabase only. Never touches linked/live DBs.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const SOURCE_SUPABASE=path.join(ROOT,'supabase');
const SOURCE_MIGRATIONS=path.join(SOURCE_SUPABASE,'migrations');
const PROFILE_VALIDATOR=path.join(ROOT,'scripts','validate-owner-admin-community-ops-local.mjs');
const PROJECT_ID='dc-bqa23-'+process.pid+'-'+crypto.randomBytes(3).toString('hex');
const PREHISTORY_NAME='20260827212519_pre_dementor_replay_fixture.sql';
const OVERLAY_NAME='20260924002459_observed_production_compatibility_overlay.sql';
const ARTIFACT_VERSION='20260924002500';
const BQA23_VERSION='20260930180000';
const EXPECTED_BLOBS={
  '20260827212520_archive_edu_and_create_dementor_core.sql':'ad1e8762167dc1a01f023b70247abdbff808bde7',
  '20260827212614_secure_legacy_edu_archive.sql':'c69bbdfdb8e5e00f6a3b569e925349e15a5076ce',
  '20260828170411_dc_workspace_readonly_v01.sql':'6d313eda5d8fa23713e2186dac0f39317d4f28d1',
  '20260924002500_artifact_collaboration_v1.sql':'b596500ed3145ec1f352464c8609c38e02efbc05',
  '20260930180000_owner_admin_community_ops_read_v1.sql':'1ec5a2f8c7279106f9a405026d82f8424c245e27'
};
const FIXTURE_FILES=['01_pre_dementor_edu_schema.sql','02_minimal_synthetic_auth_identities.sql','03_auth_trigger_binding.sql'];
const OVERLAY_FILES=['01_observed_production_functions.sql','02_observed_production_policies.sql'];
const env={...process.env,SUPABASE_TELEMETRY_DISABLED:'1',DO_NOT_TRACK:'1'};
for(const key of ['SUPABASE_ACCESS_TOKEN','SUPABASE_DB_PASSWORD','SUPABASE_PROJECT_REF','SUPABASE_SERVICE_ROLE_KEY','SUPABASE_SECRET_KEY','DATABASE_URL','SUPABASE_DB_URL']) delete env[key];

function fail(message){throw new Error(message);}
function run(executable,args,cwd=ROOT,input){
  return execFileSync(executable,args,{
    cwd,env,encoding:'utf8',input,stdio:['pipe','pipe','pipe'],maxBuffer:16*1024*1024
  }).trim();
}
function git(...args){return run('git',args);}
function checkSource(){
  if(git('branch','--show-current')!=='result/owner-admin-community-ops-v1') fail('Expected BQA-23 integration branch; refusing other branches');
  if(fs.existsSync(path.join(SOURCE_SUPABASE,'.temp','project-ref'))) fail('Linked Supabase metadata in source checkout; refusing');
  if(fs.existsSync(path.join(SOURCE_MIGRATIONS,PREHISTORY_NAME)) || fs.existsSync(path.join(SOURCE_MIGRATIONS,OVERLAY_NAME))) {
    fail('Local-only replay fixtures must not be checked into source migrations');
  }
  for(const [name,expected] of Object.entries(EXPECTED_BLOBS)){
    const file=path.join(SOURCE_MIGRATIONS,name);
    if(!fs.existsSync(file)) fail('Migration missing: '+name);
    const actual=git('hash-object',file);
    if(actual!==expected) fail('Migration source drift: '+name+' '+actual+' != '+expected);
  }
  for(const name of FIXTURE_FILES){
    if(!fs.existsSync(path.join(SOURCE_SUPABASE,'bootstrap','prehistory',name))) fail('Prehistory fixture missing: '+name);
  }
  for(const name of OVERLAY_FILES){
    if(!fs.existsSync(path.join(SOURCE_SUPABASE,'bootstrap','production-compatibility',name))) fail('Compatibility overlay missing: '+name);
  }
}
function portFree(port){
  return new Promise(resolve=>{
    const sock=net.createServer();
    sock.unref();
    sock.once('error',()=>resolve(false));
    // Docker Desktop publishes on 0.0.0.0, not necessarily 127.0.0.1.
    sock.listen({host:'0.0.0.0',port},()=>sock.close(()=>resolve(true)));
  });
}
async function allocateIsolatedPorts(){
  // Docker Desktop's internal port allocator may reserve a published port even
  // when the macOS socket probe reports it as free.
  const published=run('docker',['ps','-a','--format','{{.Ports}}']);
  const dockerPorts=new Set([...published.matchAll(/:(\d+)->/g)].map(match=>Number(match[1])));
  for(let attempt=0;attempt<80;attempt++){
    const base=30000+crypto.randomInt(0,1700)*10;
    const ports=Array.from({length:10},(_,offset)=>base+offset);
    if(ports.some(port=>dockerPorts.has(port))) continue;
    if((await Promise.all(ports.map(portFree))).every(Boolean)){
      return {base,api:base+1,db:base+2,studio:base+3,inbucket:base+4};
    }
  }
  fail('No available isolated 10-port range; leave other Supabase stacks running and inspect Docker port allocations');
}
function materialize(parts,folder){
  return parts.map(name=>'-- '+name+'\n'+fs.readFileSync(path.join(folder,name),'utf8').trim()+'\n').join('\n')+'\n';
}
function prepare(tempRoot,ports){
  const dst=path.join(tempRoot,'supabase');
  fs.cpSync(SOURCE_SUPABASE,dst,{
    recursive:true,
    filter:src=>!['.temp','.branches'].includes(path.basename(src))
  });
  const conf=path.join(dst,'config.toml');
  const old=fs.readFileSync(conf,'utf8');
  if(!/^project_id\s*=\s*"[^"]+"/m.test(old)) fail('Supabase project_id missing');
  // Only the ephemeral copy gets custom ports. Source config and other stacks stay untouched.
  const overrides=[
    '[api]', 'port = '+ports.api,
    '[db]', 'port = '+ports.db, 'shadow_port = '+ports.base,
    '[db.pooler]', 'port = '+(ports.base+9),
    '[studio]', 'port = '+ports.studio,
    '[inbucket]', 'port = '+ports.inbucket, 'smtp_port = '+(ports.base+5), 'pop3_port = '+(ports.base+6),
    '[analytics]', 'port = '+(ports.base+7), 'vector_port = '+(ports.base+8)
  ].join('\n');
  fs.writeFileSync(conf,old.replace(/^project_id\s*=\s*"[^"]+"/m,'project_id = "'+PROJECT_ID+'"')+'\n'+overrides+'\n');
  const tempMigrations=path.join(dst,'migrations');
  fs.writeFileSync(path.join(tempMigrations,PREHISTORY_NAME),
    materialize(FIXTURE_FILES,path.join(SOURCE_SUPABASE,'bootstrap','prehistory')));
  fs.writeFileSync(path.join(tempMigrations,OVERLAY_NAME),
    materialize(OVERLAY_FILES,path.join(SOURCE_SUPABASE,'bootstrap','production-compatibility')));
}
function findOwnedDatabase(){
  const names=run('docker',['ps','--filter','label=com.supabase.cli.project='+PROJECT_ID,'--format','{{.Names}}'])
    .split(/\r?\n/).filter(Boolean);
  const db=names.find(name=>name.startsWith('supabase_db_'));
  if(!db) fail('Owned disposable Supabase DB container not found');
  return db;
}
function sql(container,query){
  return run('docker',['exec','-i',container,'psql','-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-Atq'],ROOT,query);
}
function verifyMigrations(container){
  if(sql(container,'select 1;')!=='1') fail('Disposable PostgreSQL not reachable');
  for(const version of [ARTIFACT_VERSION,BQA23_VERSION]){
    const n=sql(container,"select count(*) from supabase_migrations.schema_migrations where version='"+version+"';");
    if(n!=='1') fail('Tracked migration not applied: '+version);
  }
  for(const signature of ['dc_admin_profile_search_v1(text,integer)','dc_admin_artifact_slot_status_v1(uuid)']){
    const n=sql(container,"select to_regprocedure('public."+signature+"') is not null;");
    if(n!=='t') fail('Missing BQA-23 RPC '+signature);
  }
}
function runtimeMatrix(container){
  const output=run('node',[PROFILE_VALIDATOR,container]);
  const parsed=JSON.parse(output);
  if(parsed.runtime_validation!=='PASS_LOCAL_SUPABASE') fail('BQA-23 runtime validator did not return PASS_LOCAL_SUPABASE');
  return parsed;
}
async function main(){
  checkSource();
  const dockerVersion=run('docker',['version','--format','{{.Server.Version}}']);
  const ports=await allocateIsolatedPorts();
  const cliVersion=run('supabase',['--version']);
  const sourceHead=git('rev-parse','HEAD');
  const tempRoot=fs.mkdtempSync(path.join(os.tmpdir(),'dc-bqa23-proof-'));
  let startAttempted=false,stopOk=false;
  const result={source_head:sourceHead,branch:'result/owner-admin-community-ops-v1',
    local_project_id:PROJECT_ID,docker_version:dockerVersion,supabase_cli:cliVersion,
    local_only:true,host_ports:ports,phase:'PREPARE',first_runtime:null,second_runtime:null,reset_warning:null};
  try{
    prepare(tempRoot,ports);
    result.phase='START_DISPOSABLE_SUPABASE';
    startAttempted=true;
    try{run('supabase',['start'],tempRoot);}
    catch(error){fail('Supabase start failed (disposable): '+String(error.stderr||error.message).slice(-3000));}
    let container=findOwnedDatabase();
    verifyMigrations(container);
    result.phase='FIRST_RUNTIME';
    result.first_runtime=runtimeMatrix(container);

    result.phase='CLEAN_REPLAY_RESET';
    try{run('supabase',['db','reset','--local'],tempRoot);}
    catch(error){
      const msg=String(error.stderr||'')+'\n'+String(error.stdout||'');
      if(!msg.includes('Error status 502')) throw error;
      result.reset_warning='SUPABASE_CLI_POST_RESET_502_DATABASE_PROOF_REQUIRED';
    }
    container=findOwnedDatabase();
    verifyMigrations(container);
    result.phase='SECOND_RUNTIME';
    result.second_runtime=runtimeMatrix(container);
    result.phase='PASS_LOCAL_RUNTIME';
    result.g5_backend_runtime='PASS_LOCAL_SUPABASE';
  }catch(error){
    result.g5_backend_runtime='FAIL';
    result.error=String(error.stderr||error.message||error).slice(-4000);
    process.exitCode=1;
  }finally{
    if(startAttempted){
      try{run('supabase',['stop','--no-backup'],tempRoot);stopOk=true;}
      catch(error){result.stop_error=String(error.stderr||error.message).slice(-1200);process.exitCode=1;}
    }else stopOk=true;
    if(stopOk){fs.rmSync(tempRoot,{recursive:true,force:true});result.cleanup='DISPOSABLE_STACK_REMOVED';}
    else{result.cleanup='STOP_FAILED_MANUAL_INSPECTION_REQUIRED';result.temp_workspace=tempRoot;}
    process.stdout.write(JSON.stringify(result,null,2)+'\n');
  }
}
await main();
