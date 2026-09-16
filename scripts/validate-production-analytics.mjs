import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const out=path.join(root,'_site');
const GA='G-QTZY2GKZ4R';
const CLARITY='y9yuo1zabw';
const analyticsRel='production-analytics-v1.js';
const errors=[];

const count=(text,needle)=>text.split(needle).length-1;
const walk=(dir,files=[])=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);entry.isDirectory()?walk(full,files):files.push(full);}return files;};

if(!fs.existsSync(out)) errors.push('_site missing; production build must run first');
const analyticsPath=path.join(out,analyticsRel);
if(!fs.existsSync(analyticsPath)) errors.push(`${analyticsRel} missing from production artifact`);
else{
  const js=fs.readFileSync(analyticsPath,'utf8');
  if(count(js,GA)!==1) errors.push(`GA4 measurement id must occur exactly once in ${analyticsRel}`);
  if(count(js,CLARITY)!==1) errors.push(`Clarity project id must occur exactly once in ${analyticsRel}`);
  if(!js.includes("const ORIGIN='https://dementor.club'")) errors.push('analytics runtime must be origin-locked to https://dementor.club');
  if(!js.includes("CONSENT_KEY='dc_analytics_consent_v1'")) errors.push('analytics runtime must use explicit persisted consent');
  if(!js.includes("QA_SESSION_KEY='dc_qa_session_v1'")) errors.push('analytics runtime must use the canonical session-scoped QA marker');
  if(!js.includes("sessionStorage.getItem(QA_SESSION_KEY)==='1'")) errors.push('QA marker must be read from sessionStorage');
  if(js.includes("localStorage.getItem(QA_SESSION_KEY)")||js.includes("localStorage.setItem(QA_SESSION_KEY")) errors.push('QA analytics marker must never use localStorage');
  if(!js.includes("if(!isProduction||qaSession)return")) errors.push('analytics runtime must fail closed outside production and during QA sessions');
  const guardIndex=js.indexOf("if(!isProduction||qaSession)return");
  const gaBootIndex=js.indexOf('const loadGA4=');
  const clarityBootIndex=js.indexOf('const loadClarity=');
  const consentBootIndex=js.indexOf('const boot=');
  if(guardIndex<0||gaBootIndex<0||guardIndex>gaBootIndex) errors.push('QA guard must execute before GA4 boot owner is reachable');
  if(guardIndex<0||clarityBootIndex<0||guardIndex>clarityBootIndex) errors.push('QA guard must execute before Clarity boot owner is reachable');
  if(guardIndex<0||consentBootIndex<0||guardIndex>consentBootIndex) errors.push('QA guard must execute before consent boot');
  if(!js.includes("consent==='granted'")) errors.push('analytics runtime must not load trackers before granted consent');
  if(!js.includes("send_page_view:false")) errors.push('GA4 automatic page view must be disabled to prevent duplicates');
  if(!js.includes("pushState")||!js.includes("popstate")) errors.push('GA4 navigation tracking hooks are missing');
}

if(fs.existsSync(out)){
  const files=walk(out);
  const htmlFiles=files.filter(f=>f.endsWith('.html'));
  for(const full of htmlFiles){
    const rel=path.relative(out,full).replaceAll('\\','/');
    const html=fs.readFileSync(full,'utf8');
    if(count(html,'/production-analytics-v1.js')!==1) errors.push(`${rel}: production analytics runtime must be injected exactly once`);
    if(count(html,GA)>0||count(html,CLARITY)>0) errors.push(`${rel}: tracker IDs must not be duplicated inline`);
  }
  for(const full of files.filter(f=>/\.(?:html|js)$/i.test(f)&&path.basename(f)!==analyticsRel)){
    const text=fs.readFileSync(full,'utf8');
    const rel=path.relative(out,full).replaceAll('\\','/');
    if(count(text,GA)>0) errors.push(`${rel}: duplicate GA4 id outside production analytics runtime`);
    if(count(text,CLARITY)>0) errors.push(`${rel}: duplicate Clarity id outside production analytics runtime`);
  }
}

const privacyPath=path.join(out,'legal/privacy/index.html');
if(!fs.existsSync(privacyPath)) errors.push('legal/privacy/index.html missing');
else{
  const privacy=fs.readFileSync(privacyPath,'utf8').toLowerCase();
  if(!privacy.includes('google analytics')&&!privacy.includes('ga4')) errors.push('Privacy page must disclose GA4');
  if(!privacy.includes('clarity')) errors.push('Privacy page must disclose Microsoft Clarity');
  if(!privacy.includes('соглас')&&!privacy.includes('consent')) errors.push('Privacy page must describe analytics consent');
}

if(errors.length){
  console.error('PRODUCTION ANALYTICS BLOCKED');
  errors.forEach(e=>console.error(`- ${e}`));
  process.exit(1);
}
console.log(`Production analytics guard passed: GA4 ${GA}, Clarity ${CLARITY}, explicit consent, QA hard suppression, one runtime per public HTML page.`);
