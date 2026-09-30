import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const repoRoot=process.cwd();
const boardPath=path.join(repoRoot,'community','board','board.js');
const mediaPath=path.join(repoRoot,'community','board','board-media-v1.js');
const modelPath=path.join(repoRoot,'community','board','board-entity-model-v1.js');
const failures=[];
const expect=(ok,message)=>{if(!ok)failures.push(message)};
const A='11111111-1111-4111-8111-111111111111';
const B='22222222-2222-4222-8222-222222222222';
const C='33333333-3333-4333-8333-333333333333';
const UID='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const AUTHOR='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const delays={normalize:10,artifactRows:40,secondary:20,mediaRead:500,participant:600,signed:450};

for(const file of [boardPath,mediaPath,modelPath]){
  if(!fs.existsSync(file))throw new Error('BOARD_MEDIA_QA_SOURCE_MISSING '+path.relative(repoRoot,file));
}
const boardSource=fs.readFileSync(boardPath,'utf8');
const mediaSource=fs.readFileSync(mediaPath,'utf8');

function extractFunction(source,name){
  const start=source.indexOf(`async function ${name}(`);
  if(start<0)return'';
  let depth=0,body=false;
  for(let i=start;i<source.length;i++){
    if(source[i]==='{'){depth++;body=true}
    else if(source[i]==='}'){depth--;if(body&&depth===0)return source.slice(start,i+1)}
  }
  return'';
}
const loadBoardSource=extractFunction(boardSource,'loadBoard');
expect(loadBoardSource.includes('enrichmentPending:true'),'source: loadBoard does not render structural pending cards');
expect(loadBoardSource.includes('enrichBoard(artifacts,generation)'),'source: loadBoard does not defer canonical enrichment');
expect(!loadBoardSource.includes('signedMediaUrl'),'source: signed media still blocks loadBoard');
expect(!loadBoardSource.includes('dc_artifact_participants_read_v1'),'source: participant RPC still blocks loadBoard');
expect(boardSource.includes("dc_artifact_participants_batch_read_v1"),'source: batch participant RPC missing');
expect(!boardSource.includes("dc_artifact_participants_read_v1"),'source: single participant RPC fallback remains');
expect(!loadBoardSource.includes("from('dc_artifact_media')"),'source: media read still blocks loadBoard');
expect(boardSource.includes('loading="lazy"')&&boardSource.includes('decoding="async"'),'source: lazy/async image attributes missing');
expect(boardSource.includes('original_mime')&&boardSource.includes('original_bytes')&&boardSource.includes('original_width')&&boardSource.includes('original_height'),'source: original media metadata missing');
expect(boardSource.includes('normalized_mime')&&boardSource.includes('normalized_bytes')&&boardSource.includes('normalized_width')&&boardSource.includes('normalized_height'),'source: normalized media metadata missing');
expect(mediaSource.includes("imageOrientation:'from-image'")||mediaSource.includes('imageOrientation:"from-image"'),'source: orientation-safe createImageBitmap decode missing');
expect(mediaSource.includes('BOARD_IMAGE_LONG_EDGE=1800'),'source: canonical image edge is not 1800');
expect(mediaSource.includes('BOARD_IMAGE_WEBP_QUALITY=0.82'),'source: canonical WebP quality is not 0.82');
expect(!boardSource.includes('mediaUrls=new Map'),'source: persistent/eager signed-url map returned');
expect(boardSource.includes("notifyBoardProjection('artifact-secondary-enrichment')")&&boardSource.includes("notifyBoardProjection('artifact-media-enrichment')"),'source: progressive enrichment does not notify canonical Board owners');

