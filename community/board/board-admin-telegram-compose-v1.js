import {getClient,esc} from '/community-runtime-v1.js';

const client=getClient();
let lastTelegramError='';

function isOwnerAdmin(){return String(document.documentElement.dataset.dcBoardUserState||'')==='OWNER_ADMIN'}

function installCheckbox(){
  if(!isOwnerAdmin())return;
  const form=document.getElementById('artifactForm');
  if(!form||form.querySelector('[data-admin-telegram-compose]'))return;
  const actions=form.querySelector('.dc-composer-actions');
  if(!actions)return;
  const field=document.createElement('label');
  field.className='dc-admin-telegram-compose';
  field.dataset.adminTelegramCompose='1';
  field.innerHTML='<span class="dc-admin-telegram-compose__check"><input type="checkbox" name="admin_send_telegram" value="1"><span aria-hidden="true"></span></span><span><strong>ОТПРАВИТЬ В TELEGRAM ПОСЛЕ ПУБЛИКАЦИИ</strong><small>Только OWNER ADMIN. По умолчанию выключено. Board публикуется независимо от Telegram.</small></span>';
  form.insertBefore(field,actions);
}

function showTelegramWarning(message){
  lastTelegramError=String(message||'TELEGRAM_PROMOTION_FAILED');
  const host=document.getElementById('entryHost')||document.body;
  let notice=document.getElementById('dcAdminTelegramWarning');
  if(!notice){notice=document.createElement('div');notice.id='dcAdminTelegramWarning';notice.className='dc-admin-telegram-warning';host.prepend(notice)}
  notice.innerHTML=`<strong>BOARD ОПУБЛИКОВАН · TELEGRAM НЕ ПОСТАВЛЕН В ОЧЕРЕДЬ</strong><span>${esc(lastTelegramError)}</span>`;
}

function wantsTelegram(){return Boolean(document.querySelector('#artifactForm [name="admin_send_telegram"]:checked'))}

function patchRpc(){
  if(client.__dcAdminTelegramComposePatched)return;
  client.__dcAdminTelegramComposePatched=true;
  const originalRpc=client.rpc.bind(client);
  client.rpc=async(name,args,options)=>{
    if(name!=='dc_publish_artifact_v1'||!isOwnerAdmin()||!wantsTelegram())return originalRpc(name,args,options);
    const published=await originalRpc(name,args,options);
    if(published?.error)return published;
    const payload=Array.isArray(published?.data)?published.data[0]:published?.data;
    const artifactId=payload?.artifact_id||args?.p_artifact_id;
    if(!artifactId)return published;
    try{
      const promoted=await originalRpc('dc_admin_promote_artifact_telegram_v1',{p_artifact_id:artifactId});
      if(promoted?.error)showTelegramWarning(promoted.error.message||promoted.error);
    }catch(error){showTelegramWarning(error?.message||error)}
    return published;
  };
}

const observer=new MutationObserver(()=>installCheckbox());
observer.observe(document.getElementById('entryHost')||document.body,{childList:true,subtree:true});
patchRpc();
installCheckbox();
