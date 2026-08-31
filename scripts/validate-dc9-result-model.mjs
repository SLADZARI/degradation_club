#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const passes=[];
const fail=msg=>errors.push(msg);
const pass=msg=>passes.push(msg);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

const EXPECTED=[
  ['personality','Личность','01-personality.svg'],
  ['work','Работа','02-work.svg'],
  ['consumption','Потребление','03-consumption.svg'],
  ['relationships','Отношения','04-relationships.svg'],
  ['control','Контроль','05-control.svg'],
  ['information','Информация','06-information.svg'],
  ['self_development','Саморазвитие','07-self-development.svg'],
  ['meaning','Смысл','08-meaning.svg'],
  ['technology','Технологии','09-technology.svg']
];

for(const file of ['community-runtime-v1.js','join/result/result-model-v1.js','join/result/result.js','join/result/index.html','join/result/result.css','join/index.html']){
  if(!exists(file))fail(`missing ${file}`);
}

if(!errors.length){
  const runtime=read('community-runtime-v1.js');
  const model=read('join/result/result-model-v1.js');
  const resultJs=read('join/result/result.js');
  const resultHtml=read('join/result/index.html');
  const resultCss=read('join/result/result.css');
  const join=read('join/index.html');

  for(const [id,title,icon] of EXPECTED){
    if(!runtime.includes(`['${id}','${title}']`))fail(`runtime missing canonical sphere ${id} / ${title}`);
    if(!model.includes(`id:'${id}'`)||!model.includes(`title:'${title}'`))fail(`result model missing ${id} / ${title}`);
    if(!model.includes(`/assets/dc9-icons/${icon}`))fail(`result model missing icon mapping ${icon}`);
    if(!exists(`assets/dc9-icons/${icon}`))fail(`missing icon asset ${icon}`);
  }

  const modelIds=[...model.matchAll(/\{id:'([^']+)'/g)].map(m=>m[1]);
  if(JSON.stringify(modelIds)!==JSON.stringify(EXPECTED.map(x=>x[0])))fail(`result model order mismatch: ${modelIds.join(', ')}`);
  else pass('canonical 9-sphere model order');

  const quipBlocks=[...model.matchAll(/quips:\[(.*?)\]\}/gs)].map(m=>m[1]);
  if(quipBlocks.length!==9)fail(`expected 9 quip arrays, got ${quipBlocks.length}`);
  for(let i=0;i<quipBlocks.length;i++){
    const count=[...quipBlocks[i].matchAll(/'(?:\\'|[^'])*'/g)].length;
    if(count!==6)fail(`${EXPECTED[i]?.[0]||i}: expected 6 level quips, got ${count}`);
  }
  if(quipBlocks.length===9&&!errors.some(e=>e.includes('level quips')))pass('54 sphere-level editorial quips');

  if(!runtime.includes("value=>String(value||'')==='self-development'?'self_development'"))fail('runtime lacks legacy self-development canonicalization');
  else pass('runtime legacy sphere alias');
  if(!join.includes("db.results?.['self-development']")||!join.includes('db.results.self_development'))fail('join localStorage migration for self-development missing');
  else pass('join localStorage legacy migration');
  if(!join.includes("self_development:{n:'07'"))fail('join questionnaire does not use canonical self_development key');
  else pass('join questionnaire canonical sphere key');
  if(!join.includes("location.assign('/join/result/')"))fail('9/9 completion does not route to /join/result/');
  else pass('9/9 result route');

  if(!resultJs.includes('presentationProminence(items)'))fail('result presentation prominence not wired');
  if(!resultJs.includes('tagLevels')||!resultJs.includes('intent:')||!resultJs.includes('responsibility:'))fail('result page does not read factual detail fields');
  else pass('result factual detail fields');
  if(!resultJs.includes("state.completed.length")||!resultJs.includes("'/join/member/'")||!resultJs.includes("'/community/board/'"))fail('Community result gate routes incomplete');
  else pass('result → membership/board gate routes');

  if(/СРЕДНИЙ УРОВЕНЬ|average|avg\s*=/.test(resultJs+resultHtml))fail('result page introduces aggregate/average score');
  else pass('no aggregate score on final result page');
  if(/СТРУКТУРНО НЕСТАБИЛ|психотип/i.test(resultJs+resultHtml+model))fail('aggregate psychotype language found in result implementation');
  else pass('no aggregate psychotype');

  if(!resultHtml.includes('id="downloadDossier"')||!resultHtml.includes('id="shareDossier"'))fail('dossier actions missing');
  else pass('dossier download/share controls');
  if(!resultJs.includes('navigator.canShare')||!resultJs.includes("canvas.toBlob"))fail('share/download PNG implementation incomplete');
  else pass('PNG + Web Share implementation');

  for(const bp of ['980px','560px'])if(!resultCss.includes(`max-width:${bp}`))fail(`result responsive breakpoint ${bp} missing`);
  if(!resultCss.includes('prefers-reduced-motion:reduce'))fail('reduced-motion support missing');
  else pass('reduced-motion support');
}

for(const msg of passes)console.log('PASS',msg);
if(errors.length){
  console.error(`\nDC-9 RESULT VALIDATION FAILED (${errors.length})`);
  for(const msg of errors)console.error('FAIL',msg);
  process.exit(1);
}
console.log(`\nDC-9 RESULT VALIDATION PASSED (${passes.length} checks)`);
