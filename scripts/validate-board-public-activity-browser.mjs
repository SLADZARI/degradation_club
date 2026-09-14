import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
function resolveFile(urlPath){let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);if(/^\/community\/artifact\/[^/]+\/?$/.test(pathname))pathname='/community/artifact/index.html';else if(pathname.endsWith('/'))pathname+='index.html';const full=path.resolve(artifact,pathname.replace(/^\/+/,''));return full.startsWith(path.resolve(artifact))?full:null}
const server=http.createServer((req,res)=>{const file=resolveFile(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}res.statusCode=200;res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;

const stub=()=>`
const user={id:'qa-board-user',email:'qa@invalid',user_metadata:{full_name:'QA'}};
const session={user};
const videoId='dQw4w9WgXcQ';
const videoArtifact={id:'qa-video',author_profile_id:user.id,artifact_type:'announcement',title:'VIDEO ARTIFACT',body:'YouTube presentation evidence',external_url:'https://www.youtube.com/shorts/'+videoId,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-14T06:00:00Z',created_at:'2026-09-14T05:55:00Z',closed_at:null};
const boardArtifacts=[videoArtifact];
const profiles=[{profile_id:user.id,display_name:'DEMENTOR CLUB QA',nickname:'qa',avatar_url:null,member_since:'2026-09-01'}];
const activityRows=Array.from({length:26},(_,index)=>({artifact_id:index===0?'qa-video':'qa-activity-'+String(index).padStart(2,'0'),artifact_type:'announcement',title:index===0?'VIDEO ARTIFACT':'ACTIVITY '+String(index+1).padStart(2,'0'),excerpt:'Публичная активность '+String(index+1),publisher_scope:index<3?'club':'profile',publisher_display_name:index<3?'DEMENTOR CLUB':'QA MEMBER',publisher_avatar_url:null,media_kind:index===0?'video':'text',provider:index===0?'youtube':'board',source_url:index===0?'https://www.youtube.com/shorts/'+videoId:null,preview_url:index===0?'https://i.ytimg.com/vi/'+videoId+'/hqdefault.jpg':null,type_source_label:index===0?'VIDEO · YOUTUBE':'TEXT · BOARD',board_focus_url:'/workspace/board/?focus=artifact:'+(index===0?'qa-video':'qa-activity-'+String(index).padStart(2,'0')),published_at:new Date(Date.parse('2026-09-14T06:00:00Z')-index*60000).toISOString(),activity_at:null}));
const rowsFor=t=>t==='join_applications'?[]:t==='dc_role_assignments'?[]:t==='profiles'?[{id:user.id,full_name:'QA',display_name:'QA'}]:t==='dc_system_memberships'?[{profile_id:user.id,status:'active'}]:t==='dc_artifacts'?boardArtifacts:t==='dc_member_public_profiles'?profiles:t==='dc_artifact_reactions'?[]:t==='dc_artifact_responses'?[]:t==='dc_artifact_media'?[]:t==='dc_artifact_board_positions'?[{artifact_id:'qa-video',board_id:'community',x:1200,y:900,rotation:0,size_class:null,position_version:1}]:t==='dc_artifact_publisher_overrides'?[]:[];
const query=t=>{let rows=[...rowsFor(t)];const q={select(){return q},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return q},is(k,v){rows=rows.filter(r=>v===null?r?.[k]==null:r?.[k]===v);return q},order(){return q},limit(n){rows=rows.slice(0,n);return q},range(a,b){rows=rows.slice(a,b+1);return q},insert(){return Promise.resolve({data:[],error:null})},upsert(){return Promise.resolve({data:[],error:null})},update(){return q},delete(){return q},maybeSingle(){return Promise.resolve({data:rows[0]||null,error:null})},single(){return Promise.resolve({data:rows[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return q};
export function createClient(){return{auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user},error:null}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async(name,args={})=>{if(name==='dc_public_activity_read_v1'){const limit=Number(args.p_limit||12);let start=0;if(args.p_before_id){const i=activityRows.findIndex(row=>row.artifact_id===args.p_before_id);start=i>=0?i+1:activityRows.length}return{data:activityRows.slice(start,start+limit),error:null}}if(name==='dc_member_entry_status_v1')return{data:{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_count:9,sphere_gate_complete:true,artifact_slots_available:0,artifact_slots_consuming:1,published_artifact_count:1},error:null};if(name==='dc_board_entity_projection_read_v1')return{data:[],error:null};if(name==='dc_board_promotion_state_read_v1')return{data:[],error:null};if(name==='dc_normalize_artifact_lifecycle_v1')return{data:[],error:null};if(name==='dc_guest_board_read_v1')return{data:[],error:null};return{data:[],error:null}},storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:null},error:null}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{},error:null})})},functions:{invoke:async()=>({data:{},error:null})}}}
`;

async function context(browser,options={}){
  const ctx=await browser.newContext(options);
  await ctx.addInitScript(()=>{try{localStorage.setItem('dc:board:tutorial:v21:qa-board-user:member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}});
  await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript',body:stub()}):route.abort());
  await ctx.route('https://i.ytimg.com/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#ddd"/></svg>'}));
  return ctx;
}
function watchErrors(page){const errors=[];page.on('pageerror',error=>errors.push(error.message));return errors}

const browser=await chromium.launch({headless:true});
try{
  {
    const ctx=await context(browser,{viewport:{width:1440,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.locator('.dc-public-activity--home').waitFor({state:'visible',timeout:6000});
    const section=page.locator('.dc-public-activity--home');const duration=await section.evaluate(el=>el.style.getPropertyValue('--dc-activity-duration'));expect(Boolean(duration)&&duration!=='46s',`home: rail duration is not content-derived (${duration})`);
    expect(await section.locator('.dc-activity-card:not([aria-hidden="true"])').count()===10,'home: expected first 10 canonical cards');
    const cloneState=await section.locator('.dc-activity-card[aria-hidden="true"]').evaluateAll(cards=>cards.map(card=>({inert:card.hasAttribute('inert'),tabs:[...card.querySelectorAll('a')].map(a=>a.tabIndex)})));
    expect(cloneState.length===10&&cloneState.every(row=>row.inert&&row.tabs.every(tab=>tab===-1)),'home: seamless clones are not keyboard-inert');
    const focusHref=await section.locator('.dc-activity-card:not([aria-hidden="true"]) a').first().getAttribute('href');expect(String(focusHref).includes('focus=artifact:qa-video'),`home: exact Board focus missing (${focusHref})`);
    await section.locator('.dc-public-activity__viewport').hover();await page.waitForTimeout(40);const playState=await section.locator('.dc-public-activity__track').evaluate(el=>getComputedStyle(el).animationPlayState);expect(playState==='paused',`home: hover did not pause rail (${playState})`);
    expect(!errors.length,`home desktop: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:390,height:844}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.locator('.dc-public-activity--home').waitFor({state:'visible',timeout:6000});
    const animation=await page.locator('.dc-public-activity__track').evaluate(el=>getComputedStyle(el).animationName);expect(animation==='none',`home mobile: autoplay must be off (${animation})`);
    const width=await page.locator('.dc-activity-card:not([aria-hidden="true"])').first().evaluate(el=>el.getBoundingClientRect().width/window.innerWidth);expect(width>.8&&width<.88,`home mobile: card width is not ~84vw (${width})`);
    expect(!errors.length,`home mobile: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1440,height:900},reducedMotion:'reduce'});const page=await ctx.newPage();
    await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.locator('.dc-public-activity--home').waitFor({state:'visible',timeout:6000});const animation=await page.locator('.dc-public-activity__track').evaluate(el=>getComputedStyle(el).animationName);expect(animation==='none',`home reduced-motion: autoplay must be off (${animation})`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1200,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/community/',{waitUntil:'domcontentloaded'});await page.locator('[data-community-activity-grid]').waitFor({state:'visible',timeout:6000});
    expect(await page.locator('[data-community-activity-grid] .dc-activity-card').count()===24,'community: first page must contain 24 cards');
    const more=page.locator('[data-community-activity-more]');await more.click();await page.waitForFunction(()=>document.querySelectorAll('[data-community-activity-grid] .dc-activity-card').length===26,{timeout:3000});
    expect(await page.locator('[data-community-activity-grid] .dc-activity-card').count()===26,'community: cursor page did not append remaining cards');expect(await more.isDisabled(),'community: load-more should close after short final page');
    expect(!errors.length,`community: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1440,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:6000});await page.locator('.dc-notice[data-artifact="qa-video"] .dc-youtube-presentation').waitFor({state:'visible',timeout:6000});
    const label=await page.locator('.dc-notice[data-artifact="qa-video"] [data-youtube-label]').innerText();expect(label==='VIDEO · YOUTUBE',`board: YouTube label missing (${label})`);const src=await page.locator('.dc-notice[data-artifact="qa-video"] .dc-youtube-presentation img').getAttribute('src');expect(String(src).includes('i.ytimg.com/vi/dQw4w9WgXcQ/'),`board: YouTube preview missing (${src})`);expect(!errors.length,`board: ${errors.join(' | ')}`);await ctx.close();
  }
  {
    const ctx=await context(browser,{viewport:{width:1200,height:900}});const page=await ctx.newPage();const errors=watchErrors(page);
    await page.goto(base+'/community/artifact/qa-video/',{waitUntil:'domcontentloaded'});await page.locator('.dc-artifact-record .dc-youtube-presentation').waitFor({state:'visible',timeout:6000});const label=await page.locator('.dc-artifact-record [data-youtube-label]').innerText();expect(label==='VIDEO · YOUTUBE',`artifact: YouTube label missing (${label})`);expect(!errors.length,`artifact: ${errors.join(' | ')}`);await ctx.close();
  }
}finally{await browser.close();server.close()}

if(failures.length){console.error(`Board public activity browser acceptance failed (${failures.length})`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Board public activity browser acceptance passed');
