import {getClient} from '/community-runtime-v1.js';

const client=getClient();
const CLUB_SCOPE='club';
const PROFILE_SCOPE='profile';
const CLUB_NAME='DEMENTOR CLUB';
const CLUB_MARK='/assets/brand/dementor-mark-black.svg';
const entryHost=document.getElementById('entryHost');
const boardHost=document.getElementById('boardHost');
let choiceBusy=false;
let boardRefreshQueued=false;
let boardRefreshRunning=false;
let boardRefreshRerun=false;
const scopeCache=new Map();

function isOwnerAdmin(){return String(document.documentElement.dataset.dcBoardUserState||'')==='OWNER_ADMIN'}

function publisherField(scope=PROFILE_SCOPE){
  const profileChecked=scope!==CLUB_SCOPE?'checked':'';
  const clubChecked=scope===CLUB_SCOPE?'checked':'';
  return `<fieldset class="dc-publisher-choice" data-club-publisher-choice>
    <legend>ПУБЛИКОВАТЬ КАК</legend>
    <label><input type="radio" name="dc_publisher_scope" value="profile" ${profileChecked}> <span>Я</span></label>
    <label><input type="radio" name="dc_publisher_scope" value="club" ${clubChecked}> <span>DEMENTOR CLUB</span></label>
    <small>Публичная подпись меняется, но реальный автор сохраняется для аудита.</small>
    <span class="dc-publisher-choice__state" data-club-publisher-state hidden></span>
  </fieldset>`;
}

async function readOwnerScope(){
  const result=await client.rpc('dc_owner_board_publisher_state_v1');
  if(result.error)throw result.error;
  const payload=Array.isArray(result.data)?result.data[0]:result.data;
  return payload?.publisher_scope===CLUB_SCOPE?CLUB_SCOPE:PROFILE_SCOPE;
}

async function setOwnerScope(scope,root){
  if(choiceBusy)return false;
  choiceBusy=true;
  const form=root?.closest('form');
  const submit=form?.querySelector('button[type="submit"]');
  const state=root?.querySelector('[data-club-publisher-state]');
  const inputs=[...(root?.querySelectorAll('input[name="dc_publisher_scope"]')||[])];
  inputs.forEach(input=>input.disabled=true);
  if(submit)submit.disabled=true;
  if(state){state.hidden=false;state.textContent='СОХРАНЯЕМ…'}
  let saved=false;
  try{
    const result=await client.rpc('dc_owner_board_publisher_choice_v1',{p_scope:scope});
    if(result.error)throw result.error;
    saved=true;
    if(state){state.textContent=scope===CLUB_SCOPE?'ПУБЛИКАЦИЯ ОТ DEMENTOR CLUB':'ПУБЛИКАЦИЯ ОТ ВАШЕГО ПРОФИЛЯ'}
  }catch(error){
    console.warn('[DC Board] publisher choice failed',error);
    if(state)state.textContent='НЕ СОХРАНЕНО';
    const previous=scope===CLUB_SCOPE?PROFILE_SCOPE:CLUB_SCOPE;
    const fallback=root?.querySelector(`input[name="dc_publisher_scope"][value="${previous}"]`);
    if(fallback)fallback.checked=true;
  }finally{
    inputs.forEach(input=>input.disabled=false);
    if(submit)submit.disabled=false;
    choiceBusy=false;
  }
  return saved;
}

async function bindComposer(){
  if(!isOwnerAdmin()||!entryHost)return;
  const form=entryHost.querySelector('#artifactForm');
  if(!form||form.dataset.clubPublisherBound==='1')return;
  form.dataset.clubPublisherBound='1';
  let scope=PROFILE_SCOPE;
  try{scope=await readOwnerScope()}catch(error){console.warn('[DC Board] publisher state unavailable',error)}
  if(!form.isConnected)return;
  const typeField=form.querySelector('#artifactType')?.closest('.dc-composer-field');
  if(!typeField)return;
  typeField.insertAdjacentHTML('beforebegin',publisherField(scope));
  const root=form.querySelector('[data-club-publisher-choice]');
  root?.addEventListener('change',event=>{
    const input=event.target.closest?.('input[name="dc_publisher_scope"]');
    if(!input)return;
    setOwnerScope(input.value===CLUB_SCOPE?CLUB_SCOPE:PROFILE_SCOPE,root);
  });
  form.addEventListener('submit',event=>{
    if(!choiceBusy)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const state=root?.querySelector('[data-club-publisher-state]');
    if(state){state.hidden=false;state.textContent='ДОЖДИТЕСЬ СОХРАНЕНИЯ ИЗДАТЕЛЯ'}
  },true);
}

function clubifyAuthor(card){
  if(card.dataset.publisherScope===CLUB_SCOPE)return false;
  const author=card.querySelector('.dc-notice__author');
  if(!author)return false;
  author.innerHTML=`<img class="dc-notice__avatar dc-notice__avatar--club" src="${CLUB_MARK}" alt=""><div><strong>${CLUB_NAME}</strong><div>CLUB / PUBLICATION</div></div>`;
  card.dataset.publisherScope=CLUB_SCOPE;
  return true;
}

async function refreshBoardPublishers(){
  if(!boardHost)return;
  if(boardRefreshRunning){boardRefreshRerun=true;return}
  boardRefreshRunning=true;
  try{
    const cards=[...boardHost.querySelectorAll('[data-artifact]')];
    const ids=[...new Set(cards.map(card=>card.dataset.artifact).filter(id=>/^[0-9a-f-]{36}$/i.test(id)))];
    const unknown=ids.filter(id=>!scopeCache.has(id));
    if(unknown.length){
      const result=await client.rpc('dc_artifact_publisher_scopes_v1',{p_artifact_ids:unknown});
      if(result.error){console.warn('[DC Board] publisher projection unavailable',result.error);return}
      unknown.forEach(id=>scopeCache.set(id,PROFILE_SCOPE));
      for(const row of result.data||[])scopeCache.set(row.artifact_id,row.publisher_scope===CLUB_SCOPE?CLUB_SCOPE:PROFILE_SCOPE);
    }
    for(const card of cards){if(scopeCache.get(card.dataset.artifact)===CLUB_SCOPE)clubifyAuthor(card)}
  }finally{
    boardRefreshRunning=false;
    if(boardRefreshRerun){boardRefreshRerun=false;queueBoardRefresh()}
  }
}

function queueBoardRefresh(){
  if(boardRefreshQueued)return;
  boardRefreshQueued=true;
  requestAnimationFrame(()=>{
    boardRefreshQueued=false;
    refreshBoardPublishers().catch(error=>console.warn('[DC Board] publisher render failed',error));
  });
}

const observer=new MutationObserver(()=>{bindComposer();queueBoardRefresh()});
if(entryHost)observer.observe(entryHost,{childList:true,subtree:true});
if(boardHost)observer.observe(boardHost,{childList:true,subtree:true});
entryHost?.addEventListener('click',event=>{
  if(!isOwnerAdmin()||!event.target.closest?.('#cancelComposer'))return;
  client.rpc('dc_owner_board_publisher_choice_v1',{p_scope:PROFILE_SCOPE}).catch(()=>{});
},true);
window.addEventListener('dc:board-spatial-ready',queueBoardRefresh);
window.addEventListener('dc:board-guest-read-ready',queueBoardRefresh);
bindComposer();
queueBoardRefresh();
