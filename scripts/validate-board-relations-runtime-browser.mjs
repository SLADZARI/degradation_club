import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const outDir=path.join(process.cwd(),'.qa','board-relations-v1');
fs.mkdirSync(outDir,{recursive:true});
const failures=[];
const expect=(ok,message)=>{if(!ok)failures.push(message)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};

function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(/^\/community\/artifact\/[^/]+\/?$/.test(pathname))pathname='/community/artifact/index.html';
  else if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));return full.startsWith(path.resolve(artifact))?full:null;
}
const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
  res.statusCode=200;res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;

const stub=()=>`
const mode=globalThis.__QA_RELATION_MODE__||'available';
globalThis.__QA_RPC_CALLS__=globalThis.__QA_RPC_CALLS__||[];
globalThis.__QA_DB_WRITES__=globalThis.__QA_DB_WRITES__||[];
globalThis.__QA_RELATION_REJECT__=globalThis.__QA_RELATION_REJECT__||false;
const user={id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',email:'qa@invalid',user_metadata:{full_name:'QA Dementor'}};
const other='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const session={user};
const ownId='11111111-1111-4111-8111-111111111111';
const otherId='22222222-2222-4222-8222-222222222222';
const eventEntity='33333333-3333-4333-8333-333333333333';
const courseEntity='44444444-4444-4444-8444-444444444444';
const practiceEntity='55555555-5555-4555-8555-555555555555';
const projectEntity='66666666-6666-4666-8666-666666666666';
const ownArtifact={id:ownId,author_profile_id:user.id,artifact_type:'announcement',title:'OWN ARTIFACT',body:'Artifact relation fixture.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-18T06:00:00Z',closed_at:null,created_at:'2026-09-18T05:55:00Z'};
const otherArtifact={id:otherId,author_profile_id:other,artifact_type:'post',title:'OTHER ARTIFACT',body:'Second Artifact relation fixture.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-18T05:00:00Z',closed_at:null,created_at:'2026-09-18T04:55:00Z'};
const artifacts=[ownArtifact,otherArtifact];
const profiles=[{profile_id:user.id,display_name:'QA Dementor',nickname:'qa',avatar_url:null,member_since:'2026-09-01'},{profile_id:other,display_name:'Other Member',nickname:'other',avatar_url:null,member_since:'2026-09-01'}];
const positions=[{artifact_id:ownId,board_id:'community',x:1700,y:1450,rotation:0,size_class:'S',position_version:1},{artifact_id:otherId,board_id:'community',x:2350,y:1700,rotation:0,size_class:'S',position_version:1}];
const projections=[
 {entity_id:eventEntity,entity_type:'event',slug:'qa-event',title:'QA EVENT',status:'announced',summary:'Event relation fixture.',source_system:'dementor-club',provenance_status:'confirmed',event_location:'QA LAB',event_capacity:20,program_type:null,delivery_mode:null,content_summary:null},
 {entity_id:courseEntity,entity_type:'program',slug:'qa-course',title:'QA COURSE',status:'active',summary:'Course relation fixture.',source_system:'dementor-club',provenance_status:'confirmed',event_location:null,event_capacity:null,program_type:'course',delivery_mode:'self_paced',content_summary:'Course content'},
 {entity_id:practiceEntity,entity_type:'program',slug:'qa-practice',title:'QA PRACTICE',status:'active',summary:'Practice relation fixture.',source_system:'dementor-club',provenance_status:'confirmed',event_location:null,event_capacity:null,program_type:'practice',delivery_mode:'recurring',content_summary:'Practice content'},
 {entity_id:projectEntity,entity_type:'project',slug:'qa-project',title:'QA PROJECT',status:'active',summary:'Unsupported relation endpoint fixture.',source_system:'dementor-club',provenance_status:'confirmed',event_location:null,event_capacity:null,program_type:null,delivery_mode:null,content_summary:null}
];
let relationRows=[
 {relation_id:'77777777-7777-4777-8777-777777777771',relation_type:'RELATED_TO',origin_kind:'artifact',origin_source_id:ownId,target_kind:'event',target_source_id:'qa-event',created_at:'2026-09-18T07:00:00Z',can_delete:true},
 {relation_id:'77777777-7777-4777-8777-777777777772',relation_type:'ABOUT',origin_kind:'artifact',origin_source_id:ownId,target_kind:'program',target_source_id:'qa-course',created_at:'2026-09-18T07:01:00Z',can_delete:true},
 {relation_id:'77777777-7777-4777-8777-777777777773',relation_type:'CONTINUES',origin_kind:'program',origin_source_id:'qa-course',target_kind:'program',target_source_id:'qa-practice',created_at:'2026-09-18T07:02:00Z',can_delete:true}
];
const roleRows=[{profile_id:user.id,role:'dementor',scope_type:'system',status:'active',valid_from:'2026-09-01T00:00:00Z',valid_to:null,provenance_status:'confirmed'}];
const assignmentRows=[
 {profile_id:user.id,entity_id:eventEntity,role:'dementor',status:'active',valid_from:'2026-09-01T00:00:00Z',valid_to:null,provenance_status:'confirmed'},
 {profile_id:user.id,entity_id:courseEntity,role:'dementor',status:'active',valid_from:'2026-09-01T00:00:00Z',valid_to:null,provenance_status:'confirmed'}
];
const rowsFor=t=>t==='join_applications'?[]
 :t==='dc_role_assignments'?roleRows
 :t==='dc_entity_assignments'?assignmentRows
 :t==='profiles'?[{id:user.id,full_name:'QA Dementor',display_name:'QA Dementor'}]
 :t==='dc_system_memberships'?[{profile_id:user.id,status:'active',valid_from:'2026-09-01T00:00:00Z',valid_to:null}]
 :t==='dc_artifacts'?artifacts
 :t==='dc_member_public_profiles'?profiles
 :t==='dc_artifact_reactions'?[]
 :t==='dc_artifact_responses'?[]
 :t==='dc_artifact_media'?[]
 :t==='dc_artifact_board_positions'?positions
 :[];
const query=t=>{
  let rows=[...rowsFor(t)],updatePayload=null;
  const q={
    select(){return q},
    eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},
    neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},
    in(k,values){rows=rows.filter(r=>values.includes(r?.[k]));return q},
    is(k,v){rows=rows.filter(r=>r?.[k]===v||r?.[k]==null&&v==null);return q},
    order(){return q},limit(n){rows=rows.slice(0,n);return q},range(){return q},
    insert(payload){globalThis.__QA_DB_WRITES__.push({op:'insert',table:t,payload});return q},
    upsert(payload){globalThis.__QA_DB_WRITES__.push({op:'upsert',table:t,payload});return q},
    update(payload){updatePayload=payload;globalThis.__QA_DB_WRITES__.push({op:'update',table:t,payload});return q},
    delete(){globalThis.__QA_DB_WRITES__.push({op:'delete',table:t});return q},
    maybeSingle(){const row=rows[0]||null;return Promise.resolve({data:row&&updatePayload?{...row,...updatePayload}:row,error:null})},
    single(){const row=rows[0]||null;return Promise.resolve({data:row&&updatePayload?{...row,...updatePayload}:row,error:null})},
    then(resolve,reject){return Promise.resolve({data:rows.map(row=>updatePayload?{...row,...updatePayload}:row),error:null}).then(resolve,reject)}
  };return q;
};
export function createClient(){return{
 auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user},error:null}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},
 from:query,
 rpc:async(name,args)=>{
  globalThis.__QA_RPC_CALLS__.push({name,args});
  if(name==='dc_member_entry_status_v1')return{data:{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_count:9,sphere_gate_complete:true,artifact_slots_available:0,artifact_slots_consuming:1,published_artifact_count:2},error:null};
  if(name==='dc_board_entity_projection_read_v1')return{data:projections,error:null};
  if(name==='dc_board_promotion_state_read_v1')return{data:[],error:null};
  if(name==='dc_normalize_artifact_lifecycle_v1')return{data:0,error:null};
  if(name==='dc_guest_board_read_v1')return{data:[],error:null};
  if(name==='dc_board_relations_read_v1'){
    if(mode==='unavailable')return{data:null,error:{message:'Could not find function public.dc_board_relations_read_v1'}};
    if(mode==='invalid-kind')return{data:[{relation_id:'bad-kind',relation_type:'RELATED_TO',origin_kind:'project',origin_source_id:'qa-project',target_kind:'artifact',target_source_id:ownId,created_at:'2026-09-18T07:00:00Z'}],error:null};
    if(mode==='invalid-pair')return{data:[{relation_id:'bad-pair',relation_type:'REPORT_OF',origin_kind:'program',origin_source_id:'qa-course',target_kind:'artifact',target_source_id:ownId,created_at:'2026-09-18T07:00:00Z'}],error:null};
    return{data:relationRows.map(row=>({...row})),error:null};
  }
  if(name==='dc_board_relation_create_v1'){
    if(globalThis.__QA_RELATION_REJECT__)return{data:null,error:{message:'RELATION_WRITE_FORBIDDEN',code:'42501'}};
    const id='88888888-8888-4888-8888-'+String(relationRows.length+1).padStart(12,'8');
    relationRows.push({relation_id:id,relation_type:args.p_relation_type,origin_kind:args.p_origin_kind,origin_source_id:args.p_origin_source_id,target_kind:args.p_target_kind,target_source_id:args.p_target_source_id,created_at:new Date().toISOString(),can_delete:true});
    return{data:id,error:null};
  }
  if(name==='dc_board_relation_delete_v1'){
    relationRows=relationRows.filter(row=>row.relation_id!==args.p_relation_id);
    return{data:args.p_relation_id,error:null};
  }
  if(name==='dc_close_artifact_v1')return{data:{artifact_id:args?.p_artifact_id,status:'archived'},error:null};
  return{data:[],error:null};
 },
 storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22160%22/%3E'},error:null}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{},error:null})})},
 functions:{invoke:async()=>({data:{},error:null})}
}};`;

