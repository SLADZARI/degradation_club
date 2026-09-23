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
      cameraStatus:document.querySelector('.dc-spatial-status')?.textContent?.trim()||'',
      fit:!!viewport&&rects.every(r=>r.left>=viewport.left-14&&r.right<=viewport.right+14&&r.top>=viewport.top-14&&r.bottom<=viewport.bottom+14),
      overflow:document.documentElement.scrollWidth<=innerWidth+2,
      programStrip:document.querySelector('.dc-board-program')?getComputedStyle(document.querySelector('.dc-board-program')).display:null
    };
  });
}

async function pagerSnapshot(page){
  return page.evaluate(()=>{
    const normalize=node=>node?.dataset?.thingRef||node?.dataset?.artifact||node?.dataset?.sourceId||null;
    const visible=[...document.querySelectorAll('[data-board-source]')].filter(node=>!node.hidden&&!node.classList.contains('dc-board-filtered')&&getComputedStyle(node).display!=='none');
    const focused=visible.find(node=>node.classList.contains('dc-board-focus-step'))||null;
    const viewport=document.querySelector('.dc-spatial-viewport')?.getBoundingClientRect();
    const focusedRect=focused?.getBoundingClientRect();
    const positions=Object.fromEntries(visible.map(node=>[normalize(node),{left:node.style.left,top:node.style.top}]));
    return{
      order:visible.map(normalize),
      pager:document.querySelector('.dc-board-filter-nav [data-pos]')?.textContent?.trim()||'',
      transform:document.querySelector('.dc-spatial-world')?.style.transform||'',
      cameraStatus:document.querySelector('.dc-spatial-status')?.textContent?.trim()||'',
      focused:normalize(focused),
      centered:!!viewport&&!!focusedRect&&Math.abs((focusedRect.left+focusedRect.right)/2-(viewport.left+viewport.right)/2)<=3&&Math.abs((focusedRect.top+focusedRect.bottom)/2-(viewport.top+viewport.bottom)/2)<=3,
      positions
    };
  });
}

