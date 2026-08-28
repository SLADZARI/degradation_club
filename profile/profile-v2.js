import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const root=document.querySelector('[data-profile-root]');
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const basePath=()=>location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=d=>{if(!d)return '—';try{return new Intl.DateTimeFormat('ru-RU',{dateStyle:'medium'}).format(new Date(d))}catch{return String(d)}};
const active=row=>row?.status==='active'&&(!row.valid_from||Date.parse(row.valid_from)<=Date.now())&&(!row.valid_to||Date.parse(row.valid_to)>Date.now());
const spheres=[['personality','Личность'],['work','Работа'],['consumption','Потребление'],['relationships','Отношения'],['control','Контроль'],['information','Информация'],['self-development','Саморазвитие'],['meaning','Смысл'],['technology','Технологии']];
const publicDementorByUserId={
  'e9b8ec1d-76be-4607-bb5b-63c48c1b80fa':'evgeniy',
  '8c79a5a1-88a9-41cc-98d7-a487df690674':'nikita'
};

if(!cfg?.enabled||!cfg.url||!cfg.publishableKey){root.innerHTML='<div class="dcp-error"><strong>SUPABASE CONFIG DISABLED</strong></div>';throw new Error('Supabase config unavailable');}

const sb=createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,detectSessionInUrl:false,autoRefreshToken:true,flowType:'pkce'}});

async function login(){
  const next=basePath()+'/profile/';
  const callback=location.origin+basePath()+'/auth/callback/?next='+encodeURIComponent(next);
  const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback}});
  if(error)throw error;
}

function loginView(){
  root.innerHTML=`<section class="dcp-login"><p class="dcp-kicker">PERSON / PRIVATE PROFILE</p><h1>ВАШ<br>ПРОФИЛЬ.</h1><p>Войдите через Google, чтобы увидеть свою клубную идентичность, статус, диагностику, курсы, покупки и рабочие назначения с любого устройства.</p><button class="dcp-action dcp-action--primary" type="button" data-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button></section>`;
  root.querySelector('[data-login]')?.addEventListener('click',()=>login().catch(showError));
}

function showError(error){console.error('[DC profile]',error);root.innerHTML=`<div class="dcp-error"><strong>ОШИБКА ПРОФИЛЯ</strong><p>${esc(error?.message||String(error))}</p><small>${esc(error?.code||'')}</small></div>`;}

function statusModel(membership,roles){
  const activeRoles=(roles||[]).filter(active).map(r=>r.role);
  if(activeRoles.includes('owner_admin'))return {label:'OWNER_ADMIN',detail:'Член клуба / системная роль',member:true};
  if(activeRoles.includes('dementor'))return {label:'DEMENTOR',detail:'Член клуба / дементор',member:true};
  if(active(membership))return {label:'ЧЛЕН КЛУБА',detail:'Membership active',member:true};
  return {label:'ЗАРЕГИСТРИРОВАННЫЙ ГОСТЬ',detail:'Аккаунт активен, membership не назначена',member:false};
}

function badge(text,acid=false){return `<span class="dcp-badge${acid?' dcp-badge--acid':''}">${esc(text)}</span>`;}

