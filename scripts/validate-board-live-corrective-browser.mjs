import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
function resolveFile(urlPath){let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);if(pathname.endsWith('/'))pathname+='index.html';const full=path.resolve(artifact,pathname.replace(/^\/+/,''));return full.startsWith(path.resolve(artifact))?full:null}
const server=http.createServer((req,res)=>{const file=resolveFile(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}res.statusCode=200;res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;

const stub=()=>`
const mode=globalThis.__QA_BOARD_MODE__||'member';
globalThis.__QA_RPC_CALLS__=globalThis.__QA_RPC_CALLS__||[];
globalThis.__QA_DB_WRITES__=globalThis.__QA_DB_WRITES__||[];
const member=['member-first','member','dementor'].includes(mode);
const role=mode==='owner'?'owner_admin':mode==='dementor'?'dementor':null;
const user={id:'qa-board-user',email:'qa@invalid',user_metadata:{full_name:'QA'}};
const other='qa-member-other';
const session={user};
const application=mode==='applicant'?{id:'qa-app',profile_id:user.id,status:'reviewing',created_at:'2026-09-06T10:00:00Z'}:null;
const ownArtifact={id:'qa-artifact-own',author_profile_id:user.id,artifact_type:'announcement',title:'МОЙ QA CARD',body:'Моя карточка для проверки.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-05T11:00:00Z',created_at:'2026-09-05T10:55:00Z'};
const otherArtifact={id:'qa-artifact-other',author_profile_id:other,artifact_type:'announcement',title:'ЧУЖОЙ QA CARD',body:'Карточка другого участника для проверки реакций и admin moderation.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-05T10:00:00Z',created_at:'2026-09-05T09:55:00Z'};
const artifactRows=mode==='member-first'?[otherArtifact]:[ownArtifact,otherArtifact];
const profiles=[{profile_id:user.id,display_name:'QA Owner',nickname:'qa',avatar_url:null,member_since:'2026-09-01'},{profile_id:other,display_name:'Other Member',nickname:'other',avatar_url:null,member_since:'2026-09-01'}];
const rowsFor=t=>t==='join_applications'?(application?[application]:[]):t==='dc_role_assignments'?(role?[{profile_id:user.id,role,status:'active'}]:[]):t==='profiles'?[{id:user.id,full_name:'QA',display_name:'QA'}]:t==='dc_system_memberships'?(member?[{profile_id:user.id,status:'active'}]:[]):t==='dc_artifacts'?artifactRows:t==='dc_member_public_profiles'?profiles:t==='dc_artifact_reactions'?[]:t==='dc_artifact_responses'?[]:t==='dc_artifact_media'?[]:t==='dc_artifact_board_positions'?artifactRows.map((a,i)=>({artifact_id:a.id,board_id:'community',x:1200+i*480,y:900+i*160,rotation:0,size_class:'M',position_version:1})):[];
const query=t=>{let rows=[...rowsFor(t)];const q={select(){return q},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return q},is(){return q},order(){return q},limit(n){rows=rows.slice(0,n);return q},range(){return q},insert(payload){globalThis.__QA_DB_WRITES__.push({op:'insert',table:t,payload});return q},upsert(payload){globalThis.__QA_DB_WRITES__.push({op:'upsert',table:t,payload});return q},update(payload){globalThis.__QA_DB_WRITES__.push({op:'update',table:t,payload});return q},delete(){globalThis.__QA_DB_WRITES__.push({op:'delete',table:t});return q},maybeSingle(){return Promise.resolve({data:rows[0]||null,error:null})},single(){return Promise.resolve({data:rows[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return q};
export function createClient(){return{auth:{getSession:async()=>({data:{session}}),getUser:async()=>({data:{user}}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async(name,args)=>{globalThis.__QA_RPC_CALLS__.push({name,args});if(name==='dc_member_entry_status_v1'){const incomplete=mode==='guest-incomplete';return{data:{membership_active:member,community_activation_state:mode==='member-first'?'FIRST_ARTIFACT_REQUIRED':member?'MEMBER_ACTIVATED':null,sphere_count:incomplete?4:9,sphere_gate_complete:!incomplete,artifact_slots_available:mode==='member-first'?1:0,artifact_slots_consuming:mode==='member'?1:0,published_artifact_count:mode==='member'?1:0},error:null}};if(name==='dc_board_entity_projection_read_v1')return{data:[{entity_id:'qa-event',entity_type:'event',slug:'qa-event',title:'QA EVENT',status:'announced',summary:'Projection used by corrective filter QA.',source_system:'git',provenance_status:'confirmed',event_location:'QA LAB',event_capacity:20,program_type:null,delivery_mode:null,content_summary:null}],error:null};if(name==='dc_board_promotion_state_read_v1')return{data:[],error:null};if(name==='dc_guest_board_read_v1')return{data:[],error:null};if(name==='dc_close_artifact_v1')return{data:{artifact_id:args?.p_artifact_id,status:'archived'},error:null};return{data:[],error:null}},storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:'https://example.invalid/x.webp'}}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{}})})},functions:{invoke:async()=>({data:{}})}}}`;

async function openBoard(browser,mode,viewport,{dismissFirstFocus=true}={}){
  const ctx=await browser.newContext({viewport});
  await ctx.addInitScript(({mode,dismissFirstFocus})=>{globalThis.__QA_BOARD_MODE__=mode;globalThis.__QA_RPC_CALLS__=[];globalThis.__QA_DB_WRITES__=[];try{localStorage.setItem('dc:board:tutorial:v21:qa-board-user:guest',JSON.stringify({done:true}));localStorage.setItem('dc:board:tutorial:v21:qa-board-user:member',JSON.stringify({done:true}));if(dismissFirstFocus)sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1');else sessionStorage.removeItem('dc_first_artifact_spotlight_dismissed_v1')}catch{}},{mode,dismissFirstFocus});
  await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript',body:stub()}):route.abort());
  const page=await ctx.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
  await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:6000});
  await page.waitForFunction(()=>document.querySelectorAll('.dc-notice[data-artifact]').length>0,{timeout:5000});
  await page.locator('[data-board-filter-drawer]').waitFor({state:'visible',timeout:4000});
  return{ctx,page,errors};
}

async function buttonCenter(page,selector){return page.locator(selector).evaluate(button=>{const rect=button.getBoundingClientRect();const range=document.createRange();const textNode=[...button.childNodes].find(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim())||button.firstChild;if(textNode)range.selectNodeContents(textNode);else range.selectNodeContents(button);const text=range.getBoundingClientRect();return{label:button.textContent.trim(),button:{x:rect.x,y:rect.y,w:rect.width,h:rect.height},text:{x:text.x,y:text.y,w:text.width,h:text.height},dx:Math.abs((rect.left+rect.width/2)-(text.left+text.width/2)),dy:Math.abs((rect.top+rect.height/2)-(text.top+text.height/2))}})}
function expectCentered(metric,scope){expect(metric.dx<=5&&metric.dy<=6,`${scope}: label is not centered ${JSON.stringify(metric)}`)}

const browser=await chromium.launch({headless:true});

for(const viewport of [{width:390,height:500,label:'390'},{width:430,height:844,label:'430'},{width:800,height:900,label:'800'},{width:1440,height:900,label:'desktop'}]){
  const{ctx,page,errors}=await openBoard(browser,'member',viewport);
  const all=page.locator('[data-board-filter="all"]');
  const allStyle=await all.evaluate(el=>{const s=getComputedStyle(el);return{color:s.color,background:s.backgroundColor}});
  expect(allStyle.color==='rgb(17, 17, 17)',`drawer-${viewport.label}: ВСЁ text is not black ${JSON.stringify(allStyle)}`);
  expect(allStyle.background==='rgb(216, 255, 62)',`drawer-${viewport.label}: ВСЁ background is not lime ${JSON.stringify(allStyle)}`);
  const types=page.locator('[data-board-filter-drawer]');
  await types.click();
  const drawer=page.locator('.dc-board-filter-drawer');await drawer.waitFor({state:'visible',timeout:2000});
  const geo=await drawer.evaluate(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{hidden:el.hidden,left:r.left,top:r.top,right:r.right,bottom:r.bottom,iw:innerWidth,ih:innerHeight,pointer:s.pointerEvents,overflowY:s.overflowY,touch:s.touchAction,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight}});
  expect(!geo.hidden&&geo.left>=-1&&geo.right<=geo.iw+1&&geo.top>=-1&&geo.bottom<=geo.ih+1,`drawer-${viewport.label}: drawer outside viewport ${JSON.stringify(geo)}`);
  expect(geo.pointer!=='none',`drawer-${viewport.label}: drawer cannot receive pointer events`);
  if(viewport.width<=900)expect(['auto','scroll'].includes(geo.overflowY),`drawer-${viewport.label}: drawer is not vertically scrollable ${JSON.stringify(geo)}`);
  if(geo.scrollHeight>geo.clientHeight){const scrolled=await drawer.evaluate(el=>{el.scrollTop=60;return el.scrollTop});expect(scrolled>0,`drawer-${viewport.label}: drawer cannot scroll vertically`)}
  const eventProjection=page.locator('[data-board-source="platform"][data-source-type="event"]');await eventProjection.waitFor({state:'attached',timeout:2000});
  await page.locator('[data-board-detail-filter="artifact"]').click();
  expect(await drawer.isHidden(),`drawer-${viewport.label}: drawer did not close after type selection`);
  expect(await types.evaluate(el=>el.classList.contains('active')),`drawer-${viewport.label}: type trigger did not reflect selected detail filter`);
  expect(await eventProjection.evaluate(el=>el.hidden||el.classList.contains('dc-board-filtered')),`drawer-${viewport.label}: type selection did not filter event projection`);
  await types.click();await drawer.waitFor({state:'visible',timeout:2000});
  await page.locator('[data-filter-close]').click();expect(await drawer.isHidden(),`drawer-${viewport.label}: drawer did not close with close control`);
  expect(!errors.length,`drawer-${viewport.label}: ${errors.join(' | ')}`);
  await ctx.close();
}

for(const viewport of [{width:390,height:844,label:'390'},{width:1440,height:900,label:'desktop'}]){
  const{ctx,page,errors}=await openBoard(browser,'member',viewport);
  await page.locator('[data-tutorial-help]').waitFor({state:'attached',timeout:3000});
  await page.locator('[data-mine]').waitFor({state:'visible',timeout:3000});
  for(const [name,selector] of [['ВСЁ','[data-board-filter="all"]'],['ТИПЫ','[data-board-filter-drawer]'],['+','[data-zoom-in]'],['−','[data-zoom-out]'],['К ЖИЗНИ','[data-home]'],['МОЁ','[data-mine]'],['?','[data-tutorial-help]']])expectCentered(await buttonCenter(page,selector),`geometry-${viewport.label}/${name}`);
  expect(!errors.length,`geometry-${viewport.label}: ${errors.join(' | ')}`);
  await ctx.close();
}

for(const viewport of [{width:390,height:844,label:'390'},{width:1440,height:900,label:'desktop'}]){
  const{ctx,page,errors}=await openBoard(browser,'member-first',viewport,{dismissFirstFocus:false});
  await page.waitForFunction(()=>document.body.classList.contains('dc-board-first-entry-focus'),{timeout:3000});
  const focusState=await page.locator('.dc-board-wall').evaluate(el=>{const s=getComputedStyle(el);return{pointer:s.pointerEvents,opacity:Number(s.opacity),filter:s.filter}});
  expect(focusState.pointer!=='none',`member-first-${viewport.label}: onboarding still blocks Board pointer events ${JSON.stringify(focusState)}`);
  expect(focusState.opacity>=.6,`member-first-${viewport.label}: Board is visually suppressed too aggressively ${JSON.stringify(focusState)}`);
  const primary=page.locator('.dc-board-primary.is-visible button');await primary.waitFor({state:'visible',timeout:3000});
  expect((await primary.innerText()).includes('ПРИКОЛОТЬ'),`member-first-${viewport.label}: onboarding CTA is not + ПРИКОЛОТЬ`);
  expectCentered(await buttonCenter(page,'.dc-board-primary.is-visible button'),`member-first-${viewport.label}/+ ПРИКОЛОТЬ`);
  const gate=await page.locator('.dc-notice').first().evaluate(card=>({reactionDisabled:card.querySelector('[data-reaction]')?.disabled,reactionAria:card.querySelector('[data-reaction]')?.getAttribute('aria-disabled'),responseDisabled:card.querySelector('[data-response]')?.disabled,responseAria:card.querySelector('[data-response]')?.getAttribute('aria-disabled')}));
  expect(!gate.reactionDisabled&&!gate.responseDisabled&&!gate.reactionAria&&!gate.responseAria,`member-first-${viewport.label}: admitted Member actions are permission-locked ${JSON.stringify(gate)}`);
  const before=await page.locator('.dc-spatial-world').evaluate(el=>el.style.transform);
  await page.locator('[data-zoom-in]').click();await page.waitForTimeout(80);
  const after=await page.locator('.dc-spatial-world').evaluate(el=>el.style.transform);
  expect(before!==after,`member-first-${viewport.label}: Board zoom control did not move camera`);
  await page.locator('[data-board-filter-drawer]').click();
  await page.locator('.dc-board-filter-drawer').waitFor({state:'visible',timeout:2000});
  await page.locator('[data-board-detail-filter="artifact"]').click();
  await page.waitForTimeout(100);
  await page.locator('[data-home]').click();await page.waitForTimeout(180);
  const hit=await page.locator('.dc-notice[data-artifact]').first().evaluate(card=>{const cardRect=card.getBoundingClientRect();const viewport=document.querySelector('.dc-spatial-viewport')?.getBoundingClientRect();if(!viewport)return{ok:false,reason:'NO_VIEWPORT',cardRect:null,viewport:null};const left=Math.max(cardRect.left,viewport.left),right=Math.min(cardRect.right,viewport.right),top=Math.max(cardRect.top,viewport.top),bottom=Math.min(cardRect.bottom,viewport.bottom);if(right-left<8||bottom-top<8)return{ok:false,reason:'NO_VISIBLE_INTERSECTION',cardRect:{left:cardRect.left,right:cardRect.right,top:cardRect.top,bottom:cardRect.bottom},viewport:{left:viewport.left,right:viewport.right,top:viewport.top,bottom:viewport.bottom}};const x=(left+right)/2,y=(top+bottom)/2;const target=document.elementFromPoint(x,y);return{ok:!!target?.closest('.dc-notice[data-artifact]'),x,y,target:target?.tagName||null,closest:target?.closest('.dc-notice[data-artifact]')?.dataset.artifact||null,card:card.dataset.artifact||null,cardRect:{left:cardRect.left,right:cardRect.right,top:cardRect.top,bottom:cardRect.bottom},viewport:{left:viewport.left,right:viewport.right,top:viewport.top,bottom:viewport.bottom}}});
  expect(hit.ok&&hit.closest===hit.card,`member-first-${viewport.label}: no real pointer hit point for Artifact after Artifact-only fit ${JSON.stringify(hit)}`);
  if(hit.ok){await page.mouse.click(hit.x,hit.y);const overlay=page.locator('.dc-artifact-overlay');await overlay.waitFor({state:'visible',timeout:2500});await page.locator('.dc-artifact-overlay__close').click();await page.waitForTimeout(80);expect(await overlay.isHidden(),`member-first-${viewport.label}: Artifact detail did not close`)}
  expect(!errors.length,`member-first-${viewport.label}: ${errors.join(' | ')}`);
  await ctx.close();
}

await browser.close();server.close();
if(failures.length){console.error('BOARD LIVE CORRECTIVE BROWSER QA BLOCKED');failures.forEach(item=>console.error('- '+item));process.exit(1)}
console.log('Board live corrective browser QA PASS: mobile type drawer + black-on-lime active filter + rendered control geometry + interactive MEMBER_NOT_ACTIVATED onboarding');