import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const artifact=path.join(process.cwd(),'_site');
const analyticsPath=path.join(artifact,'production-analytics-v1.js');
const failures=[];
const expect=(ok,message)=>{if(!ok)failures.push(message)};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

if(!fs.existsSync(artifact))throw new Error('_site missing; build-pages must run before Evidence Hygiene browser acceptance');
if(!fs.existsSync(analyticsPath))throw new Error('_site/production-analytics-v1.js missing');
const analytics=fs.readFileSync(analyticsPath,'utf8');

const NORMAL_FIRST='91111111-1111-4111-8111-111111111111';
const QA_ID='92222222-2222-4222-8222-222222222222';
const rows=[
  {id:QA_ID,title:'QA ARTIFACT',body:'operational smoke evidence',source_ref:'qa:board-smoke:evidence-hygiene',published_at:'2026-09-16T19:30:00Z'},
  ...Array.from({length:30},(_,index)=>({
    id:index===0?NORMAL_FIRST:`93333333-3333-4333-8333-${String(index+1).padStart(12,'0')}`,
    title:`PUBLIC ARTIFACT ${String(index+1).padStart(2,'0')}`,
    body:`Audience evidence fixture ${index+1}`,
    source_ref:null,
    published_at:new Date(Date.parse('2026-09-16T19:29:00Z')-index*60000).toISOString()
  }))
];

const activityStub=()=>`
const source=${JSON.stringify(rows)};
const eligible=source.filter(row=>row.source_ref==null||!String(row.source_ref).startsWith('qa:'));
const projection=eligible.sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at)||String(b.id).localeCompare(String(a.id))).map(row=>({artifact_id:row.id,artifact_type:'announcement',title:row.title,excerpt:row.body,publisher_scope:'profile',publisher_display_name:'PUBLIC MEMBER',publisher_avatar_url:null,media_kind:'text',provider:'board',source_url:null,preview_url:null,type_source_label:'TEXT · BOARD',board_focus_url:'/workspace/board/?focus=artifact:'+row.id,published_at:row.published_at,activity_at:null}));
globalThis.__evidenceHygieneFixture={sourceIds:source.map(row=>row.id),eligibleIds:projection.map(row=>row.artifact_id),qaId:'${QA_ID}',normalId:'${NORMAL_FIRST}'};
export function createClient(){return{rpc:async(name,args={})=>{if(name!=='dc_public_activity_read_v1')return{data:[],error:null};const limit=Number(args.p_limit||12);let start=0;if(args.p_before_id){const index=projection.findIndex(row=>row.artifact_id===args.p_before_id);start=index>=0?index+1:projection.length}return{data:projection.slice(start,start+limit),error:null}}}}
`;

