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
const ids={author:AUTHOR,invited:INVITED,multiinvited:INVITED,joined:INVITED,outsider:'ffffffff-ffff-4fff-8fff-ffffffffffff',owner:'99999999-9999-4999-8999-999999999999',relations:INVITED};
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
 [B]:{[NIKITA]:'JOINED',[ANDRUS]:'INVITED',...(mode==='multiinvited'?{[INVITED]:'INVITED'}:{})}
};
const profiles=[
 {profile_id:AUTHOR,display_name:'Габиль Очень Длинное Имя Инициатора',nickname:'gabil',avatar_url:null,member_since:'2026-09-01'},
 {profile_id:'77777777-7777-4777-8777-777777777777',display_name:'Новый Зарегистрированный Профиль',nickname:'newperson',avatar_url:null,member_since:'2026-09-01'},
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
 await ctx.addInitScript(({mode})=>{globalThis.__QA_COLLAB_MODE__=mode;const ids={author:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',invited:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',multiinvited:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',joined:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',outsider:'ffffffff-ffff-4fff-8fff-ffffffffffff',owner:'99999999-9999-4999-8999-999999999999',relations:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'};try{localStorage.setItem('dc:board:tutorial:v21:'+(ids[mode]||ids.author)+':member',JSON.stringify({done:true}));sessionStorage.setItem('dc_first_artifact_spotlight_dismissed_v1','1')}catch{}},{mode});
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

  // BQA-24: invited Member sees a compact indicator + highlighted card on desktop/390/360.
  for(const width of [1440,390,360]){
    const mobile=width<500;
    const viewport={width,height:mobile?844:900};
    const{ctx,page,errors}=await openBoard(browser,'invited',viewport,{hasTouch:mobile});
    const indicator=page.locator('[data-board-invitation-indicator]');
    await indicator.waitFor({state:'visible',timeout:6000});
    expect((await indicator.innerText()).trim()==='ПРИГЛАШЕНИЯ · 1',`BQA-24 ${width}: single invitation indicator mismatch`);
    const invitedCard=page.locator('.dc-notice[data-artifact="'+A+'"][data-collab-my-state="INVITED"]');
    expect(await invitedCard.count()===1,`BQA-24 ${width}: invited Circle Idea missing`);
    expect(await invitedCard.evaluate(el=>el.classList.contains('is-invited-to-me')),`BQA-24 ${width}: invited card not visually marked`);
    expect((await invitedCard.locator('[data-collaboration-card]').innerText()).includes('ВАС ЗОВУТ'),`BQA-24 ${width}: invited card lacks explicit signal`);
    const rect=await indicator.boundingBox();
    expect(Boolean(rect&&rect.left>=0&&rect.right<=width+1&&rect.width>0&&rect.height>=35),`BQA-24 ${width}: indicator outside/tiny ${JSON.stringify(rect)}`);
    if(mobile)await indicator.tap();else await indicator.click();
    await page.waitForFunction(artifactId=>new URL(location.href).searchParams.get('focus')==='artifact:'+artifactId,A,{timeout:6000});
    await page.locator('.dc-artifact-overlay:not([hidden])').waitFor({state:'attached',timeout:6000});
    const src=await page.locator('.dc-artifact-overlay iframe').getAttribute('src');
    expect(String(src||'').includes(A),`BQA-24 ${width}: indicator did not open exact invited Idea`);
    expect(!errors.length,`BQA-24 ${width}: page errors: ${errors.join(' | ')}`);
    await ctx.close();
  }

  // BQA-24: multiple invitations remain reachable without an inbox; canonical Board view is restored before opening.
  for(const width of [1440,390,360]){
    const mobile=width<500;
    const viewport={width,height:mobile?844:900};
    const{ctx,page,errors}=await openBoard(browser,'multiinvited',viewport,{hasTouch:mobile});
    const indicator=page.locator('[data-board-invitation-indicator]');
    await indicator.waitFor({state:'visible',timeout:6000});
    expect((await indicator.innerText()).trim()==='ПРИГЛАШЕНИЯ · 2',`BQA-24 multi ${width}: count mismatch`);
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('dc:board-request-view',{detail:{view:'current-program'}})));
    await page.waitForFunction(()=>document.documentElement.dataset.boardView==='current-program');
    if(mobile)await indicator.tap();else await indicator.click();
    await page.waitForFunction(artifactId=>new URL(location.href).searchParams.get('focus')==='artifact:'+artifactId,A,{timeout:6000});
    expect(await page.evaluate(()=>document.documentElement.dataset.boardView)==='all',`BQA-24 multi ${width}: invitation did not restore canonical ALL view`);
    await page.locator('.dc-artifact-overlay__close').click();
    await page.waitForFunction(()=>new URL(location.href).searchParams.get('focus')===null,{timeout:6000});
    await page.locator('.dc-artifact-overlay').waitFor({state:'hidden',timeout:6000});
    await indicator.waitFor({state:'visible',timeout:6000});
    if(mobile)await indicator.tap();else await indicator.click();
    await page.waitForFunction(artifactId=>new URL(location.href).searchParams.get('focus')==='artifact:'+artifactId,B,{timeout:6000});
    const src=await page.locator('.dc-artifact-overlay iframe').getAttribute('src');
    expect(String(src||'').includes(B),`BQA-24 multi ${width}: second invitation unreachable`);
    expect(!errors.length,`BQA-24 multi ${width}: page errors: ${errors.join(' | ')}`);
    await ctx.close();
  }

  // BQA-24 CIRCLE negative: outsider receives neither hidden Idea nor invitation signal.
  {
    const{ctx,page,errors}=await openBoard(browser,'outsider');
    expect(await page.locator('.dc-notice[data-artifact="'+A+'"]').count()===0,'BQA-24 CIRCLE negative: hidden Idea leaked');
    expect(await page.locator('[data-board-invitation-indicator]').count()===0,'BQA-24 CIRCLE negative: invitation indicator leaked');
    expect(!(await page.locator('body').innerText()).includes('ВАС ЗОВУТ'),'BQA-24 CIRCLE negative: invitation copy leaked');
    expect(!errors.length,'BQA-24 CIRCLE negative page errors: '+errors.join(' | '));
    await ctx.close();
  }

  // BQA-28: canonical participant state is re-read on return/BFCache without manual reload.
  {
    const{ctx,page,errors}=await openBoard(browser,'author');
    const candidate='77777777-7777-4777-8777-777777777777';
    await page.evaluate(({artifactId,candidate})=>{
      globalThis.__QA_PARTICIPATION__[artifactId][candidate]='INVITED';
      window.dispatchEvent(new CustomEvent('dc:artifact-collaboration-changed',{detail:{artifactId}}));
      window.dispatchEvent(new CustomEvent('dc:board-artifact-closed'));
    },{artifactId:A,candidate});
    await page.waitForFunction(artifactId=>document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-collaboration-card]')?.textContent?.includes('Новый Зарегистрированный Профиль'),A,{timeout:6000});
    await page.evaluate(({artifactId,candidate})=>{
      globalThis.__QA_PARTICIPATION__[artifactId][candidate]='REMOVED';
      window.dispatchEvent(new CustomEvent('dc:artifact-collaboration-changed',{detail:{artifactId}}));
      window.dispatchEvent(new CustomEvent('dc:board-close-artifact'));
    },{artifactId:A,candidate});
    await page.waitForFunction(artifactId=>!document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-collaboration-card]')?.textContent?.includes('Новый Зарегистрированный Профиль'),A,{timeout:6000});
    expect(!errors.length,'BQA-28 author INVITED/REMOVED refresh errors: '+errors.join(' | '));
    await ctx.close();
  }
  {
    const{ctx,page,errors}=await openBoard(browser,'invited');
    await page.evaluate(({artifactId,userId})=>{
      globalThis.__QA_PARTICIPATION__[artifactId][userId]='JOINED';
      const event=new Event('pageshow');Object.defineProperty(event,'persisted',{value:true});window.dispatchEvent(event);
    },{artifactId:A,userId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'});
    await page.waitForFunction(artifactId=>document.querySelector('.dc-notice[data-artifact="'+artifactId+'"]')?.dataset.collabMyState==='JOINED',A,{timeout:6000});
    expect(await page.locator('[data-board-invitation-indicator]').count()===0,'BQA-28 JOINED: stale invitation indicator remained');
    expect((await page.locator('.dc-notice[data-artifact="'+A+'"] [data-collaboration-card]').innerText()).includes('ВЫ В ДЕЛЕ'),'BQA-28 JOINED: roster/card state stale');
    expect(!errors.length,'BQA-28 JOINED BFCache refresh errors: '+errors.join(' | '));
    await ctx.close();
  }
  {
    const{ctx,page,errors}=await openBoard(browser,'invited');
    await page.evaluate(({artifactId,userId})=>{
      globalThis.__QA_PARTICIPATION__[artifactId][userId]='DECLINED';
      window.dispatchEvent(new CustomEvent('dc:artifact-collaboration-changed',{detail:{artifactId}}));
      window.dispatchEvent(new CustomEvent('dc:board-artifact-closed'));
    },{artifactId:A,userId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'});
    await page.waitForFunction(artifactId=>!document.querySelector('.dc-notice[data-artifact="'+artifactId+'"]'),A,{timeout:6000});
    expect(await page.locator('[data-board-invitation-indicator]').count()===0,'BQA-28 DECLINED: stale invitation indicator remained');
    expect(!errors.length,'BQA-28 DECLINED refresh errors: '+errors.join(' | '));
    await ctx.close();
  }
  {
    const{ctx,page,errors}=await openBoard(browser,'joined');
    await page.evaluate(({artifactId,userId})=>{
      globalThis.__QA_PARTICIPATION__[artifactId][userId]='LEFT';
      window.dispatchEvent(new CustomEvent('dc:artifact-collaboration-changed',{detail:{artifactId}}));
      window.dispatchEvent(new CustomEvent('dc:board-close-artifact'));
    },{artifactId:A,userId:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'});
    await page.waitForFunction(artifactId=>!document.querySelector('.dc-notice[data-artifact="'+artifactId+'"]'),A,{timeout:6000});
    expect(!errors.length,'BQA-28 LEFT refresh errors: '+errors.join(' | '));
    await ctx.close();
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
    const removeControls=page.locator('[data-remove-participant]');
    expect(await removeControls.count()>0,'BQA-26 author removal control missing');
    const removeLabels=await removeControls.evaluateAll(nodes=>nodes.map(node=>({text:(node.textContent||'').trim(),aria:node.getAttribute('aria-label')||''})));
    expect(removeLabels.every(item=>item.text==='УБРАТЬ ИЗ ИДЕИ'&&/Убрать .* из идеи/i.test(item.aria)),'BQA-26 author removal meaning is ambiguous '+JSON.stringify(removeLabels));
    await removeControls.first().click();
    await page.waitForFunction(()=>document.querySelectorAll('[data-remove-participant]').length<4);
    expect(!errors.length,'author detail errors: '+errors.join(' | '));await ctx.close();
  }

  // BQA-25 desktop: INVITED primary hierarchy -> JOINED compact state.
  {
    const{ctx,page}=await openDetail(browser,'invited');
    expect((await page.locator('[data-artifact-collaboration]').innerText()).includes('ЗОВЁТ ВАС В ЭТУ ИДЕЮ'),'invited copy missing');
    const hierarchy=await page.evaluate(()=>{
      const primary=document.querySelector('[data-primary-viewer-action]');
      const content=document.querySelector('[data-artifact-content]');
      const cta=document.querySelector('[data-invite-decision="JOINED"]');
      const style=cta?getComputedStyle(cta):null;
      return{
        primaryBeforeContent:Boolean(primary&&content&&(primary.compareDocumentPosition(content)&Node.DOCUMENT_POSITION_FOLLOWING)),
        ctaBackground:style?.backgroundColor||null,
        ctaColor:style?.color||null,
        ctaHeight:cta?.getBoundingClientRect().height||0
      };
    });
    expect(hierarchy.primaryBeforeContent,'BQA-25 invited primary action is not before content '+JSON.stringify(hierarchy));
    expect(hierarchy.ctaBackground==='rgb(17, 17, 17)'&&hierarchy.ctaColor==='rgb(255, 255, 255)'&&hierarchy.ctaHeight>=55,'BQA-25 invited CTA visual hierarchy mismatch '+JSON.stringify(hierarchy));
    expect(await page.getByRole('button',{name:'НЕ СЕЙЧАС'}).count()===1,'BQA-25 invited secondary action missing');
    await page.getByRole('button',{name:'ПРИСОЕДИНИТЬСЯ'}).click();
    await page.waitForSelector('[data-invite-state="JOINED"]');
    expect((await page.locator('[data-invite-state="JOINED"]').innerText()).includes('ВЫ В ДЕЛЕ'),'join state missing');
    expect(await page.locator('[data-invite-state="JOINED"] button').count()===0,'BQA-25 joined state is not compact');
    expect(await page.locator('[data-destructive-leave] [data-leave-idea]').count()===1,'BQA-26 joined leave is not isolated at bottom');
    await ctx.close();
  }

  // BQA-25/26 detail hierarchy on 390/360.
  for(const width of [390,360]){
    const{ctx,page}=await openDetail(browser,'invited',{width,height:844});
    await page.waitForSelector('[data-invite-state="INVITED"]');
    const mobile=await page.evaluate(()=>{
      const cta=document.querySelector('[data-invite-decision="JOINED"]');
      const primary=document.querySelector('[data-primary-viewer-action]');
      const content=document.querySelector('[data-artifact-content]');
      const style=cta?getComputedStyle(cta):null;
      return{
        overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,
        primaryBeforeContent:Boolean(primary&&content&&(primary.compareDocumentPosition(content)&Node.DOCUMENT_POSITION_FOLLOWING)),
        ctaBackground:style?.backgroundColor||null,
        ctaColor:style?.color||null
      };
    });
    expect(!mobile.overflow&&mobile.primaryBeforeContent,'BQA-25 mobile '+width+' invited hierarchy/overflow '+JSON.stringify(mobile));
    expect(mobile.ctaBackground==='rgb(17, 17, 17)'&&mobile.ctaColor==='rgb(255, 255, 255)','BQA-25 mobile '+width+' CTA visual mismatch '+JSON.stringify(mobile));
    await page.getByRole('button',{name:'ПРИСОЕДИНИТЬСЯ'}).click();
    await page.waitForSelector('[data-invite-state="JOINED"]');
    expect(await page.locator('[data-invite-state="JOINED"] button').count()===0,'BQA-25 mobile '+width+' joined state is not compact');
    expect(await page.locator('[data-destructive-leave] [data-leave-idea]').count()===1,'BQA-26 mobile '+width+' leave not isolated at bottom');
    expect(!(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1)),'BQA-25/26 mobile '+width+' horizontal overflow');
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

  // BQA-26 JOINED -> deliberate two-step LEFT; cancel preserves state.
  {
    const{ctx,page}=await openDetail(browser,'joined');
    const before=await page.evaluate(()=>globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_artifact_leave_v1').length);
    await page.getByRole('button',{name:'ВЫЙТИ ИЗ ИДЕИ'}).click();
    await page.locator('[data-leave-confirmation]').waitFor({state:'visible'});
    expect(await page.evaluate(()=>globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_artifact_leave_v1').length)===before,'BQA-26 first activation called leave RPC');
    await page.getByRole('button',{name:'ОСТАТЬСЯ'}).click();
    expect(await page.locator('[data-invite-state="JOINED"]').count()===1,'BQA-26 cancel lost JOINED state');
    expect(await page.evaluate(()=>globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_artifact_leave_v1').length)===before,'BQA-26 cancel called leave RPC');
    await page.getByRole('button',{name:'ВЫЙТИ ИЗ ИДЕИ'}).click();
    await page.getByRole('button',{name:'ПОДТВЕРДИТЬ ВЫХОД'}).click();
    await page.waitForFunction(()=>document.getElementById('artifactState')?.textContent==='NOT FOUND');
    const after=await page.evaluate(()=>globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_artifact_leave_v1').length);
    expect(after===before+1,'BQA-26 confirmed leave did not produce exactly one canonical RPC '+JSON.stringify({before,after}));
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

  // Durable proof of the existing Artifact-detail Relations owner on mobile.
  const detailTrace={};

  const rectInfo=async(page,width)=>{
    return page.evaluate(width=>{
      const host=document.querySelector('.dc-board-relation-detail-host');
      const block=host?.querySelector('[data-relation-block][data-relation-detail="1"]');
      const summary=block?.querySelector('summary');
      const add=block?.querySelector('[data-relation-add]');
      const overlay=document.querySelector('.dc-artifact-overlay:not([hidden])');
      const panel=overlay?.querySelector('.dc-artifact-overlay__panel');
      const rect=node=>{
        const r=node?.getBoundingClientRect();
        return r?{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}:null;
      };
      const visible=(node,r)=>{
        if(!node||!r||!(r.width>0&&r.height>0))return false;
        const s=getComputedStyle(node);
        return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)>0
          &&r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight;
      };
      const hostRect=rect(host),blockRect=rect(block),summaryRect=rect(summary),addRect=rect(add),panelRect=rect(panel);
      const style=node=>node?{
        display:getComputedStyle(node).display,
        visibility:getComputedStyle(node).visibility,
        opacity:getComputedStyle(node).opacity,
        pointerEvents:getComputedStyle(node).pointerEvents,
        overflow:getComputedStyle(node).overflow,
        overflowX:getComputedStyle(node).overflowX,
        overflowY:getComputedStyle(node).overflowY
      }:null;
      return{
        width,
        viewportRect:{left:0,top:0,right:innerWidth,bottom:innerHeight,width:innerWidth,height:innerHeight},
        visualViewport:visualViewport?{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale,offsetLeft:visualViewport.offsetLeft,offsetTop:visualViewport.offsetTop}:null,
        panelRect,
        hostRect,blockRect,summaryRect,addRect,
        hostStyle:style(host),blockStyle:style(block),summaryStyle:style(summary),addStyle:style(add),
        hostVisible:visible(host,hostRect),
        blockVisible:visible(block,blockRect),
        summaryVisible:visible(summary,summaryRect),
        addVisible:visible(add,addRect),
        blockOpen:Boolean(block?.open),
        hostInsideViewport:Boolean(hostRect&&hostRect.left>=-1&&hostRect.top>=-1&&hostRect.right<=innerWidth+1&&hostRect.bottom<=innerHeight+1),
        summaryInsidePanel:Boolean(summaryRect&&panelRect&&summaryRect.left>=panelRect.left-1&&summaryRect.right<=panelRect.right+1&&summaryRect.top>=panelRect.top-1&&summaryRect.bottom<=panelRect.bottom+1),
        addInsidePanel:Boolean(addRect&&panelRect&&addRect.left>=panelRect.left-1&&addRect.right<=panelRect.right+1&&addRect.top>=panelRect.top-1&&addRect.bottom<=panelRect.bottom+1),
        horizontalOverflow:Boolean(host&&host.scrollWidth>host.clientWidth+1)||Boolean(block&&block.scrollWidth>block.clientWidth+1),
        hostClientWidth:host?.clientWidth??null,
        hostScrollWidth:host?.scrollWidth??null,
        blockClientWidth:block?.clientWidth??null,
        blockScrollWidth:block?.scrollWidth??null
      };
    },width);
  };

  const openArtifactDetail=async(page,width)=>{
    try{
      const ready=await page.waitForFunction(artifactId=>{
        const card=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"]');
        if(!card||!card.isConnected)return false;
        const blocked='a,button,input,textarea,select,label,summary,dialog,[contenteditable="true"],[data-relation-block],.dc-board-open-hint';
        const candidates=[...card.querySelectorAll('h3,.dc-notice__body,.dc-notice__meta,p')];
        for(const node of candidates){
          const r=node.getBoundingClientRect();
          if(!(r.width>0&&r.height>0))continue;
          const x=r.left+r.width/2,y=r.top+r.height/2;
          const hit=document.elementFromPoint(x,y);
          if(!hit||!(hit===card||card.contains(hit))||hit.closest?.(blocked))continue;
          globalThis.__QA_DETAIL_CARD_BODY_POINT__={x,y,target:hit.outerHTML?.slice(0,220)||null};
          return true;
        }
        return false;
      },A,{timeout:6000,polling:'raf'});
      await ready.dispose();
    }catch(error){
      return{opened:false,reason:'CARD_BODY_POINT_TIMEOUT'};
    }
    const point=await page.evaluate(()=>globalThis.__QA_DETAIL_CARD_BODY_POINT__);
    await page.touchscreen.tap(point.x,point.y);
    try{
      await page.waitForFunction(artifactId=>(
        new URL(location.href).searchParams.get('focus')==='artifact:'+artifactId
        &&Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])'))
      ),A,{timeout:6000});
    }catch(error){
      const state=await page.evaluate(()=>({
        focus:new URL(location.href).searchParams.get('focus'),
        overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])'))
      }));
      return{opened:false,reason:'ARTIFACT_OVERLAY_TIMEOUT',point,state};
    }
    return{opened:true,point,state:await page.evaluate(()=>({
      focus:new URL(location.href).searchParams.get('focus'),
      overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])'))
    }))};
  };

  const tapCenter=async(page,selector)=>{
    const point=await page.evaluate(selector=>{
      const node=document.querySelector(selector);
      const r=node?.getBoundingClientRect();
      if(!node||!r||!(r.width>0&&r.height>0))return null;
      return{x:r.left+r.width/2,y:r.top+r.height/2};
    },selector);
    if(!point)return false;
    await page.touchscreen.tap(point.x,point.y);
    return true;
  };

  const inlineIdeaRelationsHidden=async page=>page.evaluate(artifactId=>{
    const block=document.querySelector('.dc-spatial-world>.dc-notice[data-artifact="'+artifactId+'"][data-artifact-subtype="idea"]>[data-relation-block]');
    if(!block)return false;
    const style=getComputedStyle(block);
    return style.display==='none'&&block.getClientRects().length===0;
  },A);


  // 390px: full JOINED participant detail create/delete proof.
  {
    const width=390;
    const{ctx,page,errors}=await openBoard(browser,'relations',{width,height:844},{hasTouch:true});
    const record={width,errors,opened:null,geometry:null,create:null,delete:null,capability:null,overflow:null,inlineHidden:null};
    record.inlineHidden=await inlineIdeaRelationsHidden(page);
    expect(record.inlineHidden,'mobile 390 detail owner: inline IDEA Relations remains visibly rendered');
    const opened=await openArtifactDetail(page,width);
    record.opened=opened;
    if(!opened.opened){
      record.classification='D2';
    }else{
      let hostPresent=true;
      try{
        await page.waitForSelector('.dc-board-relation-detail-host [data-relation-block][data-relation-detail="1"][open]',{state:'visible',timeout:6000});
      }catch(error){hostPresent=false}
      if(!hostPresent){
        record.classification='D3';
      }else{
        record.geometry=await rectInfo(page,width);
        record.overflow=record.geometry.horizontalOverflow;
        const geometryPass=record.geometry.hostVisible&&record.geometry.blockVisible&&record.geometry.summaryVisible&&record.geometry.addVisible
          &&record.geometry.summaryInsidePanel&&record.geometry.addInsidePanel
          &&record.geometry.summaryRect?.height>=43.5&&!record.geometry.horizontalOverflow;
        if(!geometryPass){
          record.classification='D2';
        }else{
          const baseline=await page.evaluate(()=>({
            focus:new URL(location.href).searchParams.get('focus'),
            overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
            pan:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
            dragging:document.documentElement.dataset.boardDragging||null,
            writes:Number(globalThis.__QA_POSITION_WRITES__||0),
            createCalls:globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_board_relation_create_v1').length,
            deleteCalls:globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_board_relation_delete_v1').length
          }));
          const addTapped=await tapCenter(page,'.dc-board-relation-detail-host [data-relation-add]');
          let formVisible=false;
          if(addTapped){
            try{
              await page.waitForSelector('.dc-board-relation-detail-host [data-relation-form]',{state:'visible',timeout:3000});
              formVisible=true;
            }catch{}
          }
          const options=formVisible?await page.locator('.dc-board-relation-detail-host [data-relation-choice] option').evaluateAll(nodes=>nodes.map(node=>({value:node.value,label:node.textContent||''}))):[];
          const labels=options.map(option=>option.label);
          const eventChoice=options.find(option=>option.label.includes('QA EVENT'));
          const relatedOnly=labels.length>0&&labels.every(label=>label.startsWith('СВЯЗАНО С'));
          record.capability={addTapped,formVisible,labels,relatedOnly,qaEventAvailable:Boolean(eventChoice)};
          if(!addTapped||!formVisible||!relatedOnly||!eventChoice){
            record.classification='D4';
          }else{
            const choice=page.locator('.dc-board-relation-detail-host [data-relation-choice]');
            await choice.selectOption(eventChoice.value);
            const s2Before=await page.evaluate(artifactId=>{
              const host=document.querySelector('.dc-board-relation-detail-host');
              const block=host?.querySelector('[data-relation-block][data-relation-detail="1"]');
              const form=block?.querySelector('[data-relation-form]');
              const select=block?.querySelector('[data-relation-choice]');
              const save=block?.querySelector('[data-relation-save]');
              globalThis.__QA_S2_DETAIL_IDENTITY__={host,block,form,select,save,selectedValue:select?.value||null};
              return{
                endpointKey:host?.dataset.relationDetailKey||null,
                expectedEndpointKey:'artifact:'+artifactId,
                hostConnected:Boolean(host?.isConnected),
                blockConnected:Boolean(block?.isConnected),
                formConnected:Boolean(form?.isConnected),
                saveConnected:Boolean(save?.isConnected),
                selectedValue:select?.value||null
              };
            },A);
            await page.evaluate(()=>window.dispatchEvent(new CustomEvent('dc:board-projections-updated')));
            await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
            const s2After=await page.evaluate(()=>{
              const before=globalThis.__QA_S2_DETAIL_IDENTITY__;
              const host=document.querySelector('.dc-board-relation-detail-host');
              const block=host?.querySelector('[data-relation-block][data-relation-detail="1"]');
              const form=block?.querySelector('[data-relation-form]');
              const select=block?.querySelector('[data-relation-choice]');
              const save=block?.querySelector('[data-relation-save]');
              return{
                sameHost:Boolean(before?.host&&before.host===host),
                sameBlock:Boolean(before?.block&&before.block===block),
                sameForm:Boolean(before?.form&&before.form===form),
                sameSelect:Boolean(before?.select&&before.select===select),
                sameSave:Boolean(before?.save&&before.save===save),
                hostConnected:Boolean(before?.host?.isConnected),
                blockConnected:Boolean(before?.block?.isConnected),
                formConnected:Boolean(before?.form?.isConnected),
                saveConnected:Boolean(before?.save?.isConnected),
                formOpen:Boolean(form&&!form.hidden),
                selectedValue:select?.value||null,
                selectedPreserved:Boolean(before?.selectedValue&&select?.value===before.selectedValue)
              };
            });
            const s2Pass=Boolean(
              s2Before.endpointKey===s2Before.expectedEndpointKey
              &&s2Before.hostConnected&&s2Before.blockConnected&&s2Before.formConnected&&s2Before.saveConnected
              &&s2After.sameHost&&s2After.sameBlock&&s2After.sameForm&&s2After.sameSelect&&s2After.sameSave
              &&s2After.hostConnected&&s2After.blockConnected&&s2After.formConnected&&s2After.saveConnected
              &&s2After.formOpen&&s2After.selectedPreserved
            );
            record.s2={before:s2Before,after:s2After,pass:s2Pass};
            expect(s2Pass,'S2 detail interaction identity was replaced by canonical presentation refresh '+JSON.stringify(record.s2));
            const saveTapped=await tapCenter(page,'.dc-board-relation-detail-host [data-relation-save]');
            let createdVisible=false;
            if(saveTapped){
              try{
                await page.waitForFunction(({artifactId,before})=>(
                  globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_board_relation_create_v1').length>before
                  &&Boolean(document.querySelector('.dc-board-relation-detail-host [data-relation-id="rel-created"]'))
                  &&new URL(location.href).searchParams.get('focus')==='artifact:'+artifactId
                  &&Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])'))
                ),{artifactId:A,before:baseline.createCalls},{timeout:6000});
                createdVisible=true;
              }catch{}
            }
            const afterCreate=await page.evaluate(()=>({
              focus:new URL(location.href).searchParams.get('focus'),
              overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
              pan:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
              dragging:document.documentElement.dataset.boardDragging||null,
              writes:Number(globalThis.__QA_POSITION_WRITES__||0),
              createCalls:globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_board_relation_create_v1').length
            }));
            const rebuild=await page.evaluate(()=>{
              const before=globalThis.__QA_S2_DETAIL_IDENTITY__;
              const current=document.querySelector('.dc-board-relation-detail-host');
              return{
                rebuilt:Boolean(before?.host&&current&&before.host!==current),
                oldHostConnected:Boolean(before?.host?.isConnected),
                currentEndpointKey:current?.dataset.relationDetailKey||null
              };
            });
            record.create={saveTapped,createdVisible,baseline,afterCreate,rebuild};
            if(!s2Pass||!saveTapped||!createdVisible||afterCreate.createCalls<=baseline.createCalls||afterCreate.focus!=='artifact:'+A||!afterCreate.overlay||afterCreate.pan||afterCreate.dragging!==null||afterCreate.writes!==baseline.writes||!rebuild.rebuilt||rebuild.oldHostConnected||rebuild.currentEndpointKey!=='artifact:'+A){
              record.classification='D2';
            }else{
              const createdRow=page.locator('.dc-board-relation-detail-host [data-relation-id="rel-created"]');
              const otherRow=page.locator('.dc-board-relation-detail-host [data-relation-id="rel-other"]');
              const directionalRow=page.locator('.dc-board-relation-detail-host [data-relation-id="rel-directional"]');
              const createdDelete=createdRow.locator('[data-relation-delete]');
              const authority={
                createdDelete:await createdDelete.count(),
                otherRow:await otherRow.count(),
                otherDelete:await otherRow.locator('[data-relation-delete]').count(),
                directionalRow:await directionalRow.count(),
                directionalDelete:await directionalRow.locator('[data-relation-delete]').count()
              };
              const authorityPass=authority.createdDelete===1&&authority.otherRow===1&&authority.otherDelete===0&&authority.directionalRow===1&&authority.directionalDelete===0;
              if(!authorityPass){
                record.delete={authority};
                record.classification='D4';
              }else{
                const deleteTapped=await tapCenter(page,'.dc-board-relation-detail-host [data-relation-id="rel-created"] [data-relation-delete]');
                let deleted=false;
                if(deleteTapped){
                  try{
                    await page.waitForFunction(({before})=>(
                      globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_board_relation_delete_v1').length>before
                      &&!document.querySelector('.dc-board-relation-detail-host [data-relation-id="rel-created"]')
                    ),{before:baseline.deleteCalls},{timeout:6000});
                    deleted=true;
                  }catch{}
                }
                const afterDelete=await page.evaluate(()=>({
                  focus:new URL(location.href).searchParams.get('focus'),
                  overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
                  pan:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
                  dragging:document.documentElement.dataset.boardDragging||null,
                  writes:Number(globalThis.__QA_POSITION_WRITES__||0),
                  deleteCalls:globalThis.__QA_COLLAB_CALLS__.filter(call=>call.name==='dc_board_relation_delete_v1').length
                }));
                record.delete={authority,deleteTapped,deleted,afterDelete};
                if(!deleteTapped||!deleted||afterDelete.deleteCalls<=baseline.deleteCalls||afterDelete.focus!=='artifact:'+A||!afterDelete.overlay||afterDelete.pan||afterDelete.dragging!==null||afterDelete.writes!==baseline.writes){
                  record.classification='D2';
                }else record.classification='D1';
              }
            }
          }
        }
      }
    }
    detailTrace.mobile390=record;
    await ctx.close();
  }

  // 360px: existing detail host must remain open, visible, tappable and overflow-safe.
  {
    const width=360;
    const{ctx,page,errors}=await openBoard(browser,'relations',{width,height:844},{hasTouch:true});
    const record={width,errors,opened:null,geometry:null,add:null,inlineHidden:null};
    record.inlineHidden=await inlineIdeaRelationsHidden(page);
    expect(record.inlineHidden,'mobile 360 detail owner: inline IDEA Relations remains visibly rendered');
    const opened=await openArtifactDetail(page,width);
    record.opened=opened;
    if(!opened.opened){
      record.classification='D2';
    }else{
      let hostPresent=true;
      try{
        await page.waitForSelector('.dc-board-relation-detail-host [data-relation-block][data-relation-detail="1"][open]',{state:'visible',timeout:6000});
      }catch(error){hostPresent=false}
      if(!hostPresent){
        record.classification='D3';
      }else{
        record.geometry=await rectInfo(page,width);
        const geometryPass=record.geometry.hostVisible&&record.geometry.blockVisible&&record.geometry.summaryVisible&&record.geometry.addVisible
          &&record.geometry.summaryInsidePanel&&record.geometry.addInsidePanel
          &&record.geometry.summaryRect?.height>=43.5&&!record.geometry.horizontalOverflow;
        if(!geometryPass){
          record.classification='D2';
        }else{
          const tapped=await tapCenter(page,'.dc-board-relation-detail-host [data-relation-add]');
          let formVisible=false;
          if(tapped){
            try{
              await page.waitForSelector('.dc-board-relation-detail-host [data-relation-form]',{state:'visible',timeout:3000});
              formVisible=true;
            }catch{}
          }
          const state=await page.evaluate(()=>({
            focus:new URL(location.href).searchParams.get('focus'),
            overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
            horizontalOverflow:Boolean(document.querySelector('.dc-board-relation-detail-host')?.scrollWidth>document.querySelector('.dc-board-relation-detail-host')?.clientWidth+1)
          }));
          record.add={tapped,formVisible,state};
          record.classification=tapped&&formVisible&&state.focus==='artifact:'+A&&state.overlay&&!state.horizontalOverflow?'D1':'D2';
        }
      }
    }
    detailTrace.mobile360=record;
    await ctx.close();
  }

  {
    const classes=[detailTrace.mobile390?.classification,detailTrace.mobile360?.classification];
    let classification='D1';
    if(classes.includes('D3'))classification='D3';
    else if(classes.includes('D4'))classification='D4';
    else if(classes.includes('D2'))classification='D2';
    expect(classification==='D1','mobile Artifact-detail Relations owner regression '+JSON.stringify({classification,...detailTrace}));
  }

  // Durable native keyboard acceptance: event truth is captured at the real keydown.
  for(const key of ['Enter',' ']){
    const{ctx,page,errors}=await openBoard(browser,'relations');
    const card=page.locator('.dc-notice[data-artifact="'+A+'"]');
    const summary=card.locator('[data-relation-block] summary');
    await summary.waitFor({state:'visible',timeout:6000});
    await summary.focus();

    await page.evaluate(artifactId=>{
      globalThis.__QA_RELATION_KEYDOWN__=null;
      document.addEventListener('keydown',event=>{
        const currentSummary=document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block] summary');
        const active=document.activeElement;
        globalThis.__QA_RELATION_KEYDOWN__={
          key:event.key,
          target:event.target?.outerHTML?.slice(0,240)||null,
          active:active?.outerHTML?.slice(0,240)||null,
          targetIsCurrentSummary:Boolean(currentSummary&&event.target===currentSummary),
          activeIsEventTarget:Boolean(active&&active===event.target),
          currentSummaryConnected:Boolean(currentSummary?.isConnected),
          focus:new URL(location.href).searchParams.get('focus'),
          overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
          blockOpen:Boolean(document.querySelector('.dc-notice[data-artifact="'+artifactId+'"] [data-relation-block]')?.open)
        };
      },{capture:true,once:true});
    },A);

    await page.keyboard.press(key);

    const keydown=await page.evaluate(()=>globalThis.__QA_RELATION_KEYDOWN__);
    if(
      !keydown
      ||keydown.key!==key
      ||keydown.targetIsCurrentSummary!==true
      ||keydown.currentSummaryConnected!==true
    ){
      throw new Error('RELATION_KEYBOARD_EVENT_TARGET_MISMATCH '+JSON.stringify({key,keydown}));
    }

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

  // Mobile ownership repetition: the first full 390 proof above is run 1;
  // these are fresh 390 runs 2-3. The full 360 proof above is the required 360 run.
  for(const runIndex of [2,3]){
    const width=390;
    const{ctx,page,errors}=await openBoard(browser,'relations',{width,height:844},{hasTouch:true});
    const inlineHidden=await inlineIdeaRelationsHidden(page);
    expect(inlineHidden,`mobile 390 run ${runIndex}: inline IDEA Relations remains visibly rendered`);
    const before=await page.evaluate(()=>({
      writes:Number(globalThis.__QA_POSITION_WRITES__||0),
      pan:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
      dragging:document.documentElement.dataset.boardDragging||null
    }));
    const opened=await openArtifactDetail(page,width);
    expect(opened.opened===true,`mobile 390 run ${runIndex}: card body did not open Artifact detail ${JSON.stringify(opened)}`);
    if(opened.opened){
      await page.waitForSelector('.dc-board-relation-detail-host [data-relation-block][data-relation-detail="1"][open]',{state:'visible',timeout:6000});
      const geometry=await rectInfo(page,width);
      expect(geometry.hostVisible&&geometry.blockVisible&&geometry.summaryVisible&&geometry.addVisible,`mobile 390 run ${runIndex}: detail controls not visible ${JSON.stringify(geometry)}`);
      expect((geometry.summaryRect?.height||0)>=43.5,`mobile 390 run ${runIndex}: detail summary below 44px geometry ${JSON.stringify(geometry.summaryRect)}`);
      expect(!geometry.horizontalOverflow,`mobile 390 run ${runIndex}: detail Relations horizontal overflow`);
      const addTapped=await tapCenter(page,'.dc-board-relation-detail-host [data-relation-add]');
      expect(addTapped,`mobile 390 run ${runIndex}: +СВЯЗЬ has no tappable geometry`);
      if(addTapped)await page.waitForSelector('.dc-board-relation-detail-host [data-relation-form]',{state:'visible',timeout:3000});
      const after=await page.evaluate(artifactId=>({
        focus:new URL(location.href).searchParams.get('focus'),
        overlay:Boolean(document.querySelector('.dc-artifact-overlay:not([hidden])')),
        pan:Boolean(document.querySelector('.dc-spatial-viewport')?.classList.contains('is-panning')),
        dragging:document.documentElement.dataset.boardDragging||null,
        writes:Number(globalThis.__QA_POSITION_WRITES__||0),
        inlineOpen:Boolean(document.querySelector('.dc-spatial-world>.dc-notice[data-artifact="'+artifactId+'"][data-artifact-subtype="idea"]>[data-relation-block]')?.open)
      }),A);
      expect(after.focus==='artifact:'+A&&after.overlay===true,`mobile 390 run ${runIndex}: detail owner lost Artifact focus/fullscreen ${JSON.stringify(after)}`);
      expect(after.inlineOpen===false,`mobile 390 run ${runIndex}: hidden inline Relations activated`);
      expect(!after.pan&&after.dragging===null&&after.writes===before.writes,`mobile 390 run ${runIndex}: detail interaction entered pan/drag/position write ${JSON.stringify({before,after})}`);
    }
    expect(!errors.length,`mobile 390 run ${runIndex}: page errors: ${errors.join(' | ')}`);
    await ctx.close();
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
console.log('✓ BQA-24 invitation indicator/highlight + one/multiple exact-Idea navigation exercised on desktop/390/360');
console.log('✓ BQA-28 Board participant freshness exercised through artifact-close/history-close/BFCache lifecycle without reload');
console.log('✓ participant Relations UI exposes RELATED_TO-only participant path + server can_delete create→reload→open→delete round-trip');
console.log('✓ desktop, 390px and 360px overflow checks exercised');
