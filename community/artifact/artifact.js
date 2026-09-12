import {getClient,currentSession,loginWithGoogle,getEntryStatus,signedMediaUrl,esc,formatDate,errorMessage,route} from '/community-runtime-v1.js';
import {resolveBoardUserState,isBoardMemberState,BOARD_USER_STATES} from '/community/board/board-user-state-v2.js';

const host=document.getElementById('artifactHost');
const stateEl=document.getElementById('artifactState');
const BOARD_PATH=route('/workspace/board/');
let client=null,session=null,boardState=null,artifact=null,reactions=[],responses=[],guestMode=false,guestInterest=false,guestInterestCount=0,guestResponseSubmitted=false;

function idFromLocation(){const query=new URLSearchParams(location.search).get('id');if(query)return query;const parts=location.pathname.split('/').filter(Boolean);const i=parts.indexOf('artifact');return i>=0&&parts[i+1]&&parts[i+1]!=='index.html'?parts[i+1]:null}
function fail(error){stateEl.textContent='ERROR';host.innerHTML=`<div class="dc-artifact-error">${esc(errorMessage(error))}</div>`}
function avatar(profile){if(profile?.avatar_url)return `<img class="dc-artifact-avatar" src="${esc(profile.avatar_url)}" alt="">`;return `<span class="dc-artifact-avatar empty">${esc(String(profile?.display_name||'?').charAt(0).toUpperCase())}</span>`}
function cameFromBoard(){try{if(!document.referrer)return false;const ref=new URL(document.referrer),board=new URL(BOARD_PATH,location.origin);const normalize=value=>value.replace(/\/+$/,'/');return ref.origin===location.origin&&normalize(ref.pathname)===normalize(board.pathname)}catch{return false}}
function returnToBoard(event){event?.preventDefault();if(cameFromBoard()&&history.length>1){history.back();return}location.assign(BOARD_PATH)}
function bindBoardReturn(){document.getElementById('artifactBackTop')?.addEventListener('click',returnToBoard);document.getElementById('detailBack')?.addEventListener('click',returnToBoard)}
function isHistorical(){return ['expired','archived'].includes(String(artifact?.status||'').toLowerCase())}
function reactionTotal(){return guestMode?Math.max(0,Number(reactions.length||0))+Math.max(0,Number(guestInterestCount||0)):reactions.length}

async function loadMember(){
  const id=idFromLocation();if(!id)throw new Error('ARTIFACT_ID_REQUIRED');
  const result=await client.from('dc_artifacts').select('id,author_profile_id,title,body,external_url,status,visibility,starts_at,expires_at,published_at,created_at,closed_at').eq('id',id).maybeSingle();if(result.error)throw result.error;if(!result.data)throw new Error('ARTIFACT_NOT_FOUND');artifact=result.data;
  const [profileResult,reactionResult,mediaResult,responseResult]=await Promise.all([
    client.from('dc_member_public_profiles').select('profile_id,display_name,nickname,avatar_url,member_since').eq('profile_id',artifact.author_profile_id).maybeSingle(),
    client.from('dc_artifact_reactions').select('id,profile_id,reaction_type').eq('artifact_id',artifact.id),
    client.from('dc_artifact_media').select('id,media_type,storage_path,metadata').eq('artifact_id',artifact.id),
    client.from('dc_artifact_responses').select('id,responder_profile_id,message,status,created_at').eq('artifact_id',artifact.id)
  ]);for(const r of [profileResult,reactionResult,mediaResult,responseResult])if(r.error)throw r.error;
  reactions=reactionResult.data||[];responses=responseResult.data||[];const profile=profileResult.data||null;const media=mediaResult.data||[];const signed=[];for(const item of media){let url=null;try{url=await signedMediaUrl(client,item.storage_path)}catch{}signed.push({...item,url})}render(profile,signed);
}

