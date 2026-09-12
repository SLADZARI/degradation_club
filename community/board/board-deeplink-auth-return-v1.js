import {getClient,currentSession,loginWithGoogle,route} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const FOCUS_RE=/^(artifact|entity):([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
let session=null;
let resolving=false;
let popHandling=false;
let missingTimer=null;

function parseFocus(){
  const raw=new URL(location.href).searchParams.get('focus')||'';
  const match=raw.match(FOCUS_RE);
  return match?{type:match[1].toLowerCase(),id:match[2].toLowerCase()}:null;
}
function boardUrlFor(type,id){
  const url=new URL(location.href);
  url.pathname=route('/workspace/board/');
  url.searchParams.set('focus',`${type}:${id}`);
  return url;
}
function baseBoardUrl(){const url=new URL(location.href);url.pathname=route('/workspace/board/');url.searchParams.delete('focus');return url}
function sameFocus(type,id){const focus=parseFocus();return focus?.type===type&&focus.id===String(id).toLowerCase()}
function setFocus(type,id,{replace=false,pushed=false}={}){
  const url=boardUrlFor(type,String(id).toLowerCase());
  const state={...(history.state||{}),dcBoardFocus:true,dcBoardFocusPushed:pushed};
  history[replace?'replaceState':'pushState'](state,'',url);
}
function clearFocus({replace=false}={}){
  const url=baseBoardUrl();
  history[replace?'replaceState':'pushState']({...history.state,dcBoardFocus:false,dcBoardFocusPushed:false},'',url);
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
  if(document.querySelector('.dc-board-focus-missing'))return;
  const gate=document.createElement('section');gate.className='dc-board-focus-missing';gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');
  gate.innerHTML='<article class="dc-board-focus-missing__card"><h2>ЭТОГО ЗДЕСЬ БОЛЬШЕ НЕТ.</h2><p>Возможно, всё закончилось хорошо.</p><p>Возможно, наоборот.</p><button class="dc-board-focus-missing__action" type="button">ОТКРЫТЬ BOARD</button></article>';
  gate.querySelector('button').onclick=()=>{clearFocus({replace:true});gate.remove();window.dispatchEvent(new CustomEvent('dc:board-close-artifact'))};document.body.appendChild(gate);
}
function resolveCurrentFocus({allowMissing=false}={}){
  const focus=parseFocus();if(!focus){hideMissing();return false}
  const node=targetNode(focus);if(!node){if(allowMissing)showMissing();return false}
  hideMissing();revealPresentationOnly(node);window.dispatchEvent(new CustomEvent('dc:board-focus-target',{detail:{node,open:focus.type==='artifact',focus,source:'url'}}));return true;
}
function scheduleResolve(){
  if(resolving)return;resolving=true;
  requestAnimationFrame(()=>{resolving=false;if(resolveCurrentFocus())return;clearTimeout(missingTimer);missingTimer=setTimeout(()=>resolveCurrentFocus({allowMissing:true}),4200)});
}
async function copyText(text){
  try{await navigator.clipboard.writeText(text);return true}catch{}
  const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch{}ta.remove();return ok;
}
function addShareButtons(){
  if(!session?.user||!boardHost)return;
  boardHost.querySelectorAll('.dc-notice[data-artifact],.dc-projection[data-source-id]').forEach(node=>{
    if(node.querySelector(':scope > [data-board-share]'))return;
    const stale=node.querySelector('[data-board-share]');if(stale)stale.remove();
    const type=node.matches('.dc-notice[data-artifact]')?'artifact':'entity';const id=type==='artifact'?node.dataset.artifact:node.dataset.sourceId;if(!id)return;
    const button=document.createElement('button');button.type='button';button.className='dc-board-share';button.dataset.boardShare='1';button.setAttribute('aria-label','Скопировать ссылку на карточку');button.textContent='ПОДЕЛИТЬСЯ ↗';
    button.addEventListener('click',async event=>{event.preventDefault();event.stopPropagation();const ok=await copyText(boardUrlFor(type,id).href);button.dataset.copyState=ok?'done':'error';button.textContent=ok?'СКОПИРОВАНО ✓':'НЕ УДАЛОСЬ';setTimeout(()=>{button.textContent='ПОДЕЛИТЬСЯ ↗';delete button.dataset.copyState},1600)});node.appendChild(button);
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
    const id=card.dataset.artifact;if(id&&!sameFocus('artifact',id))setFocus('artifact',id,{pushed:true});
  },true);
  window.addEventListener('popstate',()=>{popHandling=true;const focus=parseFocus();if(focus)scheduleResolve();else window.dispatchEvent(new CustomEvent('dc:board-close-artifact'));setTimeout(()=>{popHandling=false},0)});
  window.addEventListener('dc:board-artifact-closed',onArtifactClosed);
}

async function init(){
  try{session=await currentSession(getClient())}catch{session=null}
  const focus=parseFocus();
  if(focus&&!session){renderAuthGate();return}
  if(!session)return;
  installHistoryBridge();addShareButtons();
  window.addEventListener('dc:board-guest-read-ready',()=>{addShareButtons();scheduleResolve()});
  window.addEventListener('dc:board-projections-updated',()=>{addShareButtons();scheduleResolve()});
  window.addEventListener('dc:board-layout-request',()=>addShareButtons());
  if(boardHost)new MutationObserver(()=>{addShareButtons();if(parseFocus())scheduleResolve()}).observe(boardHost,{childList:true,subtree:true});
  if(focus)scheduleResolve();
}
init().catch(error=>console.error('[DC Board deeplink]',error));
