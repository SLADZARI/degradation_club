import {getClient,esc,route} from '/community-runtime-v1.js';

const HOME_LIMIT=10;
const COMMUNITY_LIMIT=24;
const communityState={client:null,rows:[],loading:false,done:false};

const waitForDom=async()=>{
  if(document.readyState!=='loading')return;
  await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));
};
const waitForConfig=async()=>{
  if(window.DEMENTOR_SITE_CONFIG?.supabase)return;
  await new Promise(resolve=>{
    let tries=0;
    const timer=setInterval(()=>{tries+=1;if(window.DEMENTOR_SITE_CONFIG?.supabase||tries>80){clearInterval(timer);resolve()}},50);
  });
};

const compact=value=>String(value||'').replace(/\s+/g,' ').trim();
const activityTitle=row=>compact(row.title)||compact(row.excerpt)||'ПУБЛИКАЦИЯ КЛУБА';
const activityExcerpt=row=>{const value=compact(row.excerpt);if(!value)return'';const title=compact(row.title);return title&&value.toLowerCase()===title.toLowerCase()?'':value};
const formatDate=value=>{if(!value)return'';try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value)).replace('.','').toUpperCase()}catch{return''}};
const railDuration=rows=>{
  const chars=rows.reduce((sum,row)=>sum+activityTitle(row).length+activityExcerpt(row).length,0);
  return Math.max(36,Math.min(120,Math.round(rows.length*5+chars/70)));
};

function card(row,index,{clone=false}={}){
  const title=activityTitle(row);const excerpt=activityExcerpt(row);const mediaKind=String(row.media_kind||'text');
  const preview=row.preview_url?`<div class="dc-activity-card__media"><img src="${esc(row.preview_url)}" alt="" loading="lazy" decoding="async">${mediaKind==='video'?'<span class="dc-activity-card__play" aria-hidden="true">▶</span>':''}</div>`:`<div class="dc-activity-card__media dc-activity-card__media--text"><span>${esc(String(index+1).padStart(2,'0'))}</span></div>`;
  const cloneAttrs=clone?' aria-hidden="true" inert':'';
  const linkTab=clone?' tabindex="-1"':'';
  return `<article class="dc-activity-card" data-activity-id="${esc(row.artifact_id||'')}"${cloneAttrs}>${preview}<div class="dc-activity-card__copy"><div class="dc-activity-card__meta"><span>${esc(row.type_source_label||'BOARD')}</span><span>${esc(formatDate(row.published_at))}</span></div><h3>${esc(title)}</h3>${excerpt?`<p>${esc(excerpt)}</p>`:''}<div class="dc-activity-card__foot"><span>${esc(row.publisher_display_name||'DEMENTOR CLUB')}</span><a href="${esc(route(row.board_focus_url||'/workspace/board/'))}"${linkTab}>ОТКРЫТЬ НА BOARD →</a></div></div></article>`;
}

function homeSection(rows){
  const cards=rows.map((row,index)=>card(row,index)).join('');
  const clones=rows.map((row,index)=>card(row,index,{clone:true})).join('');
  const section=document.createElement('section');section.className='dc-public-activity dc-public-activity--home';section.setAttribute('aria-labelledby','dc-public-activity-title');
  section.style.setProperty('--dc-activity-duration',`${railDuration(rows)}s`);
  section.innerHTML=`<div class="dc-public-activity__head dc-shell"><div><p class="dc-kicker">BOARD / PUBLIC ACTIVITY</p><h2 id="dc-public-activity-title">СЕЙЧАС В КЛУБЕ</h2></div><a href="/workspace/board/">ОТКРЫТЬ BOARD →</a></div><div class="dc-public-activity__viewport" tabindex="0"><div class="dc-public-activity__track">${cards}${clones}</div></div>`;
  return section;
}

function communitySection(rows){
  const section=document.createElement('section');section.className='dc-public-activity dc-public-activity--community';section.id='activity';section.setAttribute('aria-labelledby','dc-community-activity-title');
  section.innerHTML=`<div class="dc-public-activity__head shell"><div><p class="kicker">BOARD / PUBLIC ACTIVITY</p><h2 id="dc-community-activity-title">СЕЙЧАС В КЛУБЕ</h2><p class="body">Редакционно отобранные материалы клубной жизни. Публикация на Board сама по себе не делает материал публичным.</p></div><a href="/workspace/board/">ОТКРЫТЬ BOARD →</a></div><div class="dc-public-activity__grid shell" data-community-activity-grid>${rows.map((row,index)=>card(row,index)).join('')}</div><div class="dc-public-activity__more shell"><button type="button" data-community-activity-more>ПОКАЗАТЬ ЕЩЁ →</button><small data-community-activity-status aria-live="polite"></small></div>`;
  return section;
}

