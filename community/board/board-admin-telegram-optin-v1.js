import {getClient,currentSession} from '/community-runtime-v1.js';

const client=getClient();
const entryHost=document.getElementById('entryHost');
let currentForm=null;
let generation=0;
let armed=null;
const promotedArtifacts=new Set();

const WARNING='BOARD ОПУБЛИКОВАН · TELEGRAM НЕ ПОСТАВЛЕН В ОЧЕРЕДЬ';

function isOwnerAdmin(){
  return String(document.documentElement.dataset.dcBoardUserState||'')==='OWNER_ADMIN';
}
function normalize(value){return String(value||'').trim()}
function cancelPending(){generation+=1;armed=null}
function optInMarkup(){
  return `<div class="dc-composer-field dc-admin-telegram-optin" data-admin-telegram-optin>
    <label class="dc-admin-telegram-optin__toggle" for="dcAdminTelegramOptIn">
      <input id="dcAdminTelegramOptIn" type="checkbox" data-admin-telegram-optin-input>
      <span>ОТПРАВИТЬ В TELEGRAM ПОСЛЕ ПУБЛИКАЦИИ</span>
    </label>
    <small>По умолчанию выключено. Публикация на Board не зависит от Telegram.</small>
  </div>`;
}
function showWarning(){
  let notice=document.querySelector('[data-admin-telegram-warning]');
  if(!notice){
    notice=document.createElement('div');
    notice.className='dc-board-toast';
    notice.dataset.adminTelegramWarning='1';
    notice.setAttribute('role','status');
    notice.setAttribute('aria-live','polite');
    document.body.appendChild(notice);
  }
  notice.textContent=WARNING;
  notice.classList.add('is-visible');
  window.clearTimeout(Number(notice.dataset.hideTimer||0));
  const timer=window.setTimeout(()=>notice.classList.remove('is-visible'),9000);
  notice.dataset.hideTimer=String(timer);
}
function bindComposer(){
  if(!entryHost||!isOwnerAdmin())return;
  const form=entryHost.querySelector('#artifactForm');
  if(!form){currentForm=null;return}
  currentForm=form;
  if(form.querySelector('[data-admin-telegram-optin]'))return;
  const actions=form.querySelector('.dc-composer-actions');
  if(!actions)return;
  actions.insertAdjacentHTML('beforebegin',optInMarkup());
}
async function findPublishedArtifact(snapshot){
  const session=await currentSession(client);
  const userId=session?.user?.id;
  if(!userId)return null;
  const result=await client.from('dc_artifacts')
    .select('id,title,body,status,published_at')
    .eq('author_profile_id',userId)
    .eq('status','active')
    .order('published_at',{ascending:false})
    .limit(8);
  if(result.error)throw result.error;
  const threshold=snapshot.submittedAt-2000;
  return (result.data||[]).find(row=>{
    const publishedAt=Date.parse(row.published_at||'');
    return Number.isFinite(publishedAt)
      && publishedAt>=threshold
      && normalize(row.title)===snapshot.title
      && normalize(row.body)===snapshot.body;
  })||null;
}
async function continueAfterCanonicalPublish(snapshot){
  if(!snapshot||snapshot.generation!==generation||!snapshot.optIn||!isOwnerAdmin())return;
  let artifact=null;
  try{artifact=await findPublishedArtifact(snapshot)}catch(error){console.warn('[DC Board] Telegram opt-in could not confirm published Artifact',error);return}
  if(snapshot.generation!==generation||!artifact||promotedArtifacts.has(artifact.id))return;
  promotedArtifacts.add(artifact.id);
  try{
    const result=await client.rpc('dc_admin_promote_artifact_telegram_v1',{p_artifact_id:artifact.id});
    if(result.error)throw result.error;
  }catch(error){
    console.warn('[DC Board] Telegram promotion failed after successful Board publish',error);
    showWarning();
  }
}
function onSubmitCapture(event){
  const form=event.target?.closest?.('#artifactForm');
  if(!form)return;
  generation+=1;
  armed=null;
  if(!isOwnerAdmin())return;
  const checkbox=form.querySelector('[data-admin-telegram-optin-input]');
  if(checkbox?.checked!==true)return;
  armed={
    form,
    generation,
    optIn:true,
    submittedAt:Date.now(),
    title:normalize(form.querySelector('#artifactTitle')?.value),
    body:normalize(form.querySelector('#artifactBody')?.value)
  };
}
function onEntryMutation(){
  const previous=currentForm;
  bindComposer();
  if(previous&&!previous.isConnected&&armed?.form===previous){
    const snapshot=armed;
    armed=null;
    void continueAfterCanonicalPublish(snapshot);
  }
}

entryHost?.addEventListener('submit',onSubmitCapture,true);
entryHost?.addEventListener('click',event=>{
  if(event.target?.closest?.('#cancelComposer,#removeDraft'))cancelPending();
},true);
const observer=new MutationObserver(onEntryMutation);
if(entryHost)observer.observe(entryHost,{childList:true,subtree:true});
bindComposer();
