import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const root=path.join(process.cwd(),'_site');
const outDir=path.join(process.cwd(),'.qa','artifact-collaboration-v1');
fs.mkdirSync(outDir,{recursive:true});
const failures=[];
const A='11111111-1111-4111-8111-111111111111';
const B='22222222-2222-4222-8222-222222222222';
const expect=(ok,message)=>{if(!ok)failures.push(message)};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};

function resolveFile(raw){
  let pathname=decodeURIComponent(new URL(raw,'http://local').pathname);
  if(/^\/community\/artifact\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/?$/i.test(pathname))pathname='/community/artifact/index.html';
  else if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(root,pathname.replace(/^\/+/,''));return full.startsWith(path.resolve(root))?full:null;
}
const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
  res.statusCode=200;res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;

const stub=()=>`
const A='11111111-1111-4111-8111-111111111111';
const B='22222222-2222-4222-8222-222222222222';
const AUTHOR='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const INVITED='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const JOINED2='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const NIKITA='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
const ANDRUS='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
const mode=globalThis.__QA_COLLAB_MODE__||'author';
const ids={author:AUTHOR,invited:INVITED,joined:INVITED,outsider:'ffffffff-ffff-4fff-8fff-ffffffffffff',owner:'99999999-9999-4999-8999-999999999999',relations:INVITED};
const uid=ids[mode]||AUTHOR;
const user={id:uid,email:'private-'+uid.slice(0,4)+'@invalid',user_metadata:{full_name:mode.toUpperCase()}};
const session={user};
globalThis.__QA_COLLAB_CALLS__=[];
globalThis.__QA_POSITION_WRITES__=0;
globalThis.__QA_PARTICIPATION__=globalThis.__QA_PARTICIPATION__||{
 [A]:{
   [INVITED]:mode==='joined'||mode==='relations'?'JOINED':'INVITED',
   [JOINED2]:'JOINED',
   [NIKITA]:'INVITED',
   [ANDRUS]:'JOINED'
 },
 [B]:{[NIKITA]:'JOINED',[ANDRUS]:'INVITED'}
};
const profiles=[
 {profile_id:AUTHOR,display_name:'Габиль Очень Длинное Имя Инициатора',nickname:'gabil',avatar_url:null,member_since:'2026-09-01'},
 {profile_id:INVITED,display_name:'Женя Очень Длинное Имя Участника',nickname:'zhenya',avatar_url:null,member_since:'2026-09-01'},
 {profile_id:JOINED2,display_name:'Андрус',nickname:'andrus',avatar_url:null,member_since:'2026-09-01'},
 {profile_id:NIKITA,display_name:'Никита',nickname:'nikita',avatar_url:null,member_since:'2026-09-01'},
 {profile_id:ANDRUS,display_name:'Андрус Второй',nickname:null,avatar_url:null,member_since:'2026-09-01'}
];
const artifacts=[
 {id:A,author_profile_id:AUTHOR,artifact_type:'idea',title:'IDEA A',body:'Первая идея с независимым кругом.',external_url:null,status:'active',visibility:'circle',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-24T10:00:00Z',closed_at:null,created_at:'2026-09-24T09:00:00Z',board_hidden_at:null},
 {id:B,author_profile_id:AUTHOR,artifact_type:'idea',title:'IDEA B',body:'Вторая идея с другим составом.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-24T09:00:00Z',closed_at:null,created_at:'2026-09-24T08:00:00Z',board_hidden_at:null},
 {id:'33333333-3333-4333-8333-333333333333',author_profile_id:AUTHOR,artifact_type:'announcement',title:'ANNOUNCEMENT',body:'Regression subtype.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-24T08:00:00Z',closed_at:null,created_at:'2026-09-24T07:00:00Z',board_hidden_at:null}
];
const positions=artifacts.map((a,i)=>({artifact_id:a.id,board_id:'community',x:1500+i*650,y:1400+i*250,rotation:0,size_class:i===0?'M':'S',position_version:1}));
const projections=[{entity_id:'44444444-4444-4444-8444-444444444444',entity_type:'event',slug:'qa-event',title:'QA EVENT',status:'planned',summary:'Readable relation target.',source_system:'dementor-club',provenance_status:'confirmed',event_location:'QA',event_capacity:7,program_type:null,delivery_mode:null,content_summary:null}];
const RELATION_KEY='qa:artifact-collab:relations:'+mode;
const DEFAULT_RELATIONS=mode==='relations'?[
 {relation_id:'rel-other',relation_type:'RELATED_TO',origin_kind:'artifact',origin_source_id:A,target_kind:'artifact',target_source_id:B,created_at:'2026-09-24T12:00:00Z',can_delete:false},
 {relation_id:'rel-directional',relation_type:'ABOUT',origin_kind:'artifact',origin_source_id:A,target_kind:'event',target_source_id:'qa-event',created_at:'2026-09-24T12:01:00Z',can_delete:false}
]:[];
function loadRelationStore(){try{const raw=sessionStorage.getItem(RELATION_KEY);if(raw)return JSON.parse(raw)}catch{}return DEFAULT_RELATIONS.map(row=>({...row}))}
function saveRelationStore(rows){globalThis.__QA_RELATIONS__=rows;try{sessionStorage.setItem(RELATION_KEY,JSON.stringify(rows))}catch{}}
globalThis.__QA_RELATIONS__=loadRelationStore();
const canReadArtifact=a=>{
 if(a.visibility==='community')return true;
 if(uid===AUTHOR||mode==='owner')return true;
 return ['INVITED','JOINED'].includes(globalThis.__QA_PARTICIPATION__?.[a.id]?.[uid]||'');
};
const currentParticipants=id=>Object.entries(globalThis.__QA_PARTICIPATION__?.[id]||{}).filter(([,state])=>['INVITED','JOINED'].includes(state)).map(([profile_id,participation_state])=>{const p=profiles.find(row=>row.profile_id===profile_id)||{profile_id,display_name:'REGISTERED PROFILE',nickname:null,avatar_url:null};return{...p,participation_state,state_changed_at:'2026-09-24T12:00:00Z'}});
const rowsFor=t=>t==='dc_artifacts'?artifacts.filter(canReadArtifact)
 :t==='dc_member_public_profiles'?profiles
 :t==='dc_artifact_reactions'?[]
 :t==='dc_artifact_responses'?[]
 :t==='dc_artifact_media'?[]
 :t==='dc_artifact_board_positions'?positions
 :t==='join_applications'?[]
 :t==='dc_entity_assignments'?[]
 :t==='dc_role_assignments'?(mode==='owner'?[{role:'owner_admin',status:'active',valid_from:'2026-09-01T00:00:00Z',valid_to:null}]:[])
 :t==='dc_system_memberships'?[{profile_id:uid,status:'active',valid_from:'2026-09-01T00:00:00Z',valid_to:null}]
 :t==='profiles'?[{id:uid,display_name:mode.toUpperCase(),full_name:mode.toUpperCase(),avatar_url:null}]
 :[];
const query=t=>{
 let rows=[...rowsFor(t)],updatePayload=null;
 const q={
  select(){return q},
  eq(k,v){rows=rows.filter(r=>r?.[k]===v);return q},
  neq(k,v){rows=rows.filter(r=>r?.[k]!==v);return q},
  in(k,vals){rows=rows.filter(r=>vals.includes(r?.[k]));return q},
  is(k,v){rows=rows.filter(r=>r?.[k]===v||(r?.[k]==null&&v==null));return q},
  order(){return q},limit(n){rows=rows.slice(0,n);return q},range(){return q},
  insert(){return Promise.resolve({data:null,error:null})},delete(){return Promise.resolve({data:null,error:null})},update(payload){updatePayload=payload;if(t==='dc_artifact_board_positions')globalThis.__QA_POSITION_WRITES__+=1;return q},upsert(){return Promise.resolve({data:null,error:null})},
  maybeSingle(){const row=rows[0]||null;return Promise.resolve({data:row&&updatePayload?{...row,...updatePayload}:row,error:null})},
  single(){const row=rows[0]||null;return Promise.resolve({data:row&&updatePayload?{...row,...updatePayload}:row,error:null})},
  then(resolve,reject){return Promise.resolve({data:rows.map(row=>updatePayload?{...row,...updatePayload}:row),error:null}).then(resolve,reject)}
 };return q;
};
function artifactFromArg(id){return artifacts.find(a=>a.id===id&&canReadArtifact(a))||null}
export function createClient(){return{
 auth:{getSession:async()=>({data:{session},error:null}),getUser:async()=>({data:{user},error:null}),signOut:async()=>({}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signInWithOAuth:async()=>({data:{},error:null})},
 from:query,
 rpc:async(name,args={})=>{
   globalThis.__QA_COLLAB_CALLS__.push({name,args});
   if(name==='dc_member_entry_status_v1')return{data:{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_count:9,sphere_gate_complete:true,artifact_slots_available:2,artifact_slots_consuming:2,published_artifact_count:2},error:null};
   if(name==='dc_normalize_artifact_lifecycle_v1')return{data:0,error:null};
   if(name==='dc_board_promotion_state_read_v1'||name==='dc_artifact_publisher_scopes_v1')return{data:[],error:null};
   if(name==='dc_board_entity_projection_read_v1')return{data:projections,error:null};
   if(name==='dc_board_relations_read_v1')return{data:(globalThis.__QA_RELATIONS__||[]).map(row=>({...row})),error:null};
   if(name==='dc_artifact_participants_read_v1'){
     const art=artifactFromArg(args.p_artifact_id);if(!art)return{data:null,error:{message:'ARTIFACT_NOT_AVAILABLE'}};
     return{data:currentParticipants(args.p_artifact_id),error:null};
   }
   if(name==='dc_artifact_invite_candidates_v1')return{data:[{profile_id:'77777777-7777-4777-8777-777777777777',display_name:'Новый Зарегистрированный Профиль',nickname:'newperson',avatar_url:null,current_state:null}],error:null};
   if(name==='dc_artifact_invite_v1'){globalThis.__QA_PARTICIPATION__[args.p_artifact_id][args.p_profile_id]='INVITED';return{data:'event-invite',error:null}};
   if(name==='dc_artifact_invitation_respond_v1'){globalThis.__QA_PARTICIPATION__[A][uid]=args.p_decision;return{data:'event-response',error:null}};
   if(name==='dc_artifact_leave_v1'){globalThis.__QA_PARTICIPATION__[A][uid]='LEFT';return{data:'event-left',error:null}};
   if(name==='dc_artifact_remove_participant_v1'){globalThis.__QA_PARTICIPATION__[args.p_artifact_id][args.p_profile_id]='REMOVED';return{data:'event-removed',error:null}};
   if(name==='dc_guest_board_read_v1')return{data:artifacts.filter(canReadArtifact).map(a=>({...a,artifact_id:a.id,author_display_name:profiles[0].display_name,author_nickname:profiles[0].nickname,author_avatar_url:null,reaction_count:0,guest_interest_count:0,my_guest_interest:false})),error:null};
   if(name==='dc_guest_board_artifact_detail_read_v1'){const a=artifactFromArg(args.p_artifact_id);if(!a)return{data:null,error:{message:'ARTIFACT_NOT_AVAILABLE'}};return{data:{artifact:a,author:profiles[0],reaction_count:0,guest_interest_count:0,my_guest_interest:false,my_guest_response_submitted:false,participation_state:globalThis.__QA_PARTICIPATION__?.[a.id]?.[uid]||null,media:[]},error:null}};
   if(name==='dc_board_relation_create_v1'){
     const created={relation_id:'rel-created',relation_type:args.p_relation_type,origin_kind:args.p_origin_kind,origin_source_id:args.p_origin_source_id,target_kind:args.p_target_kind,target_source_id:args.p_target_source_id,created_at:'2026-09-24T12:02:00Z',can_delete:true};
     saveRelationStore([...(globalThis.__QA_RELATIONS__||[]).filter(row=>row.relation_id!=='rel-created'),created]);
     return{data:'rel-created',error:null}
   };
   if(name==='dc_board_relation_delete_v1'){
     saveRelationStore((globalThis.__QA_RELATIONS__||[]).filter(row=>row.relation_id!==args.p_relation_id));
     return{data:args.p_relation_id,error:null}
   };
   if(name==='dc_set_artifact_visibility_v1'||name==='dc_set_artifact_subtype_v1'||name==='dc_set_artifact_activity_v1')return{data:args.p_artifact_id,error:null};
   if(name==='dc_create_artifact_draft_v1')return{data:'88888888-8888-4888-8888-888888888888',error:null};
   if(name==='dc_publish_artifact_v1')return{data:{artifact_id:args.p_artifact_id,status:'active'},error:null};
   if(name==='dc_close_artifact_v1')return{data:{artifact_id:args.p_artifact_id,status:'archived'},error:null};
   return{data:[],error:null};
 },
 storage:{from:()=>({createSignedUrl:async()=>({data:{signedUrl:'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22160%22/%3E'},error:null}),upload:async()=>({data:{},error:null}),remove:async()=>({data:{},error:null})})},
 functions:{invoke:async()=>({data:{},error:null})}
}};`;

