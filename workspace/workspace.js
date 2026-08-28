import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const view=document.getElementById('appView');
const topTitle=document.getElementById('topTitle');
const sessionBox=document.getElementById('sessionBox');
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const state={client:null,session:null,user:null,profile:null,membership:null,roles:[],assignments:[],entities:[],programs:new Map(),events:new Map(),route:'home',entityId:null,systemView:false};

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const basePath=()=>location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
const isActiveWindow=row=>row?.status==='active'&&(!row.valid_from||Date.parse(row.valid_from)<=Date.now())&&(!row.valid_to||Date.parse(row.valid_to)>Date.now());
const hasRole=role=>state.roles.some(r=>r.role===role&&isActiveWindow(r));
const isOwnerAdmin=()=>hasRole('owner_admin');
const badge=(text,kind='')=>`<span class="dcw-badge ${kind?`dcw-badge--${kind}`:''}">${esc(text)}</span>`;
const statusBadge=s=>badge(String(s||'').toUpperCase(),s==='active'?'active':s==='planned'?'planned':'waiting');
const roleBadge=r=>badge(String(r||'').toUpperCase(),'role');

function setSessionBox(){
  if(!state.session){sessionBox.innerHTML='<span>SESSION</span><strong>НЕ ВЫПОЛНЕН ВХОД</strong>';return;}
  const name=state.profile?.full_name||state.user?.user_metadata?.full_name||state.user?.email||'USER';
  sessionBox.innerHTML=`<span>SESSION</span><strong>${esc(name)}</strong><small>${esc(state.user?.email||'')}</small><button class="dcw-logout" type="button" data-logout>ВЫЙТИ</button>`;
  sessionBox.querySelector('[data-logout]')?.addEventListener('click',logout);
}

function gate(title,text,action=''){
  view.innerHTML=`<section class="dcw-gate"><div class="dcw-denied"><h2>${esc(title)}</h2><p>${esc(text)}</p>${action}</div></section>`;
}

async function login(){
  const next=basePath()+'/workspace/';
  const callback=location.origin+basePath()+'/auth/callback/?next='+encodeURIComponent(next);
  const {error}=await state.client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback}});
  if(error)throw error;
}

async function logout(){await state.client.auth.signOut();location.reload();}

async function loadIdentity(){
  const {data:{session},error}=await state.client.auth.getSession();
  if(error)throw error;
  state.session=session||null;
  if(!session){setSessionBox();gate('НУЖЕН ВХОД','Workspace доступен только после Google / Supabase authentication.','<button type="button" class="dcw-login" data-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button>');view.querySelector('[data-login]')?.addEventListener('click',()=>login().catch(showError));return false;}
  const {data:userData,error:userError}=await state.client.auth.getUser();
  if(userError)throw userError;
  state.user=userData.user;
  const [{data:profile,error:profileError},{data:membership,error:membershipError},{data:roles,error:rolesError},{data:assignments,error:assignmentsError}]=await Promise.all([
    state.client.from('profiles').select('id,email,full_name,avatar_url').eq('id',state.user.id).maybeSingle(),
    state.client.from('dc_system_memberships').select('*').eq('profile_id',state.user.id).maybeSingle(),
    state.client.from('dc_role_assignments').select('*').eq('profile_id',state.user.id),
    state.client.from('dc_entity_assignments').select('*').eq('profile_id',state.user.id)
  ]);
  if(profileError)throw profileError;if(membershipError)throw membershipError;if(rolesError)throw rolesError;if(assignmentsError)throw assignmentsError;
  state.profile=profile||null;state.membership=membership||null;state.roles=roles||[];state.assignments=(assignments||[]).filter(isActiveWindow);
  setSessionBox();
  if(!isActiveWindow(state.membership)){
    gate('НЕТ DEMENTOR CLUB MEMBERSHIP','Вход выполнен, но активная membership в Dementor Club для этого user_id не назначена. Google login сам по себе не даёт доступ к внутреннему Workspace.');return false;
  }
  if(!state.roles.some(isActiveWindow)){
    gate('НЕТ ROLE ASSIGNMENT','Membership активна, но системная роль не назначена. Доступ по умолчанию запрещён.');return false;
  }
  return true;
}

async function loadEntities({all=false}={}){
  let entityIds=state.assignments.map(a=>a.entity_id);
  let entities=[];
  if(all&&isOwnerAdmin()){
    const {data,error}=await state.client.from('dc_entities').select('*').order('entity_type').order('title');if(error)throw error;entities=data||[];
  }else if(entityIds.length){
    const {data,error}=await state.client.from('dc_entities').select('*').in('id',entityIds).order('entity_type').order('title');if(error)throw error;entities=data||[];
  }
  state.entities=entities;
  const programIds=entities.filter(e=>e.entity_type==='program').map(e=>e.id);
  const eventIds=entities.filter(e=>e.entity_type==='event').map(e=>e.id);
  state.programs=new Map();state.events=new Map();
  if(programIds.length){const {data,error}=await state.client.from('dc_programs').select('*').in('entity_id',programIds);if(error)throw error;(data||[]).forEach(x=>state.programs.set(x.entity_id,x));}
  if(eventIds.length){const {data,error}=await state.client.from('dc_events').select('*').in('entity_id',eventIds);if(error)throw error;(data||[]).forEach(x=>state.events.set(x.entity_id,x));}
}

