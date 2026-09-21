import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const DETAIL_ID='11111111-1111-4111-8111-111111111111';
const MISSING_ID='22222222-2222-4222-8222-222222222222';
const ARTIFACT_UUID_PATH=/^\/community\/artifact\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/?$/i;

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(ARTIFACT_UUID_PATH.test(pathname))pathname='/community/artifact/index.html';
  else if(pathname.endsWith('/'))pathname+='index.html';
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
const user={id:'qa-artifacts-user',email:'qa-artifacts@dementor.invalid',user_metadata:{full_name:'QA Artifacts'}};
const session={user};
const mode=new URL(location.href).searchParams.get('qaMode')||'normal';
const historyPage=location.pathname.includes('/workspace/artifacts');
const detailId='11111111-1111-4111-8111-111111111111';
const active={status:'active',valid_from:null,valid_to:null};
const baseArtifact={
  id:detailId,author_profile_id:user.id,artifact_type:'announcement',title:'TERMINAL STATE ARTIFACT',body:'Primary Artifact body remains usable.',external_url:mode==='youtube'?'https://www.youtube.com/watch?v=dQw4w9WgXcQ':null,
  status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-21T10:00:00Z',created_at:'2026-09-21T09:00:00Z',closed_at:null
};
const historyArtifacts=[
  {id:'qa-active',author_profile_id:user.id,artifact_type:'notice',title:'Куда двигаемся - народ?',body:'Активная запись.',external_url:null,status:'active',visibility:'community',created_at:'2026-09-04T09:00:00Z',published_at:'2026-09-04T10:00:00Z',closed_at:null},
  {id:'qa-archived',author_profile_id:user.id,artifact_type:'notice',title:'гусь',body:'Архивная запись.',external_url:null,status:'archived',visibility:'community',created_at:'2026-09-03T09:00:00Z',published_at:'2026-09-03T10:00:00Z',closed_at:'2026-09-04T08:00:00Z'}
];
const rowsFor=t=>{
  if(t==='profiles')return[{id:user.id,email:user.email,full_name:'QA Artifacts',display_name:'QA Artifacts',avatar_url:null}];
  if(t==='dc_role_assignments'||t==='dc_entity_assignments'||t==='join_applications')return[];
  if(t==='dc_system_memberships')return mode==='guest'?[]:[{profile_id:user.id,...active}];
  if(t==='dc_artifacts')return historyPage?historyArtifacts:[baseArtifact];
  if(t==='dc_member_public_profiles')return[{profile_id:user.id,display_name:'QA Artifacts',nickname:'qa-artifacts',avatar_url:null,member_since:'2026-09-01'}];
  if(t==='dc_artifact_reactions')return[{id:'reaction-1',profile_id:user.id,reaction_type:'interested'}];
  if(t==='dc_artifact_responses')return[];
  if(t==='dc_artifact_media')return ['normal','media-sign-fail','media-sign-stall'].includes(mode)?[{id:'media-1',artifact_id:detailId,media_type:'image',storage_path:'qa/private-image.jpg',metadata:{name:'private-image.jpg'}}]:[];
  return[];
};
function tableError(t){
  if(mode==='secondary-fail'&&t==='dc_artifact_reactions')return{message:'SECONDARY_REACTION_FAILURE',code:'QA_SECONDARY'};
  if(mode==='primary-denied'&&t==='dc_artifacts')return{message:'permission denied for Artifact',code:'42501'};
  return null;
}
const query=t=>{
  let data=[...rowsFor(t)];
  const c={
    select(){return c},
    eq(k,v){data=data.filter(r=>r?.[k]===v);return c},
    neq(){return c},
    in(k,values){data=data.filter(r=>values.includes(r?.[k]));return c},
    is(){return c},
    order(){return c},
    limit(n){data=data.slice(0,n);return c},
    range(){return c},
    update(){return c},insert(){return c},upsert(){return c},delete(){return c},
    maybeSingle(){
      if(mode==='primary-stall'&&t==='dc_artifacts')return new Promise(()=>{});
      const error=tableError(t);return Promise.resolve({data:error?null:(data[0]||null),error});
    },
    single(){const error=tableError(t);return Promise.resolve({data:error?null:(data[0]||null),error})},
    then(resolve,reject){
      if(mode==='secondary-stall'&&t==='dc_artifact_reactions')return new Promise(()=>{}).then(resolve,reject);
      const error=tableError(t);return Promise.resolve({data:error?null:data,error}).then(resolve,reject);
    }
  };
  return c;
};
async function rpc(name,args={}){
  if(name==='dc_member_entry_status_v1')return{data:mode==='guest'?{membership_active:false,community_activation_state:null,sphere_gate_complete:false,sphere_count:0}:{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_gate_complete:true,sphere_count:9},error:null};
  if(name==='dc_board_promotion_state_read_v1'){
    if(mode==='promotion-stall')return new Promise(()=>{});
    if(mode==='promotion-fail')return{data:null,error:{message:'PROMOTION_FAILURE',code:'QA_PROMOTION'}};
    return{data:[{artifact_id:detailId,support_count:0,promotion_threshold:2,delivery_status:'held',can_support:true,my_support:false}],error:null};
  }
  if(name==='dc_guest_board_artifact_detail_read_v1'){
    if(mode!=='guest')return{data:null,error:{message:'GUEST_DETAIL_UNEXPECTED'}};
    return{data:{artifact:baseArtifact,author:{profile_id:user.id,display_name:'QA Guest Author',nickname:null,avatar_url:null},reaction_count:2,guest_interest_count:1,my_guest_interest:false,my_guest_response_submitted:false,media:[]},error:null};
  }
  if(name==='dc_artifact_publisher_scopes_v1')return{data:[],error:null};
  if(name==='dc_board_entity_projection_read_v1')return{data:[],error:null};
  return{data:[],error:null};
}
export function createClient(){return{
  auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user},error:null}),signInWithOAuth:async()=>({data:{},error:null}),signOut:async()=>({error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},
  from:query,
  rpc,
  storage:{from:()=>({createSignedUrl:async path=>{
    if(mode==='media-sign-stall')return new Promise(()=>{});
    if(mode==='media-sign-fail')return{data:null,error:{message:'MEDIA_SIGN_FAILURE',code:'QA_MEDIA_SIGN'}};
    return{data:{signedUrl:'https://signed.invalid/'+encodeURIComponent(path)+'?token=qa'},error:null}
  }})},
  functions:{invoke:async()=>({data:{},error:null})}
}}
`;

async function makeContext({width=1280,bootstrapFail=false}={}){
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.addInitScript(()=>{
    window.__DC_ARTIFACT_TEST_TIMEOUTS__={essential:180,optional:120};
    window.__DC_ARTIFACT_BOOT_WATCHDOG_MS__=250;
    try{localStorage.setItem('dc:board:tutorial:v21:qa-artifacts-user:member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}
  });
  await context.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub()}):route.abort());
  await context.route('https://signed.invalid/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#bbb"/></svg>'}));
  await context.route('https://i.ytimg.com/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#ddd"/></svg>'}));
  if(bootstrapFail)await context.route('**/community/artifact/artifact.js',route=>route.fulfill({status:404,contentType:'text/javascript',body:'// unavailable'}));
  return context;
}
const detailUrl=(mode='normal',id=DETAIL_ID)=>`${base}/community/artifact/${id}/?qaMode=${encodeURIComponent(mode)}`;
async function terminalState(page,timeout=1800){
  await page.waitForFunction(()=>{const value=document.getElementById('artifactState')?.textContent?.trim();return value&&value!=='LOADING'},null,{timeout});
  return (await page.locator('#artifactState').innerText()).trim();
}
async function assertPrimaryUsable(page,label){
  await page.locator('.dc-artifact-record').waitFor({state:'visible',timeout:1200});
  expect((await page.locator('.dc-artifact-record h1').innerText())==='TERMINAL STATE ARTIFACT',`${label}: primary title missing`);
  expect((await page.locator('.dc-artifact-body').innerText()).includes('Primary Artifact body remains usable.'),`${label}: primary body missing`);
  expect((await page.locator('#artifactState').innerText()).trim()!=='LOADING',`${label}: remained LOADING`);
}
async function runDetailCase({mode='normal',width=1280,bootstrapFail=false,check}){
  const context=await makeContext({width,bootstrapFail});const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(detailUrl(mode),{waitUntil:'domcontentloaded'});
  try{await check(page)}catch(error){errors.push(`${mode}@${width}: ${error.message}`)}
  expect(!pageErrors.length,`${mode}@${width}: page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

