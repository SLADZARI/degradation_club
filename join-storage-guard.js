(()=>{
  const runtimePath=location.pathname.replace(/^\/degradation_club(?=\/|$)/,'')||'/';
  if(!runtimePath.startsWith('/join'))return;
  let available=true;
  try{
    const key='__dc_storage_probe__';
    localStorage.setItem(key,'1');
    localStorage.removeItem(key);
  }catch(e){available=false;}
  document.documentElement.dataset.dcStorage=available?'available':'unavailable';

  // G8 compatibility cleanup: historical `self-development` results are migrated
  // once to canonical `self_development`. Keep read compatibility at domain
  // boundaries, but do not maintain a permanent dual local state.
  const migrateLegacySphereAlias=()=>{
    if(!available)return;
    try{
      const storageKey='dementorClubOnboardingV3';
      const db=JSON.parse(localStorage.getItem(storageKey)||'null');
      if(!db?.results)return;
      const legacy=db.results['self-development'];
      if(!legacy)return;
      const canonical=db.results.self_development;
      const stamp=x=>Date.parse(x?.date||0)||0;
      const latest=!canonical||stamp(legacy)>stamp(canonical)?legacy:canonical;
      db.results.self_development=latest;
      delete db.results['self-development'];
      localStorage.setItem(storageKey,JSON.stringify(db));
    }catch(e){console.warn('[DC9 legacy sphere migration]',e)}
  };
  migrateLegacySphereAlias();

  if(available)return;

  const style=document.createElement('style');
  style.textContent=`
    html[data-dc-storage="unavailable"] .dc9-sphere,
    html[data-dc-storage="unavailable"] .dc9-answer,
    html[data-dc-storage="unavailable"] .dc9-button,
    html[data-dc-storage="unavailable"] .dc9-text-button{pointer-events:none;opacity:.38}
    .dc-storage-warning{margin:18px 0 28px;padding:16px 18px;border:1px solid currentColor;display:grid;gap:7px;font-size:13px;line-height:1.45}
    .dc-storage-warning strong{font-size:11px;letter-spacing:.09em}
  `;
  document.head.appendChild(style);

  const show=()=>{
    if(document.querySelector('.dc-storage-warning'))return;
    const host=document.querySelector('.dc9-shell');
    if(!host)return;
    const note=document.createElement('div');
    note.className='dc-storage-warning';
    note.setAttribute('role','alert');
    note.innerHTML='<strong>ЛОКАЛЬНОЕ ХРАНЕНИЕ НЕДОСТУПНО</strong><span>DC-9 хранит прогресс в localStorage браузера и при входе синхронизирует его с аккаунтом Dementor Club. Сейчас браузер запрещает локальную запись, поэтому прохождение отключено. Разрешите хранение данных сайта или откройте страницу в обычном режиме браузера.</span>';
    host.prepend(note);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',show,{once:true}):show();
})();
