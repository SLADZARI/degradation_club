import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
if(cfg?.enabled&&cfg.url&&cfg.publishableKey&&location.pathname.includes('/join')&&!location.pathname.includes('/join/apply')){
  const css=document.createElement('link');css.rel='stylesheet';css.href='/join-progress-map-v2.css';document.head.appendChild(css);
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session}}=await client.auth.getSession();const user=session?.user||null;
  const ORDER=['personality','work','consumption','relationships','control','information','self_development','meaning','technology'];
  const TITLES={personality:'Личность',work:'Работа',consumption:'Потребление',relationships:'Отношения',control:'Контроль',information:'Информация',self_development:'Саморазвитие',meaning:'Смысл',technology:'Технологии'};
  const LEVELS=['Не затронут','Первичные признаки','Осознанная деградация','Устойчивая форма','Тяжёлое дементорство','Дементор'];
  const RELATED={
    personality:{slug:'slaboumie-i-otvaga',title:'Слабоумие и отвага',person:'Евгений'},
    work:{slug:'ne-komanda',title:'НЕ КОМАНДА',person:'Габиль'},
    consumption:{slug:'dengi-na-veter',title:'Деньги на ветер',person:'Никита'},
    relationships:{slug:'ne-komanda',title:'НЕ КОМАНДА',person:'Габиль'},
    control:{slug:'dumai-s-opasnostyu',title:'Думай с опасностью',person:'Валентин'},
    information:{slug:'dumai-s-opasnostyu',title:'Думай с опасностью',person:'Валентин'}
  };
  const titleToId=Object.fromEntries(Object.entries(TITLES).map(([k,v])=>[v.toLowerCase(),k]));
  const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
  const programUrl=slug=>`${base}/courses/${slug}/`;
  const callbackUrl=()=>location.origin+base+'/auth/callback/?next='+encodeURIComponent(base+'/join/');
  const date=v=>{try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(v))}catch{return'—'}};
  const levelOf=r=>{const raw=r?.result_json?.level??r?.result_json?.levelNumber??r?.result_json?.level_number;const n=Number(raw);return Number.isFinite(n)?Math.max(0,Math.min(5,n)):null};
  const when=r=>Date.parse(r?.completed_at||r?.created_at||r?.result_json?.date||0)||0;
  const readLocal=()=>{try{return JSON.parse(localStorage.getItem('dementorClubOnboardingV3')||'null')||{results:{}}}catch{return{results:{}}}};
  let serverLatest=new Map(),latest=new Map(),certs=new Set(),refreshing=false,lastRenderKey='';

  function mergeLatest(){
    const out=new Map();const local=readLocal()?.results||{};
    ORDER.forEach(id=>{const lr=local[id]?{sphere_id:id,result_json:local[id],completed_at:local[id].date,local_only:!user}:null;const sr=serverLatest.get(id)||null;if(lr&&sr)out.set(id,when(lr)>=when(sr)?lr:sr);else if(lr||sr)out.set(id,lr||sr)});latest=out;
  }
  async function fetchServer(){if(!user||refreshing)return;refreshing=true;try{
    const [{data:runs,error:rerr},{data:certRows,error:cerr}]=await Promise.all([
      client.from('assessment_runs').select('sphere_id,result_json,completed_at,created_at').eq('profile_id',user.id).order('completed_at',{ascending:false}).limit(100),
      client.from('dc_program_certificates').select('program_slug').eq('profile_id',user.id)
    ]);if(rerr)throw rerr;if(cerr)throw cerr;
    const next=new Map();for(const r of runs||[])if(r.sphere_id&&!next.has(r.sphere_id))next.set(r.sphere_id,r);serverLatest=next;certs=new Set((certRows||[]).map(x=>x.program_slug));
  }catch(e){console.warn('[DC9 map v2]',e)}finally{refreshing=false;mergeLatest();decorate()}}
  function ensureSummary(grid){let box=document.querySelector('.dc9-map-summary');if(box)return box;box=document.createElement('section');box.className='dc9-map-summary';grid.before(box);return box}
  function resultMetrics(r){const j=r?.result_json||{};const tags=Array.isArray(j.tagLevels)?j.tagLevels:[];return [['Осознанность отказа',j.intent],['Ответственность за последствия',j.responsibility],...tags.map((v,i)=>[`Признак ${String(i+1).padStart(2,'0')}`,v])].filter(x=>x[1]!=null)}
  function closeModal(){document.querySelector('.dc9-result-modal')?.remove()}
  function openResult(id,card){
    const r=latest.get(id);if(!r)return;const level=levelOf(r),related=RELATED[id],j=r.result_json||{};closeModal();
    const modal=document.createElement('div');modal.className='dc9-result-modal';modal.innerHTML=`<section class="dc9-result-panel" role="dialog" aria-modal="true" aria-label="Результат ${TITLES[id]}"><button class="dc9-result-close" type="button" aria-label="Закрыть">×</button><div class="dc9-result-kicker">DC-9 / СОХРАНЁННЫЙ РЕЗУЛЬТАТ</div><h2>${TITLES[id]}</h2><div class="dc9-result-score">${level}<small>/ 5</small></div><div class="dc9-result-level">${LEVELS[level]||'УРОВЕНЬ ЗАФИКСИРОВАН'}</div><div class="dc9-result-kicker">ПОСЛЕДНЕЕ ПРОХОЖДЕНИЕ · ${date(r.completed_at||r.created_at||j.date)}</div><div class="dc9-result-metrics">${resultMetrics(r).map(([name,value])=>`<div class="dc9-result-metric"><span>${name}</span><strong>${value}</strong></div>`).join('')}</div>${related?`<div class="dc9-result-related"><span>СЛЕДУЮЩАЯ ПРАКТИКА / НЕ МЕНЯЕТ DC-9 АВТОМАТИЧЕСКИ</span><strong>${related.title}</strong><div>${related.person}${certs.has(related.slug)?' · ПРОГРАММА ПРОЙДЕНА ✓':''}</div><p><a href="${programUrl(related.slug)}">ОТКРЫТЬ ПРОГРАММУ →</a></p></div>`:''}<div class="dc9-result-actions"><button type="button" data-repeat>ПРОЙТИ ЕЩЁ РАЗ</button>${!user?'<button type="button" data-save>СОХРАНИТЬ В ПРОФИЛЬ</button>':''}</div></section>`;
    document.body.appendChild(modal);modal.querySelector('.dc9-result-close').onclick=closeModal;modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});modal.querySelector('[data-repeat]')?.addEventListener('click',()=>{closeModal();card.click()});modal.querySelector('[data-save]')?.addEventListener('click',loginAndSave);document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){closeModal();document.removeEventListener('keydown',esc)}})
  }
  async function loginAndSave(){const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callbackUrl()}});if(error)console.error('[DC9 save result]',error)}
  function ensureResultSavePrompt(){const resultEl=document.getElementById('result');if(!resultEl)return;let box=resultEl.querySelector('.dc9-save-result');if(user){box?.remove();return}if(!resultEl.classList.contains('active')){box?.remove();return}if(box)return;box=document.createElement('div');box.className='dc9-save-result';box.innerHTML='<div><strong>РЕЗУЛЬТАТ ГОТОВ.</strong><p>Он сохранён на этом устройстве. Войдите, чтобы привязать результат к профилю и восстановить его на другом устройстве.</p></div><button type="button">СОХРАНИТЬ В ПРОФИЛЬ</button>';box.querySelector('button').onclick=loginAndSave;(resultEl.querySelector('.actions')||resultEl).after(box)}
  function decorate(){
    mergeLatest();const grid=document.getElementById('sphereGrid');if(!grid)return;const cards=[...grid.querySelectorAll('.sphere')];if(!cards.length)return;const done=[...latest.entries()].map(([id,r])=>({id,r,level:levelOf(r)})).filter(x=>x.level!=null);const avg=done.length?done.reduce((s,x)=>s+x.level,0)/done.length:null;const nextId=ORDER.find(id=>!latest.has(id))||ORDER.slice().sort((a,b)=>(levelOf(latest.get(a))??9)-(levelOf(latest.get(b))??9))[0];const resultActive=document.getElementById('result')?.classList.contains('active')||false;const key=JSON.stringify([done.map(x=>[x.id,x.level,when(x.r)]),[...certs],cards.length,resultActive]);if(key===lastRenderKey){ensureResultSavePrompt();return}lastRenderKey=key;
    const summary=ensureSummary(grid);summary.innerHTML=`<div class="dc9-map-summary__title"><span>ACCOUNT / DC-9</span><strong>МОЯ КАРТА ДЕГРАДАЦИИ</strong></div><div><span>ПРОЙДЕНО</span><strong>${done.length} / 9</strong></div><div><span>СРЕДНИЙ УРОВЕНЬ</span><strong>${avg==null?'—':avg.toFixed(1)+' / 5'}</strong></div><div class="dc9-map-summary__next"><span>СЛЕДУЮЩАЯ СФЕРА</span><strong>${TITLES[nextId]||'—'} →</strong></div>`;
    cards.forEach(card=>{const title=(card.querySelector('strong')?.textContent||'').trim().toLowerCase();const id=titleToId[title];if(!id)return;card.querySelectorAll('[data-dc9-progress]').forEach(x=>x.remove());const r=latest.get(id),level=levelOf(r);card.classList.toggle('dc9-has-result',level!=null);card.classList.toggle('dc9-unpassed',level==null);const foot=card.querySelector('.sphere-foot')||card;const wrap=document.createElement('div');wrap.dataset.dc9Progress='1';
      if(level!=null){wrap.innerHTML=`<div class="dc9-scoreline"><div class="dc9-score">${level}<small>/ 5</small></div><div class="dc9-level">${LEVELS[level]||'УРОВЕНЬ ЗАФИКСИРОВАН'}</div></div><div class="dc9-date">${r.local_only?'ЛОКАЛЬНО · ':''}${date(r.completed_at||r.created_at||r.result_json?.date)}</div><div class="dc9-result-link" role="button" tabindex="0">РЕЗУЛЬТАТ →</div>`;const action=wrap.querySelector('.dc9-result-link');const open=e=>{e.preventDefault();e.stopPropagation();openResult(id,card)};action.addEventListener('click',open);action.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(e)}})
      }else wrap.innerHTML='<div class="dc9-unstarted">ДЕГРАДАЦИЯ НЕ НАЧАТА<small>Эта сфера всё ещё подозрительно цела.</small></div><div class="dc9-start-link">НАЧАТЬ →</div>';foot.appendChild(wrap)
    });ensureResultSavePrompt()
  }
  await fetchServer();mergeLatest();decorate();
  setInterval(()=>{const before=JSON.stringify([...latest.entries()].map(([id,r])=>[id,when(r),levelOf(r)]));mergeLatest();const after=JSON.stringify([...latest.entries()].map(([id,r])=>[id,when(r),levelOf(r)]));if(before!==after){lastRenderKey='';decorate()}ensureResultSavePrompt()},900);
  if(user)setInterval(fetchServer,9000);window.addEventListener('focus',()=>{user?fetchServer():decorate()});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){user?fetchServer():decorate()}});
  const resultEl=document.getElementById('result');if(resultEl)new MutationObserver(()=>{lastRenderKey='';decorate()}).observe(resultEl,{attributes:true,attributeFilter:['class']});
}
