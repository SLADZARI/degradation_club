import fs from 'node:fs';

function appendOnce(file, marker, css){
  let s=fs.readFileSync(file,'utf8');
  if(!s.includes(marker)){
    s += `\n\n/* ${marker} */\n${css.trim()}\n`;
    fs.writeFileSync(file,s);
  }
}

appendOnce('home-v1.css','BATCH7 FINAL / HOME MOBILE EVENT TITLE',`
@media(max-width:560px){
  .dc-home .dc-event__title{
    min-width:0;
    max-width:100%;
    font-size:clamp(40px,12.8vw,52px);
    line-height:.86;
    letter-spacing:-.065em;
    overflow-wrap:anywhere;
  }
}
`);

appendOnce('about-v1.css','BATCH7 FINAL / ABOUT MOBILE TEXT CONTAINMENT',`
@media(max-width:560px){
  .dc-about .dc-about-principles__head .dc-display-l{
    min-width:0;
    max-width:100%;
    font-size:clamp(34px,9.2vw,40px);
    line-height:.9;
    letter-spacing:-.055em;
    overflow-wrap:anywhere;
  }
  .dc-about .dc-pullquote{
    min-width:0;
    max-width:100%;
    font-size:clamp(30px,8.6vw,36px);
    line-height:.96;
    letter-spacing:-.045em;
    overflow-wrap:anywhere;
  }
}
`);

appendOnce('visual-standard-v2.css','BATCH7 FINAL / FUENGIROLA MOBILE CONTAINMENT',`
@media(max-width:560px){
  body.dc-fuengirola-page .dc-entity-hero__title{
    min-width:0;
    max-width:100%;
    font-size:clamp(46px,13.8vw,56px);
    line-height:.83;
    letter-spacing:-.06em;
    overflow-wrap:anywhere;
  }
  body.dc-fuengirola-page .dc-pullquote{
    min-width:0;
    max-width:100%;
    font-size:clamp(30px,8.6vw,36px);
    line-height:.96;
    letter-spacing:-.045em;
    overflow-wrap:anywhere;
  }
  body.dc-fuengirola-page .dc-event-hero__relation,
  body.dc-fuengirola-page .dc-event-hero__relation-copy,
  body.dc-fuengirola-page .dc-event-hero__relation-copy>*{
    min-width:0;
  }
}
`);

appendOnce('design-system/ui-lab-v2.css','BATCH7 FINAL / UI LAB MOBILE CONTAINMENT',`
@media(max-width:560px){
  .dc-ui-lab .lab-shell{padding-left:16px;padding-right:16px;overflow:hidden}
  .dc-ui-lab .lab-head{grid-template-columns:1fr;gap:14px}
  .dc-ui-lab .lab-head h2,
  .dc-ui-lab .lab-subhead h3,
  .dc-ui-lab .lab-event-hero h4,
  .dc-ui-lab .lab-course-hero h4,
  .dc-ui-lab .lab-project-hero h4,
  .dc-ui-lab .lab-entity-feature h4,
  .dc-ui-lab .lab-dementor-feature h4,
  .dc-ui-lab .lab-dementor-hero h4{
    min-width:0;
    max-width:100%;
    font-size:clamp(38px,10.6vw,46px);
    line-height:.86;
    letter-spacing:-.055em;
    overflow-wrap:anywhere;
  }
  .dc-ui-lab .lab-event-hero,
  .dc-ui-lab .lab-course-hero,
  .dc-ui-lab .lab-project-hero,
  .dc-ui-lab .lab-entity-feature,
  .dc-ui-lab .lab-dementor-feature,
  .dc-ui-lab .lab-dementor-hero,
  .dc-ui-lab .lab-context-grid{
    grid-template-columns:1fr;
    min-width:0;
  }
  .dc-ui-lab .lab-relation{
    grid-template-columns:76px minmax(0,1fr);
    gap:12px;
    min-width:0;
    padding:12px;
  }
  .dc-ui-lab .lab-relation img{width:76px}
  .dc-ui-lab .lab-relation__arrow{display:none}
  .dc-ui-lab .lab-relation__copy,
  .dc-ui-lab .lab-relation__copy>*{min-width:0;max-width:100%;overflow-wrap:anywhere}
  .dc-ui-lab .lab-register-row{
    grid-template-columns:72px minmax(0,1fr) 24px;
    gap:10px;
    min-width:0;
  }
  .dc-ui-lab .lab-register-row>span:nth-of-type(2),
  .dc-ui-lab .lab-register-row__state{display:none}
  .dc-ui-lab .lab-register-row strong{
    min-width:0;
    max-width:100%;
    font-size:clamp(18px,5.4vw,24px);
    overflow-wrap:anywhere;
  }
  .dc-ui-lab .lab-lifecycle{grid-template-columns:repeat(2,minmax(0,1fr))}
  .dc-ui-lab .lab-life{min-width:0;min-height:110px;padding:10px}
  .dc-ui-lab .lab-life span,.dc-ui-lab .lab-life strong{min-width:0;overflow-wrap:anywhere}
  .dc-ui-lab .lab-preview-popover{grid-template-columns:92px minmax(0,1fr);min-width:0}
  .dc-ui-lab .lab-preview-popover img{width:92px;height:120px}
  .dc-ui-lab .lab-preview-popover__copy strong{font-size:22px;overflow-wrap:anywhere}
  .dc-ui-lab .lab-viewport-set--row{grid-template-columns:1fr}
  .dc-ui-lab .lab-frame{min-width:0;width:100%}
}
`);

// Fuengirola already has a canonical DOM relation card. Prevent the legacy relation injector
// from adding a second compact Dementor card into the same event detail hierarchy.
{
  const file='dementor-relations-v1.js';
  let s=fs.readFileSync(file,'utf8');
  const old="const add=(target,key,label,position='append')=>{if(!target||target.querySelector?.('.dc-dementor-link'))return;";
  const next="const add=(target,key,label,position='append')=>{if(!target||target.querySelector?.('.dc-dementor-link,.dc-dementor-relation,.dc-event-hero__relation'))return;";
  if(s.includes(old)){
    s=s.replace(old,next);
    fs.writeFileSync(file,s);
  }
}

console.log('Batch 7 final blocker package applied.');
