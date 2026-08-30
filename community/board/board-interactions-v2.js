import {getClient,getEntryStatus,currentSession,errorMessage,DC_ARTIFACT_BUCKET,safeFileName} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const entryHost=document.getElementById('entryHost');
const client=getClient();
let activationState=null;

const LOCAL_ERRORS={
  FIRST_ARTIFACT_REQUIRED:'На доске нет зрителей. Чтобы откликнуться на чужое, сначала оставьте своё объявление.',
  RESPONSE_ALREADY_SUBMITTED:'Вы уже откликнулись на это объявление.',
  ARTIFACT_NOT_AVAILABLE:'Это объявление уже недоступно для взаимодействия.',
  MEDIA_SIZE_INVALID:'Изображение должно быть не больше 4 MiB.',
  MEDIA_MIME_INVALID:'Поддерживаются только JPG, PNG и WebP.'
};

function showInlineError(message,target=boardHost){
  const raw=String(message?.message||message||'UNKNOWN_ERROR');
  const localKey=Object.keys(LOCAL_ERRORS).find(key=>raw.includes(key));
  const text=localKey?LOCAL_ERRORS[localKey]:errorMessage(message);
  const old=target?.querySelector?.('.dc-board-error--inline');old?.remove();
  const box=document.createElement('div');
  box.className='dc-board-error dc-board-error--inline';box.textContent=text;
  target?.prepend(box);setTimeout(()=>box.remove(),6000);
}

async function refreshActivation(){
  try{const status=await getEntryStatus(client);activationState=status.community_activation_state||null;syncLockedControls();return status}
  catch(error){console.error('[DC Board interactions]',error);return null}
}
function isActivated(){return activationState==='MEMBER_ACTIVATED'}
function syncLockedControls(){
  if(!boardHost)return;const locked=!isActivated();
  boardHost.querySelectorAll('[data-reaction],[data-response]').forEach(button=>{
    button.dataset.activationLocked=locked?'1':'0';
    if(locked){button.setAttribute('aria-disabled','true');button.title='На доске нет зрителей. Чтобы откликнуться на чужое, сначала оставьте своё.';button.classList.add('dc-board-action--locked')}
    else{button.removeAttribute('aria-disabled');button.removeAttribute('title');button.classList.remove('dc-board-action--locked')}
  });
}

async function toggleReaction(button){
  if(!isActivated()){showInlineError('FIRST_ARTIFACT_REQUIRED');entryHost?.scrollIntoView({behavior:'smooth',block:'start'});return}
  button.disabled=true;
  try{const {error}=await client.rpc('dc_toggle_artifact_reaction_v2',{p_artifact_id:button.dataset.reaction});if(error)throw error;location.reload()}
  catch(error){button.disabled=false;showInlineError(error)}
}
function openResponse(button){
  if(!isActivated()){showInlineError('FIRST_ARTIFACT_REQUIRED');entryHost?.scrollIntoView({behavior:'smooth',block:'start'});return}
  const notice=button.closest('.dc-notice');if(!notice||notice.querySelector('.dc-response-box'))return;
  const box=document.createElement('div');box.className='dc-response-box';
  box.innerHTML='<textarea maxlength="2000" placeholder="Можно оставить короткое сообщение. Можно просто откликнуться."></textarea><div class="dc-response-box__actions"><button class="dc-board-action small primary" type="button" data-v2-send>ОТПРАВИТЬ</button><button class="dc-board-action small" type="button" data-v2-cancel>ОТМЕНА</button></div>';
  notice.appendChild(box);box.querySelector('[data-v2-cancel]').onclick=()=>box.remove();box.querySelector('[data-v2-send]').onclick=()=>submitResponse(button.dataset.response,box);
}
async function submitResponse(artifactId,box){
  const send=box.querySelector('[data-v2-send]');const message=box.querySelector('textarea')?.value.trim()||null;send.disabled=true;send.textContent='ОТПРАВЛЯЕМ…';
  try{const {error}=await client.rpc('dc_submit_artifact_response_v2',{p_artifact_id:artifactId,p_message:message});if(error)throw error;location.reload()}
  catch(error){send.disabled=false;send.textContent='ОТПРАВИТЬ';showInlineError(error,box)}
}

function validateComposerFile(form,event){
  const input=form.querySelector('#artifactFile');if(!input)return true;input.accept='image/jpeg,image/png,image/webp';
  const file=input.files?.[0]||null;if(!file)return true;
  const allowed=new Set(['image/jpeg','image/png','image/webp']);
  if(!allowed.has(file.type)||file.size>4*1024*1024){event?.preventDefault();event?.stopImmediatePropagation();showInlineError(file.size>4*1024*1024?'Файл больше 4 MiB.':'Поддерживаются только JPG, PNG и WebP.',form);return false}
  return true;
}
function toIso(value){return value?new Date(value).toISOString():null}