async function openBoard(browser,mode,viewport){
  const ctx=await browser.newContext({viewport});
  await ctx.addInitScript(mode=>{
    globalThis.__QA_RELATION_MODE__=mode;
    globalThis.__QA_RPC_CALLS__=[];
    globalThis.__QA_DB_WRITES__=[];
    globalThis.__QA_RELATION_REJECT__=false;
    try{
      localStorage.setItem('dc:board:tutorial:v21:aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa:member',JSON.stringify({done:true}));
      sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1');
    }catch{}
  },mode);
  await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript',body:stub()}):route.abort());
  const page=await ctx.newPage();const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
  await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:7000});
  await page.waitForFunction(()=>document.querySelectorAll('.dc-notice[data-artifact]').length>=2,{timeout:6000});
  await page.waitForFunction(()=>document.querySelectorAll('[data-board-source="platform"]').length>=4,{timeout:6000});
  await page.waitForFunction(()=>['ready','unavailable'].includes(document.documentElement.dataset.dcBoardRelations||''),{timeout:6000});
  return{ctx,page,errors};
}
async function rpcCalls(page,name){return page.evaluate(name=>(globalThis.__QA_RPC_CALLS__||[]).filter(call=>call.name===name),name)}
async function positionWriteCount(page){return page.evaluate(()=>(globalThis.__QA_DB_WRITES__||[]).filter(write=>write.op==='update'&&write.table==='dc_artifact_board_positions').length)}
async function lineCoords(page,id){return page.locator(`.dc-board-relation-line[data-relation-id="${id}"]`).evaluate(line=>({x1:Number(line.getAttribute('x1')),y1:Number(line.getAttribute('y1')),x2:Number(line.getAttribute('x2')),y2:Number(line.getAttribute('y2'))}))}

