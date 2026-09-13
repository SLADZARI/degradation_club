import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const root=path.join(process.cwd(),'_site');
const id='11111111-1111-4111-8111-111111111111';
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.svg':'image/svg+xml'};

const runtimeStub=`
let calls=0;
globalThis.__QA_CLUB_RPC_CALLS__=()=>calls;
const client={rpc:async(name,args)=>{calls+=1;if(name==='dc_artifact_publisher_scopes_v1')return{data:(args?.p_artifact_ids||[]).map(artifact_id=>({artifact_id,publisher_scope:'club'})),error:null};if(name==='dc_owner_board_publisher_state_v1')return{data:{publisher_scope:'club'},error:null};return{data:null,error:null}}};
export function getClient(){return client}
`;

const boardHtml=`<!doctype html><html><body><div id="entryHost"></div><div id="boardHost"><article class="dc-notice" data-artifact="${id}"><div class="dc-notice__author"><strong>QA MEMBER</strong></div></article></div><script>document.documentElement.dataset.dcBoardUserState='OWNER_ADMIN';globalThis.__QA_MUTATIONS__=0;new MutationObserver(m=>globalThis.__QA_MUTATIONS__+=m.length).observe(document.getElementById('boardHost'),{childList:true,subtree:true,attributes:true});</script><script type="module" src="/community/board/board-club-publisher-v1.js"></script></body></html>`;
const artifactHtml=`<!doctype html><html><body><div id="artifactHost"><article class="dc-artifact-record"><div class="dc-artifact-author"><strong>QA MEMBER</strong></div></article></div><script>globalThis.__QA_MUTATIONS__=0;new MutationObserver(m=>globalThis.__QA_MUTATIONS__+=m.length).observe(document.getElementById('artifactHost'),{childList:true,subtree:true,attributes:true});</script><script type="module" src="/community/artifact/artifact-club-publisher-v1.js"></script></body></html>`;

const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url||'/','http://local').pathname;
  if(pathname==='/community-runtime-v1.js'){res.writeHead(200,{'content-type':'text/javascript; charset=utf-8'});res.end(runtimeStub);return}
  if(pathname==='/qa-board.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(boardHtml);return}
  if(pathname==='/qa-artifact.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(artifactHtml);return}
  const file=path.join(root,pathname.replace(/^\/+/,''));
  if(file.startsWith(root)&&fs.existsSync(file)&&fs.statSync(file).isFile()){res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));return}
  res.writeHead(404);res.end('not found');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

async function checkBoard(){
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/qa-board.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('[data-artifact]')?.dataset.publisherScope==='club',{timeout:3000});
  const settled=await page.evaluate(()=>({rpc:globalThis.__QA_CLUB_RPC_CALLS__(),mut:globalThis.__QA_MUTATIONS__,html:document.querySelector('.dc-notice__author')?.innerHTML||''}));
  await page.waitForTimeout(1200);
  const after=await page.evaluate(()=>({rpc:globalThis.__QA_CLUB_RPC_CALLS__(),mut:globalThis.__QA_MUTATIONS__,html:document.querySelector('.dc-notice__author')?.innerHTML||''}));
  expect(settled.html===after.html,'Board club identity kept rewriting after settle');
  expect(after.rpc-settled.rpc<=1,`Board publisher RPC loop detected: ${settled.rpc} -> ${after.rpc}`);
  expect(after.mut-settled.mut<=1,`Board mutation loop detected: ${settled.mut} -> ${after.mut}`);
  expect(!errors.length,`Board stability pageerror: ${errors.join(' | ')}`);
  await page.close();
}

async function checkArtifact(){
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+`/qa-artifact.html?id=${id}`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.dc-artifact-author')?.dataset.publisherScope==='club',{timeout:3000});
  const settled=await page.evaluate(()=>({rpc:globalThis.__QA_CLUB_RPC_CALLS__(),mut:globalThis.__QA_MUTATIONS__,html:document.querySelector('.dc-artifact-author')?.innerHTML||''}));
  await page.waitForTimeout(1200);
  const after=await page.evaluate(()=>({rpc:globalThis.__QA_CLUB_RPC_CALLS__(),mut:globalThis.__QA_MUTATIONS__,html:document.querySelector('.dc-artifact-author')?.innerHTML||''}));
  expect(settled.html===after.html,'Artifact club identity kept rewriting after settle');
  expect(after.rpc-settled.rpc<=1,`Artifact publisher RPC loop detected: ${settled.rpc} -> ${after.rpc}`);
  expect(after.mut-settled.mut<=1,`Artifact mutation loop detected: ${settled.mut} -> ${after.mut}`);
  expect(!errors.length,`Artifact stability pageerror: ${errors.join(' | ')}`);
  await page.close();
}

try{await checkBoard();await checkArtifact()}finally{await browser.close();server.close()}
if(failures.length){console.error('CLUB PUBLISHER STABILITY FAILED');for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Club publisher sustained stability PASS: Board + Artifact settle without mutation/RPC loops.');
