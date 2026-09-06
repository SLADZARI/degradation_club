const boardHost=document.getElementById('boardHost');
const filterHost=document.getElementById('boardFilters');
let active='all';

const tabs=[['all','ВСЁ'],['member','ОТ ЛЮДЕЙ'],['club','ОТ КЛУБА']];

function classify(){
  boardHost?.querySelectorAll('[data-board-source="platform"],.dc-projection').forEach(node=>node.remove());
  boardHost?.querySelectorAll('.dc-notice[data-artifact]').forEach(card=>{
    if(!card.dataset.boardSource)card.dataset.boardSource='member';
  });
}

function apply(){
  classify();
  boardHost?.querySelectorAll('.dc-notice[data-artifact]').forEach(card=>{
    const source=card.dataset.boardSource||'member';
    const hidden=active!=='all'&&source!==active;
    card.hidden=hidden;
    card.classList.toggle('dc-board-filtered',hidden);
    card.setAttribute('aria-hidden',hidden?'true':'false');
  });
  filterHost?.querySelectorAll('[data-board-filter]').forEach(button=>button.classList.toggle('active',button.dataset.boardFilter===active));
  window.dispatchEvent(new CustomEvent('dc:board-filter-changed',{detail:{filter:active}}));
  window.dispatchEvent(new CustomEvent('dc:board-layout-request'));
}

function install(){
  if(!filterHost)return;
  filterHost.innerHTML=tabs.map(([id,label])=>`<button class="dc-board-filter${id==='all'?' active':''}" type="button" data-board-filter="${id}">${label}</button>`).join('')+'<button class="dc-board-filter" type="button" data-board-filter-drawer>ФИЛЬТР</button>';
  filterHost.addEventListener('click',event=>{
    const button=event.target.closest('[data-board-filter]');
    if(button){active=button.dataset.boardFilter||'all';apply();return}
    if(event.target.closest('[data-board-filter-drawer]'))active='all',apply();
  });
  apply();
}

install();
if(boardHost){let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,60)}).observe(boardHost,{childList:true})}
