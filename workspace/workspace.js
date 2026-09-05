import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const view=document.getElementById('appView');
const topTitle=document.getElementById('topTitle');
const workNav=document.querySelector('[data-work-nav]');
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const state={client:null,session:null,user:null,profile:null,membership:null,roles:[],assignments:[],entities:[],programs:new Map(),events:new Map(),tests:[],enrollments:[],orders:[],joinApplications:[],artifacts:[],responses:[],reactions:[],route:'home',entityId:null,systemView:false};

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
const activeRoles=()=>state.roles.filter(isActiveWindow);
const hasRole=role=>activeRoles().some(r=>r.role===role);
const isOwnerAdmin=()=>hasRole('owner_admin');
const isDementor=()=>hasRole('dementor')||isOwnerAdmin();
const isMember=()=>isActiveWindow(state.membership)||hasRole('club_member')||isDementor();
const hasWork=()=>state.assignments.length>0||isDementor();
const avatar=()=>state.profile?.avatar_url||state.user?.user_metadata?.avatar_url||state.user?.user_metadata?.picture||'';
const displayName=()=>state.profile?.full_name||state.user?.user_metadata?.full_name||state.user?.email||'Участник';
const roleBadge=r=>`<span class="dcw-badge dcw-badge--role">${esc(String(r||'').toUpperCase())}</span>`;
const statusBadge=s=>`<span class="dcw-badge dcw-badge--${s==='active'?'active':s==='planned'?'planned':'waiting'}">${esc(String(s||'').toUpperCase())}</span>`;

function effectiveState(){
  if(isOwnerAdmin())return{key:'owner_admin',label:'OWNER_ADMIN / DEMENTOR',member:true};
  if(hasRole('dementor'))return{key:'dementor',label:'DEMENTOR',member:true};
  if(isMember())return{key:'member',label:'ЧЛЕН DEMENTOR CLUB',member:true};
  return{key:'guest',label:'ЗАРЕГИСТРИРОВАННЫЙ ГОСТЬ',member:false};
}

function gate(title,text,action=''){view.innerHTML=`<section class="dcw-gate"><div class="dcw-denied"><h2>${esc(title)}</h2><p>${esc(text)}</p>${action}</div></section>`;}
async function login(){const next=basePath()+'/workspace/';const callback=location.origin+basePath()+'/auth/callback/?next='+encodeURIComponent(next);const {error}=await state.client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback}});if(error)throw error;}

async function loadIdentity(){
  const {data:{session},error}=await state.client.auth.getSession();if(error)throw error;state.session=session||null;
  if(!session){gate('ДОБРО ПОЖАЛОВАТЬ В DEMENTOR CLUB','Войдите через Google, чтобы открыть личный кабинет, историю участия, тестов, курсов и покупок.','<button type="button" class="dcw-login" data-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button>');view.querySelector('[data-login]')?.addEventListener('click',()=>login().catch(showError));return false;}
  const {data:userData,error:userError}=await state.client.auth.getUser();if(userError)throw userError;state.user=userData.user;
  const uid=state.user.id;
  const qProfile=state.client.from('profiles').select('id,email,full_name,avatar_url').eq('id',uid).maybeSingle();
  const qMembership=state.client.from('dc_system_memberships').select('*').eq('profile_id',uid).maybeSingle();
  const qRoles=state.client.from('dc_role_assignments').select('*').eq('profile_id',uid);
  const qAssignments=state.client.from('dc_entity_assignments').select('*').eq('profile_id',uid);
  const qTests=state.client.from('assessment_runs').select('id,sphere_id,assessment_version,result_json,completed_at,created_at').eq('profile_id',uid).order('completed_at',{ascending:false}).limit(50);
  const qCourses=state.client.from('course_enrollments').select('id,course_id,status,created_at,updated_at').eq('profile_id',uid).order('created_at',{ascending:false}).limit(50);
  const qOrders=state.client.from('orders').select('id,reference,status,currency,total_eur,created_at,updated_at').eq('profile_id',uid).order('created_at',{ascending:false}).limit(50);
  const qJoin=state.client.from('join_applications').select('id,status,source,created_at,reviewed_at').eq('profile_id',uid).order('created_at',{ascending:false}).limit(5);
  const qArtifacts=state.client.from('dc_artifacts').select('id,title,body,status,visibility,published_at,closed_at,expires_at,created_at,updated_at').eq('author_profile_id',uid).order('created_at',{ascending:false}).limit(50);
  const qResponses=state.client.from('dc_artifact_responses').select('id,artifact_id,message,status,created_at,updated_at,artifact:dc_artifacts!dc_artifact_responses_artifact_id_fkey(id,title,body,status,visibility,published_at,closed_at,expires_at)').eq('responder_profile_id',uid).order('created_at',{ascending:false}).limit(50);
  const qReactions=state.client.from('dc_artifact_reactions').select('id,artifact_id,reaction_type,created_at,artifact:dc_artifacts!dc_artifact_reactions_artifact_id_fkey(id,title,body,status,visibility,published_at,closed_at,expires_at)').eq('profile_id',uid).order('created_at',{ascending:false}).limit(50);
  const results=await Promise.all([qProfile,qMembership,qRoles,qAssignments,qTests,qCourses,qOrders,qJoin,qArtifacts,qResponses,qReactions]);
  for(const r of results)if(r.error)throw r.error;
  state.profile=results[0].data||null;state.membership=results[1].data||null;state.roles=results[2].data||[];state.assignments=(results[3].data||[]).filter(isActiveWindow);state.tests=results[4].data||[];state.enrollments=results[5].data||[];state.orders=results[6].data||[];state.joinApplications=results[7].data||[];state.artifacts=results[8].data||[];state.responses=results[9].data||[];state.reactions=results[10].data||[];
  return true;
}

