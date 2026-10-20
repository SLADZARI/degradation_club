/* Dementor Live read-only PUBLIC smoke. No auth, state changes, player creation,
   screenshots, secrets or user data. Browser blocks every non-GET/HEAD request. */
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {chromium}=require('playwright');

const base='http://138.199.144.94';
const report={checkedAtUtc:new Date().toISOString(),base,mode:'PRODUCTION_READ_ONLY',operations:['GET','HEAD'],liveVersion:null,checks:[],browsers:[],errors:[]};
const add=(name,ok,detail)=>{report.checks.push({name,status:ok?'PASS':'FAIL',detail});console.log((ok?'PASS':'FAIL')+' '+name+' '+JSON.stringify(detail));};
const doGet=async (resource,timeout=12000)=>{
 const url=base+resource;const t=Date.now();
 const res=await fetch(url,{method:'GET',headers:{'Cache-Control':'no-cache','Accept':'*/*'},signal:AbortSignal.timeout(timeout)});
 if(new URL(res.url).host!==new URL(base).host)throw Error('Unapproved cross-origin redirect');
 const bytes=Buffer.from(await res.arrayBuffer());
 return {code:res.status,ms:Date.now()-t,mime:res.headers.get('content-type')||'',bytes,headers:{cache:res.headers.get('cache-control')||''}};
};
async function probe(name,resource,validate,{minimal=false}={}){
 try{const d=await doGet(resource);const valid=validate(d);const detail={status:d.code,ms:d.ms,bytes:d.bytes.length,mime:d.mime,sha256:crypto.createHash('sha256').update(d.bytes).digest('hex').slice(0,18)};
  if(name==='health'){let x=JSON.parse(d.bytes.toString('utf8'));report.liveVersion=x.version||null;detail.version=x.version||null;detail.testMode=x.testMode;detail.ok=x.ok;}
  add(name,valid,detail);return d;
 }catch(e){add(name,false,{error:String(e.message||e).slice(0,150)});return null;}
}
const isTextJS=d=>d.code===200&&!d.mime.includes('text/html')&&d.bytes.length>100;
const isPNG=d=>d.code===200&&d.bytes.length>100&&d.bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
async function run(){
 for(let i=0;i<3;i++)await probe('health-'+(i+1),'/api/health',d=>{
  try{const j=JSON.parse(d.bytes.toString('utf8'));if(i===0)report.liveVersion=j.version;return d.code===200&&j.ok===true&&j.testMode===false&&/^0\.\d+\.\d+(-rc\.\d+)?$/.test(j.version)&&j.version===report.liveVersion}catch{return false}
 });
 const home=await probe('public-index','/',d=>d.code===200&&d.mime.includes('text/html')&&d.bytes.toString('utf8').includes('Dementor Live')&&d.bytes.toString('utf8').includes('id="world"'));
 const basic=['/app.js','/styles.css','/life-ui.js','/plaza-ui.js','/city-ui.js','/estate-ui.js','/paper-icons.js','/paper-icons.css'];
 for(const file of basic)await probe('asset:'+file,file,d=>isTextJS(d));
 const png=['/assets/paper-icons/paper_atlas_64.png','/assets/paper-icons/png_256/wood.png'];
 for(const file of png)await probe('png:'+file,file,isPNG);
 if(report.liveVersion==='0.5.0-rc.4')await probe('RC4:terrain-script','/terrain-01.js',isTextJS);
 // Permission check: inspect HTTP STATUS ONLY. Do NOT print anonymous game-state response.
 try{const r=await doGet('/api/state');add('anonymous-state-access-blocked',[400,401,403].includes(r.code),{status:r.code,bodyRedacted:true});}
 catch(e){add('anonymous-state-access-blocked',false,{error:String(e.message||e).slice(0,130)});}
 let browser=null;
 try{
  browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  for(const vp of [{name:'desktop',width:1440,height:900,isMobile:false},{name:'mobile-chromium-emulation',width:390,height:844,isMobile:true}]){
   const ctx=await browser.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:1,isMobile:vp.isMobile,hasTouch:vp.isMobile,storageState:{cookies:[],origins:[]}});
   const page=await ctx.newPage(),denied=[],pageErrors=[],badStatuses=[];
   await page.route('**/*',route=>{const request=route.request();if(!['GET','HEAD'].includes(request.method())){denied.push(request.method());return route.abort();}return route.continue();});
   page.on('pageerror',()=>pageErrors.push('JS_RUNTIME_ERROR'));
   page.on('response',response=>{const status=response.status();if(status>=500)badStatuses.push(status)});
   let result={name:vp.name,loaded:false,allowedRequests:'GET/HEAD only',blockedWriteMethods:[],pageErrorCount:0,serverErrorCount:0};
   try{
    const resp=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:15000});
    await page.waitForTimeout(1200);
    const dom=await page.evaluate(()=>{const c=document.querySelector('#world');const r=c?.getBoundingClientRect();return {title:document.title,game:!!document.querySelector('#game'),canvas:!!c,canvasWidth:Math.round(r?.width||0),canvasHeight:Math.round(r?.height||0),width:document.documentElement.scrollWidth,viewport:innerWidth,htmlLang:document.documentElement.lang}});
    result={...result,loaded:resp?.status()===200&&dom.game&&dom.canvas&&dom.canvasWidth>150&&dom.canvasHeight>150,document:dom,blockedWriteMethods:denied,pageErrorCount:pageErrors.length,serverErrorCount:badStatuses.length};
    result.status=result.loaded&&denied.length===0&&pageErrors.length===0&&badStatuses.length===0?'PASS':'FAIL';
    report.browsers.push(result);console.log(result.status+' browser:'+vp.name+' '+JSON.stringify(result));
   }catch(e){result.error=String(e.message||e).slice(0,180);result.status='FAIL';report.browsers.push(result);console.log('FAIL browser:'+vp.name+' '+result.error)}
   await ctx.close();
  }
 }catch(e){report.errors.push('Browser unavailable: '+String(e.message||e).slice(0,180));console.log('BROWSER_UNAVAILABLE '+report.errors.at(-1));}
 finally{if(browser)await browser.close();}
 const total=report.checks.length+report.browsers.length,failed=report.checks.filter(x=>x.status==='FAIL').length+report.browsers.filter(x=>x.status==='FAIL').length;
 report.totals={total,failed,passed:total-failed};
 const dst=path.join(process.cwd(),'reports','live-readonly','summary.json');fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,JSON.stringify(report,null,2));
 console.log('PRODUCTION_READONLY_SUMMARY '+JSON.stringify({checkedAtUtc:report.checkedAtUtc,liveVersion:report.liveVersion,...report.totals}));
 if(failed)process.exitCode=1;
}
run().catch(e=>{console.error('QA_ERROR '+String(e.message||e).slice(0,200));process.exitCode=1;});