const browser=await chromium.launch({headless:true});
try{
  // Sequential desktop acceptance on canonical Board.
  {
    const{ctx,page,errors}=await openBoard(browser,'available',{width:1440,height:900});
    await page.evaluate(()=>{
      globalThis.__QA_RELATION_UI_EVENTS__=[];
      document.addEventListener('click',event=>{
        const card=event.target.closest?.('.dc-notice[data-artifact]');
        if(!card)return;
        globalThis.__QA_RELATION_UI_EVENTS__.push({
          type:'click',
          artifact:card.dataset.artifact||null,
          dragged:card.dataset.boardJustDragged||null,
          delta:card.dataset.boardJustDragged?Date.now()-Number(card.dataset.boardJustDragged):null,
          target:event.target?.tagName||null,
          targetClass:event.target?.className||null,
          overlay:document.documentElement.dataset.boardArtifactOpen||null
        });
      },true);
      window.addEventListener('dc:board-focus-target',event=>{
        globalThis.__QA_RELATION_UI_EVENTS__.push({
          type:'focus-target',
          artifact:event.detail?.node?.dataset?.artifact||null,
          open:event.detail?.open??null
        });
      });
    });
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:5000});

    const mapping=await page.evaluate(()=>{
      const pick=selector=>{const el=document.querySelector(selector);return el?{sourceId:el.dataset.sourceId||null,sourceType:el.dataset.sourceType||null,relationKind:el.dataset.relationKind||null,relationSourceId:el.dataset.relationSourceId||null}:null};
      return{
        artifact:pick('.dc-notice[data-artifact-owned="1"]'),
        event:pick('[data-board-source="platform"][data-source-type="event"]'),
        course:pick('[data-board-source="platform"][data-source-type="course"]'),
        practice:pick('[data-board-source="platform"][data-source-type="practice"]'),
        project:pick('[data-board-source="platform"][data-source-type="project"]')
      };
    });
    expect(mapping.artifact?.relationKind==='artifact'&&mapping.artifact?.relationSourceId==='11111111-1111-4111-8111-111111111111',`desktop mapping: Artifact canonical UUID missing ${JSON.stringify(mapping.artifact)}`);
    expect(mapping.event?.sourceId==='33333333-3333-4333-8333-333333333333'&&mapping.event?.relationKind==='event'&&mapping.event?.relationSourceId==='qa-event',`desktop mapping: Event projection drift ${JSON.stringify(mapping.event)}`);
    expect(mapping.course?.sourceType==='course'&&mapping.course?.relationKind==='program'&&mapping.course?.relationSourceId==='qa-course',`desktop mapping: Course→Program normalization failed ${JSON.stringify(mapping.course)}`);
    expect(mapping.practice?.sourceType==='practice'&&mapping.practice?.relationKind==='program'&&mapping.practice?.relationSourceId==='qa-practice',`desktop mapping: Practice→Program normalization failed ${JSON.stringify(mapping.practice)}`);
    expect(mapping.project?.relationKind===null&&mapping.project?.relationSourceId===null,`desktop mapping: Project leaked into relation endpoint ${JSON.stringify(mapping.project)}`);

    const initialReads=await rpcCalls(page,'dc_board_relations_read_v1');
    expect(initialReads.length===1,`desktop: expected one initial canonical relation read, got ${initialReads.length}`);

    // BQA-16: the existing control owns presentation only. Hide/show must preserve
    // the same relation nodes/data and use the parent's canonical hidden attribute.
    const relationLayer=page.locator('.dc-board-relations-layer');
    const relationToggle=page.locator('[data-relations-toggle]');
    const relationIdsBefore=await page.locator('.dc-board-relation-line').evaluateAll(lines=>lines.map(line=>line.dataset.relationId).sort());
    expect((await relationToggle.innerText())==='СКРЫТЬ СВЯЗИ','desktop toggle: initial visible-state label drifted');
    expect((await relationLayer.getAttribute('hidden'))===null,'desktop toggle: relation layer unexpectedly starts hidden');
    await relationToggle.click();
    await page.waitForFunction(()=>document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    expect(!(await relationLayer.isVisible()),'desktop toggle: parent SVG remains visibly rendered after hide');
    expect((await relationToggle.innerText())==='ПОКАЗАТЬ СВЯЗИ','desktop toggle: hidden-state label drifted');
    const relationIdsHidden=await page.locator('.dc-board-relation-line').evaluateAll(lines=>lines.map(line=>line.dataset.relationId).sort());
    expect(JSON.stringify(relationIdsHidden)===JSON.stringify(relationIdsBefore),`desktop toggle: hide mutated relation line identity ${JSON.stringify({relationIdsBefore,relationIdsHidden})}`);
    expect((await rpcCalls(page,'dc_board_relations_read_v1')).length===1,'desktop toggle: presentation hide unexpectedly re-read relation data');
    await relationToggle.click();
    await page.waitForFunction(()=>!document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:2000});
    const relationIdsShown=await page.locator('.dc-board-relation-line').evaluateAll(lines=>lines.map(line=>line.dataset.relationId).sort());
    expect(JSON.stringify(relationIdsShown)===JSON.stringify(relationIdsBefore),`desktop toggle: show did not restore the same relation lines ${JSON.stringify({relationIdsBefore,relationIdsShown})}`);
    expect((await relationToggle.innerText())==='СКРЫТЬ СВЯЗИ','desktop toggle: visible-state label did not restore');
    expect((await rpcCalls(page,'dc_board_relations_read_v1')).length===1,'desktop toggle: presentation show unexpectedly re-read relation data');

    const ownBlock=page.locator('.dc-notice[data-artifact-owned="1"] [data-relation-block]');
    await ownBlock.waitFor({state:'attached',timeout:3000});

    // Regression: real Relations controls inside a movable Artifact remain outside
    // the spatial drag boundary, and native disclosure state survives canonical rebuild.
    const positionWritesBeforeSummary=await positionWriteCount(page);
    await ownBlock.locator('summary').click();
    await page.locator('.dc-notice[data-artifact-owned="1"] [data-relation-block][open]').waitFor({state:'attached',timeout:3000});
    expect((await positionWriteCount(page))===positionWritesBeforeSummary,'desktop disclosure: summary pointer entered movable-card drag owner');
    await page.evaluate(()=>{
      globalThis.__QA_RELATION_OPEN_BLOCK__=document.querySelector('.dc-notice[data-artifact-owned="1"] [data-relation-block]');
      window.dispatchEvent(new CustomEvent('dc:board-projections-updated'));
    });
    await page.waitForFunction(()=>{
      const current=document.querySelector('.dc-notice[data-artifact-owned="1"] [data-relation-block]');
      return Boolean(current&&current!==globalThis.__QA_RELATION_OPEN_BLOCK__&&current.open===true);
    },null,{timeout:3000});
    expect(await ownBlock.evaluate(el=>el.open===true),'desktop disclosure: open state lost across canonical Relations presentation rebuild');

    const rebuiltOwnBlock=page.locator('.dc-notice[data-artifact-owned="1"] [data-relation-block]');
    const positionWritesBeforeAdd=await positionWriteCount(page);
    await rebuiltOwnBlock.locator('[data-relation-add]').click();
    await rebuiltOwnBlock.locator('[data-relation-form]').waitFor({state:'visible',timeout:2000});
    expect((await positionWriteCount(page))===positionWritesBeforeAdd,'desktop controls: ＋ СВЯЗЬ pointer entered movable-card drag owner');
    const boundarySelect=rebuiltOwnBlock.locator('[data-relation-choice]');
    const positionWritesBeforeSelect=await positionWriteCount(page);
    await boundarySelect.click();
    expect((await positionWriteCount(page))===positionWritesBeforeSelect,'desktop controls: select pointer entered movable-card drag owner');
    await rebuiltOwnBlock.locator('[data-relation-cancel]').click();

    const ownText=(await ownBlock.innerText()).replace(/\s+/g,' ');
    expect(ownText.includes('СВЯЗАНО С')&&ownText.includes('QA EVENT'),`desktop detail: RELATED_TO missing ${ownText}`);
    expect(ownText.includes('О')&&ownText.includes('QA COURSE'),`desktop detail: ABOUT forward presentation missing ${ownText}`);

    const courseBlock=page.locator('[data-board-source="platform"][data-source-type="course"] [data-relation-block]');
    const practiceBlock=page.locator('[data-board-source="platform"][data-source-type="practice"] [data-relation-block]');
    await courseBlock.evaluate(el=>el.open=true);
    await practiceBlock.evaluate(el=>el.open=true);
    const courseText=(await courseBlock.innerText()).replace(/\s+/g,' ');
    const practiceText=(await practiceBlock.innerText()).replace(/\s+/g,' ');
    expect(courseText.includes('УПОМИНАЕТСЯ В')&&courseText.includes('OWN ARTIFACT'),`desktop detail: ABOUT inverse presentation missing ${courseText}`);
    expect(courseText.includes('ПРОДОЛЖАЕТ')&&courseText.includes('QA PRACTICE'),`desktop detail: CONTINUES forward missing ${courseText}`);
    expect(practiceText.includes('ПРОДОЛЖЕНО')&&practiceText.includes('QA COURSE'),`desktop detail: CONTINUES inverse missing ${practiceText}`);

    // Existing Artifact fullscreen/detail shell receives the same relation block.
    // Use the canonical fullscreen focus/open event so the QA path respects the existing camera owner.
    await page.evaluate(()=>{
      const node=document.querySelector('.dc-notice[data-artifact-owned="1"]');
      window.dispatchEvent(new CustomEvent('dc:board-focus-target',{detail:{node,open:true}}));
    });
    const overlay=page.locator('.dc-artifact-overlay');await overlay.waitFor({state:'visible',timeout:3000});
    const artifactFrameSrc=await page.locator('.dc-artifact-overlay iframe').getAttribute('src');
    expect(new URL(artifactFrameSrc,base).pathname==='/community/artifact/11111111-1111-4111-8111-111111111111/',`desktop Artifact detail: canonical iframe route drifted ${artifactFrameSrc}`);
    const detailBlock=page.locator('.dc-artifact-overlay__panel > [data-relation-detail-host] .dc-board-relations-block[data-relation-detail="1"]');
    await detailBlock.waitFor({state:'visible',timeout:4000});
    expect(((await detailBlock.innerText()).replace(/\s+/g,' ')).includes('QA EVENT'),'desktop Artifact detail: relation block not integrated into canonical overlay panel');
    const detailGeometry=await page.evaluate(()=>{
      const panel=document.querySelector('.dc-artifact-overlay__panel')?.getBoundingClientRect();
      const host=document.querySelector('.dc-artifact-overlay__panel > [data-relation-detail-host]')?.getBoundingClientRect();
      return panel&&host?{panel:{left:panel.left,right:panel.right,top:panel.top,bottom:panel.bottom},host:{left:host.left,right:host.right,top:host.top,bottom:host.bottom}}:null;
    });
    expect(detailGeometry&&detailGeometry.host.left>=detailGeometry.panel.left&&detailGeometry.host.right<=detailGeometry.panel.right&&detailGeometry.host.top>=detailGeometry.panel.top&&detailGeometry.host.bottom<=detailGeometry.panel.bottom,`desktop Artifact detail: relation block escapes canonical overlay panel ${JSON.stringify(detailGeometry)}`);
    await page.locator('.dc-artifact-overlay__close').click();await overlay.waitFor({state:'hidden',timeout:2000});

    // Filters and relation visibility must compose without a second owner.
    await page.locator('[data-board-filter-drawer]').click();
    await page.locator('[data-board-detail-filter="artifact"]').click();
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===0,{timeout:3000});
    await relationToggle.click();
    await page.waitForFunction(()=>document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    await page.locator('[data-board-filter="all"]').click();
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:3000});
    expect(!(await relationLayer.isVisible()),'desktop filter+toggle: restoring filter made hidden parent SVG visible');
    await relationToggle.click();
    await page.waitForFunction(()=>!document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:2000});

    // Real existing drag owner moves card; relation layer follows style/position changes.
    await page.evaluate(()=>{
      const node=document.querySelector('.dc-notice[data-artifact-owned="1"]');
      window.dispatchEvent(new CustomEvent('dc:board-focus-target',{detail:{node,open:false}}));
    });
    await page.waitForTimeout(180);
    const ownCard=page.locator('.dc-notice[data-artifact-owned="1"]');
    const movableState=await ownCard.evaluate(card=>({movable:card.classList.contains('is-own-movable'),left:card.style.left,top:card.style.top}));
    expect(movableState.movable===true,`desktop drag: canonical own-movable state missing ${JSON.stringify(movableState)}`);
    const before=await lineCoords(page,'77777777-7777-4777-8777-777777777771');
    const beforeCard=await ownCard.evaluate(card=>({left:parseFloat(card.style.left)||0,top:parseFloat(card.style.top)||0}));
    const box=await ownCard.boundingBox();
    if(box){
      const startX=box.x+Math.min(80,box.width*.25),startY=box.y+Math.min(90,box.height*.35);
      await page.mouse.move(startX,startY);
      await page.mouse.down();await page.mouse.move(startX+70,startY+45,{steps:5});await page.mouse.up();
      await page.waitForFunction(({left,top})=>{
        const card=document.querySelector('.dc-notice[data-artifact-owned="1"]');
        return card&&(Math.abs((parseFloat(card.style.left)||0)-left)>2||Math.abs((parseFloat(card.style.top)||0)-top)>2);
      },beforeCard,{timeout:2500});
      await page.waitForTimeout(120);
      const afterCard=await ownCard.evaluate(card=>({left:parseFloat(card.style.left)||0,top:parseFloat(card.style.top)||0}));
      const after=await lineCoords(page,'77777777-7777-4777-8777-777777777771');
      const dragState=await page.evaluate(()=>({
        artifact:document.querySelector('.dc-notice[data-artifact-owned="1"]')?.dataset.artifact||null,
        dragged:document.querySelector('.dc-notice[data-artifact-owned="1"]')?.dataset.boardJustDragged||null,
        overlay:document.documentElement.dataset.boardArtifactOpen||null,
        overlayHidden:document.querySelector('.dc-artifact-overlay')?.hidden??null,
        overlaySrc:document.querySelector('.dc-artifact-overlay iframe')?.getAttribute('src')||null,
        focus:new URL(location.href).searchParams.get('focus')||null,
        uiEvents:(globalThis.__QA_RELATION_UI_EVENTS__||[]).slice(-12)
      }));
      if(!dragState.dragged||dragState.overlay)throw new Error(`desktop drag: canonical drag opened Artifact detail or missed drag marker ${JSON.stringify(dragState)}`);
      if(dragState.focus===`artifact:${String(dragState.artifact||'').toLowerCase()}`)throw new Error(`desktop drag: deep-link history owner persisted stale Artifact focus ${JSON.stringify(dragState)}`);
      expect(after.x1!==before.x1||after.y1!==before.y1,`desktop drag: relation line did not follow canonical card movement ${JSON.stringify({before,beforeCard,afterCard,after})}`);
    }else failures.push('desktop drag: own Artifact card has no bounding box');

    // Create success through canonical RPC then one canonical re-read.
    // Bring the moved Artifact back through the existing fullscreen/camera owner before real pointer interaction.
    await page.evaluate(()=>{
      const node=document.querySelector('.dc-notice[data-artifact-owned="1"]');
      window.dispatchEvent(new CustomEvent('dc:board-focus-target',{detail:{node,open:false}}));
    });
    await page.waitForTimeout(180);
    await ownBlock.evaluate(el=>el.open=true);
    const positionWritesBeforeCreateAdd=await positionWriteCount(page);
    await ownBlock.locator('[data-relation-add]').click();
    expect((await positionWriteCount(page))===positionWritesBeforeCreateAdd,'desktop create: ＋ СВЯЗЬ started movable-card drag');
    const select=ownBlock.locator('[data-relation-choice]');
    const option=await select.locator('option').evaluateAll(options=>options.map(o=>({value:o.value,text:o.textContent||''})).find(o=>o.text.includes('ОТЧЁТ ПО')&&o.text.includes('QA EVENT')));
    expect(Boolean(option),'desktop create: REPORT_OF target option missing');
    if(option){
      const positionWritesBeforeCreateSelect=await positionWriteCount(page);
      await select.click();
      expect((await positionWriteCount(page))===positionWritesBeforeCreateSelect,'desktop create: select started movable-card drag');
      await select.selectOption(option.value);
      const positionWritesBeforeSave=await positionWriteCount(page);
      await ownBlock.locator('[data-relation-save]').click();
      await page.waitForFunction(()=>globalThis.__QA_RPC_CALLS__.some(call=>call.name==='dc_board_relation_create_v1'),{timeout:2500});
      await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===4,{timeout:3000});
      expect((await positionWriteCount(page))===positionWritesBeforeSave,'desktop create: СОХРАНИТЬ started movable-card drag');
    }

    // Server permission reject must fail closed and preserve canonical index.
    await page.evaluate(()=>{globalThis.__QA_RELATION_REJECT__=true});
    const refreshedOwn=page.locator('.dc-notice[data-artifact-owned="1"] [data-relation-block]');
    await page.evaluate(()=>{
      const node=document.querySelector('.dc-notice[data-artifact-owned="1"]');
      window.dispatchEvent(new CustomEvent('dc:board-focus-target',{detail:{node,open:false}}));
    });
    await page.waitForTimeout(120);
    await refreshedOwn.evaluate(el=>el.open=true);await refreshedOwn.locator('[data-relation-add]').click();
    const rejectSelect=refreshedOwn.locator('[data-relation-choice]');
    const rejectOption=await rejectSelect.locator('option').evaluateAll(options=>options.map(o=>({value:o.value,text:o.textContent||''})).find(o=>o.text.includes('РЕЗУЛЬТАТ ДЛЯ')&&o.text.includes('OTHER ARTIFACT')));
    if(rejectOption){
      const lineCountBefore=await page.locator('.dc-board-relation-line').count();
      await rejectSelect.selectOption(rejectOption.value);await refreshedOwn.locator('[data-relation-save]').click();
      await refreshedOwn.locator('[data-relation-status]').waitFor({state:'visible',timeout:2000});
      expect((await refreshedOwn.locator('[data-relation-status]').innerText()).includes('НЕТ ПРАВ / SERVER'),'desktop permission reject: server failure not surfaced fail-closed');
      expect((await page.locator('.dc-board-relation-line').count())===lineCountBefore,'desktop permission reject: relation index changed after rejected mutation');
    }else failures.push('desktop permission reject: fixture option missing');
    await page.evaluate(()=>{globalThis.__QA_RELATION_REJECT__=false});

    // Delete is explicit logical-delete RPC; presentation re-reads canonical truth.
    const aboutDelete=page.locator('.dc-notice[data-artifact-owned="1"] [data-relation-id="77777777-7777-4777-8777-777777777772"] [data-relation-delete]');
    const positionWritesBeforeDelete=await positionWriteCount(page);
    await aboutDelete.click();
    await page.waitForFunction(()=>globalThis.__QA_RPC_CALLS__.some(call=>call.name==='dc_board_relation_delete_v1'&&call.args?.p_relation_id==='77777777-7777-4777-8777-777777777772'),{timeout:2500});
    await page.waitForFunction(()=>!document.querySelector('.dc-board-relation-line[data-relation-id="77777777-7777-4777-8777-777777777772"]'),{timeout:2500});
    expect((await positionWriteCount(page))===positionWritesBeforeDelete,'desktop delete: delete control started movable-card drag');

    expect(!errors.length,`desktop page errors: ${errors.join(' | ')}`);
    await page.screenshot({path:path.join(outDir,'desktop.png'),fullPage:false});
    await ctx.close();
  }

  // Visibility preference is intentionally ephemeral in the current contract.
  {
    const{ctx,page,errors}=await openBoard(browser,'available',{width:1440,height:900});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:5000});
    const toggle=page.locator('[data-relations-toggle]');
    await toggle.click();
    await page.waitForFunction(()=>document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('.dc-spatial-viewport').waitFor({state:'visible',timeout:7000});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-notice[data-artifact]').length>=2,{timeout:6000});
    await page.waitForFunction(()=>document.documentElement.dataset.dcBoardRelations==='ready',{timeout:6000});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:5000});
    expect((await page.locator('.dc-board-relations-layer').getAttribute('hidden'))===null,'desktop refresh: ephemeral hidden state persisted across reload');
    expect((await page.locator('[data-relations-toggle]').innerText())==='СКРЫТЬ СВЯЗИ','desktop refresh: control did not reset to current visible default');
    expect(!errors.length,`desktop refresh page errors: ${errors.join(' | ')}`);
    await ctx.close();
  }

  // Mobile/fullscreen regression: same owner, no second layout system.
  {
    const{ctx,page,errors}=await openBoard(browser,'available',{width:390,height:844});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:5000});
    const state=await page.evaluate(()=>{
      const world=document.querySelector('.dc-spatial-world');
      const layer=document.querySelector('.dc-board-relations-layer');
      const toggle=document.querySelector('[data-relations-toggle]');
      const block=document.querySelector('.dc-notice[data-artifact-owned="1"] [data-relation-block]');
      return{
        layerInside:!!(world&&layer&&layer.parentElement===world),
        toggleVisible:!!toggle&&!toggle.hidden,
        docWidth:document.documentElement.scrollWidth,
        innerWidth,
        blockWidth:block?.getBoundingClientRect().width||0,
        cardWidth:block?.closest('.dc-notice')?.getBoundingClientRect().width||0
      };
    });
    expect(state.layerInside,'mobile: relation layer is not inside existing spatial world');
    expect(state.toggleVisible,'mobile: relation visibility control missing from existing spatial controls');
    expect(state.docWidth<=state.innerWidth+2,`mobile: relation UI creates document overflow ${JSON.stringify(state)}`);
    expect(state.blockWidth<=state.cardWidth+1,`mobile: relation block escapes canonical card ${JSON.stringify(state)}`);

    const mobileLayer=page.locator('.dc-board-relations-layer');
    const mobileToggle=page.locator('[data-relations-toggle]');
    const mobileIdsBefore=await page.locator('.dc-board-relation-line').evaluateAll(lines=>lines.map(line=>line.dataset.relationId).sort());
    await mobileToggle.click();
    await page.waitForFunction(()=>document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    expect(!(await mobileLayer.isVisible()),'mobile 390 toggle: relation layer remains visible after hide');
    expect(JSON.stringify(await page.locator('.dc-board-relation-line').evaluateAll(lines=>lines.map(line=>line.dataset.relationId).sort()))===JSON.stringify(mobileIdsBefore),'mobile 390 toggle: hide changed relation line identity');
    await mobileToggle.click();
    await page.waitForFunction(()=>!document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:2000});

    await page.evaluate(()=>{
      const node=document.querySelector('.dc-notice[data-artifact-owned="1"]');
      window.dispatchEvent(new CustomEvent('dc:board-focus-target',{detail:{node,open:true}}));
    });
    const mobileOverlay=page.locator('.dc-artifact-overlay');await mobileOverlay.waitFor({state:'visible',timeout:3000});
    const mobileFrameSrc=await page.locator('.dc-artifact-overlay iframe').getAttribute('src');
    expect(new URL(mobileFrameSrc,base).pathname==='/community/artifact/11111111-1111-4111-8111-111111111111/',`mobile Artifact detail: canonical iframe route drifted ${mobileFrameSrc}`);
    const mobileDetail=page.locator('.dc-artifact-overlay__panel > [data-relation-detail-host] .dc-board-relations-block[data-relation-detail="1"]');
    await mobileDetail.waitFor({state:'visible',timeout:4000});
    const mobileDetailGeo=await page.evaluate(()=>{
      const panel=document.querySelector('.dc-artifact-overlay__panel')?.getBoundingClientRect();
      const host=document.querySelector('.dc-artifact-overlay__panel > [data-relation-detail-host]')?.getBoundingClientRect();
      return panel&&host?{panelW:panel.width,panelH:panel.height,hostW:host.width,hostH:host.height,inside:host.left>=panel.left&&host.right<=panel.right&&host.top>=panel.top&&host.bottom<=panel.bottom}:null;
    });
    expect(mobileDetailGeo?.inside===true,`mobile: Artifact relation detail escapes canonical fullscreen panel ${JSON.stringify(mobileDetailGeo)}`);
    await page.locator('.dc-artifact-overlay__close').click();await mobileOverlay.waitFor({state:'hidden',timeout:2000});

    expect(!errors.length,`mobile page errors: ${errors.join(' | ')}`);
    await page.screenshot({path:path.join(outDir,'mobile-390.png'),fullPage:false});
    await ctx.close();
  }

  // Narrow mobile regression for BQA-16: same owner and same relation identities.
  {
    const{ctx,page,errors}=await openBoard(browser,'available',{width:360,height:800});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:5000});
    const state=await page.evaluate(()=>({
      docWidth:document.documentElement.scrollWidth,
      innerWidth,
      layerInside:document.querySelector('.dc-board-relations-layer')?.parentElement===document.querySelector('.dc-spatial-world')
    }));
    expect(state.layerInside,'mobile 360: relation layer escaped canonical spatial world');
    expect(state.docWidth<=state.innerWidth+2,`mobile 360: relation UI creates document overflow ${JSON.stringify(state)}`);
    const toggle=page.locator('[data-relations-toggle]');
    const layer=page.locator('.dc-board-relations-layer');
    const before=await page.locator('.dc-board-relation-line').evaluateAll(lines=>lines.map(line=>line.dataset.relationId).sort());
    await toggle.click();
    await page.waitForFunction(()=>document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    expect(!(await layer.isVisible()),'mobile 360 toggle: relation layer remains visible after hide');
    await toggle.click();
    await page.waitForFunction(()=>!document.querySelector('.dc-board-relations-layer')?.hasAttribute('hidden'),{timeout:2000});
    await page.waitForFunction(()=>document.querySelectorAll('.dc-board-relation-line:not([hidden])').length===3,{timeout:2000});
    const after=await page.locator('.dc-board-relation-line').evaluateAll(lines=>lines.map(line=>line.dataset.relationId).sort());
    expect(JSON.stringify(after)===JSON.stringify(before),`mobile 360 toggle: show did not restore same relation lines ${JSON.stringify({before,after})}`);
    expect(!errors.length,`mobile 360 page errors: ${errors.join(' | ')}`);
    await page.screenshot({path:path.join(outDir,'mobile-360.png'),fullPage:false});
    await ctx.close();
  }

  // Missing live backend is unknown/unavailable, never fake empty truth.
  {
    const{ctx,page,errors}=await openBoard(browser,'unavailable',{width:1440,height:900});
    expect((await page.locator('.dc-notice[data-artifact]').count())>=2,'unavailable: Board artifacts disappeared');
    expect((await page.locator('[data-board-source="platform"]').count())>=4,'unavailable: Board projections disappeared');
    expect((await page.locator('[data-relation-block]').count())===0,'unavailable: false relation detail rendered');
    expect((await page.locator('.dc-board-relations-layer').count())===0,'unavailable: false relation canvas rendered');
    expect((await page.locator('[data-relations-toggle]').count())===0,'unavailable: relation control implies false empty truth');
    expect((await rpcCalls(page,'dc_board_relations_read_v1')).length===1,'unavailable: runtime retries missing RPC instead of failing closed once');
    await page.locator('[data-board-filter-drawer]').click();await page.locator('[data-board-detail-filter="artifact"]').click();await page.locator('[data-board-filter="all"]').click();
    expect(!errors.length,`unavailable page errors: ${errors.join(' | ')}`);
    await ctx.close();
  }

  // Unsupported endpoint kind and unsupported pair both fail the whole relation presentation closed.
  for(const mode of ['invalid-kind','invalid-pair']){
    const{ctx,page,errors}=await openBoard(browser,mode,{width:800,height:900});
    expect((await page.locator('[data-relation-block]').count())===0,`${mode}: invalid canonical payload still rendered detail`);
    expect((await page.locator('.dc-board-relation-line').count())===0,`${mode}: invalid canonical payload still rendered canvas line`);
    expect((await page.evaluate(()=>document.documentElement.dataset.dcBoardRelations))==='unavailable',`${mode}: invalid payload did not fail closed`);
    expect(!errors.length,`${mode} page errors: ${errors.join(' | ')}`);
    await ctx.close();
  }
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}

if(failures.length){
  console.error(`Board Relations v1 browser acceptance FAILED (${failures.length})`);
  for(const failure of failures)console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Board Relations v1 browser acceptance PASS');
console.log('- desktop endpoint mapping + relation canvas/detail PASS');
console.log('- Course/Practice → Program normalization PASS');
console.log('- visibility toggle hide/show + relation identity preservation PASS');
console.log('- filter + toggle composition + canonical drag line updates PASS');
console.log('- refresh resets current ephemeral visibility state PASS');
console.log('- create/delete + permission reject fixtures PASS');
console.log('- mobile 390/360 + fullscreen PASS');
console.log('- RPC unavailable + invalid payload fail-closed PASS');
