// Dementor Club — OAuth return preboot for GitHub Pages.
// Restores Supabase auth state before the main account-sync runtime boots.
(()=>{
  if(!location.pathname.includes('/join')) return;
  if(window.__DC_AUTH_PREBOOT_V1__) return;
  window.__DC_AUTH_PREBOOT_V1__=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const hasAuthHash=()=>{
    const raw=location.hash.startsWith('#')?location.hash.slice(1):location.hash;
    if(!raw) return false;
    const p=new URLSearchParams(raw);
    return Boolean(p.get('access_token')||p.get('refresh_token')||p.get('error')||p.get('error_description'));
  };

  async function waitConfig(){
    for(let i=0;i<100;i++){
      const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
      if(cfg?.enabled&&cfg.url&&cfg.publishableKey)return cfg;
      await sleep(30);
    }
    throw new Error('Supabase configuration unavailable');
  }

  async function run(){
    const cfg=await waitConfig();
    const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm');
    const client=mod.createClient(cfg.url,cfg.publishableKey,{
      auth:{persistSession:true,detectSessionInUrl:true,autoRefreshToken:true,flowType:'implicit'}
    });

    // Explicit fallback for static-host OAuth fragments.
    if(hasAuthHash()){
      const raw=location.hash.startsWith('#')?location.hash.slice(1):location.hash;
      const p=new URLSearchParams(raw);
      const authError=p.get('error_description')||p.get('error');
      if(authError) throw new Error(authError);
      const access_token=p.get('access_token');
      const refresh_token=p.get('refresh_token');
      if(access_token&&refresh_token){
        const {error}=await client.auth.setSession({access_token,refresh_token});
        if(error) throw error;
      }
    }

    const {data,error}=await client.auth.getSession();
    if(error) throw error;
    if(data?.session){
      window.__DC_AUTH_PREBOOT_SESSION__=data.session;
      if(location.hash) history.replaceState({},'',location.pathname+location.search);
    }
    window.__DC_AUTH_PREBOOT_DONE__=true;
    window.dispatchEvent(new CustomEvent('dc:auth-preboot-ready',{detail:{signedIn:Boolean(data?.session)}}));
  }

  window.__DC_AUTH_PREBOOT_PROMISE__=run().catch(err=>{
    window.__DC_AUTH_PREBOOT_DONE__=true;
    window.__DC_AUTH_PREBOOT_ERROR__=String(err?.message||err);
    console.error('[Dementor Auth Preboot]',err);
  });
})();
