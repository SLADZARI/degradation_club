import {getClient,currentSession,loginWithGoogle,getEntryStatus,DC_ARTIFACT_BUCKET,esc,formatDate,safeFileName,mediaType,signedMediaUrl,errorMessage,route} from '/community-runtime-v1.js';

const entryHost=document.getElementById('entryHost');
const boardHost=document.getElementById('boardHost');
const boardStatus=document.getElementById('boardStatus');
const memberBadge=document.getElementById('memberBadge');
const artifactCount=document.getElementById('artifactCount');
let client=null,session=null,entryStatus=null,ownDraft=null,ownDraftMedia=[];

const allowedTypes=new Set(['image/jpeg','image/png','image/webp']);
const maxFileSize=4*1024*1024;
const CLUB_RECORDS=[
  {meta:'PROJECT / ACTIVE',title:'ЛОГИКА И ОСОЗНАННОСТЬ',copy:'Самостоятельный проект внутри клубной экосистемы.',href:'/projects/logic-awareness/'},
  {meta:'OBJECT / CLUB ARTIFACT',title:'НЕ НАДО',copy:'Клубный объект 001. Зафиксирован на официальном сайте.',href:'/objects/001-ne-nado/'},
  {meta:'COURSE / VALENTIN',title:'ДУМАЙ С ОПАСНОСТЬЮ',copy:'Курс последовательной деградации уверенности.',href:'/courses/dumai-s-opasnostyu/'}
];

function boardError(error,target=entryHost){target.innerHTML=`<div class="dc-board-error">${esc(errorMessage(error))}</div>`}
function localDateInput(value){if(!value)return'';const d=new Date(value);if(Number.isNaN(d.getTime()))return'';const pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`}
function minLocalDateTime(){return localDateInput(new Date(Date.now()+60*1000).toISOString())}
function iso(value){return value?new Date(value).toISOString():null}
function avatar(profile){if(profile?.avatar_url)return `<img class="dc-notice__avatar" src="${esc(profile.avatar_url)}" alt="">`;const letter=String(profile?.display_name||'?').trim().charAt(0).toUpperCase()||'?';return `<span class="dc-notice__avatar dc-notice__avatar--empty">${esc(letter)}</span>`}
function normalizeExternalUrl(value){
  const raw=String(value||'').trim();if(!raw)return null;
  let candidate=raw;
  if(!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate))candidate=`https://${candidate}`;
  let parsed;try{parsed=new URL(candidate)}catch{return null}
  if(!['http:','https:'].includes(parsed.protocol)||!parsed.hostname)return null;
  const normalized=parsed.href;if(normalized.length>1000)return null;return normalized;
}
function clearComposerError(){
  const form=document.getElementById('artifactForm');if(!form)return;
  form.querySelector('.dc-composer-error')?.remove();
  form.querySelectorAll('[aria-invalid="true"]').forEach(el=>el.removeAttribute('aria-invalid'));
}
function showComposerError(message,fieldId=null){
  const form=document.getElementById('artifactForm');if(!form)return;
  clearComposerError();
  const error=document.createElement('div');error.className='dc-composer-error';error.setAttribute('role','alert');error.textContent=message;
  const actions=form.querySelector('.dc-composer-actions');form.insertBefore(error,actions||null);
  if(fieldId){const field=document.getElementById(fieldId);if(field){field.setAttribute('aria-invalid','true');field.focus()}}
}
function humanArtifactError(error){
  const message=String(error?.message||error||'');
  if(message.includes('dc_artifacts_external_url_check'))return 'Ссылка не прошла проверку. Используйте обычный http:// или https:// адрес.';
  if(/expired|expires|expiry/i.test(message))return 'Срок действия должен быть в будущем.';
  if(/slot/i.test(message))return 'Свободного места для нового объявления сейчас нет.';
  return 'Не удалось опубликовать объявление. Данные формы сохранены — проверьте поля и попробуйте ещё раз.';
}
function renderClubRecords(){
  return `<section class="dc-club-records" aria-label="Подтверждённые материалы клуба"><div class="dc-club-records__head"><span>CLUB RECORDS / SOURCE-BACKED</span><p>Не выдуманная активность, а уже существующие объекты и форматы клуба.</p></div><div class="dc-club-records__grid">${CLUB_RECORDS.map(record=>`<a class="dc-club-record" href="${route(record.href)}"><span>${esc(record.meta)}</span><strong>${esc(record.title)}</strong><p>${esc(record.copy)}</p><em>ОТКРЫТЬ →</em></a>`).join('')}</div></section>`;
}

