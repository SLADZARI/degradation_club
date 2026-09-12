export const BOARD_SOURCE_MODES={
  ARTIFACT:'artifact',
  ENTITY_PROJECTION:'entity_projection',
  SYSTEM:'system'
};

export const ARTIFACT_SUBTYPES=Object.freeze([
  ['announcement','ОБЪЯВЛЕНИЕ'],
  ['post','ПОСТ'],
  ['idea','ИДЕЯ'],
  ['request','ЗАПРОС']
]);

export function artifactSubtypeLabel(value){
  const type=String(value||'announcement').toLowerCase();
  return ARTIFACT_SUBTYPES.find(([id])=>id===type)?.[1]||'ОБЪЯВЛЕНИЕ';
}

// Workshop 02 made ВСЁ the only required source-level control in v1.
// Object type is a separate dimension exposed by the detail filter drawer.
export const BOARD_FILTERS=[
  ['all','ВСЁ']
];

export const BOARD_DETAIL_FILTERS=[
  ['artifact','ОБЪЯВЛЕНИЯ / ПУБЛИКАЦИИ'],
  ['event','СОБЫТИЯ'],
  ['program','КУРСЫ / ПРОГРАММЫ'],
  ['practice','ПРАКТИКИ'],
  ['project','ПРОЕКТЫ / ПРОДУКТЫ'],
  ['content','СТАТЬИ / КОНТЕНТ']
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
  if(entity.entity_type==='program')return `/courses/${entity.slug}/`;
  if(entity.entity_type==='project')return `/projects/${entity.slug}/`;
  return null;
}

export function isProjectionVisible(item){
  return item.provenanceStatus==='confirmed'&&ACTIVEISH.has(item.status);
}

export function matchesBoardFilter(item,filter){
  if(filter==='all')return true;
  if(filter==='artifact')return item.sourceMode===BOARD_SOURCE_MODES.ARTIFACT||item.isMember===true||item.sourceType==='artifact';
  if(filter==='event')return item.sourceType==='event';
  if(filter==='program')return ['program','course'].includes(item.sourceType);
  if(filter==='practice')return item.sourceType==='practice';
  if(filter==='project')return ['project','product'].includes(item.sourceType);
  if(filter==='content')return ['article','content'].includes(item.sourceType);
  return true;
}