function assignmentFor(entityId){return state.assignments.find(a=>a.entity_id===entityId)||null;}
function entityRole(entityId){const a=assignmentFor(entityId);return a?.role||(state.systemView&&isOwnerAdmin()?'owner_admin / system':'viewer');}
function provenance(e){return `<div class="dcw-provenance">SOURCE: ${esc(e.source_ref||'—')} · PROVENANCE: ${esc(e.provenance_status||'—')}</div>`;}

function head(title,desc){const name=state.profile?.full_name||state.user?.user_metadata?.full_name||state.user?.email||'USER';return `<div class="dcw-page-head"><div><div class="dcw-kicker">DEMENTOR CLUB / ${esc(name).toUpperCase()}</div><h1>${esc(title)}</h1></div><p>${esc(desc)}</p></div>`;}

function entityRow(e){const sub=e.entity_type==='program'?state.programs.get(e.id):state.events.get(e.id);const detail=e.entity_type==='program'?`${sub?.program_type||''} · ${sub?.delivery_mode||''}`:(sub?.location||'');return `<div class="dcw-row" data-entity="${esc(e.id)}"><div class="dcw-row-title"><strong>${esc(e.title)}</strong><span class="dcw-row-meta">${esc(e.entity_type)} · ${esc(detail)} · ${esc(e.summary||'')}</span>${provenance(e)}</div><div class="dcw-row-actions">${roleBadge(entityRole(e.id))} ${statusBadge(e.status)} <span class="dcw-arrow">→</span></div></div>`;}

function home(){
  const programs=state.entities.filter(e=>e.entity_type==='program');const events=state.entities.filter(e=>e.entity_type==='event');
  return `${head('Рабочее пространство','Этот экран собран из текущей Supabase session, Dementor Club membership, role assignments и entity assignments.')}<div class="dcw-grid"><div class="dcw-card dcw-card--4 dcw-stat"><span>MY PROGRAMS</span><strong>${programs.length}</strong><small>по текущему режиму</small></div><div class="dcw-card dcw-card--4 dcw-stat"><span>MY EVENTS</span><strong>${events.length}</strong><small>по текущему режиму</small></div><div class="dcw-card dcw-card--4 dcw-stat"><span>SYSTEM ROLE</span><strong style="font-size:clamp(22px,3vw,40px)">${esc(state.roles.filter(isActiveWindow).map(r=>r.role.toUpperCase()).join(' / ')||'—')}</strong><small>role ≠ permission</small></div></div><div class="dcw-section"><div class="dcw-section-head"><h2>Моя работа</h2><span class="dcw-source">RLS-PROTECTED DATA</span></div>${state.entities.length?`<div class="dcw-list">${state.entities.map(entityRow).join('')}</div>`:'<div class="dcw-empty-live">Активных entity assignments пока нет. Это не ошибка: membership и роль сами по себе не создают рабочие сущности.</div>'}${isOwnerAdmin()?`<div class="dcw-admin-note"><strong>OWNER_ADMIN</strong><br>Можно переключить MY WORK в системный read-only режим. Это не impersonation и не меняет текущего пользователя.<br><br><button type="button" class="dcw-action" data-system-view>${state.systemView?'ПОКАЗАТЬ МОИ ASSIGNMENTS':'ПОКАЗАТЬ ВСЕ DC ENTITIES'}</button></div>`:''}</div>`;
}

function work(){return `${head('Моя работа',state.systemView?'OWNER_ADMIN system view: все Dementor Club entities, разрешённые RLS.':'Только сущности, к которым у текущего user_id есть активный entity assignment.')}<div class="dcw-filters"><button class="dcw-filter is-active">${state.systemView?'SYSTEM VIEW':'MY ASSIGNMENTS'}</button>${isOwnerAdmin()?`<button class="dcw-filter" data-system-view>${state.systemView?'МОИ ASSIGNMENTS':'ВСЕ DC ENTITIES'}</button>`:''}</div>${state.entities.length?`<div class="dcw-list">${state.entities.map(entityRow).join('')}</div>`:'<div class="dcw-empty-live">Нет доступных сущностей.</div>'}<div class="dcw-section"><div class="dcw-callout"><strong>SYSTEM BOUNDARY:</strong> запросы этого экрана обращаются только к таблицам <code>dc_*</code>. Modern Pilgrims / Seven Clicks здесь отсутствуют на уровне данных, а не только меню.</div></div>`;}

