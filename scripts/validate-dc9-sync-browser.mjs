import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,message)=>{if(!ok)errors.push(message)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
  if(!full.startsWith(path.resolve(artifact)+path.sep)&&full!==path.resolve(artifact))return null;
  return full;
}
const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
  res.statusCode=200;res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

const supabaseStub=()=>`
  globalThis.__QA_CREATE_CLIENT_COUNT__=(globalThis.__QA_CREATE_CLIENT_COUNT__||0)+1;
  globalThis.__QA_RUN_WRITES__=globalThis.__QA_RUN_WRITES__||[];
  const user={id:'qa-dc9-user',email:'qa-dc9@dementor.invalid',user_metadata:{full_name:'QA DC9'}};
  const session={user};
  const query=table=>{
    let rows=table==='profiles'?[{id:user.id,email:user.email,full_name:'QA DC9',display_name:'QA DC9',avatar_url:null}]:[];
    const c={
      select(){return c},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return c},in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return c},order(){return c},limit(n){rows=rows.slice(0,n);return c},
      maybeSingle(){
        if(table==='assessment_snapshots')return Promise.resolve({data:globalThis.__QA_REMOTE_STATE__?{state_json:globalThis.__QA_REMOTE_STATE__}:null,error:null});
        if(table==='dc_system_memberships')return Promise.resolve({data:null,error:null});
        return Promise.resolve({data:rows[0]||null,error:null});
      },
      upsert(payload){
        if(table==='assessment_runs')globalThis.__QA_RUN_WRITES__.push(payload);
        if(table==='assessment_snapshots')globalThis.__QA_REMOTE_WRITTEN__=payload.state_json;
        return Promise.resolve({data:payload,error:null});
      },
      then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}
    };return c
  };
  export function createClient(){
    const client={__qaClientId:'client-'+globalThis.__QA_CREATE_CLIENT_COUNT__,auth:{
      getSession:async()=>({data:{session},error:null}),
      getUser:async()=>({data:{user},error:null}),
      signInWithOAuth:async()=>({data:{},error:null}),signOut:async()=>({error:null}),
      onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})
    },from:query,rpc:async name=>({data:name==='dc_member_entry_status_v1'?{sphere_count:0,sphere_gate_complete:false,membership_active:false,community_activation_state:null,artifact_slots_available:0,published_artifact_count:0}:null,error:null}),storage:{from:()=>({})},functions:{invoke:async()=>({data:{},error:null})}};
    globalThis.__QA_LAST_CLIENT__=client;return client;
  }
`;

async function context({localState,remoteState}){
  const c=await browser.newContext({viewport:{width:1280,height:900}});
  await c.addInitScript(({localState,remoteState})=>{
    globalThis.__QA_REMOTE_STATE__=remoteState;
    if(localState)localStorage.setItem('dementorClubOnboardingV3',JSON.stringify(localState));
  },{localState,remoteState});
  await c.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub()}):route.abort());
  return c;
}

