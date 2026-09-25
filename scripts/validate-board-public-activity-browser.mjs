import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
const ARTIFACT_UUID_PATH=/^\/community\/artifact\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/?$/i;
function resolveFile(urlPath){let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);if(ARTIFACT_UUID_PATH.test(pathname))pathname='/community/artifact/index.html';else if(pathname.endsWith('/'))pathname+='index.html';const full=path.resolve(artifact,pathname.replace(/^\/+/,''));return full.startsWith(path.resolve(artifact))?full:null}
const server=http.createServer((req,res)=>{const file=resolveFile(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}res.statusCode=200;res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;

const VIDEO_ID='11111111-1111-4111-8111-111111111111';
const PROFILE_TEXT_ID='22222222-2222-4222-8222-222222222222';
const PRIVATE_IMAGE_ID='33333333-3333-4333-8333-333333333333';
const CLUB_ID='37777777-7777-4777-8777-777777777777';
const QA_ID='38888888-8888-4888-8888-888888888888';
const HIDDEN_ID='44444444-4444-4444-8444-444444444444';
const FUTURE_ID='55555555-5555-4555-8555-555555555555';
const EXPIRED_ID='66666666-6666-4666-8666-666666666666';

const stub=()=>`
const user={id:'qa-board-user',email:'qa@invalid',user_metadata:{full_name:'QA'}};
const session={user};
const videoId='dQw4w9WgXcQ';
const now=Date.parse('2026-09-14T08:00:00Z');
const videoArtifact={id:'${VIDEO_ID}',author_profile_id:user.id,artifact_type:'announcement',title:'VIDEO ARTIFACT',body:'YouTube presentation evidence',external_url:'https://www.youtube.com/shorts/'+videoId,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-14T06:00:00Z',created_at:'2026-09-14T05:55:00Z',closed_at:null};
const profileText={id:'${PROFILE_TEXT_ID}',artifact_type:'post',title:'PROFILE TEXT',body:'Profile-published text fixture',external_url:null,status:'active',visibility:'community',board_hidden_at:null,starts_at:null,expires_at:null,published_at:'2026-09-14T05:59:00Z',publisher_scope:'profile',publisher_display_name:'QA MEMBER'};
const privateImage={id:'${PRIVATE_IMAGE_ID}',author_profile_id:user.id,artifact_type:'announcement',title:'PRIVATE IMAGE',body:'Private Board image fixture',external_url:null,status:'active',visibility:'community',board_hidden_at:null,starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-14T05:58:00Z',created_at:'2026-09-14T05:53:00Z',closed_at:null,publisher_scope:'profile',publisher_display_name:'QA IMAGE MEMBER',private_image:true,private_storage_path:'qa-private/secret.jpg'};
const clubArtifact={id:'${CLUB_ID}',author_profile_id:user.id,artifact_type:'announcement',title:'CLUB ARTIFACT',body:'Institutional publisher fixture',external_url:null,status:'active',visibility:'community',board_hidden_at:null,starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-14T05:57:30Z',created_at:'2026-09-14T05:52:00Z',closed_at:null,publisher_scope:'club',publisher_display_name:'DEMENTOR CLUB'};
const qaArtifact={id:'${QA_ID}',author_profile_id:user.id,artifact_type:'announcement',title:'QA ARTIFACT',body:'QA provenance fixture',external_url:null,status:'active',visibility:'community',board_hidden_at:null,starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-14T05:57:15Z',created_at:'2026-09-14T05:51:00Z',closed_at:null,source_ref:'qa:stab-01',publisher_scope:'profile',publisher_display_name:'QA MEMBER'};
const fillers=Array.from({length:23},(_,index)=>({id:'70000000-0000-4000-8000-'+String(index+1).padStart(12,'0'),artifact_type:'announcement',title:'ACTIVITY '+String(index+4).padStart(2,'0'),body:'Eligible filler '+String(index+1),external_url:null,status:'active',visibility:'community',board_hidden_at:null,starts_at:null,expires_at:null,published_at:new Date(Date.parse('2026-09-14T05:57:00Z')-index*60000).toISOString(),publisher_scope:index<2?'club':'profile',publisher_display_name:index<2?'DEMENTOR CLUB':'QA MEMBER'}));
const excluded=[
{id:'${HIDDEN_ID}',artifact_type:'announcement',title:'HIDDEN FIXTURE',body:'must not surface',status:'active',visibility:'community',board_hidden_at:'2026-09-14T07:00:00Z',starts_at:null,expires_at:null,published_at:'2026-09-14T06:30:00Z',publisher_scope:'profile',publisher_display_name:'QA MEMBER'},
{id:'${FUTURE_ID}',artifact_type:'announcement',title:'FUTURE FIXTURE',body:'must not surface',status:'active',visibility:'community',board_hidden_at:null,starts_at:'2026-09-15T08:00:00Z',expires_at:null,published_at:'2026-09-14T06:29:00Z',publisher_scope:'profile',publisher_display_name:'QA MEMBER'},
{id:'${EXPIRED_ID}',artifact_type:'announcement',title:'EXPIRED FIXTURE',body:'must not surface',status:'active',visibility:'community',board_hidden_at:null,starts_at:null,expires_at:'2026-09-14T07:00:00Z',published_at:'2026-09-14T06:28:00Z',publisher_scope:'profile',publisher_display_name:'QA MEMBER'}
];
const activitySource=[...excluded,{...videoArtifact,board_hidden_at:null,publisher_scope:'profile',publisher_display_name:'QA MEMBER'},profileText,clubArtifact,privateImage,qaArtifact,...fillers];
const activityProjection=()=>[];
globalThis.__qaActivityRpcCalls=[];
globalThis.__qaActivityFixture={sourceIds:activitySource.map(row=>row.id),eligibleIds:activityProjection().map(row=>row.artifact_id),excludedIds:['${HIDDEN_ID}','${FUTURE_ID}','${EXPIRED_ID}'],privateStoragePath:privateImage.private_storage_path};
const boardArtifacts=[videoArtifact,privateImage,profileText];
const profiles=[{profile_id:user.id,display_name:'DEMENTOR CLUB QA',nickname:'qa',avatar_url:null,member_since:'2026-09-01'}];
const rowsFor=t=>t==='join_applications'?[]:t==='dc_role_assignments'?[]:t==='profiles'?[{id:user.id,full_name:'QA',display_name:'QA'}]:t==='dc_system_memberships'?[{profile_id:user.id,status:'active'}]:t==='dc_artifacts'?boardArtifacts:t==='dc_member_public_profiles'?profiles:t==='dc_artifact_reactions'?[]:t==='dc_artifact_responses'?[]:t==='dc_artifact_media'?[{id:'media-private-image',artifact_id:'${PRIVATE_IMAGE_ID}',media_type:'image',storage_path:'qa-private/secret.jpg',metadata:{name:'private.jpg'}}]:t==='dc_artifact_board_positions'?[{artifact_id:'${VIDEO_ID}',board_id:'community',x:1200,y:900,rotation:0,size_class:null,position_version:1},{artifact_id:'${PRIVATE_IMAGE_ID}',board_id:'community',x:900,y:820,rotation:0,size_class:null,position_version:1},{artifact_id:'${PROFILE_TEXT_ID}',board_id:'community',x:600,y:760,rotation:0,size_class:null,position_version:1}]:t==='dc_artifact_publisher_overrides'?[]:[];
const query=t=>{let rows=[...rowsFor(t)];const q={select(){return q},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return q},is(k,v){rows=rows.filter(r=>v===null?r?.[k]==null:r?.[k]===v);return q},order(){return q},limit(n){rows=rows.slice(0,n);return q},range(a,b){rows=rows.slice(a,b+1);return q},insert(){return Promise.resolve({data:[],error:null})},upsert(){return Promise.resolve({data:[],error:null})},update(){return q},delete(){return q},maybeSingle(){return Promise.resolve({data:rows[0]||null,error:null})},single(){return Promise.resolve({data:rows[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return q};
export function createClient(){return{auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user},error:null}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async(name,args={})=>{if(name==='dc_public_activity_read_v1'){globalThis.__qaActivityRpcCalls.push({...args});return{data:activityProjection(),error:null}}if(name==='dc_member_entry_status_v1')return{data:{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_count:9,sphere_gate_complete:true,artifact_slots_available:0,artifact_slots_consuming:1,published_artifact_count:1},error:null};if(name==='dc_board_entity_projection_read_v1')return{data:[],error:null};if(name==='dc_board_promotion_state_read_v1')return{data:[],error:null};if(name==='dc_normalize_artifact_lifecycle_v1')return{data:[],error:null};if(name==='dc_guest_board_read_v1')return{data:[],error:null};if(name==='dc_artifact_publisher_scopes_v1')return{data:[],error:null};return{data:[],error:null}},storage:{from:()=>({createSignedUrl:async(path)=>({data:{signedUrl:'https://signed.invalid/'+encodeURIComponent(path)+'?token=authorized-board'},error:null}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{},error:null})})},functions:{invoke:async()=>({data:{},error:null})}}}
`;

async function context(browser,options={}){
  const ctx=await browser.newContext(options);
  await ctx.addInitScript(()=>{try{localStorage.setItem('dc:board:tutorial:v21:qa-board-user:member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}});
  await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript',body:stub()}):route.abort());
  await ctx.route('https://i.ytimg.com/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#ddd"/></svg>'}));
  await ctx.route('https://signed.invalid/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#bbb"/></svg>'}));
  return ctx;
}
function watchErrors(page){const errors=[];page.on('pageerror',error=>errors.push(error.message));return errors}
function watchArtifactDiagnostics(page){
  const consoleErrors=[];const requestFailures=[];const badResponses=[];const artifactRequests=[];
  page.on('console',message=>{if(['error','warning'].includes(message.type()))consoleErrors.push(`${message.type()}: ${message.text()}`)});
  page.on('request',request=>{if(new URL(request.url()).pathname==='/community/artifact/artifact.js')artifactRequests.push(request.url())});
  page.on('requestfailed',request=>requestFailures.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText||'UNKNOWN'}`));
  page.on('response',response=>{if(response.status()>=400)badResponses.push(`${response.status()} ${response.url()}`)});
  return{consoleErrors,requestFailures,badResponses,artifactRequests};
}
async function waitForArtifactPresentation(page,errors,network){
  try{
    await page.locator('.dc-artifact-record').waitFor({state:'visible',timeout:4000});
    await page.locator('.dc-artifact-record .dc-youtube-presentation').waitFor({state:'visible',timeout:4000});
  }catch(error){
    const diagnostic=await page.evaluate(()=>({artifactState:document.getElementById('artifactState')?.textContent||null,artifactHost:document.getElementById('artifactHost')?.innerHTML||null,mediaRuntimeLoaded:Boolean([...document.scripts].find(script=>script.src.includes('board-artifact-media-v1.js')))}));
    console.error('Artifact detail presentation diagnostic',JSON.stringify({pageErrors:errors,...network,diagnostic},null,2));
    throw error;
  }
}
async function assertFailClosed(page,scope){
  try{
    await page.waitForFunction(
      ()=>Boolean(
        globalThis.__qaActivityFixture
        &&Array.isArray(globalThis.__qaActivityFixture.sourceIds)
        &&Array.isArray(globalThis.__qaActivityFixture.eligibleIds)
      ),
      undefined,
      {timeout:4000}
    );
  }catch{
    const diagnostic=await page.evaluate(()=>({
      fixturePresent:Boolean(globalThis.__qaActivityFixture),
      sourceIdsIsArray:Array.isArray(globalThis.__qaActivityFixture?.sourceIds),
      eligibleIdsIsArray:Array.isArray(globalThis.__qaActivityFixture?.eligibleIds)
    }));
    throw new Error(`${scope}: ACTIVITY_FIXTURE_READINESS_TIMEOUT ${JSON.stringify(diagnostic)}`);
  }
  const evidence=await page.evaluate(()=>globalThis.__qaActivityFixture);
  for(const id of [VIDEO_ID,PROFILE_TEXT_ID,CLUB_ID,PRIVATE_IMAGE_ID,QA_ID]){
    expect(evidence?.sourceIds?.includes(id)===true,`${scope}: source fixture ${id} missing`);
    expect(evidence?.eligibleIds?.includes(id)===false,`${scope}: generic Board Artifact became public eligible`);
    expect(await page.locator(`[data-activity-id="${id}"]`).count()===0,`${scope}: generic Board Artifact rendered in anonymous Activity`);
  }
  expect(Array.isArray(evidence?.eligibleIds)&&evidence.eligibleIds.length===0,`${scope}: fail-closed projection is not empty`);
}
async function assertNoPrivateTransport(page,scope){
  const html=await page.locator('html').evaluate(el=>el.innerHTML);
  for(const token of ['qa-private/secret.jpg','dc-community-artifacts','/storage/v1/object/','token=','signed.invalid']){
    expect(!html.includes(token),`${scope}: private Board media transport leaked to anonymous DOM: ${token}`);
  }
}

const browser=await chromium.launch({headless:true});
try{
  {
    const ctx=await context(browser,{viewport:{width:1440,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    await page.locator('#currentProgramHost [data-thing-ref]').first().waitFor({state:'visible',timeout:6000});
    await page.waitForTimeout(100);
    expect(await page.locator('.dc-public-activity--home').count()===0,'home: generic Board Activity section must not render without editorial eligibility');
    expect(await page.locator('#currentProgramHost [data-thing-ref]').count()===3,'home: Current Program v0 must remain three reviewed Things');
    await assertFailClosed(page,'home desktop');
    await assertNoPrivateTransport(page,'home desktop');
    const calls=await page.evaluate(()=>globalThis.__qaActivityRpcCalls||[]);
    expect(calls.length===1,'home: expected exactly one initial public Activity read');
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#currentProgramHost [data-thing-ref]').first().waitFor({state:'visible',timeout:6000});
    await page.waitForTimeout(100);
    expect(await page.locator('.dc-public-activity--home').count()===0,'home refresh: generic Board Activity section reappeared');
    await assertFailClosed(page,'home refresh');
    await assertNoPrivateTransport(page,'home refresh');
    expect(!errors.length,`home desktop: ${errors.join(' | ')}`);await ctx.close();
  }
  for(const width of [390,360]){
    const ctx=await context(browser,{viewport:{width,height:844}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    await page.locator('#currentProgramHost [data-thing-ref]').first().waitFor({state:'visible',timeout:6000});
    await page.waitForTimeout(80);
    expect(await page.locator('.dc-public-activity--home').count()===0,`home mobile ${width}: generic Board Activity rendered`);
    expect(await page.locator('#currentProgramHost [data-thing-ref]').count()===3,`home mobile ${width}: Current Program changed`);
    await assertFailClosed(page,`home mobile ${width}`);
    await assertNoPrivateTransport(page,`home mobile ${width}`);
    expect(!errors.length,`home mobile ${width}: ${errors.join(' | ')}`);await ctx.close();
  }
  for(const [label,viewport] of [['desktop',{width:1200,height:900}],['mobile',{width:390,height:844}]]){
    const ctx=await context(browser,{viewport});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/community/',{waitUntil:'domcontentloaded'});
    await page.locator('section.live .display-l').waitFor({state:'visible',timeout:6000});
    const copy=await page.locator('section.live').innerText();
    expect(copy.includes('Публичная редакционная подборка сейчас пуста.'),`community ${label}: truthful editorial empty state missing`);
    expect(copy.includes('не становятся публичными автоматически'),`community ${label}: Board/public boundary copy missing`);
    expect(await page.locator('.dc-public-activity--community').count()===0,`community ${label}: generic Activity grid rendered`);
    expect(await page.locator('[data-community-activity-more]').count()===0,`community ${label}: load-more must not exist for fail-closed projection`);
    await assertFailClosed(page,`community ${label}`);
    await assertNoPrivateTransport(page,`community ${label}`);
    const calls=await page.evaluate(()=>globalThis.__qaActivityRpcCalls||[]);
    expect(calls.length===1,`community ${label}: pagination/read path issued unexpected extra calls (${calls.length})`);
    expect(calls[0]?.p_before_published_at==null&&calls[0]?.p_before_id==null,`community ${label}: initial cursor contract changed`);
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('section.live .display-l').waitFor({state:'visible',timeout:6000});
    expect(await page.locator('.dc-activity-card').count()===0,`community ${label} refresh: generic Artifact leaked`);
    await assertNoPrivateTransport(page,`community ${label} refresh`);
    expect(!errors.length,`community ${label}: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1440,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
    await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:6000});
    await page.locator(`.dc-notice[data-artifact="${VIDEO_ID}"] .dc-youtube-presentation`).waitFor({state:'visible',timeout:6000});
    await page.locator(`.dc-notice[data-artifact="${PRIVATE_IMAGE_ID}"] .dc-notice__media img`).waitFor({state:'visible',timeout:6000});
    expect(await page.locator(`.dc-notice[data-artifact="${PROFILE_TEXT_ID}"]`).count()===1,'board: ordinary Member Artifact disappeared');
    const label=await page.locator(`.dc-notice[data-artifact="${VIDEO_ID}"] [data-youtube-label]`).innerText();
    expect(label==='VIDEO · YOUTUBE',`board: YouTube label missing (${label})`);
    const src=await page.locator(`.dc-notice[data-artifact="${VIDEO_ID}"] .dc-youtube-presentation img`).getAttribute('src');
    expect(String(src).includes('i.ytimg.com/vi/dQw4w9WgXcQ/'),`board: YouTube preview missing (${src})`);
    const privateSrc=await page.locator(`.dc-notice[data-artifact="${PRIVATE_IMAGE_ID}"] .dc-notice__media img`).getAttribute('src');
    expect(String(privateSrc).startsWith('https://signed.invalid/')&&String(privateSrc).includes('token=authorized-board'),'board: authenticated private image signed path missing');
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator(`.dc-notice[data-artifact="${PRIVATE_IMAGE_ID}"] .dc-notice__media img`).waitFor({state:'visible',timeout:6000});
    expect(!errors.length,`board: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1200,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);const network=watchArtifactDiagnostics(page);
    await page.goto(base+`/community/artifact/${VIDEO_ID}/`,{waitUntil:'domcontentloaded'});await waitForArtifactPresentation(page,errors,network);expect(network.artifactRequests.length===1,`artifact: expected one artifact.js request, got ${network.artifactRequests.length}`);const state=(await page.locator('#artifactState').innerText()).trim();expect(state!=='LOADING',`artifact: canonical load did not leave LOADING (${state})`);expect(await page.locator('.dc-artifact-record').count()===1,'artifact: canonical Artifact record missing after load');const label=await page.locator('.dc-artifact-record [data-youtube-label]').innerText();expect(label==='VIDEO · YOUTUBE',`artifact: YouTube label missing (${label})`);const src=await page.locator('.dc-artifact-record .dc-youtube-presentation img').getAttribute('src');expect(String(src).includes('i.ytimg.com/vi/dQw4w9WgXcQ/'),`artifact: YouTube preview missing (${src})`);expect(!network.requestFailures.length,`artifact request failures: ${network.requestFailures.join(' | ')}`);expect(!network.badResponses.length,`artifact bad responses: ${network.badResponses.join(' | ')}`);expect(!network.consoleErrors.length,`artifact console errors: ${network.consoleErrors.join(' | ')}`);expect(!errors.length,`artifact: ${errors.join(' | ')}`);await ctx.close();
  }
}finally{await browser.close();server.close()}

if(failures.length){console.error(`Board public activity browser acceptance failed (${failures.length})`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Board public activity browser acceptance passed: fail-closed anonymous Home/Community + no private media leakage + desktop/mobile/direct-refresh + authenticated Board media + Board/Artifact YouTube.');
