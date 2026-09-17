import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const readBuilt=rel=>fs.readFileSync(path.join(root,'_site',rel),'utf8');

const projection=read('thing-projection-v1.js');
const source=read('current-program-v1.js');
const home=read('index.html');
const homeRuntime=read('home-current-program-v1.js');
const board=read('workspace/board/index.html');
const boardRuntime=read('community/board/board-program-v1.js');

expect(projection.includes("thingRef:'program:dengi-na-veter'"),'Program adapter missing Dengi thingRef');
expect(projection.includes("title:'ДЕНЬГИ НА ВЕТЕР'"),'Program adapter missing Dengi title projection');
expect(projection.includes("href:'/courses/dengi-na-veter/'"),'Program adapter missing canonical Dengi route');
expect(projection.includes("premise:'Цифровой карточечный курс о логике трат и необходимости рационально объяснять каждую покупку.'"),'Program adapter missing Dengi premise projection');
expect(projection.includes("currentTruth:'Курс готов к прохождению.'"),'Program adapter missing Dengi current truth');
expect(projection.includes("thingRef:'project:dementor-lab'"),'Project adapter missing Lab thingRef');
expect(projection.includes("title:'DEMENTOR LAB'"),'Project adapter missing canonical Lab name');
expect(projection.includes("href:'/projects/dementor-lab/'"),'Project adapter missing canonical Lab route');
expect((projection.match(/thingRef:/g)||[]).length===2,'ThingProjection v1 must contain exactly the two authorized source kinds');
expect(!projection.includes('event:fuengirola'),'Event/Fuengirola must not broaden ThingProjection v1');
for(const forbidden of ['sourceKind:','stateLabel:','analyticsId:','schemaVersion:','version:','target_type','target_id','entryRef:']){
  expect(!projection.includes(forbidden),`ThingProjection core contains forbidden field ${forbidden}`);
}
for(const forbidden of ['dc_things','thing-service','thing-repository','thing-registry']){
  expect(!projection.toLowerCase().includes(forbidden),`ThingProjection introduced forbidden parallel owner ${forbidden}`);
}
expect(projection.includes('courses/dengi-na-veter.md'),'Program semantic owner reference missing');
expect(projection.includes('projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md'),'Project identity authority reference missing');
expect(projection.includes('478521e833b5ee2eb7bfc84b22385b917043a5f5'),'semantic authority SHA missing from runtime adapter');

expect(source.includes("import '/thing-projection-v1.js'"),'Current Program must load ThingProjection v1 boundary');
expect(source.includes('readDengiNaVeterThingProjection'),'Current Program must consume Program adapter');
expect(source.includes('readDementorLabThingProjection'),'Current Program must consume Project adapter');
expect(source.includes("actionLabel:'ПРОЙТИ КУРС'"),'Current Program Dengi contextual action missing');
expect(source.includes("actionLabel:'ПОСМОТРЕТЬ LAB'"),'Current Program Lab contextual action missing');
expect(source.includes("thingRef:'event:fuengirola'"),'Fuengirola Current Program composition drifted');
expect(source.includes("href:'/events/fuengirola/'"),'Fuengirola route drifted');
expect(source.includes("actionLabel:'ПОСМОТРЕТЬ СОБЫТИЕ'"),'Fuengirola action drifted');
expect((source.match(/thingRef:/g)||[]).length===1,'Only non-extracted Event may remain as literal thingRef in Current Program source');
expect(!source.includes("thingRef:'program:dengi-na-veter'"),'Current Program must not duplicate Dengi identity truth');
expect(!source.includes("thingRef:'project:dementor-lab'"),'Current Program must not duplicate Lab identity truth');
expect(!source.includes("href:'/courses/dengi-na-veter/'"),'Current Program must not duplicate Dengi canonical route');
expect(!source.includes("href:'/projects/dementor-lab/'"),'Current Program must not duplicate Lab canonical route');
expect(!source.includes('ne-komanda'),'НЕ КОМАНДА must remain excluded from Current Program v0');
expect(!source.includes('dumai-s-opasnostyu'),'Думай с опасностью must not silently enter Current Program v0');
expect(source.includes('Публичный playable release пока не заявлен'),'Dementor Lab contextual release boundary missing');
expect(source.includes('Дата, цена и открытая регистрация пока не заявлены'),'Fuengirola blocked-claims truth missing');
expect(!source.includes('trackCurrentProgramAction'),'Current Program must not duplicate canonical analytics click tracking');

