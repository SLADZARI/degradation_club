import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const callback=location.origin+'/auth/callback/?next='+encodeURIComponent(location.pathname+location.search+location.hash);
const fallback='/workspace/';
if(!cfg?.enabled){location.replace(fallback);}
else{
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  const gate=document.createElement('div');gate.className='dc-owner-gate';gate.innerHTML='<div class="dc-owner-gate__box"><div>DEMENTOR CLUB / OWNER_ADMIN</div><h1>ПРОВЕРКА<br>ДОСТУПА.</h1><p>Внутренние инструменты доступны только активному OWNER_ADMIN.</p><div data-actions></div></div>';
  const style=document.createElement('style');style.textContent='.dc-owner-gate{position:fixed;inset:0;z-index:99999;background:#f2f0e8;color:#111;display:grid;place-items:center;padding:24px;font-family:Arial,Helvetica,sans-serif}.dc-owner-gate__box{width:min(760px,100%);border:1px solid #111;padding:clamp(24px,5vw,54px)}.dc-owner-gate h1{font:900 clamp(42px,8vw,88px)/.84 Arial,sans-serif;letter-spacing:-.06em;margin:14px 0 22px}.dc-owner-gate button,.dc-owner-gate a{display:inline-block;margin:16px 8px 0 0;border:1px solid #111;background:#d8ff3e;color:#111;padding:13px 16px;font:900 11px Arial,sans-serif;text-decoration:none;cursor:pointer}.dc-owner-gate .secondary{background:transparent}';document.head.appendChild(style);document.body.appendChild(gate);
  const actions=gate.querySelector('[data-actions]');const message=gate.querySelector('p');
  const {data:{session},error}=await client.auth.getSession();
  if(error||!session?.user){
    message.textContent='Нужен аккаунт OWNER_ADMIN.';actions.innerHTML='<button type="button" data-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button><a class="secondary" href="/workspace/">В КАБИНЕТ</a>';
    actions.querySelector('[data-login]')?.addEventListener('click',()=>client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback}}));
  }else{
    const {data:roles,error:roleError}=await client.from('dc_role_assignments').select('role,status,valid_from,valid_to').eq('profile_id',session.user.id).eq('role','owner_admin');
    const now=Date.now();const active=r=>r?.status==='active'&&(!r.valid_from||Date.parse(r.valid_from)<=now)&&(!r.valid_to||Date.parse(r.valid_to)>now);
    if(roleError||!(roles||[]).some(active)){
      message.textContent='У этого аккаунта нет активной роли OWNER_ADMIN.';actions.innerHTML='<a href="/workspace/">В ЛИЧНЫЙ КАБИНЕТ</a>';
    }else{
      document.documentElement.dataset.dcOwnerAdmin='1';window.dispatchEvent(new CustomEvent('dc:owner-admin-ready',{detail:{userId:session.user.id,email:session.user.email||null}}));gate.remove();
    }
  }
}
