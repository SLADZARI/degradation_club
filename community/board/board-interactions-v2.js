import {getClient,getEntryStatus,errorMessage} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const entryHost=document.getElementById('entryHost');
const client=getClient();
let activationState=null;

function showInlineError(message,target=boardHost){
  const text=errorMessage(message);
  const box=document.createElement('div');
  box.className='dc-board-error dc-board-error--inline';
  box.textContent=text;
  target?.prepend(box);
  setTimeout(()=>box.remove(),6000);
}

async function refreshActivation(){
  try{
    const status=await getEntryStatus(client);
    activationState=status.community_activation_state||null;
    syncLockedControls();
    return status;
  }catch(error){
    console.error('[DC Board interactions]',error);
    return null;
  }
}

function isActivated(){return activationState==='MEMBER_ACTIVATED'}

function syncLockedControls(){
  if(!boardHost)return;
  const locked=!isActivated();
  boardHost.querySelectorAll('[data-reaction],[data-response]').forEach(button=>{
    button.dataset.activationLocked=locked?'1':'0';
    if(locked){
      button.setAttribute('aria-disabled','true');
      button.title='На доске нет зрителей. Чтобы откликнуться на чужое, сначала оставьте своё.';
      button.classList.add('dc-board-action--locked');
    }else{
      button.removeAttribute('aria-disabled');
      button.removeAttribute('title');
      button.classList.remove('dc-board-action--locked');
    }
  });
}

async function toggleReaction(button){
  if(!isActivated()){
    showInlineError('FIRST_ARTIFACT_REQUIRED');
    entryHost?.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  button.disabled=true;
  try{
    const {error}=await client.rpc('dc_toggle_artifact_reaction_v2',{p_artifact_id:button.dataset.reaction});
    if(error)throw error;
    location.reload();
  }catch(error){
    button.disabled=false;
    showInlineError(error);
  }
}

function openResponse(button){
  if(!isActivated()){
    showInlineError('FIRST_ARTIFACT_REQUIRED');
    entryHost?.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  const notice=button.closest('.dc-notice');
  if(!notice||notice.querySelector('.dc-response-box'))return;
  const box=document.createElement('div');
  box.className='dc-response-box';
  box.innerHTML='<textarea maxlength="2000" placeholder="Можно оставить короткое сообщение. Можно просто откликнуться."></textarea><div class="dc-response-box__actions"><button class="dc-board-action small primary" type="button" data-v2-send>ОТПРАВИТЬ</button><button class="dc-board-action small" type="button" data-v2-cancel>ОТМЕНА</button></div>';
  notice.appendChild(box);
  box.querySelector('[data-v2-cancel]').onclick=()=>box.remove();
  box.querySelector('[data-v2-send]').onclick=()=>submitResponse(button.dataset.response,box);
}

async function submitResponse(artifactId,box){
  const send=box.querySelector('[data-v2-send]');
  const message=box.querySelector('textarea')?.value.trim()||null;
  send.disabled=true;
  send.textContent='ОТПРАВЛЯЕМ…';
  try{
    const {error}=await client.rpc('dc_submit_artifact_response_v2',{p_artifact_id:artifactId,p_message:message});
    if(error)throw error;
    location.reload();
  }catch(error){
    send.disabled=false;
    send.textContent='ОТПРАВИТЬ';
    showInlineError(error,box);
  }
}

function validateComposerFile(form,event){
  const input=form.querySelector('#artifactFile');
  if(input){
    input.accept='image/jpeg,image/png,image/webp';
    const file=input.files?.[0]||null;
    if(file){
      const allowed=new Set(['image/jpeg','image/png','image/webp']);
      if(!allowed.has(file.type)||file.size>4*1024*1024){
        event.preventDefault();
        event.stopImmediatePropagation();
        showInlineError(file.size>4*1024*1024?'Файл больше 4 MiB.':'Поддерживаются только JPG, PNG и WebP.',form);
        return false;
      }
    }
  }
  return true;
}

// Capture before legacy board.js listeners. This lets the integration branch use
// server-authoritative v2 RPCs without rewriting the stable v1 Board in one step.
document.addEventListener('click',event=>{
  const reaction=event.target.closest?.('[data-reaction]');
  if(reaction){
    event.preventDefault();event.stopImmediatePropagation();
    toggleReaction(reaction);
    return;
  }
  const response=event.target.closest?.('[data-response]');
  if(response){
    event.preventDefault();event.stopImmediatePropagation();
    openResponse(response);
  }
},true);

document.addEventListener('submit',event=>{
  const form=event.target;
  if(form?.id==='artifactForm')validateComposerFile(form,event);
},true);

const observer=new MutationObserver(()=>{
  const input=document.getElementById('artifactFile');
  if(input)input.accept='image/jpeg,image/png,image/webp';
  syncLockedControls();
});
observer.observe(document.body,{subtree:true,childList:true});

refreshActivation();
