import {getClient,loginWithGoogle,signedMediaUrl,esc,formatDate,errorMessage,route} from '/community-runtime-v1.js';
import {resolveBoardUserState,isBoardMemberState,BOARD_USER_STATES} from '/community/board/board-user-state-v2.js';
import {artifactSubtypeLabel} from '/community/board/board-entity-model-v1.js';

const host=document.getElementById('artifactHost');
const stateEl=document.getElementById('artifactState');
const BOARD_PATH=route('/workspace/board/');
window.__DC_ARTIFACT_RUNTIME_STARTED__=true;
const QA_TIMEOUTS=window.__DC_ARTIFACT_TEST_TIMEOUTS__||{};
const ESSENTIAL_TIMEOUT_MS=Math.max(100,Number(QA_TIMEOUTS.essential)||6500);
const OPTIONAL_TIMEOUT_MS=Math.max(80,Number(QA_TIMEOUTS.optional)||1800);
let client=null,session=null,boardState=null,artifact=null,reactions=[],responses=[],participants=[],authorProfile=null,guestMode=false,guestInterest=false,guestInterestCount=0,guestResponseSubmitted=false,promotion=null,enrichmentState='pending';

function timeoutError(code){const error=new Error(code);error.code=code;return error}
function withDeadline(value,ms,code){
  let timer=null;
  const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(timeoutError(code)),ms)});
  return Promise.race([Promise.resolve(value),timeout]).finally(()=>clearTimeout(timer));
}
async function optionalResult(value,label){
  try{const result=await withDeadline(value,OPTIONAL_TIMEOUT_MS,`OPTIONAL_${label}_TIMEOUT`);if(result?.error)throw result.error;return{ok:true,data:result?.data??null}}catch(error){console.warn('[Artifact detail optional]',label,error);return{ok:false,data:null,error}}
}
async function optionalValue(value,label){
  try{return{ok:true,data:await withDeadline(value,OPTIONAL_TIMEOUT_MS,`OPTIONAL_${label}_TIMEOUT`)}}catch(error){console.warn('[Artifact detail optional]',label,error);return{ok:false,data:null,error}}
}