const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
function resolveFile(urlPath){let pathname=decodeURIComponent(new URL(urlPath,'http://local').pathname);if(pathname.endsWith('/'))pathname+='index.html';const full=path.resolve(artifact,pathname.replace(/^\/+/,''));return full.startsWith(path.resolve(artifact))?full:null}
const server=http.createServer((req,res)=>{const file=resolveFile(req.url||'/');if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('Not found');return}res.statusCode=200;res.setHeader('content-type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const localBase=`http://127.0.0.1:${server.address().port}`;

async function activityContext(browser,viewport){
  const ctx=await browser.newContext({viewport});
  await ctx.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm',route=>route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:activityStub()}));
  return ctx;
}

async function validateActivity(browser){
  for(const [label,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
    const ctx=await activityContext(browser,viewport);
    const page=await ctx.newPage();
    await page.goto(localBase+'/',{waitUntil:'domcontentloaded'});
    await page.locator('.dc-public-activity--home').waitFor({state:'visible',timeout:6000});
    const fixture=await page.evaluate(()=>globalThis.__evidenceHygieneFixture||null);
    expect(Boolean(fixture),`${label} home: evidence fixture missing`);
    expect(fixture?.sourceIds?.includes(QA_ID)===true,`${label} home: QA Artifact was not present in source dataset`);
    expect(fixture?.eligibleIds?.includes(QA_ID)===false,`${label} home: QA Artifact leaked through public read-model fixture`);
    expect(await page.locator(`[data-activity-id="${QA_ID}"]`).count()===0,`${label} home: QA Artifact rendered in public Activity`);
    expect(await page.locator(`[data-activity-id="${NORMAL_FIRST}"]:not([aria-hidden="true"])`).count()===1,`${label} home: ordinary public Artifact missing`);
    await ctx.close();
  }

  const ctx=await activityContext(browser,{width:1440,height:900});
  const page=await ctx.newPage();
  await page.goto(localBase+'/community/',{waitUntil:'domcontentloaded'});
  await page.locator('.dc-public-activity--community').waitFor({state:'visible',timeout:6000});
  expect(await page.locator(`[data-activity-id="${QA_ID}"]`).count()===0,'community: QA Artifact rendered in first page');
  expect(await page.locator(`[data-activity-id="${NORMAL_FIRST}"]`).count()===1,'community: ordinary public Artifact missing');
  const initial=await page.locator('[data-community-activity-grid] .dc-activity-card').count();
  expect(initial===24,`community: expected 24 ordinary rows before pagination, got ${initial}`);
  await page.locator('[data-community-activity-more]').click();
  await page.waitForFunction(()=>document.querySelectorAll('[data-community-activity-grid] .dc-activity-card').length>24,{timeout:4000});
  const after=await page.locator('[data-community-activity-grid] .dc-activity-card').count();
  expect(after===30,`community: expected all 30 ordinary rows after load more, got ${after}`);
  expect(await page.locator(`[data-activity-id="${QA_ID}"]`).count()===0,'community: QA Artifact leaked after pagination');
  await ctx.close();
}

async function analyticsContext(browser,{qa}){
  const external=[];
  const ctx=await browser.newContext();
  await ctx.addInitScript(({qa})=>{
    try{
      localStorage.setItem('dc_analytics_consent_v1','granted');
      if(qa)sessionStorage.setItem('dc_qa_session_v1','1');
      else sessionStorage.removeItem('dc_qa_session_v1');
    }catch{}
  },{qa});
  await ctx.route('https://dementor.club/**',route=>{
    const url=new URL(route.request().url());
    if(url.pathname==='/production-analytics-v1.js')return route.fulfill({status:200,contentType:'text/javascript; charset=utf-8',body:analytics});
    return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:'<!doctype html><html><head><title>Evidence Hygiene</title><script src="/production-analytics-v1.js"></script></head><body><main><a href="/projects/test/">TEST</a></main></body></html>'});
  });
  await ctx.route('https://www.googletagmanager.com/**',route=>{external.push('ga4');return route.fulfill({status:200,contentType:'text/javascript',body:'window.__EVIDENCE_HYGIENE_GA4_SDK__=true;'});});
  await ctx.route('https://www.clarity.ms/**',route=>{external.push('clarity');return route.fulfill({status:200,contentType:'text/javascript',body:'window.__EVIDENCE_HYGIENE_CLARITY_SDK__=true;'});});
  return{ctx,external};
}

async function validateAnalytics(browser){
  {
    const {ctx,external}=await analyticsContext(browser,{qa:true});
    const page=await ctx.newPage();
    await page.goto('https://dementor.club/__evidence_hygiene_qa__',{waitUntil:'domcontentloaded'});
    await sleep(150);
    const state=await page.evaluate(()=>({
      analytics:window.DEMENTOR_ANALYTICS?{production:window.DEMENTOR_ANALYTICS.production,ga4:window.DEMENTOR_ANALYTICS.ga4,clarity:window.DEMENTOR_ANALYTICS.clarity,consent:window.DEMENTOR_ANALYTICS.consent,trackResult:window.DEMENTOR_ANALYTICS.track('project_open',{entity_id:'qa'})}:null,
      gaScript:Boolean(document.querySelector('script[data-dc-ga4]')),
      clarityScript:Boolean(document.querySelector('script[data-dc-clarity]')),
      gtag:typeof window.gtag,
      clarity:typeof window.clarity,
      dataLayer:Array.isArray(window.dataLayer)?window.dataLayer.length:0,
      consentPrompt:Boolean(document.getElementById('dc-analytics-consent'))
    }));
    expect(external.length===0,`qa analytics: external SDK request leaked (${external.join(',')})`);
    expect(state.analytics?.production===true,'qa analytics: production origin was not recognized');
    expect(state.analytics?.ga4===false&&state.analytics?.clarity===false,'qa analytics: SDK state was enabled');
    expect(state.analytics?.trackResult===false,'qa analytics: semantic track() was not inert');
    expect(!state.gaScript&&!state.clarityScript,'qa analytics: tracker script element was injected');
    expect(state.gtag==='undefined'&&state.clarity==='undefined','qa analytics: global tracker API was created');
    expect(state.dataLayer===0,'qa analytics: dataLayer/page_view evidence was created');
    expect(state.consentPrompt===false,'qa analytics: consent boot should not run in QA session');
    await ctx.close();
  }

  {
    const {ctx,external}=await analyticsContext(browser,{qa:false});
    const page=await ctx.newPage();
    await page.goto('https://dementor.club/__evidence_hygiene_normal__',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>window.__EVIDENCE_HYGIENE_GA4_SDK__===true&&window.__EVIDENCE_HYGIENE_CLARITY_SDK__===true,{timeout:4000});
    await sleep(50);
    const state=await page.evaluate(()=>({
      analytics:window.DEMENTOR_ANALYTICS?{production:window.DEMENTOR_ANALYTICS.production,ga4:window.DEMENTOR_ANALYTICS.ga4,clarity:window.DEMENTOR_ANALYTICS.clarity,consent:window.DEMENTOR_ANALYTICS.consent}:null,
      gaScript:Boolean(document.querySelector('script[data-dc-ga4]')),
      clarityScript:Boolean(document.querySelector('script[data-dc-clarity]')),
      gtag:typeof window.gtag,
      clarity:typeof window.clarity,
      dataLayer:(window.dataLayer||[]).map(entry=>Array.from(entry))
    }));
    expect(external.includes('ga4'),'normal analytics: GA4 SDK request missing');
    expect(external.includes('clarity'),'normal analytics: Clarity SDK request missing');
    expect(state.analytics?.ga4===true&&state.analytics?.clarity===true,'normal analytics: SDK state did not enable');
    expect(state.analytics?.consent==='granted','normal analytics: granted consent was not preserved');
    expect(state.gaScript&&state.clarityScript,'normal analytics: tracker script elements missing');
    expect(state.gtag==='function'&&state.clarity==='function','normal analytics: tracker globals missing');
    expect(state.dataLayer.some(args=>args[0]==='event'&&args[1]==='page_view'),'normal analytics: manual page_view missing after GA4 load');
    await ctx.close();
  }
}

const browser=await chromium.launch({headless:true});
try{
  await validateActivity(browser);
  await validateAnalytics(browser);
}finally{
  await browser.close();
  server.close();
}

if(failures.length){
  console.error('EVIDENCE HYGIENE BROWSER BLOCKED');
  failures.forEach(message=>console.error(`- ${message}`));
  process.exit(1);
}
console.log('Evidence Hygiene browser acceptance: public Activity excludes qa: source evidence; normal Activity/pagination remain intact; QA analytics SDKs are hard-suppressed; normal consented analytics still boots.');
