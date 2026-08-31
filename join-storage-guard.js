(()=>{
  if(!location.pathname.startsWith('/join'))return;
  let available=true;
  try{
    const key='__dc_storage_probe__';
    localStorage.setItem(key,'1');
    localStorage.removeItem(key);
  }catch(e){available=false;}
  document.documentElement.dataset.dcStorage=available?'available':'unavailable';

  // Temporary compatibility bridge for the historical Self-development id.
  // Old /join/ code writes `self-development`; account/runtime authority uses `self_development`.
  // Keep both aliases synchronized until the inline onboarding engine is migrated in one controlled change.
  const syncLegacySphereAlias=()=>{
    if(!available)return;
    try{
      const storageKey='dementorClubOnboardingV3';
      const db=JSON.parse(localStorage.getItem(storageKey)||'null');
      if(!db?.results)return;
      const legacy=db.results['self-development'];
      const canonical=db.results.self_development;
      if(!legacy&&!canonical)return;
      const stamp=x=>Date.parse(x?.date||0)||0;
      const latest=!canonical||stamp(legacy)>stamp(canonical)?legacy:canonical;
      let changed=false;
      if(latest&&JSON.stringify(db.results['self-development'])!==JSON.stringify(latest)){db.results['self-development']=latest;changed=true}
      if(latest&&JSON.stringify(db.results.self_development)!==JSON.stringify(latest)){db.results.self_development=latest;changed=true}
      if(changed)localStorage.setItem(storageKey,JSON.stringify(db));
    }catch(e){console.warn('[DC9 legacy sphere alias]',e)}
  };
  syncLegacySphereAlias();
  if(available)setInterval(syncLegacySphereAlias,1200);

  if(available)return;

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
