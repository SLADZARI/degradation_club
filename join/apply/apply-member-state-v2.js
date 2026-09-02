const host=document.getElementById('applyHost');
const hero=document.querySelector('.dc-apply-hero');
if(host&&hero){
  const sync=()=>{
    const active=host.querySelector('.dc-apply-done .dc-apply-kicker')?.textContent?.includes('MEMBERSHIP / ACTIVE');
    if(!active)return;
    const title=hero.querySelector('h1');
    const copy=hero.querySelector('p');
    if(title)title.innerHTML='ЧЛЕНСТВО<br>АКТИВНО.';
    if(copy)copy.textContent='Вы уже внутри. Здесь больше нечего доказывать — переходите в личный кабинет и клубные поверхности.';
  };
  new MutationObserver(sync).observe(host,{childList:true,subtree:true});
  sync();
}