async function suggestPlacement(){
  const center={x:2500,y:1750};
  const {data,error}=await client.from('dc_artifact_board_positions').select('x,y').eq('board_id','community').limit(80);
  if(error||!data?.length)return center;
  const minDistance=360;
  for(let i=0;i<80;i++){
    const angle=i*2.399963229728653;
    const radius=260+Math.sqrt(i)*220;
    const candidate={x:center.x+Math.cos(angle)*radius,y:center.y+Math.sin(angle)*radius};
    if(data.every(p=>Math.hypot(p.x-candidate.x,p.y-candidate.y)>minDistance))return candidate;
  }
  return {x:center.x+900,y:center.y+700};
}

async function publishComposerV2(form){
  const submit=form.querySelector('button[type=submit]');const state=document.getElementById('composerState');
  const fd=new FormData(form);const body=String(fd.get('body')||'').trim();const title=String(fd.get('title')||'').trim()||null;
  const externalUrl=String(fd.get('external_url')||'').trim()||null;const expiresAt=toIso(String(fd.get('expires_at')||''));const file=form.querySelector('#artifactFile')?.files?.[0]||null;
  if(!body){showInlineError('Введите текст объявления.',form);return}
  if(!validateComposerFile(form))return;
  submit.disabled=true;submit.textContent='ГОТОВИМ…';if(state){state.hidden=false;state.textContent='СОХРАНЯЕМ ЧЕРНОВИК'}
  let uploadedPath=null;
  try{
    const session=await currentSession(client);if(!session)throw new Error('AUTH_REQUIRED');
    const draftResult=await client.from('dc_artifacts').select('id').eq('author_profile_id',session.user.id).eq('status','draft').order('created_at',{ascending:false}).limit(1).maybeSingle();if(draftResult.error)throw draftResult.error;
    let artifactId=draftResult.data?.id||null;
    if(artifactId){const updated=await client.rpc('dc_update_artifact_draft_v1',{p_artifact_id:artifactId,p_body:body,p_title:title,p_external_url:externalUrl,p_starts_at:null,p_expires_at:expiresAt});if(updated.error)throw updated.error}
    else{const created=await client.rpc('dc_create_artifact_draft_v1',{p_body:body,p_title:title,p_external_url:externalUrl,p_starts_at:null,p_expires_at:expiresAt});if(created.error)throw created.error;artifactId=created.data}

    const attached=await client.from('dc_artifact_media').select('id').eq('artifact_id',artifactId).limit(1);if(attached.error)throw attached.error;
    if(file&&!attached.data?.length){
      if(state)state.textContent='ЗАГРУЖАЕМ ИЗОБРАЖЕНИЕ';
      const path=`${session.user.id}/${artifactId}/${Date.now()}-${safeFileName(file.name)}`;
      const uploaded=await client.storage.from(DC_ARTIFACT_BUCKET).upload(path,file,{upsert:false,contentType:file.type});if(uploaded.error)throw uploaded.error;uploadedPath=path;
      const linked=await client.rpc('dc_attach_artifact_media_v1',{p_artifact_id:artifactId,p_storage_path:path,p_media_type:'image',p_metadata:{name:file.name,size:file.size,mime:file.type}});if(linked.error)throw linked.error;
    }

    if(state)state.textContent='ЗАНИМАЕМ МЕСТО НА ДОСКЕ';
    const pos=await suggestPlacement();
    const published=await client.rpc('dc_publish_artifact_to_board_v2',{p_artifact_id:artifactId,p_x:pos.x,p_y:pos.y,p_rotation:(Math.random()-.5)*1.2,p_size_class:file?'L':'S'});if(published.error)throw published.error;
    location.reload();
  }catch(error){
    if(uploadedPath){try{await client.storage.from(DC_ARTIFACT_BUCKET).remove([uploadedPath])}catch{}}
    submit.disabled=false;submit.textContent='ОПУБЛИКОВАТЬ →';if(state)state.textContent='НЕ ОПУБЛИКОВАНО';showInlineError(error,form);
  }
}

// Capture before legacy board.js listeners so writes go through the v2 server contract.
document.addEventListener('click',event=>{
  const reaction=event.target.closest?.('[data-reaction]');if(reaction){event.preventDefault();event.stopImmediatePropagation();toggleReaction(reaction);return}
  const response=event.target.closest?.('[data-response]');if(response){event.preventDefault();event.stopImmediatePropagation();openResponse(response)}
},true);
document.addEventListener('submit',event=>{
  const form=event.target;if(form?.id!=='artifactForm')return;
  event.preventDefault();event.stopImmediatePropagation();publishComposerV2(form);
},true);

const observer=new MutationObserver(()=>{
  const input=document.getElementById('artifactFile');if(input){input.accept='image/jpeg,image/png,image/webp';const small=input.closest('.dc-composer-field')?.querySelector('small');if(small)small.textContent='Один файл, максимум 4 MiB. JPG / PNG / WebP. Изображение хранится в закрытом Community bucket.'}
  syncLockedControls();
});
observer.observe(document.body,{subtree:true,childList:true});
refreshActivation();
