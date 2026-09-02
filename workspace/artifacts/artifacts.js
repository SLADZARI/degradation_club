import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';
const host=document.getElementById('artifactHost');
const filters=[...document.querySelectorAll('[data-filter]')];
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>{try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v))}catch{return String(v||'—')}};
let rows=[];
let filter='all';
function render(){
  const visible=filter==='all'?rows:rows.filter(x=>x.status===filter);
  filters.forEach(b=>b.classList.toggle('is-active',b.dataset.filter===filter));
  if(!visible.length){host.innerHTML='<div class="dca-empty">ЗДЕСЬ ПОКА НИЧЕГО НЕТ.</div>';return}
  host.innerHTML=visible.map(x=>`<article class="dca-item"><time>${esc(fmt(x.published_at||x.created_at))}</time><div><h2>${esc(x.title||'Без названия')}</h2><p>${esc(x.body||'')}</p><div class="dca-meta"><span class="dca-badge is-${esc(x.status)}">${esc(x.status)}</span><span class="dca-badge">${esc(x.artifact_type||'artifact')}</span>${x.closed_at?`<span class="dca-badge">закрыт ${esc(fmt(x.closed_at))}</span>`:''}</div></div><div>${x.external_url?`<a class="dca-open" href="${esc(x.external_url)}" target="_blank" rel="noopener noreferrer">ОТКРЫТЬ ↗</a>`:x.status==='active'?'<a class="dca-open" href="../../community/board/">НА ДОСКУ →</a>':''}</div></article>`).join('');
}
if(!host||!cfg?.enabled){if(host)host.innerHTML='<div class="dca-empty">СЕРВИС НЕДОСТУПЕН.</div>'}else{
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session}}=await client.auth.getSession();
  if(!session?.user){location.replace('../');}
  else{
    const {data,error}=await client.from('dc_artifacts').select('id,artifact_type,title,body,external_url,status,visibility,created_at,published_at,closed_at').eq('author_profile_id',session.user.id).order('created_at',{ascending:false});
    if(error)host.innerHTML='<div class="dca-empty">НЕ УДАЛОСЬ ЗАГРУЗИТЬ ИСТОРИЮ.</div>';
    else{rows=data||[];render()}
  }
}
filters.forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;render()}));
