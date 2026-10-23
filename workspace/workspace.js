import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const view=document.getElementById('appView');
const topTitle=document.getElementById('topTitle');
const workNav=document.querySelector('[data-work-nav]');
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const state={client:null,session:null,user:null,profile:null,membership:null,roles:[],assignments:[],entities:[],programs:new Map(),events:new Map(),tests:[],enrollments:[],orders:[],joinApplications:[],artifacts:[],responses:[],reactions:[],route:'home',entityId:null,systemView:false,moduleStatus:{},moduleReads:{},moduleRequests:new Map()};

const DEMENTORS=[
  {slug:'valentin',name:'Валентин',portrait:'assets/people/dementors/valentin/portrait-ink.webp'},
  {slug:'nikita',name:'Никита',portrait:'assets/people/dementors/nikita/portrait-ink.webp'},
  {slug:'evgeniy',name:'Евгений',portrait:'assets/people/dementors/evgeniy/portrait-ink.webp'},
  {slug:'gabil',name:'Габиль',portrait:'assets/people/dementors/gabil/portrait-ink.webp'}
];
const SPHERES={personality:'Личность',work:'Работа',consumption:'Потребление',relationships:'Отношения',control:'Контроль',information:'Информация',self_development:'Саморазвитие',meaning:'Смысл',technology:'Технологии'};
const COURSE_NAMES={'dumai-s-opasnostyu':'Думай с опасностью','dengi-na-veter':'Деньги на ветер','slaboumie-i-otvaga':'Слабоумие и отвага','ne-komanda':'НЕ КОМАНДА'};

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const basePath=()=>location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
const siteUrl=path=>basePath()+'/'+String(path||'').replace(/^\//,'');
const isActiveWindow=row=>row?.status==='active'&&(!row.valid_from||Date.parse(row.valid_from)<=Date.now())&&(!row.valid_to||Date.parse(row.valid_to)>Date.now());
const verified=name=>state.moduleStatus[name]?.state==='available';
const authzKnown=()=>['membership','roles','assignments'].every(verified);
const activeRoles=()=>authzKnown()?state.roles.filter(isActiveWindow):[];
const hasRole=role=>activeRoles().some(r=>r.role===role);
const isOwnerAdmin=()=>authzKnown()&&hasRole('owner_admin');
const isDementor=()=>authzKnown()&&(hasRole('dementor')||isOwnerAdmin());
const isMember=()=>authzKnown()&&(isActiveWindow(state.membership)||hasRole('club_member')||isDementor());
const hasWork=()=>authzKnown()&&(state.assignments.length>0||isDementor());
const avatar=()=>state.profile?.avatar_url||state.user?.user_metadata?.avatar_url||state.user?.user_metadata?.picture||'';
const displayName=()=>state.profile?.full_name||state.user?.user_metadata?.full_name||state.user?.email||'Участник';
const roleBadge=r=>`<span class="dcw-badge dcw-badge--role">${esc(String(r||'').toUpperCase())}</span>`;
const statusBadge=s=>`<span class="dcw-badge dcw-badge--${s==='active'?'active':s==='planned'?'planned':'waiting'}">${esc(String(s||'').toUpperCase())}</span>`;

function effectiveState(){
  if(!authzKnown())return{key:'unknown',label:'СТАТУС ДОСТУПА НЕ ПРОВЕРЕН',member:false};
  if(isOwnerAdmin())return{key:'owner_admin',label:'OWNER_ADMIN / DEMENTOR',member:true};
  if(hasRole('dementor'))return{key:'dementor',label:'DEMENTOR',member:true};
  if(isMember())return{key:'member',label:'ЧЛЕН DEMENTOR CLUB',member:true};
  return{key:'guest',label:'ЗАРЕГИСТРИРОВАННЫЙ ГОСТЬ',member:false};
}

function gate(title,text,action=''){view.innerHTML=`<section class="dcw-gate"><div class="dcw-denied"><h2>${esc(title)}</h2><p>${esc(text)}</p>${action}</div></section>`;}
async function login(){const next=basePath()+'/workspace/';const callback=location.origin+basePath()+'/auth/callback/?next='+encodeURIComponent(next);const {error}=await state.client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback,queryParams:{prompt:'select_account'}}});if(error)throw error;}

