import {getClient,currentSession,esc} from '/community-runtime-v1.js';
import {BOARD_FILTERS,entityToBoardProjection,isProjectionVisible,matchesBoardFilter} from '/community/board/board-entity-model-v1.js';

const boardHost=document.getElementById('boardHost');
const filterHost=document.getElementById('boardFilters');
let client=null;
let activeFilter='all';
let projections=[];
let rendering=false;

function projectionClass(item){
  if(item.sourceType==='event')return 'dc-projection dc-projection--event';
  if(item.sourceType==='course')return 'dc-projection dc-projection--course';
  if(item.sourceType==='practice')return 'dc-projection dc-projection--practice';
  return 'dc-projection';
}

function statusLabel(item){
  const map={active:'ACTIVE',announced:'ANNOUNCED',registration:'REGISTRATION',planned:'PLANNED','approved-draft':'APPROVED DRAFT','mvp-in-development':'IN DEVELOPMENT'};
  return map[item.status]||String(item.status||'').toUpperCase();
}

function renderProjection(item){
  const route=item.publicRoute;
  const location=item.location?`<div class="dc-projection__line">${esc(item.location)}</div>`:'';
  const action=route?`<a class="dc-board-action small" href="${esc(route)}">ОТКРЫТЬ →</a>`:'';
  return `<article class="${projectionClass(item)}" data-board-source="platform" data-source-type="${esc(item.sourceType)}" data-forming="${item.isForming?'1':'0'}">
    <div class="dc-notice__meta"><span>DEMENTOR CLUB / ${esc(item.sourceType.toUpperCase())}</span><span>${esc(statusLabel(item))}</span></div>
    <div class="dc-projection__authority">PLATFORM PROJECTION</div>
    <h3>${esc(item.title)}</h3>
    ${item.body?`<p class="dc-notice__body">${esc(item.body)}</p>`:''}
    ${location}
    <div class="dc-notice__expiry">SOURCE / ${esc(item.sourceSystem||'dementor-club')} · ${esc(item.provenanceStatus||'')}</div>
    <div class="dc-notice__actions">${action}<span class="dc-notice__activity">${item.isForming?'ФОРМИРУЕТСЯ':'ПЛАТФОРМА'}</span></div>
  </article>`;
}

function markMemberCards(){
  boardHost?.querySelectorAll('.dc-notice:not([data-board-source])').forEach(card=>{
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
  filterHost?.querySelectorAll('[data-board-filter]').forEach(b=>b.classList.toggle('active',b.dataset.boardFilter===activeFilter));
}

function appendProjections(){
  if(!boardHost||rendering)return;
  rendering=true;
  boardHost.querySelectorAll('[data-board-source="platform"]').forEach(el=>el.remove());
  boardHost.insertAdjacentHTML('beforeend',projections.map(renderProjection).join(''));
  applyFilter();
  rendering=false;
}

function installFilters(){
  if(!filterHost)return;
  filterHost.innerHTML=BOARD_FILTERS.map(([id,label])=>`<button class="dc-board-filter${id==='all'?' active':''}" type="button" data-board-filter="${id}">${label}</button>`).join('');
  filterHost.addEventListener('click',event=>{
    const button=event.target.closest('[data-board-filter]');if(!button)return;
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
  const events=new Map((eventsResult.data||[]).map(x=>[x.entity_id,x]));
  const programs=new Map((programsResult.data||[]).map(x=>[x.entity_id,x]));
  projections=(entitiesResult.data||[])
    .map(entity=>entityToBoardProjection(entity,events.get(entity.id),programs.get(entity.id)))
    .filter(isProjectionVisible);
  appendProjections();
}

async function init(){
  installFilters();
  client=await getClient();
  try{await loadPlatformProjections()}catch(error){console.error('[DC Board integrations]',error)}
  if(boardHost){
    let timer=null;
    const observer=new MutationObserver(()=>{
      if(rendering)return;
      clearTimeout(timer);
      timer=setTimeout(()=>{markMemberCards();appendProjections()},80);
    });
    observer.observe(boardHost,{childList:true});
  }
}

init();
