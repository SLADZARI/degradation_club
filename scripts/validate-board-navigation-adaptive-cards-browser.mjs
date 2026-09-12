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
const other='qa-member-other';
const session={user};
const ownArtifact={id:'qa-artifact-own',author_profile_id:user.id,artifact_type:'announcement',title:'КОРОТКАЯ КАРТОЧКА',body:'Короткий текст.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-12T11:00:00Z',created_at:'2026-09-12T10:55:00Z'};
const otherArtifact={id:'qa-artifact-other',author_profile_id:other,artifact_type:'post',title:'ДЛИННАЯ КАРТОЧКА ДЛЯ ПРОВЕРКИ ИЕРАРХИИ',body:'Это более длинный текст карточки, который нужен только для проверки существующей размерной и типографической иерархии на пространственной доске. '.repeat(8),external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-12T10:00:00Z',created_at:'2026-09-12T09:55:00Z'};
const artifacts=[ownArtifact,otherArtifact];
const profiles=[{profile_id:user.id,display_name:'QA Owner',nickname:'qa',avatar_url:null,member_since:'2026-09-01'},{profile_id:other,display_name:'Other Member',nickname:'other',avatar_url:null,member_since:'2026-09-01'}];
const rowsFor=t=>t==='join_applications'?[]:t==='dc_role_assignments'?[]:t==='profiles'?[{id:user.id,full_name:'QA',display_name:'QA'}]:t==='dc_system_memberships'?[{profile_id:user.id,status:'active'}]:t==='dc_artifacts'?artifacts:t==='dc_member_public_profiles'?profiles:t==='dc_artifact_reactions'?[]:t==='dc_artifact_responses'?[]:t==='dc_artifact_media'?[]:t==='dc_artifact_board_positions'?[{artifact_id:ownArtifact.id,board_id:'community',x:1200,y:900,rotation:0,size_class:null,position_version:1},{artifact_id:otherArtifact.id,board_id:'community',x:1700,y:1050,rotation:0,size_class:null,position_version:1}]:[];
const query=t=>{let rows=[...rowsFor(t)];const q={select(){return q},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return q},is(){return q},order(){return q},limit(n){rows=rows.slice(0,n);return q},range(){return q},insert(){return q},upsert(){return q},update(){return q},delete(){return q},maybeSingle(){return Promise.resolve({data:rows[0]||null,error:null})},single(){return Promise.resolve({data:rows[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return q};
export function createClient(){return{auth:{getSession:async()=>({data:{session}}),getUser:async()=>({data:{user}}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async(name)=>{if(name==='dc_member_entry_status_v1')return{data:{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_count:9,sphere_gate_complete:true,artifact_slots_available:0,artifact_slots_consuming:1,published_artifact_count:1},error:null};if(name==='dc_board_entity_projection_read_v1')return{data:[],error:null};if(name==='dc_board_promotion_state_read_v1')return{data:[],error:null};if(name==='dc_normalize_artifact_lifecycle_v1')return{data:[],error:null};if(name==='dc_guest_board_read_v1')return{data:[],error:null};return{data:[],error:null}},storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22160%22/%3E'}}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{}})})},functions:{invoke:async()=>({data:{}})}}}`;

async function openBoard(browser,viewport){
  const ctx=await browser.newContext({viewport});
  await ctx.addInitScript(()=>{try{localStorage.setItem('dc:board:tutorial:v21:qa-board-user:member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}});
  await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript',body:stub()}):route.abort());
  const page=await ctx.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
  await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:6000});
  await page.waitForFunction(()=>document.querySelectorAll('.dc-notice[data-artifact]').length>=2,{timeout:5000});
  return{ctx,page,errors};
}

async function setImage(page,selector,w,h){
  await page.locator(selector).evaluate((card,{w,h})=>new Promise(resolve=>{
    let media=card.querySelector('.dc-notice__media');if(!media){media=document.createElement('div');media.className='dc-notice__media';card.appendChild(media)}
    let img=media.querySelector('img');if(!img){img=document.createElement('img');img.alt='QA media';media.appendChild(img)}
    img.onload=()=>requestAnimationFrame(()=>resolve());
    img.src=`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3C/svg%3E`;
  }),{w,h});
}

async function metrics(page,selector){return page.locator(selector).evaluate(card=>{const img=card.querySelector('.dc-notice__media img'),title=card.querySelector('h3'),r=card.getBoundingClientRect(),ir=img?.getBoundingClientRect(),s=img?getComputedStyle(img):null;return{card:{w:r.width,h:r.height,max:getComputedStyle(card).maxHeight},img:ir?{w:ir.width,h:ir.height,ratio:ir.width/Math.max(ir.height,1),objectFit:s.objectFit}:null,title:title?parseFloat(getComputedStyle(title).fontSize):0,size:card.dataset.sizeClass||null}})}

const browser=await chromium.launch({headless:true});
try{
  for(const viewport of [{width:390,height:844,label:'390'},{width:430,height:844,label:'430'}]){
    const{ctx,page,errors}=await openBoard(browser,viewport);
    const nav=page.locator('.dc-board-filter-nav');await nav.waitFor({state:'visible',timeout:3000});
    const initial=await nav.locator('[data-pos]').innerText();expect(initial==='1 / 2',`nav-${viewport.label}: initial position ${initial}`);
    const clearance=await page.evaluate(()=>{const n=document.querySelector('.dc-board-filter-nav')?.getBoundingClientRect(),c=document.querySelector('.dc-spatial-controls')?.getBoundingClientRect();return{navTop:n?.top,navBottom:n?.bottom,controlsTop:c?.top,controlsBottom:c?.bottom}});
    expect(clearance.navBottom<=clearance.controlsTop-4,`nav-${viewport.label}: navigator overlaps spatial controls ${JSON.stringify(clearance)}`);
    const before=await page.locator('.dc-spatial-world').evaluate(el=>el.style.transform);
    await nav.locator('[data-next]').click();await page.waitForTimeout(80);
    const after=await page.locator('.dc-spatial-world').evaluate(el=>el.style.transform);
    const nextPos=await nav.locator('[data-pos]').innerText();expect(after!==before,`nav-${viewport.label}: next did not move camera`);expect(nextPos==='2 / 2',`nav-${viewport.label}: next position ${nextPos}`);
    await nav.locator('[data-prev]').click();await page.waitForTimeout(60);expect((await nav.locator('[data-pos]').innerText())==='1 / 2',`nav-${viewport.label}: prev did not return`);

    await page.locator('[data-board-filter-drawer]').click();const drawer=page.locator('.dc-board-filter-drawer');await drawer.waitFor({state:'visible',timeout:2000});
    const stack=await page.evaluate(()=>{const d=document.querySelector('.dc-board-filter-drawer')?.getBoundingClientRect(),n=document.querySelector('.dc-board-filter-nav')?.getBoundingClientRect();return{drawerBottom:d?.bottom,navTop:n?.top}});expect(stack.drawerBottom<=stack.navTop-4,`nav-${viewport.label}: drawer overlaps navigator ${JSON.stringify(stack)}`);await page.locator('[data-filter-close]').click();

    const card='.dc-notice[data-artifact="qa-artifact-own"]';
    await setImage(page,card,320,160);const landscape=await metrics(page,card);
    await setImage(page,card,160,320);const portrait=await metrics(page,card);
    expect(landscape.img&&portrait.img,`media-${viewport.label}: image metrics missing`);
    expect(landscape.img.ratio>1.7,`media-${viewport.label}: landscape ratio collapsed ${JSON.stringify(landscape.img)}`);
    expect(portrait.img.ratio<.7,`media-${viewport.label}: portrait ratio collapsed ${JSON.stringify(portrait.img)}`);
    expect(portrait.img.h>landscape.img.h,`media-${viewport.label}: portrait does not create taller visual ${JSON.stringify({landscape,portrait})}`);
    expect(landscape.img.objectFit==='contain'&&portrait.img.objectFit==='contain',`media-${viewport.label}: media is still crop-owned`);

    await page.locator(card).evaluate(el=>el.dataset.sizeClass='XS');const compact=await metrics(page,card);
    await page.locator(card).evaluate(el=>el.dataset.sizeClass='L');const dense=await metrics(page,card);
    expect(compact.title>dense.title,`type-${viewport.label}: size classes do not create title hierarchy ${JSON.stringify({compact:compact.title,dense:dense.title})}`);
    expect(!errors.length,`board-${viewport.label}: ${errors.join(' | ')}`);
    await ctx.close();
  }

  const{ctx,page,errors}=await openBoard(browser,{width:1440,height:900});
  const nav=page.locator('.dc-board-filter-nav');await nav.waitFor({state:'visible',timeout:3000});
  const desktopPosition=await nav.evaluate(el=>getComputedStyle(el).position);expect(desktopPosition!=='fixed',`desktop: navigator unexpectedly changed to fixed composition`);
  const card='.dc-notice[data-artifact="qa-artifact-own"]';await setImage(page,card,420,210);const landscape=await metrics(page,card);await setImage(page,card,210,420);const portrait=await metrics(page,card);expect(landscape.img.ratio>1.7&&portrait.img.ratio<.7,`desktop: source proportions not preserved`);expect(portrait.img.h>landscape.img.h,`desktop: portrait card visual is not taller`);expect(!errors.length,`desktop: ${errors.join(' | ')}`);await ctx.close();
}finally{await browser.close();server.close()}

if(failures.length){console.error(`Board navigation/adaptive cards acceptance failed (${failures.length})`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Board navigation/adaptive cards browser acceptance passed');