const READ_LIMIT_MS=6500;
const MODULE_LABELS={
  membership:'Членство',roles:'Роли',assignments:'Назначения',tests:'История DC-9',
  courses:'Участие в программах',orders:'История покупок',joinApplications:'Заявки',
  artifacts:'Мои артефакты',responses:'Мои отклики',reactions:'Мои реакции',work:'Рабочие сущности'
};
function publicErrorCode(error){
  const code=String(error?.code||'UNAVAILABLE');
  return /^[A-Z0-9_]{1,40}$/i.test(code)?code:'UNAVAILABLE';
}
function readWithin(fetch){
  let timeoutId;
  const request=Promise.resolve().then(fetch).then(
    value=>value||{data:null,error:{code:'EMPTY_RESULT'}},
    error=>({data:null,error})
  );
  const timeout=new Promise(resolve=>{timeoutId=setTimeout(()=>resolve({data:null,error:{code:'QUERY_TIMEOUT'}}),READ_LIMIT_MS);});
  return Promise.race([request,timeout]).finally(()=>clearTimeout(timeoutId));
}
function markUnavailable(name,error){
  state.moduleStatus[name]={state:'unavailable',code:publicErrorCode(error)};
}
function emptyFor(name){return name==='membership'?null:[];}
async function fetchOptional(name){
  if(state.moduleRequests.has(name))return state.moduleRequests.get(name);
  const source=state.moduleReads[name];
  if(!source)return false;
  const uid=state.user?.id;
  state.moduleStatus[name]={state:'retrying'};
  const task=(async()=>{
    const result=await readWithin(source.read);
    if(uid!==state.user?.id)return false;
    if(result.error){
      markUnavailable(name,result.error);
      state[source.field]=emptyFor(name);
      return false;
    }
    state[source.field]=source.map?source.map(result.data):(result.data??emptyFor(name));
    state.moduleStatus[name]={state:'available'};
    return true;
  })().finally(()=>state.moduleRequests.delete(name));
  state.moduleRequests.set(name,task);
  return task;
}
function unavailableMarkup(name){
  return '<div class="dcw-note" data-unavailable-content="'+esc(name)+'">'+
    esc(MODULE_LABELS[name]||name)+' — источник временно недоступен. Данные не изменены.</div>';
}
function moduleAlerts(){
  return Object.keys(state.moduleStatus).filter(key=>state.moduleStatus[key]?.state==='unavailable')
    .map(key=>'<div class="dcw-note" role="status" data-module-error="'+esc(key)+'">'+
      esc(MODULE_LABELS[key]||key)+' временно недоступен ('+esc(state.moduleStatus[key].code)+'). '+
      '<button type="button" data-retry-module="'+esc(key)+'">ПОВТОРИТЬ</button></div>').join('');
}
function visibleCount(name,list){return verified(name)?String(list.length):'—';}

