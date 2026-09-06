import {getClient,currentSession,getEntryStatus} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const client=getClient();
const WORLD={w:12000,h:8000};
const WORLD_CENTER={x:WORLD.w/2,y:WORLD.h/2};
let viewport=null;
let extrasHost=null;
let camera={x:0,y:0,scale:1};
let positions=new Map();
let activationState=null;
let entryStatus=null;
let renderTimer=null;
let cameraIntent='auto';

function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function hashString(value){let h=2166136261;for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function deterministicPlatformPosition(id,index=0){const h=hashString(id);const angle=((h%360)/180)*Math.PI;const radius=650+(h%1250);return{x:WORLD_CENTER.x+Math.cos(angle)*radius,y:WORLD_CENTER.y+Math.sin(angle)*radius,rotation:((h%15)-7)/10,size_class:index%4===0?'M':'S'}}
function fallbackMemberPosition(id,index=0){const h=hashString(id);return{x:WORLD_CENTER.x-850+(h%7)*280,y:WORLD_CENTER.y-620+(index%6)*250,rotation:((h%9)-4)/10,size_class:null,position_version:1}}
function cardSizeClass(card,pos){if(pos?.size_class)return pos.size_class;if(card.querySelector('.dc-notice__media'))return'L';const length=(card.textContent||'').length;if(length>900)return'M';if(length<220)return'XS';return'S'}

function updateStatus(){const el=viewport?.querySelector('.dc-spatial-status');if(el)el.textContent=`ZOOM ${Math.round(camera.scale*100)}% · X ${Math.round(-camera.x/camera.scale)} · Y ${Math.round(-camera.y/camera.scale)}`}
function applyCamera(){if(boardHost)boardHost.style.transform=`translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`;updateStatus()}
function setCamera(next){camera={...camera,...next};camera.scale=clamp(camera.scale,.28,1.6);applyCamera()}
function visibleSpatialCards(){
  if(!boardHost)return[];
  return [...boardHost.querySelectorAll('.dc-notice[data-artifact],[data-board-source="platform"]')].filter(card=>{
    if(card.hidden||card.classList.contains('dc-board-filtered'))return false;
    const style=getComputedStyle(card);return style.display!=='none'&&style.visibility!=='hidden';
  });
}
function cardWorldBounds(card){
  const left=parseFloat(card.style.left)||0,top=parseFloat(card.style.top)||0;
  const width=Math.max(card.offsetWidth||0,220),height=Math.max(card.offsetHeight||0,140);
  return{left,top,right:left+width,bottom:top+height};
}
function fitActiveContent({markManual=false}={}){
  if(!viewport)return false;
  const cards=visibleSpatialCards();
  if(!cards.length){
    const rect=viewport.getBoundingClientRect();const scale=Math.min(.72,rect.width/2200,rect.height/1450);
    setCamera({scale,x:rect.width/2-WORLD_CENTER.x*scale,y:rect.height/2-WORLD_CENTER.y*scale});
    if(markManual)cameraIntent='manual';
    return false;
  }
  const bounds=cards.map(cardWorldBounds);
  const minX=Math.min(...bounds.map(b=>b.left)),minY=Math.min(...bounds.map(b=>b.top));
  const maxX=Math.max(...bounds.map(b=>b.right)),maxY=Math.max(...bounds.map(b=>b.bottom));
  const width=Math.max(260,maxX-minX),height=Math.max(220,maxY-minY);
  const rect=viewport.getBoundingClientRect();
  const pad=Math.min(88,Math.max(36,rect.width*.065));
  const usableW=Math.max(160,rect.width-pad*2),usableH=Math.max(160,rect.height-pad*2);
  const scale=clamp(Math.min(.96,usableW/width,usableH/height),.28,.96);
  const centerX=(minX+maxX)/2,centerY=(minY+maxY)/2;
  setCamera({scale,x:rect.width/2-centerX*scale,y:rect.height/2-centerY*scale});
  if(markManual)cameraIntent='manual';
  return true;
}
function zoomAt(factor,cx,cy,{manual=true}={}){if(!viewport)return;const rect=viewport.getBoundingClientRect();const px=cx-rect.left,py=cy-rect.top;const wx=(px-camera.x)/camera.scale,wy=(py-camera.y)/camera.scale;const nextScale=clamp(camera.scale*factor,.28,1.6);setCamera({scale:nextScale,x:px-wx*nextScale,y:py-wy*nextScale});if(manual)cameraIntent='manual'}

async function loadPositions(){
  const session=await currentSession(client);
  if(!session){positions=new Map();return}
  const {data,error}=await client.from('dc_artifact_board_positions').select('artifact_id,x,y,rotation,size_class,position_version').eq('board_id','community');
  if(error){console.warn('[DC Spatial] positions unavailable',error.message);return}
  positions=new Map((data||[]).map(item=>[item.artifact_id,item]));
}

function liftLegacyBlocks(){
  if(!boardHost||!extrasHost)return;
  const incoming=[...boardHost.querySelectorAll(':scope > .dc-club-records,:scope > .dc-board-empty')];
  if(!incoming.length)return;
  extrasHost.replaceChildren();
  incoming.forEach(node=>extrasHost.appendChild(node));
}

function placeCards(){
  if(!boardHost)return;
  liftLegacyBlocks();
  const memberCards=[...boardHost.querySelectorAll('.dc-notice[data-artifact]')];
  memberCards.forEach((card,index)=>{
    const id=card.dataset.artifact;
    const pos=positions.get(id)||fallbackMemberPosition(id,index);
    card.style.left=`${clamp(Number(pos.x)||0,0,WORLD.w-260)}px`;
    card.style.top=`${clamp(Number(pos.y)||0,0,WORLD.h-220)}px`;
    card.style.setProperty('--dc-card-rotation',`${Number(pos.rotation)||0}deg`);
    card.dataset.sizeClass=cardSizeClass(card,pos);
    card.dataset.positionVersion=String(pos.position_version||1);
    if(card.querySelector('[data-close-artifact]')&&activationState==='MEMBER_ACTIVATED')card.classList.add('is-own-movable');
    else card.classList.remove('is-own-movable');
  });
  [...boardHost.querySelectorAll('[data-board-source="platform"]')].forEach((card,index)=>{
    const pos=deterministicPlatformPosition(card.dataset.sourceId||`${card.dataset.sourceType}-${index}`,index);
    card.style.left=`${pos.x}px`;card.style.top=`${pos.y}px`;card.style.setProperty('--dc-card-rotation',`${pos.rotation}deg`);card.dataset.sizeClass=cardSizeClass(card,pos);
  });
}

function openArtifactSlot(){
  const entrySection=document.getElementById('entrySection');
  if(!entrySection)return;
  entrySection.scrollIntoView({behavior:'smooth',block:'start'});
  window.setTimeout(()=>document.getElementById('openComposer')?.focus(),360);
}

function updateSlotControl(){
  const control=viewport?.querySelector('[data-slot]');
  if(!control)return;
  if(entryStatus?.membership_active!==true){control.remove();return}
  const available=Number(entryStatus?.artifact_slots_available||0);
  const consuming=Number(entryStatus?.artifact_slots_consuming||0);
  if(available>0){control.textContent='＋ АРТЕФАКТ';control.setAttribute('aria-label','Открыть свободный Artifact slot');return}
  if(consuming>0){control.textContent='SLOT ЗАНЯТ';control.setAttribute('aria-label','Показать занятый Artifact slot и управление текущим объявлением');return}
  control.textContent='SLOT НЕТ';control.setAttribute('aria-label','Показать состояние Artifact slot');
}

function installShell(){
  if(!boardHost)return;
  if(boardHost.closest('.dc-spatial-viewport')){viewport=boardHost.closest('.dc-spatial-viewport');extrasHost=viewport.previousElementSibling?.classList.contains('dc-spatial-extras')?viewport.previousElementSibling:null;return}
  extrasHost=document.createElement('div');extrasHost.className='dc-spatial-extras';boardHost.parentNode.insertBefore(extrasHost,boardHost);
  viewport=document.createElement('div');viewport.className='dc-spatial-viewport';boardHost.parentNode.insertBefore(viewport,boardHost);viewport.appendChild(boardHost);boardHost.classList.add('dc-spatial-world');
  const controls=document.createElement('div');controls.className='dc-spatial-controls';controls.innerHTML='<button class="dc-spatial-control" type="button" data-slot aria-label="Показать состояние Artifact slot">SLOT</button><button class="dc-spatial-control" type="button" data-zoom-in aria-label="Увеличить">＋</button><button class="dc-spatial-control" type="button" data-zoom-out aria-label="Уменьшить">−</button><button class="dc-spatial-control" type="button" data-home>К ЖИЗНИ</button><button class="dc-spatial-control" type="button" data-mine>МОЁ</button>';
  viewport.appendChild(controls);
  const status=document.createElement('div');status.className='dc-spatial-status';status.setAttribute('aria-live','polite');viewport.appendChild(status);
  const help=document.createElement('div');help.className='dc-spatial-help';help.textContent='Пустое поле: drag мышью или одним пальцем. Два пальца: масштаб + движение. «К жизни» показывает все видимые объекты. «Моё» находит ваш объект.';viewport.appendChild(help);
  controls.querySelector('[data-slot]').onclick=openArtifactSlot;
  controls.querySelector('[data-zoom-in]').onclick=()=>zoomAt(1.18,viewport.getBoundingClientRect().left+viewport.clientWidth/2,viewport.getBoundingClientRect().top+viewport.clientHeight/2);
  controls.querySelector('[data-zoom-out]').onclick=()=>zoomAt(.84,viewport.getBoundingClientRect().left+viewport.clientWidth/2,viewport.getBoundingClientRect().top+viewport.clientHeight/2);
  controls.querySelector('[data-home]').onclick=()=>fitActiveContent({markManual:true});
  controls.querySelector('[data-mine]').onclick=focusMine;
  liftLegacyBlocks();
}

function focusPersonalCard(){
  const host=viewport?.querySelector('[data-board-personal-host]');
  if(!host||host.hidden)return false;
  host.classList.remove('is-camera-focus');void host.offsetWidth;host.classList.add('is-camera-focus');
  const action=host.querySelector('a,button,[tabindex]:not([tabindex="-1"])');
  if(action){try{action.focus({preventScroll:true})}catch{action.focus()}}
  window.setTimeout(()=>host.classList.remove('is-camera-focus'),1200);
  return true;
}
function focusMine(){
  if(!viewport)return;
  const mine=boardHost?.querySelector('.dc-notice.is-own-movable')||boardHost?.querySelector('.dc-notice[data-artifact] [data-close-artifact]')?.closest('.dc-notice');
  if(mine){
    const x=parseFloat(mine.style.left)||WORLD_CENTER.x,y=parseFloat(mine.style.top)||WORLD_CENTER.y;
    const width=Math.max(mine.offsetWidth||320,240),height=Math.max(mine.offsetHeight||220,160);
    const rect=viewport.getBoundingClientRect();const scale=clamp(Math.max(camera.scale,.82),.28,1.08);
    setCamera({scale,x:rect.width/2-(x+width/2)*scale,y:rect.height/2-(y+height/2)*scale});cameraIntent='manual';
    mine.classList.add('is-camera-focus');window.setTimeout(()=>mine.classList.remove('is-camera-focus'),1200);return;
  }
  focusPersonalCard();
}

function installPanZoom(){
  if(!viewport)return;
  const pointers=new Map();
  let mousePan=null;
  let touchGesture=null;
  let lastTap=null;
  let suppressClickUntil=0;
  const blockedTarget=target=>target.closest('.dc-spatial-controls,a,button,input,textarea,dialog');
  const touchPoints=()=>[...pointers.values()].filter(point=>point.type==='touch');
  const centerOf=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const startSingleTouch=point=>{touchGesture={mode:'pan',id:point.id,startX:point.x,startY:point.y,cx:camera.x,cy:camera.y,moved:false}};
  const startPinch=()=>{
    const pts=touchPoints();if(pts.length<2)return;
    const [a,b]=pts;const center=centerOf(a,b);const rect=viewport.getBoundingClientRect();const px=center.x-rect.left,py=center.y-rect.top;
    touchGesture={mode:'pinch',ids:[a.id,b.id],startDistance:Math.max(1,distance(a,b)),startScale:camera.scale,worldX:(px-camera.x)/camera.scale,worldY:(py-camera.y)/camera.scale,moved:false};
  };

  viewport.addEventListener('wheel',event=>{event.preventDefault();zoomAt(event.deltaY<0?1.1:.9,event.clientX,event.clientY)},{passive:false});
  viewport.addEventListener('pointerdown',event=>{
    if(event.pointerType==='mouse'){
      if(event.button!==0||event.target.closest('.dc-notice,.dc-projection,.dc-spatial-controls,a,button,input,textarea,dialog'))return;
      mousePan={id:event.pointerId,x:event.clientX,y:event.clientY,cx:camera.x,cy:camera.y};cameraIntent='manual';viewport.setPointerCapture(event.pointerId);viewport.classList.add('is-panning');return;
    }
    if(event.pointerType!=='touch'||blockedTarget(event.target))return;
    pointers.set(event.pointerId,{id:event.pointerId,type:'touch',x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,moved:false});
    cameraIntent='manual';viewport.setPointerCapture(event.pointerId);
    const pts=touchPoints();
    if(pts.length===1)startSingleTouch(pts[0]);
    else if(pts.length===2)startPinch();
    viewport.classList.add('is-panning');
  });
  viewport.addEventListener('pointermove',event=>{
    if(event.pointerType==='mouse'){
      if(!mousePan||event.pointerId!==mousePan.id)return;
      setCamera({x:mousePan.cx+(event.clientX-mousePan.x),y:mousePan.cy+(event.clientY-mousePan.y)});return;
    }
    const point=pointers.get(event.pointerId);if(!point)return;
    point.x=event.clientX;point.y=event.clientY;
    if(Math.hypot(point.x-point.startX,point.y-point.startY)>6)point.moved=true;
    const pts=touchPoints();
    if(pts.length>=2){
      if(touchGesture?.mode!=='pinch')startPinch();
      const [a,b]=pts;const center=centerOf(a,b);const rect=viewport.getBoundingClientRect();const px=center.x-rect.left,py=center.y-rect.top;
      const nextScale=clamp(touchGesture.startScale*(distance(a,b)/touchGesture.startDistance),.28,1.6);
      touchGesture.moved=touchGesture.moved||Math.abs(nextScale-touchGesture.startScale)>.01||a.moved||b.moved;
      setCamera({scale:nextScale,x:px-touchGesture.worldX*nextScale,y:py-touchGesture.worldY*nextScale});
      event.preventDefault();return;
    }
    if(pts.length===1){
      const current=pts[0];if(touchGesture?.mode!=='pan'||touchGesture.id!==current.id)startSingleTouch(current);
      const dx=current.x-touchGesture.startX,dy=current.y-touchGesture.startY;
      if(Math.hypot(dx,dy)>4){touchGesture.moved=true;setCamera({x:touchGesture.cx+dx,y:touchGesture.cy+dy});event.preventDefault()}
    }
  },{passive:false});
  const end=event=>{
    if(event.pointerType==='mouse'){
      if(mousePan?.id===event.pointerId){mousePan=null;viewport.classList.remove('is-panning')}return;
    }
    const point=pointers.get(event.pointerId);if(!point)return;
    pointers.delete(event.pointerId);
    const moved=point.moved||touchGesture?.moved;
    const remaining=touchPoints();
    if(moved)suppressClickUntil=Date.now()+350;
    if(remaining.length===1)startSingleTouch(remaining[0]);
    else if(remaining.length===0){
      viewport.classList.remove('is-panning');
      if(!moved){
        const now=Date.now();
        if(lastTap&&now-lastTap.time<320&&Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y)<36){zoomAt(1.45,event.clientX,event.clientY);lastTap=null;suppressClickUntil=now+350}
        else lastTap={time:now,x:event.clientX,y:event.clientY};
      }
      touchGesture=null;
    }
  };
  viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
  viewport.addEventListener('click',event=>{if(Date.now()<suppressClickUntil){event.preventDefault();event.stopPropagation()}},true);
}

