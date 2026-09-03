(()=>{
  if(typeof document==='undefined')return;
  const host=document.querySelector('[data-workspace-sidebar]');
  if(!host||host.dataset.dcWorkspaceShell==='1')return;
  host.dataset.dcWorkspaceShell='1';
  host.hidden=true;
  document.documentElement.dataset.dcWorkspaceAuth='checking';

  const path=location.pathname.replace(/^\/degradation_club/,'');
  const root='/workspace/';
  const board='/workspace/board/';
  const artifacts='/workspace/artifacts/';
  const review='/workspace/review/';
  const admin='/workspace/admin/';
  const current=path;
  const active=(route)=>current===route||current===route+'index.html';
  const link=(href,label,{hidden=false,roleTool=false,memberTool=false}={})=>`<a class="dcw-nav-link${active(href)?' is-active':''}" href="${href}"${hidden?' hidden':''}${roleTool?' data-role-tool="1"':''}${memberTool?' data-member-tool="1"':''}>${label}</a>`;
  const viewLink=(key,label,{hidden=false,workNav=false}={})=>`<a class="dcw-nav-link" href="${root}#${key}" data-route="${key}"${hidden?' hidden':''}${workNav?' data-work-nav':''}>${label}</a>`;

  host.innerHTML=`
    <a class="dcw-brand" href="${root}"><span>DEMENTOR</span><strong>CLUB</strong></a>
    <nav class="dcw-nav" aria-label="Личный кабинет">
      ${viewLink('home','HOME')}
      ${viewLink('club','MY CLUB')}
      ${link(board,'COMMUNITY BOARD',{hidden:true,memberTool:true})}
      ${link(artifacts,'MY ARTIFACTS',{hidden:true,memberTool:true})}
      ${viewLink('activity','MY ACTIVITY')}
      ${viewLink('work','MY WORK',{hidden:true,workNav:true})}
      ${viewLink('profile','MY PROFILE')}
      ${link(review,'MEMBERSHIP REVIEW',{hidden:true,roleTool:true})}
      ${link(admin,'SYSTEM TOOLS',{hidden:true,roleTool:true})}
      <button type="button" class="dcw-nav-logout" data-global-logout>LOG OUT</button>
    </nav>
    <div class="dcw-boundary"><span>SYSTEM</span><strong>DEMENTOR CLUB</strong><small>Один аккаунт. Членство, рабочие возможности и role-tools добавляются поверх базового кабинета.</small></div>
    <div class="dcw-session" id="sessionBox" data-shell-session><span>SESSION</span><strong>ПРОВЕРКА…</strong></div>`;

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
    const sessionBox=host.querySelector('[data-shell-session]');
    if(!user){
      document.documentElement.dataset.dcWorkspaceAuth='guest';
      host.hidden=true;
      if(sessionBox)sessionBox.innerHTML='<span>SESSION</span><strong>НЕ ВЫПОЛНЕН ВХОД</strong>';
      return;
    }

    document.documentElement.dataset.dcWorkspaceAuth='authenticated';
    host.hidden=false;
    if(sessionBox)sessionBox.innerHTML=`<span>SESSION</span><strong>${String(user.email||'AUTHENTICATED').replace(/[<>&"']/g,'')}</strong>`;
    const now=Date.now();
    const isActive=row=>row?.status==='active'&&(!row.valid_from||Date.parse(row.valid_from)<=now)&&(!row.valid_to||Date.parse(row.valid_to)>now);
    const [{data:roles,error:roleError},{data:assignments,error:assignmentError},{data:membership,error:membershipError}]=await Promise.all([
      client.from('dc_role_assignments').select('role,status,valid_from,valid_to').eq('profile_id',user.id),
      client.from('dc_entity_assignments').select('id,status,valid_from,valid_to').eq('profile_id',user.id),
      client.from('dc_system_memberships').select('status,valid_from,valid_to').eq('profile_id',user.id).maybeSingle()
    ]);
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
    const reviewLink=[...host.querySelectorAll('a')].find(a=>a.href.endsWith('/workspace/review/'));if(reviewLink)reviewLink.hidden=!dementor;
    const adminLink=[...host.querySelectorAll('a')].find(a=>a.href.endsWith('/workspace/admin/'));if(adminLink)adminLink.hidden=!owner;
  }).catch(error=>{
    document.documentElement.dataset.dcWorkspaceAuth='error';
    host.hidden=true;
    console.warn('[DC Workspace shell]',error);
  });

  host.querySelector('[data-global-logout]')?.addEventListener('click',async event=>{
    const button=event.currentTarget;button.disabled=true;
    try{
      const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
      if(cfg?.enabled){
        const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');
        const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
        await client.auth.signOut();
      }
    }finally{location.href='/';}
  });
})();
