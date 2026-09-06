import {getClient,currentSession} from '/community-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const client=getClient();
const WORLD={w:5000,h:3500};
const GAP=34;
let persisted=new Set();
let timer=null;

function rectFor(card,x=parseFloat(card.style.left)||0,y=parseFloat(card.style.top)||0){
  const w=Math.max(card.offsetWidth||0,220),h=Math.max(card.offsetHeight||0,140);
  return {x,y,w,h,right:x+w,bottom:y+h};
}
function overlaps(a,b,gap=GAP){return !(a.right+gap<=b.x||b.right+gap<=a.x||a.bottom+gap<=b.y||b.bottom+gap<=a.y)}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function candidatePositions(origin){
  const out=[origin];
  for(let ring=1;ring<=9;ring++){
    const radius=ring*150;
    const steps=Math.max(8,ring*8);
    for(let i=0;i<steps;i++){
      const angle=(Math.PI*2*i)/steps;
      out.push({x:origin.x+Math.cos(angle)*radius,y:origin.y+Math.sin(angle)*radius});
    }
  }
  return out;
}
function movable(card){
  if(card.dataset.boardSource==='platform')return true;
  const id=card.dataset.artifact;
  return Boolean(id&&!persisted.has(id));
}
function visibleCards(){return [...(boardHost?.querySelectorAll('.dc-notice[data-artifact],[data-board-source="platform"]')||[])].filter(card=>!card.hidden&&getComputedStyle(card).display!=='none')}
function resolveLayout(){
  if(!boardHost)return;
  const cards=visibleCards();
  const occupied=[];
  const fixed=cards.filter(card=>!movable(card));
  fixed.forEach(card=>occupied.push(rectFor(card)));
  const moving=cards.filter(movable);
  moving.forEach(card=>{
    const origin={x:parseFloat(card.style.left)||2500,y:parseFloat(card.style.top)||1750};
    const w=Math.max(card.offsetWidth||0,220),h=Math.max(card.offsetHeight||0,140);
    const candidates=candidatePositions(origin);
    let chosen=null;
    for(const candidate of candidates){
      const x=clamp(candidate.x,40,WORLD.w-w-40),y=clamp(candidate.y,40,WORLD.h-h-40);
      const box={x,y,w,h,right:x+w,bottom:y+h};
      if(!occupied.some(other=>overlaps(box,other))){chosen=box;break}
    }
    if(!chosen){const x=clamp(origin.x,40,WORLD.w-w-40),y=clamp(origin.y,40,WORLD.h-h-40);chosen={x,y,w,h,right:x+w,bottom:y+h}}
    card.style.left=`${chosen.x}px`;card.style.top=`${chosen.y}px`;card.dataset.layoutV2='collision';occupied.push(chosen);
  });
  window.dispatchEvent(new CustomEvent('dc:board-layout-updated'));
}
function schedule(){clearTimeout(timer);timer=setTimeout(resolveLayout,120)}
async function loadPersisted(){
  const session=await currentSession(client);if(!session)return;
  const result=await client.from('dc_artifact_board_positions').select('artifact_id').eq('board_id','community');
  if(!result.error)persisted=new Set((result.data||[]).map(row=>row.artifact_id));
}
async function init(){
  await loadPersisted();schedule();
  window.addEventListener('dc:board-projections-updated',schedule);
  window.addEventListener('dc:board-layout-request',schedule);
  window.addEventListener('dc:board-filter-changed',schedule);
  if(boardHost)new MutationObserver(schedule).observe(boardHost,{childList:true});
  window.addEventListener('resize',schedule,{passive:true});
}
init().catch(error=>console.warn('[DC Board Layout v2]',error));
