import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const readBuilt=rel=>fs.readFileSync(path.join(root,'_site',rel),'utf8');

const source=read('current-program-v1.js');
const home=read('index.html');
const homeRuntime=read('home-current-program-v1.js');
const board=read('workspace/board/index.html');
const boardRuntime=read('community/board/board-program-v1.js');

const expected=[
  ['program:dengi-na-veter','/courses/dengi-na-veter/','ПРОЙТИ КУРС'],
  ['project:dementor-lab','/projects/dementor-lab/','ПОСМОТРЕТЬ LAB'],
  ['event:fuengirola','/events/fuengirola/','ПОСМОТРЕТЬ СОБЫТИЕ']
];

for(const [ref,href,label] of expected){
  expect(source.includes(`thingRef:'${ref}'`),`shared projection missing ${ref}`);
  expect(source.includes(`href:'${href}'`),`shared projection missing ${href}`);
  expect(source.includes(`actionLabel:'${label}'`),`shared projection missing action ${label}`);
}
expect((source.match(/thingRef:/g)||[]).length===3,'Current Program source must contain exactly 3 Things');
expect(!source.includes('ne-komanda'),'НЕ КОМАНДА must remain excluded from Current Program v0');
expect(!source.includes('dumai-s-opasnostyu'),'Думай с опасностью must not silently enter Current Program v0');
expect(source.includes("currentTruth:'Курс готов к прохождению.'"),'Деньги на ветер readiness truth missing');
expect(source.includes('Публичный playable release пока не заявлен'),'Dementor Lab release boundary missing');
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
expect(homeRuntime.includes("from '/current-program-v1.js'"),'Home must consume shared projection source');

expect(board.includes('id="boardProgramHost"'),'Board Current Program host missing');
expect(board.includes('board-program-v1.css'),'Board Current Program stylesheet missing');
expect(board.includes('board-program-v1.js'),'Board Current Program runtime missing');
expect(board.includes('id="boardHost"'),'canonical Artifact Board host must remain present');
expect(boardRuntime.includes("from '/current-program-v1.js'"),'Board must consume shared projection source');
expect(!boardRuntime.includes('data-artifact'),'Thing projection must not masquerade as Board Artifact');

for(const rel of ['index.html','workspace/board/index.html','current-program-v1.js','home-current-program-v1.js','community/board/board-program-v1.js','current-program-v1.css','community/board/board-program-v1.css']){
  const built=path.join(root,'_site',rel);
  expect(fs.existsSync(built),`built artifact missing ${rel}`);
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
console.log('✓ exactly 3 reviewed Things');
console.log('✓ Home and Board share one projection source');
console.log('✓ Things remain separate from Board Artifacts');
console.log('✓ legacy Home course/Fuengirola funnel blocks removed');
console.log('✓ canonical analytics click owner reused without duplicate events');
