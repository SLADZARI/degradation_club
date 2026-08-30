export const BOARD_SOURCE_MODES={
  ARTIFACT:'artifact',
  ENTITY_PROJECTION:'entity_projection',
  SYSTEM:'system'
};

export const BOARD_FILTERS=[
  ['all','ВСЁ'],
  ['member','УЧАСТНИКИ'],
  ['platform','ПЛАТФОРМА'],
  ['event','МЕРОПРИЯТИЯ'],
  ['program','ПРОГРАММЫ'],
  ['course','КУРСЫ'],
  ['practice','ПРАКТИКИ'],
  ['forming','ФОРМИРУЕТСЯ'],
  ['project','ПРОЕКТЫ']
];

const ACTIVEISH=new Set(['active','announced','registration','planned','approved-draft','mvp-in-development']);
const FORMING=new Set(['planned','approved-draft','mvp-in-development']);

export function entityToBoardProjection(entity,event,program){
  const entityType=entity.entity_type;
  const programType=program?.program_type||null;
  const isEvent=entityType==='event';
  const isProgram=entityType==='program';
  const kind=isEvent?'event':programType==='course'?'course':programType==='practice'?'practice':isProgram?'program':entityType;
  const status=String(entity.status||'').toLowerCase();
  const isForming=FORMING.has(status);
  return {
    id:`entity:${entity.id}`,
    sourceMode:BOARD_SOURCE_MODES.ENTITY_PROJECTION,
    sourceType:kind,
    sourceId:entity.id,
    slug:entity.slug,
    title:entity.title,
    body:entity.summary||program?.content_summary||'',
    status,
    location:event?.location||null,
    provenanceStatus:entity.provenance_status||null,
    sourceSystem:entity.source_system||null,
    programType,
    deliveryMode:program?.delivery_mode||null,
    isForming,
    isPlatform:true,
    isMember:false,
    publicRoute:routeForEntity(entity)
  };
}

export function routeForEntity(entity){
  if(entity.entity_type==='event')return `/events/${entity.slug}/`;
  // Current site exposes all program families (course / practice / experience)
  // under /courses/:slug/. Board projections follow the implemented route,
  // while sourceType still preserves the semantic subtype for filtering.
  if(entity.entity_type==='program')return `/courses/${entity.slug}/`;
  if(entity.entity_type==='project')return `/projects/${entity.slug}/`;
  return null;
}

export function isProjectionVisible(p){
  return p.provenanceStatus==='confirmed' && ACTIVEISH.has(p.status);
}

export function matchesBoardFilter(item,filter){
  if(filter==='all')return true;
  if(filter==='member')return item.isMember===true;
  if(filter==='platform')return item.isPlatform===true;
  if(filter==='event')return item.sourceType==='event';
  if(filter==='program')return ['program','course','practice'].includes(item.sourceType);
  if(filter==='course')return item.sourceType==='course';
  if(filter==='practice')return item.sourceType==='practice';
  if(filter==='forming')return item.isForming===true;
  if(filter==='project')return item.sourceType==='project';
  return true;
}
