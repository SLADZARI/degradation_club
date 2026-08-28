import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
if(cfg?.enabled&&cfg.url&&cfg.publishableKey&&location.pathname.includes('/join')){
  const css=document.createElement('link');css.rel='stylesheet';css.href='/join-progress-map-v1.css';document.head.appendChild(css);
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session}}=await client.auth.getSession();const user=session?.user;
  if(user){
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
    const date=v=>{try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'2-digit'}).format(new Date(v))}catch{return''}};
    let latest=new Map(),certs=new Set(),refreshing=false,lastKey='';
    const levelOf=r=>{const raw=r?.result_json?.level??r?.result_json?.levelNumber??r?.result_json?.level_number;const n=Number(raw);return Number.isFinite(n)?Math.max(0,Math.min(5,n)):null};
    async function fetchState(){if(refreshing)return;refreshing=true;try{
      const [{data:runs,error:rerr},{data:certRows,error:cerr}]=await Promise.all([
        client.from('assessment_runs').select('sphere_id,result_json,completed_at,created_at').eq('profile_id',user.id).order('completed_at',{ascending:false}).limit(100),
        client.from('dc_program_certificates').select('program_slug').eq('profile_id',user.id)
      ]);if(rerr)throw rerr;if(cerr)throw cerr;
      const next=new Map();for(const r of runs||[]){if(r.sphere_id&&!next.has(r.sphere_id))next.set(r.sphere_id,r)}latest=next;certs=new Set((certRows||[]).map(x=>x.program_slug));decorate();
    }catch(e){console.warn('[DC9 progress map]',e)}finally{refreshing=false}}
    function ensureSummary(grid){let box=document.querySelector('.dc9-map-summary');if(box)return box;box=document.createElement('section');box.className='dc9-map-summary';grid.before(box);return box}
    function decorate(){const grid=document.getElementById('sphereGrid');if(!grid)return;const cards=[...grid.querySelectorAll('.sphere')];if(!cards.length)return;
      const done=[...latest.entries()].map(([id,r])=>({id,r,level:levelOf(r)})).filter(x=>x.level!=null);const avg=done.length?done.reduce((s,x)=>s+x.level,0)/done.length:null;const nextId=ORDER.find(id=>!latest.has(id))||ORDER.slice().sort((a,b)=>(levelOf(latest.get(a))??9)-(levelOf(latest.get(b))??9))[0];const key=JSON.stringify([done.map(x=>[x.id,x.level]),[...certs]]);if(key===lastKey&&document.querySelector('.dc9-map-summary'))return;lastKey=key;
      const summary=ensureSummary(grid);summary.innerHTML=`<div class="dc9-map-summary__title"><span>ACCOUNT / DC-9</span><strong>МОЯ КАРТА ДЕГРАДАЦИИ</strong></div><div><span>ПРОЙДЕНО</span><strong>${done.length} / 9</strong></div><div><span>СРЕДНИЙ УРОВЕНЬ</span><strong>${avg==null?'—':avg.toFixed(1)+' / 5'}</strong></div><div class="dc9-map-summary__next"><span>СЛЕДУЮЩАЯ СФЕРА</span><strong>${TITLES[nextId]||'—'} →</strong></div>`;
      cards.forEach(card=>{const title=(card.querySelector('strong')?.textContent||'').trim().toLowerCase();const id=titleToId[title];if(!id)return;card.querySelectorAll('[data-dc9-progress]').forEach(x=>x.remove());const r=latest.get(id),level=levelOf(r),related=RELATED[id];card.classList.toggle('dc9-has-result',level!=null);const foot=card.querySelector('.sphere-foot')||card;const wrap=document.createElement('div');wrap.dataset.dc9Progress='1';
        if(level!=null){wrap.innerHTML=`<div class="dc9-level">${LEVELS[level]||'УРОВЕНЬ ЗАФИКСИРОВАН'}</div><div class="dc9-score">${level}<small>/ 5</small></div><div class="dc9-date">ПОСЛЕДНЕЕ ПРОХОЖДЕНИЕ · ${date(r.completed_at||r.created_at)}</div><div class="dc9-progress-action">УЛУЧШИТЬ ДЕГРАДАЦИЮ →</div>`;
          if(related){const badge=document.createElement('div');badge.className='dc9-related'+(certs.has(related.slug)?' is-complete':'');badge.innerHTML=`<div><b>${certs.has(related.slug)?'ПРОГРАММА ПРОЙДЕНА ✓':related.title}</b><span>${related.person} · ${certs.has(related.slug)?'completion подтверждён':'связанная программа'}</span></div>`;badge.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();location.assign(programUrl(related.slug))});wrap.appendChild(badge)}
        }else wrap.innerHTML='<div class="dc9-unstarted">ДЕГРАДАЦИЯ НЕ НАЧАТА</div>';
        foot.appendChild(wrap)
      });
    }
    await fetchState();setInterval(fetchState,8000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')fetchState()});window.addEventListener('focus',fetchState);
    new MutationObserver(()=>requestAnimationFrame(decorate)).observe(document.getElementById('sphereGrid')||document.body,{childList:true,subtree:true});
  }
}