async function loadIdentity(){
  const sessionResult=await readWithin(()=>state.client.auth.getSession());
  if(sessionResult.error)throw sessionResult.error;
  state.session=sessionResult.data?.session||null;
  if(!state.session){
    gate('ДОБРО ПОЖАЛОВАТЬ В DEMENTOR CLUB','Войдите через Google, чтобы открыть личный кабинет, историю участия, тестов, курсов и покупок.','<button type="button" class="dcw-login" data-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button>');
    view.querySelector('[data-login]')?.addEventListener('click',()=>login().catch(showError));
    return false;
  }
  const userResult=await readWithin(()=>state.client.auth.getUser());
  if(userResult.error)throw userResult.error;
  if(!userResult.data?.user)throw new Error('Authenticated user missing after session validation');
  state.user=userResult.data.user;
  const uid=state.user.id;
  const profileResult=await readWithin(()=>state.client.from('profiles').select('id,email,full_name,avatar_url').eq('id',uid).maybeSingle());
  if(profileResult.error)throw profileResult.error;
  state.profile=profileResult.data||null;
  state.moduleReads={
    membership:{field:'membership',read:()=>state.client.from('dc_system_memberships').select('*').eq('profile_id',uid).maybeSingle()},
    roles:{field:'roles',read:()=>state.client.from('dc_role_assignments').select('*').eq('profile_id',uid)},
    assignments:{field:'assignments',read:()=>state.client.from('dc_entity_assignments').select('*').eq('profile_id',uid),map:rows=>(rows||[]).filter(isActiveWindow)},
    tests:{field:'tests',read:()=>state.client.from('assessment_runs').select('id,sphere_id,assessment_version,result_json,completed_at,created_at').eq('profile_id',uid).order('completed_at',{ascending:false}).limit(50)},
    courses:{field:'enrollments',read:()=>state.client.from('course_enrollments').select('id,course_id,status,created_at,updated_at').eq('profile_id',uid).order('created_at',{ascending:false}).limit(50)},
    orders:{field:'orders',read:()=>state.client.from('orders').select('id,reference,status,currency,total_eur,created_at,updated_at').eq('profile_id',uid).order('created_at',{ascending:false}).limit(50)},
    joinApplications:{field:'joinApplications',read:()=>state.client.from('join_applications').select('id,status,source,created_at,reviewed_at').eq('profile_id',uid).order('created_at',{ascending:false}).limit(5)},
    artifacts:{field:'artifacts',read:()=>state.client.from('dc_artifacts').select('id,title,body,status,visibility,published_at,closed_at,expires_at,created_at,updated_at').eq('author_profile_id',uid).order('created_at',{ascending:false}).limit(50)},
    responses:{field:'responses',read:()=>state.client.from('dc_artifact_responses').select('id,artifact_id,message,status,created_at,updated_at,artifact:dc_artifacts!dc_artifact_responses_artifact_id_fkey(id,title,body,status,visibility,published_at,closed_at,expires_at)').eq('responder_profile_id',uid).order('created_at',{ascending:false}).limit(50)},
    reactions:{field:'reactions',read:()=>state.client.from('dc_artifact_reactions').select('id,artifact_id,reaction_type,created_at,artifact:dc_artifacts!dc_artifact_reactions_artifact_id_fkey(id,title,body,status,visibility,published_at,closed_at,expires_at)').eq('profile_id',uid).order('created_at',{ascending:false}).limit(50)}
  };
  state.moduleStatus={};state.moduleRequests.clear();
  await Promise.all(Object.keys(state.moduleReads).map(fetchOptional));
  return true;
}
async function loadEntities({all=false}={}){
  state.entities=[];state.programs=new Map();state.events=new Map();
  if(!authzKnown()){markUnavailable('work',{code:'ACCESS_UNVERIFIED'});return;}
  state.moduleStatus.work={state:'retrying'};
  try{
    let entities=[];
    const ids=state.assignments.map(a=>a.entity_id);
    if(all&&isOwnerAdmin()){
      const result=await readWithin(()=>state.client.from('dc_entities').select('*').order('entity_type').order('title'));
      if(result.error)throw result.error;
      entities=result.data||[];
    }else if(ids.length){
      const result=await readWithin(()=>state.client.from('dc_entities').select('*').in('id',ids).order('entity_type').order('title'));
      if(result.error)throw result.error;
      entities=result.data||[];
    }
    const programs=new Map(),events=new Map();
    const pids=entities.filter(e=>e.entity_type==='program').map(e=>e.id);
    const eids=entities.filter(e=>e.entity_type==='event').map(e=>e.id);
    if(pids.length){
      const result=await readWithin(()=>state.client.from('dc_programs').select('*').in('entity_id',pids));
      if(result.error)throw result.error;
      (result.data||[]).forEach(row=>programs.set(row.entity_id,row));
    }
    if(eids.length){
      const result=await readWithin(()=>state.client.from('dc_events').select('*').in('entity_id',eids));
      if(result.error)throw result.error;
      (result.data||[]).forEach(row=>events.set(row.entity_id,row));
    }
    state.entities=entities;state.programs=programs;state.events=events;
    state.moduleStatus.work={state:'available'};
  }catch(error){
    state.entities=[];state.programs=new Map();state.events=new Map();
    markUnavailable('work',error);
  }
}

