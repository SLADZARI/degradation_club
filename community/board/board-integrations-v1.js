import {getClient,currentSession,esc} from '/community-runtime-v1.js';
import {BOARD_FILTERS,entityToBoardProjection,isProjectionVisible,matchesBoardFilter} from '/community/board/board-entity-model-v1.js';

const boardHost=document.getElementById('boardHost');
const filterHost=document.getElementById('boardFilters');
let client=null;
let activeFilter='all';
let projections=[];
let rendering=false;

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
  return `<article class="${projectionClass(item)}" data-board-source="platform" data-source-id="${esc(item.sourceId)}" data-source-type="${esc(item.sourceType)}" data-forming="${item.isForming?'1':'0'}">
    <div class="dc-notice__meta"><span>DEMENTOR CLUB / ${esc(item.sourceType.toUpperCase())}</span><span>${esc(statusLabel(item))}</span></div>
    <div class="dc-projection__authority">${item.isForming?'FORMING':'PLATFORM PROJECTION'}</div>
    <h3 dir="auto">${esc(item.title)}</h3>
    ${item.body?`<p class="dc-notice__body" dir="auto">${esc(item.body)}</p>`:''}
    ${location}
    <div class="dc-notice__expiry">SOURCE / ${esc(item.sourceSystem||'dementor-club')} · ${esc(item.provenanceStatus||'')}</div>
    <div class="dc-notice__actions">${action}<span class="dc-notice__activity">${item.isForming?'ФОРМИРУЕТСЯ':'ПЛАТФОРМА'}</span></div>
  </article>`;
}

function markMemberCards(){
  boardHost?.querySelectorAll('.dc-notice[data-artifact]:not([data-board-source])').forEach(card=>{
    card.dataset.boardSource='member';
    card.dataset.sourceType='member';
    card.dataset.forming='0';
  });
}

function applyFilter(){
  markMemberCards();
  boardHost?.querySelectorAll('[data-board-source]').forEach(card=>{
    const item={
      isMember:card.dataset.boardSource==='member',
      isPlatform:card.dataset.boardSource==='platform',
      sourceType:card.dataset.sourceType,
      isForming:card.dataset.forming==='1'
    };
    card.classList.toggle('dc-board-filtered',!matchesBoardFilter(item,activeFilter));
  });
  filterHost?.querySelectorAll('[data-board-filter]').forEach(button=>button.classList.toggle('active',button.dataset.boardFilter===activeFilter));
}

function ensureProjections(){
  if(!boardHost||rendering||!projections.length)return;
  const existing=[...boardHost.querySelectorAll('[data-board-source="platform"]')];
  if(existing.length===projections.length){applyFilter();return}
  rendering=true;
  existing.forEach(node=>node.remove());
  boardHost.insertAdjacentHTML('beforeend',projections.map(renderProjection).join(''));
  applyFilter();
  rendering=false;
  window.dispatchEvent(new CustomEvent('dc:board-projections-updated'));
}

function installFilters(){
  if(!filterHost)return;
  filterHost.innerHTML=BOARD_FILTERS.map(([id,label])=>`<button class="dc-board-filter${id==='all'?' active':''}" type="button" data-board-filter="${id}">${label}</button>`).join('');
  filterHost.addEventListener('click',event=>{
    const button=event.target.closest('[data-board-filter]');
    if(!button)return;
    activeFilter=button.dataset.boardFilter||'all';
    applyFilter();
  });
}

async function loadPlatformProjections(){
  const session=await currentSession();
  if(!session)return;
  const [entitiesResult,eventsResult,programsResult]=await Promise.all([
    client.from('dc_entities').select('id,entity_type,slug,title,status,summary,source_system,source_ref,provenance_status,confirmed_at,updated_at').eq('provenance_status','confirmed'),
    client.from('dc_events').select('entity_id,location,capacity,metadata'),
    client.from('dc_programs').select('entity_id,program_type,delivery_mode,content_summary,metadata')
  ]);
  for(const result of [entitiesResult,eventsResult,programsResult])if(result.error)throw result.error;
  const events=new Map((eventsResult.data||[]).map(item=>[item.entity_id,item]));
  const programs=new Map((programsResult.data||[]).map(item=>[item.entity_id,item]));
  projections=(entitiesResult.data||[])
    .map(entity=>entityToBoardProjection(entity,events.get(entity.id),programs.get(entity.id)))
    .filter(isProjectionVisible);
  ensureProjections();
}

async function init(){
  installFilters();
  client=getClient();
  try{await loadPlatformProjections()}catch(error){console.error('[DC Board integrations]',error)}
  if(boardHost){
    let timer=null;
    const observer=new MutationObserver(()=>{
      if(rendering)return;
      clearTimeout(timer);
      timer=setTimeout(()=>{markMemberCards();ensureProjections()},80);
    });
    observer.observe(boardHost,{childList:true});
  }
}

init();
