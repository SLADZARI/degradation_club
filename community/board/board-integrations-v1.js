import {getClient,currentSession,esc} from '/community-runtime-v1.js';
import {BOARD_FILTERS,BOARD_DETAIL_FILTERS,BOARD_SOURCE_MODES,entityToBoardProjection,isProjectionVisible,matchesBoardFilter} from '/community/board/board-entity-model-v1.js';

const boardHost=document.getElementById('boardHost');
const filterHost=document.getElementById('boardFilters');
let client=null;
let activeFilter='all';
let projections=[];
let rendering=false;
let drawer=null;

function projectionClass(item){
  const classes=['dc-projection'];
  if(item.sourceType==='event')classes.push('dc-projection--event');
  if(item.sourceType==='course')classes.push('dc-projection--course');
  if(item.sourceType==='practice')classes.push('dc-projection--practice');
  if(item.isForming)classes.push('is-forming');
  return classes.join(' ');
}

function statusLabel(item){
  const map={active:'ACTIVE',announced:'ANNOUNCED',registration:'REGISTRATION',planned:'PLANNED','approved-draft':'FORMING / APPROVED','mvp-in-development':'IN DEVELOPMENT'};
  return map[item.status]||String(item.status||'').toUpperCase();
}

function renderProjection(item){
  const route=item.publicRoute;
  const location=item.location?`<div class="dc-projection__line" dir="auto">${esc(item.location)}</div>`:'';
  const action=route?`<a class="dc-board-action small" href="${esc(route)}">ОТКРЫТЬ →</a>`:'';
  return `<article class="${projectionClass(item)}" data-board-source="platform" data-source-mode="${BOARD_SOURCE_MODES.ENTITY_PROJECTION}" data-source-id="${esc(item.sourceId)}" data-source-type="${esc(item.sourceType)}" data-forming="${item.isForming?'1':'0'}">
    <div class="dc-notice__meta"><span>DEMENTOR CLUB / ${esc(item.sourceType.toUpperCase())}</span><span>${esc(statusLabel(item))}</span></div>
    <div class="dc-projection__authority">CLUB / OFFICIAL</div>
    <h3 dir="auto">${esc(item.title)}</h3>
    ${item.body?`<p class="dc-notice__body" dir="auto">${esc(item.body)}</p>`:''}
    ${location}
    <div class="dc-notice__expiry">SOURCE / ${esc(item.sourceSystem||'dementor-club')} · ${esc(item.provenanceStatus||'')}</div>
    <div class="dc-notice__actions">${action}<span class="dc-notice__activity">${esc(statusLabel(item))}</span></div>
  </article>`;
}

function markMemberCards(){
  boardHost?.querySelectorAll('.dc-notice[data-artifact]:not([data-board-source])').forEach(card=>{
    card.dataset.boardSource='member';
    card.dataset.sourceMode=BOARD_SOURCE_MODES.ARTIFACT;
    card.dataset.sourceType='artifact';
    card.dataset.forming='0';
  });
}

function applyFilter({announce=true}={}){
  markMemberCards();
  boardHost?.querySelectorAll('[data-board-source]').forEach(card=>{
    const item={
      sourceMode:card.dataset.sourceMode||null,
      isMember:card.dataset.boardSource==='member',
      isPlatform:card.dataset.boardSource==='platform',
      sourceType:card.dataset.sourceType,
      isForming:card.dataset.forming==='1'
    };
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
function openDrawer(){if(!drawer)return;drawer.hidden=false;filterHost?.querySelector('[data-board-filter-drawer]')?.setAttribute('aria-expanded','true');drawer.querySelector('[data-board-detail-filter]')?.focus({preventScroll:true})}
function ensureDrawer(){
  if(drawer)return drawer;
  drawer=document.createElement('div');drawer.className='dc-board-filter-drawer';drawer.hidden=true;
  drawer.innerHTML=`<div class="dc-board-filter-drawer__head"><strong>ТИП ОБЪЕКТА</strong><button type="button" data-filter-close aria-label="Закрыть фильтры">×</button></div><div class="dc-board-filter-drawer__grid">${BOARD_DETAIL_FILTERS.map(([id,label])=>`<button class="dc-board-filter" type="button" data-board-detail-filter="${id}">${label}</button>`).join('')}</div>`;
  filterHost?.appendChild(drawer);
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
init();