async function loadOwnDraft(){
  const {data,error}=await client.from('dc_artifacts').select('id,title,body,external_url,status,starts_at,expires_at,created_at').eq('author_profile_id',session.user.id).eq('status','draft').order('created_at',{ascending:false}).limit(1).maybeSingle();
  if(error)throw error;ownDraft=data||null;ownDraftMedia=[];
  if(ownDraft){const media=await client.from('dc_artifact_media').select('id,media_type,storage_path,metadata').eq('artifact_id',ownDraft.id);if(media.error)throw media.error;ownDraftMedia=media.data||[]}
}

async function renderEntry(){
  await loadOwnDraft();
  if(ownDraft){renderComposer(ownDraft);return}
  const available=Number(entryStatus?.artifact_slots_available||0);
  if(available>0){
    const first=Number(entryStatus?.published_artifact_count||0)===0;
    entryHost.innerHTML=`<div class="dc-first-gate"><div class="dc-first-gate__label">${first?'FIRST ARTIFACT / REQUIRED':'ARTIFACT SLOT / AVAILABLE'}<br>${available} FREE</div><div><h2>${first?'ПРЕЖДЕ ЧЕМ ОСМАТРИВАТЬСЯ,<br>ОСТАВЬТЕ ЧТО-НИБУДЬ.':'НА ДОСКЕ<br>ЕСТЬ МЕСТО.'}</h2><p>${first?'Если бы вы были дементором — что бы вы предложили другим участникам? Встречу, мысль, практику, эксперимент или что-то, чему пока нет названия.':'Ваше текущее место свободно. Можно повесить новое объявление.'}</p><button class="dc-board-action primary" type="button" id="openComposer">ПРИКОЛОТЬ ОБЪЯВЛЕНИЕ →</button></div></div>`;
    document.getElementById('openComposer').onclick=()=>renderComposer(null);
    return;
  }
  const {data,error}=await client.from('dc_artifacts').select('id,title,body,published_at,expires_at').eq('author_profile_id',session.user.id).eq('status','active').order('published_at',{ascending:false}).limit(1).maybeSingle();
  if(error)throw error;
  entryHost.innerHTML=`<div class="dc-first-gate"><div class="dc-first-gate__label">ARTIFACT SLOT / OCCUPIED</div><div><h2>МЕСТО<br>ЗАНЯТО.</h2><p>${data?'Ваше объявление сейчас висит на общей доске. Чтобы использовать этот slot заново, уберите текущее объявление в архив. Дополнительные slots позже смогут появляться за участие в жизни клуба.':'Свободного Artifact slot сейчас нет.'}</p>${data?`<div class="dc-composer-actions"><a class="dc-board-action primary" href="${route(`/community/artifact/${data.id}/`)}">ОТКРЫТЬ МОЁ ОБЪЯВЛЕНИЕ →</a><button class="dc-board-action" type="button" data-entry-close="${data.id}">УБРАТЬ С ДОСКИ</button></div>`:''}</div></div>`;
  entryHost.querySelector('[data-entry-close]')?.addEventListener('click',event=>closeArtifact(event.currentTarget.dataset.entryClose));
}

