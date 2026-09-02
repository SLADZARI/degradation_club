import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const nav=document.querySelector('.dcw-nav');
if(cfg?.enabled&&nav){
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session}}=await client.auth.getSession();
  const user=session?.user;
  if(user){
    const {data:role}=await client.from('dc_role_assignments').select('role,status').eq('profile_id',user.id).eq('role','dementor').eq('status','active').maybeSingle();
    if(role&&!nav.querySelector('[data-review-nav]')){
      const button=document.createElement('button');
      button.type='button';
      button.dataset.reviewNav='1';
      button.textContent='MEMBERSHIP REVIEW';
      button.addEventListener('click',()=>{location.href='./review/'});
      nav.appendChild(button);
    }
  }
}
