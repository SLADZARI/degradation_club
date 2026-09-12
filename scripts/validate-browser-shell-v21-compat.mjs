import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const sourcePath=path.join(process.cwd(),'scripts','validate-browser-shell.mjs');
const tempPath=path.join(process.cwd(),'scripts','.validate-browser-shell-v21-runtime.mjs');
let source=fs.readFileSync(sourcePath,'utf8');

// The compatibility runtime must model the current canonical Board row shape.
// Hidden-state filtering uses `.is('board_hidden_at', null)`, so legacy QA fixtures
// without the column would be filtered out even though real pre-migration rows receive
// NULL after the additive schema migration.
source=source.replaceAll(
  'closed_at:null,expires_at:null,created_at:',
  'closed_at:null,activity_at:null,board_hidden_at:null,expires_at:null,created_at:'
);

const legacy=`// Existing Board participation must remain visible and lead to the canonical My Activity projection.
{
  const c=await context('member-activity'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});await workspaceShell(p,'/workspace/board/ activity member');
  const target=p.locator('[data-artifact="qa-target-artifact"]');
  try{await target.waitFor({state:'visible',timeout:5000})}catch{errors.push(\`/workspace/board/: activity fixture card did not render; errors=\${pageErrors.join(' | ')||'none'}\`)}
  if(await target.count()){
    expect(await target.getByRole('button',{name:'ОТКЛИК ОТПРАВЛЕН'}).count()===1,'Board participation: persisted response confirmation missing');
    expect(await target.getByRole('button',{name:'✓ ИНТЕРЕСНО'}).count()===1,'Board participation: persisted reaction state missing');
    const activityLink=target.getByRole('link',{name:'МОЯ АКТИВНОСТЬ'});expect(await activityLink.count()===1,'Board participation: My Activity discoverability link missing');
    if(await activityLink.count())expect((await activityLink.getAttribute('href'))==='/workspace/#activity','Board participation: My Activity destination drifted');
  }
  expect(!pageErrors.length,\`/workspace/board/ activity errors: \${pageErrors.join(' | ')}\`);await c.close();
}`;

const replacement=`// Board v2.1: the spatial card is discovery-only. Participation stays canonical in My Activity,
// while the card itself only opens the Artifact overlay and closing it preserves Board camera/context.
{
  const c=await context('member-activity'),p=await c.newPage(),pageErrors=[];p.on('pageerror',e=>pageErrors.push(e.message));
  await p.goto(base+'/workspace/board/',{waitUntil:'domcontentloaded'});await workspaceShell(p,'/workspace/board/ activity member');
  const target=p.locator('[data-artifact="qa-target-artifact"]');
  try{await target.waitFor({state:'visible',timeout:5000})}catch{errors.push(\`/workspace/board/: activity fixture card did not render; errors=\${pageErrors.join(' | ')||'none'}\`)}
  if(await target.count()){
    await p.waitForFunction(()=>document.querySelector('[data-artifact="qa-target-artifact"]')?.getAttribute('role')==='button',{timeout:3000}).catch(()=>errors.push('Board v2.1: spatial Artifact did not become the canonical open target'));
    expect(await target.getByRole('button',{name:'ОТКЛИК ОТПРАВЛЕН'}).count()===0,'Board v2.1: response action leaked onto spatial card');
    expect(await target.getByRole('button',{name:'✓ ИНТЕРЕСНО'}).count()===0,'Board v2.1: reaction action leaked onto spatial card');
    expect(await target.getByRole('link',{name:'МОЯ АКТИВНОСТЬ'}).count()===0,'Board v2.1: My Activity link leaked onto spatial card');
    expect((await target.getAttribute('role'))==='button','Board v2.1: spatial Artifact is not one open target');
    await p.waitForTimeout(120);
    const before=await p.locator('#boardHost').evaluate(el=>el.style.transform);
    await target.click();
    try{await p.locator('.dc-artifact-overlay:not([hidden])').waitFor({state:'visible',timeout:3000})}catch(e){errors.push(\`Board v2.1: Artifact overlay did not open: \${e.message}\`)}
    expect(await p.locator('.dc-artifact-overlay iframe').count()===1,'Board v2.1: Artifact overlay iframe missing');
    expect(await p.locator('.dcw-sidebar').getByRole('link',{name:'МОЯ АКТИВНОСТЬ'}).count()===1,'Board v2.1: canonical My Activity navigation missing from Workspace header');
    await p.locator('.dc-artifact-overlay__close').click();
    await p.locator('.dc-artifact-overlay').waitFor({state:'hidden',timeout:2000}).catch(()=>errors.push('Board v2.1: Artifact overlay did not close'));
    const after=await p.locator('#boardHost').evaluate(el=>el.style.transform);
    expect(after===before,'Board v2.1: closing Artifact overlay changed Board camera');
  }
  expect(!pageErrors.length,\`/workspace/board/ activity errors: \${pageErrors.join(' | ')}\`);await c.close();
}`;

if(!source.includes(legacy)){
  console.error('BROWSER SHELL V2.1 COMPAT BLOCKED: legacy Board participation block not found');
  process.exit(1);
}
source=source.replace(legacy,replacement).replace(
  'persisted Board participation -> My Activity projection',
  'open-first Board participation -> My Activity projection'
);
fs.writeFileSync(tempPath,source);
try{
  await import(pathToFileURL(tempPath).href+`?t=${Date.now()}`);
}finally{
  try{fs.unlinkSync(tempPath)}catch{}
}