function renderComposer(draft){
  const media=ownDraftMedia[0]||null;
  entryHost.innerHTML=`<div class="dc-composer"><div class="dc-composer-head"><span>ARTIFACT / NOTICE<br>${draft?'DRAFT / SAVED':'SLOT / READY'}</span><div><h2>ЕСЛИ БЫ ВЫ БЫЛИ ДЕМЕНТОРОМ —<br>ЧТО БЫ ВЫ ПРЕДЛОЖИЛИ ДРУГИМ?</h2><button class="dc-inline-help" type="button" id="openDementorExplainer">ЧТО ЭТО ЗНАЧИТ? →</button></div></div><form class="dc-composer-form" id="artifactForm" novalidate>
    <div class="dc-composer-field"><label for="artifactTitle">Заголовок</label><input id="artifactTitle" name="title" maxlength="160" value="${esc(draft?.title||'')}" placeholder="Можно без него"><small>Опционально. Не превращайте это в рекламный слоган.</small></div>
    <div class="dc-composer-field"><label for="artifactBody">Объявление *</label><textarea id="artifactBody" name="body" maxlength="4000" required placeholder="Что именно вы предлагаете?">${esc(draft?.body||'')}</textarea><small>Текст обязателен. Пока это Artifact, а не автоматически событие, курс или проект.</small></div>
    <div class="dc-composer-field"><label for="artifactUrl">Ссылка</label><input id="artifactUrl" name="external_url" maxlength="1000" inputmode="url" value="${esc(draft?.external_url||'')}" placeholder="https://…"><small>Опциональная внешняя ссылка. Если вставить адрес без протокола, попробуем безопасно добавить https://.</small></div>
    <div class="dc-composer-field"><label for="artifactExpires">Срок действия</label><input id="artifactExpires" name="expires_at" type="datetime-local" min="${esc(minLocalDateTime())}" value="${esc(localDateInput(draft?.expires_at))}"><small>Оставьте пустым для постоянного объявления. Прошедшую дату опубликовать нельзя.</small></div>
    <div class="dc-composer-field"><label for="artifactFile">Изображение</label><div><input id="artifactFile" name="media" type="file" accept="image/jpeg,image/png,image/webp" ${media?'disabled':''}>${media?`<div class="dc-board-state">УЖЕ ПРИКРЕПЛЕНО: ${esc(media.metadata?.name||media.storage_path.split('/').pop())}</div>`:''}</div><small>Один файл, максимум 4 MB. JPG / PNG / WebP. Изображение хранится в закрытом Community bucket и не отправляется в Telegram напрямую.</small></div>
    <div class="dc-composer-actions"><button class="dc-board-action primary" type="submit">ОПУБЛИКОВАТЬ →</button>${draft?'<button class="dc-board-action" type="button" id="removeDraft">УДАЛИТЬ ЧЕРНОВИК</button>':'<button class="dc-board-action" type="button" id="cancelComposer">НЕ СЕЙЧАС</button>'}<span class="dc-board-state" id="composerState" hidden></span></div>
  </form><dialog class="dc-explainer" id="dementorExplainer"><button class="dc-explainer__close" type="button" id="closeDementorExplainer" aria-label="Закрыть">×</button><span>CONTEXT / DEMENTOR</span><h3>ЭТО НЕ ПРИСВОЕНИЕ РОЛИ.</h3><p>Представьте, что у вас есть право предложить клубу одну вещь без долгой защиты идеи. Встречу. Практику. Эксперимент. Полезную провокацию. То, вокруг чего другим может захотеться собраться.</p><p><strong>Member ≠ Dementor.</strong> Ответ на этот вопрос не делает вас Дементором.</p><a href="${route('/community/')}" class="dc-board-action">О COMMUNITY →</a></dialog></div>`;
  document.getElementById('artifactForm').addEventListener('submit',publishFromForm);
  document.getElementById('cancelComposer')?.addEventListener('click',()=>renderEntry().catch(error=>boardError(error)));
  document.getElementById('removeDraft')?.addEventListener('click',()=>removeDraft());
  const dialog=document.getElementById('dementorExplainer');
  document.getElementById('openDementorExplainer')?.addEventListener('click',()=>dialog?.showModal());
  document.getElementById('closeDementorExplainer')?.addEventListener('click',()=>dialog?.close());
  dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
}

