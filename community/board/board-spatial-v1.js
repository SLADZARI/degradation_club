import {getClient,getEntryStatus} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const client=getClient();
const WORLD={w:5000,h:3500};
let viewport=null;
let camera={x:0,y:0,scale:1};
let positions=new Map();
let activationState=null;
let renderTimer=null;

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function hashString(value){let h=2166136261;for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function deterministicPlatformPosition(id,index=0){
  const h=hashString(id);const angle=((h%360)/180)*Math.PI;const radius=700+(h%1200);return{x:2500+Math.cos(angle)*radius,y:1750+Math.sin(angle)*radius,rotation:((h%15)-7)/10,size_class:index%4===0?'M':'S'};
}
function fallbackMemberPosition(id,index=0){const h=hashString(id);return{x:1700+(h%7)*440,y:900+(index%6)*420,rotation:((h%9)-4)/10,size_class:'S',position_version:1}}
function cardSizeClass(card,pos){if(pos?.size_class)return pos.size_class;if(card.querySelector('.dc-notice__media'))return'L';if((card.textContent||'').length>900)return'M';return'S'}

function setCamera(next){camera={...camera,...next};camera.scale=clamp(camera.scale,.28,1.6);applyCamera()}
function applyCamera(){if(boardHost)boardHost.style.transform=`translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`;updateStatus()}
function updateStatus(){const el=viewport?.querySelector('.dc-spatial-status');if(el)el.textContent=`ZOOM ${Math.round(camera.scale*100)}% · X ${Math.round(-camera.x/camera.scale)} · Y ${Math.round(-camera.y/camera.scale)}`}
function resetCamera(){if(!viewport)return;const rect=viewport.getBoundingClientRect();const scale=Math.min(.72,rect.width/2200,rect.height/1450);setCamera({scale,x:rect.width/2-2500*scale,y:rect.height/2-1750*scale})}
function zoomAt(factor,cx,cy){if(!viewport)return;const rect=viewport.getBoundingClientRect();const px=cx-rect.left,py=cy-rect.top;const wx=(px-camera.x)/camera.scale,wy=(py-camera.y)/camera.scale;const nextScale=clamp(camera.scale*factor,.28,1.6);setCamera({scale:nextScale,x:px-wx*nextScale,y:py-wy*nextScale})}

async function loadPositions(){
  const {data,error}=await client.from('dc_artifact_board_positions').select('artifact_id,x,y,rotation,size_class,position_version').eq('board_id','community');
  if(error){console.warn('[DC Spatial] positions unavailable',error);return}
  positions=new Map((data||[]).map(p=>[p.artifact_id,p]));
}

function placeCards(){
  if(!boardHost)return;
  const memberCards=[...boardHost.querySelectorAll('.dc-notice[data-artifact]')];
  memberCards.forEach((card,index)=>{
    const id=card.dataset.artifact;const pos=positions.get(id)||fallbackMemberPosition(id,index);card.style.left=`${pos.x}px`;card.style.top=`${pos.y}px`;card.style.setProperty('--dc-card-rotation',`${pos.rotation||0}deg`);card.dataset.sizeClass=cardSizeClass(card,pos);card.dataset.positionVersion=String(pos.position_version||1);if(card.querySelector('[data-close-artifact]')&&activationState==='MEMBER_ACTIVATED')card.classList.add('is-own-movable');else card.classList.remove('is-own-movable');
  });
  [...boardHost.querySelectorAll('[data-board-source="platform"]')].forEach((card,index)=>{const pos=deterministicPlatformPosition(card.dataset.sourceId||`${card.dataset.sourceType}-${index}`,index);card.style.left=`${pos.x}px`;card.style.top=`${pos.y}px`;card.style.setProperty('--dc-card-rotation',`${pos.rotation}deg`);card.dataset.sizeClass=cardSizeClass(card,pos)});
}

function installShell(){
  if(!boardHost||boardHost.closest('.dc-spatial-viewport')){viewport=boardHost?.closest('.dc-spatial-viewport');return}
  viewport=document.createElement('div');viewport.className='dc-spatial-viewport';boardHost.parentNode.insertBefore(viewport,boardHost);viewport.appendChild(boardHost);boardHost.classList.add('dc-spatial-world');
  const controls=document.createElement('div');controls.className='dc-spatial-controls';controls.innerHTML='<button class="dc-spatial-control" data-zoom-in>＋</button><button class="dc-spatial-control" data-zoom-out>−</button><button class="dc-spatial-control" data-home>К ЖИЗНИ</button><button class="dc-spatial-control" data-mine>МОЁ</button>';
  viewport.appendChild(controls);const status=document.createElement('div');status.className='dc-spatial-status';viewport.appendChild(status);const help=document.createElement('div');help.className='dc-spatial-help';help.textContent='Тяните пустое поле — перемещение. Колесо / кнопки — масштаб. Своё объявление можно двигать.';viewport.appendChild(help);
  controls.querySelector('[data-zoom-in]').onclick=()=>zoomAt(1.18,viewport.getBoundingClientRect().left+viewport.clientWidth/2,viewport.getBoundingClientRect().top+viewport.clientHeight/2);
  controls.querySelector('[data-zoom-out]').onclick=()=>zoomAt(.84,viewport.getBoundingClientRect().left+viewport.clientWidth/2,viewport.getBoundingClientRect().top+viewport.clientHeight/2);
  controls.querySelector('[data-home]').onclick=resetCamera;
  controls.querySelector('[data-mine]').onclick=focusMine;
}

function focusMine(){const mine=boardHost?.querySelector('.dc-notice.is-own-movable');if(!mine||!viewport)return;const x=parseFloat(mine.style.left)||2500,y=parseFloat(mine.style.top)||1750;const rect=viewport.getBoundingClientRect();const scale=Math.max(camera.scale,.8);setCamera({scale,x:rect.width/2-x*scale-160,y:rect.height/2-y*scale-120})}

function installPanZoom(){
  if(!viewport)return;let pan=null;
  viewport.addEventListener('wheel',event=>{event.preventDefault();zoomAt(event.deltaY<0?1.1:.9,event.clientX,event.clientY)},{passive:false});
  viewport.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;if(event.target.closest('.dc-notice,.dc-projection,.dc-spatial-controls'))return;pan={id:event.pointerId,x:event.clientX,y:event.clientY,cx:camera.x,cy:camera.y};viewport.setPointerCapture(event.pointerId);viewport.classList.add('is-panning')
  });
  viewport.addEventListener('pointermove',event=>{if(!pan||event.pointerId!==pan.id)return;setCamera({x:pan.cx+(event.clientX-pan.x),y:pan.cy+(event.clientY-pan.y)})});
  viewport.addEventListener('pointerup',event=>{if(pan?.id===event.pointerId){pan=null;viewport.classList.remove('is-panning')}});
}