async function panBoard(page){
  const point=await page.evaluate(()=>{
    const viewport=document.querySelector('.dc-spatial-viewport')?.getBoundingClientRect();if(!viewport)return null;
    const blocked=node=>node?.closest?.('.dc-notice,.dc-projection,.dc-spatial-controls,.dc-board-filters-v2,.dc-board-program,a,button,input,textarea,dialog');
    const xs=[.08,.15,.85,.92,.5],ys=[.3,.5,.7,.88];
    for(const xf of xs)for(const yf of ys){
      const x=viewport.left+viewport.width*xf,y=viewport.top+viewport.height*yf;
      const node=document.elementFromPoint(x,y);if(node&&!blocked(node))return{x,y};
    }
    return null;
  });
  if(!point)return{found:false,before:'',after:''};
  const before=await page.locator('.dc-spatial-world').evaluate(el=>el.style.transform);
  await page.mouse.move(point.x,point.y);
  await page.mouse.down();
  await page.mouse.move(point.x+54,point.y+31,{steps:5});
  await page.mouse.up();
  await page.waitForTimeout(60);
  const after=await page.locator('.dc-spatial-world').evaluate(el=>el.style.transform);
  return{found:true,before,after};
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
    else{
      expect(initial.programStrip!=='none',`view-desktop: standalone Current Program presentation changed`);
      const trigger=page.locator('[data-board-filter-drawer]');await trigger.click();
      const drawer=page.locator('.dc-board-filter-drawer');await drawer.waitFor({state:'visible',timeout:2000});
      const layering=await page.evaluate(()=>{
        const viewport=document.querySelector('.dc-spatial-viewport'),filters=document.getElementById('boardFilters'),program=document.getElementById('boardProgramHost'),drawer=document.querySelector('.dc-board-filter-drawer');
        const d=drawer?.getBoundingClientRect(),p=program?.getBoundingClientRect();
        const left=Math.max(d?.left||0,p?.left||0),right=Math.min(d?.right||0,p?.right||0),top=Math.max(d?.top||0,p?.top||0),bottom=Math.min(d?.bottom||0,p?.bottom||0);
        const overlaps=right-left>8&&bottom-top>8;const x=left+Math.max(4,(right-left)/2),y=top+Math.max(4,(bottom-top)/2);const topNode=overlaps?document.elementFromPoint(x,y):null;
        return{sameViewport:filters?.parentElement===viewport&&program?.parentElement===viewport,overlaps,drawerOwnsPoint:!!topNode&&drawer.contains(topNode),drawerZ:getComputedStyle(filters).zIndex,programZ:getComputedStyle(program).zIndex};
      });
      expect(layering.sameViewport,`desktop layering: filters and Current Program are not in the same fullscreen viewport composition ${JSON.stringify(layering)}`);
      expect(layering.overlaps,`desktop layering: QA fixture did not reproduce drawer/Program overlap ${JSON.stringify(layering)}`);
      expect(layering.drawerOwnsPoint,`desktop layering: Current Program pointer-wise covers the open View drawer ${JSON.stringify(layering)}`);
      const paintOrder=await page.evaluate(()=>{
        const viewport=document.querySelector('.dc-spatial-viewport');
        const filters=document.getElementById('boardFilters');
        const programHost=document.getElementById('boardProgramHost');
        const program=document.querySelector('.dc-board-program');
        const drawer=document.querySelector('.dc-board-filter-drawer');
        const children=[...(viewport?.children||[])];
        const number=value=>{const n=Number.parseInt(value,10);return Number.isFinite(n)?n:0};
        return{
          programBeforeFilters:children.indexOf(programHost)>=0&&children.indexOf(filters)>=0&&children.indexOf(programHost)<children.indexOf(filters),
          filtersZ:number(filters?getComputedStyle(filters).zIndex:0),
          programZ:number(program?getComputedStyle(program).zIndex:0),
          drawerZ:number(drawer?getComputedStyle(drawer).zIndex:0)
        };
      });
      expect(paintOrder.programBeforeFilters,`desktop layering: DOM paint-order fallback does not keep Program before View controls ${JSON.stringify(paintOrder)}`);
      expect(paintOrder.filtersZ>paintOrder.programZ,`desktop layering: View controls stacking level is not above Current Program ${JSON.stringify(paintOrder)}`);
      expect(paintOrder.drawerZ>paintOrder.programZ,`desktop layering: open drawer stacking level is not above Current Program ${JSON.stringify(paintOrder)}`);
      await drawer.locator('[data-filter-close]').click();await drawer.waitFor({state:'hidden',timeout:2000});
    }

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

    // Live pager corrective: UI/index owner must delegate movement to canonical spatial camera owner.
    const nav=page.locator('.dc-board-filter-nav');
    const pagerStart=await pagerSnapshot(page);
    const pagerTotal=pagerStart.order.length;
    expect(pagerTotal>=3,`pager-${viewport.label}: fixture needs at least 3 visible cards, got ${pagerTotal}`);
    expect(pagerStart.pager===`1 / ${pagerTotal}`,`pager-${viewport.label}: expected start 1 / N, got ${pagerStart.pager}`);
    const pagerPositions=pagerStart.positions;
    await page.evaluate(()=>{
      globalThis.__DC_PAGER_QA_TRACE=[];
      const push=(kind,detail=null)=>globalThis.__DC_PAGER_QA_TRACE.push({t:Math.round(performance.now()),kind,detail});
      for(const name of ['dc:board-user-navigation','dc:board-request-view','dc:board-filter-changed','dc:board-view-changed','dc:board-focus-target','dc:board-layout-request','dc:board-layout-updated','dc:board-projections-updated']){
        window.addEventListener(name,event=>push(name,event.detail||null));
      }
      document.addEventListener('click',event=>{
        if(event.target?.closest?.('[data-mine]'))push('mine-click',{trusted:event.isTrusted,target:event.target?.outerHTML||''});
        if(event.target?.closest?.('[data-prev],[data-next]'))push('pager-click',{trusted:event.isTrusted,target:event.target?.outerHTML||''});
      },true);
      const pos=document.querySelector('.dc-board-filter-nav [data-pos]');
      if(pos)new MutationObserver(()=>push('pager-text',pos.textContent?.trim()||'')).observe(pos,{childList:true,subtree:true,characterData:true});
      const world=document.querySelector('.dc-spatial-world');
      if(world)new MutationObserver(()=>push('camera-transform',world.style.transform||'')).observe(world,{attributes:true,attributeFilter:['style']});
    });

    await nav.locator('[data-next]').click();await page.waitForTimeout(90);
    const pager2=await pagerSnapshot(page);
    expect(pager2.pager===`2 / ${pagerTotal}`,`pager-${viewport.label}: → did not advance counter to 2 / N (${pager2.pager})`);
    expect(pager2.focused===pagerStart.order[1],`pager-${viewport.label}: → did not focus target #2 ${JSON.stringify({expected:pagerStart.order[1],actual:pager2.focused})}`);
    expect(pager2.centered,`pager-${viewport.label}: target #2 is not centered by canonical camera`);
    expect(pager2.transform!==pagerStart.transform&&pager2.cameraStatus!==pagerStart.cameraStatus,`pager-${viewport.label}: → changed pager index without canonical camera movement`);

    await nav.locator('[data-next]').click();await page.waitForTimeout(90);
    const pager3=await pagerSnapshot(page);
    expect(pager3.pager===`3 / ${pagerTotal}`,`pager-${viewport.label}: second → did not advance to 3 / N (${pager3.pager})`);
    expect(pager3.focused===pagerStart.order[2]&&pager3.centered,`pager-${viewport.label}: second → did not focus/center target #3 ${JSON.stringify({expected:pagerStart.order[2],actual:pager3.focused,centered:pager3.centered})}`);
    expect(pager3.transform!==pager2.transform&&pager3.cameraStatus!==pager2.cameraStatus,`pager-${viewport.label}: target #3 did not move canonical camera`);

    await nav.locator('[data-prev]').click();await page.waitForTimeout(90);
    const pagerBack2=await pagerSnapshot(page);
    expect(pagerBack2.pager===`2 / ${pagerTotal}`,`pager-${viewport.label}: ← did not return to 2 / N (${pagerBack2.pager})`);
    expect(pagerBack2.focused===pagerStart.order[1]&&pagerBack2.centered,`pager-${viewport.label}: ← did not focus/center target #2`);

    // 1/N → ← → N/N and N/N → → → 1/N.
    await nav.locator('[data-prev]').click();await page.waitForTimeout(70);
    const pager1=await pagerSnapshot(page);
    expect(pager1.pager===`1 / ${pagerTotal}`&&pager1.focused===pagerStart.order[0],`pager-${viewport.label}: expected return to 1 / N before wrap ${JSON.stringify(pager1)}`);
    await nav.locator('[data-prev]').click();await page.waitForTimeout(90);
    const pagerWrapN=await pagerSnapshot(page);
    expect(pagerWrapN.pager===`${pagerTotal} / ${pagerTotal}`,`pager-${viewport.label}: 1 / N ← did not wrap to N / N (${pagerWrapN.pager})`);
    expect(pagerWrapN.focused===pagerStart.order[pagerTotal-1]&&pagerWrapN.centered,`pager-${viewport.label}: backward wrap did not focus/center last card`);
    await nav.locator('[data-next]').click();await page.waitForTimeout(90);
    const pagerWrap1=await pagerSnapshot(page);
    expect(pagerWrap1.pager===`1 / ${pagerTotal}`,`pager-${viewport.label}: N / N → did not wrap to 1 / N (${pagerWrap1.pager})`);
    expect(pagerWrap1.focused===pagerStart.order[0]&&pagerWrap1.centered,`pager-${viewport.label}: forward wrap did not focus/center first card`);
    expect(samePositions(pagerPositions,pagerWrap1.positions),`pager-${viewport.label}: pager navigation mutated persisted card coordinates`);
    const pagerTrace=await page.evaluate(()=>globalThis.__DC_PAGER_QA_TRACE||[]);
    console.log(`PAGER_QA_TRACE ${viewport.label} ${JSON.stringify(pagerTrace)}`);

    // View semantics must remain composable after pager camera navigation.
    const afterPagerProgram=await chooseView(page,'current-program');
    expect(JSON.stringify(afterPagerProgram.visible)===JSON.stringify(expected['current-program']),`pager-${viewport.label}: Current Program View failed after pager navigation`);
    const afterPagerAll=await chooseView(page,'all');
    expect(JSON.stringify(afterPagerAll.visible)===JSON.stringify(expected.all)&&afterPagerAll.pager===`1 / ${pagerTotal}`,`pager-${viewport.label}: ВСЁ failed to restore Board/pager after pager navigation`);
    expect(samePositions(persisted,afterPagerAll.positions),`pager-${viewport.label}: View switch after pager mutated persisted coordinates`);

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
    expect(zoomAfter!==zoomBefore,`zoom-${viewport.label}: zoom did not remain free after pager/View camera movement`);
    await page.locator('[data-zoom-out]').click();
    const pan=await panBoard(page);
    expect(pan.found,`pan-${viewport.label}: could not locate empty spatial background for pan regression`);
    expect(!pan.found||pan.after!==pan.before,`pan-${viewport.label}: pan did not move canonical camera after pager navigation`);

    // Drag remains owned by spatial runtime and still works after pager camera navigation.
    const own=page.locator('.dc-notice[data-artifact="qa-artifact-own"]');
    expect(await own.evaluate(el=>el.classList.contains('is-own-movable')||el.classList.contains('is-admin-movable')),`drag-${viewport.label}: own card is not movable in QA fixture`);
    const dragBefore=await own.evaluate(el=>({left:el.style.left,top:el.style.top}));
    const ownRect=await own.boundingBox();
    if(ownRect){
      await page.mouse.move(ownRect.x+ownRect.width*.5,ownRect.y+Math.min(42,ownRect.height*.35));
      await page.mouse.down();
      await page.mouse.move(ownRect.x+ownRect.width*.5+36,ownRect.y+Math.min(42,ownRect.height*.35)+24,{steps:5});
      await page.mouse.up();
      await page.waitForTimeout(90);
    }
    const dragAfter=await own.evaluate(el=>({left:el.style.left,top:el.style.top,justDragged:Number(el.dataset.boardJustDragged||0)}));
    expect(!!ownRect&&(dragAfter.left!==dragBefore.left||dragAfter.top!==dragBefore.top),`drag-${viewport.label}: own card did not move after pager navigation ${JSON.stringify({dragBefore,dragAfter})}`);
    expect(dragAfter.justDragged>Date.now()-2000,`drag-${viewport.label}: drag marker not recorded after move`);
    expect(await page.evaluate(()=>{const overlay=document.querySelector('.dc-artifact-overlay');return !overlay||overlay.hidden}),`drag-${viewport.label}: drag incorrectly opened Artifact overlay`);

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

  // Owner live-QA viewport: wide desktop must preserve the same paint order.
  {
    const{ctx,page,errors}=await openBoard(browser,{width:2560,height:1080,label:'wide-desktop'});
    const trigger=page.locator('[data-board-filter-drawer]');await trigger.click();
    const drawer=page.locator('.dc-board-filter-drawer');await drawer.waitFor({state:'visible',timeout:2000});
    const wide=await page.evaluate(()=>{
      const viewport=document.querySelector('.dc-spatial-viewport');
      const filters=document.getElementById('boardFilters');
      const programHost=document.getElementById('boardProgramHost');
      const program=document.querySelector('.dc-board-program');
      const drawer=document.querySelector('.dc-board-filter-drawer');
      const children=[...(viewport?.children||[])];
      const number=value=>{const n=Number.parseInt(value,10);return Number.isFinite(n)?n:0};
      const d=drawer?.getBoundingClientRect(),p=program?.getBoundingClientRect();
      return{
        sameViewport:filters?.parentElement===viewport&&programHost?.parentElement===viewport,
        programBeforeFilters:children.indexOf(programHost)>=0&&children.indexOf(filters)>=0&&children.indexOf(programHost)<children.indexOf(filters),
        filtersZ:number(filters?getComputedStyle(filters).zIndex:0),
        programZ:number(program?getComputedStyle(program).zIndex:0),
        drawerZ:number(drawer?getComputedStyle(drawer).zIndex:0),
        overlaps:!!d&&!!p&&Math.min(d.right,p.right)-Math.max(d.left,p.left)>8&&Math.min(d.bottom,p.bottom)-Math.max(d.top,p.top)>8
      };
    });
    expect(wide.sameViewport&&wide.programBeforeFilters,`wide desktop layering: Program/filters composition order drifted ${JSON.stringify(wide)}`);
    expect(wide.filtersZ>wide.programZ&&wide.drawerZ>wide.programZ,`wide desktop layering: drawer is not painted above Current Program ${JSON.stringify(wide)}`);
    expect(wide.overlaps,`wide desktop layering: fixture did not reproduce owner overlap geometry ${JSON.stringify(wide)}`);
    expect(!errors.length,`wide desktop layering: ${errors.join(' | ')}`);
    await ctx.close();
  }
}finally{await browser.close();server.close()}

if(failures.length){console.error(`Board navigation/adaptive cards acceptance failed (${failures.length})`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Board navigation/adaptive cards browser acceptance passed: real pager →/←/wrap on 390/360/desktop delegates to canonical spatial camera + target centering/camera state + one-active View + Program + zoom/pan/drag + pager coordinate invariance + relations + stale-focus companion regression + adaptive media');