async function context(browser,mode,viewport,options={}){
 const ctx=await browser.newContext({viewport,hasTouch:options.hasTouch===true});
 await ctx.addInitScript(({mode})=>{globalThis.__QA_COLLAB_MODE__=mode;const ids={author:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',invited:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',joined:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',outsider:'ffffffff-ffff-4fff-8fff-ffffffffffff',owner:'99999999-9999-4999-8999-999999999999',relations:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'};try{localStorage.setItem('dc:board:tutorial:v21:'+(ids[mode]||ids.author)+':member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}},{mode});
 await ctx.route('https://cdn.jsdelivr.net/**',route=>route.request().url().includes('@supabase/supabase-js')?route.fulfill({status:200,contentType:'text/javascript',body:stub()}):route.abort());
 return ctx;
}
async function openDetail(browser,mode,viewport={width:1440,height:900}){
 const ctx=await context(browser,mode,viewport);const page=await ctx.newPage();const errors=[];const requestFailures=[];const badResponses=[];const consoleErrors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',request=>requestFailures.push({url:request.url(),error:request.failure()?.errorText||null}));
 page.on('response',response=>{if(response.status()>=400)badResponses.push({url:response.url(),status:response.status()})});
 page.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text())});
 await page.goto(base+'/community/artifact/11111111-1111-4111-8111-111111111111/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.getElementById('artifactState')?.textContent!=='LOADING',{timeout:7000});
 return{ctx,page,errors,requestFailures,badResponses,consoleErrors};
}
async function openBoard(browser,mode,viewport={width:1440,height:900},options={}){
 const ctx=await context(browser,mode,viewport,options);const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelectorAll('.dc-notice[data-artifact]').length>=2,{timeout:8000});
 if(mode==='relations'){
   await page.waitForFunction(()=>Boolean(
     document.documentElement.dataset.dcBoardRelations==='ready'
     &&document.querySelector('[data-board-source="platform"][data-relation-source-id="qa-event"]')
     &&document.querySelector('.dc-notice[data-artifact] [data-relation-block]')
   ),{timeout:8000});
   try{
     const stable=await page.waitForFunction(artifactId=>{
       const selector='.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]';
       const current=document.querySelector(selector);
       if(!current){
         globalThis.__QA_RELATION_PRESENTATION_STABILITY__=null;
         return false;
       }
       const state=globalThis.__QA_RELATION_PRESENTATION_STABILITY__;
       if(!state||state.node!==current||!current.isConnected){
         globalThis.__QA_RELATION_PRESENTATION_STABILITY__={node:current,stableFrames:0};
         return false;
       }
       state.stableFrames+=1;
       const canonical=document.querySelector(selector);
       if(state.node!==canonical||!state.node.isConnected){
         globalThis.__QA_RELATION_PRESENTATION_STABILITY__={node:canonical,stableFrames:0};
         return false;
       }
       if(state.stableFrames<2)return false;
       globalThis.__QA_RELATION_PRESENTATION_STABILITY_READY__={node:state.node,stableFrames:state.stableFrames};
       return true;
     },A,{timeout:8000,polling:'raf'});
     await stable.dispose();
   }catch(error){
     throw new Error('RELATION_PRESENTATION_STABILITY_TIMEOUT');
   }
 }
 return{ctx,page,errors};
}

const browser=await chromium.launch({headless:true});
try{
  // COMMUNITY regression + IDEA-only composer visibility.
  {
    const{ctx,page,errors}=await openBoard(browser,'author');
    const announcement=page.locator('.dc-notice[data-artifact-subtype="announcement"]');
    expect(await announcement.count()===1,'community regression: announcement missing');
    const cards=page.locator('[data-collaboration-card]');
    expect(await cards.count()===2,'board: collaboration leaked outside two Idea cards');
    const a=page.locator('.dc-notice[data-artifact="'+A+'"]');
    const b=page.locator('.dc-notice[data-artifact="'+B+'"]');
    const aRoster=await a.locator('[data-collaboration-card]').textContent();
    const bRoster=await b.locator('[data-collaboration-card]').textContent();
    expect(String(aRoster||'').includes('Женя Очень Длинное Имя Участника')&&String(aRoster||'').includes('Никита'),'Idea A roster missing');
    expect(String(bRoster||'').includes('Никита')&&String(bRoster||'').includes('Андрус Второй'),'Idea B independent roster missing');
    await page.locator('.dc-board-primary button').click();
    await page.locator('#artifactType').selectOption('idea');
    expect(await page.locator('#artifactVisibilityField').isVisible(),'composer: IDEA visibility controls missing');
    expect(await page.getByText('ВЕСЬ КЛУБ',{exact:true}).count()===1&&await page.getByText('СВОЙ КРУГ',{exact:true}).count()===1,'composer: approved visibility labels missing');
    await page.locator('#artifactType').selectOption('post');
    expect(!(await page.locator('#artifactVisibilityField').isVisible()),'composer: CIRCLE leaked to non-IDEA subtype');
    expect(!errors.length,'board author page errors: '+errors.join(' | '));
    await page.screenshot({path:path.join(outDir,'desktop-board.png'),fullPage:true});await ctx.close();
  }

  // Author detail: roster, visibility, safe selector, remove.
  {
    const{ctx,page,errors,requestFailures,badResponses,consoleErrors}=await openDetail(browser,'author');
    const collab=page.locator('[data-artifact-collaboration]');
    if(await collab.count()===0){
      const diagnostics=await page.evaluate(()=>({
        artifactState:document.getElementById('artifactState')?.textContent||null,
        hostText:document.getElementById('artifactHost')?.innerText||null,
        hostHtml:document.getElementById('artifactHost')?.innerHTML||null
      }));
      await page.screenshot({path:path.join(outDir,'author-detail-debug.png'),fullPage:true});
      throw new Error('AUTHOR_DETAIL_COLLABORATION_MISSING '+JSON.stringify({diagnostics,pageErrors:errors,requestFailures,badResponses,consoleErrors}));
    }
    const text=await collab.innerText();
    expect(text.includes('ИНИЦИАТОР')&&text.includes('В ДЕЛЕ')&&text.includes('ПОЗВАНЫ'),'author detail hierarchy missing');
    expect(text.includes('ВИДНО · СВОЙ КРУГ'),'author detail visibility missing');
    expect(await page.locator('[data-invite-toggle]').count()===1,'author detail +ПОЗВАТЬ missing');
    await page.locator('[data-invite-toggle]').click();await page.locator('#artifactInviteSearch').fill('Но');await page.locator('[data-invite-search]').click();
    await page.waitForSelector('[data-invite-profile]');
    const resultText=await page.locator('[data-invite-results]').innerText();
    expect(!/@invalid|private-/i.test(resultText),'selector leaked private email');
    await page.locator('[data-remove-participant]').first().click();
    await page.waitForFunction(()=>document.querySelectorAll('[data-remove-participant]').length<4);
    expect(!errors.length,'author detail errors: '+errors.join(' | '));await ctx.close();
  }

  // INVITED -> JOINED.
  {
    const{ctx,page}=await openDetail(browser,'invited');
    expect((await page.locator('[data-artifact-collaboration]').innerText()).includes('ЗОВЁТ ВАС В ЭТУ ИДЕЮ'),'invited copy missing');
    await page.getByRole('button',{name:'ПРИСОЕДИНИТЬСЯ'}).click();
    await page.waitForSelector('[data-invite-state="JOINED"]');
    expect((await page.locator('[data-invite-state="JOINED"]').innerText()).includes('ВЫ В ДЕЛЕ'),'join state missing');
    await ctx.close();
  }

  // INVITED -> DECLINED ends Circle read and converges on generic unavailable.
  {
    const{ctx,page}=await openDetail(browser,'invited');
    await page.getByRole('button',{name:'НЕ СЕЙЧАС'}).click();
    await page.waitForFunction(()=>document.getElementById('artifactState')?.textContent==='NOT FOUND');
    const text=await page.locator('#artifactHost').innerText();
    expect(text.includes('Artifact не найден или больше недоступен.'),'decline: generic unavailable copy missing');
    expect(!/СВОЙ КРУГ|IDEA A|Габиль|участник/i.test(text),'decline: hidden Circle existence leaked');
    await ctx.close();
  }

  // JOINED -> LEFT.
  {
    const{ctx,page}=await openDetail(browser,'joined');
    await page.getByRole('button',{name:'ВЫЙТИ'}).click();
    await page.waitForFunction(()=>document.getElementById('artifactState')?.textContent==='NOT FOUND');
    expect(!(await page.locator('#artifactHost').innerText()).includes('IDEA A'),'left: Circle detail remained visible');
    await ctx.close();
  }

  // Outsider no-oracle.
  {
    const{ctx,page}=await openDetail(browser,'outsider');
    const text=await page.locator('#artifactHost').innerText();
    expect((await page.locator('#artifactState').innerText())==='NOT FOUND','outsider: terminal state not generic');
    expect(!/IDEA A|СВОЙ КРУГ|Габиль|В ДЕЛЕ|ПОЗВАНЫ/i.test(text),'outsider: Circle existence hint leaked');
    await ctx.close();
  }

  // JOINED participant creation stays RELATED_TO-only; delete authority comes only from server can_delete.
  {
    const{ctx,page,errors}=await openBoard(browser,'relations');
    const card=page.locator('.dc-notice[data-artifact="'+A+'"]');
    const initialSummary=card.locator('[data-relation-block] summary');
    await initialSummary.click();
    const initialBlock=card.locator('[data-relation-block][open]');
    await initialBlock.waitFor({state:'attached',timeout:6000});
    await initialBlock.locator('[data-relation-add]').click();
    const initialForm=initialBlock.locator('[data-relation-form]');
    await initialForm.waitFor({state:'visible',timeout:6000});
    const select=initialForm.locator('[data-relation-choice]');
    const options=await select.locator('option').evaluateAll(nodes=>nodes.map(node=>({value:node.value,label:node.textContent||''})));
    const labels=options.map(option=>option.label);
    expect(labels.length>0,'participant relations: no choices');
    expect(labels.every(label=>label.startsWith('СВЯЗАНО С')),'participant relations exposed non-RELATED_TO: '+labels.join(' | '));
    const eventChoice=options.find(option=>option.label.includes('QA EVENT'));
    expect(Boolean(eventChoice),'participant relations: readable QA EVENT target missing');
    if(eventChoice){
      await select.selectOption(eventChoice.value);
      await initialForm.locator('[data-relation-save]').click();
      await page.waitForSelector('.dc-notice[data-artifact="'+A+'"] [data-relation-id="rel-created"]',{state:'attached'});
    }

    // Simulated reload/read must reconstruct delete authority exclusively from row.can_delete.
    await page.reload({waitUntil:'domcontentloaded'});
    await page.waitForFunction(
      artifactId=>Boolean(
        document.documentElement.dataset.dcBoardRelations==='ready'
        &&document.querySelector('[data-board-source="platform"][data-relation-source-id="qa-event"]')
        &&document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-id="rel-created"]')
      ),
      A,
      {timeout:8000}
    );
    const reloadedCard=page.locator('.dc-notice[data-artifact="'+A+'"]');
    const summary=reloadedCard.locator('[data-relation-block] summary');
    await summary.waitFor({state:'visible',timeout:6000});

    // Real user click must open Relations, not the Artifact fullscreen card owner.
    await summary.click();
    await reloadedCard.locator('[data-relation-block][open]').waitFor({state:'attached',timeout:6000});
    if(await page.locator('.dc-artifact-overlay:not([hidden])').count()!==0)throw new Error('RELATION_SUMMARY_CLICK_OPENED_ARTIFACT_FULLSCREEN');

    // Re-query after opening: canonical presentation may refresh and replace relation DOM.
    const freshCard=page.locator('.dc-notice[data-artifact="'+A+'"]');
    const freshBlock=freshCard.locator('[data-relation-block][open]');
    const createdRow=freshBlock.locator('[data-relation-id="rel-created"]');
    const otherRow=freshBlock.locator('[data-relation-id="rel-other"]');
    const directionalRow=freshBlock.locator('[data-relation-id="rel-directional"]');

    await createdRow.waitFor({state:'visible',timeout:6000});
    const createdDelete=createdRow.locator('[data-relation-delete]');
    await createdDelete.waitFor({state:'visible',timeout:6000});
    expect(await createdDelete.count()===1,'can_delete=true relation must expose visible delete control after reload/open/read');

    expect(await otherRow.count()===1,'negative RELATED_TO fixture missing after reload/open/read');
    expect(await otherRow.locator('[data-relation-delete]').count()===0,'can_delete=false RELATED_TO must not expose delete control');

    expect(await directionalRow.count()===1,'negative directional fixture missing after reload/open/read');
    expect(await directionalRow.locator('[data-relation-delete]').count()===0,'can_delete=false directional relation must not expose delete control');

    const deleteCallsBefore=await page.evaluate(()=>globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_board_relation_delete_v1').length);
    await createdDelete.click();
    await page.waitForFunction(
      before=>globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_board_relation_delete_v1').length>before,
      deleteCallsBefore,
      {timeout:6000}
    );
    await page.waitForFunction(
      artifactId=>!document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-id="rel-created"]'),
      A,
      {timeout:6000}
    );
    expect(await page.locator('.dc-notice[data-artifact="'+A+'"] [data-relation-id="rel-created"]').count()===0,'server-authorized relation delete did not disappear');
    expect(!errors.length,'participant relations errors: '+errors.join(' | '));await ctx.close();
  }

  // Durable native keyboard acceptance: prove current focus ownership immediately
  // before one browser keyboard delivery, then assert the current canonical block stays open.
  for(const key of ['Enter',' ']){
    const{ctx,page,errors}=await openBoard(browser,'relations');
    const card=page.locator('.dc-notice[data-artifact="'+A+'"]');
    const summary=card.locator('[data-relation-block] summary');
    await summary.waitFor({state:'visible',timeout:6000});
    await summary.focus();

    const focusProof=await page.evaluate(artifactId=>{
      const currentSummary=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block] summary');
      const active=document.activeElement;
      return{
        activeIsCurrentSummary:Boolean(currentSummary&&active===currentSummary),
        currentSummaryConnected:Boolean(currentSummary?.isConnected),
        activeConnected:Boolean(active?.isConnected),
        canonicalIdentity:Boolean(currentSummary&&active===currentSummary&&currentSummary===document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block] summary')),
        focus:new URL(location.href).searchParams.get('focus'),
        overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])'))
      };
    },A);

    if(!focusProof.activeIsCurrentSummary||!focusProof.currentSummaryConnected||!focusProof.activeConnected||!focusProof.canonicalIdentity){
      throw new Error('RELATION_KEYBOARD_FOCUS_TARGET_MISMATCH '+JSON.stringify({key,focusProof}));
    }

    await page.keyboard.press(key);

    await page.waitForFunction(artifactId=>{
      const current=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]');
      return Boolean(current&&current.isConnected&&current.open===true);
    },A,{timeout:6000});

    const after=await page.evaluate(artifactId=>({
      open:Boolean(document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]')?.open),
      focus:new URL(location.href).searchParams.get('focus'),
      overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])'))
    }),A);

    expect(after.open===true,`relation summary keyboard ${JSON.stringify(key)} did not leave current canonical Relations open`);
    expect(after.focus===null,`relation summary keyboard ${JSON.stringify(key)} wrote focus URL ${after.focus}`);
    expect(after.overlay===false,`relation summary keyboard ${JSON.stringify(key)} opened Artifact fullscreen`);
    expect(!errors.length,`relation summary keyboard ${JSON.stringify(key)} errors: ${errors.join(' | ')}`);
    await ctx.close();
  }

  // Existing card-body activation still opens the canonical Artifact fullscreen.
  {
    const{ctx,page,errors}=await openBoard(browser,'author');
    const card=page.locator('.dc-notice[data-artifact="'+A+'"]');
    await card.click({position:{x:12,y:12}});
    await page.locator('.dc-artifact-overlay:not([hidden])').waitFor({state:'attached',timeout:6000});
    expect(!errors.length,'card-body open errors: '+errors.join(' | '));await ctx.close();
  }

  // Mobile acceptance resolves canonical summary + geometry + browser hit-test atomically.
  // locator.tap() is intentionally not used: it was proven to retarget to .dc-board-open-hint
  // while coordinate browser hit-testing resolved the same visible point to Relations summary.
  for(const [runIndex,width] of [390,390,390,360].entries()){
    const{ctx,page,errors}=await openBoard(browser,'relations',{width,height:844},{hasTouch:true});

    try{
      const ready=await page.waitForFunction(artifactId=>{
        const card=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"]');
        const block=card?.querySelector('[data-relation-block]');
        const summary=block?.querySelector('summary');
        if(!card||!block||!summary||!summary.isConnected)return false;
        const rect=summary.getBoundingClientRect();
        if(!(rect.width>0&&rect.height>0))return false;
        const x=rect.left+rect.width/2;
        const y=rect.top+rect.height/2;
        const hit=document.elementFromPoint(x,y);
        if(!(hit&&(hit===summary||summary.contains(hit))))return false;
        globalThis.__QA_RELATION_MOBILE_CANONICAL_HIT__={
          x,y,
          focus:new URL(location.href).searchParams.get('focus'),
          overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
          viewportPanning:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
          boardDragging:document.documentElement.dataset.boardDragging||null,
          positionWrites:Number(globalThis.__QA_POSITION_WRITES__||0)
        };
        return true;
      },A,{timeout:6000,polling:'raf'});
      await ready.dispose();
    }catch(error){
      throw new Error('RELATION_MOBILE_CANONICAL_HIT_TIMEOUT '+JSON.stringify({width,runIndex}));
    }

    const hit=await page.evaluate(()=>globalThis.__QA_RELATION_MOBILE_CANONICAL_HIT__);
    const center={x:hit.x,y:hit.y};

    await page.evaluate(artifactId=>{
      const viewport=document.querySelector('.dc-spatial-viewport');
      globalThis.__QA_RELATION_SUMMARY_STARTED_PAN__=false;
      globalThis.__QA_RELATION_MOBILE_POINTERDOWN__=null;

      document.addEventListener('pointerdown',event=>{
        const card=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"]');
        const block=card?.querySelector('[data-relation-block]');
        const summary=block?.querySelector('summary');
        const targetInside=Boolean(summary&&event.target&&(event.target===summary||summary.contains(event.target)));
        globalThis.__QA_RELATION_MOBILE_POINTERDOWN__={
          pointerType:event.pointerType||null,
          target:event.target?.outerHTML?.slice(0,240)||null,
          targetInsideCurrentSummary:targetInside,
          currentSummaryConnected:Boolean(summary?.isConnected),
          focus:new URL(location.href).searchParams.get('focus'),
          overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
          viewportPanning:Boolean(viewport?.classList.contains('is-panning')),
          boardDragging:document.documentElement.dataset.boardDragging||null,
          positionWrites:Number(globalThis.__QA_POSITION_WRITES__||0)
        };
      },{capture:true,once:true});

      viewport?.addEventListener('pointerdown',event=>{
        if(event.target.closest?.('[data-relation-block] summary')&&viewport.classList.contains('is-panning'))globalThis.__QA_RELATION_SUMMARY_STARTED_PAN__=true;
      },{once:true});
    },A);

    await page.touchscreen.tap(center.x,center.y);

    const pointerdown=await page.evaluate(()=>globalThis.__QA_RELATION_MOBILE_POINTERDOWN__);
    if(
      !pointerdown
      ||pointerdown.pointerType!=='touch'
      ||pointerdown.targetInsideCurrentSummary!==true
      ||pointerdown.currentSummaryConnected!==true
    ){
      throw new Error('RELATION_MOBILE_POINTER_TARGET_MISMATCH '+JSON.stringify({width,runIndex,center,pointerdown}));
    }

    await page.waitForFunction(artifactId=>{
      const current=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]');
      return Boolean(current&&current.isConnected&&current.open===true);
    },A,{timeout:6000});

    const after=await page.evaluate(artifactId=>({
      open:Boolean(document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]')?.open),
      focus:new URL(location.href).searchParams.get('focus'),
      overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
      viewportPanning:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
      panStarted:Boolean(globalThis.__QA_RELATION_SUMMARY_STARTED_PAN__),
      boardDragging:document.documentElement.dataset.boardDragging||null,
      positionWrites:Number(globalThis.__QA_POSITION_WRITES__||0)
    }),A);

    expect(pointerdown.focus===null,`mobile ${width} run ${runIndex+1}: focus existed at pointerdown`);
    expect(pointerdown.overlay===false,`mobile ${width} run ${runIndex+1}: Artifact overlay existed at pointerdown`);
    expect(pointerdown.boardDragging===null,`mobile ${width} run ${runIndex+1}: pointerdown entered card drag owner`);
    expect(pointerdown.positionWrites===hit.positionWrites,`mobile ${width} run ${runIndex+1}: position write occurred before pointerdown acceptance`);
    expect(after.open===true,`mobile ${width} run ${runIndex+1}: current Relations block not open after coordinate touch`);
    expect(after.focus===null,`mobile ${width} run ${runIndex+1}: coordinate touch wrote focus URL ${after.focus}`);
    expect(after.overlay===false,`mobile ${width} run ${runIndex+1}: coordinate touch opened Artifact fullscreen`);
    expect(after.panStarted===false&&!after.viewportPanning,`mobile ${width} run ${runIndex+1}: coordinate touch initiated Board pan`);
    expect(after.boardDragging===null,`mobile ${width} run ${runIndex+1}: coordinate touch left card drag active`);
    expect(after.positionWrites===hit.positionWrites,`mobile ${width} run ${runIndex+1}: coordinate touch caused board position write`);
    expect(!errors.length,`mobile ${width} run ${runIndex+1}: coordinate touch errors: ${errors.join(' | ')}`);
    await ctx.close();
  }

  // Diagnostic-only mobile semantics for the visible decorative open-hint area.
  const openHintTrace={};
  {
    const{ctx,page,errors}=await openBoard(browser,'relations',{width:390,height:844},{hasTouch:true});
    const geometry=await page.evaluate(artifactId=>{
      const card=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"]');
      const hint=card?.querySelector('.dc-board-open-hint');
      const summary=card?.querySelector('[data-relation-block] summary');
      const viewport=document.querySelector('.dc-spatial-viewport');
      const rect=node=>{
        const r=node?.getBoundingClientRect();
        return r?{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}:null;
      };
      const intersect=(...rects)=>{
        if(rects.some(r=>!r))return null;
        const left=Math.max(...rects.map(r=>r.left));
        const top=Math.max(...rects.map(r=>r.top));
        const right=Math.min(...rects.map(r=>r.right));
        const bottom=Math.min(...rects.map(r=>r.bottom));
        const width=Math.max(0,right-left),height=Math.max(0,bottom-top);
        return{left,top,right,bottom,width,height,area:width*height};
      };
      const hintRect=rect(hint),cardRect=rect(card),summaryRect=rect(summary),viewportRect=rect(viewport);
      const style=hint?getComputedStyle(hint):null;
      const center=hintRect?{x:hintRect.left+hintRect.width/2,y:hintRect.top+hintRect.height/2}:null;
      const hit=center?document.elementFromPoint(center.x,center.y):null;
      return{
        hintRect,cardRect,summaryRect,viewportRect,
        hintDisplay:style?.display||null,
        hintVisibility:style?.visibility||null,
        hintOpacity:style?.opacity||null,
        hintPointerEvents:style?.pointerEvents||null,
        hintCardIntersection:intersect(hintRect,cardRect),
        hintViewportIntersection:intersect(hintRect,viewportRect),
        hintVisibleIntersection:intersect(hintRect,cardRect,viewportRect),
        cardClientHeight:card?.clientHeight??null,
        cardScrollHeight:card?.scrollHeight??null,
        cardOverflow:card?getComputedStyle(card).overflow:null,
        cardOverflowX:card?getComputedStyle(card).overflowX:null,
        cardOverflowY:card?getComputedStyle(card).overflowY:null,
        center,
        elementFromPoint:center?(hit?.outerHTML?.slice(0,260)||null):null,
        elementsFromPoint:center?document.elementsFromPoint(center.x,center.y).slice(0,6).map(el=>({
          tag:el.tagName,
          className:typeof el.className==='string'?el.className:'',
          id:el.id||''
        })):[],
        focus:new URL(location.href).searchParams.get('focus'),
        overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
        relationsOpen:Boolean(card?.querySelector('[data-relation-block]')?.open)
      };
    },A);

    let hintTouch=null;
    const visiblyAvailable=Boolean(
      geometry.hintRect
      &&geometry.hintRect.width>0
      &&geometry.hintRect.height>0
      &&geometry.hintDisplay!=='none'
      &&geometry.hintVisibility!=='hidden'
      &&Number(geometry.hintOpacity||0)>0
      &&geometry.hintVisibleIntersection?.area>0
    );

    if(visiblyAvailable&&geometry.center){
      await page.evaluate(artifactId=>{
        globalThis.__QA_OPEN_HINT_SEMANTICS_EVENTS__={pointerdown:null,click:null};
        const snapshot=(event)=>({
          type:event.type,
          pointerType:event.pointerType||null,
          clientX:Number.isFinite(event.clientX)?event.clientX:null,
          clientY:Number.isFinite(event.clientY)?event.clientY:null,
          target:event.target?.outerHTML?.slice(0,260)||null,
          focus:new URL(location.href).searchParams.get('focus'),
          overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
          relationsOpen:Boolean(document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]')?.open),
          viewportPanning:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
          boardDragging:document.documentElement.dataset.boardDragging||null
        });
        document.addEventListener('pointerdown',event=>{
          globalThis.__QA_OPEN_HINT_SEMANTICS_EVENTS__.pointerdown=snapshot(event);
        },{capture:true,once:true});
        document.addEventListener('click',event=>{
          globalThis.__QA_OPEN_HINT_SEMANTICS_EVENTS__.click=snapshot(event);
        },{capture:true,once:true});
      },A);

      await page.touchscreen.tap(geometry.center.x,geometry.center.y);
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      hintTouch=await page.evaluate(artifactId=>({
        events:globalThis.__QA_OPEN_HINT_SEMANTICS_EVENTS__,
        focus:new URL(location.href).searchParams.get('focus'),
        overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
        relationsOpen:Boolean(document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]')?.open),
        viewportPanning:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
        boardDragging:document.documentElement.dataset.boardDragging||null
      }),A);
    }

    openHintTrace.hint={geometry,visiblyAvailable,touch:hintTouch,errors};
    await ctx.close();
  }

  // Separate canonical parent-card activation control on a proven non-interactive point.
  {
    const{ctx,page,errors}=await openBoard(browser,'relations',{width:390,height:844},{hasTouch:true});
    try{
      const ready=await page.waitForFunction(artifactId=>{
        const card=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"]');
        if(!card||!card.isConnected)return false;
        const blocked='a,button,input,textarea,select,label,summary,dialog,[contenteditable="true"],[data-relation-block],.dc-board-open-hint';
        const cardRect=card.getBoundingClientRect();
        const candidates=[...card.querySelectorAll('h3,.dc-notice__body,.dc-notice__meta,p')];
        const points=[];
        for(const node of candidates){
          const r=node.getBoundingClientRect();
          if(r.width>0&&r.height>0)points.push({x:r.left+r.width/2,y:r.top+r.height/2,source:node.tagName+'.'+node.className});
        }
        for(const fy of [0.22,0.35,0.5,0.65]){
          for(const fx of [0.22,0.5,0.78]){
            points.push({x:cardRect.left+cardRect.width*fx,y:cardRect.top+cardRect.height*fy,source:'card-grid'});
          }
        }
        for(const point of points){
          const hit=document.elementFromPoint(point.x,point.y);
          if(!hit||!(hit===card||card.contains(hit)))continue;
          if(hit.closest?.(blocked))continue;
          globalThis.__QA_CARD_BODY_TOUCH_POINT__={
            x:point.x,y:point.y,source:point.source,
            hit:hit.outerHTML?.slice(0,260)||null,
            elementsFromPoint:document.elementsFromPoint(point.x,point.y).slice(0,6).map(el=>({
              tag:el.tagName,
              className:typeof el.className==='string'?el.className:'',
              id:el.id||''
            }))
          };
          return true;
        }
        return false;
      },A,{timeout:6000,polling:'raf'});
      await ready.dispose();
    }catch(error){
      openHintTrace.cardBody={ready:false,error:'CARD_BODY_TOUCH_POINT_TIMEOUT',errors};
      await ctx.close();
      throw new Error('OPEN_HINT_MOBILE_SEMANTICS_TRACE '+JSON.stringify({classification:'H5',...openHintTrace}));
    }

    const point=await page.evaluate(()=>globalThis.__QA_CARD_BODY_TOUCH_POINT__);
    await page.evaluate(artifactId=>{
      globalThis.__QA_CARD_BODY_SEMANTICS_EVENTS__={pointerdown:null,click:null};
      const snapshot=(event)=>({
        type:event.type,
        pointerType:event.pointerType||null,
        clientX:Number.isFinite(event.clientX)?event.clientX:null,
        clientY:Number.isFinite(event.clientY)?event.clientY:null,
        target:event.target?.outerHTML?.slice(0,260)||null,
        focus:new URL(location.href).searchParams.get('focus'),
        overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
        relationsOpen:Boolean(document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]')?.open)
      });
      document.addEventListener('pointerdown',event=>{
        globalThis.__QA_CARD_BODY_SEMANTICS_EVENTS__.pointerdown=snapshot(event);
      },{capture:true,once:true});
      document.addEventListener('click',event=>{
        globalThis.__QA_CARD_BODY_SEMANTICS_EVENTS__.click=snapshot(event);
      },{capture:true,once:true});
    },A);

    await page.touchscreen.tap(point.x,point.y);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const outcome=await page.evaluate(artifactId=>({
      events:globalThis.__QA_CARD_BODY_SEMANTICS_EVENTS__,
      focus:new URL(location.href).searchParams.get('focus'),
      overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
      relationsOpen:Boolean(document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]')?.open)
    }),A);
    openHintTrace.cardBody={ready:true,point,outcome,errors};
    await ctx.close();
  }

  {
    const hint=openHintTrace.hint;
    const body=openHintTrace.cardBody;
    const hintFullscreen=Boolean(hint?.touch?.overlay&&hint?.touch?.focus==='artifact:'+A);
    const hintRelations=Boolean(hint?.touch?.relationsOpen&&!hint?.touch?.overlay);
    const hintNoAction=Boolean(hint?.visiblyAvailable&&hint?.touch&&!hint.touch.overlay&&!hint.touch.relationsOpen&&hint.touch.focus===null);
    const bodyFullscreen=Boolean(body?.outcome?.overlay&&body?.outcome?.focus==='artifact:'+A);
    let classification;
    if(!hint?.visiblyAvailable)classification='H3';
    else if(hintFullscreen&&bodyFullscreen)classification='H1';
    else if(hintRelations&&bodyFullscreen)classification='H2';
    else if(hintNoAction&&bodyFullscreen)classification='H4';
    else classification='H5';
    throw new Error('OPEN_HINT_MOBILE_SEMANTICS_TRACE '+JSON.stringify({classification,...openHintTrace}));
  }

  // Existing 390/360 layout + Artifact detail mobile proof.
  for(const width of [390,360]){
    const{ctx,page,errors}=await openBoard(browser,'author',{width,height:844});
    const card=page.locator('.dc-notice[data-artifact="'+A+'"]');
    const cardOverflow=await card.evaluate(el=>el.scrollWidth>el.clientWidth+1);
    const collabOverflow=await card.locator('[data-collaboration-card]').evaluate(el=>el.scrollWidth>el.clientWidth+1);
    expect(!cardOverflow&&!collabOverflow,`mobile ${width}: Idea card horizontal overflow`);
    await card.click({position:{x:10,y:10}});
    const frame=page.frameLocator('.dc-artifact-overlay iframe');
    await frame.locator('[data-artifact-collaboration]').waitFor({state:'visible',timeout:6000});
    const detailOverflow=await frame.locator('body').evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
    expect(!detailOverflow,`mobile ${width}: Artifact detail horizontal overflow`);
    expect(!errors.length,`mobile ${width}: page errors: ${errors.join(' | ')}`);
    await page.screenshot({path:path.join(outDir,`mobile-${width}.png`),fullPage:true});
    await ctx.close();
  }
}finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
}
if(failures.length){console.error('ARTIFACT COLLABORATION BROWSER BLOCKED');for(const item of failures)console.error('- '+item);process.exit(1)}
console.log('ARTIFACT COLLABORATION BROWSER ACCEPTANCE COMPLETE');
console.log('✓ IDEA-only visibility presentation, independent rosters and canonical detail collaboration UI exercised');
console.log('✓ invited/joined/declined/left/author/remove/no-oracle scenarios exercised');
console.log('✓ participant Relations UI exposes RELATED_TO-only participant path + server can_delete create→reload→open→delete round-trip');
console.log('✓ desktop, 390px and 360px overflow checks exercised');
