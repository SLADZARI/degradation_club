import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium,webkit} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const failures=[];const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
function resolveFile(urlPath){let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);if(pathname.endsWith('/'))pathname+='index.html';const full=path.resolve(artifact,pathname.replace(/^\/+/,''));return full.startsWith(path.resolve(artifact))?full:null}
const server=http.createServer((req,res)=>{const file=resolveFile(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}res.statusCode=200;res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
const stub=()=>`
const mode=globalThis.__QA_BOARD_MODE__||'member';
globalThis.__QA_RPC_CALLS__=globalThis.__QA_RPC_CALLS__||[];globalThis.__QA_DB_WRITES__=globalThis.__QA_DB_WRITES__||[];
const member=['member-first','member','dementor'].includes(mode);const role=mode==='owner'?'owner_admin':mode==='dementor'?'dementor':null;const user={id:'qa-board-user',email:'qa@invalid',user_metadata:{full_name:'QA'}};const other='qa-member-other';const session=mode==='anonymous'?null:{user};const application=mode==='applicant'?{id:'qa-app',profile_id:user.id,status:'reviewing',created_at:'2026-09-06T10:00:00Z'}:null;
const ownArtifact={id:'qa-artifact-own',author_profile_id:user.id,title:'МОЙ QA CARD',body:'Моя карточка для проверки.',external_url:null,status:'active',visibility:'community',starts_at:null,expires_at:null,published_at:'2026-09-05T11:00:00Z',created_at:'2026-09-05T10:55:00Z'};
const otherArtifact={id:'qa-artifact-other',author_profile_id:other,title:'ЧУЖОЙ QA CARD',body:'Карточка другого участника для проверки реакций и admin moderation.',external_url:null,status:'active',visibility:'community',starts_at:null,expires_at:null,published_at:'2026-09-05T10:00:00Z',created_at:'2026-09-05T09:55:00Z'};
const artifactRows=mode==='member-first'?[otherArtifact]:[ownArtifact,otherArtifact];
const rowsFor=t=>t==='join_applications'?(application?[application]:[]):t==='dc_role_assignments'?(role?[{profile_id:user.id,role,status:'active'}]:[]):t==='profiles'?[{id:user.id,full_name:'QA',display_name:'QA'}]:t==='dc_system_memberships'?(member?[{profile_id:user.id,status:'active'}]:[]):t==='dc_artifacts'?artifactRows:t==='dc_member_public_profiles'?[{profile_id:user.id,display_name:'QA Owner',nickname:'qa',avatar_url:null,member_since:'2026-09-01'},{profile_id:other,display_name:'Other Member',nickname:'other',avatar_url:null,member_since:'2026-09-01'}]:t==='dc_artifact_reactions'?[]:t==='dc_artifact_responses'?[]:t==='dc_artifact_media'?[]:t==='dc_artifact_board_positions'?artifactRows.map((a,i)=>({artifact_id:a.id,board_id:'community',x:1200+i*480,y:900+i*160,rotation:0,size_class:'M',position_version:1})):[];
const query=t=>{let rows=[...rowsFor(t)];const q={select(){return q},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return q},is(){return q},order(){return q},limit(n){rows=rows.slice(0,n);return q},range(){return q},insert(payload){globalThis.__QA_DB_WRITES__.push({op:'insert',table:t,payload});return q},upsert(payload){globalThis.__QA_DB_WRITES__.push({op:'upsert',table:t,payload});return q},update(payload){globalThis.__QA_DB_WRITES__.push({op:'update',table:t,payload});return q},delete(){globalThis.__QA_DB_WRITES__.push({op:'delete',table:t});return q},maybeSingle(){return Promise.resolve({data:rows[0]||null,error:null})},single(){return Promise.resolve({data:rows[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return q};
export function createClient(){return{auth:{getSession:async()=>({data:{session}}),getUser:async()=>({data:{user:mode==='anonymous'?null:user}}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async(name,args)=>{globalThis.__QA_RPC_CALLS__.push({name,args});if(name==='dc_member_entry_status_v1'){if(globalThis.__QA_FAIL_POST_PUBLISH_REFRESH__)throw new Error('QA synthetic post-confirmation refresh failure');const incomplete=mode==='guest-incomplete';return{data:{membership_active:member,community_activation_state:mode==='member-first'?'FIRST_ARTIFACT_REQUIRED':member?'MEMBER_ACTIVATED':null,sphere_count:incomplete?4:9,sphere_gate_complete:!incomplete,artifact_slots_available:mode==='member-first'?1:0,artifact_slots_consuming:mode==='member'?1:0,published_artifact_count:mode==='member'?1:0},error:null}};if(name==='dc_guest_board_read_v1')return{data:[{artifact_id:'qa-artifact',artifact_type:'offer',title:'QA CARD',body:'Короткое описание карточки. Второй абзац.',published_at:'2026-09-05T10:00:00Z',author_display_name:'QA Member',reaction_count:0,guest_interest_count:0,my_guest_interest:false,board_x:1200,board_y:900,board_rotation:0,board_size_class:'M'}],error:null};if(name==='dc_guest_board_interest_toggle_v1')return{data:{active:true,count:1},error:null};if(name==='dc_close_artifact_v1')return{data:{artifact_id:args?.p_artifact_id,status:'archived'},error:null};if(name==='dc_create_artifact_draft_v1')return{data:'qa-synthetic-draft-id',error:null};if(name==='dc_publish_artifact_v1'&&globalThis.__QA_HOLD_PUBLISH__){return await new Promise(resolve=>{globalThis.__QA_RESOLVE_PUBLISH__=ok=>resolve(ok?{data:{artifact_id:args?.p_artifact_id},error:null}:{data:null,error:{message:'QA synthetic RPC rejection'}})})}return{data:null,error:null}},storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:'https://example.invalid/x.webp'}}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{},error:null})})},functions:{invoke:async()=>({data:{}})}}}`;

async function open(browser,mode,viewport){const ctx=await browser.newContext({viewport});await ctx.addInitScript(m=>{globalThis.__QA_BOARD_MODE__=m;globalThis.__QA_RPC_CALLS__=[];globalThis.__QA_DB_WRITES__=[];try{localStorage.setItem('dc:board:tutorial:v21:qa-board-user:guest',JSON.stringify({done:true}));localStorage.setItem('dc:board:tutorial:v21:qa-board-user:member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}},mode);await ctx.route('https://cdn.jsdelivr.net/**',r=>r.request().url().includes('@supabase/supabase-js')?r.fulfill({status:200,contentType:'text/javascript',body:stub()}):r.abort());const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:5000});return{ctx,page,errors}}

// Regression for the existing Board composer: visual only, never submits or saves.
async function checkComposerPresentation(page,label){
  const m=await page.locator('#entrySection.is-composer-sheet-open').evaluate(el=>{
    const r=el.getBoundingClientRect(),inner=el.querySelector('.dc-board-shell');
    const field=el.querySelector('#artifactBody');
    return{
      bg:getComputedStyle(el).backgroundColor,
      innerBg:getComputedStyle(inner).backgroundColor,
      fieldBg:getComputedStyle(field).backgroundColor,
      left:r.left,right:r.right,top:r.top,bottom:r.bottom,
      width:innerWidth,height:innerHeight,scroll:el.scrollHeight,client:el.clientHeight
    };
  });
  expect(m.bg==='rgb(248, 245, 237)',`${label}: composer shell is transparent ${JSON.stringify(m)}`);
  expect(m.innerBg==='rgb(248, 245, 237)',`${label}: composer interior is transparent ${JSON.stringify(m)}`);
  expect(m.fieldBg==='rgb(255, 253, 247)',`${label}: form fields not opaque ${JSON.stringify(m)}`);
  expect(m.left>=-1&&m.right<=m.width+1&&m.top>=-1&&m.bottom<=m.height+1,`${label}: composer outside viewport ${JSON.stringify(m)}`);
  expect(m.scroll>m.client+16,`${label}: long form not scrollable ${JSON.stringify(m)}`);
  if(m.width>768)expect(Math.abs(m.right-m.width)<2,`${label}: desktop composer not right-aligned ${JSON.stringify(m)}`);
  const type=page.locator('#artifactType');
  await type.selectOption('idea');
  expect(await page.locator('#artifactVisibilityField').isVisible(),`${label}: IDEA visibility not shown`);
  await page.locator('#artifactTitle').fill('QA: visual-only draft');
  await page.locator('#artifactBody').fill('QA: editor stays readable when filling a long form.');
  expect(await page.locator('#artifactBody').inputValue()==='QA: editor stays readable when filling a long form.',`${label}: textarea lost input`);
  await type.selectOption('announcement');
  expect(!(await page.locator('#artifactVisibilityField').isVisible()),`${label}: non-IDEA visibility leaked`);
}

for(const engine of [{name:'chromium',launch:()=>chromium.launch({headless:true})},{name:'webkit',launch:()=>webkit.launch({headless:true})}]){const browser=await engine.launch();for(const mode of ['guest-incomplete','guest-complete','applicant','member-first','member','dementor','owner']){const{ctx,page,errors}=await open(browser,mode,{width:1440,height:900});expect(await page.locator('[data-board-personal-host],.dc-board-personal-host').count()===0,`${engine.name}/${mode}: personal card leaked onto Board`);expect(await page.locator('.dcw-topbar,.dc-board-hero,.dc-board-wall-head').count()===0,`${engine.name}/${mode}: legacy Board chrome present in DOM`);expect(await page.locator('.dcw-live-banner').count()===1,`${engine.name}/${mode}: canonical LIVE banner missing`);expect((await page.locator('.dcw-brand').innerText()).replace(/\s+/g,' ').trim()==='DEMENTOR CLUB',`${engine.name}/${mode}: canonical DEMENTOR CLUB brand missing`);const clubBg=await page.locator('.dcw-brand strong').evaluate(el=>getComputedStyle(el).backgroundColor);expect(clubBg!=='rgba(0, 0, 0, 0)'&&clubBg!=='transparent',`${engine.name}/${mode}: CLUB tile is not visually branded`);const pageScroll=await page.evaluate(()=>({sh:document.documentElement.scrollHeight,ih:innerHeight,body:getComputedStyle(document.body).overflow}));expect(pageScroll.sh<=pageScroll.ih+2,`${engine.name}/${mode}: page scroll remains ${JSON.stringify(pageScroll)}`);if(['guest-incomplete','guest-complete','applicant'].includes(mode)){await page.locator('.dc-board-primary.is-visible').waitFor({state:'visible',timeout:3000});expect((await page.locator('.dc-board-primary button').innerText()).includes('СОЗДАТЬ'),`${engine.name}/${mode}: guest create affordance missing`)}if(mode==='member-first'){await page.locator('.dc-notice [data-reaction]').first().waitFor({state:'attached',timeout:3000});const gate=await page.locator('.dc-notice').first().evaluate(card=>({reactionDisabled:card.querySelector('[data-reaction]')?.disabled,reactionAria:card.querySelector('[data-reaction]')?.getAttribute('aria-disabled'),reactionLock:card.querySelector('[data-reaction]')?.dataset.activationLocked||null,responseDisabled:card.querySelector('[data-response]')?.disabled,responseAria:card.querySelector('[data-response]')?.getAttribute('aria-disabled'),responseLock:card.querySelector('[data-response]')?.dataset.activationLocked||null}));expect(!gate.reactionDisabled&&!gate.responseDisabled&&!gate.reactionAria&&!gate.responseAria&&!gate.reactionLock&&!gate.responseLock,`${engine.name}/${mode}: first Artifact state still locks interaction ${JSON.stringify(gate)}`)}if(mode==='owner'){await page.locator('.dc-board-primary.is-visible').waitFor({state:'visible',timeout:3000});expect((await page.locator('.dc-board-primary button').innerText()).includes('СОЗДАТЬ'),`${engine.name}/owner: privileged create affordance missing`);await page.waitForFunction(()=>{const cards=[...document.querySelectorAll('.dc-notice[data-artifact]')];return cards.length>=2&&cards.every(card=>card.classList.contains('is-admin-movable'))},{timeout:3000});const counts=await page.evaluate(()=>({cards:document.querySelectorAll('.dc-notice[data-artifact]').length,movable:document.querySelectorAll('.dc-notice.is-admin-movable').length,adminClose:document.querySelectorAll('[data-admin-close-artifact]').length,state:document.documentElement.dataset.dcBoardUserState}));expect(counts.state==='OWNER_ADMIN'&&counts.cards>=2&&counts.movable===counts.cards&&counts.adminClose>=1,`${engine.name}/owner: moderation/move surface incomplete ${JSON.stringify(counts)}`)}expect(!errors.length,`${engine.name}/${mode}: ${errors.join(' | ')}`);await ctx.close()}await browser.close()}

{
  const browser=await chromium.launch({headless:true});const{ctx,page,errors}=await open(browser,'guest-incomplete',{width:1440,height:900});await page.locator('.dc-board-primary.is-visible button').click();await page.locator('.dc-board-membership-gate').waitFor({state:'visible',timeout:2000});const gateText=(await page.locator('.dc-board-membership-gate').innerText()).replace(/\s+/g,' ');expect(gateText.includes('DC-9 · 4 / 9'),'guest publication gate does not show DC-9 progress');expect(gateText.includes('вступить в Dementor Club'),'guest publication gate does not explain membership requirement');expect(!errors.length,`guest publication gate: ${errors.join(' | ')}`);await ctx.close();await browser.close();
}

{
  const browser=await chromium.launch({headless:true});const{ctx,page,errors}=await open(browser,'member-first',{width:1440,height:900});await page.locator('.dc-notice [data-reaction]').first().waitFor({state:'attached',timeout:3000});await page.evaluate(()=>document.querySelector('.dc-notice [data-reaction]')?.click());await page.waitForFunction(()=>globalThis.__QA_DB_WRITES__?.some(write=>write.op==='insert'&&write.table==='dc_artifact_reactions'));expect(await page.evaluate(()=>globalThis.__QA_DB_WRITES__.some(write=>write.op==='insert'&&write.table==='dc_artifact_reactions')),'member-first reaction did not reach canonical reaction write');await page.evaluate(()=>document.querySelector('.dc-notice [data-response]')?.click());expect(await page.locator('.dc-response-box').count()===1,'member-first response composer did not open');await page.evaluate(()=>document.querySelector('.dc-response-box [data-send]')?.click());await page.waitForFunction(()=>globalThis.__QA_DB_WRITES__?.some(write=>write.op==='insert'&&write.table==='dc_artifact_responses'));expect(await page.evaluate(()=>globalThis.__QA_DB_WRITES__.some(write=>write.op==='insert'&&write.table==='dc_artifact_responses')),'member-first response did not reach canonical response write');expect(!errors.length,`member-first interactions: ${errors.join(' | ')}`);await ctx.close();await browser.close();
}

{
  const browser=await chromium.launch({headless:true});const{ctx,page,errors}=await open(browser,'owner',{width:1440,height:900});await page.waitForFunction(()=>{const cards=[...document.querySelectorAll('.dc-notice[data-artifact]')];return cards.length>=2&&cards.every(card=>card.classList.contains('is-admin-movable'))},{timeout:3000});const other=page.locator('.dc-notice.is-admin-movable[data-artifact="qa-artifact-other"]');const box=await other.boundingBox();expect(!!box,'owner admin target card has no geometry');if(box){await page.mouse.move(box.x+Math.min(80,box.width*.25),box.y+Math.min(90,box.height*.35));await page.mouse.down();await page.mouse.move(box.x+Math.min(80,box.width*.25)+70,box.y+Math.min(90,box.height*.35)+45,{steps:5});await page.mouse.up();await page.waitForFunction(()=>globalThis.__QA_DB_WRITES__?.some(write=>write.op==='update'&&write.table==='dc_artifact_board_positions'),{timeout:2000});const dragResult=await page.evaluate(()=>({positionWrite:globalThis.__QA_DB_WRITES__.some(write=>write.op==='update'&&write.table==='dc_artifact_board_positions'),overlay:document.documentElement.dataset.boardArtifactOpen||null,dragged:document.querySelector('[data-artifact="qa-artifact-other"]')?.dataset.boardJustDragged||null}));expect(dragResult.positionWrite&&dragResult.dragged&&!dragResult.overlay,`owner admin drag did not persist safely ${JSON.stringify(dragResult)}`)}await page.locator('.dc-board-primary.is-visible button').click();await page.locator('.dc-composer').waitFor({state:'attached',timeout:2500});expect(await page.locator('#entrySection.is-composer-sheet-open').count()===1,'owner primary create did not open canonical composer sheet');await checkComposerPresentation(page,'1440 owner');await page.evaluate(()=>document.getElementById('cancelComposer')?.click());await page.waitForTimeout(120);page.on('dialog',dialog=>dialog.accept());await page.locator('[data-admin-close-artifact]').first().click();await page.waitForFunction(()=>globalThis.__QA_RPC_CALLS__?.some(call=>call.name==='dc_close_artifact_v1'));const adminResult=await page.evaluate(()=>({closed:globalThis.__QA_RPC_CALLS__.some(call=>call.name==='dc_close_artifact_v1'),overlay:document.documentElement.dataset.boardArtifactOpen||null}));expect(adminResult.closed&&!adminResult.overlay,`owner admin close was intercepted by fullscreen open ${JSON.stringify(adminResult)}`);expect(!errors.length,`owner admin controls: ${errors.join(' | ')}`);await ctx.close();await browser.close();
}

// Existing Board owner mock, no real Cloud writes: ensure the full IDEA/announcement
// editor remains opaque, contained and usable on phone/tablet breakpoints.
{
  const browser=await chromium.launch({headless:true});
  for(const viewport of [{width:360,height:640},{width:390,height:844},{width:430,height:932},{width:768,height:900}]){
    const{ctx,page,errors}=await open(browser,'owner',viewport);
    await page.locator('.dc-board-primary.is-visible button').click();
    await page.locator('#entrySection.is-composer-sheet-open').waitFor({state:'visible',timeout:3000});
    await checkComposerPresentation(page,`owner-${viewport.width}`);
    await page.locator('#cancelComposer').click();
    expect(!errors.length,`owner-${viewport.width}: ${errors.join(' | ')}`);
    await ctx.close();
  }
  await browser.close();
}

for(const viewport of [{width:390,height:844,label:'390'},{width:360,height:800,label:'360'}]){const browser=await chromium.launch({headless:true});const{ctx,page,errors}=await open(browser,'member',viewport);await page.waitForFunction(()=>{const own=document.querySelector('.dc-spatial-world>.dc-notice[data-artifact="qa-artifact-own"]');const other=document.querySelector('.dc-spatial-world>.dc-notice[data-artifact="qa-artifact-other"]');return own?.dataset.sizeClass==='M'&&other?.dataset.sizeClass==='M'},{timeout:4000});const geo=await page.locator('.dc-spatial-viewport').evaluate(el=>{const r=el.getBoundingClientRect();return{top:r.top,bottom:r.bottom,height:r.height,iw:innerWidth,ih:innerHeight,scrollH:document.documentElement.scrollHeight,touch:getComputedStyle(el).touchAction}});expect(geo.height>=geo.ih-140,`mobile-${viewport.label}: Board does not own remaining screen below canonical two-row header ${JSON.stringify(geo)}`);expect(geo.top<=140,`mobile-${viewport.label}: canonical header consumes too much space ${JSON.stringify(geo)}`);expect(geo.scrollH<=geo.ih+2,`mobile-${viewport.label}: page scroll remains ${JSON.stringify(geo)}`);expect(geo.touch==='none',`mobile-${viewport.label}: touch-action ${geo.touch}`);expect(await page.locator('.dcw-live-banner').count()===1,`mobile-${viewport.label}: canonical LIVE banner missing`);expect((await page.locator('.dcw-brand').innerText()).replace(/\s+/g,' ').trim()==='DEMENTOR CLUB',`mobile-${viewport.label}: canonical brand collapsed`);const harmony=await page.evaluate(()=>{const nav=document.querySelector('.dcw-nav')?.getBoundingClientRect();const filters=document.querySelector('.dc-board-filters')?.getBoundingClientRect();return nav&&filters?{navBottom:nav.bottom,filterTop:filters.top}:null});expect(harmony&&harmony.filterTop>=harmony.navBottom+8,`mobile-${viewport.label}: Workspace nav collides with Board filters ${JSON.stringify(harmony)}`);const personal=await page.locator('[data-board-personal-host],.dc-board-personal-host').count();expect(personal===0,`mobile-${viewport.label}: personal card leaked`);const cards=await page.locator('.dc-spatial-world>.dc-notice,.dc-spatial-world>.dc-projection').evaluateAll(nodes=>nodes.map(node=>{const css=getComputedStyle(node);return{kind:node.classList.contains('dc-notice')?'notice':'projection',artifact:node.dataset.artifact||null,sizeClass:node.dataset.sizeClass||null,offsetWidth:node.offsetWidth,computedWidth:css.width,position:css.position,left:css.left,boxSizing:css.boxSizing}}));expect(cards.every(card=>card.offsetWidth<=viewport.width*.75),`mobile-${viewport.label}: layout card too wide ${JSON.stringify(cards)}`);expect(!errors.length,`mobile-${viewport.label}: ${errors.join(' | ')}`);await ctx.close();await browser.close()}

/* Owner-approved G4 regression: existing anonymous gate, composer focus, and mobile H1.
   No production credentials, Auth redirects, Cloud connections or submitted artifacts. */
{
  const browser=await chromium.launch({headless:true});
  for(const width of [360,390,1440]){
    const height=width===1440?900:844;
    const{ctx,page,errors}=await open(browser,'owner',{width,height});
    const opener=page.locator('.dc-board-primary.is-visible button');
    await opener.waitFor({state:'visible',timeout:3000});
    await opener.click();
    await page.locator('#entrySection.is-composer-sheet-open').waitFor({state:'visible',timeout:3000});
    await page.keyboard.press('Escape');
    await page.waitForFunction(()=>!document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open'));
    await page.waitForTimeout(80);
    const escapeFocus=await page.evaluate(()=>({isOpener:document.activeElement===document.querySelector('.dc-board-primary.is-visible button'),tag:document.activeElement?.tagName,writes:globalThis.__QA_DB_WRITES__?.length||0}));
    expect(escapeFocus.isOpener,`G4 owner ${width}: Escape did not restore visible opener ${JSON.stringify(escapeFocus)}`);
    await opener.click();
    await page.locator('#entrySection.is-composer-sheet-open').waitFor({state:'visible',timeout:3000});
    await page.locator('#cancelComposer').click();
    await page.waitForFunction(()=>!document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open'));
    await page.waitForTimeout(80);
    const cancelFocus=await page.evaluate(()=>document.activeElement===document.querySelector('.dc-board-primary.is-visible button'));
    expect(cancelFocus,`G4 owner ${width}: Cancel did not restore visible opener`);
    expect(!errors.length,`G4 owner ${width}: JS errors ${errors.join(' | ')}`);
    await ctx.close();
  }
  for(const width of [360,390,1440]){
    const{ctx,page,errors}=await open(browser,'anonymous',{width,height:width===1440?900:844});
    await page.waitForFunction(()=>document.documentElement.dataset.dcBoardUserState==='UNAUTHENTICATED',{timeout:4000});
    await page.locator('#boardLogin').waitFor({state:'visible',timeout:3500});
    const state=await page.locator('#boardLogin').evaluate(el=>{
      const gate=el.closest('.dc-first-gate'),entry=document.getElementById('entrySection'),r=el.getBoundingClientRect();
      return{root:document.documentElement.dataset.dcBoardUserState,
       display:getComputedStyle(gate).display,entryDisplay:getComputedStyle(entry).display,
       width:r.width,top:r.top,bottom:r.bottom,viewport:innerHeight};
    });
    expect(state.root==='UNAUTHENTICATED'&&state.display!=='none'&&state.entryDisplay!=='none'&&state.width>60&&state.top>=0&&state.bottom<=state.viewport+2,`G4 anonymous ${width}: Google CTA obscured ${JSON.stringify(state)}`);
    await page.locator('#boardLogin').focus();
    expect(await page.evaluate(()=>document.activeElement?.id==='boardLogin'),`G4 anonymous ${width}: button not focusable`);
    expect(!errors.length,`G4 anonymous ${width}: JS errors ${errors.join(' | ')}`);
    await ctx.close();
  }
  for(const width of [360,390,414,430,560,1440]){
    const ctx=await browser.newContext({viewport:{width,height:width===1440?900:844}});
    const page=await ctx.newPage();await page.goto(base+'/',{waitUntil:'domcontentloaded'});
    const measured=await page.locator('#hero-title').evaluate(el=>{
      const first=el.firstChild;
      const range=document.createRange();
      range.setStart(first,0);range.setEnd(first,'САМОРАЗВИТИЕ'.length);
      const word=range.getBoundingClientRect(),hero=el.closest('.dc-hero').getBoundingClientRect();
      return{left:word.left,right:word.right,heroLeft:hero.left,heroRight:hero.right,viewport:innerWidth,font:parseFloat(getComputedStyle(el).fontSize)};
    });
    if(width<=700)expect(measured.left>=measured.heroLeft-2&&measured.right<=measured.heroRight+2,`G4 H1 ${width}: first word clipped ${JSON.stringify(measured)}`);
    else expect(measured.font>=70,`G4 H1 desktop typography drift ${JSON.stringify(measured)}`);
    await ctx.close();
  }
  await browser.close();
}


/* v0.3 owner-approved native pointer continuity (G5 developer fixture, NOT independent G6):
   a 260ms real pointer press spans Board observer and guest CTA refresh.
   Both existing action owners must NOT replace the button text child mid-press. */
{
  for(const engine of [
    {name:'chromium',launch:()=>chromium.launch({headless:true})},
    {name:'webkit',launch:()=>webkit.launch({headless:true})}
  ]){
    const browser=await engine.launch();
    for(const role of ['owner','member-first','member','guest-incomplete','applicant']){
      for(const width of [360,1440]){
        const{ctx,page,errors}=await open(browser,role,{width,height:width===1440?900:844});
        try{
          await page.waitForFunction(roleName=>{
            const host=document.querySelector('.dc-board-primary.is-visible');
            if(!host?.querySelector('button'))return false;
            if(roleName==='owner')return host.dataset.access==='owner-admin';
            if(roleName==='guest-incomplete'||roleName==='applicant')
              return host.dataset.access==='membership-required';
            return !host.dataset.access;
          },role,{timeout:6000});
        }catch(error){
          const state=await page.evaluate(()=>({
            role:document.documentElement.dataset.dcBoardUserState,
            access:document.querySelector('.dc-board-primary')?.dataset.access,
            label:document.querySelector('.dc-board-primary button')?.textContent,
            visible:document.querySelector('.dc-board-primary')?.classList.contains('is-visible')
          }));
          throw new Error(`G5 pointer ${engine.name}/${role}/${width}: primary not ready ${JSON.stringify(state)}: ${error.message}`);
        }
        await page.evaluate(()=>{
          const btn=document.querySelector('.dc-board-primary.is-visible button');
          window.__QA_HELD_POINTER__={down:0,up:0,click:0,during:0};
          let held=false;
          btn.addEventListener('pointerdown',e=>{if(e.isTrusted){held=true;window.__QA_HELD_POINTER__.down++}});
          btn.addEventListener('pointerup',e=>{if(e.isTrusted){held=false;window.__QA_HELD_POINTER__.up++}});
          btn.addEventListener('click',e=>{if(e.isTrusted)window.__QA_HELD_POINTER__.click++});
          new MutationObserver(records=>{if(held&&records.some(r=>r.type==='childList'))window.__QA_HELD_POINTER__.during++})
            .observe(btn,{childList:true,subtree:true});
        });
        const b=await page.locator('.dc-board-primary.is-visible button').boundingBox();
        expect(!!b,`G5 pointer ${engine.name}/${role}/${width}: primary disappeared`);
        if(b){
          await page.mouse.move(b.x+b.width/2,b.y+b.height/2);
          await page.mouse.down();
          await page.evaluate(()=>{
            const host=document.getElementById('boardHost');
            if(host){const pulse=document.createElement('span');host.appendChild(pulse);pulse.remove()}
            window.dispatchEvent(new CustomEvent('dc:board-spatial-ready'));
          });
          await page.waitForTimeout(260);
          await page.mouse.up();
          const proof=await page.evaluate(()=>({
            ...window.__QA_HELD_POINTER__,
            gate:document.documentElement.dataset.boardMembershipGate==='1',
            modal:document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open')===true,
            overlay:document.documentElement.dataset.boardArtifactOpen==='1',
            writes:globalThis.__QA_DB_WRITES__?.length||0
          }));
          const target=role==='owner'||role==='member-first'?proof.modal:
            role==='member'?proof.overlay:proof.gate;
          expect(proof.down===1&&proof.up===1&&proof.click===1&&proof.during===0&&target&&proof.writes===0,
            `G5 pointer ${engine.name}/${role}/${width}: trusted click lost or role/gate drift ${JSON.stringify(proof)}`);
        }
        expect(!errors.length,`G5 pointer ${engine.name}/${role}/${width}: page errors ${errors.join(' | ')}`);
        await ctx.close();
      }
    }
    await browser.close();
  }
}

/* G6 regression from Q-01: WebKit no-slot fallback and true modal background inertness.
   These browser cases use the existing isolated Board fixture; no live OAuth or writes. */
{
  for(const engine of [
    {name:'chromium',launch:()=>chromium.launch({headless:true})},
    {name:'webkit',launch:()=>webkit.launch({headless:true})}
  ]){
    const browser=await engine.launch();
    for(const width of [360,390,414,430,560,768,1440]){
      const{ctx,page,errors}=await open(browser,'owner',{width,height:width===1440?900:844});
      // Board state and the primary action update on different async turns:
      // wait for the OWNER handler, not an intermediate membership-gate button.
      await page.waitForFunction(()=>{
        const host=document.querySelector('.dc-board-primary.is-visible');
        return document.documentElement.dataset.dcBoardUserState==='OWNER_ADMIN'
          &&host?.dataset.access==='owner-admin'
          &&host.querySelector('button')?.textContent.includes('СОЗДАТЬ')
          &&!!document.getElementById('openComposer');
      },null,{timeout:5000});
      await page.evaluate(()=>{
        // Remove a potentially available slot and open in the same task,
        // guaranteeing the existing #openComposer fallback instead.
        document.querySelector('.dc-spatial-controls [data-slot]')?.remove();
        document.querySelector('.dc-board-primary.is-visible button')?.click();
      });
      await page.locator('#entrySection.is-composer-sheet-open').waitFor({state:'visible',timeout:4000});
      const modal=await page.evaluate(()=>({
        dialog:document.getElementById('entrySection')?.getAttribute('aria-modal'),
        wallInert:document.querySelector('.dc-board-wall')?.inert,
        sidebarInert:document.querySelector('.dcw-sidebar')?.inert,
        backgroundFocused:document.activeElement?.closest?.('.dc-board-wall,.dcw-sidebar')!==null
      }));
      expect(modal.dialog==='true'&&modal.wallInert===true&&modal.sidebarInert===true,
        `G6 ${engine.name} ${width}: invisible/no-slot sheet or live background ${JSON.stringify(modal)}`);
      expect(!modal.backgroundFocused,
        `G6 ${engine.name} ${width}: background retains keyboard focus`);
      if(width===1440){
        await page.evaluate(()=>{
          const el=document.querySelector('.dc-board-filter');
          if(el){window.__QA_MODAL_FILTER_CLICKS__=0;el.addEventListener('click',()=>{window.__QA_MODAL_FILTER_CLICKS__++})}
        });
        const filter=page.locator('.dc-board-filter').first();
        if(await filter.count()){
          const rect=await filter.boundingBox();
          if(rect){
            await page.mouse.click(rect.x+Math.min(rect.width/2,10),rect.y+rect.height/2);
            const clicks=await page.evaluate(()=>window.__QA_MODAL_FILTER_CLICKS__||0);
            expect(clicks===0,`G6 ${engine.name} ${width}: modal allowed background filter click ${clicks}`);
            await page.keyboard.press('Shift+Tab');
            const reverse=await page.evaluate(()=>{
              const root=document.querySelector('#entryHost .dc-composer');
              const list=[...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')]
                .filter(el=>!el.hidden&&el.offsetParent!==null);
              return{lastInside:document.activeElement===list[list.length-1],active:document.activeElement?.tagName};
            });
            expect(reverse.lastInside,`G6 ${engine.name} ${width}: Shift+Tab from outside did not recover to last modal control ${JSON.stringify(reverse)}`);
            await page.locator('#artifactBody').focus();
            await page.mouse.click(rect.x+Math.min(rect.width/2,10),rect.y+rect.height/2);
            await page.keyboard.press('Tab');
            const forward=await page.evaluate(()=>{
              const root=document.querySelector('#entryHost .dc-composer');
              const list=[...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')]
                .filter(el=>!el.hidden&&el.offsetParent!==null);
              return{firstInside:document.activeElement===list[0],active:document.activeElement?.tagName};
            });
            expect(forward.firstInside,`G6 ${engine.name} ${width}: Tab from outside did not recover to first modal control ${JSON.stringify(forward)}`);
          }
        }
      }
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>!document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open'),null,{timeout:3000});
      const restored=await page.evaluate(()=>({
        wallInert:document.querySelector('.dc-board-wall')?.inert,
        sidebarInert:document.querySelector('.dcw-sidebar')?.inert,
        focusOnPrimary:document.activeElement===document.querySelector('.dc-board-primary.is-visible button')
      }));
      expect(restored.wallInert===false&&restored.sidebarInert===false,
        `G6 ${engine.name} ${width}: inert background not restored ${JSON.stringify(restored)}`);
      expect(restored.focusOnPrimary,
        `G6 ${engine.name} ${width}: Escape did not return to visible opener ${JSON.stringify(restored)}`);
      if(width===390){
        await page.locator('.dc-board-primary.is-visible button').click();
        await page.locator('#entrySection.is-composer-sheet-open').waitFor({state:'visible',timeout:3000});
        await page.locator('#artifactBody').fill('');
        // Submit event from novalidate form: existing board.js rejects empty body
        // before any RPC, and a subsequent Cancel must never signal success.
        await page.locator('#artifactForm').evaluate(el=>el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
        await page.locator('#cancelComposer').click();
        await page.waitForFunction(()=>!document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open'),null,{timeout:3000});
        const cancelAfterInvalid=await page.evaluate(()=>({
          falseSuccess:!!document.querySelector('.dc-board-toast.is-visible'),
          focusOnPrimary:document.activeElement===document.querySelector('.dc-board-primary.is-visible button'),
          writes:globalThis.__QA_DB_WRITES__?.length||0
        }));
        expect(!cancelAfterInvalid.falseSuccess&&cancelAfterInvalid.focusOnPrimary&&cancelAfterInvalid.writes===0,
          `G6 ${engine.name} 390: invalid submit then Cancel shows false success or loses focus ${JSON.stringify(cancelAfterInvalid)}`);
      }
      expect(!errors.length,`G6 ${engine.name} ${width}: page errors ${errors.join(' | ')}`);
      await ctx.close();
    }
    await browser.close();
  }
}

/* Owner-approved G3 option A, synthetic-only: once a valid publish RPC starts,
   Cancel/Escape cannot conceal it; success is acknowledged only after the
   confirmed RPC result, and a failure restores editing/Cancel. */
{
  for(const engine of [
    {name:'chromium',launch:()=>chromium.launch({headless:true})},
    {name:'webkit',launch:()=>webkit.launch({headless:true})}
  ]){
    const browser=await engine.launch();
    for(const outcome of ['success','failure','refresh-failure']){
      const{ctx,page,errors}=await open(browser,'owner',{width:390,height:844});
      await page.waitForFunction(()=>{
        const host=document.querySelector('.dc-board-primary.is-visible');
        return document.documentElement.dataset.dcBoardUserState==='OWNER_ADMIN'
          &&host?.dataset.access==='owner-admin'
          &&host.querySelector('button')?.textContent.includes('СОЗДАТЬ')
          &&!!document.getElementById('openComposer');
      },null,{timeout:5000});
      await page.locator('.dc-board-primary.is-visible button').click();
      await page.locator('#entrySection.is-composer-sheet-open').waitFor({state:'visible',timeout:3000});
      await page.locator('#artifactType').selectOption('idea');
      await page.locator('#artifactBody').fill('Synthetic-only publication, never a live Club write.');
      await page.evaluate(()=>{globalThis.__QA_HOLD_PUBLISH__=true});
      // Regression for a *real* browser submit click. Synthetic submit dispatch
      // previously hid the capture/microtask ordering bug that left Cancel active.
      await page.locator('#artifactForm button[type=submit]').click();
      await page.waitForFunction(()=>typeof globalThis.__QA_RESOLVE_PUBLISH__==='function',null,{timeout:4000});
      await page.waitForFunction(()=>document.getElementById('cancelComposer')?.disabled===true,null,{timeout:2000});
      const during=await page.evaluate(()=>({
        modal:document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open'),
        cancelDisabled:document.getElementById('cancelComposer')?.disabled,
        cancelText:document.getElementById('cancelComposer')?.textContent,
        stateRole:document.getElementById('composerState')?.getAttribute('role'),
        dataPending:document.querySelector('#artifactForm')?.dataset.publishInFlight,
        rpcCount:globalThis.__QA_RPC_CALLS__.filter(r=>r.name==='dc_publish_artifact_v1').length
      }));
      expect(during.modal&&during.cancelDisabled&&during.cancelText?.includes('ОТПРАВЛЯЕМ')&&during.stateRole==='status'&&during.dataPending==='1'&&during.rpcCount===1,
        `G6 ${engine.name}/${outcome}: invalid pending state ${JSON.stringify(during)}`);
      // Even a direct click attempt on the disabled Cancel must not close a
      // still-publishing sheet; Escape and duplicate submit must stay blocked.
      await page.locator('#cancelComposer').evaluate(button=>button.click());
      await page.keyboard.press('Escape');
      await page.locator('#artifactForm').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
      const noDuplicate=await page.evaluate(()=>({
        open:document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open'),
        rpcCount:globalThis.__QA_RPC_CALLS__.filter(r=>r.name==='dc_publish_artifact_v1').length,
        toast:!!document.querySelector('.dc-board-toast.is-visible')
      }));
      expect(noDuplicate.open&&noDuplicate.rpcCount===1&&!noDuplicate.toast,
        `G6 ${engine.name}/${outcome}: Escape/duplicate/early toast ${JSON.stringify(noDuplicate)}`);
      if(outcome==='refresh-failure')await page.evaluate(()=>{globalThis.__QA_FAIL_POST_PUBLISH_REFRESH__=true});
      await page.evaluate(ok=>globalThis.__QA_RESOLVE_PUBLISH__(ok),outcome!=='failure');
      if(outcome!=='failure'){
        await page.waitForFunction(()=>!!document.querySelector('.dc-board-toast.is-visible'),null,{timeout:4000});
        await page.waitForFunction(()=>!document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open'),null,{timeout:4000});
        expect(await page.locator('.dc-board-toast.is-visible').count()===1,
          `G6 ${engine.name}: success RPC did not produce exactly one toast`);
        if(outcome==='refresh-failure'){
          // The editor is hidden when a successful publish closes. The recovery
          // instruction must be readable AND live-announced outside that dialog.
          await page.waitForFunction(()=>{
            const toast=document.querySelector('[data-board-toast].is-refresh-warning.is-visible');
            return toast?.textContent?.includes('ДОСКА ПОКА НЕ ОБНОВИЛАСЬ')
              &&Number(getComputedStyle(toast).opacity)>.9;
          },null,{timeout:4000});
          const after=await page.evaluate(()=>{
            const toast=document.querySelector('[data-board-toast].is-refresh-warning.is-visible');
            const rect=toast?.getBoundingClientRect();
            return{
              notice:toast?.textContent||'',
              live:toast?.getAttribute('aria-live'),
              role:toast?.getAttribute('role'),
              visible:!!rect&&rect.width>0&&rect.height>0&&rect.left>=-1&&rect.right<=innerWidth+1,
              outsideClosedComposer:!!toast&&!document.getElementById('entrySection')?.contains(toast),
              hiddenFalseError:document.querySelector('#entryHost')?.textContent?.includes('НЕ ОПУБЛИКОВАНО')||false,
              staleComposer:!!document.querySelector('#entryHost #artifactForm'),
              calls:globalThis.__QA_RPC_CALLS__.filter(r=>r.name==='dc_publish_artifact_v1').length
            };
          });
          expect(after.notice.includes('ПУБЛИКАЦИЯ СОХРАНЕНА')&&after.visible&&after.outsideClosedComposer&&after.role==='status'&&after.live==='polite'&&!after.hiddenFalseError&&!after.staleComposer&&after.calls===1,
            `G6 ${engine.name}: confirmed publish recovery notice hidden or publication misclassified ${JSON.stringify(after)}`);
        }
      }else{
        await page.waitForFunction(()=>document.getElementById('cancelComposer')?.disabled===false&&document.querySelector('#artifactForm button[type=submit]')?.disabled===false,null,{timeout:4000});
        const failed=await page.evaluate(()=>({
          state:document.getElementById('composerState')?.textContent,
          pending:document.querySelector('#artifactForm')?.dataset.publishInFlight,
          toast:!!document.querySelector('.dc-board-toast.is-visible')
        }));
        expect(failed.state==='НЕ ОПУБЛИКОВАНО'&&!failed.pending&&!failed.toast,
          `G6 ${engine.name}: failed publish did not return to editable state ${JSON.stringify(failed)}`);
        await page.locator('#cancelComposer').click();
        await page.waitForFunction(()=>!document.getElementById('entrySection')?.classList.contains('is-composer-sheet-open'),null,{timeout:2500});
      }
      expect(!errors.length,`G6 ${engine.name}/${outcome}: page errors ${errors.join(' | ')}`);
      await ctx.close();
    }
    await browser.close();
  }
}

server.close();if(failures.length){console.error('BOARD V2.1 BROWSER QA BLOCKED');failures.forEach(x=>console.error('- '+x));process.exit(1)}console.log('Board browser QA PASS: guest gated create + member-first monotonic interactions + owner-admin canonical create/moderation/real movement + responsive fullscreen shell');