function renderHome(rows){
  if(!rows.length)return;
  const anchor=document.querySelector('.dc-home-community');if(!anchor)return;
  anchor.before(homeSection(rows));
}
function syncCommunityMore(){
  const button=document.querySelector('[data-community-activity-more]');const status=document.querySelector('[data-community-activity-status]');if(!button)return;
  button.disabled=communityState.loading||communityState.done;
  button.textContent=communityState.loading?'ЗАГРУЖАЕМ…':communityState.done?'ВСЁ ПОКАЗАНО':'ПОКАЗАТЬ ЕЩЁ →';
  if(status&&!communityState.loading)status.textContent=communityState.done?'БОЛЬШЕ ПУБЛИКАЦИЙ НЕТ':'';
}
async function loadMoreCommunity(){
  if(communityState.loading||communityState.done||!communityState.client)return;
  const last=communityState.rows.at(-1);if(!last){communityState.done=true;syncCommunityMore();return}
  communityState.loading=true;syncCommunityMore();
  const {data,error}=await communityState.client.rpc('dc_public_activity_read_v1',{p_limit:COMMUNITY_LIMIT,p_before_published_at:last.published_at,p_before_id:last.artifact_id});
  communityState.loading=false;
  if(error){const status=document.querySelector('[data-community-activity-status]');if(status)status.textContent=`НЕ УДАЛОСЬ ЗАГРУЗИТЬ: ${error?.message||error}`;syncCommunityMore();return}
  const seen=new Set(communityState.rows.map(row=>row.artifact_id));const next=(data||[]).filter(row=>!seen.has(row.artifact_id));
  const grid=document.querySelector('[data-community-activity-grid]');const start=communityState.rows.length;
  if(grid&&next.length)grid.insertAdjacentHTML('beforeend',next.map((row,index)=>card(row,start+index)).join(''));
  communityState.rows.push(...next);communityState.done=(data||[]).length<COMMUNITY_LIMIT||next.length===0;syncCommunityMore();
}
function renderCommunity(rows,client){
  const old=document.querySelector('section.live');
  if(!old)return;
  if(!rows.length){old.innerHTML='<div class="shell"><p class="kicker">BOARD / PUBLIC ACTIVITY</p><h2 class="display-l">СЕЙЧАС В КЛУБЕ.</h2><p class="body">Публичная редакционная подборка сейчас пуста. Публикации Community Board продолжают жить внутри Board и не становятся публичными автоматически.</p></div>';return}
  old.replaceWith(communitySection(rows));communityState.client=client;communityState.rows=[...rows];communityState.done=rows.length<COMMUNITY_LIMIT;communityState.loading=false;
  document.querySelector('[data-community-activity-more]')?.addEventListener('click',loadMoreCommunity);syncCommunityMore();
}
function renderCommunityError(error){
  const old=document.querySelector('section.live');if(!old)return;
  old.innerHTML=`<div class="shell"><p class="kicker">BOARD / PUBLIC ACTIVITY</p><h2 class="display-l">СЕЙЧАС В КЛУБЕ.</h2><p class="body">Лента временно недоступна. Board продолжает работать отдельно.</p><small class="dc-public-activity__error">${esc(error?.message||error||'PUBLIC_ACTIVITY_UNAVAILABLE')}</small></div>`;
}

async function boot(){
  await waitForDom();
  const path=location.pathname.replace(/^\/degradation_club(?=\/|$)/,'')||'/';
  const home=path==='/'||path==='/index.html';const community=/^\/community\/?(?:index\.html)?$/.test(path);
  if(!home&&!community)return;
  await waitForConfig();
  const client=getClient();
  const {data,error}=await client.rpc('dc_public_activity_read_v1',{p_limit:home?HOME_LIMIT:COMMUNITY_LIMIT,p_before_published_at:null,p_before_id:null});
  if(error){if(community)renderCommunityError(error);return}
  const rows=data||[];if(home)renderHome(rows);else renderCommunity(rows,client);
}

boot().catch(error=>{const path=location.pathname.replace(/^\/degradation_club(?=\/|$)/,'')||'/';if(/^\/community\/?(?:index\.html)?$/.test(path))renderCommunityError(error)});
