import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
if(cfg?.enabled){
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session}}=await client.auth.getSession();
  if(session?.user){
    const {data:role}=await client.from('dc_role_assignments').select('role,status').eq('profile_id',session.user.id).eq('role','dementor').eq('status','active').maybeSingle();
    if(!role)location.replace('../');
  }
}
