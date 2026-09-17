import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const expect=(ok,msg)=>{if(!ok)errors.push(msg)};
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

const projection=read('thing-projection-v1.js');
const data=read('courses/dumai-s-opasnostyu/data.js');
const core=read('courses/dumai-s-opasnostyu/core.js');
const screens1=read('courses/dumai-s-opasnostyu/screens-1.js');
const screens3b=read('courses/dumai-s-opasnostyu/screens-3b.js');
const bind=read('courses/dumai-s-opasnostyu/bind.js');
const index=read('courses/dumai-s-opasnostyu/index.html');
const siteConfig=read('site-config.js');
const analytics=read('production-analytics-v1.js');

expect(projection.includes("thingRef:'program:dengi-na-veter'"),'shared Program projection Thing ref drifted');
expect(projection.includes("href:'/courses/dengi-na-veter/'"),'shared Program projection route drifted');
expect(projection.includes("currentTruth:'Курс готов к прохождению.'"),'shared Program projection current truth drifted');
expect(projection.includes("title:'ДЕНЬГИ НА ВЕТЕР'"),'shared Program projection title drifted');
expect(data.includes("version:'v1'"),'continuation v1 version missing');
expect(data.includes('...globalThis.readDengiNaVeterThingProjection()'),'DSO continuation must consume shared Program projection');
expect(data.includes("actionLabel:'ПРОЙТИ КУРС'"),'continuation contextual CTA drifted');
expect(!data.includes("thingRef:'program:dengi-na-veter'"),'DSO data must not duplicate Dengi thingRef truth');
expect(!data.includes("href:'/courses/dengi-na-veter/'"),'DSO data must not duplicate Dengi canonical route');
expect(!data.includes("currentTruth:'Курс готов к прохождению.'"),'DSO data must not duplicate Dengi current truth');
expect(!data.includes("title:'ДЕНЬГИ НА ВЕТЕР'"),'DSO data must not duplicate Dengi title projection');
expect(index.includes('/thing-projection-v1.js'),'DSO route must load ThingProjection v1 boundary');
expect(index.indexOf('/thing-projection-v1.js')<index.indexOf('./data.js'),'ThingProjection boundary must load before DSO continuation composition');

expect(screens1.includes('ONLINE COURSE / PUBLIC RELEASE'),'public route does not literally identify the course as a release');
expect(bind.includes("'PUBLIC RELEASE / STAGE 1'"),'course chrome does not preserve PUBLIC RELEASE state');
expect(core.includes("lastSeenContinuationVersion:''"),'browser-local continuation seen version missing');
expect(core.includes('function continuationViewModel()'),'continuation view-state contract missing');
expect(core.includes("seen&&seen!==current"),'meaningful continuation delta contract missing');
expect(core.includes("if(view.isNew)recordCourseEvent('return_payoff'"),'return_payoff is not gated by a real version delta');

expect(!index.includes('/course-account-identity-v1.js'),'DSO public Stage 1 must not bind local course state to account identity');
expect(siteConfig.includes("const interactiveAuthRequired=runtimePath.includes('/courses/dengi-na-veter/')"),'DSO leaked back into mandatory auth gate');
expect(!siteConfig.includes("runtimePath.includes('/courses/dumai-s-opasnostyu/')||runtimePath.includes('/courses/dengi-na-veter/'))addScript('/program-account-sync-v1.js'"),'DSO leaked into server program sync');
expect(siteConfig.includes("if(runtimePath.includes('/courses/dengi-na-veter/'))addScript('/program-account-sync-v1.js'"),'remaining Dengi program sync owner drifted unexpectedly');

