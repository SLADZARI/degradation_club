import {getClient,currentSession,BOARD_DETAIL_FILTERS,BOARD_FILTERS,matchesBoardFilter} from './board-runtime-v1.js';

const boardHost=document.getElementById('boardHost');
const filterHost=document.getElementById('boardFilters');
let client=null;let projections=[];let rendering=false;let activeFilter='all';let drawer=null;

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function entityToBoardProjection(entity,event,program){
  if(entity.entity_type==='event')return{source:'platform',sourceType:'event',sourceId:entity.id,title:entity.title,body:entity.summary||'',status:entity.status||'',meta:[event?.location,event?.capacity?`${event.capacity} мест`:null].filter(Boolean).join(' · '),href:entity.slug?`/events/${entity.slug}/`:null};
  if(entity.entity_type==='program')return{source:'platform',sourceType:'program',sourceId:entity.id,title:entity.title,body:program?.content_summary||entity.summary||'',status:entity.status||'',meta:[program?.program_type,program?.delivery_mode].filter(Boolean).join(' · '),href:entity.slug?`/projects/${entity.slug}/`:null};
  if(entity.entity_type==='project')return{source:'platform',sourceType:'project',sourceId:entity.id,title:entity.title,body:entity.summary||'',status:entity.status||'',meta:'ПРОЕКТ',href:entity.slug?`/projects/${entity.slug}/`:null};
  if(entity.entity_type==='product')return{source:'platform',sourceType:'product',sourceId:entity.id,title:entity.title,body:entity.summary||'',status:entity.status||'',meta:'ПРОДУКТ',href:entity.slug?`/merch/${entity.slug}/`:null};
  if(entity.entity_type==='content')return{source:'platform',sourceType:'content',sourceId:entity.id,title:entity.title,body:entity.summary||'',status:entity.status||'',meta:'КОНТЕНТ',href:entity.slug?`/content/${entity.slug}/`:null};
  return null;
}
function isProjectionVisible(item){return item&&item.title&&item.status!=='removed'}
function renderProjection(item){return`<article class="dc-projection" data-board-source="platform" data-source-type="${escapeHtml(item.sourceType)}" data-source-id="${escapeHtml(item.sourceId)}" data-status="${escapeHtml(item.status)}"><div class="dc-notice__meta"><span>${escapeHtml(item.meta||item.sourceType.toUpperCase())}</span><span>${escapeHtml(item.status||'')}</span></div><h3>${escapeHtml(item.title)}</h3>${item.body?`<p class="dc-notice__body">${escapeHtml(item.body)}</p>`:''}${item.href?`<a class="dc-board-open-hint" href="${escapeHtml(item.href)}">ОТКРЫТЬ →</a>`:''}</article>`}
function markMemberCards(){boardHost?.querySelectorAll('.dc-notice[data-artifact]').forEach(card=>{card.dataset.boardSource='artifact';card.dataset.sourceType='artifact';card.dataset.sourceId=card.dataset.artifact||''})}
function applyFilter({announce=true}={}){
  if(!boardHost)return;
  markMemberCards();
  [...boardHost.querySelectorAll('.dc-notice[data-artifact],.dc-projection[data-board-source="platform"]')].forEach(card=>{
    const item=card.matches('.dc-notice[data-artifact]')?{source:'artifact',sourceType:'artifact',artifactType:card.dataset.artifactType||'announcement'}:{source:'platform',sourceType:card.dataset.sourceType||''};
    const hidden=!matchesBoardFilter(item,activeFilter);
    card.hidden=hidden;
    card.classList.toggle('dc-board-filtered',hidden);
    card.setAttribute('aria-hidden',hidden?'true':'false');
  });
  filterHost?.querySelectorAll('[data-board-filter]').forEach(button=>button.classList.toggle('active',button.dataset.boardFilter===activeFilter));
  drawer?.querySelectorAll('[data-board-detail-filter]').forEach(button=>button.classList.toggle('active',button.dataset.boardDetailFilter===activeFilter));
  const filterButton=filterHost?.querySelector('[data-board-filter-drawer]');
  if(filterButton)filterButton.classList.toggle('active',BOARD_DETAIL_FILTERS.some(([id])=>id===activeFilter));
  if(announce){window.dispatchEvent(new CustomEvent('dc:board-filter-changed',{detail:{filter:activeFilter}}));window.dispatchEvent(new CustomEvent('dc:board-layout-request'))}
}

