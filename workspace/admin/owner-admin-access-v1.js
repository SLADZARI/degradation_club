import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
const fallback=base+'/workspace/';
if(!cfg?.enabled){location.replace(fallback);}
else{
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session},error}=await client.auth.getSession();
  if(error||!session?.user)location.replace(fallback);
  else{
    const {data:roles,error:roleError}=await client.from('dc_role_assignments').select('role,status,valid_from,valid_to').eq('profile_id',session.user.id).eq('role','owner_admin');
    const now=Date.now();const active=r=>r?.status==='active'&&(!r.valid_from||Date.parse(r.valid_from)<=now)&&(!r.valid_to||Date.parse(r.valid_to)>now);
    if(roleError||!(roles||[]).some(active))location.replace(fallback);
    else document.documentElement.dataset.dcOwnerAdmin='1';
  }
}
