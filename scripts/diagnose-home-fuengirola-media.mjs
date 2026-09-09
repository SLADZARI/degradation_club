import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
function resolveFile(urlPath){
  let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);
  if(pathname.endsWith('/'))pathname+='index.html';
  const full=path.resolve(artifact,pathname.replace(/^\/+/,''));
  return full.startsWith(path.resolve(artifact)+path.sep)?full:null;
}
const server=http.createServer((req,res)=>{
  const file=resolveFile(req.url||'/');
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}
  res.setHeader('content-type',mime[path.extname(file).toLowerCase()]||'application/octet-stream');res.end(fs.readFileSync(file));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:1000}});
const supabaseStub=`export function createClient(){const chain={select(){return chain},eq(){return chain},maybeSingle:async()=>({data:null,error:null}),then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject)}};return {auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})},from:()=>chain};}`;
await context.route('https://cdn.jsdelivr.net/**',r=>r.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:supabaseStub}));
const page=await context.newPage();
await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(300);
const event=page.locator('section.dc-event:has(a[href="/events/fuengirola/"])');
await event.scrollIntoViewIfNeeded();await page.waitForTimeout(850);
const owners=await event.evaluate(el=>{
  const rows=[];
  const add=(node,pseudo,style)=>{
    const bg=style.backgroundImage||'';
    if(!bg.includes('event-fuengirola-03.webp'))return;
    const r=node.getBoundingClientRect();
    rows.push({kind:'background',node:node.tagName.toLowerCase(),className:node.className||'',pseudo:pseudo||'element',display:style.display,position:style.position,backgroundImage:bg,backgroundSize:style.backgroundSize,backgroundPosition:style.backgroundPosition,rect:{x:r.x,y:r.y,width:r.width,height:r.height}});
  };
  for(const node of [el,...el.querySelectorAll('*')]){
    if(node.tagName==='IMG'){
      const src=node.currentSrc||node.getAttribute('src')||'';
      if(src.includes('event-fuengirola-03.webp')){const r=node.getBoundingClientRect();rows.push({kind:'img',node:'img',className:node.className||'',src,rect:{x:r.x,y:r.y,width:r.width,height:r.height}})}
    }
    add(node,null,getComputedStyle(node));
    add(node,'::before',getComputedStyle(node,'::before'));
    add(node,'::after',getComputedStyle(node,'::after'));
  }
  return rows;
});
console.log('FUENGIROLA_MEDIA_OWNERS_390');
console.log(JSON.stringify(owners,null,2));
await browser.close();await new Promise(r=>server.close(r));
