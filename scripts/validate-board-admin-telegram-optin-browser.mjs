import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const root=path.join(process.cwd(),'_site');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};

// Stateful browser harness mirrors the real backend contract rather than counting a free-standing stub call:
// canonical Board publish creates telegram=held; explicit OWNER_ADMIN promotion is the only UI release to pending;
// the worker may consume pending but must ignore held.
const runtimeStub=`
const state=()=>globalThis.__QA_STATE__;
const client={
  rpc:async(name,args)=>{
    if(name==='dc_admin_promote_artifact_telegram_v1'){
      const id=args?.p_artifact_id||null;
      state().promoteCalls+=1;state().promotedIds.push(id);state().sequence.push('promote');
      const outbox=state().outbox[id];
      if(!outbox)return{data:null,error:{message:'PROMOTION_OUTBOX_MISSING'}};
      if(state().promotionFails)return{data:null,error:{message:'TELEGRAM_DOWN'}};
      if(outbox.status==='held')outbox.status='pending';
      return{data:{artifact_id:id,delivery_status:outbox.status},error:null};
    }
    return {data:null,error:null};
  }
};
export function getClient(){return client}
`;

function pageHtml(role='OWNER_ADMIN'){
  return `<!doctype html><html><body><div id="entryHost"></div><script>
    document.documentElement.dataset.dcBoardUserState=${JSON.stringify(role)};
    globalThis.__QA_STATE__={outbox:{},promoteCalls:0,promotedIds:[],sequence:[],promotionFails:false,workerSent:[]};
    globalThis.__renderComposer=()=>{document.getElementById('entryHost').innerHTML='<form id="artifactForm"><input id="artifactTitle" value="QA TITLE"><textarea id="artifactBody">QA BODY</textarea><div class="dc-composer-actions"><button type="submit">PUBLISH</button></div></form>'};
    globalThis.__publishSuccess=id=>{
      globalThis.__QA_STATE__.outbox[id]={artifactId:id,status:'held'};
      globalThis.__QA_STATE__.sequence.push('board-success:held');
      window.dispatchEvent(new CustomEvent('dc:board:artifact-published',{detail:{artifactId:id}}));
      document.getElementById('entryHost').innerHTML='<div data-published="1">BOARD PUBLISHED</div>';
    };
    globalThis.__workerTick=()=>{
      for(const row of Object.values(globalThis.__QA_STATE__.outbox))if(row.status==='pending'){row.status='sent';globalThis.__QA_STATE__.workerSent.push(row.artifactId)}
    };
    globalThis.__renderComposer();
  </script><script type="module" src="/community/board/board-admin-telegram-optin-v1.js"></script></body></html>`;
}

const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url||'/','http://local').pathname;
  if(pathname==='/community-runtime-v1.js'){res.writeHead(200,{'content-type':'text/javascript; charset=utf-8'});res.end(runtimeStub);return}
  if(pathname==='/qa-owner.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(pageHtml('OWNER_ADMIN'));return}
  if(pathname==='/qa-member.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'});res.end(pageHtml('MEMBER_ACTIVATED'));return}
  const file=path.join(root,pathname.replace(/^\/+/,''));
  if(file.startsWith(root)&&fs.existsSync(file)&&fs.statSync(file).isFile()){res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});res.end(fs.readFileSync(file));return}
  res.writeHead(404);res.end('not found');
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});

async function ownerPage(){const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/qa-owner.html',{waitUntil:'domcontentloaded'});await page.locator('[data-admin-telegram-optin-input]').waitFor({state:'attached',timeout:3000});return{page,errors}}
async function submit(page){await page.locator('#artifactForm').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})))}
async function state(page){return page.evaluate(()=>globalThis.__QA_STATE__)}
const outboxStatus=(s,id)=>s.outbox?.[id]?.status||null;