async function loadGuest(){
  const id=idFromLocation();if(!id)throw new Error('ARTIFACT_ID_REQUIRED');
  const {data,error}=await client.rpc('dc_guest_board_artifact_detail_read_v1',{p_artifact_id:id});
  if(error)throw error;
  const payload=Array.isArray(data)?data[0]:data;
  if(!payload?.artifact)throw new Error('ARTIFACT_NOT_FOUND');
  artifact=payload.artifact;
  reactions=Array.from({length:Math.max(0,Number(payload.reaction_count||0))},(_,i)=>({id:`count-${i}`}));
  responses=[];
  guestInterest=payload.my_guest_interest===true;
  guestInterestCount=Math.max(0,Number(payload.guest_interest_count||0));
  guestResponseSubmitted=payload.my_guest_response_submitted===true;
  const signed=[];
  for(const item of payload.media||[]){let url=null;try{url=await signedMediaUrl(client,item.storage_path)}catch{}signed.push({...item,url})}
  render(payload.author||null,signed);
}

async function load(){return guestMode?loadGuest():loadMember()}

function render(profile,media){
  const mine=!guestMode&&artifact.author_profile_id===session.user.id;
  const myReaction=guestMode?guestInterest:reactions.some(r=>r.profile_id===session.user.id);
  const myResponse=guestMode?(guestResponseSubmitted?{status:'submitted'}:null):responses.find(r=>r.responder_profile_id===session.user.id&&r.status==='submitted');
  const incoming=mine?responses.filter(r=>r.status==='submitted').length:0;
  const historical=isHistorical();
  const item=media[0];let mediaHtml='';if(item?.url)mediaHtml=item.media_type==='image'?`<div class="dc-artifact-media"><img src="${esc(item.url)}" alt="Прикреплённое изображение"></div>`:`<div class="dc-artifact-media"><a class="dc-artifact-file" href="${esc(item.url)}" target="_blank" rel="noopener">ФАЙЛ / ${esc(item.metadata?.name||'ОТКРЫТЬ')} ↗</a></div>`;
  stateEl.textContent=`ARTIFACT / ${artifact.status.toUpperCase()}`;
  const responseControl=historical
    ?'<span class="dc-artifact-action" aria-disabled="true">ОТКЛИКИ ЗАКРЫТЫ / HISTORY</span>'
    :mine?`<span class="dc-artifact-action" aria-disabled="true">ОТКЛИКОВ / ${incoming}</span>`:`<button class="dc-artifact-action${myResponse?' primary':''}" type="button" id="detailResponse" ${myResponse?'disabled':''}>${myResponse?'ОТКЛИК ОТПРАВЛЕН':'ОТКЛИКНУТЬСЯ'}</button>`;
  host.innerHTML=`<article class="dc-artifact-record${historical?' is-history':''}" data-artifact-status="${esc(artifact.status)}"><div class="dc-artifact-meta"><span>ID / ${esc(artifact.id.slice(0,8).toUpperCase())}</span><span>STATUS / ${esc(artifact.status.toUpperCase())}</span><span>${artifact.expires_at?`EXPIRES / ${formatDate(artifact.expires_at)}`:'PERSISTENT'}</span></div><div class="dc-artifact-author">${avatar(profile)}<div><strong>${esc(profile?.display_name||'MEMBER')}</strong>${profile?.nickname?`<span>@${esc(profile.nickname.replace(/^@/,''))}</span>`:''}</div></div>${artifact.title?`<h1>${esc(artifact.title)}</h1>`:'<h1>ARTIFACT.</h1>'}<div class="dc-artifact-body">${esc(artifact.body)}</div>${mediaHtml}${artifact.external_url?`<p><a class="dc-artifact-link" href="${esc(artifact.external_url)}" target="_blank" rel="noopener">ВНЕШНЯЯ ССЫЛКА ↗</a></p>`:''}<div class="dc-artifact-actions"><span class="dc-artifact-action" aria-disabled="true">ИНТЕРЕСНО / ${reactionTotal()}</span><button class="dc-artifact-action${myReaction?' primary':''}" type="button" id="detailReaction">${myReaction?'✓ ИНТЕРЕСНО':'МНЕ ЭТО НАДО'}</button>${responseControl}${mine&&artifact.status==='active'?'<button class="dc-artifact-action" type="button" id="detailClose">УБРАТЬ С ДОСКИ</button>':''}<a class="dc-artifact-action" href="${BOARD_PATH}" id="detailBack">← BOARD</a></div><div id="responseHost"></div></article>`;
  document.getElementById('detailReaction').onclick=toggleReaction;document.getElementById('detailClose')?.addEventListener('click',closeArtifact);document.getElementById('detailResponse')?.addEventListener('click',openResponse);bindBoardReturn();
}

