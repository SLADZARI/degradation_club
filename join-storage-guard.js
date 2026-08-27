(()=>{
  if(!location.pathname.startsWith('/join'))return;
  let available=true;
  try{
    const key='__dc_storage_probe__';
    localStorage.setItem(key,'1');
    localStorage.removeItem(key);
  }catch(e){available=false;}
  document.documentElement.dataset.dcStorage=available?'available':'unavailable';
  if(available){
    if(!document.querySelector('script[src="/dementor-account-sync-v1.js"]')){
      const sync=document.createElement('script');
      sync.src='/dementor-account-sync-v1.js';
      sync.defer=true;
      document.head.appendChild(sync);
    }
    return;
  }

  const style=document.createElement('style');
  style.textContent=`
    html[data-dc-storage="unavailable"] #sphereGrid,
    html[data-dc-storage="unavailable"] #questionHost,
    html[data-dc-storage="unavailable"] .actions,
    html[data-dc-storage="unavailable"] #another,
    html[data-dc-storage="unavailable"] #restart{pointer-events:none;opacity:.38}
    .dc-storage-warning{margin:18px 0 28px;padding:16px 18px;border:1px solid currentColor;display:grid;gap:7px;font-size:13px;line-height:1.45}
    .dc-storage-warning strong{font-size:11px;letter-spacing:.09em}
  `;
  document.head.appendChild(style);

  const show=()=>{
    if(document.querySelector('.dc-storage-warning'))return;
    const host=document.querySelector('.join-shell');
    if(!host)return;
    const note=document.createElement('div');
    note.className='dc-storage-warning';
    note.setAttribute('role','alert');
    note.innerHTML='<strong>ЛОКАЛЬНОЕ ХРАНЕНИЕ НЕДОСТУПНО</strong><span>Этот onboarding хранит профиль в localStorage браузера и при входе синхронизирует его с аккаунтом Dementor Club. Сейчас браузер запрещает локальную запись, поэтому запуск процедуры отключён. Разрешите хранение данных сайта или откройте страницу в обычном режиме браузера.</span>';
    host.prepend(note);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',show,{once:true}):show();
})();
