(()=>{
  const controls=[...document.querySelectorAll('[data-catalog-filter]')];
  const rows=[...document.querySelectorAll('.dc-global-row[data-entity-type]')];
  const empty=document.getElementById('catalog-empty');
  if(!controls.length||!rows.length)return;

  const apply=type=>{
    let visible=0;
    rows.forEach(row=>{
      const show=type==='all'||row.dataset.entityType===type;
      row.hidden=!show;
      if(show)visible++;
    });
    controls.forEach(button=>{
      const active=button.dataset.catalogFilter===type;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    if(empty)empty.hidden=visible!==0;
    const url=new URL(location.href);
    if(type==='all')url.searchParams.delete('type');else url.searchParams.set('type',type);
    history.replaceState(null,'',url);
  };

  controls.forEach(button=>button.addEventListener('click',()=>apply(button.dataset.catalogFilter)));
  const requested=new URLSearchParams(location.search).get('type');
  const allowed=new Set(['all','event','project','merch','archive']);
  apply(allowed.has(requested)?requested:'all');
})();
