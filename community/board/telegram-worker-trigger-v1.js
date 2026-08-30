import {getClient,currentSession} from '/community-runtime-v1.js';

let busy=false;
let timer=null;
let lastRun=0;

async function triggerTelegramWorker(){
  if(busy||Date.now()-lastRun<1200)return;
  const session=await currentSession().catch(()=>null);
  if(!session)return;
  busy=true;
  lastRun=Date.now();
  try{
    const client=getClient();
    const {error}=await client.functions.invoke('telegram-outbox-worker',{body:{source:'community-board'}});
    if(error)console.warn('[DC Board] Telegram worker unavailable',error.message||error);
  }catch(error){
    console.warn('[DC Board] Telegram worker trigger failed',error);
  }finally{
    busy=false;
  }
}

function schedule(){
  clearTimeout(timer);
  timer=setTimeout(()=>triggerTelegramWorker(),700);
}

const boardHost=document.getElementById('boardHost');
if(boardHost)new MutationObserver(schedule).observe(boardHost,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(()=>triggerTelegramWorker(),1200),{once:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule()});
