import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const root=process.env.DEMENTOR_LAB_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const viewports=[{name:'iPhone13-ish',width:390,height:844},{name:'small-phone',width:320,height:568}];

for(const viewport of viewports){
  const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto(`${root}/prototypes/portrait-flow-v0.8.html?ux=${viewport.name}`,{waitUntil:'networkidle'});
  async function noOverflow(label){const dims=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:window.innerWidth}));assert.ok(dims.w<=dims.v+1,`${viewport.name}/${label}: horizontal overflow ${dims.w}>${dims.v}`)}
  async function visibleButtonTargets(label){const boxes=await page.locator('button:visible').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return {text:(n.textContent||'').trim().slice(0,40),w:r.width,h:r.height}}));for(const b of boxes)assert.ok(b.h>=44,`${viewport.name}/${label}: touch target <44px: ${b.text} (${b.h})`)}
  async function leadReadable(label){const sizes=await page.locator('.screen:visible .lead').evaluateAll(nodes=>nodes.map(n=>parseFloat(getComputedStyle(n).fontSize)));for(const s of sizes)assert.ok(s>=15,`${viewport.name}/${label}: lead font ${s}px <15px`)}
  async function onePrimary(label){assert.equal(await page.locator('.screen:visible button.primary:visible').count(),1,`${viewport.name}/${label}: first-run screen needs one dominant primary CTA`)}

  await noOverflow('intro');await visibleButtonTargets('intro');await leadReadable('intro');await onePrimary('intro');
  await page.locator('#intro [data-go="name"]').click();await noOverflow('name');await visibleButtonTargets('name');await leadReadable('name');await onePrimary('name');
  await page.locator('#name [data-go="portrait"]').click();await noOverflow('portrait');await visibleButtonTargets('portrait');await leadReadable('portrait');await onePrimary('portrait');
  const portraitBox=await page.locator('#portraitEdit').boundingBox();assert.ok(portraitBox.height>=viewport.height*.45,`${viewport.name}: portrait must dominate identity screen`);
  await page.locator('#portrait [data-go="setup"]').click();await noOverflow('case');await visibleButtonTargets('case');await leadReadable('case');await onePrimary('case');
  assert.equal(await page.locator('#caseOpponent').count(),1,`${viewport.name}: opponent must be introduced before the round`);
  await page.locator('#setup [data-go="brain"]').click();await noOverflow('brain');await visibleButtonTargets('brain');await onePrimary('brain');
  await page.locator('#start').click();await noOverflow('preflight');await visibleButtonTargets('preflight');await onePrimary('preflight');
  assert.equal(await page.locator('#vs').isVisible(),true,`${viewport.name}: preflight must be visible before TALK`);
  await page.locator('#launch').click();await noOverflow('talk');
  assert.equal(await page.locator('#talk .metric').count(),2,`${viewport.name}: TALK may persist only BRAIN + CONTACT`);
  assert.equal(await page.locator('#whyPanel').isVisible(),false,`${viewport.name}: causal explanation is progressive disclosure, not permanent telemetry`);
  await page.locator('#next').click();
  assert.equal(await page.locator('#talk .portrait.speaking').count(),1,`${viewport.name}: current speaker must be visually identifiable`);
  assert.ok(await page.locator('#dialogue .bubble').count()>=1,`${viewport.name}: dialogue must own the active interaction`);
  await page.locator('#whyToggle').click();assert.equal(await page.locator('#whyPanel').isVisible(),true,`${viewport.name}: human WHY disclosure opens on demand`);
  for(const id of ['#whyAction','#whyEvent','#whyTrigger'])assert.ok((await page.locator(id).textContent()).trim().length>1,`${viewport.name}: WHY row ${id} needs human copy`);
  await visibleButtonTargets('talk');
  const transition=await page.locator('#pa svg').evaluate(el=>getComputedStyle(el).transitionDuration);assert.ok(transition==='0s'||transition.includes('0s'),`${viewport.name}: reduced-motion preference must disable portrait transitions`);
  await context.close();
}

console.log('portrait v0.8 quantitative UX browser gate: PASS — preflight, progressive WHY, reduced motion, 320/390px widths, touch targets, type, portrait dominance and two-metric TALK');
await browser.close();