async function loadEntities({all=false}={}){
  let entities=[];const ids=state.assignments.map(a=>a.entity_id);
  if(all&&isOwnerAdmin()){const {data,error}=await state.client.from('dc_entities').select('*').order('entity_type').order('title');if(error)throw error;entities=data||[];}
  else if(ids.length){const {data,error}=await state.client.from('dc_entities').select('*').in('id',ids).order('entity_type').order('title');if(error)throw error;entities=data||[];}
  state.entities=entities;state.programs=new Map();state.events=new Map();
  const pids=entities.filter(e=>e.entity_type==='program').map(e=>e.id);const eids=entities.filter(e=>e.entity_type==='event').map(e=>e.id);
  if(pids.length){const {data,error}=await state.client.from('dc_programs').select('*').in('entity_id',pids);if(error)throw error;(data||[]).forEach(x=>state.programs.set(x.entity_id,x));}
  if(eids.length){const {data,error}=await state.client.from('dc_events').select('*').in('entity_id',eids);if(error)throw error;(data||[]).forEach(x=>state.events.set(x.entity_id,x));}
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
  return `<div class="dcw-person-hero"><div class="dcw-person-portrait">${img}</div><div class="dcw-welcome"><div><div class="dcw-kicker">ЛИЧНЫЙ КАБИНЕТ</div><h1>Добро пожаловать в клуб</h1></div><div><div class="dcw-status-line">${statusMarkup()}</div><p>${s.member?'Членство подтверждено. Дополнительные рабочие возможности появляются только из ролей и assignments.':'Аккаунт зарегистрирован. Вход в клуб и рабочие роли являются отдельными состояниями.'}</p></div></div></div>
  <div class="dcw-dashboard-grid">
    <button class="dcw-dashboard-card" data-route="club"><span>КЛУБ</span><strong>${s.member?'✓':'→'}</strong><small>${s.member?'членство активно':'стать членом клуба'}</small></button>
    <button class="dcw-dashboard-card" data-route="activity"><span>ПРОЙДЕННЫЕ ТЕСТЫ</span><strong>${state.tests.length}</strong><small>DC-9 / account archive</small></button>
    <button class="dcw-dashboard-card" data-route="activity"><span>МОИ КУРСЫ</span><strong>${state.enrollments.length}</strong><small>enrollments</small></button>
    <button class="dcw-dashboard-card" data-route="activity"><span>ПОКУПКИ</span><strong>${state.orders.length}</strong><small>order archive</small></button>
  </div>
  ${hasWork()?`<div class="dcw-section"><div class="dcw-section-head"><h2>Моя работа</h2><span class="dcw-source">ROLE + ASSIGNMENT DRIVEN</span></div>${state.entities.length?`<div class="dcw-list">${state.entities.map(entityRow).join('')}</div>`:'<div class="dcw-empty-live">Роль есть, но активных рабочих assignments пока нет.</div>'}</div>`:''}`;
}