function ensureProjections(){
  if(!boardHost||rendering||!projections.length)return;
  const existing=[...boardHost.querySelectorAll('[data-board-source="platform"]')];
  if(existing.length===projections.length){applyFilter({announce:false});return}
  rendering=true;existing.forEach(node=>node.remove());
  boardHost.insertAdjacentHTML('beforeend',projections.map(renderProjection).join(''));
  applyFilter({announce:false});rendering=false;
  window.dispatchEvent(new CustomEvent('dc:board-projections-updated'));window.dispatchEvent(new CustomEvent('dc:board-layout-request'));
}

function closeDrawer(){if(!drawer)return;drawer.hidden=true;filterHost?.querySelector('[data-board-filter-drawer]')?.setAttribute('aria-expanded','false')}
function openDrawer(){if(!drawer)return;drawer.scrollTop=0;drawer.hidden=false;filterHost?.querySelector('[data-board-filter-drawer]')?.setAttribute('aria-expanded','true');drawer.querySelector('[data-board-detail-filter]')?.focus({preventScroll:true})}
function ensureDrawer(){
  if(drawer)return drawer;
  drawer=document.createElement('div');drawer.className='dc-board-filter-drawer';drawer.hidden=true;
  drawer.innerHTML=`<div class="dc-board-filter-drawer__head"><strong>ТИП ОБЪЕКТА</strong><button type="button" data-filter-close aria-label="Закрыть фильтры">×</button></div><div class="dc-board-filter-drawer__grid">${BOARD_DETAIL_FILTERS.map(([id,label])=>`<button class="dc-board-filter" type="button" data-board-detail-filter="${id}">${label}</button>`).join('')}</div>`;
  // Viewport-owned sheet: keep the canonical drawer outside Workspace/Board stacking
  // contexts so neither the top navigation nor the fixed Board controls can steal taps.
  document.body.appendChild(drawer);
  drawer.querySelector('[data-filter-close]').onclick=closeDrawer;
  drawer.addEventListener('click',event=>{const button=event.target.closest('[data-board-detail-filter]');if(!button)return;activeFilter=button.dataset.boardDetailFilter||'all';applyFilter();closeDrawer()});
  return drawer;
}

function installFilters(){
  if(!filterHost)return;
  filterHost.innerHTML=BOARD_FILTERS.map(([id,label])=>`<button class="dc-board-filter${id==='all'?' active':''}" type="button" data-board-filter="${id}">${label}</button>`).join('')+`<button class="dc-board-filter" type="button" data-board-filter-drawer aria-expanded="false">ТИПЫ</button>`;
  ensureDrawer();
  filterHost.addEventListener('click',event=>{
    const drawerButton=event.target.closest('[data-board-filter-drawer]');if(drawerButton){drawer?.hidden?openDrawer():closeDrawer();return}
    const button=event.target.closest('[data-board-filter]');if(!button)return;activeFilter=button.dataset.boardFilter||'all';applyFilter();closeDrawer();
  });
}

function installOwnLocatorFilterBridge(){
  document.addEventListener('click',event=>{
    if(!event.target.closest?.('[data-mine]')||activeFilter==='artifact')return;
    activeFilter='artifact';applyFilter();closeDrawer();
  },true);
}

async function loadPlatformProjections(){
  const session=await currentSession();if(!session)return;
  const {data,error}=await client.rpc('dc_board_entity_projection_read_v1');
  if(error)throw error;
  projections=(data||[]).map(row=>{
    const entity={id:row.entity_id,entity_type:row.entity_type,slug:row.slug,title:row.title,status:row.status,summary:row.summary,source_system:row.source_system,provenance_status:row.provenance_status};
    const event=row.entity_type==='event'?{location:row.event_location,capacity:row.event_capacity}:null;
    const program=row.entity_type==='program'?{program_type:row.program_type,delivery_mode:row.delivery_mode,content_summary:row.content_summary}:null;
    return entityToBoardProjection(entity,event,program);
  }).filter(isProjectionVisible);
  ensureProjections();
}

async function init(){
  installFilters();
  installOwnLocatorFilterBridge();
  client=getClient();
  try{await loadPlatformProjections()}catch(error){console.error('[DC Board integrations]',error)}
  if(boardHost){let timer=null;const observer=new MutationObserver(()=>{if(rendering)return;clearTimeout(timer);timer=setTimeout(()=>{markMemberCards();ensureProjections();applyFilter({announce:false});window.dispatchEvent(new CustomEvent('dc:board-layout-request'))},80)});observer.observe(boardHost,{childList:true})}
}

init().catch(error=>console.error('[DC Board integrations]',error));
