// Dementor Club — truthful Join data persistence copy.
(()=>{
  if(!location.pathname.includes('/join'))return;
  const apply=()=>{
    const blocks=[...document.querySelectorAll('.privacy')];
    if(blocks[0])blocks[0].textContent='Результаты сохраняются на этом устройстве. После входа через Google карта синхронизируется с вашим профилем и может быть восстановлена на другом устройстве. Это клубная диагностическая механика, а не психологический, медицинский или профессиональный тест.';
    if(blocks[1])blocks[1].innerHTML='Локальная копия карты хранится в браузере под ключом <code>dementorClubOnboardingV3</code>. После входа через Google результаты синхронизируются с профилем через Supabase и восстанавливаются между устройствами. Очистка данных сайта удаляет локальную копию, но не серверную копию профиля.';
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
