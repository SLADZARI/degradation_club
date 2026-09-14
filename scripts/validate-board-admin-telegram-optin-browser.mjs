import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const root=path.join(process.cwd(),'_site');
const failures=[];
const expect=(ok,msg)=>{if(!ok)failures.push(msg)};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};

const runtimeStub=`
export async function currentSession(){return {user:{id:'owner-1'}}}
const state=()=>globalThis.__QA_STATE__;
const query=()=>{
  const q={
    select(){return q},eq(){return q},order(){return q},limit(){return q},
    then(resolve,reject){
      state().sequence.push('artifact-read');
      return Promise.resolve({data:[...(state().rows||[])],error:null}).then(resolve,reject)
    }
  };
  return q;
};
const client={
  from(){return query()},
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
      globalThis.__QA_STATE__={rows:[],promoteCalls:0,promotedIds:[],sequence:[],promotionFails:false};
      globalThis.__renderComposer=()=>{
        document.getElementById('entryHost').innerHTML='<form id="artifactForm"><input id="artifactTitle" value="QA TITLE"><textarea id="artifactBody">QA BODY</textarea><div class="dc-composer-actions"><button type="submit">PUBLISH</button></div></form>';
      };
      globalThis.__publishSuccess=id=>{
        globalThis.__QA_STATE__.rows=[{id,title:'QA TITLE',body:'QA BODY',status:'active',published_at:new Date().toISOString()}];
        globalThis.__QA_STATE__.sequence.push('board-success');
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
async function submit(page){
  await page.locator('#artifactForm').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
}
async function state(page){return page.evaluate(()=>globalThis.__QA_STATE__)}

try{
  // 1. OFF + publish success -> Board published, zero promotion attempts.
  {
    const {page,errors}=await ownerPage();
    expect(await page.locator('[data-admin-telegram-optin-input]').isChecked()===false,'case 1: opt-in must default OFF');
    await submit(page);
    await page.evaluate(()=>globalThis.__publishSuccess('11111111-1111-4111-8111-111111111111'));
    await page.waitForTimeout(120);
    const s=await state(page);
    expect(await page.locator('[data-published="1"]').count()===1,'case 1: canonical Board success marker missing');
    expect(s.promoteCalls===0,`case 1: OFF unexpectedly promoted ${s.promoteCalls} time(s)`);
    expect(!errors.length,`case 1 pageerror: ${errors.join(' | ')}`);
    await page.close();
  }

  // 2. ON + publish fail -> composer remains, zero promotion attempts.
  {
    const {page,errors}=await ownerPage();
    await page.locator('[data-admin-telegram-optin-input]').check();
    await submit(page);
    await page.waitForTimeout(120);
    const s=await state(page);
    expect(await page.locator('#artifactForm').count()===1,'case 2: failed canonical publish should leave composer present in fixture');
    expect(s.promoteCalls===0,`case 2: failed Board publish triggered ${s.promoteCalls} promotion attempt(s)`);
    expect(!errors.length,`case 2 pageerror: ${errors.join(' | ')}`);
    await page.close();
  }

  // 3. ON + publish success -> exactly one promotion after canonical success.
  {
    const {page,errors}=await ownerPage();
    await page.locator('[data-admin-telegram-optin-input]').check();
    await submit(page);
    await page.evaluate(()=>globalThis.__publishSuccess('22222222-2222-4222-8222-222222222222'));
    await page.waitForFunction(()=>globalThis.__QA_STATE__.promoteCalls===1,{timeout:2000});
    const s=await state(page);
    expect(s.promoteCalls===1,`case 3: expected exactly one promotion, got ${s.promoteCalls}`);
    expect(s.promotedIds[0]==='22222222-2222-4222-8222-222222222222',`case 3: wrong Artifact promoted (${s.promotedIds[0]})`);
    expect(s.sequence.indexOf('board-success')>=0&&s.sequence.indexOf('promote')>s.sequence.indexOf('board-success'),`case 3: promotion did not occur after canonical success (${s.sequence.join(' > ')})`);
    expect(!errors.length,`case 3 pageerror: ${errors.join(' | ')}`);
    await page.close();
  }

  // 4. Promotion failure -> Board remains published and literal independent warning appears.
  {
    const {page,errors}=await ownerPage();
    await page.locator('[data-admin-telegram-optin-input]').check();
    await page.evaluate(()=>globalThis.__QA_STATE__.promotionFails=true);
    await submit(page);
    await page.evaluate(()=>globalThis.__publishSuccess('33333333-3333-4333-8333-333333333333'));
    await page.waitForFunction(()=>globalThis.__QA_STATE__.promoteCalls===1,{timeout:2000});
    await page.locator('[data-admin-telegram-warning]').waitFor({state:'attached',timeout:2000});
    const warning=await page.locator('[data-admin-telegram-warning]').innerText();
    expect(warning==='BOARD ОПУБЛИКОВАН · TELEGRAM НЕ ПОСТАВЛЕН В ОЧЕРЕДЬ',`case 4: wrong warning (${warning})`);
    expect(await page.locator('[data-published="1"]').count()===1,'case 4: Telegram failure disturbed canonical Board success');
    expect(!errors.length,`case 4 pageerror: ${errors.join(' | ')}`);
    await page.close();
  }

  // 5. Re-render/reopen composer -> one control, one listener path, one promotion call.
  {
    const {page,errors}=await ownerPage();
    await page.evaluate(()=>{globalThis.__renderComposer();globalThis.__renderComposer()});
    await page.waitForTimeout(80);
    expect(await page.locator('[data-admin-telegram-optin]').count()===1,'case 5: composer re-render duplicated opt-in control');
    await page.locator('[data-admin-telegram-optin-input]').check();
    await submit(page);
    await page.evaluate(()=>globalThis.__publishSuccess('44444444-4444-4444-8444-444444444444'));
    await page.waitForFunction(()=>globalThis.__QA_STATE__.promoteCalls===1,{timeout:2000});
    await page.waitForTimeout(100);
    const s=await state(page);
    expect(s.promoteCalls===1,`case 5: re-render duplicated promotion calls (${s.promoteCalls})`);
    expect(!errors.length,`case 5 pageerror: ${errors.join(' | ')}`);
    await page.close();
  }

  // 6. #174 sustained stability is executed as its existing dedicated Site Integrity step.

  // 7. Normal member composer has no Telegram opt-in control.
  {
    const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/qa-member.html',{waitUntil:'domcontentloaded'});await page.waitForTimeout(120);
    expect(await page.locator('[data-admin-telegram-optin]').count()===0,'case 7: non-owner member received Telegram opt-in control');
    expect(!errors.length,`case 7 pageerror: ${errors.join(' | ')}`);
    await page.close();
  }
}finally{
  await browser.close();server.close();
}

if(failures.length){console.error(`Board OWNER_ADMIN Telegram opt-in browser acceptance failed (${failures.length})`);for(const failure of failures)console.error(`- ${failure}`);process.exit(1)}
console.log('Board OWNER_ADMIN Telegram opt-in browser acceptance PASS: OFF/success, ON/fail, ON/success, independent warning, rerender safety, member exclusion.');