function club(){const s=effectiveState();const latest=state.joinApplications[0];
  const membershipBlock=s.member?`<div><div class="dcw-kicker">MEMBERSHIP</div><h2>✓ ЧЛЕН КЛУБА</h2><p>Статус членства активен. Для Dementor и OWNER_ADMIN членский уровень входит в иерархию доступа.</p><div class="dcw-actions-row"><button class="dcw-secondary" disabled>УСТАВ КЛУБА — НЕ ОПУБЛИКОВАН</button></div><div class="dcw-note">Утверждённый источник устава не найден ни в текущем Git source-of-truth, ни в доступных материалах Drive. Поэтому документ не подменяется выдуманным текстом.</div></div>`:`<div><div class="dcw-kicker">MEMBERSHIP</div><h2>СТАТЬ ЧЛЕНОМ КЛУБА</h2><p>Сейчас вы зарегистрированный гость. Authentication не создаёт membership автоматически.</p><div class="dcw-actions-row"><button class="dcw-primary" data-membership-info>СТАТЬ ЧЛЕНОМ КЛУБА</button></div><div class="dcw-note" data-membership-note hidden>Механика вступления, подтверждения и возможной оплаты пока не утверждена. Кнопка фиксирует продуктовый следующий шаг, но не создаёт фиктивную заявку.</div>${latest?`<div class="dcw-note">Последняя существующая запись join_application: <strong>${esc(latest.status)}</strong> · ${esc(latest.created_at||'')}</div>`:''}</div>`;
  return `${head('Мой клуб','Общая поверхность для любого авторизованного человека. Membership и роль добавляются поверх аккаунта.')}<div class="dcw-membership-panel">${membershipBlock}<div><div class="dcw-kicker">ТЕКУЩИЙ СТАТУС</div><h2>${esc(s.label)}</h2><p>Identity ≠ membership ≠ role. Права на рабочие сущности определяются отдельно.</p>${activeRoles().length?`<div class="dcw-badges">${activeRoles().map(r=>roleBadge(r.role)).join('')}</div>`:''}</div></div><div class="dcw-section"><div class="dcw-section-head"><h2>Дементоры клуба</h2><a class="dcw-secondary" href="${siteUrl('community/')}">ВСЕ ДЕМЕНТОРЫ →</a></div><div class="dcw-roster">${DEMENTORS.map(d=>`<a class="dcw-dementor" href="${siteUrl('community/'+d.slug+'/')}"><img src="${siteUrl(d.portrait)}" alt="${esc(d.name)}"><div class="dcw-dementor-copy"><span>DEMENTOR</span><strong>${esc(d.name)}</strong><span>Открыть профиль →</span></div></a>`).join('')}</div></div>`;
}