async function publishFromForm(event){
  event.preventDefault();const form=event.currentTarget;const submit=form.querySelector('button[type=submit]');const state=document.getElementById('composerState');const fd=new FormData(form);clearComposerError();
  const body=String(fd.get('body')||'').trim();const title=String(fd.get('title')||'').trim()||null;const externalRaw=String(fd.get('external_url')||'').trim();const expiresRaw=String(fd.get('expires_at')||'').trim();const file=form.querySelector('#artifactFile')?.files?.[0]||null;
  if(!body){showComposerError('Введите текст объявления.','artifactBody');return}
  let externalUrl=null;
  if(externalRaw){externalUrl=normalizeExternalUrl(externalRaw);if(!externalUrl){showComposerError('Проверьте ссылку. Нужен обычный веб-адрес — например https://example.com.','artifactUrl');return}document.getElementById('artifactUrl').value=externalUrl}
  let expiresAt=null;
  if(expiresRaw){const expiresDate=new Date(expiresRaw);if(Number.isNaN(expiresDate.getTime())||expiresDate.getTime()<=Date.now()){showComposerError('Срок действия должен быть в будущем.','artifactExpires');return}expiresAt=expiresDate.toISOString()}
  if(file&&(!allowedTypes.has(file.type)||file.size>maxFileSize)){showComposerError(file.size>maxFileSize?'Изображение больше 4 MB.':'Поддерживаются только JPG, PNG и WebP.','artifactFile');return}
  submit.disabled=true;submit.textContent='ГОТОВИМ…';state.hidden=false;state.textContent='СОХРАНЯЕМ ЧЕРНОВИК';let artifactId=ownDraft?.id||null;let uploadedPath=null;
  try{
    if(artifactId){
      const updated=await client.rpc('dc_update_artifact_draft_v1',{p_artifact_id:artifactId,p_body:body,p_title:title,p_external_url:externalUrl,p_starts_at:null,p_expires_at:expiresAt});if(updated.error)throw updated.error;
      ownDraft={...ownDraft,title,body,external_url:externalUrl,expires_at:expiresAt};
    }else{
      const created=await client.rpc('dc_create_artifact_draft_v1',{p_body:body,p_title:title,p_external_url:externalUrl,p_starts_at:null,p_expires_at:expiresAt});if(created.error)throw created.error;artifactId=created.data;
      ownDraft={id:artifactId,title,body,external_url:externalUrl,expires_at:expiresAt,status:'draft'};
    }
    if(file&&!ownDraftMedia.length){
      state.textContent='ЗАГРУЖАЕМ ИЗОБРАЖЕНИЕ';const path=`${session.user.id}/${artifactId}/${Date.now()}-${safeFileName(file.name)}`;const uploaded=await client.storage.from(DC_ARTIFACT_BUCKET).upload(path,file,{upsert:false,contentType:file.type});if(uploaded.error)throw uploaded.error;uploadedPath=path;
      const metadata={name:file.name,size:file.size,mime:file.type};const attached=await client.rpc('dc_attach_artifact_media_v1',{p_artifact_id:artifactId,p_storage_path:path,p_media_type:'image',p_metadata:metadata});if(attached.error){await client.storage.from(DC_ARTIFACT_BUCKET).remove([path]).catch(()=>{});throw attached.error}ownDraftMedia=[{storage_path:path,media_type:'image',metadata}];uploadedPath=null;
    }
    state.textContent='ПРИКАЛЫВАЕМ К ДОСКЕ';const published=await client.rpc('dc_publish_artifact_v1',{p_artifact_id:artifactId});if(published.error)throw published.error;
    client.rpc('dc_enqueue_artifact_distribution_v1',{p_artifact_id:artifactId,p_channel:'telegram'}).then(({error})=>{if(error)console.warn('[DC Board] distribution enqueue skipped',error.message)}).catch(()=>{});
    ownDraft=null;ownDraftMedia=[];await refreshAll();
  }catch(error){
    submit.disabled=false;submit.textContent='ОПУБЛИКОВАТЬ →';state.textContent='НЕ ОПУБЛИКОВАНО';
    if(uploadedPath){await client.storage.from(DC_ARTIFACT_BUCKET).remove([uploadedPath]).catch(()=>{});uploadedPath=null}
    console.warn('[DC Board] publication failed',error);showComposerError(humanArtifactError(error));
  }
}