const runtimeModule=()=>`
const A='${A}',B='${B}',C='${C}',UID='${UID}',AUTHOR='${AUTHOR}';
const delays=${JSON.stringify(delays)};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const user={id:UID,email:'qa@invalid',user_metadata:{full_name:'QA MEMBER'}};
const session={user};
globalThis.__QA=globalThis.__QA||{};
Object.assign(globalThis.__QA,{
  participantRpcCount:0,signedUrlCount:0,mediaCount:0,uploads:[],removes:[],attachCalls:[],publishCalls:0,
  participantFirstStartedAt:null,mediaReadStartedAt:null,signedFirstStartedAt:null,attachFail:false,
  participation:{[A]:'INVITED'},invitationOpen:null,viewRequest:null,projectionUpdates:0
});
const baseArtifacts=[
 {id:A,author_profile_id:AUTHOR,artifact_type:'idea',title:'CIRCLE IDEA',body:'Delayed participant fixture.',external_url:null,status:'active',visibility:'circle',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-29T10:00:00Z',closed_at:null,created_at:'2026-09-29T09:00:00Z',board_hidden_at:null},
 {id:B,author_profile_id:AUTHOR,artifact_type:'idea',title:'COMMUNITY IDEA',body:'Second delayed participant fixture.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-29T09:00:00Z',closed_at:null,created_at:'2026-09-29T08:00:00Z',board_hidden_at:null},
 {id:C,author_profile_id:AUTHOR,artifact_type:'announcement',title:'MEDIA CARD',body:'Delayed media fixture.',external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,published_at:'2026-09-29T08:00:00Z',closed_at:null,created_at:'2026-09-29T07:00:00Z',board_hidden_at:null}
];
const requestedIdeaCount=Math.max(0,Number(new URL(location.href).searchParams.get('qaIdeas')||0));
const artifacts=requestedIdeaCount?Array.from({length:requestedIdeaCount},(_,index)=>({
  id:'90000000-0000-4000-8000-'+String(index+1).padStart(12,'0'),
  author_profile_id:AUTHOR,artifact_type:'idea',title:'BATCH IDEA '+String(index+1),body:'Batch request-count fixture.',
  external_url:null,status:'active',visibility:'community',starts_at:null,activity_at:null,expires_at:null,
  published_at:'2026-09-29T09:00:00Z',closed_at:null,created_at:'2026-09-29T08:00:00Z',board_hidden_at:null
})):baseArtifacts;
const profiles=[
 {profile_id:AUTHOR,display_name:'QA AUTHOR',nickname:'author',avatar_url:null,member_since:'2026-09-01'},
 {profile_id:UID,display_name:'QA MEMBER',nickname:'member',avatar_url:null,member_since:'2026-09-01'},
 {profile_id:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',display_name:'SECOND MEMBER',nickname:'second',avatar_url:null,member_since:'2026-09-01'}
];
const media=[
 {id:'media-a',artifact_id:A,media_type:'image',storage_path:'qa/a.webp',metadata:{}},
 {id:'media-c',artifact_id:C,media_type:'image',storage_path:'qa/c.webp',metadata:{}}
];
const canReadArtifact=a=>a.visibility==='community'||['INVITED','JOINED'].includes(globalThis.__QA.participation[A]||'');
const participantRows=id=>{
  if(id===A){const state=globalThis.__QA.participation[A];return ['INVITED','JOINED'].includes(state)?[{...profiles[1],participation_state:state,state_changed_at:'2026-09-29T10:00:00Z'},{...profiles[2],participation_state:'JOINED',state_changed_at:'2026-09-29T10:00:00Z'}]:[{...profiles[2],participation_state:'JOINED',state_changed_at:'2026-09-29T10:00:00Z'}]}
  return [{...profiles[2],participation_state:'JOINED',state_changed_at:'2026-09-29T10:00:00Z'}];
};
const rowsFor=t=>t==='dc_artifacts'?artifacts.filter(canReadArtifact)
 :t==='dc_member_public_profiles'?profiles
 :t==='dc_artifact_reactions'?[]
 :t==='dc_artifact_responses'?[]
 :t==='dc_artifact_media'?media
 :[];
function delayFor(table){return table==='dc_artifact_media'?delays.mediaRead:table==='dc_artifacts'?delays.artifactRows:delays.secondary}
const query=table=>{
 const filters=[];
 const apply=()=>{let rows=[...rowsFor(table)];for(const f of filters){if(f.kind==='eq')rows=rows.filter(r=>r?.[f.key]===f.value);else if(f.kind==='in')rows=rows.filter(r=>f.values.includes(r?.[f.key]));else if(f.kind==='is')rows=rows.filter(r=>r?.[f.key]===f.value||(r?.[f.key]==null&&f.value==null))}return rows};
 const delayed=async()=>{if(table==='dc_artifact_media'&&globalThis.__QA.mediaReadStartedAt==null)globalThis.__QA.mediaReadStartedAt=performance.now();await wait(delayFor(table));const rows=apply();if(table==='dc_artifact_media')globalThis.__QA.mediaCount=rows.length;return rows};
 const q={
  select(){return q},eq(key,value){filters.push({kind:'eq',key,value});return q},neq(){return q},in(key,values){filters.push({kind:'in',key,values});return q},is(key,value){filters.push({kind:'is',key,value});return q},order(){return q},limit(){return q},range(){return q},
  insert(){return Promise.resolve({data:null,error:null})},delete(){return Promise.resolve({data:null,error:null})},update(){return q},upsert(){return q},
  maybeSingle(){return delayed().then(rows=>({data:rows[0]||null,error:null}))},single(){return delayed().then(rows=>({data:rows[0]||null,error:null}))},
  then(resolve,reject){return delayed().then(rows=>({data:rows,error:null})).then(resolve,reject)}
 };return q;
};
const client={
 from:query,
 rpc:async(name,args={})=>{
   if(name==='dc_normalize_artifact_lifecycle_v1'){await wait(delays.normalize);return{data:0,error:null}}
   if(name==='dc_board_promotion_state_read_v1'){await wait(delays.secondary);return{data:[],error:null}}
   if(name==='dc_artifact_participants_batch_read_v1'){
     globalThis.__QA.participantRpcCount+=1;if(globalThis.__QA.participantFirstStartedAt==null)globalThis.__QA.participantFirstStartedAt=performance.now();
     await wait(delays.participant);
     const ids=Array.isArray(args.p_artifact_ids)?args.p_artifact_ids:[];
     return{data:ids.flatMap(id=>participantRows(id).map(row=>({artifact_id:id,...row}))),error:null};
   }
   if(name==='dc_create_artifact_draft_v1')return{data:'88888888-8888-4888-8888-888888888888',error:null};
   if(name==='dc_update_artifact_draft_v1'||name==='dc_set_artifact_visibility_v1'||name==='dc_set_artifact_subtype_v1'||name==='dc_set_artifact_activity_v1')return{data:args.p_artifact_id||true,error:null};
   if(name==='dc_attach_artifact_media_v1'){globalThis.__QA.attachCalls.push(args);return globalThis.__QA.attachFail?{data:null,error:{message:'QA_ATTACH_FAILED'}}:{data:'media-uploaded',error:null}}
   if(name==='dc_publish_artifact_v1'){globalThis.__QA.publishCalls+=1;return{data:{artifact_id:args.p_artifact_id,status:'active'},error:null}}
   if(name==='dc_close_artifact_v1')return{data:{artifact_id:args.p_artifact_id,status:'archived'},error:null};
   return{data:[],error:null};
 },
 storage:{from:()=>({
   upload:async(storagePath,file,options)=>{globalThis.__QA.uploads.push({path:storagePath,size:file.size,type:file.type,name:file.name,contentType:options?.contentType||null});return{data:{path:storagePath},error:null}},
   remove:async paths=>{globalThis.__QA.removes.push(...paths);return{data:paths,error:null}},
   createSignedUrl:async()=>({data:{signedUrl:'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22160%22/%3E'},error:null})
 })}
};
export const DC_ARTIFACT_BUCKET='dc-community-artifacts';
export function getClient(){return client}
export async function currentSession(){return session}
export async function loginWithGoogle(){return null}
export async function getEntryStatus(){return{membership_active:true,community_activation_state:'MEMBER_ACTIVATED',sphere_count:9,sphere_gate_complete:true,artifact_slots_available:1,artifact_slots_consuming:0,published_artifact_count:0}}
export function esc(value){return String(value??'').replace(/[&<>\"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[ch]))}
export function formatDate(value){return value?String(value).slice(0,10):''}
export function safeFileName(name){const raw=String(name||'file').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');return(raw||'file').slice(-120)}
export function mediaType(file){return String(file?.type||'').startsWith('image/')?'image':'file'}
export async function signedMediaUrl(_client,path){globalThis.__QA.signedUrlCount+=1;if(globalThis.__QA.signedFirstStartedAt==null)globalThis.__QA.signedFirstStartedAt=performance.now();await wait(delays.signed);return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22160%22/%3E%3Ctext x=%2210%22 y=%2220%22%3E'+encodeURIComponent(path)+'%3C/text%3E%3C/svg%3E'}
export function errorMessage(error){return String(error?.message||error||'UNKNOWN_ERROR')}
export function route(value){return value}
`;

