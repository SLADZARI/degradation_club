// ThingProjection Runtime v1 — thin read adapters only.
// Semantic authority: dementor-club@478521e833b5ee2eb7bfc84b22385b917043a5f5
// Program source: courses/dengi-na-veter.md
// Project identity source: projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md
// Runtime projection is not a Product/source owner, registry, repository, or mutation authority.
(function installThingProjectionV1(root){
  const DENGI_NA_VETER=Object.freeze({
    thingRef:'program:dengi-na-veter',
    title:'ДЕНЬГИ НА ВЕТЕР',
    href:'/courses/dengi-na-veter/',
    premise:'Цифровой карточечный курс о логике трат и необходимости рационально объяснять каждую покупку.',
    currentTruth:'Курс готов к прохождению.'
  });

  const DEMENTOR_LAB=Object.freeze({
    thingRef:'project:dementor-lab',
    title:'DEMENTOR LAB',
    href:'/projects/dementor-lab/'
  });

  const clone=projection=>({...projection});
  Object.defineProperty(root,'readDengiNaVeterThingProjection',{value:()=>clone(DENGI_NA_VETER),writable:false,configurable:false});
  Object.defineProperty(root,'readDementorLabThingProjection',{value:()=>clone(DEMENTOR_LAB),writable:false,configurable:false});
})(globalThis);