function assignmentFor(id){return state.assignments.find(a=>a.entity_id===id)||null;}
function provenance(e){return `<div class="dcw-provenance">SOURCE: ${esc(e.source_ref||'—')} · ${esc(e.provenance_status||'—')}</div>`;}
function head(title,desc){return `<div class="dcw-page-head"><div><div class="dcw-kicker">DEMENTOR CLUB / ${esc(displayName()).toUpperCase()}</div><h1>${esc(title)}</h1></div><p>${esc(desc)}</p></div>`;}
function statusMarkup(){const s=effectiveState();return `<span class="dcw-status-main ${s.key==='guest'?'is-acid':'is-member'}">${esc(s.label)}</span>${s.member?'<span class="dcw-badge dcw-badge--active">MEMBER ✓</span>':''}`;}
function excerpt(value,max=120){const text=String(value||'').trim().replace(/\s+/g,' ');return text.length>max?text.slice(0,max-1).trimEnd()+'…':text;}
function artifactTitle(artifact){return artifact?.title||excerpt(artifact?.body,72)||'Артефакт';}
function artifactStatus(value){return({draft:'ЧЕРНОВИК',publishing:'ПУБЛИКУЕТСЯ',active:'НА ДОСКЕ',expired:'СРОК ИСТЁК',archived:'В АРХИВЕ',removed:'УДАЛЁН'})[value]||'НЕДОСТУПНО';}
function responseStatus(value){return value==='submitted'?'ОТПРАВЛЕН':value==='withdrawn'?'ОТОЗВАН':String(value||'—').toUpperCase();}

function home(){
  const s=effectiveState();const img=avatar()?`<img src="${esc(avatar())}" alt="${esc(displayName())}">`:'';
  return `<div class="dcw-person-hero"><div class="dcw-person-portrait">${img}</div><div class="dcw-welcome"><div><div class="dcw-kicker">ЛИЧНЫЙ КАБИНЕТ</div><h1>Добро пожаловать в клуб</h1></div><div><div class="dcw-status-line">${statusMarkup()}</div><p>${s.key==='unknown'?'Статус членства и ролей не проверен. Повторите запросы ниже.':s.member?'Членство подтверждено. Дополнительные рабочие возможности появляются только из ролей и assignments.':'Аккаунт зарегистрирован. Вход в клуб и рабочие роли являются отдельными состояниями.'}</p></div></div></div>
  <div class="dcw-dashboard-grid">
    <button class="dcw-dashboard-card" data-route="club"><span>КЛУБ</span><strong>${s.key==='unknown'?'—':s.member?'✓':'→'}</strong><small>${s.key==='unknown'?'статус не проверен':s.member?'членство активно':'стать членом клуба'}</small></button>
    <button class="dcw-dashboard-card" data-route="activity"><span>ПРОЙДЕННЫЕ ТЕСТЫ</span><strong>${visibleCount('tests',state.tests)}</strong><small>DC-9 / account archive</small></button>
    <button class="dcw-dashboard-card" data-route="activity"><span>МОИ КУРСЫ</span><strong>${visibleCount('courses',state.enrollments)}</strong><small>enrollments</small></button>
    <button class="dcw-dashboard-card" data-route="activity"><span>ПОКУПКИ</span><strong>${visibleCount('orders',state.orders)}</strong><small>order archive</small></button>
  </div>
  ${hasWork()?`<div class="dcw-section"><div class="dcw-section-head"><h2>Моя работа</h2><span class="dcw-source">ROLE + ASSIGNMENT DRIVEN</span></div>${state.entities.length?`<div class="dcw-list">${state.entities.map(entityRow).join('')}</div>`:'<div class="dcw-empty-live">Роль есть, но активных рабочих assignments пока нет.</div>'}</div>`:''}`;
}

