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
const ideaArtifact={id:'qa-artifact-idea',author_profile_id:other,artifact_type:'idea',title:'ИДЕЯ QA',body:'Idea badge fixture.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-12T09:00:00Z',created_at:'2026-09-12T08:55:00Z'};
const requestArtifact={id:'qa-artifact-request',author_profile_id:other,artifact_type:'request',title:'ЗАПРОС QA',body:'Request badge fixture.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-12T08:00:00Z',created_at:'2026-09-12T07:55:00Z'};
const artifacts=[ownArtifact,otherArtifact,ideaArtifact,requestArtifact];
const profiles=[{profile_id:user.id,display_name:'QA Owner',nickname:'qa',avatar_url:null,member_since:'2026-09-01'},{profile_id:other,display_name:'Other Member',nickname:'other',avatar_url:null,member_since:'2026-09-01'}];
const projections=[
 {entity_id:'entity-program-dnv',entity_type:'program',slug:'dengi-na-veter',title:'ДЕНЬГИ НА ВЕТЕР',status:'active',summary:'Course',source_system:'dementor-club',provenance_status:'confirmed',program_type:'course',delivery_mode:'public',content_summary:'Course'},
 {entity_id:'entity-program-outside',entity_type:'program',slug:'outside-course',title:'ВНЕ ПРОГРАММЫ',status:'active',summary:'Outside Course',source_system:'dementor-club',provenance_status:'confirmed',program_type:'course',delivery_mode:'public',content_summary:'Outside Course'},
 {entity_id:'entity-project-lab',entity_type:'project',slug:'dementor-lab',title:'DEMENTOR LAB',status:'active',summary:'Lab',source_system:'dementor-club',provenance_status:'confirmed'},
 {entity_id:'entity-event-fuengirola',entity_type:'event',slug:'fuengirola',title:'ФУЭНХИРОЛА',status:'planned',summary:'Event',source_system:'dementor-club',provenance_status:'confirmed',event_location:'Fuengirola'},
 {entity_id:'entity-project-outside',entity_type:'project',slug:'outside-lab',title:'DEMENTOR LAB',status:'active',summary:'Same title, different exact identity',source_system:'dementor-club',provenance_status:'confirmed'},
 {entity_id:'entity-practice-outside',entity_type:'program',slug:'outside-practice',title:'ПРАКТИКА QA',status:'active',summary:'Practice',source_system:'dementor-club',provenance_status:'confirmed',program_type:'practice',delivery_mode:'public',content_summary:'Practice'},
 {entity_id:'entity-content-outside',entity_type:'content',slug:'outside-content',title:'КОНТЕНТ QA',status:'active',summary:'Content',source_system:'dementor-club',provenance_status:'confirmed'}
];
const rowsFor=t=>t==='join_applications'?[]:t==='dc_role_assignments'?[]:t==='profiles'?[{id:user.id,full_name:'QA',display_name:'QA'}]:t==='dc_system_memberships'?[{profile_id:user.id,status:'active'}]:t==='dc_artifacts'?artifacts:t==='dc_member_public_profiles'?profiles:t==='dc_artifact_reactions'?[]:t==='dc_artifact_responses'?[]:t==='dc_artifact_media'?[]:t==='dc_artifact_board_positions'?[{artifact_id:ownArtifact.id,board_id:'community',x:1200,y:900,rotation:0,size_class:null,position_version:1},{artifact_id:otherArtifact.id,board_id:'community',x:1700,y:1050,rotation:0,size_class:null,position_version:1},{artifact_id:ideaArtifact.id,board_id:'community',x:2100,y:1250,rotation:0,size_class:null,position_version:1},{artifact_id:requestArtifact.id,board_id:'community',x:2500,y:1450,rotation:0,size_class:null,position_version:1}]:[];
const query=t=>{let rows=[...rowsFor(t)];const q={select(){return q},eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return q},is(){return q},order(){return q},limit(n){rows=rows.slice(0,n);return q},range(){return q},insert(){return q},upsert(){return q},update(){return q},delete(){return q},maybeSingle(){return Promise.resolve({data:rows[0]||null,error:null})},single(){return Promise.resolve({data:rows[0]||null,error:null})},then(resolve,reject){return Promise.resolve({data:rows,error:null}).then(resolve,reject)}};return q};
export function createClient(){return{auth:{getSession:async()=>({data:{session}}),getUser:async()=>({data:{user}}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:query,rpc:async(name)=>{if(name==='dc_member_entry_status_v1')return{data:{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_count:9,sphere_gate_complete:true,artifact_slots_available:0,artifact_slots_consuming:1,published_artifact_count:4},error:null};if(name==='dc_board_entity_projection_read_v1')return{data:projections,error:null};if(name==='dc_board_promotion_state_read_v1')return{data:[],error:null};if(name==='dc_normalize_artifact_lifecycle_v1')return{data:[],error:null};if(name==='dc_guest_board_read_v1')return{data:[],error:null};return{data:[],error:null}},storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22160%22/%3E'}}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{}})})},functions:{invoke:async()=>({data:{}})}}}`;

async function openBoard(browser,viewport){
  const ctx=await browser.newContext({viewport});
  await ctx.addInitScript(()=>{try{localStorage.setItem('dc:board:tutorial:v21:qa-board-user:member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}});
  await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript',body:stub()}):route.abort());
  const page=await ctx.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
  await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:6000});
  await page.waitForFunction(()=>document.querySelectorAll('.dc-notice[data-artifact]').length===4&&document.querySelectorAll('[data-board-source="platform"]').length===7,{timeout:5000});
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

async function boardState(page){
  return page.evaluate(()=>{
    const viewport=document.querySelector('.dc-spatial-viewport')?.getBoundingClientRect();
    const nodes=[...document.querySelectorAll('[data-board-source]')];
    const visible=nodes.filter(node=>!node.hidden&&!node.classList.contains('dc-board-filtered')&&getComputedStyle(node).display!=='none');
    const normalize=node=>node.dataset.thingRef||node.dataset.artifact||node.dataset.sourceId||null;
    const active=[...document.querySelectorAll('[data-board-view].active')].map(node=>node.dataset.boardView);
    const positions=Object.fromEntries(nodes.map(node=>[normalize(node),{left:node.style.left,top:node.style.top}]));
    const rects=visible.map(node=>{const r=node.getBoundingClientRect();return{id:normalize(node),left:r.left,right:r.right,top:r.top,bottom:r.bottom}});
    const pager=document.querySelector('.dc-board-filter-nav [data-pos]')?.textContent?.trim()||'';
    return{
      view:document.documentElement.dataset.boardView||null,
      active,
      visible:visible.map(normalize).sort(),
      positions,
      pager,
      transform:document.querySelector('.dc-spatial-world')?.style.transform||'',
      fit:!!viewport&&rects.every(r=>r.left>=viewport.left-14&&r.right<=viewport.right+14&&r.top>=viewport.top-14&&r.bottom<=viewport.bottom+14),
      overflow:document.documentElement.scrollWidth<=innerWidth+2,
      programStrip:document.querySelector('.dc-board-program')?getComputedStyle(document.querySelector('.dc-board-program')).display:null
    };
  });
}

async function chooseView(page,view){
  if(view==='all'){
    await page.locator('[data-board-view="all"]').click();
  }else{
    const trigger=page.locator('[data-board-filter-drawer]');
    if(await page.locator('.dc-board-filter-drawer').isHidden())await trigger.click();
    const drawer=page.locator('.dc-board-filter-drawer');await drawer.waitFor({state:'visible',timeout:2000});
    const button=drawer.locator(`[data-board-view="${view}"]`);await button.focus();expect(await button.evaluate(el=>document.activeElement===el),`view-${view}: drawer focus did not reach active choice`);
    await button.click();
    await drawer.waitFor({state:'hidden',timeout:2000});
    expect(await trigger.evaluate(el=>document.activeElement===el),`view-${view}: focus did not return to View trigger`);
  }
  await page.waitForTimeout(180);
  return boardState(page);
}

function samePositions(before,after){return JSON.stringify(before)===JSON.stringify(after)}

const expected={
  all:['entity-content-outside','event:fuengirola','program:dengi-na-veter','program:outside-course','program:outside-practice','project:dementor-lab','project:outside-lab','qa-artifact-idea','qa-artifact-other','qa-artifact-own','qa-artifact-request'].sort(),
  'current-program':['event:fuengirola','program:dengi-na-veter','project:dementor-lab'].sort(),
  program:['program:dengi-na-veter','program:outside-course'].sort(),
  project:['project:dementor-lab','project:outside-lab'].sort()
};

const browser=await chromium.launch({headless:true});
try{
  const semanticSnapshots={};
  for(const viewport of [{width:390,height:844,label:'390'},{width:360,height:800,label:'360'},{width:1440,height:900,label:'desktop'}]){
    const{ctx,page,errors}=await openBoard(browser,viewport);
    await page.waitForTimeout(180);
    const initial=await boardState(page);
    expect(initial.view==='all'&&initial.active.length===1&&initial.active[0]==='all',`view-${viewport.label}: initial View is not exactly ВСЁ ${JSON.stringify(initial)}`);
    expect(JSON.stringify(initial.visible)===JSON.stringify(expected.all),`view-${viewport.label}: initial visible set drift ${JSON.stringify(initial.visible)}`);
    expect(initial.fit,`view-${viewport.label}: initial visible set is not camera-fitted`);
    const persisted=initial.positions;

    if(viewport.label!=='desktop')expect(initial.programStrip==='none',`view-${viewport.label}: standalone Current Program strip remains visible`);
    else expect(initial.programStrip!=='none',`view-desktop: standalone Current Program presentation changed`);

    const current=await chooseView(page,'current-program');
    expect(current.view==='current-program'&&current.active.length===1&&current.active[0]==='current-program',`view-${viewport.label}: Current Program is not the single active View ${JSON.stringify(current.active)}`);
    expect(JSON.stringify(current.visible)===JSON.stringify(expected['current-program']),`view-${viewport.label}: exact Current Program set mismatch ${JSON.stringify(current.visible)}`);
    expect(current.fit&&current.pager===`1 / ${expected['current-program'].length}`,`view-${viewport.label}: Current Program camera/pager mismatch ${JSON.stringify({fit:current.fit,pager:current.pager})}`);
    expect(samePositions(persisted,current.positions),`view-${viewport.label}: Current Program fit mutated card coordinates`);

    const programs=await chooseView(page,'program');
    expect(programs.view==='program'&&programs.active.length===1&&programs.active[0]==='program',`view-${viewport.label}: Programs is not the single active View ${JSON.stringify(programs.active)}`);
    expect(JSON.stringify(programs.visible)===JSON.stringify(expected.program),`view-${viewport.label}: Programs set retains stale Current Program condition ${JSON.stringify(programs.visible)}`);
    expect(programs.visible.includes('program:outside-course'),`view-${viewport.label}: non-affiliated Course missing after replacing Current Program View`);
    expect(programs.fit&&programs.pager===`1 / ${expected.program.length}`,`view-${viewport.label}: Programs camera/pager mismatch ${JSON.stringify({fit:programs.fit,pager:programs.pager})}`);
    expect(samePositions(persisted,programs.positions),`view-${viewport.label}: Programs fit mutated card coordinates`);

    const projects=await chooseView(page,'project');
    expect(projects.view==='project'&&projects.active.length===1&&projects.active[0]==='project',`view-${viewport.label}: Projects is not the single active View ${JSON.stringify(projects.active)}`);
    expect(JSON.stringify(projects.visible)===JSON.stringify(expected.project),`view-${viewport.label}: Projects set retains stale Current Program condition ${JSON.stringify(projects.visible)}`);
    expect(projects.visible.includes('project:outside-lab'),`view-${viewport.label}: same-title non-affiliated Project was incorrectly excluded`);
    expect(projects.fit&&projects.pager===`1 / ${expected.project.length}`,`view-${viewport.label}: Projects camera/pager mismatch ${JSON.stringify({fit:projects.fit,pager:projects.pager})}`);
    expect(samePositions(persisted,projects.positions),`view-${viewport.label}: Projects fit mutated card coordinates`);

    const allAgain=await chooseView(page,'all');
    expect(allAgain.view==='all'&&allAgain.active.length===1&&allAgain.active[0]==='all',`view-${viewport.label}: ВСЁ did not fully replace prior View`);
    expect(JSON.stringify(allAgain.visible)===JSON.stringify(expected.all),`view-${viewport.label}: ВСЁ did not restore complete Board ${JSON.stringify(allAgain.visible)}`);
    expect(allAgain.fit&&allAgain.pager===`1 / ${expected.all.length}`,`view-${viewport.label}: ВСЁ camera/pager mismatch ${JSON.stringify({fit:allAgain.fit,pager:allAgain.pager})}`);
    expect(samePositions(persisted,allAgain.positions),`view-${viewport.label}: ВСЁ fit mutated persisted card coordinates`);
    expect(allAgain.overflow,`view-${viewport.label}: horizontal overflow introduced`);

    const badgeState=await page.evaluate(()=>({
      artifact:[...document.querySelectorAll('.dc-notice[data-artifact]')].map(x=>({subtype:x.dataset.artifactSubtype,badges:[...x.querySelectorAll(':scope > .dc-board-badges .dc-board-badge')].map(b=>b.textContent.trim()),program:x.dataset.currentProgram})),
      platform:[...document.querySelectorAll('[data-board-source="platform"]')].map(x=>({ref:x.dataset.thingRef,type:x.dataset.sourceType,badges:[...x.querySelectorAll(':scope > .dc-board-badges .dc-board-badge')].map(b=>b.textContent.trim()),program:x.dataset.currentProgram}))
    }));
    for(const [subtype,label] of [['announcement','ОБЪЯВЛЕНИЕ'],['post','ПОСТ'],['idea','ИДЕЯ'],['request','ЗАПРОС']])expect(badgeState.artifact.some(x=>x.subtype===subtype&&x.badges.includes(label)),`badge-${viewport.label}: Artifact ${label} missing ${JSON.stringify(badgeState.artifact)}`);
    expect(badgeState.artifact.every(x=>x.program==='0'&&!x.badges.includes('В ПРОГРАММЕ')),`badge-${viewport.label}: Artifact received false Program affiliation`);
    expect(badgeState.platform.some(x=>x.ref==='event:fuengirola'&&x.badges.includes('СОБЫТИЕ')),`badge-${viewport.label}: event badge missing`);
    expect(badgeState.platform.some(x=>x.ref==='program:dengi-na-veter'&&x.badges.includes('КУРС / ПРОГРАММА')),`badge-${viewport.label}: program badge missing`);
    expect(badgeState.platform.some(x=>x.ref==='program:outside-practice'&&x.badges.includes('ПРАКТИКА')),`badge-${viewport.label}: practice badge missing`);
    expect(badgeState.platform.some(x=>x.ref==='project:dementor-lab'&&x.badges.includes('ПРОЕКТ / ПРОДУКТ')),`badge-${viewport.label}: project badge missing`);
    expect(badgeState.platform.some(x=>x.type==='content'&&x.badges.includes('СТАТЬЯ / КОНТЕНТ')),`badge-${viewport.label}: content badge missing`);
    const falsePositive=badgeState.platform.find(x=>x.ref==='project:outside-lab');
    expect(falsePositive?.program==='0'&&!falsePositive?.badges.includes('В ПРОГРАММЕ'),`badge-${viewport.label}: same-title false positive received Program badge`);

    await chooseView(page,'project');
    await page.locator('[data-mine]').click();await page.waitForTimeout(100);
    const mine=await boardState(page);
    expect(mine.view==='all'&&mine.active.length===1&&mine.active[0]==='all',`mine-${viewport.label}: МОЁ established a hidden/persistent filter state ${JSON.stringify(mine.active)}`);
    expect(JSON.stringify(mine.visible)===JSON.stringify(expected.all),`mine-${viewport.label}: МОЁ did not reveal Board through canonical ВСЁ View`);
    expect(await page.locator('.dc-notice[data-artifact="qa-artifact-own"]').evaluate(el=>el.classList.contains('is-camera-focus')),`mine-${viewport.label}: own Artifact was not camera-focused`);

    const visibleBeforeRelations=(await boardState(page)).visible;
    const relationToggle=page.locator('[data-relations-toggle]');
    if(await relationToggle.count()){
      await relationToggle.click();await page.waitForTimeout(60);
      const afterHide=(await boardState(page)).visible;
      await relationToggle.click();await page.waitForTimeout(60);
      const afterShow=(await boardState(page)).visible;
      expect(JSON.stringify(afterHide)===JSON.stringify(visibleBeforeRelations)&&JSON.stringify(afterShow)===JSON.stringify(visibleBeforeRelations),`relations-${viewport.label}: relation presentation changed visible Thing set`);
    }

    const zoomBefore=(await boardState(page)).transform;
    await page.locator('[data-zoom-in]').click();await page.waitForTimeout(60);
    const zoomAfter=(await boardState(page)).transform;
    expect(zoomAfter!==zoomBefore,`zoom-${viewport.label}: pan/zoom freedom did not resume after View fit`);
    await page.locator('[data-zoom-out]').click();

    if(viewport.label!=='desktop'){
      const nav=page.locator('.dc-board-filter-nav');expect(await nav.locator('[data-pos]').innerText()===`1 / ${expected.all.length}`,`pager-${viewport.label}: pager does not reflect restored visible set`);
    }

    semanticSnapshots[viewport.label]={current:current.visible,programs:programs.visible,projects:projects.visible,all:allAgain.visible};

    const card='.dc-notice[data-artifact="qa-artifact-own"]';
    await setImage(page,card,320,160);const landscape=await metrics(page,card);
    await setImage(page,card,160,320);const portrait=await metrics(page,card);
    expect(landscape.img&&portrait.img,`media-${viewport.label}: image metrics missing`);
    expect(landscape.img.ratio>1.7&&portrait.img.ratio<.7,`media-${viewport.label}: source media proportions drifted`);
    expect(portrait.img.h>landscape.img.h,`media-${viewport.label}: portrait does not create taller visual`);
    expect(landscape.img.objectFit==='contain'&&portrait.img.objectFit==='contain',`media-${viewport.label}: media is still crop-owned`);
    expect(!errors.length,`board-${viewport.label}: ${errors.join(' | ')}`);
    await ctx.close();
  }

  expect(JSON.stringify(semanticSnapshots['390'])===JSON.stringify(semanticSnapshots['360'])&&JSON.stringify(semanticSnapshots['390'])===JSON.stringify(semanticSnapshots.desktop),`cross-device: Board View semantics differ across 390/360/desktop ${JSON.stringify(semanticSnapshots)}`);
}finally{await browser.close();server.close()}

if(failures.length){console.error(`Board navigation/adaptive cards acceptance failed (${failures.length})`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Board navigation/adaptive cards browser acceptance passed: one-active View sequence on 390/360/desktop + exact Program identity + camera fit/pager/coordinate invariance + canonical badges + МОЁ locator + relations-visible-set invariance + adaptive media');
