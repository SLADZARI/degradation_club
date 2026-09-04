import {getClient,currentSession,getEntryStatus,errorMessage} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const entryHost=document.getElementById('entryHost');
const client=getClient();
let activationState=null;
let refreshTimer=null;
const FOCUS_DISMISSED_KEY='dc_first_artifact_spotlight_dismissed_v1';

const LOCAL_ERRORS={
  FIRST_ARTIFACT_REQUIRED:'На доске нет зрителей. Чтобы откликнуться на чужое, сначала оставьте своё объявление.'
};

function showGateMessage(message='FIRST_ARTIFACT_REQUIRED'){
  const raw=String(message?.message||message||'UNKNOWN_ERROR');
  const key=Object.keys(LOCAL_ERRORS).find(item=>raw.includes(item));
  const text=key?LOCAL_ERRORS[key]:errorMessage(message);
  boardHost?.querySelector('.dc-board-error--activation')?.remove();
  const box=document.createElement('div');
  box.className='dc-board-error dc-board-error--activation';
  box.setAttribute('role','status');
  box.textContent=text;
  boardHost?.prepend(box);
  setTimeout(()=>box.remove(),6000);
}

function isActivated(){return activationState==='MEMBER_ACTIVATED'}
function focusDismissed(){try{return sessionStorage.getItem(FOCUS_DISMISSED_KEY)==='1'}catch{return false}}
function dismissFocus(){try{sessionStorage.setItem(FOCUS_DISMISSED_KEY,'1')}catch{}document.body.classList.remove('dc-board-first-entry-focus');entryHost?.querySelector('.dc-first-focus-skip')?.remove()}
function syncFirstEntryFocus(){
  const focused=activationState==='FIRST_ARTIFACT_REQUIRED'&&!focusDismissed();
  document.body.classList.toggle('dc-board-first-entry-focus',focused);
  if(!entryHost)return;
  if(!focused){entryHost.querySelector('.dc-first-focus-skip')?.remove();return}
  if(entryHost.querySelector('.dc-first-focus-skip'))return;
  const skip=document.createElement('button');
  skip.type='button';
  skip.className='dc-first-focus-skip';
  skip.textContent='Пропустить сейчас';
  skip.setAttribute('aria-label','Скрыть подсказку до следующего входа');
  skip.addEventListener('click',dismissFocus);
  entryHost.appendChild(skip);
}

function syncControls(){
  if(boardHost){
    const locked=activationState==='FIRST_ARTIFACT_REQUIRED';
    boardHost.querySelectorAll('[data-reaction],[data-response]').forEach(button=>{
      button.dataset.activationLocked=locked?'1':'0';
      if(locked){
        button.setAttribute('aria-disabled','true');
        button.title='Сначала займите своё место: опубликуйте первый Artifact.';
        button.classList.add('dc-board-action--activation-locked');
      }else{
        button.removeAttribute('aria-disabled');
        button.removeAttribute('title');
        button.classList.remove('dc-board-action--activation-locked');
      }
    });
  }
  syncFirstEntryFocus();
}

async function refreshActivation(){
  const session=await currentSession(client);
  if(!session){activationState=null;syncControls();return}
  try{
    const status=await getEntryStatus(client);
    activationState=status.community_activation_state||null;
    syncControls();
  }catch(error){
    console.warn('[DC Board activation gate]',error);
  }
}

function scheduleRefresh(){
  clearTimeout(refreshTimer);
  refreshTimer=setTimeout(()=>refreshActivation(),180);
}

document.addEventListener('click',event=>{
  if(isActivated())return;
  const action=event.target.closest?.('[data-reaction],[data-response]');
  if(!action||activationState!=='FIRST_ARTIFACT_REQUIRED')return;
  event.preventDefault();
  event.stopImmediatePropagation();
  showGateMessage();
  entryHost?.scrollIntoView({behavior:'smooth',block:'start'});
},true);

if(boardHost){
  const observer=new MutationObserver(()=>{syncControls();scheduleRefresh()});
  observer.observe(boardHost,{childList:true,subtree:false});
}
if(entryHost){
  const observer=new MutationObserver(()=>{syncFirstEntryFocus();scheduleRefresh()});
  observer.observe(entryHost,{childList:true,subtree:true});
}

refreshActivation();
