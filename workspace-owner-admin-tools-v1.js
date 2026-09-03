import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
if(cfg?.enabled&&location.pathname.includes('/workspace')){
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session}}=await client.auth.getSession();const user=session?.user;
  if(user){
    const {data:roles,error}=await client.from('dc_role_assignments').select('role,status,valid_from,valid_to').eq('profile_id',user.id).eq('role','owner_admin');
    const active=r=>r?.status==='active'&&(!r.valid_from||Date.parse(r.valid_from)<=Date.now())&&(!r.valid_to||Date.parse(r.valid_to)>Date.now());
    if(!error&&(roles||[]).some(active)){
      const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
      const href=base+'/workspace/admin/';
      const style=document.createElement('style');style.textContent='.dcw-admin-tools-card{background:#d8ff3e!important;color:#111!important;text-decoration:none!important}.dcw-admin-tools-card small{color:#111!important;opacity:.65!important}';document.head.appendChild(style);
      const install=()=>{
        if((document.getElementById('topTitle')?.textContent||'').trim()!=='HOME')return;
        const grid=document.querySelector('.dcw-dashboard-grid');if(!grid||grid.querySelector('[data-owner-system-tools]'))return;
        const a=document.createElement('a');a.href=href;a.className='dcw-dashboard-card dcw-admin-tools-card';a.dataset.ownerSystemTools='1';a.innerHTML='<span>SYSTEM TOOLS</span><strong>→</strong><small>admin / tests / diagnostics</small>';grid.appendChild(a);
      };
      install();new MutationObserver(()=>queueMicrotask(install)).observe(document.getElementById('appView')||document.body,{childList:true,subtree:true});
    }
  }
}
