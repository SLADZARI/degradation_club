#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const fail=[];
const expected=['personality','work','consumption','relationships','control','information','self_development','meaning','technology'];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));

for(const file of ['join/result/index.html','join/result/result.css','join/result/result.js','join/result/result-model-v1.js','community-runtime-v1.js','join-storage-guard.js'])if(!exists(file))fail.push(`missing ${file}`);

if(exists('join/result/result-model-v1.js')){
  const model=read('join/result/result-model-v1.js');
  const ids=[...model.matchAll(/\{id:'([^']+)'/g)].map(m=>m[1]);
  if(JSON.stringify(ids)!==JSON.stringify(expected))fail.push(`result model sphere order mismatch: ${ids.join(', ')}`);
  const icons=[...model.matchAll(/icon:'([^']+)'/g)].map(m=>m[1].replace(/^\//,''));
  for(const icon of icons)if(!exists(icon))fail.push(`missing DC9 icon ${icon}`);
  if(!model.includes('presentationProminence'))fail.push('presentation prominence helper missing');
}

if(exists('community-runtime-v1.js')){
  const runtime=read('community-runtime-v1.js');
  for(const id of expected)if(!runtime.includes(`['${id}'`))fail.push(`community runtime missing ${id}`);
  if(!runtime.includes("'self-development'?'self_development'"))fail.push('legacy self-development alias missing in community runtime');
}

if(exists('join-storage-guard.js')){
  const guard=read('join-storage-guard.js');
  if(!guard.includes("db.results['self-development']")||!guard.includes('db.results.self_development'))fail.push('localStorage legacy/canonical self-development bridge missing');
}

if(exists('join/result/result.js')){
  const js=read('join/result/result.js');
  if(!js.includes("from '/community-runtime-v1.js'"))fail.push('result page is not using Community/DC9 runtime');
  if(!js.includes("from '/join/result/result-model-v1.js'"))fail.push('result page is not using canonical result model');
  if(!js.includes('tagLevels'))fail.push('result page ignores tagLevels');
  if(!js.includes('intent')||!js.includes('responsibility'))fail.push('result page ignores diagnostic guard axes');
  if(!js.includes("route('/join/member/')"))fail.push('result page does not route completed non-member to /join/member/');
}

if(exists('join/result/index.html')){
  const html=read('join/result/index.html');
  for(const phrase of ['СТРУКТУРНО НЕСТАБИЛЕН','ПОТЕНЦИАЛЬНО ОПАСЕН','ОБЩИЙ УРОВЕНЬ ДЕМЕНТОРА'])if(html.includes(phrase))fail.push(`forbidden aggregate result copy present: ${phrase}`);
  if(!html.includes('ЛИЧНОЕ ДОСЬЕ'))fail.push('dossier section missing');
  if(!html.includes('COMMUNITY'))fail.push('Community CTA missing');
}

if(fail.length){console.error('DC9 RESULT VALIDATION FAILED');for(const e of fail)console.error('✗',e);process.exit(1)}
console.log('DC9 RESULT VALIDATION OK');
console.log('✓ 9 canonical sphere ids');
console.log('✓ canonical icon assets');
console.log('✓ result payload tags + guards consumed');
console.log('✓ legacy self-development id bridged');
console.log('✓ no aggregate psychotype in result HTML');
console.log('✓ 9/9 → membership route preserved');
