import {getClient} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const client=getClient();
const WORLD={w:12000,h:8000};
let drag=null;

function scale(){
  const transform=getComputedStyle(boardHost).transform;
  if(!transform||transform==='none')return 1;
  try{return Math.max(.01,new DOMMatrixReadOnly(transform).a||1)}catch{return 1}
}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
async function persist(card){
  const artifactId=card.dataset.artifact;
  if(!artifactId)return;
  const version=Number(card.dataset.positionVersion||1);
  const x=parseFloat(card.style.left)||0,y=parseFloat(card.style.top)||0;
  const result=await client.from('dc_artifact_board_positions').update({x,y}).eq('artifact_id',artifactId).eq('position_version',version).select('artifact_id,x,y,rotation,size_class,position_version').maybeSingle();
  if(result.error)console.warn('[DC Board drag livefix]',result.error.message);
  if(result.data)card.dataset.positionVersion=String(result.data.position_version||version);
}

function start(event){
  const card=event.target.closest?.('.dc-notice.is-own-movable');
  if(!card||event.button!==0)return;
  event.preventDefault();
  event.stopPropagation();
  const x=parseFloat(card.style.left)||0,y=parseFloat(card.style.top)||0;
  drag={card,id:event.pointerId,startX:event.clientX,startY:event.clientY,x,y,moved:false};
  try{card.setPointerCapture(event.pointerId)}catch{}
  card.classList.add('is-dragging');
  document.documentElement.dataset.boardDragging='1';
}
function move(event){
  if(!drag||event.pointerId!==drag.id)return;
  event.preventDefault();
  const s=scale();
  const dx=(event.clientX-drag.startX)/s,dy=(event.clientY-drag.startY)/s;
  if(Math.hypot(dx,dy)>3)drag.moved=true;
  drag.card.style.left=`${clamp(drag.x+dx,0,WORLD.w-Math.max(280,drag.card.offsetWidth||280))}px`;
  drag.card.style.top=`${clamp(drag.y+dy,0,WORLD.h-Math.max(220,drag.card.offsetHeight||220))}px`;
}
async function end(event){
  if(!drag||event.pointerId!==drag.id)return;
  const current=drag;drag=null;
  current.card.classList.remove('is-dragging');
  delete document.documentElement.dataset.boardDragging;
  if(current.moved){current.card.dataset.boardJustDragged=String(Date.now());await persist(current.card)}
}

if(boardHost){
  document.addEventListener('pointerdown',start,true);
  document.addEventListener('pointermove',move,{capture:true,passive:false});
  document.addEventListener('pointerup',end,true);
  document.addEventListener('pointercancel',end,true);
  document.addEventListener('selectstart',event=>{if(event.target.closest?.('.dc-notice.is-own-movable'))event.preventDefault()},true);
  document.addEventListener('dragstart',event=>{if(event.target.closest?.('.dc-notice[data-artifact]'))event.preventDefault()},true);
}