// Preserve the existing My Artifacts history regression.
{
  const context=await makeContext();const page=await context.newPage();const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.goto(base+'/workspace/artifacts/',{waitUntil:'domcontentloaded'});
  try{
    await page.locator('[data-workspace-sidebar]').waitFor({state:'visible',timeout:5000});
    await page.locator('[data-artifact-history]').first().waitFor({state:'visible',timeout:5000});
    expect(await page.locator('.dc-global-header').count()===0,'My Artifacts: public header leaked into private Workspace');
    expect(await page.locator('[data-artifact-history]').count()===2,'My Artifacts: all-history projection must show active + archived records');
    await page.getByRole('button',{name:'АРХИВ'}).click();
    expect(await page.locator('[data-artifact-history]').count()===1,'My Artifacts: archive filter did not isolate archived history');
    const archived=page.locator('[data-artifact-history="qa-archived"]');
    expect(await archived.count()===1,'My Artifacts: archived fixture disappeared');
    expect((await archived.innerText()).includes('гусь'),'My Artifacts: archived title missing');
    expect((await archived.getAttribute('data-artifact-status'))==='archived','My Artifacts: archived status drifted');
    await page.getByRole('button',{name:'АКТИВНЫЕ'}).click();
    expect(await page.locator('[data-artifact-history]').count()===1,'My Artifacts: active filter did not isolate active history');
    const activeCard=page.locator('[data-artifact-history="qa-active"]');
    const boardLink=activeCard.getByRole('link',{name:'НА ДОСКУ →'});
    expect(await boardLink.count()===1,'My Artifacts: active Artifact lost Board continuation');
    expect((await boardLink.getAttribute('href'))==='/workspace/board/','My Artifacts: active Artifact still points to compatibility Board route');
  }catch(error){errors.push(`My Artifacts browser flow failed: ${error.message}`)}
  expect(!pageErrors.length,`My Artifacts page errors: ${pageErrors.join(' | ')}`);
  await context.close();
}