function club(){const s=effectiveState();const latest=state.joinApplications[0];
  if(s.key==='unknown')return head('Мой клуб','Учетная запись активна. Членство и роли пока не проверены.')+
    '<section class="dcw-membership-panel"><h2>СТАТУС ДОСТУПА НЕ ПРОВЕРЕН</h2><p>Права и членство не изменены. Повторите проверку ниже.</p></section>';
  const membershipBlock=s.member?`<div><div class="dcw-kicker">MEMBERSHIP</div><h2>✓ ЧЛЕН КЛУБА</h2><p>Статус членства активен. Для Dementor и OWNER_ADMIN членский уровень входит в иерархию доступа.</p><div class="dcw-actions-row"><button class="dcw-secondary" disabled>УСТАВ КЛУБА — НЕ ОПУБЛИКОВАН</button></div><div class="dcw-note">Утверждённый источник устава не найден ни в текущем Git source-of-truth, ни в доступных материалах Drive. Поэтому документ не подменяется выдуманным текстом.</div></div>`:`<div><div class="dcw-kicker">MEMBERSHIP</div><h2>СТАТЬ ЧЛЕНОМ КЛУБА</h2><p>Сейчас вы зарегистрированный гость. Authentication не создаёт membership автоматически.</p><div class="dcw-actions-row"><button class="dcw-primary" data-membership-info>СТАТЬ ЧЛЕНОМ КЛУБА</button></div><div class="dcw-note" data-membership-note hidden>Механика вступления, подтверждения и возможной оплаты пока не утверждена. Кнопка фиксирует продуктовый следующий шаг, но не создаёт фиктивную заявку.</div>${latest?`<div class="dcw-note">Последняя существующая запись join_application: <strong>${esc(latest.status)}</strong> · ${esc(latest.created_at||'')}</div>`:''}</div>`;
  return `${head('Мой клуб','Общая поверхность для любого авторизованного человека. Membership и роль добавляются поверх аккаунта.')}<div class="dcw-membership-panel">${membershipBlock}<div><div class="dcw-kicker">ТЕКУЩИЙ СТАТУС</div><h2>${esc(s.label)}</h2><p>Identity ≠ membership ≠ role. Права на рабочие сущности определяются отдельно.</p>${activeRoles().length?`<div class="dcw-badges">${activeRoles().map(r=>roleBadge(r.role)).join('')}</div>`:''}</div></div><div class="dcw-section"><div class="dcw-section-head"><h2>Дементоры клуба</h2><a class="dcw-secondary" href="${siteUrl('community/')}">ВСЕ ДЕМЕНТОРЫ →</a></div><div class="dcw-roster">${DEMENTORS.map(d=>`<a class="dcw-dementor" href="${siteUrl('community/'+d.slug+'/')}"><img src="${siteUrl(d.portrait)}" alt="${esc(d.name)}"><div class="dcw-dementor-copy"><span>DEMENTOR</span><strong>${esc(d.name)}</strong><span>Открыть профиль →</span></div></a>`).join('')}</div></div>`;
}

