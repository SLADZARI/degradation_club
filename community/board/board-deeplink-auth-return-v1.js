import {getClient,currentSession,loginWithGoogle,route} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const FOCUS_RE=/^(artifact|entity):([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
let session=null;
let resolving=false;
let popHandling=false;
let missingTimer=null;
let postcard=null;
let activeShareTrigger=null;
let sharedArrivalMode=null;
let sharedArrivalStarted=false;
let artifactFrameObserver=null;

function parseFocus(){
  const raw=new URL(location.href).searchParams.get('focus')||'';
  const match=raw.match(FOCUS_RE);
  return match?{type:match[1].toLowerCase(),id:match[2].toLowerCase()}:null;
}
function isSharedArtifactArrival(){
  const url=new URL(location.href);const focus=parseFocus();
  return focus?.type==='artifact'&&url.searchParams.get('from')==='share';
}
function productionShareOrigin(){
  const configured=String(window.DEMENTOR_SITE_CONFIG?.canonicalOrigin||'').replace(/\/$/,'');
  return /^(?:www\.)?dementor\.club$/i.test(location.hostname)&&configured?configured:location.origin;
}
function boardUrlFor(type,id){
  const url=new URL(location.href);
  url.pathname=route('/workspace/board/');
  url.searchParams.set('focus',`${type}:${id}`);
  return url;
}
function externalShareUrlFor(type,id){
  const origin=productionShareOrigin();
  if(type==='artifact'){
    const url=new URL(route('/share/artifact/'),origin);
    url.search='';url.searchParams.set('id',String(id).toLowerCase());
    return url;
  }
  const url=new URL(route('/workspace/board/'),origin);
  url.search='';url.searchParams.set('focus',`${type}:${String(id).toLowerCase()}`);
  return url;
}
function baseBoardUrl(){const url=new URL(location.href);url.pathname=route('/workspace/board/');url.searchParams.delete('focus');url.searchParams.delete('from');return url}
function sameFocus(type,id){const focus=parseFocus();return focus?.type===type&&focus.id===String(id).toLowerCase()}
function setFocus(type,id,{replace=false,pushed=false}={}){
  const url=boardUrlFor(type,String(id).toLowerCase());
  const state={...(history.state||{}),dcBoardFocus:true,dcBoardFocusPushed:pushed};
  history[replace?'replaceState':'pushState'](state,'',url);
  queueMicrotask(refreshArtifactDetailShare);
}
function clearFocus({replace=false}={}){
  const url=baseBoardUrl();
  history[replace?'replaceState':'pushState']({...history.state,dcBoardFocus:false,dcBoardFocusPushed:false},'',url);
}
function consumeSharePresentation(){
  const url=new URL(location.href);if(url.searchParams.get('from')!=='share')return;
  url.searchParams.delete('from');
  history.replaceState({...history.state,dcBoardSharedArrival:true},'',url);
}
function consumeBoardNavigationFocus(){
  if(sharedArrivalMode)return;
  if(!parseFocus())return;
  clearTimeout(missingTimer);missingTimer=null;
  clearFocus({replace:true});
}
function targetNode(focus){
  if(!focus||!boardHost)return null;
  const nodes=focus.type==='artifact'?[...boardHost.querySelectorAll('.dc-notice[data-artifact]')]:[...boardHost.querySelectorAll('.dc-projection[data-source-id]')];
  return nodes.find(node=>String(focus.type==='artifact'?node.dataset.artifact:node.dataset.sourceId).toLowerCase()===focus.id)||null;
}
function revealPresentationOnly(node){
  if(!node)return;
  if(node.classList.contains('dc-board-filtered')||node.hidden){node.hidden=false;node.classList.remove('dc-board-filtered');node.setAttribute('aria-hidden','false');window.dispatchEvent(new CustomEvent('dc:board-layout-request'))}
}
function hideMissing(){document.querySelector('.dc-board-focus-missing')?.remove()}
function showMissing(){
  closePostcard({restoreFocus:false});
  if(document.querySelector('.dc-board-focus-missing'))return;
  const gate=document.createElement('section');gate.className='dc-board-focus-missing';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');
  gate.innerHTML='<article class="dc-board-focus-missing__card"><h2>ЭТОГО ЗДЕСЬ БОЛЬШЕ НЕТ.</h2><p>Возможно, всё закончилось хорошо.</p><p>Возможно, наоборот.</p><button class="dc-board-focus-missing__action" type="button">ОТКРЫТЬ BOARD</button></article>';
  gate.querySelector('button').onclick=()=>{sharedArrivalMode=null;sharedArrivalStarted=false;clearFocus({replace:true});gate.remove();window.dispatchEvent(new CustomEvent('dc:board-close-artifact'))};document.body.appendChild(gate);
}
function openResolvedFocus(node,focus){
  hideMissing();revealPresentationOnly(node);
  window.dispatchEvent(new CustomEvent('dc:board-focus-target',{detail:{node,open:focus.type==='artifact',focus,source:'url'}}));
  setTimeout(refreshArtifactDetailShare,0);
}
function resolveCurrentFocus({allowMissing=false}={}){
  const focus=parseFocus();if(!focus){hideMissing();return false}
  const node=targetNode(focus);if(!node){if(allowMissing)showMissing();return false}
  if(sharedArrivalMode==='receiver'){
    if(sharedArrivalStarted)return true;
    sharedArrivalStarted=true;
    hideMissing();revealPresentationOnly(node);showReceiveArrivalPostcard(node,focus);
    return true;
  }
  openResolvedFocus(node,focus);return true;
}
function scheduleResolve(){
  if(resolving)return;resolving=true;
  requestAnimationFrame(()=>{resolving=false;if(resolveCurrentFocus())return;clearTimeout(missingTimer);missingTimer=setTimeout(()=>resolveCurrentFocus({allowMissing:true}),4200)});
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text);return true}catch{}
  const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch{}ta.remove();return ok;
}
function focusablePostcardControls(){
  if(!postcard)return[];
  return [...postcard.querySelectorAll('button:not([hidden]):not([disabled]),input:not([hidden]):not([disabled]),a[href],textarea,select,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.closest('[hidden]'));
}
function closePostcard({restoreFocus=true}={}){
  if(!postcard||postcard.hidden)return;
  postcard.hidden=true;postcard.setAttribute('aria-hidden','true');postcard.dataset.closable='0';
  if(restoreFocus&&activeShareTrigger?.isConnected)activeShareTrigger.focus();
  activeShareTrigger=null;
}
function stayOnBoardFromSharedArrival(){
  clearTimeout(missingTimer);missingTimer=null;
  sharedArrivalMode=null;sharedArrivalStarted=false;
  clearFocus({replace:true});
  closePostcard({restoreFocus:false});
  window.dispatchEvent(new CustomEvent('dc:board-close-artifact'));
}
function requestPostcardClose(){
  const mode=postcard?.querySelector('.dc-board-share-postcard')?.dataset.mode||'';
  if(mode==='receiver-arrival'){stayOnBoardFromSharedArrival();return}
  closePostcard();
}
function ensurePostcard(){
  if(postcard)return postcard;
  postcard=document.createElement('section');postcard.className='dc-board-share-postcard-layer';postcard.hidden=true;postcard.setAttribute('aria-hidden','true');
  postcard.innerHTML=`<article class="dc-board-share-postcard" role="dialog" aria-modal="true" aria-labelledby="dcBoardPostcardTitle" aria-describedby="dcBoardPostcardCopy">
    <button class="dc-board-share-postcard__close" type="button" data-postcard-close aria-label="Закрыть">×</button>
    <div class="dc-board-share-postcard__stamp"><span data-postcard-stamp>К ПЕРЕДАЧЕ</span></div>
    <div class="dc-board-share-postcard__brand" aria-label="Dementor Club"><span>DEMENTOR</span><strong>CLUB</strong></div>
    <div class="dc-board-share-postcard__meta"><span data-postcard-meta-left>OUTBOUND / ARTIFACT</span><span data-postcard-meta-right>STATUS / READY</span></div>
    <h2 class="dc-board-share-postcard__title" id="dcBoardPostcardTitle" data-postcard-title>ПЕРЕДАТЬ АРТЕФАКТ</h2>
    <p class="dc-board-share-postcard__copy" id="dcBoardPostcardCopy" data-postcard-copy>Ссылка ведёт прямо сюда.</p>
    <div class="dc-board-share-postcard__sender" data-postcard-sender hidden>
      <img data-postcard-sender-avatar alt="" hidden>
      <span class="dc-board-share-postcard__sender-fallback" data-postcard-sender-fallback aria-hidden="true">D</span>
      <div><small>ОТПРАВИТЕЛЬ</small><strong data-postcard-sender-name>УЧАСТНИК</strong></div>
    </div>
    <div class="dc-board-share-postcard__link" data-postcard-sender>
      <input type="text" readonly data-postcard-url aria-label="Ссылка на артефакт">
      <span aria-hidden="true">↗</span>
    </div>
    <div class="dc-board-share-postcard__actions" data-postcard-sender>
      <button class="dc-board-share-postcard__action is-primary" type="button" data-postcard-native>ОТПРАВИТЬ…</button>
      <button class="dc-board-share-postcard__action is-acid" type="button" data-postcard-copy-link>КОПИРОВАТЬ ССЫЛКУ</button>
    </div>
    <div class="dc-board-share-postcard__receive" data-postcard-receiver hidden>
      <button class="dc-board-share-postcard__action is-acid" type="button" data-postcard-login hidden>ВОЙТИ И ПОСМОТРЕТЬ →</button>
      <button class="dc-board-share-postcard__action is-acid" type="button" data-postcard-accept hidden>ПОСМОТРЕТЬ АРТЕФАКТ →</button>
      <button class="dc-board-share-postcard__action" type="button" data-postcard-stay hidden>ОСТАТЬСЯ НА ДОСКЕ</button>
    </div>
    <div class="dc-board-share-postcard__legal" data-postcard-legal>ARTIFACT / DIRECT LINK / EXTERNAL TRANSFER</div>
  </article>`;
  document.body.appendChild(postcard);
  postcard.querySelector('[data-postcard-close]').addEventListener('click',requestPostcardClose);
  postcard.addEventListener('click',event=>{if(event.target===postcard&&postcard.dataset.closable==='1')requestPostcardClose()});
  postcard.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&postcard.dataset.closable==='1'){event.preventDefault();requestPostcardClose();return}
    if(event.key!=='Tab')return;
    const controls=focusablePostcardControls();if(!controls.length)return;
    const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  return postcard;
}
function senderIdentity(){
  const profile=document.querySelector('[data-shell-session] .dcw-session-profile');
  const shellAvatar=profile?.querySelector('img.dcw-session-avatar');
  const meta=session?.user?.user_metadata||{};
  const name=String(profile?.querySelector('strong')?.textContent||meta.full_name||meta.name||session?.user?.email||'УЧАСТНИК').trim();
  const avatar=String(shellAvatar?.currentSrc||shellAvatar?.src||meta.avatar_url||meta.picture||'').trim();
  return {name:name||'УЧАСТНИК',avatar};
}
function renderSenderIdentity(){
  const layer=ensurePostcard();const identity=senderIdentity();
  const name=layer.querySelector('[data-postcard-sender-name]');const img=layer.querySelector('[data-postcard-sender-avatar]');const fallback=layer.querySelector('[data-postcard-sender-fallback]');
  if(name)name.textContent=identity.name;
  if(identity.avatar){img.src=identity.avatar;img.hidden=false;fallback.hidden=true}else{img.removeAttribute('src');img.hidden=true;fallback.hidden=false;fallback.textContent=(identity.name.match(/[\p{L}\p{N}]/u)?.[0]||'D').toUpperCase()}
}
function setPostcardMode({mode,title,copy,stamp,metaLeft,metaRight,legal,closable=false,url=null,login=false,accept=false,stay=false}={}){
  const layer=ensurePostcard();const card=layer.querySelector('.dc-board-share-postcard');
  card.dataset.mode=mode||'';layer.dataset.closable=closable?'1':'0';
  layer.querySelector('[data-postcard-title]').textContent=title||'';
  layer.querySelector('[data-postcard-copy]').textContent=copy||'';
  layer.querySelector('[data-postcard-stamp]').textContent=stamp||'';
  layer.querySelector('[data-postcard-meta-left]').textContent=metaLeft||'';
  layer.querySelector('[data-postcard-meta-right]').textContent=metaRight||'';
  layer.querySelector('[data-postcard-legal]').textContent=legal||'';
  layer.querySelector('[data-postcard-close]').hidden=!closable;
  layer.querySelectorAll('[data-postcard-sender]').forEach(el=>el.hidden=mode!=='sender');
  const receiver=layer.querySelector('[data-postcard-receiver]');receiver.hidden=mode==='sender';
  const loginButton=layer.querySelector('[data-postcard-login]');loginButton.hidden=!login;
  const acceptButton=layer.querySelector('[data-postcard-accept]');acceptButton.hidden=!accept;
  const stayButton=layer.querySelector('[data-postcard-stay]');stayButton.hidden=!stay;
  const input=layer.querySelector('[data-postcard-url]');if(input&&url!==null)input.value=url;
  layer.hidden=false;layer.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=>{const target=mode==='sender'?layer.querySelector('[data-postcard-native]'):login?loginButton:accept?acceptButton:card;target?.focus?.()});
  return layer;
}
function setSenderStatus({stamp,meta,copyLabel}={}){
  const layer=ensurePostcard();if(stamp)layer.querySelector('[data-postcard-stamp]').textContent=stamp;if(meta)layer.querySelector('[data-postcard-meta-right]').textContent=meta;if(copyLabel)layer.querySelector('[data-postcard-copy-link]').textContent=copyLabel;
}
async function runSenderCopy(url){
  const ok=await copyText(url);
  setSenderStatus(ok?{stamp:'СКОПИРОВАНО',meta:'STATUS / COPIED',copyLabel:'ССЫЛКА СКОПИРОВАНА ✓'}:{stamp:'ОШИБКА',meta:'STATUS / COPY FAILED',copyLabel:'НЕ УДАЛОСЬ СКОПИРОВАТЬ'});
  return ok;
}
function openSenderPostcard(id,trigger){
  activeShareTrigger=trigger;
  const url=externalShareUrlFor('artifact',id).href;
  const layer=setPostcardMode({mode:'sender',title:'ПЕРЕДАТЬ АРТЕФАКТ',copy:'Ссылка ведёт прямо сюда.',stamp:'К ПЕРЕДАЧЕ',metaLeft:'OUTBOUND / ARTIFACT',metaRight:'STATUS / READY',legal:'ARTIFACT / DIRECT LINK / EXTERNAL TRANSFER',closable:true,url});
  renderSenderIdentity();
  const copyButton=layer.querySelector('[data-postcard-copy-link]');copyButton.textContent='КОПИРОВАТЬ ССЫЛКУ';
  copyButton.onclick=()=>runSenderCopy(url);
  layer.querySelector('[data-postcard-native]').onclick=async()=>{
    if(typeof navigator.share!=='function'){await runSenderCopy(url);return}
    try{
      await navigator.share({title:'Вам передали артефакт — Dementor Club',text:'Открыть внутри DEMENTOR CLUB',url});
      setSenderStatus({stamp:'ПЕРЕДАНО',meta:'STATUS / SENT'});
    }catch(error){if(error?.name!=='AbortError')setSenderStatus({stamp:'ОШИБКА',meta:'STATUS / SHARE FAILED'})}
  };
}
function showReceiveAuthPostcard(){
  const layer=setPostcardMode({mode:'receiver-auth',title:'ВАМ ПЕРЕДАЛИ АРТЕФАКТ',copy:'Чтобы посмотреть содержимое, войдите.',stamp:'ТРЕБУЕТ ВХОДА',metaLeft:'INCOMING / ARTIFACT',metaRight:'STATUS / SEALED',legal:'ВХОД ≠ ЧЛЕНСТВО',closable:false,login:true});
  layer.querySelector('[data-postcard-login]').onclick=()=>loginWithGoogle(`${location.pathname}${location.search}${location.hash}`,getClient());
}
function showReceiveArrivalPostcard(node,focus){
  const layer=setPostcardMode({mode:'receiver-arrival',title:'ВАМ ПЕРЕДАЛИ АРТЕФАКТ',copy:'Передача готова. Посмотреть артефакт или остаться на доске.',stamp:'ПОЛУЧЕНО',metaLeft:'INCOMING / ARTIFACT',metaRight:'STATUS / RECEIVED',legal:'ARTIFACT / RECEIVED / CHOICE REQUIRED',closable:true,accept:true,stay:true});
  layer.querySelector('[data-postcard-accept]').onclick=()=>{
    clearTimeout(missingTimer);missingTimer=null;
    consumeSharePresentation();sharedArrivalMode=null;sharedArrivalStarted=false;
    closePostcard({restoreFocus:false});openResolvedFocus(node,focus);
  };
  layer.querySelector('[data-postcard-stay]').onclick=stayOnBoardFromSharedArrival;
}
function artifactIdFromFrame(frame){
  try{
    const raw=frame?.contentWindow?.location?.href||frame?.getAttribute?.('src')||'';const url=new URL(raw,location.origin);const parts=url.pathname.split('/').filter(Boolean);const index=parts.indexOf('artifact');const id=index>=0?String(parts[index+1]||'').toLowerCase():'';
    if(id&&FOCUS_RE.test(`artifact:${id}`))return id;
  }catch{}
  const focus=parseFocus();return focus?.type==='artifact'?focus.id:null;
}
function injectArtifactDetailShare(frame){
  if(!session?.user||!frame)return;
  try{
    const doc=frame.contentDocument;const actions=doc?.querySelector('.dc-artifact-actions');if(!actions)return;
    const id=artifactIdFromFrame(frame);if(!id)return;
    let button=actions.querySelector('[data-board-artifact-share]');
    if(!button){
      button=doc.createElement('button');button.type='button';button.className='dc-artifact-action';button.dataset.boardArtifactShare='1';button.textContent='ПОДЕЛИТЬСЯ ↗';button.setAttribute('aria-label','Передать артефакт');
      const back=actions.querySelector('#detailBack');if(back)back.before(button);else actions.appendChild(button);
    }
    button.dataset.artifactId=id;
    button.onclick=event=>{event.preventDefault();event.stopPropagation();openSenderPostcard(id,button)};
  }catch{}
}
function bindArtifactFrame(frame){
  if(!frame||frame.dataset.dcBoardShareDetailBound==='1')return;
  frame.dataset.dcBoardShareDetailBound='1';let observer=null;
  const install=()=>{
    try{
      observer?.disconnect();injectArtifactDetailShare(frame);const doc=frame.contentDocument;const target=doc?.getElementById('artifactHost')||doc?.body;if(!target)return;
      observer=new MutationObserver(()=>injectArtifactDetailShare(frame));observer.observe(target,{childList:true,subtree:true});
    }catch{}
  };
  frame.addEventListener('load',install);install();
}
function refreshArtifactDetailShare(){
  document.querySelectorAll('.dc-artifact-overlay iframe').forEach(frame=>{bindArtifactFrame(frame);injectArtifactDetailShare(frame)});
}
function installArtifactDetailShareBridge(){
  refreshArtifactDetailShare();
  artifactFrameObserver=new MutationObserver(refreshArtifactDetailShare);artifactFrameObserver.observe(document.body,{childList:true,subtree:true});
}
function addEntityShareButtons(){
  if(!session?.user||!boardHost)return;
  boardHost.querySelectorAll('.dc-notice[data-artifact] > [data-board-share]').forEach(node=>node.remove());
  boardHost.querySelectorAll('.dc-projection[data-source-id]').forEach(node=>{
    if(node.querySelector(':scope > [data-board-share]'))return;
    const stale=node.querySelector('[data-board-share]');if(stale)stale.remove();
    const id=node.dataset.sourceId;if(!id)return;
    const button=document.createElement('button');button.type='button';button.className='dc-board-share';button.dataset.boardShare='1';button.setAttribute('aria-label','Скопировать ссылку на карточку');button.textContent='ПОДЕЛИТЬСЯ ↗';
    button.addEventListener('click',async event=>{
      event.preventDefault();event.stopPropagation();
      const ok=await copyText(externalShareUrlFor('entity',id).href);button.dataset.copyState=ok?'done':'error';button.textContent=ok?'СКОПИРОВАНО ✓':'НЕ УДАЛОСЬ';setTimeout(()=>{button.textContent='ПОДЕЛИТЬСЯ ↗';delete button.dataset.copyState},1600);
    });node.appendChild(button);
  });
}
function renderAuthGate(){
  if(document.querySelector('.dc-board-deeplink-gate'))return;
  const gate=document.createElement('section');gate.className='dc-board-deeplink-gate';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');
  gate.innerHTML='<article class="dc-board-deeplink-gate__card"><h1>ВЫ ВОШЛИ НЕ ТУДА.</h1><h2>НО, ВОЗМОЖНО, ИМЕННО ТУДА.</h2><p>Это закрытая территория DEMENTOR CLUB.</p><p>Здесь люди собираются вокруг проектов, событий, идей и других сомнительно полезных форм совместной деятельности.</p><p>Администрация клуба не несёт ответственности за потерю времени, иллюзий, чувства собственной важности и отдельных элементов головы.</p><p>Чтобы посмотреть, чем с вами поделились, войдите.</p><button class="dc-board-deeplink-gate__action" type="button">ВОЙТИ</button><p class="dc-board-deeplink-gate__note">Аккаунт нужен только для доступа.<br>Членом клуба от этого вы автоматически не становитесь.</p></article>';
  gate.querySelector('button').onclick=()=>loginWithGoogle(`${location.pathname}${location.search}${location.hash}`,getClient());document.body.appendChild(gate);
}
function onArtifactClosed(){
  if(popHandling)return;
  const focus=parseFocus();if(focus?.type!=='artifact')return;
  if(history.state?.dcBoardFocusPushed)history.back();else clearFocus({replace:true});
}
function installHistoryBridge(){
  document.addEventListener('click',event=>{
    const interactive=event.target.closest?.('a,button,input,textarea,select,label,dialog');if(interactive)return;
    const card=event.target.closest?.('.dc-notice[data-artifact]');if(!card||card.hidden||card.classList.contains('dc-board-filtered'))return;
    if(Number(card.dataset.boardJustDragged||0)>Date.now()-650)return;
    const id=card.dataset.artifact;if(id&&!sameFocus('artifact',id))setFocus('artifact',id,{pushed:true});
  },true);
  window.addEventListener('popstate',()=>{popHandling=true;sharedArrivalMode=null;sharedArrivalStarted=false;closePostcard({restoreFocus:false});const focus=parseFocus();if(focus)scheduleResolve();else window.dispatchEvent(new CustomEvent('dc:board-close-artifact'));setTimeout(()=>{popHandling=false},0)});
  window.addEventListener('dc:board-artifact-closed',onArtifactClosed);
}
function currentBoardUserState(){return String(document.documentElement.dataset.dcBoardUserState||'')}
function waitForBoardUserState(timeout=2600){
  const existing=currentBoardUserState();if(existing)return Promise.resolve(existing);
  return new Promise(resolve=>{
    let settled=false;let observer=null;let timer=null;
    const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);observer?.disconnect();window.removeEventListener('dc:board-personal-state',onState);resolve(String(value||currentBoardUserState()||''))};
    const onState=event=>finish(event.detail?.state);
    window.addEventListener('dc:board-personal-state',onState);
    observer=new MutationObserver(()=>{const value=currentBoardUserState();if(value)finish(value)});observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-dc-board-user-state']});
    timer=setTimeout(()=>finish(currentBoardUserState()),timeout);
  });
}
async function prepareSharedArrival(){
  await waitForBoardUserState();
  sharedArrivalStarted=false;sharedArrivalMode='receiver';scheduleResolve();
}

async function init(){
  try{session=await currentSession(getClient())}catch{session=null}
  const focus=parseFocus();const shared=isSharedArtifactArrival();
  if(focus&&!session){if(shared)showReceiveAuthPostcard();else renderAuthGate();return}
  if(!session)return;
  installHistoryBridge();installArtifactDetailShareBridge();addEntityShareButtons();
  window.addEventListener('dc:board-user-navigation',consumeBoardNavigationFocus);
  window.addEventListener('dc:board-guest-read-ready',()=>{addEntityShareButtons();scheduleResolve()});
  window.addEventListener('dc:board-projections-updated',()=>{addEntityShareButtons();scheduleResolve()});
  window.addEventListener('dc:board-layout-request',()=>addEntityShareButtons());
  if(boardHost)new MutationObserver(()=>{addEntityShareButtons();if(parseFocus())scheduleResolve()}).observe(boardHost,{childList:true,subtree:true});
  if(shared)await prepareSharedArrival();else if(focus)scheduleResolve();
}
init().catch(error=>console.error('[DC Board deeplink]',error));
