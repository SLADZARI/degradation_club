import {getClient,currentSession} from '/community-runtime-v1.js';

let busy=false;
let timer=null;
let lastRun=0;
let authRetries=0;
const maxAuthRetries=12;

function schedule(delay=700){
  clearTimeout(timer);
  timer=setTimeout(()=>triggerTelegramWorker(),delay);
}

async function triggerTelegramWorker(){
  if(busy||Date.now()-lastRun<1200)return;
  const client=getClient();
  const session=await currentSession(client).catch(()=>null);
  if(!session){
    if(authRetries<maxAuthRetries){authRetries+=1;schedule(1200)}
    return;
  }
  authRetries=0;
  busy=true;
  lastRun=Date.now();
  try{
    const {error}=await client.functions.invoke('telegram-outbox-worker',{body:{source:'community-board-v2'}});
    if(error)console.warn('[DC Board] Telegram worker unavailable',error.message||error);
  }catch(error){
    console.warn('[DC Board] Telegram worker trigger failed',error);
  }finally{
    busy=false;
  }
}

const boardHost=document.getElementById('boardHost');
if(boardHost)new MutationObserver(()=>schedule(350)).observe(boardHost,{childList:true,subtree:true});
window.addEventListener('load',()=>schedule(500),{once:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(250)});
setTimeout(()=>schedule(0),2500);