function communityArtifacts(){return state.artifacts.length?state.artifacts.map(a=>`<div class="dcw-archive-row" data-activity-artifact="${esc(a.id)}"><time>${esc(formatDate(a.published_at||a.created_at))}</time><div><strong>${esc(artifactTitle(a))}</strong><br><small>АРТЕФАКТ · ${esc(artifactStatus(a.status))} · COMMUNITY</small></div><span>${esc(artifactStatus(a.status))}</span></div>`).join(''):'<div class="dcw-empty-live">Вы ещё не создавали Artifact.</div>';}
function communityResponses(){return state.responses.length?state.responses.map(r=>{const target=r.artifact||null;const detail=r.message?excerpt(r.message,120):'Отклик без сообщения';return `<div class="dcw-archive-row" data-activity-response="${esc(r.id)}"><time>${esc(formatDate(r.created_at))}</time><div><strong>Отклик → ${esc(artifactTitle(target))}</strong><br><small>${esc(detail)} · ОБЪЯВЛЕНИЕ: ${esc(artifactStatus(target?.status))}</small></div><span>${esc(responseStatus(r.status))}</span></div>`;}).join(''):'<div class="dcw-empty-live">Отправленных откликов пока нет.</div>';}
function communityReactions(){return state.reactions.length?state.reactions.map(r=>{const target=r.artifact||null;return `<div class="dcw-archive-row" data-activity-reaction="${esc(r.id)}"><time>${esc(formatDate(r.created_at))}</time><div><strong>Мне это надо → ${esc(artifactTitle(target))}</strong><br><small>REACTION · ОБЪЯВЛЕНИЕ: ${esc(artifactStatus(target?.status))}</small></div><span>${r.reaction_type==='interested'?'ИНТЕРЕСНО':esc(String(r.reaction_type||'—').toUpperCase())}</span></div>`;}).join(''):'<div class="dcw-empty-live">Отмеченных объявлений пока нет.</div>';}
function activity(){return `${head('Моя активность','Здесь остаётся история вашего участия: что вы опубликовали, на что откликнулись, что отметили, а также тесты, курсы и покупки.')}<div class="dcw-activity-block" data-community-activity><div class="dcw-section-head"><h2>Участие в клубе</h2><div class="dcw-actions-row"><a class="dcw-secondary" href="${siteUrl('workspace/board/')}">НА ДОСКУ →</a><a class="dcw-secondary" href="${siteUrl('workspace/artifacts/')}">МОИ АРТЕФАКТЫ →</a></div></div><div class="dcw-status-line"><span class="dcw-badge">АРТЕФАКТЫ ${state.artifacts.length}</span><span class="dcw-badge">ОТКЛИКИ ${state.responses.length}</span><span class="dcw-badge">РЕАКЦИИ ${state.reactions.length}</span></div></div><div class="dcw-activity-block"><h2>Мои артефакты</h2>${communityArtifacts()}</div><div class="dcw-activity-block"><h2>Мои отклики</h2>${communityResponses()}</div><div class="dcw-activity-block"><h2>Мои реакции</h2>${communityReactions()}</div><div class="dcw-activity-block"><h2>Пройденные тесты</h2>${state.tests.length?state.tests.map(t=>`<div class="dcw-archive-row"><time>${esc(formatDate(t.completed_at||t.created_at))}</time><div><strong>${esc(SPHERES[t.sphere_id]||t.sphere_id||'DC-9')}</strong><br><small>${esc(t.assessment_version||'')}</small></div><span>${esc(testResult(t))}</span></div>`).join(''):'<div class="dcw-empty-live">Завершённых тестов в аккаунте пока нет.</div>'}</div><div class="dcw-activity-block"><h2>Мои курсы</h2>${state.enrollments.length?state.enrollments.map(c=>`<div class="dcw-archive-row"><time>${esc(formatDate(c.created_at))}</time><div><strong>${esc(COURSE_NAMES[c.course_id]||c.course_id)}</strong></div><span>${esc(c.status||'—')}</span></div>`).join(''):'<div class="dcw-empty-live">Course enrollments пока отсутствуют.</div>'}</div><div class="dcw-activity-block"><h2>Архив покупок</h2>${state.orders.length?state.orders.map(o=>`<div class="dcw-archive-row"><time>${esc(formatDate(o.created_at))}</time><div><strong>${esc(o.reference||'Заказ')}</strong><br><small>${esc(o.status||'—')}</small></div><span>${o.total_eur!=null?esc(o.total_eur)+' '+esc(o.currency||'EUR'):''}</span></div>`).join(''):'<div class="dcw-empty-live">Покупок в аккаунте пока нет.</div>'}</div>`;}

function profile(){const s=effectiveState();return `${head('Мой профиль','Один PERSON / auth identity. Membership, роли и рабочие сущности являются отдельными связями.')}<div class="dcw-profile-grid"><div class="dcw-card">${avatar()?`<img class="dcw-profile-photo" src="${esc(avatar())}" alt="${esc(displayName())}">`:''}<h2>${esc(displayName())}</h2><p>${esc(state.user?.email||'')}</p><div class="dcw-status-line">${statusMarkup()}</div></div><div class="dcw-card"><h2>Доступ</h2><div class="dcw-field"><span>ACCOUNT</span><strong>AUTHENTICATED</strong></div><div class="dcw-field"><span>MEMBERSHIP</span><strong>${s.member?'ACTIVE':'NOT ASSIGNED'}</strong></div><div class="dcw-field"><span>ROLES</span><strong>${esc(activeRoles().map(r=>r.role).join(' / ')||'—')}</strong></div><div class="dcw-field"><span>WORK ASSIGNMENTS</span><strong>${state.assignments.length}</strong></div><div class="dcw-source-ref">USER ID: ${esc(state.user.id)}</div></div></div>`;}

