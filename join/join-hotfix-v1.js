(()=>{
  if(!/\/join\/?(?:index\.html)?$/.test(location.pathname))return;
  const STORAGE='dementorClubOnboardingV3';
  let armed=false;
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')}catch{return null}};
  document.addEventListener('click',event=>{
    const btn=event.target.closest?.('.answer');
    if(!btn||armed)return;
    const counter=document.getElementById('counter')?.textContent||'';
    const m=counter.match(/(\d+)\s*\/\s*(\d+)/);
    if(!m||m[1]!==m[2])return;
    armed=true;
    btn.classList.add('is-selected');
    const box=btn.closest('.answers');
    box?.querySelectorAll('.answer').forEach(b=>{b.disabled=true});
    setTimeout(()=>{
      const result=document.getElementById('result');
      const quiz=document.getElementById('quiz');
      if(result?.classList.contains('active')||!quiz?.classList.contains('active'))return;
      const state=read();
      const active=state?.active;
      if(active&&Number(active.index)>=Number(m[2])){
        location.reload();
        return;
      }
      armed=false;
      box?.querySelectorAll('.answer').forEach(b=>{b.disabled=false});
      btn.classList.remove('is-selected');
      console.warn('[DC join hotfix] final answer was not persisted; controls restored');
    },700);
  },true);
})();