function idFromLocation(){const query=new URLSearchParams(location.search).get('id');if(query)return query;const parts=location.pathname.split('/').filter(Boolean);const i=parts.indexOf('artifact');return i>=0&&parts[i+1]&&parts[i+1]!=='index.html'?parts[i+1]:null}
function terminalKind(error){
  const raw=String(error?.code||error?.message||error||'');
  if(raw.includes('ARTIFACT_ID_REQUIRED'))return 'INVALID';
  if(raw.includes('ARTIFACT_NOT_FOUND')||raw.includes('ARTIFACT_NOT_AVAILABLE'))return 'NOT FOUND';
  if(/MEMBERSHIP_REQUIRED|42501|permission|denied|forbidden|row.level.security|not authorized/i.test(raw))return 'DENIED';
  return 'ERROR';
}
function fail(error){
  const state=terminalKind(error);stateEl.textContent=state;
  const raw=String(error?.code||error?.message||error||'');
  const copy=state==='INVALID'?'Некорректная ссылка на Artifact.':state==='NOT FOUND'?'Artifact не найден или больше недоступен.':state==='DENIED'?'У текущего аккаунта нет доступа к этому Artifact.':errorMessage(error);
  const joinRecovery=raw.includes('MEMBERSHIP_REQUIRED')?`<a class="dc-artifact-action" href="${route('/join/')}">ПРОЙТИ GATE →</a>`:'';
  host.innerHTML=`<div class="dc-artifact-error"><strong>${esc(state)}</strong><p>${esc(copy)}</p><div class="dc-artifact-actions"><button class="dc-artifact-action" type="button" id="artifactRetry">ПОВТОРИТЬ</button>${joinRecovery}<a class="dc-artifact-action" href="${BOARD_PATH}" id="detailBack">← BOARD</a></div></div>`;
  document.getElementById('artifactRetry')?.addEventListener('click',()=>location.reload());
}
function avatar(profile){if(profile?.avatar_url)return `<img class="dc-artifact-avatar" src="${esc(profile.avatar_url)}" alt="">`;return `<span class="dc-artifact-avatar empty">${esc(String(profile?.display_name||'?').charAt(0).toUpperCase())}</span>`}
function collabAvatar(profile){if(profile?.avatar_url)return `<img class="dc-collab-avatar" src="${esc(profile.avatar_url)}" alt="">`;return `<span class="dc-collab-avatar dc-collab-avatar--empty" aria-hidden="true">${esc(String(profile?.display_name||'?').charAt(0).toUpperCase())}</span>`}
function currentParticipation(){return participants.find(row=>row.profile_id===session?.user?.id)?.participation_state||''}
function isIdea(){return String(artifact?.artifact_type||'').toLowerCase()==='idea'}
function isAuthor(){return Boolean(session?.user&&artifact?.author_profile_id===session.user.id)}
function visibilityLabel(){return artifact?.visibility==='circle'?'СВОЙ КРУГ':'ВЕСЬ КЛУБ'}
function participantPeople(rows,{remove=false}={}){
  if(!rows.length)return'<span class="dc-collab-empty">—</span>';
  return rows.map(row=>`<span class="dc-artifact-collab-person">${collabAvatar(row)}<span><strong>${esc(row.display_name||'УЧАСТНИК')}</strong>${row.nickname?`<small>@${esc(String(row.nickname).replace(/^@/,''))}</small>`:''}</span>${remove?`<button class="dc-artifact-collab-remove" type="button" data-remove-participant="${esc(row.profile_id)}" aria-label="Убрать ${esc(row.display_name||'участника')}">×</button>`:''}</span>`).join('');
}
function cameFromBoard(){try{if(!document.referrer)return false;const ref=new URL(document.referrer),board=new URL(BOARD_PATH,location.origin);const normalize=value=>value.replace(/\/+$/,'/');return ref.origin===location.origin&&normalize(ref.pathname)===normalize(board.pathname)}catch{return false}}
function returnToBoard(event){event?.preventDefault();if(cameFromBoard()&&history.length>1){history.back();return}location.assign(BOARD_PATH)}
function bindBoardReturn(){document.getElementById('artifactBackTop')?.addEventListener('click',returnToBoard);document.getElementById('detailBack')?.addEventListener('click',returnToBoard)}
function isHistorical(){return ['expired','archived'].includes(String(artifact?.status||'').toLowerCase())}
function reactionTotal(){return guestMode?Math.max(0,Number(reactions.length||0))+Math.max(0,Number(guestInterestCount||0)):reactions.length}
function isOwnerAdmin(){return boardState?.key===BOARD_USER_STATES.OWNER_ADMIN}
function formatActivityDate(value){if(!value)return'';const d=new Date(value);if(Number.isNaN(d.getTime()))return'';return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d).replace(',',' ·').toUpperCase()}
function renderArtifactBody(value){const safe=esc(String(value||''));return safe.replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>')}
function promotionLabel(row){
  if(!row)return'';const count=Math.max(0,Number(row.support_count||0));const threshold=Math.max(0,Number(row.promotion_threshold||0));const status=String(row.delivery_status||'');
  if(status==='sent')return '✓ TELEGRAM';if(status==='pending')return `${count}/${threshold} · В ОЧЕРЕДИ`;if(status==='processing')return `${count}/${threshold} · ОТПРАВЛЯЕТСЯ`;if(status==='suppressed')return 'TELEGRAM ОТКЛЮЧЁН';if(status==='delivery_unknown')return 'ТРЕБУЕТ ПРОВЕРКИ';if(status==='cancelled')return 'TELEGRAM ОТМЕНЁН';if(status==='failed')return 'TELEGRAM · ОШИБКА ДОСТАВКИ';if(status==='held'&&threshold>0)return `TELEGRAM · ${count}/${threshold}`;return '';
}
async function readPromotion(){
  const {data,error}=await client.rpc('dc_board_promotion_state_read_v1');if(error)throw error;const id=artifact?.id||idFromLocation();return(data||[]).find(row=>row.artifact_id===id)||null;
}
async function signMedia(media){
  const signed=await Promise.all((media||[]).map(async item=>{const result=await optionalValue(signedMediaUrl(client,item.storage_path),'MEDIA_SIGN');return{...item,url:result.ok?result.data:null}}));
  return signed;
}
async function readParticipants(){
  participants=[];
  if(!isIdea())return;
  const result=await withDeadline(client.rpc('dc_artifact_participants_read_v1',{p_artifact_id:artifact.id}),ESSENTIAL_TIMEOUT_MS,'ARTIFACT_PARTICIPANTS_TIMEOUT');
  if(result.error)throw result.error;
  participants=Array.isArray(result.data)?result.data:[];
}

async function loadMember(){
  const id=idFromLocation();if(!id)throw new Error('ARTIFACT_ID_REQUIRED');
  const result=await withDeadline(client.from('dc_artifacts').select('id,author_profile_id,artifact_type,title,body,external_url,status,visibility,starts_at,activity_at,expires_at,published_at,created_at,closed_at').eq('id',id).maybeSingle(),ESSENTIAL_TIMEOUT_MS,'ARTIFACT_PRIMARY_TIMEOUT');
  if(result.error)throw result.error;if(!result.data)throw new Error('ARTIFACT_NOT_FOUND');artifact=result.data;
  enrichmentState='pending';promotion=null;reactions=[];responses=[];participants=[];authorProfile=null;render(null,[]);
  await readParticipants();
  const [profileResult,reactionResult,mediaResult,responseResult,promotionResult]=await Promise.all([
    optionalResult(client.from('dc_member_public_profiles').select('profile_id,display_name,nickname,avatar_url,member_since').eq('profile_id',artifact.author_profile_id).maybeSingle(),'PROFILE'),
    optionalResult(client.from('dc_artifact_reactions').select('id,profile_id,reaction_type').eq('artifact_id',artifact.id),'REACTIONS'),
    optionalResult(client.from('dc_artifact_media').select('id,media_type,storage_path,metadata').eq('artifact_id',artifact.id),'MEDIA'),
    optionalResult(client.from('dc_artifact_responses').select('id,responder_profile_id,message,status,created_at').eq('artifact_id',artifact.id),'RESPONSES'),
    optionalValue(readPromotion(),'PROMOTION')
  ]);
  reactions=reactionResult.ok?(reactionResult.data||[]):[];
  responses=responseResult.ok?(responseResult.data||[]):[];
  promotion=promotionResult.ok?promotionResult.data:null;
  const profile=profileResult.ok?(profileResult.data||null):null;authorProfile=profile;
  const signed=mediaResult.ok?await signMedia(mediaResult.data||[]):[];
  enrichmentState=reactionResult.ok&&responseResult.ok?'ready':'degraded';
  render(profile,signed);
}

async function loadGuest(){
  const id=idFromLocation();if(!id)throw new Error('ARTIFACT_ID_REQUIRED');
  const result=await withDeadline(client.rpc('dc_guest_board_artifact_detail_read_v1',{p_artifact_id:id}),ESSENTIAL_TIMEOUT_MS,'ARTIFACT_PRIMARY_TIMEOUT');
  if(result.error)throw result.error;const payload=Array.isArray(result.data)?result.data[0]:result.data;if(!payload?.artifact)throw new Error('ARTIFACT_NOT_FOUND');artifact=payload.artifact;
  reactions=Array.from({length:Math.max(0,Number(payload.reaction_count||0))},(_,i)=>({id:`count-${i}`}));responses=[];guestInterest=payload.my_guest_interest===true;guestInterestCount=Math.max(0,Number(payload.guest_interest_count||0));guestResponseSubmitted=payload.my_guest_response_submitted===true;
  enrichmentState='ready';promotion=null;authorProfile=payload.author||null;await readParticipants();render(authorProfile,[]);
  const [promotionResult,signed]=await Promise.all([
    optionalValue(readPromotion(),'PROMOTION'),
    signMedia(payload.media||[])
  ]);
  promotion=promotionResult.ok?promotionResult.data:null;render(authorProfile,signed);
}
async function load(){return guestMode?loadGuest():loadMember()}

function promotionControls(){
  if(!promotion)return'';const count=Math.max(0,Number(promotion.support_count||0));const threshold=Math.max(0,Number(promotion.promotion_threshold||0));const status=String(promotion.delivery_status||'');const parts=[];const label=promotionLabel(promotion);if(label)parts.push(`<span class="dc-artifact-action" aria-disabled="true">${esc(label)}</span>`);
  if(!isHistorical()&&promotion.can_support===true&&promotion.my_support!==true&&count<threshold)parts.push(`<button class="dc-artifact-action" type="button" id="detailPromotionSupport">ПОДДЕРЖАТЬ · ${count}/${threshold}</button>`);else if(promotion.my_support===true&&threshold>0)parts.push(`<span class="dc-artifact-action" aria-disabled="true">✓ ПОДДЕРЖАНО · ${count}/${threshold}</span>`);
  if(isOwnerAdmin()){
    if(status==='held'||status==='pending')parts.push('<button class="dc-artifact-action" type="button" id="detailAdminSuppress">НЕ ПУБЛИКОВАТЬ В TELEGRAM</button>');
    if(status==='delivery_unknown'&&promotion.outbox_id){parts.push('<button class="dc-artifact-action" type="button" id="detailResolveSent">ПОДТВЕРДИТЬ SENT</button>');parts.push('<button class="dc-artifact-action" type="button" id="detailResolveRetry">CONTROLLED RETRY</button>');parts.push('<button class="dc-artifact-action" type="button" id="detailResolveCancel">ОТМЕНИТЬ</button>')}
    parts.push('<button class="dc-artifact-action" type="button" id="detailAdminHide">СКРЫТЬ С ДОСКИ</button>');
  }
  return parts.join('');
}

function collaborationDetail(){
  if(!isIdea())return'';
  const joined=participants.filter(row=>row.participation_state==='JOINED');
  const invited=participants.filter(row=>row.participation_state==='INVITED');
  const state=currentParticipation();const manage=isAuthor()||isOwnerAdmin();const authorName=authorProfile?.display_name||'ИНИЦИАТОР';
  const viewer=state==='INVITED'
    ?`<div class="dc-artifact-collab__viewer" data-invite-state="INVITED"><strong>${esc(authorName.toUpperCase())} ЗОВЁТ ВАС В ЭТУ ИДЕЮ</strong><div class="dc-artifact-collab__viewer-actions"><button class="dc-artifact-action primary" type="button" data-invite-decision="JOINED">ПРИСОЕДИНИТЬСЯ</button><button class="dc-artifact-action" type="button" data-invite-decision="DECLINED">НЕ СЕЙЧАС</button></div></div>`
    :state==='JOINED'
      ?'<div class="dc-artifact-collab__viewer" data-invite-state="JOINED"><strong>ВЫ В ДЕЛЕ</strong><div class="dc-artifact-collab__viewer-actions"><button class="dc-artifact-action" type="button" data-leave-idea>ВЫЙТИ</button></div></div>'
      :'';
  const invite=manage?`<div class="dc-artifact-invite"><button class="dc-artifact-action" type="button" data-invite-toggle>+ ПОЗВАТЬ</button><div class="dc-artifact-invite__panel" data-invite-panel hidden><label for="artifactInviteSearch">Найти зарегистрированный профиль</label><div class="dc-artifact-invite__search"><input id="artifactInviteSearch" type="search" minlength="2" maxlength="80" autocomplete="off" placeholder="Имя или ник"><button class="dc-artifact-action" type="button" data-invite-search>НАЙТИ</button></div><div class="dc-artifact-invite__results" data-invite-results aria-live="polite"></div></div></div>`:'';
  return `<section class="dc-artifact-collab" data-artifact-collaboration data-my-participation="${esc(state)}"><div class="dc-artifact-collab__head"><span>ИДЕЯ / COLLABORATION</span><strong>ВИДНО · ${esc(visibilityLabel())}</strong></div><div class="dc-artifact-collab__group"><span>ИНИЦИАТОР</span><div class="dc-artifact-collab__people"><span class="dc-artifact-collab-person">${collabAvatar(authorProfile)}<span><strong>${esc(authorName)}</strong>${authorProfile?.nickname?`<small>@${esc(String(authorProfile.nickname).replace(/^@/,''))}</small>`:''}</span></span></div></div><div class="dc-artifact-collab__group"><span>В ДЕЛЕ</span><div class="dc-artifact-collab__people">${participantPeople(joined,{remove:manage})}</div></div><div class="dc-artifact-collab__group"><span>ПОЗВАНЫ</span><div class="dc-artifact-collab__people">${participantPeople(invited,{remove:manage})}</div></div>${viewer}${invite}<div class="dc-artifact-collab__status" data-collab-status hidden aria-live="polite"></div></section>`;
}
function collaborationStatus(message,state=''){
  const el=host.querySelector('[data-collab-status]');if(!el)return;el.textContent=message||'';el.dataset.state=state;el.hidden=!message;
}
async function refreshCollaboration(){await load()}
async function searchInviteCandidates(){
  const input=host.querySelector('#artifactInviteSearch');const results=host.querySelector('[data-invite-results]');const query=String(input?.value||'').trim();
  if(!results)return;if(query.length<2){results.innerHTML='<p>Введите минимум 2 символа.</p>';return}
  results.innerHTML='<p>ИЩЕМ…</p>';
  const result=await client.rpc('dc_artifact_invite_candidates_v1',{p_artifact_id:artifact.id,p_query:query,p_limit:12});
  if(result.error){results.innerHTML=`<p>${esc(errorMessage(result.error))}</p>`;return}
  const rows=Array.isArray(result.data)?result.data:[];
  results.innerHTML=rows.length?rows.map(row=>`<button class="dc-artifact-invite__candidate" type="button" data-invite-profile="${esc(row.profile_id)}">${collabAvatar(row)}<span><strong>${esc(row.display_name||'УЧАСТНИК')}</strong>${row.nickname?`<small>@${esc(String(row.nickname).replace(/^@/,''))}</small>`:''}${row.current_state?`<small>${esc(row.current_state)}</small>`:''}</span></button>`).join(''):'<p>ПОДХОДЯЩИХ ПРОФИЛЕЙ НЕТ.</p>';
}
async function inviteProfile(profileId){collaborationStatus('ПРИГЛАШАЕМ…','busy');const result=await client.rpc('dc_artifact_invite_v1',{p_artifact_id:artifact.id,p_profile_id:profileId});if(result.error){collaborationStatus(errorMessage(result.error),'error');return}await refreshCollaboration()}
async function respondInvitation(decision){collaborationStatus('СОХРАНЯЕМ…','busy');const result=await client.rpc('dc_artifact_invitation_respond_v1',{p_artifact_id:artifact.id,p_decision:decision});if(result.error){collaborationStatus(errorMessage(result.error),'error');return}if(decision==='DECLINED'&&artifact.visibility==='circle'){fail(new Error('ARTIFACT_NOT_AVAILABLE'));return}await refreshCollaboration()}
async function leaveIdea(){collaborationStatus('ВЫХОДИМ…','busy');const result=await client.rpc('dc_artifact_leave_v1',{p_artifact_id:artifact.id});if(result.error){collaborationStatus(errorMessage(result.error),'error');return}if(artifact.visibility==='circle'){fail(new Error('ARTIFACT_NOT_AVAILABLE'));return}await refreshCollaboration()}
async function removeParticipant(profileId){collaborationStatus('УБИРАЕМ…','busy');const result=await client.rpc('dc_artifact_remove_participant_v1',{p_artifact_id:artifact.id,p_profile_id:profileId});if(result.error){collaborationStatus(errorMessage(result.error),'error');return}await refreshCollaboration()}
function bindDetailActions(){
  bindBoardReturn();
  document.getElementById('detailPromotionSupport')?.addEventListener('click',supportPromotion);
  document.getElementById('detailAdminSuppress')?.addEventListener('click',adminSuppress);
  document.getElementById('detailAdminHide')?.addEventListener('click',adminHide);
  document.getElementById('detailResolveSent')?.addEventListener('click',()=>resolveUnknown('sent'));
  document.getElementById('detailResolveRetry')?.addEventListener('click',()=>resolveUnknown('retry'));
  document.getElementById('detailResolveCancel')?.addEventListener('click',()=>resolveUnknown('cancelled'));
  document.getElementById('detailReaction')?.addEventListener('click',toggleReaction);
  document.getElementById('detailResponse')?.addEventListener('click',openResponse);
  document.getElementById('detailClose')?.addEventListener('click',closeArtifact);
  host.querySelector('[data-invite-toggle]')?.addEventListener('click',event=>{const panel=host.querySelector('[data-invite-panel]');if(!panel)return;panel.hidden=!panel.hidden;if(!panel.hidden)panel.querySelector('input')?.focus()});
  host.querySelector('[data-invite-search]')?.addEventListener('click',()=>searchInviteCandidates().catch(error=>collaborationStatus(errorMessage(error),'error')));
  host.querySelector('#artifactInviteSearch')?.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();searchInviteCandidates().catch(error=>collaborationStatus(errorMessage(error),'error'))}});
  host.querySelector('[data-invite-results]')?.addEventListener('click',event=>{const button=event.target.closest?.('[data-invite-profile]');if(button)inviteProfile(button.dataset.inviteProfile).catch(error=>collaborationStatus(errorMessage(error),'error'))});
  host.querySelectorAll('[data-invite-decision]').forEach(button=>button.addEventListener('click',()=>respondInvitation(button.dataset.inviteDecision).catch(error=>collaborationStatus(errorMessage(error),'error'))));
  host.querySelector('[data-leave-idea]')?.addEventListener('click',()=>leaveIdea().catch(error=>collaborationStatus(errorMessage(error),'error')));
  host.querySelectorAll('[data-remove-participant]').forEach(button=>button.addEventListener('click',()=>removeParticipant(button.dataset.removeParticipant).catch(error=>collaborationStatus(errorMessage(error),'error'))));
}
function render(profile,media){
  authorProfile=profile||authorProfile;
  const mine=!guestMode&&artifact.author_profile_id===session.user.id;const myReaction=guestMode?guestInterest:reactions.some(r=>r.profile_id===session.user.id);const myResponse=guestMode?(guestResponseSubmitted?{status:'submitted'}:null):responses.find(r=>r.responder_profile_id===session.user.id&&r.status==='submitted');const incoming=mine?responses.filter(r=>r.status==='submitted').length:0;const historical=isHistorical();const participation=currentParticipation();const inviteReadOnly=isIdea()&&artifact.visibility==='circle'&&participation==='INVITED';
  const item=media[0];let mediaHtml='';if(item?.url)mediaHtml=item.media_type==='image'?`<div class="dc-artifact-media"><img src="${esc(item.url)}" alt="Прикреплённое изображение"></div>`:`<div class="dc-artifact-media"><a class="dc-artifact-file" href="${esc(item.url)}" target="_blank" rel="noopener">ФАЙЛ / ${esc(item.metadata?.name||'ОТКРЫТЬ')} ↗</a></div>`;
  stateEl.textContent=`ARTIFACT / ${artifact.status.toUpperCase()}`;
  const responseControl=historical?'<span class="dc-artifact-action" aria-disabled="true">ОТКЛИКИ ЗАКРЫТЫ / HISTORY</span>':mine?`<span class="dc-artifact-action" aria-disabled="true">ОТКЛИКОВ / ${incoming}</span>`:`<button class="dc-artifact-action${myResponse?' primary':''}" type="button" id="detailResponse" ${myResponse?'disabled':''}>${myResponse?'ОТКЛИК ОТПРАВЛЕН':'ОТКЛИКНУТЬСЯ'}</button>`;
  const interactionControls=inviteReadOnly?'<span class="dc-artifact-action" aria-disabled="true">INVITED / READ ONLY</span>':enrichmentState==='ready'
    ?`<span class="dc-artifact-action" aria-disabled="true">ИНТЕРЕСНО / ${reactionTotal()}</span><button class="dc-artifact-action${myReaction?' primary':''}" type="button" id="detailReaction">${myReaction?'✓ ИНТЕРЕСНО':'МНЕ ЭТО НАДО'}</button>${responseControl}${promotionControls()}`
    :`<span class="dc-artifact-action" aria-disabled="true">${enrichmentState==='pending'?'ДОГРУЖАЕМ ДЕЙСТВИЯ…':'ДЕЙСТВИЯ ВРЕМЕННО НЕДОСТУПНЫ'}</span>`;
  const activity=artifact.activity_at?`<div class="dc-artifact-meta"><span>КОГДА / ${esc(formatActivityDate(artifact.activity_at))}</span></div>`:'';const type=artifactSubtypeLabel(String(artifact.artifact_type||'announcement').toLowerCase());
  host.innerHTML=`<article class="dc-artifact-record${historical?' is-history':''}" data-artifact-status="${esc(artifact.status)}" data-artifact-subtype="${esc(String(artifact.artifact_type||''))}" data-artifact-visibility="${esc(artifact.visibility||'community')}" data-collab-my-state="${esc(participation)}"><div class="dc-artifact-meta"><span>ID / ${esc(artifact.id.slice(0,8).toUpperCase())}</span><span>TYPE / ${esc(type)}</span><span>STATUS / ${esc(artifact.status.toUpperCase())}</span><span>${artifact.expires_at?`EXPIRES / ${formatDate(artifact.expires_at)}`:'PERSISTENT'}</span></div>${activity}<div class="dc-artifact-author">${avatar(authorProfile)}<div><strong>${esc(authorProfile?.display_name||'MEMBER')}</strong>${authorProfile?.nickname?`<span>@${esc(authorProfile.nickname.replace(/^@/,''))}</span>`:''}</div></div>${artifact.title?`<h1>${esc(artifact.title)}</h1>`:'<h1>ARTIFACT.</h1>'}<div class="dc-artifact-body">${renderArtifactBody(artifact.body)}</div>${collaborationDetail()}${mediaHtml}${artifact.external_url?`<p><a class="dc-artifact-link" href="${esc(artifact.external_url)}" target="_blank" rel="noopener">ВНЕШНЯЯ ССЫЛКА ↗</a></p>`:''}<div class="dc-artifact-actions">${interactionControls}${mine&&artifact.status==='active'?'<button class="dc-artifact-action" type="button" id="detailClose">УБРАТЬ С ДОСКИ</button>':''}<a class="dc-artifact-action" href="${BOARD_PATH}" id="detailBack">← BOARD</a></div><div id="responseHost"></div></article>`;
  bindDetailActions();
}

