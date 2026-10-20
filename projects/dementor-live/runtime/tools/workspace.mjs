import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const mode=process.argv[2]||'doctor';
const required=['public/music/paper-morning.mp3','public/music/town-evening.mp3','plaza.mjs','public/plaza-ui.js','equipment.mjs','life.mjs','public/life-ui.js','city-expansion.mjs','city-network.mjs','public/city-ui.js','package.json','server.mjs','world.mjs','config.mjs','public/index.html','public/app.js','public/styles.css','START_HERE.md','CURRENT_STATE.md','AGENTS.md','NEXT_CHAT_PROMPT.md','HANDOFF.md','docs/CORE_AND_FIRST_LEVEL_v0.1.md','docs/REQUIREMENTS.md','docs/TOOLS_AND_SOURCES.md','references/01-first-scene.png','references/02-gathering.png','references/03-building.png'];
function doctor(){
  const major=Number(process.versions.node.split('.')[0]);let failed=major<22;
  console.log(`Dementor Live · workspace\nNode ${process.version} ${failed?'— нужен Node 22+':'✓'}\nПапка: ${root}`);
  for(const file of required){const exists=fs.existsSync(path.join(root,file));console.log(`${exists?'✓':'✗'} ${file}`);if(!exists)failed=true;}
  const git=spawnSync('git',['--version'],{encoding:'utf8'});console.log(git.status===0?'✓ '+git.stdout.trim():'· Git не найден (не нужен для запуска игры)');
  const state=path.join(root,'data/world.json');console.log(fs.existsSync(state)?'· Найден сохранённый мир data/world.json':'· Сохранённого мира нет — первый запуск создаст его по мере игры');
  console.log('Плагины и браузер: доступ проверяется инструментами текущего чата, этот скрипт не проверяет аккаунты.');
  return failed?1:0;
}
if(mode==='doctor')process.exitCode=doctor();
else if(mode==='context')console.log(fs.readFileSync(path.join(root,'CURRENT_STATE.md'),'utf8')+'\nВход: START_HERE.md\nКоманды: npm run doctor · npm run check · npm start · npm run pack\n');
else if(mode==='check'){
  const runtime=['public/music/paper-morning.mp3','public/music/town-evening.mp3','plaza.mjs','public/plaza-ui.js','equipment.mjs','life.mjs','public/life-ui.js','public/city-ui.js','city-expansion.mjs','city-network.mjs','config.mjs','public/app.js','public/index.html','public/styles.css','server.mjs','world.mjs'];
  const runtimeHash=createHash('sha256').update(runtime.map(f=>f+'\n'+createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')).join('\n')).digest('hex');
  const releaseFile=path.join(root,'reports/release.json'),release=fs.existsSync(releaseFile)?JSON.parse(fs.readFileSync(releaseFile,'utf8')):null;
  const fresh=release?.runtimeHash===runtimeHash;
  const report={createdAt:new Date().toISOString(),scope:'this command runs syntax + model; HTTP/browser evidence comes from separately recorded matching-runtime runs',node:process.version,runtimeHash,steps:[],browser:release?(fresh&&release.browser?'PASS':'STALE'):'NOT RUN',httpSse:release?(fresh&&release.httpSse?'PASS':'STALE'):'NOT RUN',releaseEvidence:fresh?release:null};let log='';
  const files=[];function scan(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const rel=path.join(dir,entry.name);if(entry.name.startsWith('._')||entry.name==='__MACOSX')continue;if(entry.isDirectory()&&!['node_modules','data','.git','backups','.local','reports'].includes(entry.name))scan(rel);else if(entry.isFile()&&/\.(mjs|cjs|js)$/.test(entry.name))files.push(rel);}}scan('');
  for(const file of files){const r=spawnSync(process.execPath,['--check',file],{cwd:root,encoding:'utf8'});report.steps.push({kind:'syntax',file,pass:r.status===0});log+=`SYNTAX ${file}\n${r.stdout||''}${r.stderr||''}\n`;}
  const test=spawnSync(process.execPath,['--test','test/isometric-scenes.test.mjs','test/model.test.mjs','test/life.test.mjs','test/plaza.test.mjs','test/city-economy.test.mjs'],{cwd:root,encoding:'utf8'});report.steps.push({kind:'model',pass:test.status===0});log+=test.stdout||'';log+=test.stderr||'';console.log(test.stdout||test.stderr);
  report.pass=report.steps.every(s=>s.pass);fs.mkdirSync(path.join(root,'reports'),{recursive:true});fs.writeFileSync(path.join(root,'reports/check.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(root,'reports/check.log'),log);
  console.log(`${report.pass?'PASS':'FAIL'} · syntax ${files.length} files + model tests\nRecorded matching-runtime evidence — HTTP/SSE: ${report.httpSse} · Browser: ${report.browser}\nReports: reports/check.json, reports/check.log`);process.exitCode=report.pass?0:1;
}else{console.error('Используй doctor, check или context');process.exitCode=1;}