async function persistOwnPosition(card){
  const artifactId=card.dataset.artifact;
  const version=Number(card.dataset.positionVersion||1);
  const x=parseFloat(card.style.left),y=parseFloat(card.style.top);
  const {data,error}=await client.from('dc_artifact_board_positions')
    .update({x,y})
    .eq('artifact_id',artifactId)
    .eq('position_version',version)
    .select('artifact_id,x,y,rotation,size_class,position_version')
    .maybeSingle();
  if(error||!data){console.warn('[DC Spatial] move rejected/conflicted',error?.message||'POSITION_CONFLICT');await loadPositions();placeCards();return}
  card.dataset.positionVersion=String(data.position_version);
  positions.set(artifactId,data);
}

function installOwnDrag(){
  if(!boardHost)return;
  let drag=null;
  boardHost.addEventListener('pointerdown',event=>{
    const card=event.target.closest('.dc-notice.is-own-movable');
    if(!card||event.target.closest('button,a,textarea,input,dialog'))return;
    event.stopPropagation();cameraIntent='manual';
    const x=parseFloat(card.style.left)||0,y=parseFloat(card.style.top)||0;
    drag={card,id:event.pointerId,startX:event.clientX,startY:event.clientY,x,y};
    card.setPointerCapture(event.pointerId);card.classList.add('is-dragging');
  });
  boardHost.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=(event.clientX-drag.startX)/camera.scale,dy=(event.clientY-drag.startY)/camera.scale;drag.card.style.left=`${clamp(drag.x+dx,0,WORLD.w-280)}px`;drag.card.style.top=`${clamp(drag.y+dy,0,WORLD.h-220)}px`});
  const end=async event=>{if(!drag||drag.id!==event.pointerId)return;const current=drag;drag=null;current.card.classList.remove('is-dragging');await persistOwnPosition(current.card)};
  boardHost.addEventListener('pointerup',end);boardHost.addEventListener('pointercancel',end);
}

