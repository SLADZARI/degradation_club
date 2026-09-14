import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const root=path.join(process.cwd(),'_site');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};

const runtimeStub=`
const state=()=>globalThis.__QA_STATE__;
const client={
  rpc:async(name,args)=>{
    if(name==='dc_admin_promote_artifact_telegram_v1'){
      state().promoteCalls+=1;
      state().promotedIds.push(args?.p_artifact_id||null);
      state().sequence.push('promote');
      return state().promotionFails?{data:null,error:{message:'TELEGRAM_DOWN'}}:{data:{delivery_status:'pending'},error:null};
    }
    return {data:null,error:null};
  }
};
export function getClient(){return client}
`;

function pageHtml(role='OWNER_ADMIN'){
  return `<!doctype html><html><body>
    <div id="entryHost"></div>
    <script>
      document.documentElement.dataset.dcBoardUserState=${JSON.stringify(role)};
      globalThis.__QA_STATE__={promoteCalls:0,promotedIds:[],sequence:[],promotionFails:false};
      globalThis.__renderComposer=()=>{
        document.getElementById('entryHost').innerHTML='<form id="artifactForm"><input id="artifactTitle" value="QA TITLE"><textarea id="artifactBody">QA BODY</textarea><div class="dc-composer-actions"><button type="submit">PUBLISH</button></div></form>';
      };
      globalThis.__publishSuccess=id=>{
        globalThis.__QA_STATE__.sequence.push('board-success');
        window.dispatchEvent(new CustomEvent('dc:board:artifact-published',{detail:{artifactId:id}}));
        document.getElementById('entryHost').innerHTML='<div data-published="1">BOARD PUBLISHED</div>';
      };
      globalThis.__renderComposer();
    </script>
    <script type="module" src="/community/board/board-admin-telegram-optin-v1.js"></script>
  </body></html>`;
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

async function ownerPage(){
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'/qa-owner.html',{waitUntil:'domcontentloaded'});
  await page.locator('[data-admin-telegram-optin-input]').waitFor({state:'attached',timeout:3000});
  return {page,errors};
}
async function submit(page){await page.locator('#artifactForm').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})))}
async function state(page){return page.evaluate(()=>globalThis.__QA_STATE__)}