async function supportPromotion(event){const button=event.currentTarget;button.disabled=true;const result=await client.rpc('dc_support_artifact_promotion_v1',{p_artifact_id:artifact.id});if(result.error){button.disabled=false;fail(result.error);return}await load()}
async function adminSuppress(){if(!confirm('Отключить Telegram distribution для этой публикации?'))return;const result=await client.rpc('dc_admin_suppress_artifact_telegram_v1',{p_artifact_id:artifact.id});if(result.error){fail(result.error);return}await load()}
async function adminHide(){if(!confirm('Скрыть Artifact с общей доски? Canonical data и история сохранятся.'))return;const result=await client.rpc('dc_admin_board_hide_artifact_v1',{p_artifact_id:artifact.id});if(result.error){fail(result.error);return}location.assign(BOARD_PATH)}
async function resolveUnknown(resolution){if(!promotion?.outbox_id)return;if(resolution==='retry'&&!confirm('Controlled retry может создать дубликат, если Telegram уже принял сообщение. Продолжить?'))return;if(resolution==='cancelled'&&!confirm('Отменить дальнейшую доставку?'))return;const externalRef=resolution==='sent'?(prompt('Telegram message id / external ref, если известен:','')||null):null;const result=await client.rpc('dc_admin_resolve_delivery_unknown_v1',{p_outbox_id:promotion.outbox_id,p_resolution:resolution,p_external_ref:externalRef});if(result.error){fail(result.error);return}await load()}

