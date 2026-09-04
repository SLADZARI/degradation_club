(()=>{
  if(typeof document==='undefined')return;
  const host=document.querySelector('[data-workspace-sidebar]');
  if(!host||host.dataset.dcWorkspaceShell==='1')return;
  host.dataset.dcWorkspaceShell='1';
  document.documentElement.dataset.dcWorkspaceAuth='checking';

  const path=location.pathname.replace(/^\/degradation_club/,'');
  const root='/workspace/';
  const board='/workspace/board/';
  const artifacts='/workspace/artifacts/';
  const review='/workspace/review/';
  const admin='/workspace/admin/';
  const current=path;
  const active=(route)=>current===route||current===route+'index.html';
  const link=(href,label,{hidden=false,roleTool=false,memberTool=false,key=null}={})=>`<a class="dcw-nav-link${active(href)?' is-active':''}" href="${href}"${hidden?' hidden':''}${roleTool?' data-role-tool="1"':''}${memberTool?' data-member-tool="1"':''}${key?` data-shell-key="${key}"`:''}>${label}</a>`;
  const viewLink=(key,label,{hidden=false,workNav=false,roleHome=false}={})=>`<a class="dcw-nav-link" href="${root}#${key}" data-route="${key}"${hidden?' hidden':''}${workNav?' data-work-nav':''}${roleHome?' data-role-home="1"':''}>${label}</a>`;

  host.innerHTML=`
    <a class="dcw-brand" href="/" aria-label="Dementor Club — на публичный сайт"><span>DEMENTOR</span><strong>CLUB</strong></a>
    <nav class="dcw-nav" aria-label="Личный кабинет" data-workspace-nav hidden>
      ${link(board,'COMMUNITY BOARD',{hidden:true,memberTool:true,key:'board'})}
      ${viewLink('club','МОЙ КЛУБ')}
      ${link(artifacts,'МОИ АРТЕФАКТЫ',{hidden:true,memberTool:true,key:'artifacts'})}
      ${viewLink('activity','МОЯ АКТИВНОСТЬ')}
      ${viewLink('work','МОЯ РАБОТА',{hidden:true,workNav:true})}
      ${viewLink('home','HOME',{hidden:true,roleHome:true})}
      ${link(review,'MEMBERSHIP REVIEW',{hidden:true,roleTool:true})}
      ${link(admin,'SYSTEM TOOLS',{hidden:true,roleTool:true})}
    </nav>
    <div class="dcw-boundary"><span>SYSTEM</span><strong>DEMENTOR CLUB</strong><small>Community Board — основная поверхность участника. Роли и рабочие возможности добавляются поверх членства.</small></div>
    <div class="dcw-session" id="sessionBox" data-shell-session><span>SESSION</span><strong>ПРОВЕРКА…</strong></div>`;
  host.hidden=false;

  const nav=host.querySelector('[data-workspace-nav]');
  const sessionBox=host.querySelector('[data-shell-session]');
  const setCurrentRootRoute=()=>{
    if(current!=='/workspace/'&&current!=='/workspace/index.html')return;
    const route=(location.hash||'#home').slice(1);
    host.querySelectorAll('[data-route]').forEach(control=>control.classList.toggle('is-active',control.dataset.route===route));
  };
  setCurrentRootRoute();
  addEventListener('hashchange',setCurrentRootRoute);

  const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
  if(!cfg?.enabled||!cfg.url||!cfg.publishableKey){document.documentElement.dataset.dcWorkspaceAuth='error';return;}
  import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm').then(async({createClient})=>{
    const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
    window.DEMENTOR_SUPABASE_CLIENT=client;
    const {data:{session}}=await client.auth.getSession();
    const user=session?.user;
    if(!user){
      document.documentElement.dataset.dcWorkspaceAuth='guest';
      if(nav)nav.hidden=true;
      if(sessionBox)sessionBox.innerHTML='<span>SESSION</span><strong>НЕ ВЫПОЛНЕН ВХОД</strong>';
      return;
    }

    document.documentElement.dataset.dcWorkspaceAuth='authenticated';
    if(nav)nav.hidden=false;
    const now=Date.now();
    const isActive=row=>row?.status==='active'&&(!row.valid_from||Date.parse(row.valid_from)<=now)&&(!row.valid_to||Date.parse(row.valid_to)>now);
    const [{data:profile,error:profileError},{data:roles,error:roleError},{data:assignments,error:assignmentError},{data:membership,error:membershipError}]=await Promise.all([
      client.from('profiles').select('full_name,avatar_url').eq('id',user.id).maybeSingle(),
      client.from('dc_role_assignments').select('role,status,valid_from,valid_to').eq('profile_id',user.id),
      client.from('dc_entity_assignments').select('id,status,valid_from,valid_to').eq('profile_id',user.id),
      client.from('dc_system_memberships').select('status,valid_from,valid_to').eq('profile_id',user.id).maybeSingle()
    ]);
    if(profileError)console.warn('[DC Workspace shell profile]',profileError);
    if(roleError)console.warn('[DC Workspace shell roles]',roleError);
    if(assignmentError)console.warn('[DC Workspace shell assignments]',assignmentError);
    if(membershipError)console.warn('[DC Workspace shell membership]',membershipError);
    const activeRoles=(roles||[]).filter(isActive).map(r=>r.role);
    const dementor=activeRoles.includes('dementor')||activeRoles.includes('owner_admin');
    const owner=activeRoles.includes('owner_admin');
    const member=isActive(membership)||dementor;
    const hasWork=dementor||(assignments||[]).some(isActive);

    host.querySelectorAll('[data-member-tool]').forEach(control=>control.hidden=!member);
    const workControl=host.querySelector('[data-route="work"]');if(workControl)workControl.hidden=!hasWork;
    const homeControl=host.querySelector('[data-role-home]');if(homeControl)homeControl.hidden=!dementor;
    const reviewLink=[...host.querySelectorAll('a')].find(a=>a.href.endsWith('/workspace/review/'));if(reviewLink)reviewLink.hidden=!dementor;
    const adminLink=[...host.querySelectorAll('a')].find(a=>a.href.endsWith('/workspace/admin/'));if(adminLink)adminLink.hidden=!owner;

    const name=String(profile?.full_name||user.user_metadata?.full_name||user.user_metadata?.name||user.email||'Участник').trim();
    const avatar=String(profile?.avatar_url||user.user_metadata?.avatar_url||user.user_metadata?.picture||'').trim();
    if(sessionBox){
      const avatarMarkup=avatar?`<img class="dcw-session-avatar" src="${avatar.replace(/["<>]/g,'')}" alt="">`:`<span class="dcw-session-avatar dcw-session-avatar--fallback" aria-hidden="true">${(name.match(/[\p{L}\p{N}]/u)?.[0]||'D').toUpperCase()}</span>`;
      sessionBox.innerHTML=`<a class="dcw-session-profile dcw-session-profile--link" href="${root}#profile">${avatarMarkup}<div><span>PROFILE</span><strong>${name.replace(/[<>&"']/g,'')}</strong><small>${String(user.email||'').replace(/[<>&"']/g,'')}</small></div></a><button type="button" class="dcw-logout" data-shell-logout>ВЫЙТИ</button>`;
      sessionBox.querySelector('[data-shell-logout]')?.addEventListener('click',async event=>{
        const button=event.currentTarget;button.disabled=true;
        try{await client.auth.signOut()}finally{location.href='/'}
      });
    }

    // Ordinary active Members enter the Board by default. Role workspaces keep
    // their root surface available for Dementor/owner operational tools.
    if(member&&!dementor&&(current==='/workspace/'||current==='/workspace/index.html')&&!location.hash){
      location.replace(board);
    }
  }).catch(error=>{
    document.documentElement.dataset.dcWorkspaceAuth='error';
    if(nav)nav.hidden=true;
    console.warn('[DC Workspace shell]',error);
  });
})();