await runDetailCase({mode:'normal',check:async page=>{
  await assertPrimaryUsable(page,'normal private-image Artifact');
  await page.locator('.dc-artifact-media img').waitFor({state:'visible',timeout:1200});
  const src=await page.locator('.dc-artifact-media img').getAttribute('src');
  expect(String(src).startsWith('https://signed.invalid/')&&String(src).includes('token=qa'),'normal: authenticated signed media missing');
  await page.reload({waitUntil:'domcontentloaded'});await assertPrimaryUsable(page,'normal direct refresh');
}});

await runDetailCase({mode:'text-only',check:async page=>{
  await assertPrimaryUsable(page,'text-only Artifact');
  await page.waitForTimeout(180);
  expect(await page.locator('.dc-artifact-media').count()===0,'text-only: unexpected media rendered');
}});

await runDetailCase({mode:'youtube',check:async page=>{
  await assertPrimaryUsable(page,'YouTube Artifact');
  expect(await page.locator('.dc-artifact-link').count()===1,'youtube: external URL capability disappeared');
  await page.locator('.dc-youtube-presentation').waitFor({state:'visible',timeout:1200});
}});

await runDetailCase({mode:'guest',check:async page=>{
  await assertPrimaryUsable(page,'guest-readable Artifact');
  expect((await page.locator('.dc-artifact-author').innerText()).includes('QA Guest Author'),'guest: canonical guest projection author missing');
}});

await runDetailCase({mode:'promotion-stall',check:async page=>{
  await assertPrimaryUsable(page,'promotion stall');
  await page.waitForTimeout(260);
  expect((await page.locator('#artifactState').innerText()).trim()!=='LOADING','promotion stall: primary regressed to LOADING');
}});