expect(screens3b.includes("recordCourseEvent('thing_experience_complete'"),'completion transition is not instrumented');
expect(screens3b.includes("recordCourseEvent('completion_artifact_view'"),'certificate view is not instrumented');
expect(screens3b.includes('data-course-continuation'),'certificate continuation projection missing');
expect((screens3b.match(/data-course-continuation-action/g)||[]).length===1,'certificate must expose exactly one primary continuation action');
expect(screens3b.indexOf('Сертификат повышенной подозрительности')<screens3b.indexOf('data-course-continuation'),'continuation must follow certificate, not become certificate semantics');
expect(!screens3b.includes('membership')&&!screens3b.includes('MEMBERSHIP'),'certificate runtime must not introduce Membership semantics');

expect(bind.includes("recordCourseEvent('thing_experience_start'"),'experience start transition is not instrumented');
expect(bind.includes("recordCourseEvent('thing_meaningful_progress'"),'meaningful progress transition is not instrumented');
expect(bind.includes("recordCourseEvent('continuation_open'"),'continuation open transition is not instrumented');

const events=['thing_experience_start','thing_meaningful_progress','thing_experience_complete','completion_artifact_view','continuation_open','return_payoff'];
for(const name of events)expect(analytics.includes(`'${name}'`),`production analytics allow-list missing ${name}`);
expect(analytics.includes("const BLOCKED_KEYS=/^(email|e_mail|name|full_name|phone|telephone|token|access_token|refresh_token|user_id|userid|supabase_id|answer|answers|free_text)$/i"),'analytics sensitive-key guard drifted');

const eventCode=[core,screens3b,bind].join('\n');
for(const blocked of ['state.email','state.decision','state.answers','state.user_id']){
  const lines=eventCode.split('\n').filter(line=>line.includes('recordCourseEvent('));
  expect(!lines.some(line=>line.includes(blocked)),`semantic analytics event leaks ${blocked}`);
}

const built=path.join(root,'_site');
if(fs.existsSync(built)){
  const builtCourse=path.join(built,'courses/dumai-s-opasnostyu');
  for(const rel of ['data.js','core.js','screens-1.js','screens-3b.js','bind.js'])expect(fs.existsSync(path.join(builtCourse,rel)),`built course missing ${rel}`);
  expect(fs.existsSync(path.join(built,'thing-projection-v1.js')),'built ThingProjection runtime missing');
  const builtAnalytics=path.join(built,'production-analytics-v1.js');
  expect(fs.existsSync(builtAnalytics),'built production analytics runtime missing');
  const builtIndex=path.join(builtCourse,'index.html');
  if(fs.existsSync(builtIndex)){
    const html=fs.readFileSync(builtIndex,'utf8');
    expect(!html.includes('/course-account-identity-v1.js'),'built DSO route unexpectedly binds local state to account identity');
    expect(html.includes('/thing-projection-v1.js'),'built DSO route missing ThingProjection boundary');
    expect(html.indexOf('/thing-projection-v1.js')<html.indexOf('./data.js'),'built DSO route loads continuation data before ThingProjection boundary');
  }
  if(fs.existsSync(path.join(builtCourse,'data.js'))){
    const builtData=fs.readFileSync(path.join(builtCourse,'data.js'),'utf8');
    expect(builtData.includes('...globalThis.readDengiNaVeterThingProjection()'),'built DSO continuation lost shared projection boundary');
  }
  if(fs.existsSync(path.join(builtCourse,'screens-3b.js'))){
    const builtScreens=fs.readFileSync(path.join(builtCourse,'screens-3b.js'),'utf8');
    expect(builtScreens.includes('data-course-continuation'),'built certificate continuation missing');
  }
}

if(errors.length){
  console.error('DUMAI RELEASE LOOP CONTRACT BLOCKED');
  errors.forEach(e=>console.error(`- ${e}`));
  process.exit(1);
}
console.log('Dumai s opasnostyu Release Loop v1 contract PASS');
console.log('✓ PUBLIC RELEASE literal state');
console.log('✓ browser-local Stage 1 has no mandatory auth/server course sync');
console.log('✓ certificate remains completion artifact');
console.log('✓ continuation consumes shared program:dengi-na-veter projection boundary');
console.log('✓ return_payoff requires continuation version delta');
console.log('✓ existing production analytics owner carries six causal events');
