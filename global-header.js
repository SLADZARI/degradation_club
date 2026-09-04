(()=>{
  if(typeof document==='undefined')return;
  const runtimePath=location.pathname.replace(/^\/degradation_club/,'');

  const boot=()=>{
    if(document.documentElement.dataset.dcGlobalHeader==='1')return;
    document.documentElement.dataset.dcGlobalHeader='1';

    const path=runtimePath;
    const activeFor=href=>href==='/'?path==='/':path.startsWith(href);
    const link=(href,label)=>`<a href="${href}"${activeFor(href)?' aria-current="page"':''}>${label}</a>`;

    const markup=`
      <a class="dc-global-brand" href="/" aria-label="Dementor Club — на главную">
        <img class="dc-global-brand__mark" src="/assets/brand/dementor-mark-black.svg" alt="" aria-hidden="true" width="24" height="24">
        DEMENTOR<span>CLUB</span>
      </a>
      <a class="dc-global-join-cta" href="/join/" data-global-join-cta${activeFor('/join/')?' aria-current="page"':''}>Вступить в клуб</a>
      <button class="dc-global-menu" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="dc-global-nav">
        <span class="dc-global-menu__icon" aria-hidden="true"><span></span></span><span class="dc-global-sr">Меню</span>
      </button>
      <nav class="dc-global-nav" id="dc-global-nav" aria-label="Главная навигация">
        ${link('/about/','О клубе')}
        ${link('/events/','События')}
        ${link('/projects/','Проекты')}
        ${link('/community/','Сообщество')}
        ${link('/merch/','Мерч')}
        <div class="dc-global-service" data-global-service aria-live="polite">
          <button class="dc-global-login" type="button" data-global-login>Войти</button>
        </div>
      </nav>`;

    // The public club header is canonical across both public pages and Workspace.
    // Workspace adds its own internal sidebar below it; it does not replace the site header.
    document.querySelectorAll('header.topbar,header.dc-global-header').forEach(node=>node.remove());
    const header=document.createElement('header');
    header.className='dc-global-header';
    header.dataset.dcHeaderAuth='checking';
    header.innerHTML=markup;
    document.body.insertBefore(header,document.body.firstChild);

    if(!document.querySelector('link[rel="icon"][href="/assets/brand/dementor-mark-lime.svg"]')){
      const favicon=document.createElement('link');
      favicon.rel='icon';favicon.type='image/svg+xml';favicon.href='/assets/brand/dementor-mark-lime.svg';
      document.head.appendChild(favicon);
    }

    const menu=header.querySelector('.dc-global-menu');
    const nav=header.querySelector('.dc-global-nav');
    const service=header.querySelector('[data-global-service]');
    const joinCta=header.querySelector('[data-global-join-cta]');
    const closeMenu=(restoreFocus=false)=>{
      nav?.classList.remove('is-open');
      menu?.setAttribute('aria-expanded','false');
      menu?.setAttribute('aria-label','Открыть меню');
      document.body.classList.remove('dc-global-menu-open');
      if(restoreFocus)menu?.focus();
    };
    const openMenu=()=>{
      nav?.classList.add('is-open');
      menu?.setAttribute('aria-expanded','true');
      menu?.setAttribute('aria-label','Закрыть меню');
      document.body.classList.add('dc-global-menu-open');
      nav?.querySelector('a,button')?.focus();
    };
    menu?.addEventListener('click',()=>menu.getAttribute('aria-expanded')==='true'?closeMenu():openMenu());
    nav?.addEventListener('click',event=>{if(event.target.closest?.('a,button'))closeMenu()});
    addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')closeMenu(true)});
    addEventListener('resize',()=>{if(innerWidth>900&&menu?.getAttribute('aria-expanded')==='true')closeMenu()},{passive:true});

    const text=value=>String(value??'').trim();
    const active=row=>row?.status==='active'&&(!row.valid_from||Date.parse(row.valid_from)<=Date.now())&&(!row.valid_to||Date.parse(row.valid_to)>Date.now());
    let clientPromise=null;

    const getClient=async()=>{
      if(window.DEMENTOR_SUPABASE_CLIENT)return window.DEMENTOR_SUPABASE_CLIENT;
      if(clientPromise)return clientPromise;
      clientPromise=(async()=>{
        const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
        if(!cfg?.enabled||!cfg.url||!cfg.publishableKey)throw new Error('Supabase configuration unavailable');
        const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');
        const client=createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
        window.DEMENTOR_SUPABASE_CLIENT=client;
        return client;
      })();
      return clientPromise;
    };

    const login=async()=>{
      const client=await getClient();
      const callback=location.origin+'/auth/callback/?next='+encodeURIComponent('/workspace/');
      const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback}});
      if(error)throw error;
    };

    const renderGuest=()=>{
      header.dataset.dcHeaderAuth='guest';
      if(joinCta)joinCta.hidden=false;
      if(!service)return;
      service.replaceChildren();
      const button=document.createElement('button');
      button.type='button';button.className='dc-global-login';button.dataset.globalLogin='1';button.textContent='Войти';
      service.appendChild(button);
      button.addEventListener('click',()=>login().catch(error=>console.warn('[DC GlobalHeader login]',error)));
    };

    const renderIdentity=({name,avatar,member})=>{
      header.dataset.dcHeaderAuth=member?'member':'authenticated';
      if(joinCta)joinCta.hidden=Boolean(member);
      if(!service)return;
      service.replaceChildren();
      const anchor=document.createElement('a');
      anchor.href='/workspace/';anchor.className='dc-global-identity';anchor.dataset.globalIdentity='1';anchor.setAttribute('aria-label',`${name} — открыть Workspace`);
      if(avatar){
        const image=document.createElement('img');image.className='dc-global-identity__avatar';image.src=avatar;image.alt='';image.referrerPolicy='no-referrer';anchor.appendChild(image);
      }else{
        const fallback=document.createElement('span');fallback.className='dc-global-identity__avatar dc-global-identity__avatar--fallback';fallback.setAttribute('aria-hidden','true');fallback.textContent=(name.match(/[\p{L}\p{N}]/u)?.[0]||'D').toUpperCase();anchor.appendChild(fallback);
      }
      const label=document.createElement('span');label.className='dc-global-identity__name';label.textContent=name;anchor.appendChild(label);
      service.appendChild(anchor);
    };

    const safe=promise=>Promise.resolve(promise).catch(error=>({data:null,error}));
    const resolveIdentity=async session=>{
      const user=session?.user;
      if(!user){renderGuest();return;}
      const client=await getClient();
      const [profileResult,membershipResult,roleResult]=await Promise.all([
        safe(client.from('profiles').select('full_name,avatar_url').eq('id',user.id).maybeSingle()),
        safe(client.from('dc_system_memberships').select('status,valid_from,valid_to').eq('profile_id',user.id).maybeSingle()),
        safe(client.from('dc_role_assignments').select('role,status,valid_from,valid_to').eq('profile_id',user.id))
      ]);
      const profile=profileResult?.data||{};
      const roles=Array.isArray(roleResult?.data)?roleResult.data.filter(active).map(row=>row.role):[];
      const member=active(membershipResult?.data)||roles.includes('dementor')||roles.includes('owner_admin');
      const name=text(profile.full_name)||text(user.user_metadata?.full_name)||text(user.user_metadata?.name)||text(user.email?.split('@')[0])||'Участник';
      const avatar=text(profile.avatar_url)||text(user.user_metadata?.avatar_url)||text(user.user_metadata?.picture)||'';
      renderIdentity({name,avatar,member});
    };

    const bootAuth=async()=>{
      try{
        const client=await getClient();
        const {data,error}=await client.auth.getSession();
        if(error)throw error;
        await resolveIdentity(data?.session||null);
        client.auth.onAuthStateChange((_event,session)=>{resolveIdentity(session).catch(error=>console.warn('[DC GlobalHeader auth state]',error))});
      }catch(error){
        console.warn('[DC GlobalHeader auth]',error);
        renderGuest();
      }
    };
    bootAuth();

    if(!document.querySelector('script[src="/support-v1.js"]')){
      const support=document.createElement('script');support.src='/support-v1.js';support.defer=true;document.body.appendChild(support);
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