const qaHtml=`<!doctype html><html lang="ru" data-dc-board-user-state="MEMBER"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>
<div id="boardStatus"></div><div id="memberBadge"></div><span id="artifactCount"></span><div id="entryHost"></div><main id="boardHost"></main>
<script>
globalThis.__QA={start:performance.now(),firstRender:null,interactive:null,signedAtFirstRender:null,participantAtFirstRender:null};
const observe=new MutationObserver(()=>{
  const cards=[...document.querySelectorAll('.dc-notice[data-artifact]')];
  if(cards.length===3&&globalThis.__QA.firstRender==null){
    const now=performance.now();globalThis.__QA.firstRender=now;
    globalThis.__QA.signedAtFirstRender=Number(globalThis.__QA.signedUrlCount||0);
    globalThis.__QA.participantAtFirstRender=Number(globalThis.__QA.participantRpcCount||0);
    const usable=cards.every(card=>card.querySelector('.dc-notice__body')&&card.querySelector('a[href*="/community/artifact/"]'));
    if(usable)globalThis.__QA.interactive=now;
    globalThis.__QA.firstCardNodes=cards;
    const circle=cards.find(card=>card.dataset.artifact==='11111111-1111-4111-8111-111111111111');
    globalThis.__QA.circleSafeAtFirstRender=Boolean(circle&&circle.querySelector('a[href*="/community/artifact/"]')&&!circle.querySelector('[data-reaction]')&&!circle.querySelector('[data-response]'));
  }
});
observe.observe(document.documentElement,{subtree:true,childList:true});
addEventListener('dc:board-projections-updated',()=>{globalThis.__QA.projectionUpdates=Number(globalThis.__QA.projectionUpdates||0)+1});
addEventListener('dc:board-request-view',event=>{globalThis.__QA.viewRequest=event.detail||null});
addEventListener('click',event=>{const card=event.target?.closest?.('.dc-notice[data-artifact]');if(card)globalThis.__QA.invitationOpen=card.dataset.artifact||null},true);
</script>
<script type="module" src="/community/board/board.js"></script></body></html>`;