function profile(){const roles=state.roles.filter(isActiveWindow);return `${head('Мой профиль','PERSON / auth identity отделена от membership и ролей.')}<div class="dcw-profile-grid"><div class="dcw-card"><h2>${esc(state.profile?.full_name||state.user?.email||'Профиль')}</h2><div class="dcw-badges">${roles.map(r=>roleBadge(r.role)).join(' ')}</div><div class="dcw-field"><span>AUTH USER ID</span><strong>${esc(state.user.id)}</strong></div><div class="dcw-field"><span>SYSTEM MEMBERSHIP</span><strong>DEMENTOR CLUB / ${esc(state.membership.status)}</strong></div><div class="dcw-field"><span>VALID FROM</span><strong>${esc(state.membership.valid_from||'—')}</strong></div></div><div class="dcw-card"><h2>Access model</h2><p>Identity ≠ membership ≠ role ≠ entity assignment. Эта версия Workspace только читает данные и не выдаёт write permissions.</p><div class="dcw-field"><span>ENTITY ASSIGNMENTS</span><strong>${state.assignments.length}</strong></div><div class="dcw-source-ref">${esc(state.membership.source_ref||'')}</div></div></div>`;}

function entityPage(){const e=state.entities.find(x=>x.id===state.entityId);if(!e)return '<div class="dcw-empty-live">Entity недоступна.</div>';const a=assignmentFor(e.id);if(e.entity_type==='program'){const p=state.programs.get(e.id);return `<button type="button" class="dcw-filter" data-route="work">← MY WORK</button><div class="dcw-entity-hero"><div><div class="dcw-badges">${badge('PROGRAM')} ${badge(p?.program_type||'')} ${badge(p?.delivery_mode||'')} ${roleBadge(a?.role||(isOwnerAdmin()?'owner_admin':'viewer'))} ${statusBadge(e.status)}</div><h1>${esc(e.title)}</h1><p>${esc(e.summary||'')}</p>${provenance(e)}</div><div class="dcw-entity-meta"><div class="dcw-meta-pair"><span>PROGRAM TYPE</span><strong>${esc(p?.program_type||'—')}</strong></div><div class="dcw-meta-pair"><span>DELIVERY</span><strong>${esc(p?.delivery_mode||'—')}</strong></div><div class="dcw-meta-pair"><span>CONTENT</span><strong>${esc(p?.content_summary||'—')}</strong></div></div></div><div class="dcw-grid dcw-section"><div class="dcw-card dcw-card--8"><h2>Read-only source</h2><p>${esc(e.summary||'')}</p><div class="dcw-source-ref">${esc(e.source_ref||'')}</div></div><div class="dcw-card dcw-card--4"><h3>Actions</h3><div class="dcw-action-grid"><button class="dcw-action" disabled>РЕДАКТИРОВАТЬ</button><button class="dcw-action" disabled>УЧАСТНИКИ</button></div><p class="dcw-source">WRITE DISABLED IN V0.1</p></div></div>`;}
  const ev=state.events.get(e.id);return `<button type="button" class="dcw-filter" data-route="work">← MY WORK</button><div class="dcw-entity-hero"><div><div class="dcw-badges">${badge('EVENT')} ${roleBadge(a?.role||(isOwnerAdmin()?'owner_admin':'viewer'))} ${statusBadge(e.status)}</div><h1>${esc(e.title)}</h1><p>${esc(e.summary||'')}</p>${provenance(e)}</div><div class="dcw-entity-meta"><div class="dcw-meta-pair"><span>LOCATION</span><strong>${esc(ev?.location||'—')}</strong></div><div class="dcw-meta-pair"><span>CAPACITY</span><strong>${esc(ev?.capacity||'—')}</strong></div><div class="dcw-meta-pair"><span>STATUS</span><strong>${esc(e.status)}</strong></div></div></div><div class="dcw-section"><div class="dcw-callout">Registrations и editing намеренно отключены: read-only access layer проверяется отдельно от будущего operational workflow.</div></div>`;
}

function render(){topTitle.textContent=state.route==='home'?'HOME':state.route==='work'?'MY WORK':state.route==='profile'?'MY PROFILE':'ENTITY';document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('is-active',b.dataset.route===state.route));if(state.route==='home')view.innerHTML=home();else if(state.route==='work')view.innerHTML=work();else if(state.route==='profile')view.innerHTML=profile();else view.innerHTML=entityPage();bind();}

function bind(){document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>{state.route=el.dataset.route;state.entityId=null;render();}));document.querySelectorAll('[data-entity]').forEach(el=>el.addEventListener('click',()=>{state.entityId=el.dataset.entity;state.route='entity';render();}));document.querySelectorAll('[data-system-view]').forEach(el=>el.addEventListener('click',async()=>{state.systemView=!state.systemView;await loadEntities({all:state.systemView});state.route='work';render();}));}

function showError(error){console.error('[DC Workspace]',error);gate('ОШИБКА WORKSPACE',error?.message||String(error),`<pre class="dcw-error">${esc(error?.code||'')}</pre>`);}

async function boot(){
  if(!cfg?.enabled||!cfg.url||!cfg.publishableKey)throw new Error('Supabase configuration unavailable');
  state.client=createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_WORKSPACE_CLIENT=state.client;
  state.client.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'&&!session)location.reload();});
  if(!await loadIdentity())return;
  await loadEntities({all:false});
  state.route='home';render();
}

boot().catch(showError);