async function toggleReaction(event){
  const button=event.currentTarget;button.disabled=true;
  try{
    if(guestMode){
      const result=await client.rpc('dc_guest_board_interest_toggle_v1',{p_artifact_id:artifact.id});if(result.error)throw result.error;
      const payload=Array.isArray(result.data)?result.data[0]:result.data;guestInterest=payload?.active===true;guestInterestCount=Math.max(0,Number(payload?.count||0));
    }else{
      const active=reactions.some(r=>r.profile_id===session.user.id);
      if(active){const result=await client.from('dc_artifact_reactions').delete().eq('artifact_id',artifact.id).eq('profile_id',session.user.id).eq('reaction_type','interested');if(result.error)throw result.error}
      else{const result=await client.from('dc_artifact_reactions').insert({artifact_id:artifact.id,profile_id:session.user.id,reaction_type:'interested'});if(result.error)throw result.error}
    }
    await load();
  }catch(error){button.disabled=false;fail(error)}
}

function openResponse(){if(isHistorical())return;const responseHost=document.getElementById('responseHost');responseHost.innerHTML='<div class="dc-artifact-response"><textarea maxlength="2000" placeholder="Можно коротко написать автору, зачем вы откликаетесь."></textarea><div class="dc-artifact-actions"><button class="dc-artifact-action primary" type="button" id="sendResponse">ОТПРАВИТЬ</button><button class="dc-artifact-action" type="button" id="cancelResponse">ОТМЕНА</button></div></div>';document.getElementById('cancelResponse').onclick=()=>{responseHost.innerHTML=''};document.getElementById('sendResponse').onclick=sendResponse}
async function sendResponse(event){
  if(isHistorical())return;
  const button=event.currentTarget;const text=host.querySelector('.dc-artifact-response textarea')?.value.trim()||null;button.disabled=true;button.textContent='ОТПРАВЛЯЕМ…';
  const result=guestMode
    ?await client.rpc('dc_guest_board_response_submit_v1',{p_artifact_id:artifact.id,p_message:text})
    :await client.from('dc_artifact_responses').insert({artifact_id:artifact.id,responder_profile_id:session.user.id,message:text,status:'submitted'});
  if(result.error){button.disabled=false;button.textContent='ОТПРАВИТЬ';fail(result.error);return}await load()
}
async function closeArtifact(){if(!confirm('Убрать Artifact с активной доски и перенести в архив?'))return;const result=await client.rpc('dc_close_artifact_v1',{p_artifact_id:artifact.id});if(result.error){fail(result.error);return}location.assign(BOARD_PATH)}

async function boot(){
  bindBoardReturn();client=getClient();session=await currentSession(client);
  if(!session){stateEl.textContent='AUTH REQUIRED';host.innerHTML='<div class="dc-artifact-service"><button class="dc-artifact-action primary" id="artifactLogin" type="button">ВОЙТИ ЧЕРЕЗ GOOGLE →</button></div>';document.getElementById('artifactLogin').onclick=()=>loginWithGoogle(location.pathname+location.search,client).catch(fail);return}
  boardState=await resolveBoardUserState(client);guestMode=!isBoardMemberState(boardState.key)&&boardState.key!==BOARD_USER_STATES.UNAUTHENTICATED;
  if(boardState.key===BOARD_USER_STATES.UNAUTHENTICATED){stateEl.textContent='AUTH REQUIRED';return}
  if(guestMode){await loadGuest();return}
  const status=await getEntryStatus(client);if(!status.membership_active&&!isBoardMemberState(boardState.key)){stateEl.textContent='MEMBERSHIP REQUIRED';host.innerHTML=`<div class="dc-artifact-service">ARTIFACT ДОСТУПЕН ПОСЛЕ ВХОДА. <a href="${route('/join/')}">ПРОЙТИ GATE →</a></div>`;return}
  await loadMember();
}
boot().catch(fail);