const mime={'.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8'};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url||'/','http://qa.local').pathname;
  if(pathname==='/qa-board.html'||pathname==='/'){res.statusCode=200;res.setHeader('content-type','text/html; charset=utf-8');res.end(qaHtml);return}
  if(pathname==='/community-runtime-v1.js'){res.statusCode=200;res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeModule());return}
  const allowed=new Map([
    ['/community/board/board.js',boardPath],
    ['/community/board/board-media-v1.js',mediaPath],
    ['/community/board/board-entity-model-v1.js',modelPath]
  ]);
  const file=allowed.get(pathname);
  if(file&&fs.existsSync(file)){res.statusCode=200;res.setHeader('content-type',mime[path.extname(file)]||'text/plain; charset=utf-8');res.end(fs.readFileSync(file));return}
  res.statusCode=404;res.end('Not found');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;

async function baselineProbe(browser){
  const page=await browser.newPage();
  const result=await page.evaluate(async delays=>{
    const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));const start=performance.now();let participantRpcCount=0,signedUrlCount=0,mediaCount=0;
    await wait(delays.normalize);
    await Promise.all([wait(delays.artifactRows),wait(delays.artifactRows)]);
    await Promise.all([wait(delays.secondary),wait(delays.secondary),(async()=>{await wait(delays.mediaRead);mediaCount=2})(),wait(delays.secondary)]);
    await Promise.all([0,1].map(async()=>{participantRpcCount+=1;await wait(delays.participant)}));
    await Promise.all([0,1].map(async()=>{signedUrlCount+=1;await wait(delays.signed)}));
    const firstRender=performance.now()-start;
    return{firstRender,interactive:firstRender,participantRpcCount,signedUrlCountBeforeFirstRender:signedUrlCount,mediaCount};
  },delays);
  await page.close();return result;
}

async function createFixture(page,{name,type,width,height,alpha=false,quality=.96,nearLimit=false}){
  return page.evaluate(async spec=>{
    const canvas=document.createElement('canvas');canvas.width=spec.width;canvas.height=spec.height;const ctx=canvas.getContext('2d');
    if(spec.nearLimit){
      const image=ctx.createImageData(spec.width,spec.height);let seed=0x12345678;
      for(let i=0;i<image.data.length;i+=4){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;const v=seed>>>0;image.data[i]=v&255;image.data[i+1]=(v>>>8)&255;image.data[i+2]=(v>>>16)&255;image.data[i+3]=255}ctx.putImageData(image,0,0);
    }else if(spec.alpha){ctx.clearRect(0,0,spec.width,spec.height);ctx.fillStyle='rgba(30,120,220,.25)';ctx.fillRect(0,0,spec.width,spec.height);ctx.fillStyle='rgba(220,30,80,.65)';ctx.fillRect(spec.width*.25,spec.height*.25,spec.width*.5,spec.height*.5)}
    else{const g=ctx.createLinearGradient(0,0,spec.width,spec.height);g.addColorStop(0,'#15243a');g.addColorStop(.5,'#db6b39');g.addColorStop(1,'#f0d56a');ctx.fillStyle=g;ctx.fillRect(0,0,spec.width,spec.height);for(let i=0;i<40;i++){ctx.fillStyle=`rgba(${(i*37)%255},${(i*71)%255},${(i*113)%255},.55)`;ctx.fillRect((i*97)%spec.width,(i*53)%spec.height,Math.max(20,spec.width/10),Math.max(20,spec.height/14))}}
    let qualities=spec.nearLimit?[.99,.97,.95,.93,.91,.88,.85,.82]:[spec.quality];let blob=null;
    for(const q of qualities){blob=await new Promise(resolve=>canvas.toBlob(resolve,spec.type,q));if(!spec.nearLimit||(blob&&blob.size<=4*1024*1024&&blob.size>=2.8*1024*1024))break}
    if(!blob)throw new Error('FIXTURE_ENCODE_FAILED '+spec.name);
    const file=new File([blob],spec.name,{type:spec.type,lastModified:Date.now()});globalThis.__QA_FIXTURES__=globalThis.__QA_FIXTURES__||{};globalThis.__QA_FIXTURES__[spec.name]=file;
    return{name:spec.name,type:file.type,bytes:file.size,width:spec.width,height:spec.height};
  },{name,type,width,height,alpha,quality,nearLimit});
}

