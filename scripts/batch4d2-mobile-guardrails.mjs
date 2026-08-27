import fs from 'node:fs';

const uiPath='ui-v2.css';
const stylesPath='styles.css';
const guardPath='mobile-guardrails.css';

let ui=fs.readFileSync(uiPath,'utf8');
ui=ui.replace("@import url('/mobile-overflow-fix.css');\n",'');
ui=ui.replace("@import url('/mobile-qa.css');\n",'');
fs.writeFileSync(uiPath,ui);

let styles=fs.readFileSync(stylesPath,'utf8');
if(!styles.includes("@import url('/mobile-guardrails.css');")){
  styles=styles.replace("@import url('/visual-standard-v2.css');\n","@import url('/visual-standard-v2.css');\n@import url('/mobile-guardrails.css');\n");
}
fs.writeFileSync(stylesPath,styles);

const guard=`/* Dementor Club — canonical mobile structural guardrails.\n   Scope: viewport safety only. Typography scale and component geometry stay with their owners. */\n@media(max-width:768px){\n  html,body{width:100%;max-width:100%;overflow-x:clip}\n  *,*::before,*::after{min-width:0;box-sizing:border-box}\n  img,video,canvas,svg{max-width:100%}\n  main,header,footer,section,figure,.dc-shell,.dc-grid,.dc-entity-hero,.dc-page-hero,.dc-about-hero{max-width:100%;min-width:0}\n  .dc-display-xl,.dc-display-l,.dc-hero__title,.dc-about-hero__title,.dc-project-hero__title,.dc-entity-hero__title,.dc-event__title,.dc-about-manifesto__title,.dc-about-service__title,.dc-about-dementor__title,.dc-event-lock__title{max-width:100%;min-width:0;overflow-wrap:normal;word-break:normal;hyphens:none}\n  .dc-index-row,.dc-entity-row{max-width:100%}\n  .dc-action{min-height:48px}\n  .menu-toggle{min-width:54px;min-height:44px}\n}\n@media(max-width:700px){\n  .dc-pressure,.dc-type-mutation{max-width:100%;transform:none}\n  .dc-home #project-title{transform:none}\n  .dc-home .dc-ink-slot--home{width:100%;margin-left:0;margin-right:0;transform:rotate(-.35deg);transform-origin:center center}\n  h1,h2,h3,blockquote,.dc-sphere__name,.dc-index-row__title{max-width:100%;min-width:0}\n  .dc-notice{width:100%;max-width:100%;overflow:hidden}\n}\n`;
fs.writeFileSync(guardPath,guard);

for(const legacy of ['mobile-qa.css','mobile-overflow-fix.css']){
  if(fs.existsSync(legacy)) fs.rmSync(legacy);
}
console.log('Batch 4D.2 mobile guardrail consolidation applied');
