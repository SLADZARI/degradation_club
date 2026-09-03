(()=>{
  let attempts=0;
  let timer=null;
  let busy=false;
  let lastRun=0;
  const maxAttempts=40;
  const minInterval=15000;

  const schedule=(delay=500)=>{
    if(timer)return;
    const cooldown=Math.max(0,minInterval-(Date.now()-lastRun));
    timer=setTimeout(()=>{
      timer=null;
      run();
    },Math.max(delay,cooldown));
  };

  async function run(){
    if(busy)return;
    const client=window.DEMENTOR_SUPABASE_CLIENT;
    if(!client){
      if(attempts++<maxAttempts)schedule(500);
      return;
    }
    busy=true;
    try{
      const {data,error}=await client.auth.getSession();
      if(error||!data?.session){
        if(attempts++<maxAttempts){busy=false;schedule(750);return}
        return;
      }
      attempts=0;
      lastRun=Date.now();
      const result=await client.functions.invoke('telegram-outbox-worker',{body:{source:'community-board-v3'}});
      if(result?.error)console.warn('[DC Board] Telegram worker unavailable',result.error.message||result.error);
    }catch(error){
      console.warn('[DC Board] Telegram worker trigger failed',error);
    }finally{
      busy=false;
    }
  }

  const start=()=>schedule(250);
  if(document.readyState==='complete')start();
  else window.addEventListener('load',start,{once:true});

  document.addEventListener('submit',event=>{
    if(event.target?.id!=='artifactForm')return;
    setTimeout(()=>schedule(0),3000);
  },true);

  schedule(1000);
})();