async function fixtureMatrix(page){
  const specs=[
    {name:'landscape.jpg',type:'image/jpeg',width:2400,height:1600},
    {name:'portrait.jpg',type:'image/jpeg',width:1600,height:2400},
    {name:'landscape.png',type:'image/png',width:2400,height:1600},
    {name:'source.webp',type:'image/webp',width:2400,height:1600},
    {name:'transparent.png',type:'image/png',width:2200,height:1400,alpha:true},
    {name:'small.jpg',type:'image/jpeg',width:640,height:480},
    {name:'near-4mb.jpg',type:'image/jpeg',width:2600,height:2000,nearLimit:true}
  ];
  const originals=[];for(const spec of specs)originals.push(await createFixture(page,spec));
  const rows=await page.evaluate(async specs=>{
    const {normalizeArtifactImage}=await import('/community/board/board-media-v1.js');const out=[];
    for(const spec of specs){const file=globalThis.__QA_FIXTURES__[spec.name];const normalized=await normalizeArtifactImage(file);let alpha=null;
      if(spec.name==='transparent.png'){
        const bitmap=await createImageBitmap(normalized.file);const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);alpha=ctx.getImageData(2,2,1,1).data[3];bitmap.close?.();
      }
      out.push({name:spec.name,beforeBytes:file.size,beforeMime:file.type,beforeWidth:normalized.original.width,beforeHeight:normalized.original.height,afterBytes:normalized.normalized.bytes,afterMime:normalized.normalized.mime,afterWidth:normalized.normalized.width,afterHeight:normalized.normalized.height,usedNormalized:normalized.usedNormalized,decoder:normalized.decoder,alpha});
    }
    return out;
  },specs);
  const safari=await page.evaluate(async()=>{const {normalizeArtifactImage}=await import('/community/board/board-media-v1.js');const saved=globalThis.createImageBitmap;try{globalThis.createImageBitmap=undefined;const result=await normalizeArtifactImage(globalThis.__QA_FIXTURES__['portrait.jpg']);return{decoder:result.decoder,width:result.normalized.width,height:result.normalized.height,bytes:result.normalized.bytes}}finally{globalThis.createImageBitmap=saved}});
  const broken=await page.evaluate(async()=>{const {normalizeArtifactImage}=await import('/community/board/board-media-v1.js');try{await normalizeArtifactImage(new File([new Uint8Array([1,2,3,4,5])],'broken.jpg',{type:'image/jpeg'}));return'NO_ERROR'}catch(error){return String(error?.message||error)}});
  const encodeFallback=await page.evaluate(async()=>{const {normalizeArtifactImage}=await import('/community/board/board-media-v1.js');const original=HTMLCanvasElement.prototype.toBlob;try{HTMLCanvasElement.prototype.toBlob=function(cb){cb(null)};const result=await normalizeArtifactImage(globalThis.__QA_FIXTURES__['landscape.jpg']);return{usedNormalized:result.usedNormalized,mime:result.normalized.mime,bytes:result.normalized.bytes,originalBytes:result.original.bytes}}finally{HTMLCanvasElement.prototype.toBlob=original}});
  return{rows,safari,broken,encodeFallback,originals};
}

async function assignGeneratedFile(page,selector,{name='upload.jpg',type='image/jpeg',width=2400,height=1600,broken=false}={}){
  await page.locator(selector).evaluate(async(input,spec)=>{
    let file;
    if(spec.broken)file=new File([new Uint8Array([1,2,3,4,5])],spec.name,{type:spec.type});
    else{const canvas=document.createElement('canvas');canvas.width=spec.width;canvas.height=spec.height;const ctx=canvas.getContext('2d');const g=ctx.createLinearGradient(0,0,spec.width,spec.height);g.addColorStop(0,'#102a43');g.addColorStop(1,'#ffb703');ctx.fillStyle=g;ctx.fillRect(0,0,spec.width,spec.height);for(let i=0;i<60;i++){ctx.fillStyle=`rgba(${(i*41)%255},${(i*83)%255},${(i*127)%255},.6)`;ctx.fillRect((i*113)%spec.width,(i*71)%spec.height,160,100)}const blob=await new Promise(resolve=>canvas.toBlob(resolve,spec.type,.97));file=new File([blob],spec.name,{type:spec.type,lastModified:Date.now()})}
    const transfer=new DataTransfer();transfer.items.add(file);input.files=transfer.files;
  },{name,type,width,height,broken});
}