function installOwnDrag(){
  if(!boardHost)return;let drag=null;
  boardHost.addEventListener('pointerdown',event=>{
    const card=event.target.closest('.dc-notice.is-own-movable');if(!card||event.target.closest('button,a,textarea,input'))return;event.stopPropagation();const x=parseFloat(card.style.left)||0,y=parseFloat(card.style.top)||0;drag={card,id:event.pointerId,startX:event.clientX,startY:event.clientY,x,y};card.setPointerCapture(event.pointerId);card.classList.add('is-dragging')
  });
  boardHost.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=(event.clientX-drag.startX)/camera.scale,dy=(event.clientY-drag.startY)/camera.scale;drag.card.style.left=`${clamp(drag.x+dx,0,WORLD.w-280)}px`;drag.card.style.top=`${clamp(drag.y+dy,0,WORLD.h-220)}px`});
  boardHost.addEventListener('pointerup',async event=>{
    if(!drag||drag.id!==event.pointerId)return;const current=drag;drag=null;current.card.classList.remove('is-dragging');const artifactId=current.card.dataset.artifact;const x=parseFloat(current.card.style.left),y=parseFloat(current.card.style.top),version=Number(current.card.dataset.positionVersion||1);
    const {data,error}=await client.rpc('dc_move_own_artifact_v1',{p_artifact_id:artifactId,p_x:x,p_y:y,p_expected_version:version});if(error){console.error('[DC Spatial move]',error);await loadPositions();placeCards();return}current.card.dataset.positionVersion=String(data?.position_version||version+1);positions.set(artifactId,{...(positions.get(artifactId)||{}),artifact_id:artifactId,x,y,position_version:data?.position_version||version+1})
  });
}

async function refreshSpatial(){await loadPositions();placeCards()}
async function init(){
  installShell();installPanZoom();installOwnDrag();
  try{const status=await getEntryStatus(client);activationState=status.community_activation_state||null}catch{}
  await refreshSpatial();resetCamera();
  if(boardHost){const observer=new MutationObserver(()=>{clearTimeout(renderTimer);renderTimer=setTimeout(placeCards,120)});observer.observe(boardHost,{childList:true})}
  addEventListener('resize',()=>resetCamera(),{passive:true});
}

init().catch(error=>console.error('[DC Spatial]',error));