function communityArtifacts(){if(!verified('artifacts'))return unavailableMarkup('artifacts');return state.artifacts.length?state.artifacts.map(a=>`<div class="dcw-archive-row" data-activity-artifact="${esc(a.id)}"><time>${esc(formatDate(a.published_at||a.created_at))}</time><div><strong>${esc(artifactTitle(a))}</strong><br><small>АРТЕФАКТ · ${esc(artifactStatus(a.status))} · COMMUNITY</small></div><span>${esc(artifactStatus(a.status))}</span></div>`).join(''):'<div class="dcw-empty-live">Вы ещё не создавали Artifact.</div>';}
function communityResponses(){if(!verified('responses'))return unavailableMarkup('responses');return state.responses.length?state.responses.map(r=>{const target=r.artifact||null;const detail=r.message?excerpt(r.message,120):'Отклик без сообщения';return `<div class="dcw-archive-row" data-activity-response="${esc(r.id)}"><time>${esc(formatDate(r.created_at))}</time><div><strong>Отклик → ${esc(artifactTitle(target))}</strong><br><small>${esc(detail)} · ОБЪЯВЛЕНИЕ: ${esc(artifactStatus(target?.status))}</small></div><span>${esc(responseStatus(r.status))}</span></div>`;}).join(''):'<div class="dcw-empty-live">Отправленных откликов пока нет.</div>';}
function communityReactions(){if(!verified('reactions'))return unavailableMarkup('reactions');return state.reactions.length?state.reactions.map(r=>{const target=r.artifact||null;return `<div class="dcw-archive-row" data-activity-reaction="${esc(r.id)}"><time>${esc(formatDate(r.created_at))}</time><div><strong>Мне это надо → ${esc(artifactTitle(target))}</strong><br><small>REACTION · ОБЪЯВЛЕНИЕ: ${esc(artifactStatus(target?.status))}</small></div><span>${r.reaction_type==='interested'?'ИНТЕРЕСНО':esc(String(r.reaction_type||'—').toUpperCase())}</span></div>`;}).join(''):'<div class="dcw-empty-live">Отмеченных объявлений пока нет.</div>';}
function activity(){return `${head('Моя активность','Здесь остаётся история вашего участия: что вы опубликовали, на что откликнулись, что отметили, а также тесты, курсы и покупки.')}<div class="dcw-activity-block" data-community-activity><div class="dcw-section-head"><h2>Участие в клубе</h2><div class="dcw-actions-row"><a class="dcw-secondary" href="${siteUrl('workspace/board/')}">НА ДОСКУ →</a><a class="dcw-secondary" href="${siteUrl('workspace/artifacts/')}">МОИ АРТЕФАКТЫ →</a></div></div><div class="dcw-status-line"><span class="dcw-badge">АРТЕФАКТЫ ${visibleCount("artifacts",state.artifacts)}</span><span class="dcw-badge">ОТКЛИКИ ${visibleCount("responses",state.responses)}</span><span class="dcw-badge">РЕАКЦИИ ${visibleCount("reactions",state.reactions)}</span></div></div><div class="dcw-activity-block"><h2>Мои артефакты</h2>${communityArtifacts()}</div><div class="dcw-activity-block"><h2>Мои отклики</h2>${communityResponses()}</div><div class="dcw-activity-block"><h2>Мои реакции</h2>${communityReactions()}</div><div class="dcw-activity-block"><h2>Пройденные тесты</h2>${!verified("tests")?unavailableMarkup("tests"):state.tests.length?state.tests.map(t=>`<div class="dcw-archive-row"><time>${esc(formatDate(t.completed_at||t.created_at))}</time><div><strong>${esc(SPHERES[t.sphere_id]||t.sphere_id||'DC-9')}</strong><br><small>${esc(t.assessment_version||'')}</small></div><span>${esc(testResult(t))}</span></div>`).join(''):'<div class="dcw-empty-live">Завершённых тестов в аккаунте пока нет.</div>'}</div><div class="dcw-activity-block"><h2>Мои курсы</h2>${!verified("courses")?unavailableMarkup("courses"):state.enrollments.length?state.enrollments.map(c=>`<div class="dcw-archive-row"><time>${esc(formatDate(c.created_at))}</time><div><strong>${esc(COURSE_NAMES[c.course_id]||c.course_id)}</strong></div><span>${esc(c.status||'—')}</span></div>`).join(''):'<div class="dcw-empty-live">Course enrollments пока отсутствуют.</div>'}</div><div class="dcw-activity-block"><h2>Архив покупок</h2>${!verified("orders")?unavailableMarkup("orders"):state.orders.length?state.orders.map(o=>`<div class="dcw-archive-row"><time>${esc(formatDate(o.created_at))}</time><div><strong>${esc(o.reference||'Заказ')}</strong><br><small>${esc(o.status||'—')}</small></div><span>${o.total_eur!=null?esc(o.total_eur)+' '+esc(o.currency||'EUR'):''}</span></div>`).join(''):'<div class="dcw-empty-live">Покупок в аккаунте пока нет.</div>'}</div>`;}