async function participantRequestCountProbe(browser,ideaCount){
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  try{
    await page.goto(base+'/qa-board.html?qaIdeas='+ideaCount,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(count=>document.querySelectorAll('.dc-notice[data-artifact]').length===count,ideaCount,{timeout:3000});
    await page.waitForFunction(()=>Number(globalThis.__QA?.participantRpcCount)===1,{timeout:2500});
    await page.waitForTimeout(delays.participant+80);
    const result=await page.evaluate(()=>({participantRpcCount:Number(globalThis.__QA.participantRpcCount||0),participantFirstStartedAt:globalThis.__QA.participantFirstStartedAt,firstRender:globalThis.__QA.firstRender}));
    return{ideas:ideaCount,...result,pageErrors:errors};
  }finally{await context.close()}
}

const browser=await chromium.launch({headless:true});
let baseline=null,after=null,imageFixtures=null,participantRequestCounts=null;
try{
  participantRequestCounts=[];
  for(const ideas of [1,5,20]){
    const probe=await participantRequestCountProbe(browser,ideas);
    participantRequestCounts.push(probe);
    expect(probe.participantRpcCount===1,'batch request count '+ideas+' Ideas expected 1 RPC '+JSON.stringify(probe));
    expect(probe.pageErrors.length===0,'batch request count '+ideas+' Ideas page errors '+JSON.stringify(probe));
  }
  baseline=await baselineProbe(browser);
  expect(baseline.firstRender>=1400,'baseline: delayed enrichment did not block first render '+JSON.stringify(baseline));
  expect(baseline.signedUrlCountBeforeFirstRender===2,'baseline: signed URLs were not all generated before first render '+JSON.stringify(baseline));

  const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const pageErrors=[];page.on('pageerror',error=>pageErrors.push(error.message));
  await page.goto(base+'/qa-board.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>Number(globalThis.__QA?.firstRender)>0,{timeout:3000});
  const first=await page.evaluate(()=>({...globalThis.__QA}));
  after={
    structuralMs:first.firstRender-first.start,
    interactiveMs:first.interactive-first.start,
    signedUrlCountBeforeFirstRender:first.signedAtFirstRender,
    participantRpcCountBeforeFirstRender:first.participantAtFirstRender
  };
  expect(after.structuralMs<delays.participant,'after: structural cards still wait for participant reads '+JSON.stringify(after));
  expect(after.structuralMs<delays.mediaRead,'after: structural cards still wait for media read '+JSON.stringify(after));
  expect(after.signedUrlCountBeforeFirstRender===0,'after: signed URLs started before first render '+JSON.stringify(after));
  expect(after.participantRpcCountBeforeFirstRender===0,'after: participant reads started before first render '+JSON.stringify(after));
  expect(first.circleSafeAtFirstRender===true,'after: CIRCLE structural card exposed enrichment-dependent actions '+JSON.stringify(first));
  expect(Number.isFinite(after.interactiveMs)&&after.interactiveMs<delays.mediaRead,'after: Board not usable before enrichment '+JSON.stringify(after));

  await page.waitForFunction(()=>document.querySelector('[data-board-invitation-indicator]')?.textContent?.includes('1'),{timeout:2500});
  await page.waitForFunction(()=>document.querySelectorAll('.dc-notice__media img').length===2,{timeout:3000});
  const enriched=await page.evaluate(id=>({
    participantRpcCount:globalThis.__QA.participantRpcCount,signedUrlCount:globalThis.__QA.signedUrlCount,mediaCount:globalThis.__QA.mediaCount,
    participantFirstStartedAt:globalThis.__QA.participantFirstStartedAt,mediaReadStartedAt:globalThis.__QA.mediaReadStartedAt,signedFirstStartedAt:globalThis.__QA.signedFirstStartedAt,
    firstRender:globalThis.__QA.firstRender,start:globalThis.__QA.start,
    invitation:document.querySelector('[data-board-invitation-indicator]')?.textContent?.trim()||null,
    invitedState:document.querySelector('.dc-notice[data-artifact="'+id+'"]')?.dataset.collabMyState||null,
    invitedClass:document.querySelector('.dc-notice[data-artifact="'+id+'"]')?.classList.contains('is-invited-to-me')||false,
    imageAttrs:[...document.querySelectorAll('.dc-notice__media img')].map(img=>({loading:img.getAttribute('loading'),decoding:img.getAttribute('decoding')})),
    sameCardNodes:Array.isArray(globalThis.__QA.firstCardNodes)&&globalThis.__QA.firstCardNodes.every((node,index)=>node===document.querySelectorAll('.dc-notice[data-artifact]')[index]),
    projectionUpdates:Number(globalThis.__QA.projectionUpdates||0)
  }),A);
  after={...after,participantRpcCount:enriched.participantRpcCount,signedUrlCount:enriched.signedUrlCount,mediaCount:enriched.mediaCount,enrichmentCompleteMs:Math.max(enriched.signedFirstStartedAt||0,enriched.participantFirstStartedAt||0)-enriched.start+delays.signed};
  expect(enriched.participantRpcCount===1,'after: participant batch RPC count expected one request '+JSON.stringify(enriched));
  expect(enriched.signedUrlCount===2&&enriched.mediaCount===2,'after: media/signed enrichment count mismatch '+JSON.stringify(enriched));
  expect(enriched.participantFirstStartedAt>=enriched.firstRender,'after: participant enrichment began before structural render '+JSON.stringify(enriched));
  expect(enriched.mediaReadStartedAt>=enriched.firstRender,'after: media enrichment began before structural render '+JSON.stringify(enriched));
  expect(enriched.signedFirstStartedAt>enriched.firstRender,'after: signed URL generation began before structural render '+JSON.stringify(enriched));
  expect(enriched.invitation==='ПРИГЛАШЕНИЯ · 1'&&enriched.invitedState==='INVITED'&&enriched.invitedClass,'BQA-24 delayed invitation presentation failed '+JSON.stringify(enriched));
  expect(enriched.sameCardNodes===true,'progressive enrichment replaced canonical card nodes '+JSON.stringify(enriched));
  expect(enriched.projectionUpdates>=2,'secondary/media enrichment did not notify canonical Board presentation owners '+JSON.stringify(enriched));
  expect(enriched.imageAttrs.every(row=>row.loading==='lazy'&&row.decoding==='async'),'media lazy/async attributes missing '+JSON.stringify(enriched.imageAttrs));
  await page.locator('[data-board-invitation-indicator]').click();await page.waitForTimeout(40);
  const nav=await page.evaluate(()=>({view:globalThis.__QA.viewRequest,opened:globalThis.__QA.invitationOpen}));
  expect(nav.view?.view==='all'&&nav.opened===A,'BQA-24 invitation exact Idea activation changed '+JSON.stringify(nav));

  await page.evaluate(id=>{globalThis.__QA.participation[id]='JOINED';window.dispatchEvent(new CustomEvent('dc:artifact-collaboration-changed',{detail:{artifactId:id}}));window.dispatchEvent(new CustomEvent('dc:board-artifact-closed'))},A);
  await page.waitForFunction(id=>document.querySelector('.dc-notice[data-artifact="'+id+'"]')?.dataset.collabMyState==='JOINED',A,{timeout:2500});
  expect(await page.locator('[data-board-invitation-indicator]').count()===0,'BQA-28 JOINED left stale invitation indicator');
  await page.evaluate(id=>{globalThis.__QA.participation[id]='DECLINED';window.dispatchEvent(new CustomEvent('dc:artifact-collaboration-changed',{detail:{artifactId:id}}));window.dispatchEvent(new CustomEvent('dc:board-close-artifact'))},A);
  await page.waitForFunction(id=>!document.querySelector('.dc-notice[data-artifact="'+id+'"]'),A,{timeout:1800});
  expect(await page.locator('[data-board-invitation-indicator]').count()===0,'BQA-28/CIRCLE DECLINED kept stale invitation');

  imageFixtures=await fixtureMatrix(page);
  for(const row of imageFixtures.rows){
    expect(row.afterWidth<=1800&&row.afterHeight<=1800,'image '+row.name+': longest edge exceeds 1800 '+JSON.stringify(row));
    if(row.name==='small.jpg')expect(row.afterWidth===640&&row.afterHeight===480,'image small: upscaled '+JSON.stringify(row));
    else expect(row.afterBytes<row.beforeBytes,'image '+row.name+': smaller representation not selected '+JSON.stringify(row));
  }
  const transparent=imageFixtures.rows.find(row=>row.name==='transparent.png');
  expect(transparent&&transparent.alpha!==null&&transparent.alpha<255,'transparent PNG alpha was lost '+JSON.stringify(transparent));
  const near=imageFixtures.rows.find(row=>row.name==='near-4mb.jpg');
  expect(near&&near.beforeBytes>=2.8*1024*1024&&near.beforeBytes<=4.1*1024*1024,'near-4MB fixture not near input limit '+JSON.stringify(near));
  expect(imageFixtures.safari.decoder==='image-element','Safari/Image fallback did not execute '+JSON.stringify(imageFixtures.safari));
  expect(imageFixtures.broken==='MEDIA_DECODE_FAILED','broken image did not fail recoverably '+imageFixtures.broken);
  expect(imageFixtures.encodeFallback.usedNormalized===false&&imageFixtures.encodeFallback.bytes===imageFixtures.encodeFallback.originalBytes,'encode failure did not preserve valid original '+JSON.stringify(imageFixtures.encodeFallback));

  await page.getByRole('button',{name:/ПРИКОЛОТЬ ПУБЛИКАЦИЮ/}).click();await page.locator('#artifactBody').fill('QA normalized upload');
  await assignGeneratedFile(page,'#artifactFile',{name:'camera.jpg',type:'image/jpeg',width:2400,height:1600});
  await page.locator('#artifactForm button[type="submit"]').click();
  await page.waitForFunction(()=>globalThis.__QA.uploads.length===1&&globalThis.__QA.attachCalls.length===1&&globalThis.__QA.publishCalls===1,{timeout:5000});
  const upload=await page.evaluate(()=>({upload:globalThis.__QA.uploads[0],attach:globalThis.__QA.attachCalls[0],publishCalls:globalThis.__QA.publishCalls}));
  const md=upload.attach?.p_metadata||{};
  expect(upload.upload.type==='image/webp'&&upload.upload.path.endsWith('.webp'),'upload: smaller normalized WebP was not uploaded '+JSON.stringify(upload));
  expect(md.original_name==='camera.jpg'&&md.original_mime==='image/jpeg'&&md.original_bytes>md.normalized_bytes&&md.original_width===2400&&md.original_height===1600,'upload: original metadata incomplete '+JSON.stringify(md));
  expect(md.normalized_mime==='image/webp'&&md.normalized_bytes===upload.upload.size&&md.normalized_width===1800&&md.normalized_height===1200&&md.normalization_applied===true,'upload: normalized metadata incomplete '+JSON.stringify(md));

  await page.getByRole('button',{name:/ПРИКОЛОТЬ ПУБЛИКАЦИЮ/}).click();await page.locator('#artifactBody').fill('QA broken upload');
  await assignGeneratedFile(page,'#artifactFile',{name:'broken.jpg',type:'image/jpeg',broken:true});
  const beforeBroken=await page.evaluate(()=>({uploads:globalThis.__QA.uploads.length,publishes:globalThis.__QA.publishCalls}));
  await page.locator('#artifactForm button[type="submit"]').click();await page.locator('.dc-composer-error').waitFor({state:'visible',timeout:2500});
  const afterBroken=await page.evaluate(()=>({uploads:globalThis.__QA.uploads.length,publishes:globalThis.__QA.publishCalls,error:document.querySelector('.dc-composer-error')?.textContent||''}));
  expect(afterBroken.uploads===beforeBroken.uploads&&afterBroken.publishes===beforeBroken.publishes&&/прочитать изображение/i.test(afterBroken.error),'broken media was uploaded/published or not recoverable '+JSON.stringify({beforeBroken,afterBroken}));

  await assignGeneratedFile(page,'#artifactFile',{name:'orphan.jpg',type:'image/jpeg',width:2400,height:1600});await page.evaluate(()=>{globalThis.__QA.attachFail=true});
  const beforeOrphan=await page.evaluate(()=>({uploads:globalThis.__QA.uploads.length,removes:globalThis.__QA.removes.length,publishes:globalThis.__QA.publishCalls}));
  await page.locator('#artifactForm button[type="submit"]').click();await page.waitForFunction(before=>globalThis.__QA.removes.length>before.removes,beforeOrphan,{timeout:5000});
  const afterOrphan=await page.evaluate(()=>({uploads:globalThis.__QA.uploads,removes:globalThis.__QA.removes,publishes:globalThis.__QA.publishCalls}));
  const orphanPath=afterOrphan.uploads.at(-1)?.path||null;
  expect(afterOrphan.removes.includes(orphanPath)&&afterOrphan.publishes===beforeOrphan.publishes,'orphan upload cleanup/publish guard failed '+JSON.stringify({beforeOrphan,afterOrphan,orphanPath}));
  expect(!pageErrors.length,'browser page errors: '+pageErrors.join(' | '));
  await context.close();
}finally{await browser.close();server.close()}

console.log('BOARD_MEDIA_BASELINE '+JSON.stringify(baseline));
console.log('BOARD_MEDIA_AFTER '+JSON.stringify(after));
console.log('BOARD_PARTICIPANT_BATCH_REQUEST_COUNT '+JSON.stringify(participantRequestCounts));
console.log('BOARD_MEDIA_FIXTURES '+JSON.stringify(imageFixtures?.rows||[]));
if(failures.length){console.error('BOARD / MEDIA PERFORMANCE BROWSER QA BLOCKED');for(const failure of failures)console.error('- '+failure);process.exit(1)}
console.log('BOARD / MEDIA PERFORMANCE BROWSER QA PASS');
console.log('✓ delayed participant/media/signed-url work does not block structural or usable Board');
console.log('✓ BQA-24 delayed invitation + BQA-28 freshness/CIRCLE privacy exercised');
console.log('✓ JPEG/PNG/WebP portrait/landscape/transparent/near-4MB/small fixtures + Safari fallback exercised');
console.log('✓ normalized upload metadata, broken-media guard and orphan cleanup exercised');