async function refreshSpatial(){
  try{entryStatus=await getEntryStatus(client);activationState=entryStatus.community_activation_state||null}catch{entryStatus=null;activationState=null}
  updateSlotControl();
  await loadPositions();placeCards();
  if(cameraIntent==='auto')requestAnimationFrame(()=>fitActiveContent());
}

function scheduleSpatialRefresh(){clearTimeout(renderTimer);renderTimer=setTimeout(()=>refreshSpatial(),140)}

async function init(){
  installShell();installPanZoom();installOwnDrag();
  await refreshSpatial();requestAnimationFrame(()=>fitActiveContent());
  if(boardHost){const observer=new MutationObserver(scheduleSpatialRefresh);observer.observe(boardHost,{childList:true})}
  window.addEventListener('dc:board-projections-updated',()=>{placeCards();if(cameraIntent==='auto')requestAnimationFrame(()=>fitActiveContent())});
  window.addEventListener('dc:board-filter-changed',()=>{placeCards();if(cameraIntent==='auto')requestAnimationFrame(()=>fitActiveContent())});
  window.addEventListener('resize',()=>{placeCards();if(cameraIntent==='auto')fitActiveContent();else applyCamera()},{passive:true});
  window.dispatchEvent(new CustomEvent('dc:board-spatial-ready',{detail:{camera:'fit-active-content-v2'}}));
}

init().catch(error=>console.error('[DC Spatial]',error));