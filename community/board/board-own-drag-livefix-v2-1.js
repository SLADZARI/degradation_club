import {getClient} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const client=getClient();
const WORLD={w:12000,h:8000};
const CENTER={x:WORLD.w/2,y:WORLD.h/2};
const DISPLAY_MARGIN=900;
let drag=null;
let boardOffset={x:0,y:0};
let offsetReady=false;
const cardState=new WeakMap();

function scale(){
  const transform=getComputedStyle(boardHost).transform;
  if(!transform||transform==='none')return 1;
  try{return Math.max(.01,new DOMMatrixReadOnly(transform).a||1)}catch{return 1}
}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function cards(){return [...(boardHost?.querySelectorAll('.dc-notice[data-artifact]')||[])].filter(card=>!card.hidden)}
function cardBoundsFromRaw(card,raw){const w=Math.max(card.offsetWidth||280,220),h=Math.max(card.offsetHeight||220,140);return{left:raw.x,top:raw.y,right:raw.x+w,bottom:raw.y+h}}
function readRaw(card){
  const currentX=parseFloat(card.style.left)||0,currentY=parseFloat(card.style.top)||0;
  const state=cardState.get(card);
  if(!state)return{x:currentX,y:currentY};
  const nearDisplay=Math.abs(currentX-state.displayX)<1&&Math.abs(currentY-state.displayY)<1;
  const nearRaw=Math.abs(currentX-state.rawX)<1&&Math.abs(currentY-state.rawY)<1;
  if(nearDisplay)return{x:state.rawX,y:state.rawY};
  if(nearRaw)return{x:currentX,y:currentY};
  return{x:currentX-boardOffset.x,y:currentY-boardOffset.y};
}
function ensureCenteredCloud(){
  const list=cards();if(!list.length)return;
  const raws=list.map(card=>({card,raw:readRaw(card)}));
  if(!offsetReady){
    const bounds=raws.map(({card,raw})=>cardBoundsFromRaw(card,raw));
    const minX=Math.min(...bounds.map(b=>b.left)),maxX=Math.max(...bounds.map(b=>b.right));
    const minY=Math.min(...bounds.map(b=>b.top)),maxY=Math.max(...bounds.map(b=>b.bottom));
    const cloudCenterX=(minX+maxX)/2,cloudCenterY=(minY+maxY)/2;
    const minOffsetX=DISPLAY_MARGIN-minX,maxOffsetX=(WORLD.w-DISPLAY_MARGIN)-maxX;
    const minOffsetY=DISPLAY_MARGIN-minY,maxOffsetY=(WORLD.h-DISPLAY_MARGIN)-maxY;
    boardOffset={
      x:clamp(CENTER.x-cloudCenterX,minOffsetX,maxOffsetX),
      y:clamp(CENTER.y-cloudCenterY,minOffsetY,maxOffsetY)
    };
    offsetReady=true;
    if(boardHost){boardHost.dataset.boardOffsetX=String(boardOffset.x);boardHost.dataset.boardOffsetY=String(boardOffset.y)}
  }
  raws.forEach(({card,raw})=>{
    const displayX=clamp(raw.x+boardOffset.x,0,WORLD.w-Math.max(280,card.offsetWidth||280));
    const displayY=clamp(raw.y+boardOffset.y,0,WORLD.h-Math.max(220,card.offsetHeight||220));
    card.style.left=`${displayX}px`;card.style.top=`${displayY}px`;
    cardState.set(card,{rawX:raw.x,rawY:raw.y,displayX,displayY});
  });
}
async function persist(card){
  const artifactId=card.dataset.artifact;
  if(!artifactId)return;
  const version=Number(card.dataset.positionVersion||1);
  const displayX=parseFloat(card.style.left)||0,displayY=parseFloat(card.style.top)||0;
  const rawX=displayX-boardOffset.x,rawY=displayY-boardOffset.y;
  const result=await client.from('dc_artifact_board_positions').update({x:rawX,y:rawY}).eq('artifact_id',artifactId).eq('position_version',version).select('artifact_id,x,y,rotation,size_class,position_version').maybeSingle();
  if(result.error)console.warn('[DC Board drag livefix]',result.error.message);
  if(result.data){
    card.dataset.positionVersion=String(result.data.position_version||version);
    cardState.set(card,{rawX:Number(result.data.x)||rawX,rawY:Number(result.data.y)||rawY,displayX,displayY});
  }
}

function start(event){
  const card=event.target.closest?.('.dc-notice.is-own-movable');
  if(!card||event.button!==0)return;
  event.preventDefault();event.stopPropagation();
  ensureCenteredCloud();
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
function scheduleCenter(){requestAnimationFrame(()=>requestAnimationFrame(ensureCenteredCloud))}

if(boardHost){
  document.addEventListener('pointerdown',start,true);
  document.addEventListener('pointermove',move,{capture:true,passive:false});
  document.addEventListener('pointerup',end,true);
  document.addEventListener('pointercancel',end,true);
  document.addEventListener('selectstart',event=>{if(event.target.closest?.('.dc-notice.is-own-movable'))event.preventDefault()},true);
  document.addEventListener('dragstart',event=>{if(event.target.closest?.('.dc-notice[data-artifact]'))event.preventDefault()},true);
  const observer=new MutationObserver(scheduleCenter);observer.observe(boardHost,{childList:true,subtree:false});
  window.addEventListener('dc:board-spatial-ready',scheduleCenter);
  window.addEventListener('dc:board-filter-changed',scheduleCenter);
  window.addEventListener('dc:board-projections-updated',scheduleCenter);
  window.addEventListener('resize',scheduleCenter,{passive:true});
  scheduleCenter();
}
