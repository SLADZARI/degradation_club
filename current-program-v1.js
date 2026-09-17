import '/thing-projection-v1.js';

export const CURRENT_PROGRAM_VERSION='v0';

const readDengiNaVeter=globalThis.readDengiNaVeterThingProjection;
const readDementorLab=globalThis.readDementorLabThingProjection;
if(typeof readDengiNaVeter!=='function'||typeof readDementorLab!=='function')throw new Error('ThingProjection Runtime v1 adapters missing');

const PROGRAM=Object.freeze([
  Object.freeze({
    ...readDengiNaVeter(),
    sourceKind:'program',
    stateLabel:'КУРС / МОЖНО ПРОЙТИ',
    actionLabel:'ПРОЙТИ КУРС',
    analyticsId:'dengi-na-veter'
  }),
  Object.freeze({
    ...readDementorLab(),
    sourceKind:'project',
    stateLabel:'ПРОЕКТ / СЕЙЧАС МУТЯТ',
    premise:'Проект о причинно-следственных мозгах: меняем внутреннюю схему и смотрим, как из неё получается другое поведение.',
    currentTruth:'Публичная презентация проекта доступна. Публичный playable release пока не заявлен.',
    actionLabel:'ПОСМОТРЕТЬ LAB',
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
    analyticsId:'fuengirola'
  })
]);

export function getCurrentProgram(){
  return PROGRAM.map(item=>({...item}));
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