async function removeDraft(){
  if(!ownDraft)return;
  const button=document.getElementById('removeDraft');if(button){button.disabled=true;button.textContent='УДАЛЯЕМ…'}
  try{
    if(ownDraftMedia.length){const paths=ownDraftMedia.map(item=>item.storage_path);const removed=await client.storage.from(DC_ARTIFACT_BUCKET).remove(paths);if(removed.error)throw removed.error}
    const closed=await client.rpc('dc_close_artifact_v1',{p_artifact_id:ownDraft.id});if(closed.error)throw closed.error;ownDraft=null;ownDraftMedia=[];await refreshAll();
  }catch(error){if(button){button.disabled=false;button.textContent='УДАЛИТЬ ЧЕРНОВИК'}showComposerError('Не удалось удалить черновик. Попробуйте ещё раз.')}
}

async function closeArtifact(id){
  if(!id||!confirm('Убрать объявление с активной доски и перенести в архив?'))return;
  const {error}=await client.rpc('dc_close_artifact_v1',{p_artifact_id:id});if(error){boardError(error);return}await refreshAll();
}

async function loadBoard(){
  const artifactsResult=await client.from('dc_artifacts').select('id,author_profile_id,title,body,external_url,status,starts_at,expires_at,published_at,created_at').eq('visibility','community').eq('status','active').order('published_at',{ascending:false});
  if(artifactsResult.error)throw artifactsResult.error;
  const now=Date.now();const artifacts=(artifactsResult.data||[]).filter(a=>!a.expires_at||Date.parse(a.expires_at)>now);artifactCount.textContent=String(artifacts.length).padStart(2,'0');
  if(!artifacts.length){boardHost.innerHTML=`${renderClubRecords()}<div class="dc-board-empty"><h3>ЖИВЫХ ОБЪЯВЛЕНИЙ<br>ПОКА НЕТ.</h3><p>Подтверждённые клубные объекты уже выше. Первый живой Member Artifact может появиться прямо сейчас.</p></div>`;return}
  const ids=artifacts.map(a=>a.id);const authors=[...new Set(artifacts.map(a=>a.author_profile_id))];
  const [profilesResult,reactionsResult,mediaResult,responsesResult]=await Promise.all([
    client.from('dc_member_public_profiles').select('profile_id,display_name,nickname,avatar_url,member_since').in('profile_id',authors),
    client.from('dc_artifact_reactions').select('id,artifact_id,profile_id,reaction_type').in('artifact_id',ids),
    client.from('dc_artifact_media').select('id,artifact_id,media_type,storage_path,metadata').in('artifact_id',ids),
    client.from('dc_artifact_responses').select('id,artifact_id,responder_profile_id,message,status,created_at').in('artifact_id',ids)
  ]);
  for(const result of [profilesResult,reactionsResult,mediaResult,responsesResult])if(result.error)throw result.error;
  const profiles=new Map((profilesResult.data||[]).map(p=>[p.profile_id,p]));const reactions=reactionsResult.data||[];const media=mediaResult.data||[];const responses=responsesResult.data||[];
  const mediaUrls=new Map();await Promise.all(media.map(async item=>{try{mediaUrls.set(item.id,await signedMediaUrl(client,item.storage_path))}catch{mediaUrls.set(item.id,null)}}));
  boardHost.innerHTML=renderClubRecords()+artifacts.map((artifact,index)=>renderNotice(artifact,index,profiles.get(artifact.author_profile_id),reactions.filter(r=>r.artifact_id===artifact.id),media.filter(m=>m.artifact_id===artifact.id).map(m=>({...m,signedUrl:mediaUrls.get(m.id)})),responses.filter(r=>r.artifact_id===artifact.id))).join('');
  installNoticeActions();
}