async function render(){
  const {data:{session},error:sessionError}=await sb.auth.getSession();
  if(sessionError)throw sessionError;
  if(!session){loginView();return;}
  const {data:userData,error:userError}=await sb.auth.getUser();
  if(userError)throw userError;
  const user=userData.user;

  const results=await Promise.all([
    sb.from('profiles').select('id,email,full_name,avatar_url,created_at,updated_at').eq('id',user.id).maybeSingle(),
    sb.from('dc_system_memberships').select('*').eq('profile_id',user.id).maybeSingle(),
    sb.from('dc_role_assignments').select('*').eq('profile_id',user.id),
    sb.from('dc_entity_assignments').select('*').eq('profile_id',user.id),
    sb.from('assessment_snapshots').select('state_json,updated_at').eq('profile_id',user.id).maybeSingle(),
    sb.from('assessment_runs').select('sphere_id,assessment_version,result_json,completed_at').eq('profile_id',user.id).order('completed_at',{ascending:false}).limit(100),
    sb.from('course_enrollments').select('course_id,status,created_at,updated_at').eq('profile_id',user.id).order('created_at',{ascending:false}).limit(50),
    sb.from('orders').select('id,reference,status,total_eur,currency,created_at').eq('profile_id',user.id).order('created_at',{ascending:false}).limit(50),
    sb.from('join_applications').select('status,source,created_at,reviewed_at').eq('profile_id',user.id).order('created_at',{ascending:false}).limit(20)
  ]);
  const firstError=results.find(r=>r.error)?.error;if(firstError)throw firstError;
  const [profileR,membershipR,rolesR,assignmentsR,snapshotR,runsR,enrollmentsR,ordersR,applicationsR]=results;
  const profile=profileR.data||{};
  const membership=membershipR.data||null;
  const roles=(rolesR.data||[]).filter(active);
  const assignments=(assignmentsR.data||[]).filter(active);
  const snapshot=snapshotR.data?.state_json||{results:{}};
  const runs=runsR.data||[];
  const enrollments=enrollmentsR.data||[];
  const orders=ordersR.data||[];
  const applications=applicationsR.data||[];
  const model=statusModel(membership,roles);
  const name=profile.full_name||user.user_metadata?.full_name||user.user_metadata?.name||user.email||'Участник';
  const email=profile.email||user.email||'';
  const avatar=profile.avatar_url||user.user_metadata?.avatar_url||user.user_metadata?.picture||'';
  const publicSlug=publicDementorByUserId[user.id]||null;

  let assignedEntities=[];
  const entityIds=assignments.map(a=>a.entity_id);
  if(entityIds.length){
    const {data,error}=await sb.from('dc_entities').select('id,entity_type,slug,title,status,summary,source_ref,provenance_status').in('id',entityIds).order('entity_type').order('title');
    if(error)throw error;assignedEntities=data||[];
  }

  const roleLabels=roles.length?roles.map(r=>r.role.toUpperCase()):[];
  const examined=spheres.filter(([id])=>snapshot.results?.[id]).length;
  const latestApplication=applications[0]||null;

  root.innerHTML=`
    <section class="dcp-hero">
      <div>
        <p class="dcp-kicker">PERSON / PRIVATE PROFILE / ${esc(user.id)}</p>
        <h1>${esc(name).toUpperCase()}</h1>
        <div class="dcp-statusline">${badge(model.label,true)}${roleLabels.map(r=>badge(r)).join('')}</div>
        <p>${esc(email)}</p>
        <div class="dcp-actions">
          <a class="dcp-action dcp-action--primary" href="${basePath()}/workspace/">ЛИЧНЫЙ КАБИНЕТ</a>
          ${publicSlug?`<a class="dcp-action" href="${basePath()}/community/${publicSlug}/">ПУБЛИЧНЫЙ ПРОФИЛЬ ДЕМЕНТОРА</a>`:''}
          <a class="dcp-action" href="${basePath()}/join/">ДИАГНОСТИКА DC-9</a>
          <button class="dcp-action" type="button" data-logout>ВЫЙТИ</button>
        </div>
      </div>
      ${avatar?`<img class="dcp-portrait" src="${esc(avatar)}" alt="Портрет ${esc(name)}">`:'<div class="dcp-portrait"></div>'}
    </section>

    <section class="dcp-grid" aria-label="Profile architecture summary">
      <article class="dcp-card"><span>ACCOUNT STATE</span><strong>${esc(model.label)}</strong><p>${esc(model.detail)}</p></article>
      <article class="dcp-card"><span>DC MEMBERSHIP</span><strong>${model.member?'ACTIVE':'—'}</strong><p>${model.member?'Membership назначена отдельно от identity.':'Google account не равен членству.'}</p></article>
      <article class="dcp-card"><span>MY WORK</span><strong>${assignedEntities.length}</strong><p>Только активные scoped entity assignments.</p></article>
      <article class="dcp-card"><span>DC-9</span><strong>${examined}/9</strong><p>Обследованных сфер.</p></article>
      <article class="dcp-card"><span>PROGRAM ENROLLMENTS</span><strong>${enrollments.length}</strong><p>Личные участия в курсах / программах.</p></article>
      <article class="dcp-card"><span>ORDERS</span><strong>${orders.length}</strong><p>История заказов аккаунта.</p></article>
    </section>

    <section class="dcp-section">
      <div class="dcp-section-head"><div><p class="dcp-kicker">IDENTITY / RELATIONS</p><h2>КЛУБНЫЙ СТАТУС</h2></div><span class="dcp-kicker">PERSON ≠ MEMBERSHIP ≠ ROLE</span></div>
      <div class="dcp-grid" style="margin-top:0">
        <article class="dcp-card dcp-card--6"><span>MEMBERSHIP</span><strong>${model.member?'DEMENTOR CLUB / ACTIVE':'NOT ASSIGNED'}</strong><p>${membership?.source_ref?`Source: ${esc(membership.source_ref)}`:'Зарегистрированный гость остаётся полноценным authenticated account.'}</p></article>
        <article class="dcp-card dcp-card--6"><span>ROLE ASSIGNMENTS</span><strong>${roleLabels.length?esc(roleLabels.join(' / ')):'—'}</strong><p>Роли scoped внутри Dementor Club и не являются полями PERSON.</p></article>
        <article class="dcp-card dcp-card--12"><span>MEMBERSHIP APPLICATION</span><strong>${latestApplication?esc(String(latestApplication.status||'submitted').toUpperCase()):model.member?'COMPLETE':'NOT SUBMITTED'}</strong><p>${model.member?'Членство уже активно.':latestApplication?`Последняя заявка: ${fmt(latestApplication.created_at)}.`:'Механика вступления остаётся отдельным flow; профиль не выдаёт членство автоматически.'}</p></article>
      </div>
    </section>

    <section class="dcp-section">
      <div class="dcp-section-head"><div><p class="dcp-kicker">ASSESSMENTS / DC-9</p><h2>КАРТА ДЕГРАДАЦИИ</h2></div><span class="dcp-kicker">${runs.length} RUNS</span></div>
      <div class="dcp-map">${spheres.map(([id,label])=>{const r=snapshot.results?.[id];return `<article><span class="dcp-kicker">${esc(label)}</span><strong>${r?`${esc(r.level)}/5`:'—'}</strong><small>${r?fmt(r.date||snapshotR.data?.updated_at):'не обследовано'}</small></article>`}).join('')}</div>
    </section>

    <section class="dcp-section">
      <div class="dcp-section-head"><div><p class="dcp-kicker">PARTICIPATION</p><h2>КУРСЫ И ПРОГРАММЫ</h2></div><span class="dcp-kicker">ENROLLMENT ≠ ROLE</span></div>
      ${enrollments.length?enrollments.map(e=>`<div class="dcp-list-row"><strong>${esc(e.course_id)}</strong><span>PROGRAM ENROLLMENT</span><span>${esc(String(e.status||'active').toUpperCase())}</span><small>${fmt(e.created_at)}</small></div>`).join(''):'<div class="dcp-empty">УЧАСТИЙ В ПРОГРАММАХ ПОКА НЕТ.</div>'}
    </section>

    ${assignedEntities.length?`<section class="dcp-section"><div class="dcp-section-head"><div><p class="dcp-kicker">SCOPED WORK</p><h2>МОЯ РАБОТА</h2></div><a class="dcp-action" href="${basePath()}/workspace/">ОТКРЫТЬ WORKSPACE</a></div>${assignedEntities.map(e=>{const a=assignments.find(x=>x.entity_id===e.id);return `<div class="dcp-list-row"><strong>${esc(e.title)}</strong><span>${esc(e.entity_type)} · ${esc(e.summary||'')}</span><span>${esc(String(a?.role||'viewer').toUpperCase())}</span><small>${esc(String(e.status||'').toUpperCase())}</small></div>`}).join('')}</section>`:''}

    <section class="dcp-section">
      <div class="dcp-section-head"><div><p class="dcp-kicker">COMMERCE</p><h2>ПОКУПКИ</h2></div><a class="dcp-action" href="${basePath()}/cart/">КОРЗИНА</a></div>
      ${orders.length?orders.map(o=>`<div class="dcp-list-row"><strong>${esc(o.reference||o.id)}</strong><span>ORDER</span><span>${esc(String(o.status||'').toUpperCase())}</span><small>${Number(o.total_eur||0).toFixed(2)} ${esc(o.currency||'EUR')} · ${fmt(o.created_at)}</small></div>`).join(''):'<div class="dcp-empty">ПОКУПОК ПОКА НЕТ.</div>'}
    </section>

    <section class="dcp-section"><div class="dcp-source">PROFILE = projection of PERSON + DC relations. Permissions are not inferred from email, assessment results, purchases or public Dementor profile.</div></section>`;

  root.querySelector('[data-logout]')?.addEventListener('click',async()=>{await sb.auth.signOut();loginView();});
}

render().catch(showError);
sb.auth.onAuthStateChange((_event,session)=>{if(!session)loginView();});