await runDetailCase({mode:'media-sign-fail',check:async page=>{
  await assertPrimaryUsable(page,'media signing failure');
  await page.waitForTimeout(220);
  expect(await page.locator('.dc-artifact-media img').count()===0,'media signing failure: broken image rendered');
  expect((await page.locator('#artifactState').innerText()).trim()!=='ERROR','media signing failure incorrectly owned primary terminal state');
}});

await runDetailCase({mode:'media-sign-stall',check:async page=>{
  await assertPrimaryUsable(page,'media signing stall');
  await page.waitForTimeout(260);
  expect((await page.locator('#artifactState').innerText()).trim()!=='LOADING','media signing stall: primary blocked');
}});

await runDetailCase({mode:'secondary-fail',check:async page=>{
  await assertPrimaryUsable(page,'secondary query failure');
  await page.waitForTimeout(220);
  expect((await page.locator('.dc-artifact-actions').innerText()).includes('ДЕЙСТВИЯ ВРЕМЕННО НЕДОСТУПНЫ'),'secondary failure: degraded action state missing');
}});

await runDetailCase({mode:'secondary-stall',check:async page=>{
  await assertPrimaryUsable(page,'secondary query stall');
  await page.waitForTimeout(260);
  expect((await page.locator('.dc-artifact-actions').innerText()).includes('ДЕЙСТВИЯ ВРЕМЕННО НЕДОСТУПНЫ'),'secondary stall: bounded degraded state missing');
}});

await runDetailCase({mode:'primary-denied',check:async page=>{
  const state=await terminalState(page);expect(state==='DENIED',`permission-denied: expected DENIED, got ${state}`);
  expect(await page.locator('#artifactRetry').count()===1,'permission-denied: retry control missing');
  expect(await page.locator('#detailBack').count()===1,'permission-denied: Board recovery missing');
}});

await runDetailCase({mode:'primary-stall',check:async page=>{
  const state=await terminalState(page);expect(state==='ERROR',`primary stall: expected bounded ERROR, got ${state}`);
  expect(await page.locator('#artifactRetry').count()===1,'primary stall: retry control missing');
}});

{
  const context=await makeContext();const page=await context.newPage();
  await page.goto(`${base}/community/artifact/?qaMode=normal`,{waitUntil:'domcontentloaded'});
  try{const state=await terminalState(page);expect(state==='INVALID',`invalid id: expected INVALID, got ${state}`)}catch(error){errors.push(`invalid id: ${error.message}`)}
  await context.close();
}

{
  const context=await makeContext();const page=await context.newPage();
  await page.goto(detailUrl('normal',MISSING_ID),{waitUntil:'domcontentloaded'});
  try{const state=await terminalState(page);expect(state==='NOT FOUND',`missing Artifact: expected NOT FOUND, got ${state}`)}catch(error){errors.push(`missing Artifact: ${error.message}`)}
  await context.close();
}

await runDetailCase({mode:'normal',bootstrapFail:true,check:async page=>{
  const state=await terminalState(page);expect(state==='ERROR',`bootstrap failure: expected ERROR, got ${state}`);
  expect(await page.locator('[data-artifact-bootstrap-fallback]').count()===1,'bootstrap failure: page-level terminal fallback missing');
  expect(await page.locator('#artifactBootstrapRetry').count()===1,'bootstrap failure: retry control missing');
  expect(await page.locator('#detailBack').count()===1,'bootstrap failure: Board recovery missing');
}});

for(const width of [390,360]){
  await runDetailCase({mode:'promotion-stall',width,check:async page=>{
    await assertPrimaryUsable(page,`mobile ${width} promotion stall`);
    const box=await page.locator('.dc-artifact-record').boundingBox();
    expect(Boolean(box)&&box.width<=width,`mobile ${width}: detail record overflows viewport`);
  }});
}

await browser.close();await new Promise(resolve=>server.close(resolve));
if(errors.length){console.error('ARTIFACT TERMINAL-STATE REGRESSION BLOCKED');for(const error of errors)console.error(`- ${error}`);process.exit(1)}
console.log('Artifact terminal-state regression PASS: My Artifacts history + normal/text/private-image/YouTube/guest detail + promotion/media/secondary fault isolation + bounded primary failure + INVALID/NOT FOUND/DENIED/ERROR terminal states + bootstrap fallback + direct refresh + mobile 390/360.');
