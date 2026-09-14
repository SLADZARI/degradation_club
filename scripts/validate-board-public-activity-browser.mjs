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
const privateImage={id:'${PRIVATE_IMAGE_ID}',artifact_type:'announcement',title:'PRIVATE IMAGE',body:'Private Board image fallback fixture',external_url:null,status:'active',visibility:'community',board_hidden_at:null,starts_at:null,expires_at:null,published_at:'2026-09-14T05:58:00Z',publisher_scope:'profile',publisher_display_name:'QA IMAGE MEMBER',private_image:true,private_storage_path:'qa-private/secret.jpg'};
const fillers=Array.from({length:23},(_,index)=>({id:'70000000-0000-4000-8000-'+String(index+1).padStart(12,'0'),artifact_type:'announcement',title:'ACTIVITY '+String(index+4).padStart(2,'0'),body:'Eligible filler '+String(index+1),external_url:null,status:'active',visibility:'community',board_hidden_at:null,starts_at:null,expires_at:null,published_at:new Date(Date.parse('2026-09-14T05:57:00Z')-index*60000).toISOString(),publisher_scope:index<2?'club':'profile',publisher_display_name:index<2?'DEMENTOR CLUB':'QA MEMBER'}));
const excluded=[
{id:'${HIDDEN_ID}',artifact_type:'announcement',title:'HIDDEN FIXTURE',body:'must not surface',status:'active',visibility:'community',board_hidden_at:'2026-09-14T07:00:00Z',starts_at:null,expires_at:null,published_at:'2026-09-14T06:30:00Z',publisher_scope:'profile',publisher_display_name:'QA MEMBER'},
{id:'${FUTURE_ID}',artifact_type:'announcement',title:'FUTURE FIXTURE',body:'must not surface',status:'active',visibility:'community',board_hidden_at:null,starts_at:'2026-09-15T08:00:00Z',expires_at:null,published_at:'2026-09-14T06:29:00Z',publisher_scope:'profile',publisher_display_name:'QA MEMBER'},
{id:'${EXPIRED_ID}',artifact_type:'announcement',title:'EXPIRED FIXTURE',body:'must not surface',status:'active',visibility:'community',board_hidden_at:null,starts_at:null,expires_at:'2026-09-14T07:00:00Z',published_at:'2026-09-14T06:28:00Z',publisher_scope:'profile',publisher_display_name:'QA MEMBER'}
];
const activitySource=[...excluded,{...videoArtifact,board_hidden_at:null,publisher_scope:'club',publisher_display_name:'DEMENTOR CLUB'},profileText,privateImage,...fillers];
const activityEligible=row=>row.visibility==='community'&&row.status==='active'&&Boolean(row.published_at)&&row.board_hidden_at==null&&(!row.starts_at||Date.parse(row.starts_at)<=now)&&(!row.expires_at||Date.parse(row.expires_at)>now);
const activityProjection=()=>activitySource.filter(activityEligible).sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at)||String(b.id).localeCompare(String(a.id))).map(row=>({artifact_id:row.id,artifact_type:row.artifact_type,title:row.title,excerpt:row.body,publisher_scope:row.publisher_scope||'profile',publisher_display_name:row.publisher_display_name||'QA MEMBER',publisher_avatar_url:null,media_kind:row.id==='${VIDEO_ID}'?'video':row.private_image?'image':row.external_url?'link':'text',provider:row.id==='${VIDEO_ID}'?'youtube':row.private_image?'board':row.external_url?'web':'board',source_url:row.external_url||null,preview_url:row.id==='${VIDEO_ID}'?'https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg':null,type_source_label:row.id==='${VIDEO_ID}'?'VIDEO · YOUTUBE':row.private_image?'IMAGE · BOARD':row.external_url?'LINK · WEB':'TEXT · BOARD',board_focus_url:'/workspace/board/?focus=artifact:'+row.id,published_at:row.published_at,activity_at:null}));
globalThis.__qaActivityFixture={sourceIds:activitySource.map(row=>row.id),eligibleIds:activityProjection().map(row=>row.artifact_id),excludedIds:['${HIDDEN_ID}','${FUTURE_ID}','${EXPIRED_ID}'],privateStoragePath:privateImage.private_storage_path};
const boardArtifacts=[videoArtifact];
const profiles=[{profile_id:user.id,display_name:'DEMENTOR CLUB QA',nickname:'qa',avatar_url:null,member_since:'2026-09-01'}];
const rowsFor=t=>t==='join_applications'?[]:t==='dc_role_assignments'?[]:t==='profiles'?[{id:user.id,full_name:'QA',display_name:'QA'}]:t==='dc_system_memberships'?[{profile_id:user.id,status:'active'}]:t==='dc_artifacts'?boardArtifacts:t==='dc_member_public_profiles'?profiles:t==='dc_artifact_reactions'?[]:t==='dc_artifact_responses'?[]:t==='dc_artifact_media'?[]:t==='dc_artifact_board_positions'?[{artifact_id:'${VIDEO_ID}',board_id:'community',x:1200,y:900,rotation:0,size_class:null,position_version:1}]:t==='dc_artifact_publisher_overrides'?[]:[];
const query=t=>{let rows=[...rowsFor(t)];const q={select(){return q},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return q},is(k,v){rows=rows.filter(r=>v===null?r?.[k]==null:r?.[k]===v);return q},order(){return q},limit(n){rows=rows.slice(0,n);return q},range(a,b){rows=rows.slice(a,b+1);return q},insert(){return Promise.resolve({data:[],error:null})},upsert(){return Promise.resolve({data:[],error:null})},update(){return q},delete(){return q},maybeSingle(){return Promise.resolve({data:rows[0]||null,error:null})},single(){return Promise.resolve({data:rows[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return q};
export function createClient(){return{auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user},error:null}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async(name,args={})=>{if(name==='dc_public_activity_read_v1'){const rows=activityProjection();const limit=Number(args.p_limit||12);let start=0;if(args.p_before_id){const i=rows.findIndex(row=>row.artifact_id===args.p_before_id);start=i>=0?i+1:rows.length}return{data:rows.slice(start,start+limit),error:null}}if(name==='dc_member_entry_status_v1')return{data:{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_count:9,sphere_gate_complete:true,artifact_slots_available:0,artifact_slots_consuming:1,published_artifact_count:1},error:null};if(name==='dc_board_entity_projection_read_v1')return{data:[],error:null};if(name==='dc_board_promotion_state_read_v1')return{data:[],error:null};if(name==='dc_normalize_artifact_lifecycle_v1')return{data:[],error:null};if(name==='dc_guest_board_read_v1')return{data:[],error:null};if(name==='dc_artifact_publisher_scopes_v1')return{data:[],error:null};return{data:[],error:null}},storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:null},error:null}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{},error:null})})},functions:{invoke:async()=>({data:{},error:null})}}}
`;

async function context(browser,options={}){
  const ctx=await browser.newContext(options);
  await ctx.addInitScript(()=>{try{localStorage.setItem('dc:board:tutorial:v21:qa-board-user:member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}});
  await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript',body:stub()}):route.abort());
  await ctx.route('https://i.ytimg.com/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#ddd"/></svg>'}));
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
async function artifactExecutionEvidence(page){
  const coverage=await page.coverage.stopJSCoverage();
  const entry=coverage.find(item=>{try{return new URL(item.url).pathname==='/community/artifact/artifact.js'}catch{return false}});
  return{artifactJsExecuted:Boolean(entry?.ranges?.some(range=>range.end>range.start)),artifactJsCoverageRanges:entry?.ranges?.length||0};
}
async function waitForArtifactPresentation(page,errors,network){
  try{
    await page.locator('.dc-artifact-record').waitFor({state:'visible',timeout:4000});
    await page.locator('.dc-artifact-record .dc-youtube-presentation').waitFor({state:'visible',timeout:4000});
  }catch(error){
    const execution=await artifactExecutionEvidence(page);
    const diagnostic=await page.evaluate(()=>({artifactState:document.getElementById('artifactState')?.textContent||null,artifactHost:document.getElementById('artifactHost')?.innerHTML||null,mediaRuntimeLoaded:Boolean([...document.scripts].find(script=>script.src.includes('board-artifact-media-v1.js')))}));
    console.error('Artifact detail presentation diagnostic',JSON.stringify({pageErrors:errors,...network,...execution,diagnostic},null,2));
    throw error;
  }
}
async function assertRuntimeExclusions(page,scope){
  const evidence=await page.evaluate(()=>globalThis.__qaActivityFixture||null);
  expect(Boolean(evidence),`${scope}: runtime fixture evidence missing`);
  for(const id of [HIDDEN_ID,FUTURE_ID,EXPIRED_ID]){
    expect(evidence?.sourceIds?.includes(id)===true,`${scope}: excluded fixture ${id} was not present in runtime source`);
    expect(evidence?.eligibleIds?.includes(id)===false,`${scope}: excluded fixture ${id} leaked through runtime eligibility`);
    expect(await page.locator(`[data-activity-id="${id}"]`).count()===0,`${scope}: excluded fixture ${id} rendered in public Activity`);
  }
}

const browser=await chromium.launch({headless:true});
try{
  {
    const ctx=await context(browser,{viewport:{width:1440,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.locator('.dc-public-activity--home').waitFor({state:'visible',timeout:6000});
    const section=page.locator('.dc-public-activity--home');const duration=await section.evaluate(el=>el.style.getPropertyValue('--dc-activity-duration'));expect(Boolean(duration)&&duration!=='46s',`home: rail duration is not content-derived (${duration})`);
    expect(await section.locator('.dc-activity-card:not([aria-hidden="true"])').count()===10,'home: expected first 10 canonical cards');
    const cloneState=await section.locator('.dc-activity-card[aria-hidden="true"]').evaluateAll(cards=>cards.map(card=>({inert:card.hasAttribute('inert'),tabs:[...card.querySelectorAll('a')].map(a=>a.tabIndex)})));
    expect(cloneState.length===10&&cloneState.every(row=>row.inert&&row.tabs.every(tab=>tab===-1)),'home: seamless clones are not keyboard-inert');
    const focusHref=await section.locator(`[data-activity-id="${VIDEO_ID}"]:not([aria-hidden="true"]) a`).getAttribute('href');expect(String(focusHref).includes(`focus=artifact:${VIDEO_ID}`),`home: exact Board focus missing (${focusHref})`);
    const profileCard=section.locator(`[data-activity-id="${PROFILE_TEXT_ID}"]:not([aria-hidden="true"])`);expect(await profileCard.locator('.dc-activity-card__foot span').innerText()==='QA MEMBER','home: profile text publisher fixture missing');expect(await profileCard.locator('img').count()===0,'home: profile text fixture unexpectedly has media');
    const privateCard=section.locator(`[data-activity-id="${PRIVATE_IMAGE_ID}"]:not([aria-hidden="true"])`);expect(await privateCard.locator('.dc-activity-card__meta span').first().innerText()==='IMAGE · BOARD','home: private image fallback label missing');expect(await privateCard.locator('img').count()===0,'home: private image must not expose signed/private preview');
    const homeHtml=await section.evaluate(el=>el.innerHTML);expect(!homeHtml.includes('qa-private/secret.jpg'),'home: private storage path leaked into public DOM');
    await assertRuntimeExclusions(page,'home');
    await section.locator('.dc-public-activity__viewport').hover();await page.waitForTimeout(40);const playState=await section.locator('.dc-public-activity__track').evaluate(el=>getComputedStyle(el).animationPlayState);expect(playState==='paused',`home: hover did not pause rail (${playState})`);
    expect(!errors.length,`home desktop: ${errors.join(' | ')}`);await ctx.close();
  }
  for(const width of [390,360]){
    const ctx=await context(browser,{viewport:{width,height:844}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.locator('.dc-public-activity--home').waitFor({state:'visible',timeout:6000});
    const animation=await page.locator('.dc-public-activity__track').evaluate(el=>getComputedStyle(el).animationName);expect(animation==='none',`home mobile ${width}: autoplay must be off (${animation})`);
    const ratio=await page.locator('.dc-activity-card:not([aria-hidden="true"])').first().evaluate(el=>el.getBoundingClientRect().width/window.innerWidth);expect(ratio>.8&&ratio<.88,`home mobile ${width}: card width is not ~84vw (${ratio})`);
    await assertRuntimeExclusions(page,`home mobile ${width}`);expect(!errors.length,`home mobile ${width}: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1440,height:900},reducedMotion:'reduce'});const page=await ctx.newPage();
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.locator('.dc-public-activity--home').waitFor({state:'visible',timeout:6000});const animation=await page.locator('.dc-public-activity__track').evaluate(el=>getComputedStyle(el).animationName);expect(animation==='none',`home reduced-motion: autoplay must be off (${animation})`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1200,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/community/',{waitUntil:'domcontentloaded'});await page.locator('[data-community-activity-grid]').waitFor({state:'visible',timeout:6000});
    expect(await page.locator('[data-community-activity-grid] .dc-activity-card').count()===24,'community: first page must contain 24 cards');
    await assertRuntimeExclusions(page,'community first page');
    const more=page.locator('[data-community-activity-more]');await more.click();await page.waitForFunction(()=>document.querySelectorAll('[data-community-activity-grid] .dc-activity-card').length===26,{timeout:3000});
    expect(await page.locator('[data-community-activity-grid] .dc-activity-card').count()===26,'community: cursor page did not append remaining cards');expect(await more.isDisabled(),'community: load-more should close after short final page');
    await assertRuntimeExclusions(page,'community after pagination');expect(!errors.length,`community: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1440,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:6000});await page.locator(`.dc-notice[data-artifact="${VIDEO_ID}"] .dc-youtube-presentation`).waitFor({state:'visible',timeout:6000});
    const label=await page.locator(`.dc-notice[data-artifact="${VIDEO_ID}"] [data-youtube-label]`).innerText();expect(label==='VIDEO · YOUTUBE',`board: YouTube label missing (${label})`);const src=await page.locator(`.dc-notice[data-artifact="${VIDEO_ID}"] .dc-youtube-presentation img`).getAttribute('src');expect(String(src).includes('i.ytimg.com/vi/dQw4w9WgXcQ/'),`board: YouTube preview missing (${src})`);expect(!errors.length,`board: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1200,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);const network=watchArtifactDiagnostics(page);await page.coverage.startJSCoverage({resetOnNavigation:false});
    await page.goto(base+`/community/artifact/${VIDEO_ID}/`,{waitUntil:'domcontentloaded'});await waitForArtifactPresentation(page,errors,network);const execution=await artifactExecutionEvidence(page);expect(network.artifactRequests.length===1,`artifact: expected one artifact.js request, got ${network.artifactRequests.length}`);expect(execution.artifactJsExecuted,`artifact: artifact.js did not execute (${execution.artifactJsCoverageRanges} coverage ranges)`);const label=await page.locator('.dc-artifact-record [data-youtube-label]').innerText();expect(label==='VIDEO · YOUTUBE',`artifact: YouTube label missing (${label})`);const src=await page.locator('.dc-artifact-record .dc-youtube-presentation img').getAttribute('src');expect(String(src).includes('i.ytimg.com/vi/dQw4w9WgXcQ/'),`artifact: YouTube preview missing (${src})`);expect(!network.requestFailures.length,`artifact request failures: ${network.requestFailures.join(' | ')}`);expect(!network.badResponses.length,`artifact bad responses: ${network.badResponses.join(' | ')}`);expect(!errors.length,`artifact: ${errors.join(' | ')}`);await ctx.close();
  }
}finally{await browser.close();server.close()}

if(failures.length){console.error(`Board public activity browser acceptance failed (${failures.length})`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Board public activity browser acceptance passed: desktop + mobile 390/360 + reduced motion + runtime eligibility + pagination + canonical Artifact boot + Board/Artifact YouTube.');