function profile(){const s=effectiveState();return `${head('Мой профиль','Один PERSON / auth identity. Membership, роли и рабочие сущности являются отдельными связями.')}<div class="dcw-profile-grid"><div class="dcw-card">${avatar()?`<img class="dcw-profile-photo" src="${esc(avatar())}" alt="${esc(displayName())}">`:''}<h2>${esc(displayName())}</h2><p>${esc(state.user?.email||'')}</p><div class="dcw-status-line">${statusMarkup()}</div></div><div class="dcw-card"><h2>Доступ</h2><div class="dcw-field"><span>ACCOUNT</span><strong>AUTHENTICATED</strong></div><div class="dcw-field"><span>MEMBERSHIP</span><strong>${s.key==='unknown'?'НЕ ПРОВЕРЕН':s.member?'ACTIVE':'NOT ASSIGNED'}</strong></div><div class="dcw-field"><span>ROLES</span><strong>${s.key==='unknown'?'НЕ ПРОВЕРЕН':esc(activeRoles().map(r=>r.role).join(' / ')||'—')}</strong></div><div class="dcw-field"><span>WORK ASSIGNMENTS</span><strong>${s.key==='unknown'?'—':state.assignments.length}</strong></div><div class="dcw-source-ref">USER ID: ${esc(state.user.id)}</div></div></div>`;}

function entityRow(e){const sub=e.entity_type==='program'?state.programs.get(e.id):state.events.get(e.id);const a=assignmentFor(e.id);const detail=e.entity_type==='program'?`${sub?.program_type||''} · ${sub?.delivery_mode||''}`:(sub?.location||'');return `<div class="dcw-row" data-entity="${esc(e.id)}"><div class="dcw-row-title"><strong>${esc(e.title)}</strong><span class="dcw-row-meta">${esc(e.entity_type)} · ${esc(detail)} · ${esc(e.summary||'')}</span>${provenance(e)}</div><div class="dcw-row-actions">${roleBadge(a?.role||(state.systemView&&isOwnerAdmin()?'owner_admin / system':'viewer'))} ${statusBadge(e.status)} <span class="dcw-arrow">→</span></div></div>`;}
function work(){
  if(!authzKnown())return head('Моя работа','Сначала требуется подтверждение роли и членства.')+unavailableMarkup('work');
  if(!verified('work'))return head('Моя работа','Рабочие сущности временно недоступны.')+unavailableMarkup('work');
  if(!hasWork())return `${head('Моя работа','Рабочие поверхности появляются только при соответствующей роли или entity assignment.')}<div class="dcw-empty-live">У этого аккаунта нет рабочих сущностей Dementor Club.</div>`;return `${head('Моя работа',state.systemView?'OWNER_ADMIN system view: все Dementor Club entities, разрешённые RLS.':'Только рабочие сущности текущего человека.')}<div class="dcw-filters"><button class="dcw-filter is-active">${state.systemView?'SYSTEM VIEW':'MY ASSIGNMENTS'}</button>${isOwnerAdmin()?`<button class="dcw-filter" data-system-view>${state.systemView?'МОИ ASSIGNMENTS':'ВСЕ DC ENTITIES'}</button>`:''}</div>${state.entities.length?`<div class="dcw-list">${state.entities.map(entityRow).join('')}</div>`:'<div class="dcw-empty-live">Нет активных рабочих сущностей.</div>'}`;}
function entityPage(){const e=state.entities.find(x=>x.id===state.entityId);if(!e)return '<div class="dcw-empty-live">Entity недоступна.</div>';const a=assignmentFor(e.id),p=state.programs.get(e.id),ev=state.events.get(e.id);return `<button type="button" class="dcw-filter" data-route="work">← MY WORK</button><div class="dcw-entity-hero"><div><div class="dcw-badges">${roleBadge(a?.role||(isOwnerAdmin()?'owner_admin':'viewer'))} ${statusBadge(e.status)}</div><h1>${esc(e.title)}</h1><p>${esc(e.summary||'')}</p>${provenance(e)}</div><div class="dcw-entity-meta">${e.entity_type==='program'?`<div class="dcw-meta-pair"><span>TYPE</span><strong>${esc(p?.program_type||'—')}</strong></div><div class="dcw-meta-pair"><span>DELIVERY</span><strong>${esc(p?.delivery_mode||'—')}</strong></div>`:`<div class="dcw-meta-pair"><span>LOCATION</span><strong>${esc(ev?.location||'—')}</strong></div><div class="dcw-meta-pair"><span>CAPACITY</span><strong>${esc(ev?.capacity||'—')}</strong></div>`}</div></div><div class="dcw-note">Боевой слой пока read-only. Editing, participants и registrations будут подключаться отдельными permission contracts.</div>`;}
function testResult(t){const r=t.result_json||{};return r.levelName||r.level_name||r.title||(r.level!=null?'Уровень '+r.level:'Завершён');}
function formatDate(v){if(!v)return'—';try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v));}catch{return String(v);}}