async function toggleReaction(event){
  const button=event.currentTarget;button.disabled=true;
  try{if(guestMode){const result=await client.rpc('dc_guest_board_interest_toggle_v1',{p_artifact_id:artifact.id});if(result.error)throw result.error;const payload=Array.isArray(result.data)?result.data[0]:result.data;guestInterest=payload?.active===true;guestInterestCount=Math.max(0,Number(payload?.count||0))}else{const active=reactions.some(r=>r.profile_id===session.user.id);if(active){const result=await client.from('dc_artifact_reactions').delete().eq('artifact_id',artifact.id).eq('profile_id',session.user.id).eq('reaction_type','interested');if(result.error)throw result.error}else{const result=await client.from('dc_artifact_reactions').insert({artifact_id:artifact.id,profile_id:session.user.id,reaction_type:'interested'});if(result.error)throw result.error}}await load()}catch(error){button.disabled=false;fail(error)}
}
function openResponse(){if(isHistorical())return;const responseHost=document.getElementById('responseHost');responseHost.innerHTML='<div class="dc-artifact-response"><textarea maxlength="2000" placeholder="Можно коротко написать автору, зачем вы откликаетесь."></textarea><div class="dc-artifact-actions"><button class="dc-artifact-action primary" type="button" id="sendResponse">ОТПРАВИТЬ</button><button class="dc-artifact-action" type="button" id="cancelResponse">ОТМЕНА</button></div></div>';document.getElementById('cancelResponse').onclick=()=>{responseHost.innerHTML=''};document.getElementById('sendResponse').onclick=sendResponse}
async function sendResponse(event){if(isHistorical())return;const button=event.currentTarget;const text=host.querySelector('.dc-artifact-response textarea')?.value.trim()||null;button.disabled=true;button.textContent='ОТПРАВЛЯЕМ…';const result=guestMode?await client.rpc('dc_guest_board_response_submit_v1',{p_artifact_id:artifact.id,p_message:text}):await client.from('dc_artifact_responses').insert({artifact_id:artifact.id,responder_profile_id:session.user.id,message:text,status:'submitted'});if(result.error){button.disabled=false;button.textContent='ОТПРАВИТЬ';fail(result.error);return}await load()}
async function closeArtifact(){if(!confirm('Убрать Artifact с активной доски и перенести в архив?'))return;const result=await client.rpc('dc_close_artifact_v1',{p_artifact_id:artifact.id});if(result.error){fail(result.error);return}location.assign(BOARD_PATH)}

async function boot(){
  bindBoardReturn();client=getClient();
  boardState=await withDeadline(resolveBoardUserState(client),ESSENTIAL_TIMEOUT_MS,'ARTIFACT_ACCESS_STATE_TIMEOUT');session=boardState.session||null;
  if(boardState.key===BOARD_USER_STATES.UNAUTHENTICATED){stateEl.textContent='AUTH REQUIRED';host.innerHTML='<div class="dc-artifact-service"><button class="dc-artifact-action primary" id="artifactLogin" type="button">ВОЙТИ ЧЕРЕЗ GOOGLE →</button></div>';document.getElementById('artifactLogin').onclick=()=>loginWithGoogle(location.pathname+location.search,client).catch(fail);return}
  guestMode=!isBoardMemberState(boardState.key);
  if(guestMode){await loadGuest();return}
  await loadMember();
}
boot().catch(fail);