expect(home.includes('id="current-program"'),'Home Current Program section missing');
expect(home.includes('id="currentProgramHost"'),'Home Current Program host missing');
expect(home.includes('/home-current-program-v1.js'),'Home Current Program runtime missing');
expect(home.includes('/current-program-v1.css'),'Home Current Program stylesheet missing');
expect(!home.includes('dc-course-prototype'),'legacy page-owned course feature survived Home source');
expect(!home.includes('<section class="dc-event'),'legacy page-owned Fuengirola feature survived Home source');
expect(!home.includes('ACCESS AFTER JOIN'),'legacy Fuengirola Join gate survived Home source');
expect(!home.includes('возможность записаться доступны после вступления'),'legacy Fuengirola Join promise survived Home source');
expect(homeRuntime.includes("from '/current-program-v1.js'"),'Home must consume shared Current Program composition');

expect(board.includes('id="boardProgramHost"'),'Board Current Program host missing');
expect(board.includes('board-program-v1.css'),'Board Current Program stylesheet missing');
expect(board.includes('board-program-v1.js'),'Board Current Program runtime missing');
expect(board.includes('id="boardHost"'),'canonical Artifact Board host must remain present');
expect(boardRuntime.includes("from '/current-program-v1.js'"),'Board must consume shared Current Program composition');
expect(!boardRuntime.includes('data-artifact'),'Thing projection must not masquerade as Board Artifact');

for(const rel of ['index.html','workspace/board/index.html','thing-projection-v1.js','current-program-v1.js','home-current-program-v1.js','community/board/board-program-v1.js','current-program-v1.css','community/board/board-program-v1.css']){
  const built=path.join(root,'_site',rel);
  expect(fs.existsSync(built),`built artifact missing ${rel}`);
}
if(fs.existsSync(path.join(root,'_site','thing-projection-v1.js'))){
  const builtProjection=readBuilt('thing-projection-v1.js');
  expect((builtProjection.match(/thingRef:/g)||[]).length===2,'built ThingProjection must preserve exactly two source kinds');
  expect(!builtProjection.includes('event:fuengirola'),'built ThingProjection must not absorb Event/Fuengirola');
}
if(fs.existsSync(path.join(root,'_site','index.html'))){
  const builtHome=readBuilt('index.html');
  expect(builtHome.includes('id="current-program"'),'built Home missing Current Program');
  expect(!builtHome.includes('ACCESS AFTER JOIN'),'built Home contains legacy Fuengirola Join gate');
}
if(fs.existsSync(path.join(root,'_site','workspace/board/index.html'))){
  const builtBoard=readBuilt('workspace/board/index.html');
  expect(builtBoard.includes('id="boardProgramHost"'),'built Board missing Current Program host');
  expect(builtBoard.includes('id="boardHost"'),'built Board lost Artifact host');
}

if(errors.length){
  console.error('CURRENT PROGRAM V1 CONTRACT BLOCKED');
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}
console.log('Current Program v1 contract PASS');
console.log('✓ two authorized source kinds cross the ThingProjection boundary');
console.log('✓ Current Program remains one reviewed composition for Home and Board');
console.log('✓ Event/Fuengirola remains composition-local and does not broaden the abstraction');
console.log('✓ projection core excludes surface, telemetry, schema and registry concerns');
console.log('✓ Things remain separate from Board Artifacts');