function enforceVerifiedShell(){
  const nav=document.querySelector('.dcw-sidebar [data-workspace-nav]');
  if(!nav)return;
  const known=authzKnown();
  const hiddenState=[
    ['[data-shell-key="artifacts"]',!(known&&isMember())],
    ['[data-work-nav]',!(known&&hasWork())],
    ['[data-role-home]',!(known&&isDementor())],
    ['a[href$="/workspace/review/"]',!(known&&isDementor())],
    ['a[href$="/workspace/admin/"]',!(known&&isOwnerAdmin())]
  ];
  for(const [selector,shouldHide] of hiddenState){
    const link=nav.querySelector(selector);
    if(link&&link.hidden!==shouldHide)link.hidden=shouldHide;
  }
}
const sidebarNav=document.querySelector('.dcw-sidebar [data-workspace-nav]');
if(sidebarNav){
  new MutationObserver(enforceVerifiedShell).observe(sidebarNav,{subtree:true,attributes:true,attributeFilter:['hidden']});
}
function renderNav(){if(workNav)workNav.hidden=!hasWork();enforceVerifiedShell();}
function render(){renderNav();const labels={home:'HOME',club:'MY CLUB',activity:'MY ACTIVITY',work:'MY WORK',profile:'MY PROFILE',entity:'ENTITY'};topTitle.textContent=labels[state.route]||'HOME';document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('is-active',b.dataset.route===state.route));if(state.route==='home')view.innerHTML=home();else if(state.route==='club')view.innerHTML=club();else if(state.route==='activity')view.innerHTML=activity();else if(state.route==='work')view.innerHTML=work();else if(state.route==='profile')view.innerHTML=profile();else view.innerHTML=entityPage();view.insertAdjacentHTML('afterbegin',moduleAlerts());bind();}
function bind(){
  view.querySelectorAll('[data-retry-module]').forEach(button=>button.addEventListener('click',async()=>{
    const name=button.dataset.retryModule;
    if(!name||state.moduleRequests.has(name))return;
    button.disabled=true;
    if(name==='work')await loadEntities({all:state.systemView});
    else {
      await fetchOptional(name);
      if(['membership','roles','assignments'].includes(name)){
        state.systemView=false;
        await loadEntities();
      }
    }
    render();
  }));
  document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>{const r=el.dataset.route;if(r==='work'&&!hasWork())return;state.route=r;state.entityId=null;render();}));document.querySelectorAll('[data-entity]').forEach(el=>el.addEventListener('click',()=>{state.entityId=el.dataset.entity;state.route='entity';render();}));document.querySelectorAll('[data-system-view]').forEach(el=>el.addEventListener('click',async()=>{state.systemView=!state.systemView;await loadEntities({all:state.systemView});state.route='work';render();}));document.querySelectorAll('[data-membership-info]').forEach(el=>el.addEventListener('click',()=>{const n=view.querySelector('[data-membership-note]');if(n)n.hidden=!n.hidden;}));}
function showError(error){console.error('[DC Workspace]',error);gate('ОШИБКА ЛИЧНОГО КАБИНЕТА',error?.message||String(error),`<pre class="dcw-error">${esc(error?.code||'')}</pre>`);}

async function boot(){
  if(!cfg?.enabled||!cfg.url||!cfg.publishableKey){gate('SUPABASE НЕ НАСТРОЕН','Отсутствует public configuration.');return;}
  state.client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});window.DEMENTOR_SUPABASE_CLIENT=state.client;
  const ok=await loadIdentity();if(!ok)return;
  await loadEntities();
  const requestedRoute=location.hash.replace(/^#/, '');
  if(['home','club','activity','work','profile'].includes(requestedRoute))state.route=requestedRoute;
  render();
  state.client.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'&&!session)location.reload();});
}
boot().catch(showError);
