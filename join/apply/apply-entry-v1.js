import {getClient,currentSession} from '/community-runtime-v1.js';
import {syncDc9LocalHistory} from '/join/apply/dc9-baseline-sync-v1.js';

const host=document.getElementById('applyHost');
try{
  const client=getClient();
  const session=await currentSession(client);
  if(session)await syncDc9LocalHistory(client,session.user.id);
  await import('/join/apply/apply.js');
}catch(error){
  console.error('[DC9 application history sync]',error);
  if(host)host.innerHTML='<section class="dc-apply-gate"><div class="dc-apply-kicker">DC-9 / HISTORY SYNC</div><h2>НЕ УДАЛОСЬ<br>ЗАКРЕПИТЬ КАРТУ.</h2><p>Обновите страницу и попробуйте снова. Заявка не будет отправлена, пока история первого 9/9 не синхронизирована.</p><button type="button" data-retry>ПОВТОРИТЬ →</button></section>';
  host?.querySelector('[data-retry]')?.addEventListener('click',()=>location.reload());
}