function entityRow(e){const sub=e.entity_type==='program'?state.programs.get(e.id):state.events.get(e.id);const a=assignmentFor(e.id);const detail=e.entity_type==='program'?`${sub?.program_type||''} · ${sub?.delivery_mode||''}`:(sub?.location||'');return `<div class="dcw-row" data-entity="${esc(e.id)}"><div class="dcw-row-title"><strong>${esc(e.title)}</strong><span class="dcw-row-meta">${esc(e.entity_type)} · ${esc(detail)} · ${esc(e.summary||'')}</span>${provenance(e)}</div><div class="dcw-row-actions">${roleBadge(a?.role||(state.systemView&&isOwnerAdmin()?'owner_admin / system':'viewer'))} ${statusBadge(e.status)} <span class="dcw-arrow">→</span></div></div>`;}
function work(){if(!hasWork())return `${head('Моя работа','Рабочие поверхности появляются только при соответствующей роли или entity assignment.')}<div class="dcw-empty-live">У этого аккаунта нет рабочих сущностей Dementor Club.</div>`;return `${head('Моя работа',state.systemView?'OWNER_ADMIN system view: все Dementor Club entities, разрешённые RLS.':'Только рабочие сущности текущего человека.')}<div class="dcw-filters"><button class="dcw-filter is-active">${state.systemView?'SYSTEM VIEW':'MY ASSIGNMENTS'}</button>${isOwnerAdmin()?`<button class="dcw-filter" data-system-view>${state.systemView?'МОИ ASSIGNMENTS':'ВСЕ DC ENTITIES'}</button>`:''}</div>${state.entities.length?`<div class="dcw-list">${state.entities.map(entityRow).join('')}</div>`:'<div class="dcw-empty-live">Нет активных рабочих сущностей.</div>'}`;}
function entityPage(){const e=state.entities.find(x=>x.id===state.entityId);if(!e)return '<div class="dcw-empty-live">Entity недоступна.</div>';const a=assignmentFor(e.id),p=state.programs.get(e.id),ev=state.events.get(e.id);return `<button type="button" class="dcw-filter" data-route="work">← MY WORK</button><div class="dcw-entity-hero"><div><div class="dcw-badges">${roleBadge(a?.role||(isOwnerAdmin()?'owner_admin':'viewer'))} ${statusBadge(e.status)}</div><h1>${esc(e.title)}</h1><p>${esc(e.summary||'')}</p>${provenance(e)}</div><div class="dcw-entity-meta">${e.entity_type==='program'?`<div class="dcw-meta-pair"><span>TYPE</span><strong>${esc(p?.program_type||'—')}</strong></div><div class="dcw-meta-pair"><span>DELIVERY</span><strong>${esc(p?.delivery_mode||'—')}</strong></div>`:`<div class="dcw-meta-pair"><span>LOCATION</span><strong>${esc(ev?.location||'—')}</strong></div><div class="dcw-meta-pair"><span>CAPACITY</span><strong>${esc(ev?.capacity||'—')}</strong></div>`}</div></div><div class="dcw-note">Боевой слой пока read-only. Editing, participants и registrations будут подключаться отдельными permission contracts.</div>`;}
function testResult(t){const r=t.result_json||{};return r.levelName||r.level_name||r.title||(r.level!=null?'Уровень '+r.level:'Завершён');}
function formatDate(v){if(!v)return'—';try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v));}catch{return String(v);}}

function renderNav(){if(workNav)workNav.hidden=!hasWork();}
function render(){renderNav();const labels={home:'HOME',club:'MY CLUB',activity:'MY ACTIVITY',work:'MY WORK',profile:'MY PROFILE',entity:'ENTITY'};topTitle.textContent=labels[state.route]||'HOME';document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('is-active',b.dataset.route===state.route));if(state.route==='home')view.innerHTML=home();else if(state.route==='club')view.innerHTML=club();else if(state.route==='activity')view.innerHTML=activity();else if(state.route==='work')view.innerHTML=work();else if(state.route==='profile')view.innerHTML=profile();else view.innerHTML=entityPage();bind();}
function bind(){document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>{const r=el.dataset.route;if(r==='work'&&!hasWork())return;state.route=r;state.entityId=null;render();}));document.querySelectorAll('[data-entity]').forEach(el=>el.addEventListener('click',()=>{state.entityId=el.dataset.entity;state.route='entity';render();}));document.querySelectorAll('[data-system-view]').forEach(el=>el.addEventListener('click',async()=>{state.systemView=!state.systemView;await loadEntities({all:state.systemView});state.route='work';render();}));document.querySelectorAll('[data-membership-info]').forEach(el=>el.addEventListener('click',()=>{const n=view.querySelector('[data-membership-note]');if(n)n.hidden=!n.hidden;}));}
function showError(error){console.error('[DC Workspace]',error);gate('ОШИБКА ЛИЧНОГО КАБИНЕТА',error?.message||String(error),`<pre class="dcw-error">${esc(error?.code||'')}</pre>`);}

async function boot(){
  if(!cfg?.enabled||!cfg.url||!cfg.publishableKey){gate('SUPABASE НЕ НАСТРОЕН','Отсутствует public configuration.');return;}
  state.client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});window.DEMENTOR_SUPABASE_CLIENT=state.client;
  const ok=await loadIdentity();if(!ok)return;
  await loadEntities();render();
  state.client.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'&&!session)location.reload();});
}
boot().catch(showError);