try{
  // 1. OFF + canonical success => outbox remains held, including after worker tick.
  {
    const id='11111111-1111-4111-8111-111111111111';const {page,errors}=await ownerPage();
    expect(await page.locator('[data-admin-telegram-optin-input]').isChecked()===false,'case 1: opt-in must default OFF');
    await submit(page);await page.evaluate(id=>globalThis.__publishSuccess(id),id);await page.waitForTimeout(100);let s=await state(page);
    expect(outboxStatus(s,id)==='held',`case 1: OFF must leave outbox held, got ${outboxStatus(s,id)}`);expect(s.promoteCalls===0,`case 1: OFF invoked promotion ${s.promoteCalls} time(s)`);
    await page.evaluate(()=>globalThis.__workerTick());s=await state(page);expect(outboxStatus(s,id)==='held',`case 1: worker must ignore held, got ${outboxStatus(s,id)}`);expect(s.workerSent.length===0,'case 1: held row was sent by worker');expect(!errors.length,`case 1 pageerror: ${errors.join(' | ')}`);await page.close();
  }
  // 2. ON + failed Board publish => no outbox and no promotion.
  {
    const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await submit(page);await page.waitForTimeout(100);const s=await state(page);expect(Object.keys(s.outbox).length===0,'case 2: failed publish created outbox');expect(s.promoteCalls===0,'case 2: failed publish promoted');expect(!errors.length,`case 2 pageerror: ${errors.join(' | ')}`);await page.close();
  }
  // 3. ON + success => exact outbox transitions held -> pending, then worker may sent.
  {
    const id='22222222-2222-4222-8222-222222222222';const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await submit(page);await page.evaluate(id=>globalThis.__publishSuccess(id),id);await page.waitForFunction(id=>globalThis.__QA_STATE__.outbox[id]?.status==='pending',id,{timeout:2000});let s=await state(page);expect(outboxStatus(s,id)==='pending',`case 3: ON must release to pending, got ${outboxStatus(s,id)}`);expect(s.promotedIds[0]===id,'case 3: wrong Artifact promoted');expect(s.sequence[0]==='board-success:held','case 3: promotion occurred before canonical held state');await page.evaluate(()=>globalThis.__workerTick());s=await state(page);expect(outboxStatus(s,id)==='sent','case 3: pending row was not worker-sendable');expect(!errors.length,`case 3 pageerror: ${errors.join(' | ')}`);await page.close();
  }
  // 4. Promotion failure => Board remains published and outbox remains held.
  {
    const id='33333333-3333-4333-8333-333333333333';const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await page.evaluate(()=>globalThis.__QA_STATE__.promotionFails=true);await submit(page);await page.evaluate(id=>globalThis.__publishSuccess(id),id);await page.locator('[data-admin-telegram-warning]').waitFor({state:'attached',timeout:2000});const s=await state(page);expect(outboxStatus(s,id)==='held',`case 4: failed Telegram continuation must leave held, got ${outboxStatus(s,id)}`);expect(await page.locator('[data-published="1"]').count()===1,'case 4: Telegram failure disturbed Board success');expect(!errors.length,`case 4 pageerror: ${errors.join(' | ')}`);await page.close();
  }
  // 5. Rerender + repeated success event => one pending transition/call.
  {
    const id='44444444-4444-4444-8444-444444444444';const {page,errors}=await ownerPage();await page.evaluate(()=>{globalThis.__renderComposer();globalThis.__renderComposer()});await page.waitForTimeout(80);expect(await page.locator('[data-admin-telegram-optin]').count()===1,'case 5: duplicated opt-in control');await page.locator('[data-admin-telegram-optin-input]').check();await submit(page);await page.evaluate(id=>globalThis.__publishSuccess(id),id);await page.waitForFunction(id=>globalThis.__QA_STATE__.outbox[id]?.status==='pending',id,{timeout:2000});await page.evaluate(id=>window.dispatchEvent(new CustomEvent('dc:board:artifact-published',{detail:{artifactId:id}})),id);await page.waitForTimeout(100);const s=await state(page);expect(s.promoteCalls===1,`case 5: duplicate promotion calls ${s.promoteCalls}`);expect(outboxStatus(s,id)==='pending','case 5: outbox left pending state unexpectedly');expect(!errors.length,`case 5 pageerror: ${errors.join(' | ')}`);await page.close();
  }
  // 6. #174 sustained stability is a separate preceding Site Integrity step.
  // 7. Normal member gets no opt-in.
  {const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/qa-member.html',{waitUntil:'domcontentloaded'});await page.waitForTimeout(100);expect(await page.locator('[data-admin-telegram-optin]').count()===0,'case 7: member received opt-in');expect(!errors.length,`case 7 pageerror: ${errors.join(' | ')}`);await page.close()}
  // 8. Extreme browser clock skew has no effect on exact-id outbox transition.
  {
    const id='55555555-5555-4555-8555-555555555555';const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await page.evaluate(()=>{const RealDate=Date;class SkewDate extends RealDate{static now(){return RealDate.now()+86400000}};globalThis.Date=SkewDate});await submit(page);await page.evaluate(id=>globalThis.__publishSuccess(id),id);await page.waitForFunction(id=>globalThis.__QA_STATE__.outbox[id]?.status==='pending',id,{timeout:2000});const s=await state(page);expect(outboxStatus(s,id)==='pending','case 8: clock skew broke pending transition');expect(s.promotedIds[0]===id,'case 8: clock skew changed identity');expect(!errors.length,`case 8 pageerror: ${errors.join(' | ')}`);await page.close();
  }
  // 9. Duplicate content cannot affect exact-id outbox transition.
  {
    const id='66666666-6666-4666-8666-666666666666';const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await submit(page);await page.evaluate(id=>{globalThis.__QA_DUPLICATE_ROWS__=[{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',title:'QA TITLE',body:'QA BODY'},{id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',title:'QA TITLE',body:'QA BODY'}];globalThis.__publishSuccess(id)},id);await page.waitForFunction(id=>globalThis.__QA_STATE__.outbox[id]?.status==='pending',id,{timeout:2000});const s=await state(page);expect(outboxStatus(s,id)==='pending','case 9: exact outbox not pending');expect(s.promotedIds[0]===id,'case 9: duplicate content confused identity');expect(!errors.length,`case 9 pageerror: ${errors.join(' | ')}`);await page.close();
  }
}finally{await browser.close();server.close()}

if(failures.length){console.error(`Board OWNER_ADMIN Telegram opt-in browser acceptance failed (${failures.length})`);for(const f of failures)console.error(`- ${f}`);process.exit(1)}
console.log('Board OWNER_ADMIN Telegram opt-in browser acceptance PASS: OFF=>held and worker-ignore; ON=>pending/sent; exact-id continuation; failure isolation; rerender/member/clock/duplicate guards.');
