import fs from 'node:fs';

const errors=[];
const read=path=>fs.readFileSync(path,'utf8');

const catalogPath='catalog/index.html';
const releasePath='.github/production-release.txt';

if(!fs.existsSync(catalogPath))errors.push(`${catalogPath}: missing`);
else{
  const html=read(catalogPath);

  const hardCountPatterns=[
    /REGISTER\s*\/\s*\d+/i,
    />ALL\s*\/\s*\d+</i,
    />PROGRAMS\s*\/\s*\d+</i,
    />EVENTS\s*\/\s*\d+</i,
    />PROJECTS\s*\/\s*\d+</i,
    />OBJECTS\s*\/\s*\d+</i,
    />WEAR\s*\/\s*\d+</i,
  ];
  for(const pattern of hardCountPatterns){
    if(pattern.test(html))errors.push(`${catalogPath}: hard volatile Catalog count is forbidden (${pattern})`);
  }

  const statusCells=[...html.matchAll(/<span\s+class=["']dc-global-row__status["'][^>]*>([^<]*)<\/span>/gi)].map(match=>match[1].trim());
  if(!statusCells.length)errors.push(`${catalogPath}: provenance/source column missing`);
  for(const value of statusCells){
    if(!/^SOURCE\s*\//i.test(value))errors.push(`${catalogPath}: Catalog row reasserts current status instead of provenance (${value})`);
  }

  for(const route of ['/projects/logic-awareness/','/projects/dementor-lab/']){
    if(!html.includes(`href="${route}"`)&&!html.includes(`href='${route}'`))errors.push(`${catalogPath}: project route missing independently of dc_entities: ${route}`);
  }

  for(const stale of ['PRODUCTION STAGE 1','IN DEVELOPMENT','WORKING ASSET / NOT OPEN','APPROVED / NOT OPEN']){
    if(html.includes(stale))errors.push(`${catalogPath}: stale live-looking status remains: ${stale}`);
  }

  if(!/Catalog[^<]*(?:вторич|secondary)/i.test(html)&&!html.includes('SECONDARY PROVENANCE SURFACE')){
    errors.push(`${catalogPath}: secondary/non-authoritative Catalog boundary is not explicit`);
  }
}

if(!fs.existsSync(releasePath))errors.push(`${releasePath}: missing`);
else{
  const release=read(releasePath);
  if(!/^STATUS=NON_AUTHORITATIVE_REFERENCE$/m.test(release))errors.push(`${releasePath}: must declare non-authoritative status semantics`);
  if(!/^CURRENT_DEPLOY_TRUTH=GITHUB_ACTIONS_LATEST_SUCCESSFUL_DEPLOY$/m.test(release))errors.push(`${releasePath}: current deploy truth must point to GitHub Actions latest successful deploy`);
  if(!/^CURRENT_DEPLOY_WORKFLOW=Deploy Dementor Production$/m.test(release))errors.push(`${releasePath}: deploy workflow pointer missing`);
  if(/READY_FOR_MANUAL_APPROVAL|PENDING=|STATUS=(?:DEPLOYED|READY|PENDING)/i.test(release))errors.push(`${releasePath}: stale current-state claim reintroduced`);
  if(!/Do not use it to decide whether production is pending, deployed, or approved/i.test(release))errors.push(`${releasePath}: non-authoritative usage warning missing`);
}

if(errors.length){
  console.error('CATALOG / RELEASE TRUTH v1 FAILED');
  for(const error of errors)console.error(`- ${error}`);
  process.exit(1);
}

console.log('CATALOG / RELEASE TRUTH v1 PASS');
console.log('- Catalog hard counts removed');
console.log('- Catalog rows expose provenance, not lifecycle/readiness truth');
console.log('- project-specific routes are independent of dc_entities presence');
console.log('- production-release.txt is a non-authoritative pointer to GitHub Actions deploy truth');
