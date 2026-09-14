import {getClient} from '/community-runtime-v1.js';

const client=getClient();
const entryHost=document.getElementById('entryHost');
let armed=false;
const promotedArtifacts=new Set();

const PUBLISHED_EVENT='dc:board:artifact-published';
const WARNING='BOARD ОПУБЛИКОВАН · TELEGRAM НЕ ПОСТАВЛЕН В ОЧЕРЕДЬ';

function isOwnerAdmin(){
  return String(document.documentElement.dataset.dcBoardUserState||'')==='OWNER_ADMIN';
}
function cancelPending(){armed=false}
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
  if(!form||form.querySelector('[data-admin-telegram-optin]'))return;
  const actions=form.querySelector('.dc-composer-actions');
  if(!actions)return;
  actions.insertAdjacentHTML('beforebegin',optInMarkup());
}
async function promoteAfterBoardSuccess(artifactId){
  if(!artifactId||promotedArtifacts.has(artifactId))return;
  promotedArtifacts.add(artifactId);
  try{
    const result=await client.rpc('dc_admin_promote_artifact_telegram_v1',{p_artifact_id:artifactId});
    if(result.error)throw result.error;
  }catch(error){
    console.warn('[DC Board] Telegram promotion failed after successful Board publish',error);
    showWarning();
  }
}
function onSubmitCapture(event){
  const form=event.target?.closest?.('#artifactForm');
  if(!form)return;
  armed=isOwnerAdmin()&&form.querySelector('[data-admin-telegram-optin-input]')?.checked===true;
}
function onCanonicalPublished(event){
  if(!armed||!isOwnerAdmin())return;
  armed=false;
  const artifactId=String(event?.detail?.artifactId||'').trim();
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(artifactId))return;
  void promoteAfterBoardSuccess(artifactId);
}

entryHost?.addEventListener('submit',onSubmitCapture,true);
entryHost?.addEventListener('click',event=>{
  if(event.target?.closest?.('#cancelComposer,#removeDraft'))cancelPending();
},true);
window.addEventListener(PUBLISHED_EVENT,onCanonicalPublished);
const observer=new MutationObserver(bindComposer);
if(entryHost)observer.observe(entryHost,{childList:true,subtree:true});
bindComposer();