try{
  // 1. OFF + publish success -> Board published, zero promotion attempts.
  {
    const {page,errors}=await ownerPage();
    expect(await page.locator('[data-admin-telegram-optin-input]').isChecked()===false,'case 1: opt-in must default OFF');
    await submit(page);await page.evaluate(()=>globalThis.__publishSuccess('11111111-1111-4111-8111-111111111111'));await page.waitForTimeout(100);
    const s=await state(page);expect(await page.locator('[data-published="1"]').count()===1,'case 1: canonical Board success marker missing');expect(s.promoteCalls===0,`case 1: OFF unexpectedly promoted ${s.promoteCalls} time(s)`);expect(!errors.length,`case 1 pageerror: ${errors.join(' | ')}`);await page.close();
  }

  // 2. ON + publish fail -> no success event, zero promotion attempts.
  {
    const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await submit(page);await page.waitForTimeout(100);
    const s=await state(page);expect(await page.locator('#artifactForm').count()===1,'case 2: failed canonical publish should leave composer present');expect(s.promoteCalls===0,`case 2: failed Board publish triggered ${s.promoteCalls} promotion attempt(s)`);expect(!errors.length,`case 2 pageerror: ${errors.join(' | ')}`);await page.close();
  }

  // 3. ON + publish success -> exactly one promotion of the exact success-event Artifact id.
  {
    const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await submit(page);await page.evaluate(()=>globalThis.__publishSuccess('22222222-2222-4222-8222-222222222222'));await page.waitForFunction(()=>globalThis.__QA_STATE__.promoteCalls===1,{timeout:2000});
    const s=await state(page);expect(s.promoteCalls===1,`case 3: expected exactly one promotion, got ${s.promoteCalls}`);expect(s.promotedIds[0]==='22222222-2222-4222-8222-222222222222',`case 3: wrong Artifact promoted (${s.promotedIds[0]})`);expect(s.sequence.indexOf('promote')>s.sequence.indexOf('board-success'),`case 3: promotion did not occur after canonical success (${s.sequence.join(' > ')})`);expect(!errors.length,`case 3 pageerror: ${errors.join(' | ')}`);await page.close();
  }

  // 4. Promotion failure -> Board remains published and literal independent warning appears.
  {
    const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await page.evaluate(()=>globalThis.__QA_STATE__.promotionFails=true);await submit(page);await page.evaluate(()=>globalThis.__publishSuccess('33333333-3333-4333-8333-333333333333'));await page.waitForFunction(()=>globalThis.__QA_STATE__.promoteCalls===1,{timeout:2000});await page.locator('[data-admin-telegram-warning]').waitFor({state:'attached',timeout:2000});
    const warning=await page.locator('[data-admin-telegram-warning]').innerText();expect(warning==='BOARD ОПУБЛИКОВАН · TELEGRAM НЕ ПОСТАВЛЕН В ОЧЕРЕДЬ',`case 4: wrong warning (${warning})`);expect(await page.locator('[data-published="1"]').count()===1,'case 4: Telegram failure disturbed canonical Board success');expect(!errors.length,`case 4 pageerror: ${errors.join(' | ')}`);await page.close();
  }

  // 5. Re-render/reopen composer -> one control and one promotion call.
  {
    const {page,errors}=await ownerPage();await page.evaluate(()=>{globalThis.__renderComposer();globalThis.__renderComposer()});await page.waitForTimeout(80);expect(await page.locator('[data-admin-telegram-optin]').count()===1,'case 5: composer re-render duplicated opt-in control');await page.locator('[data-admin-telegram-optin-input]').check();await submit(page);await page.evaluate(()=>globalThis.__publishSuccess('44444444-4444-4444-8444-444444444444'));await page.waitForFunction(()=>globalThis.__QA_STATE__.promoteCalls===1,{timeout:2000});
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('dc:board:artifact-published',{detail:{artifactId:'44444444-4444-4444-8444-444444444444'}})));await page.waitForTimeout(100);const s=await state(page);expect(s.promoteCalls===1,`case 5: rerender/repeated signal duplicated promotion calls (${s.promoteCalls})`);expect(!errors.length,`case 5 pageerror: ${errors.join(' | ')}`);await page.close();
  }

  // 6. #174 sustained stability is executed as its existing dedicated Site Integrity step.

  // 7. Normal Member has no Telegram opt-in control.
  {
    const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto(base+'/qa-member.html',{waitUntil:'domcontentloaded'});await page.waitForTimeout(100);expect(await page.locator('[data-admin-telegram-optin]').count()===0,'case 7: non-owner member received Telegram opt-in control');expect(!errors.length,`case 7 pageerror: ${errors.join(' | ')}`);await page.close();
  }

  // 8. Extreme browser clock skew cannot affect exact-id continuation.
  {
    const {page,errors}=await ownerPage();await page.addInitScript(()=>{});await page.locator('[data-admin-telegram-optin-input]').check();await page.evaluate(()=>{const RealDate=Date;class SkewDate extends RealDate{static now(){return RealDate.now()+24*60*60*1000}};globalThis.Date=SkewDate});await submit(page);await page.evaluate(()=>globalThis.__publishSuccess('55555555-5555-4555-8555-555555555555'));await page.waitForFunction(()=>globalThis.__QA_STATE__.promoteCalls===1,{timeout:2000});const s=await state(page);expect(s.promotedIds[0]==='55555555-5555-4555-8555-555555555555',`case 8: clock skew changed promoted Artifact (${s.promotedIds[0]})`);expect(!errors.length,`case 8 pageerror: ${errors.join(' | ')}`);await page.close();
  }

  // 9. Duplicate title/body identity is irrelevant: exact event id wins.
  {
    const {page,errors}=await ownerPage();await page.locator('[data-admin-telegram-optin-input]').check();await submit(page);await page.evaluate(()=>{globalThis.__QA_DUPLICATE_ROWS__=[{id:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',title:'QA TITLE',body:'QA BODY'},{id:'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',title:'QA TITLE',body:'QA BODY'}];globalThis.__publishSuccess('66666666-6666-4666-8666-666666666666')});await page.waitForFunction(()=>globalThis.__QA_STATE__.promoteCalls===1,{timeout:2000});const s=await state(page);expect(s.promotedIds[0]==='66666666-6666-4666-8666-666666666666',`case 9: duplicate title/body confused Artifact identity (${s.promotedIds[0]})`);expect(!errors.length,`case 9 pageerror: ${errors.join(' | ')}`);await page.close();
  }
}finally{await browser.close();server.close()}

if(failures.length){console.error(`Board OWNER_ADMIN Telegram opt-in browser acceptance failed (${failures.length})`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Board OWNER_ADMIN Telegram opt-in browser acceptance PASS: exact-id post-success signal, OFF/fail/success, independent warning, rerender safety, member exclusion, clock skew, duplicate content.');
