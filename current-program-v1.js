export const CURRENT_PROGRAM_VERSION='v0';

const PROGRAM=Object.freeze([
  Object.freeze({
    thingRef:'program:dengi-na-veter',
    sourceKind:'program',
    title:'ДЕНЬГИ НА ВЕТЕР',
    stateLabel:'КУРС / МОЖНО ПРОЙТИ',
    premise:'Цифровой карточечный курс о логике трат и необходимости рационально объяснять каждую покупку.',
    currentTruth:'Курс готов к прохождению.',
    actionLabel:'ПРОЙТИ КУРС',
    href:'/courses/dengi-na-veter/',
    analyticsEvent:'course_open',
    analyticsType:'course',
    analyticsId:'dengi-na-veter'
  }),
  Object.freeze({
    thingRef:'project:dementor-lab',
    sourceKind:'project',
    title:'DEMENTOR LAB',
    stateLabel:'ПРОЕКТ / СЕЙЧАС МУТЯТ',
    premise:'Проект о причинно-следственных мозгах: меняем внутреннюю схему и смотрим, как из неё получается другое поведение.',
    currentTruth:'Публичная презентация проекта доступна. Публичный playable release пока не заявлен.',
    actionLabel:'ПОСМОТРЕТЬ LAB',
    href:'/projects/dementor-lab/',
    analyticsEvent:'project_open',
    analyticsType:'project',
    analyticsId:'dementor-lab'
  }),
  Object.freeze({
    thingRef:'event:fuengirola',
    sourceKind:'event',
    title:'ФУЭНХИРОЛА',
    stateLabel:'СОБЫТИЕ / PLANNED',
    premise:'Камерная офлайн-сессия Dementor Club в Фуэнхироле. До 7 человек. Дементор — Габиль.',
    currentTruth:'Событие запланировано. Дата, цена и открытая регистрация пока не заявлены.',
    actionLabel:'ПОСМОТРЕТЬ СОБЫТИЕ',
    href:'/events/fuengirola/',
    analyticsEvent:'event_open',
    analyticsType:'event',
    analyticsId:'fuengirola'
  })
]);

export function getCurrentProgram(){
  return PROGRAM.map(item=>({...item}));
}

export function trackCurrentProgramAction(item,placement){
  const analytics=window.DEMENTOR_ANALYTICS;
  if(!analytics||typeof analytics.track!=='function')return false;
  return analytics.track(item.analyticsEvent,{
    entity_type:item.analyticsType,
    entity_id:item.analyticsId,
    placement,
    cta_id:`current-program:${item.analyticsId}`
  });
}

export function announceCurrentProgram(surface){
  const detail={
    version:CURRENT_PROGRAM_VERSION,
    surface,
    thing_refs:PROGRAM.map(item=>item.thingRef)
  };
  window.__DC_CURRENT_PROGRAM_V0__=detail;
  window.dispatchEvent(new CustomEvent('dc:current-program-rendered',{detail}));
  return detail;
}
