import {getClient,currentSession,getEntryStatus} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const entryHost=document.getElementById('entryHost');
const client=getClient();
let activationState=null;
let refreshTimer=null;
const FOCUS_DISMISSED_KEY='dc_first_artifact_spotlight_dismissed_v1';

function focusDismissed(){try{return sessionStorage.getItem(FOCUS_DISMISSED_KEY)==='1'}catch{return false}}
function focusHost(){return document.querySelector('.dc-spatial-viewport')||entryHost}
function removeFocusSkip(){document.querySelectorAll('.dc-first-focus-skip').forEach(node=>node.remove())}
function dismissFocus(){try{sessionStorage.setItem(FOCUS_DISMISSED_KEY,'1')}catch{}document.body.classList.remove('dc-board-first-entry-focus');removeFocusSkip();window.dispatchEvent(new CustomEvent('dc:first-artifact-focus-dismissed'))}
function syncFirstEntryFocus(){
  const focused=activationState==='FIRST_ARTIFACT_REQUIRED'&&!focusDismissed();
  document.body.classList.toggle('dc-board-first-entry-focus',focused);
  if(!focused){removeFocusSkip();return}
  const host=focusHost();if(!host)return;
  if(host.querySelector('.dc-first-focus-skip'))return;
  removeFocusSkip();
  const skip=document.createElement('button');
  skip.type='button';
  skip.className='dc-first-focus-skip';
  skip.textContent='Пропустить сейчас';
  skip.setAttribute('aria-label','Скрыть подсказку до следующего входа');
  skip.style.position='absolute';
  skip.style.right='14px';
  skip.style.bottom='58px';
  skip.style.zIndex='32';
  skip.style.pointerEvents='auto';
  skip.addEventListener('click',dismissFocus);
  host.appendChild(skip);
}

function syncControls(){
  // FIRST_ARTIFACT_REQUIRED is presentation/onboarding only.
  // It must never remove reaction/response rights from an admitted Member.
  boardHost?.querySelectorAll('[data-reaction],[data-response]').forEach(button=>{
    delete button.dataset.activationLocked;
    button.removeAttribute('aria-disabled');
    button.removeAttribute('title');
    button.classList.remove('dc-board-action--activation-locked');
  });
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
    console.warn('[DC Board activation focus]',error);
  }
}

function scheduleRefresh(){
  clearTimeout(refreshTimer);
  refreshTimer=setTimeout(()=>refreshActivation(),180);
}

if(boardHost){
  const observer=new MutationObserver(()=>{syncControls();scheduleRefresh()});
  observer.observe(boardHost,{childList:true,subtree:false});
}
if(entryHost){
  const observer=new MutationObserver(()=>{syncFirstEntryFocus();scheduleRefresh()});
  observer.observe(entryHost,{childList:true,subtree:true});
}

window.addEventListener('dc:board-spatial-ready',syncFirstEntryFocus);
refreshActivation();
