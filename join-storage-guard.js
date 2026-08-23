(()=>{
  if(!location.pathname.startsWith('/join'))return;
  let available=true;
  try{
    const key='__dc_storage_probe__';
    localStorage.setItem(key,'1');
    localStorage.removeItem(key);
  }catch(e){available=false;}
  document.documentElement.dataset.dcStorage=available?'available':'unavailable';
  if(available)return;
  const show=()=>{
    if(document.querySelector('.dc-storage-warning'))return;
    const host=document.querySelector('.join-shell');
    if(!host)return;
    const note=document.createElement('div');
    note.className='dc-storage-warning';
    note.setAttribute('role','status');
    note.innerHTML='<strong>ЛОКАЛЬНОЕ ХРАНЕНИЕ НЕДОСТУПНО</strong><span>Браузер не разрешает сохранить профиль onboarding. Ответы можно проходить, но накопленный результат может исчезнуть после закрытия страницы.</span>';
    host.prepend(note);
  };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',show,{once:true}):show();
})();