function renderNotice(artifact,index,profile,reactions,media,responses){
  const mine=artifact.author_profile_id===session.user.id;const myReaction=reactions.some(r=>r.profile_id===session.user.id);const myResponse=responses.find(r=>r.responder_profile_id===session.user.id&&r.status==='submitted');const incoming=mine?responses.filter(r=>r.status==='submitted').length:0;const item=media[0];let mediaHtml='';
  if(item?.signedUrl){mediaHtml=item.media_type==='image'?`<div class="dc-notice__media"><img src="${esc(item.signedUrl)}" alt="Прикреплённое изображение"></div>`:''}
  return `<article class="dc-notice" data-artifact="${artifact.id}"><div class="dc-notice__meta"><span>ARTIFACT / ${String(index+1).padStart(3,'0')}</span><span>${formatDate(artifact.published_at)}</span></div><div class="dc-notice__author">${avatar(profile)}<div><strong>${esc(profile?.display_name||'MEMBER')}</strong>${profile?.nickname?`<div>@${esc(profile.nickname.replace(/^@/,''))}</div>`:''}</div></div>${artifact.title?`<h3>${esc(artifact.title)}</h3>`:''}<p class="dc-notice__body">${esc(artifact.body)}</p>${mediaHtml}${artifact.external_url?`<p><a class="dc-notice__link" href="${esc(artifact.external_url)}" target="_blank" rel="noopener noreferrer">ССЫЛКА ↗</a></p>`:''}<div class="dc-notice__expiry">${artifact.expires_at?`ДЕЙСТВУЕТ ДО ${formatDate(artifact.expires_at)}`:'БЕЗ СРОКА'} · COMMUNITY</div><div class="dc-notice__actions"><span class="dc-notice__activity">ИНТЕРЕСНО: ${reactions.length}${mine?` · ОТКЛИКОВ: ${incoming}`:''}</span><button class="dc-board-action small${myReaction?' primary':''}" type="button" data-reaction="${artifact.id}" data-active="${myReaction?'1':'0'}">${myReaction?'✓ ИНТЕРЕСНО':'МНЕ ЭТО НАДО'}</button>${mine?`<button class="dc-board-action small" type="button" data-close-artifact="${artifact.id}">УБРАТЬ</button>`:`<button class="dc-board-action small${myResponse?' primary':''}" type="button" data-response="${artifact.id}" ${myResponse?'disabled':''}>${myResponse?'ОТКЛИК ОТПРАВЛЕН':'ОТКЛИКНУТЬСЯ'}</button>`}<a class="dc-board-action small" href="${route(`/community/artifact/${artifact.id}/`)}">ОТКРЫТЬ</a></div></article>`;
}

function installNoticeActions(){
  boardHost.querySelectorAll('[data-reaction]').forEach(button=>button.addEventListener('click',()=>toggleReaction(button)));
  boardHost.querySelectorAll('[data-response]').forEach(button=>button.addEventListener('click',()=>openResponse(button)));
  boardHost.querySelectorAll('[data-close-artifact]').forEach(button=>button.addEventListener('click',()=>closeArtifact(button.dataset.closeArtifact)));
}

async function toggleReaction(button){
  const id=button.dataset.reaction;button.disabled=true;
  try{
    if(button.dataset.active==='1'){const result=await client.from('dc_artifact_reactions').delete().eq('artifact_id',id).eq('profile_id',session.user.id).eq('reaction_type','interested');if(result.error)throw result.error}
    else{const result=await client.from('dc_artifact_reactions').insert({artifact_id:id,profile_id:session.user.id,reaction_type:'interested'});if(result.error)throw result.error}
    await loadBoard();
  }catch(error){button.disabled=false;boardError(error,boardHost)}
}