const current='dc9-immersive-v1';
// Partial local progress + remote answers: login/sync must preserve both and the reloaded
// DC-9 picker must expose the recovered 4/6 draft.
{
  const localState={quizVersion:current,results:{'self-development':{date:'2026-09-01T10:00:00Z',level:1}},drafts:{work:{quizVersion:current,sphere:'work',answers:[1,2,null,null,null,null],startedAt:'2026-09-08T09:00:00Z',updatedAt:'2026-09-08T10:00:00Z'}},active:{quizVersion:current,sphere:'work',index:2,updatedAt:'2026-09-08T10:00:00Z'},qaUnknown:'keep-me'};
  const remoteState={quizVersion:current,results:{self_development:{date:'2026-09-01T10:00:00Z',level:1}},drafts:{work:{quizVersion:current,sphere:'work',answers:[null,null,3,1,null,null],startedAt:'2026-09-08T09:30:00Z',updatedAt:'2026-09-08T11:00:00Z'}},active:{quizVersion:current,sphere:'work',index:3,updatedAt:'2026-09-08T11:00:00Z'},remoteUnknown:'keep-remote'};
  const c=await context({localState,remoteState}),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/join/',{waitUntil:'domcontentloaded'});
  try{await p.waitForFunction(()=>globalThis.__DC_AUTH_TRACE__?.some(x=>x.step==='boot-done'),{timeout:10000})}catch{errors.push('DC9 browser: canonical account sync did not finish after remote recovery')}
  const state=await p.evaluate(()=>JSON.parse(localStorage.getItem('dementorClubOnboardingV3')||'{}'));
  expect(JSON.stringify(state.drafts?.work?.answers)===JSON.stringify([1,2,3,1,null,null]),`DC9 browser: partial answers lost after login/sync: ${JSON.stringify(state.drafts?.work?.answers)}`);
  expect(state.qaUnknown==='keep-me'&&state.remoteUnknown==='keep-remote','DC9 browser: unknown state fields were lost in real runtime sync');
  expect(!state.results?.['self-development']&&Boolean(state.results?.self_development),'DC9 browser: legacy sphere id survived real runtime normalization');
  try{await p.locator('.dc9-sphere[data-sphere="1"] p').waitFor({state:'visible',timeout:4000});expect((await p.locator('.dc9-sphere[data-sphere="1"] p').innerText()).includes('4/6'),'DC9 browser: recovered draft is not visible as CONTINUE 4/6')}catch(e){errors.push(`DC9 browser: recovered work draft did not render: ${e.message}`)}
  expect((await p.evaluate(()=>globalThis.__QA_CREATE_CLIENT_COUNT__))===1,'DC9 browser: more than one Supabase client was created on Join after runtime boot');
  const writes=await p.evaluate(()=>globalThis.__QA_RUN_WRITES__||[]);
  expect(writes.every(x=>x.sphere_id!=='self-development'&&!String(x.source_key||'').includes('self-development')),'DC9 browser: legacy self-development was persisted by active sync');
  expect(!pageErrors.length,`DC9 browser page errors: ${pageErrors.join(' | ')}`);await c.close();
}

// Clean-device recovery: a remote-only current-version draft must become local state
// and be resumable without inventing a local completed run.
{
  const remoteState={quizVersion:current,drafts:{control:{quizVersion:current,sphere:'control',answers:[2,1,3,null,null,null],startedAt:'2026-09-08T08:00:00Z',updatedAt:'2026-09-08T12:00:00Z'}},active:{quizVersion:current,sphere:'control',index:3,updatedAt:'2026-09-08T12:00:00Z'},results:{}};
  const c=await context({localState:null,remoteState}),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/join/',{waitUntil:'domcontentloaded'});
  try{await p.waitForFunction(()=>globalThis.__DC_AUTH_TRACE__?.some(x=>x.step==='boot-done'),{timeout:10000})}catch{errors.push('DC9 browser: clean-device remote sync did not finish')}
  const state=await p.evaluate(()=>JSON.parse(localStorage.getItem('dementorClubOnboardingV3')||'{}'));
  expect(JSON.stringify(state.drafts?.control?.answers)===JSON.stringify([2,1,3,null,null,null]),'DC9 browser: remote-only draft was not restored on clean device');
  try{expect((await p.locator('.dc9-sphere[data-sphere="4"] p').innerText()).includes('3/6'),'DC9 browser: clean-device recovered draft is not resumable in picker')}catch(e){errors.push(`DC9 browser: clean-device draft did not render: ${e.message}`)}
  expect((await p.evaluate(()=>globalThis.__QA_CREATE_CLIENT_COUNT__))===1,'DC9 browser: clean-device Join boot created duplicate Supabase clients');
  expect(!pageErrors.length,`DC9 clean-device browser errors: ${pageErrors.join(' | ')}`);await c.close();
}

await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('DC9 SYNC BROWSER BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('DC9 sync browser PASS: partial login/sync + clean-device recovery + visible resume + canonical writes + one client per Join runtime');
