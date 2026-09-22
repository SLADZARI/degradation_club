import {getClient,currentSession,esc} from '/community-runtime-v1.js';
import {BOARD_FILTERS,BOARD_VIEW_FILTERS,BOARD_SOURCE_MODES,artifactSubtypeLabel,boardProjectionThingRef,boardSourceTypeLabel,boardViewLabel,entityToBoardProjection,isBoardView,isProjectionVisible,matchesBoardFilter} from '/community/board/board-entity-model-v1.js';
import {getCurrentProgram} from '/current-program-v1.js';

const boardHost=document.getElementById('boardHost');
const filterHost=document.getElementById('boardFilters');
let client=null;
let activeView='all';
const currentProgramRefs=new Set(getCurrentProgram().map(item=>String(item.thingRef||'')).filter(Boolean));
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
  const relationAttrs=item.relationKind&&item.relationSourceId?` data-relation-kind="${esc(item.relationKind)}" data-relation-source-id="${esc(item.relationSourceId)}"`:'';
  const thingRef=boardProjectionThingRef(item);
  const inCurrentProgram=!!thingRef&&currentProgramRefs.has(thingRef);
  const badges=`<div class="dc-board-badges" aria-hidden="true"><span class="dc-board-badge">${esc(boardSourceTypeLabel(item.sourceType))}</span>${inCurrentProgram?'<span class="dc-board-badge dc-board-badge--program">В ПРОГРАММЕ</span>':''}</div>`;
  return `<article class="${projectionClass(item)}" data-board-source="platform" data-source-mode="${BOARD_SOURCE_MODES.ENTITY_PROJECTION}" data-source-id="${esc(item.sourceId)}" data-source-type="${esc(item.sourceType)}" data-thing-ref="${esc(thingRef||'')}" data-current-program="${inCurrentProgram?'1':'0'}"${relationAttrs} data-forming="${item.isForming?'1':'0'}">
    ${badges}
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
  boardHost?.querySelectorAll('.dc-notice[data-artifact]').forEach(card=>{
    card.dataset.boardSource='member';
    card.dataset.sourceMode=BOARD_SOURCE_MODES.ARTIFACT;
    card.dataset.sourceType='artifact';
    card.dataset.relationKind='artifact';
    card.dataset.relationSourceId=card.dataset.artifact||'';
    card.dataset.currentProgram='0';
    card.dataset.forming='0';
    if(!card.querySelector(':scope > .dc-board-badges')){
      const badges=document.createElement('div');
      badges.className='dc-board-badges';
      badges.setAttribute('aria-hidden','true');
      badges.innerHTML=`<span class="dc-board-badge">${esc(artifactSubtypeLabel(card.dataset.artifactSubtype))}</span>`;
      card.prepend(badges);
    }
  });
}

function visibleForView(card,item){
  if(activeView==='current-program')return card.dataset.currentProgram==='1';
  return matchesBoardFilter(item,activeView);
}

function applyView({announce=true}={}){
  markMemberCards();
  let visibleCount=0;
  boardHost?.querySelectorAll('[data-board-source]').forEach(card=>{
    const item={
      sourceMode:card.dataset.sourceMode||null,
      isMember:card.dataset.boardSource==='member',
      isPlatform:card.dataset.boardSource==='platform',
      sourceType:card.dataset.sourceType,
      isForming:card.dataset.forming==='1'
    };
    const hidden=!visibleForView(card,item);
    if(!hidden)visibleCount+=1;
    card.hidden=hidden;
    card.classList.toggle('dc-board-filtered',hidden);
    card.setAttribute('aria-hidden',hidden?'true':'false');
  });
  document.documentElement.dataset.boardView=activeView;
  filterHost?.querySelectorAll('[data-board-view]').forEach(button=>{
    const active=button.dataset.boardView===activeView;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',active?'true':'false');
  });
  const filterButton=filterHost?.querySelector('[data-board-filter-drawer]');
  if(filterButton){
    const label=boardViewLabel(activeView);
    filterButton.classList.toggle('active',activeView!=='all');
    filterButton.textContent=activeView==='all'?'ВИД':`ВИД · ${label}`;
    filterButton.setAttribute('aria-label',`Выбрать вид доски. Текущий: ${label}`);
  }
  if(announce){
    const detail={view:activeView,filter:activeView,visibleCount};
    window.dispatchEvent(new CustomEvent('dc:board-filter-changed',{detail}));
    window.dispatchEvent(new CustomEvent('dc:board-view-changed',{detail}));
    window.dispatchEvent(new CustomEvent('dc:board-layout-request'));
  }
}

function setView(next,{announce=true,close=true}={}){
  const view=String(next||'all');
  if(!isBoardView(view))return false;
  activeView=view;
  applyView({announce});
  if(close)closeDrawer();
  return true;
}

function ensureProjections(){
  if(!boardHost||rendering||!projections.length)return;
  const existing=[...boardHost.querySelectorAll('[data-board-source="platform"]')];
  if(existing.length===projections.length){applyView({announce:false});return}
  rendering=true;existing.forEach(node=>node.remove());
  boardHost.insertAdjacentHTML('beforeend',projections.map(renderProjection).join(''));
  applyView({announce:false});rendering=false;
  window.dispatchEvent(new CustomEvent('dc:board-projections-updated'));window.dispatchEvent(new CustomEvent('dc:board-layout-request'));
}

function closeDrawer({restoreFocus=false}={}){if(!drawer)return;const trigger=filterHost?.querySelector('[data-board-filter-drawer]');drawer.hidden=true;trigger?.setAttribute('aria-expanded','false');if(restoreFocus)trigger?.focus({preventScroll:true})}
function openDrawer(){if(!drawer)return;drawer.scrollTop=0;drawer.hidden=false;filterHost?.querySelector('[data-board-filter-drawer]')?.setAttribute('aria-expanded','true');(drawer.querySelector('[data-board-view].active')||drawer.querySelector('[data-board-view]'))?.focus({preventScroll:true})}
function ensureDrawer(){
  if(drawer)return drawer;
  drawer=document.createElement('div');drawer.className='dc-board-filter-drawer';drawer.hidden=true;
  drawer.innerHTML=`<div class="dc-board-filter-drawer__head"><strong>ВИД ДОСКИ</strong><button type="button" data-filter-close aria-label="Закрыть выбор вида">×</button></div><div class="dc-board-filter-drawer__grid">${BOARD_VIEW_FILTERS.map(([id,label])=>`<button class="dc-board-filter" type="button" data-board-view="${id}" data-board-detail-filter="${id}"${id==='current-program'?' data-board-program-filter':''} aria-pressed="false">${label}</button>`).join('')}</div>`;
  (window.matchMedia('(max-width:900px)').matches?document.body:filterHost)?.appendChild(drawer);
  drawer.querySelector('[data-filter-close]').onclick=()=>closeDrawer({restoreFocus:true});
  drawer.addEventListener('click',event=>{
    const button=event.target.closest('[data-board-view]');if(!button)return;
    setView(button.dataset.boardView||'all',{close:false});closeDrawer({restoreFocus:true});
  });
  return drawer;
}

function installFilters(){
  if(!filterHost)return;
  filterHost.innerHTML=BOARD_FILTERS.map(([id,label])=>`<button class="dc-board-filter${id==='all'?' active':''}" type="button" data-board-view="${id}" data-board-filter="${id}" aria-pressed="${id==='all'?'true':'false'}">${label}</button>`).join('')+`<button class="dc-board-filter" type="button" data-board-filter-drawer aria-expanded="false" aria-label="Выбрать вид доски. Текущий: ВСЁ">ВИД</button>`;
  ensureDrawer();
  filterHost.addEventListener('click',event=>{
    const drawerButton=event.target.closest('[data-board-filter-drawer]');if(drawerButton){drawer?.hidden?openDrawer():closeDrawer();return}
    const button=event.target.closest('[data-board-view]');if(!button)return;
    setView(button.dataset.boardView||'all');
  });
}

function installViewRequests(){
  window.addEventListener('dc:board-request-view',event=>{
    setView(event.detail?.view||'all',{close:false});
  });
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
  installViewRequests();
  client=getClient();
  try{await loadPlatformProjections()}catch(error){console.error('[DC Board integrations]',error)}
  if(boardHost){let timer=null;const observer=new MutationObserver(()=>{if(rendering)return;clearTimeout(timer);timer=setTimeout(()=>{markMemberCards();ensureProjections();applyView({announce:false});window.dispatchEvent(new CustomEvent('dc:board-layout-request'))},80)});observer.observe(boardHost,{childList:true})}
}
init();