function openResponse(button){
  const notice=button.closest('.dc-notice');if(!notice||notice.querySelector('.dc-response-box'))return;const id=button.dataset.response;
  const box=document.createElement('div');box.className='dc-response-box';box.innerHTML='<textarea maxlength="2000" placeholder="Можно оставить короткое сообщение. Можно просто откликнуться."></textarea><div class="dc-response-box__actions"><button class="dc-board-action small primary" type="button" data-send>ОТПРАВИТЬ</button><button class="dc-board-action small" type="button" data-cancel>ОТМЕНА</button></div>';
  notice.appendChild(box);box.querySelector('[data-cancel]').onclick=()=>box.remove();box.querySelector('[data-send]').onclick=()=>sendResponse(id,box);
}

async function sendResponse(artifactId,box){
  const button=box.querySelector('[data-send]');const message=box.querySelector('textarea').value.trim()||null;button.disabled=true;button.textContent='ОТПРАВЛЯЕМ…';
  const result=await client.from('dc_artifact_responses').insert({artifact_id:artifactId,responder_profile_id:session.user.id,message,status:'submitted'});
  if(result.error){button.disabled=false;button.textContent='ОТПРАВИТЬ';boardError(result.error,box);return}await loadBoard();
}

async function refreshAll(){entryStatus=await getEntryStatus(client);boardStatus.textContent=`MEMBER / ACTIVE · SLOTS ${entryStatus.artifact_slots_available??0}`;await Promise.all([renderEntry(),loadBoard()])}

async function boot(){
  client=getClient();session=await currentSession(client);
  if(!session){
    boardStatus.textContent='AUTH REQUIRED';memberBadge.textContent='НЕ АВТОРИЗОВАН';entryHost.innerHTML='<div class="dc-first-gate"><div class="dc-first-gate__label">AUTH / REQUIRED</div><div><h2>ДОСКА<br>ЗАКРЫТА.</h2><p>Это внутренняя поверхность Community. Войдите аккаунтом участника.</p><button class="dc-board-action primary" id="boardLogin" type="button">ВОЙТИ ЧЕРЕЗ GOOGLE →</button></div></div>';boardHost.innerHTML='<div class="dc-board-state">СОДЕРЖИМОЕ ДОСКИ ДОСТУПНО ТОЛЬКО УЧАСТНИКАМ.</div>';document.getElementById('boardLogin').onclick=()=>loginWithGoogle('/community/board/',client).catch(error=>boardError(error));return;
  }
  entryStatus=await getEntryStatus(client);
  if(!entryStatus.membership_active){
    boardStatus.textContent='MEMBERSHIP REQUIRED';memberBadge.textContent=session.user.email||'ACCOUNT';entryHost.innerHTML=`<div class="dc-first-gate"><div class="dc-first-gate__label">MEMBERSHIP / REQUIRED</div><div><h2>АККАУНТ<br>ЕЩЁ НЕ КЛУБ.</h2><p>Завершите DC-9 и оформите участие.</p><a class="dc-board-action primary" href="${route('/join/member/')}">ПРОЙТИ GATE →</a></div></div>`;boardHost.innerHTML='<div class="dc-board-state">ACCESS DENIED / COMMUNITY MEMBERS ONLY</div>';return;
  }
  const own=await client.from('dc_member_public_profiles').select('display_name,nickname,avatar_url').eq('profile_id',session.user.id).maybeSingle();
  memberBadge.textContent=own.data?.display_name?`${own.data.display_name}${own.data.nickname?` / @${own.data.nickname.replace(/^@/,'')}`:''}`:(session.user.user_metadata?.full_name||session.user.email||'MEMBER');
  await refreshAll();
}

boot().catch(error=>{boardStatus.textContent='ERROR';boardError(error);boardError(error,boardHost)});