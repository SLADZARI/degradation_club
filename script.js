// Dementor Club — Join presentation/runtime layer.
// Scoring and scenario logic lives in /join/index.html only.
// This file must not introduce a second onboarding engine.
(()=>{
  if(!location.pathname.startsWith('/join'))return;

  const loadScript=(src,done)=>{
    const existing=document.querySelector(`script[src="${src}"]`);
    if(existing){if(done){if(src==='/site-config.js'&&window.DEMENTOR_SITE_CONFIG)done();else existing.addEventListener('load',done,{once:true});}return;}
    const s=document.createElement('script');s.src=src;s.onload=()=>done?.();document.head.appendChild(s);
  };
  const bootSeo=()=>{if(!document.querySelector('script[src="/seo-runtime.js"]'))loadScript('/seo-runtime.js');};
  window.DEMENTOR_SITE_CONFIG?bootSeo():loadScript('/site-config.js',bootSeo);

  /* Storage capability must resolve before the user can start the procedure. */
  document.documentElement.dataset.dcStorage='checking';
  const preflightStyle=document.createElement('style');
  preflightStyle.textContent='html[data-dc-storage="checking"] #sphereGrid{pointer-events:none;opacity:.62}';
  document.head.appendChild(preflightStyle);
  const guard=document.createElement('script');
  guard.src='/join-storage-guard.js';guard.async=false;guard.onerror=()=>{document.documentElement.dataset.dcStorage='unavailable';};document.head.appendChild(guard);

  if(!document.querySelector('link[href="/utility-v1.css"]')){const utilityCss=document.createElement('link');utilityCss.rel='stylesheet';utilityCss.href='/utility-v1.css';document.head.appendChild(utilityCss);}
  const ensureUtility=()=>{if(document.querySelector('.dc-utility-strip'))return;const strip=document.createElement('div');strip.className='dc-utility-strip';strip.innerHTML='<span class="dc-utility-strip__label">UTILITY / PUBLIC</span><nav class="dc-utility-nav" aria-label="Служебная навигация"><a href="/donate/">Support</a><a href="/contacts/">Contacts</a><a href="/legal/privacy/">Privacy</a><a href="/legal/terms/">Terms</a></nav>';document.body.appendChild(strip);};ensureUtility();

  const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');
  if(nav&&!nav.querySelector('a[href="/archive/"]')){const archive=document.createElement('a');archive.href='/archive/';archive.textContent='Архив';const join=nav.querySelector('a[href="/join/"]');join?nav.insertBefore(archive,join):nav.appendChild(archive);}
  if(toggle&&nav){const closed=toggle.textContent.trim()||'MENU';toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'CLOSE':closed});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent=closed}));}

  document.title='Выберите область деградации — Dementor Club';
  const description=document.querySelector('meta[name="description"]');if(description)description.content='Девять процедур Dementor Club. Начните с того, что пока работает слишком хорошо.';
  const host=document.getElementById('questionHost');const grid=document.getElementById('sphereGrid');const selector=document.getElementById('selector');if(!host||!grid||!selector)return;

  const cardCopy={
    'Личность':'Перестаньте наконец искать себя.<br>Есть риск найти.',
    'Работа':'Работа — единственное место, где отсутствие результата можно компенсировать количеством встреч.',
    'Потребление':'Покупайте меньше.<br>Чтобы осталось больше денег на покупки.',
    'Отношения':'Снизим взаимопонимание<br>до комфортного уровня.',
    'Контроль':'Вернём событиям право происходить<br>без вашего согласования.',
    'Информация':'Не допускайте длительного контакта<br>с фактами.<span class="card-punch">Особенно если они начали складываться в вывод.</span>',
    'Саморазвитие':'Ваш потенциал слишком долго<br>оставался раскрытым.<br>Пора принять меры.',
    'Смысл':'Слишком хорошо понимаете,<br>зачем живёте?<br>Не запускайте состояние.',
    'Технологии':'Автоматизируем всё,<br>кроме необходимости разбираться зачем.'
  };

  const style=document.createElement('style');style.id='join-procedure-v8';style.textContent=`
    /* Join uses a dark page, but the global header is a light surface. Keep its text explicitly dark. */
    body .topbar{background:rgba(242,240,232,.96);color:#111;border-bottom-color:rgba(17,17,17,.18)}
    body .topbar .brand,body .topbar .nav a,body .topbar .menu-toggle{color:#111}
    body .topbar .nav a{opacity:.68}body .topbar .nav a:hover,body .topbar .nav a.active{opacity:1}

    #selector .intro{padding:72px 0 34px;display:grid;grid-template-columns:minmax(0,1.28fr) minmax(280px,.72fr);gap:48px;align-items:end}
    #selector .intro .join-hero-left{min-width:0;max-width:100%}
    #selector .intro h1{font-size:clamp(52px,6.25vw,92px);line-height:.88;letter-spacing:-.07em;margin:0;max-width:100%}
    #selector .intro h1 span{display:block}
    #selector .intro .join-hero-copy{font-size:clamp(18px,1.55vw,23px);line-height:1.32;max-width:430px;padding-bottom:8px;min-width:0}
    #selector .intro .join-hero-copy p{margin:0 0 22px;opacity:.72}
    #selector .intro .join-hero-copy strong{display:block;font-size:1.08em;line-height:1.23;opacity:1}
    #selector .sphere-head{display:none!important}
    #selector .grid-eyebrow{font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin:0 0 14px;opacity:.72}
    #selector .sphere-grid{margin-top:0}
    #selector .sphere{min-height:224px;padding:25px 25px 20px;position:relative;transition:background .13s ease,color .13s ease}
    #selector .sphere strong{font-size:30px}
    #selector .sphere p{font-size:15px;line-height:1.36;opacity:.78;max-width:310px;margin-top:7px}
    #selector .sphere .card-punch{display:block;margin-top:7px;font-size:12px;line-height:1.35;opacity:.65}
    #selector .sphere-foot{margin-top:auto;display:block}
    #selector .sphere-foot > .badge{display:none}
    #selector .procedure-ui{display:block}
    #selector .procedure-status,#selector .procedure-cta{display:inline-flex;min-height:30px;align-items:center;border:1px solid currentColor;padding:6px 9px;font-size:10px;letter-spacing:.07em;text-transform:uppercase}
    #selector .procedure-cta{display:none;font-weight:800;min-width:100%;justify-content:center;font-size:11px}
    #selector .sphere:hover .procedure-status,#selector .sphere:focus-visible .procedure-status{display:none}
    #selector .sphere:hover .procedure-cta,#selector .sphere:focus-visible .procedure-cta{display:flex}
    #selector .sphere:hover p,#selector .sphere:focus-visible p{opacity:.9}
    #selector .join-privacy{font-size:12px;line-height:1.42;opacity:.5;margin-top:12px;max-width:640px}
    #selector .join-privacy strong{font-weight:600;color:inherit}
    #selector>.privacy{display:none!important}

    /* The explanatory column must never compete with the display headline. */
    @media(max-width:1080px){
      #selector .intro{grid-template-columns:1fr;gap:30px;padding-top:52px;align-items:start}
      #selector .intro h1{font-size:clamp(54px,9.2vw,86px);max-width:900px}
      #selector .intro .join-hero-copy{font-size:19px;max-width:720px;padding-bottom:0}
    }
    @media(max-width:820px){#selector .intro{gap:28px;padding-top:42px}#selector .intro h1{font-size:clamp(50px,14vw,78px)}#selector .intro .join-hero-copy{font-size:18px}#selector .sphere{min-height:190px}}
    @media(max-width:430px){#selector .intro h1{font-size:clamp(40px,11.5vw,50px);line-height:.9;letter-spacing:-.055em}#selector .intro{gap:22px;padding-top:34px}#selector .sphere{min-height:160px;padding:20px}#selector .sphere strong{font-size:26px}}
  `;document.head.appendChild(style);

  function decorateStaticSelector(){if(selector.dataset.procedureStatic==='1')return;selector.dataset.procedureStatic='1';const intro=selector.querySelector('.intro');if(intro)intro.innerHTML='<div class="join-hero-left"><h1><span>ВЫБЕРИТЕ</span><span>ОБЛАСТЬ</span><span>ДЕГРАДАЦИИ</span></h1></div><div class="join-hero-copy"><p>Не начинайте с того, что вас беспокоит.</p><p>Начните с того, что пока работает слишком хорошо.</p><strong>Запускать состояние проще на ранней стадии.</strong></div>';if(!selector.querySelector('.grid-eyebrow')){const eyebrow=document.createElement('p');eyebrow.className='grid-eyebrow';eyebrow.textContent='DEMENTOR CLUB / ПЕРВИЧНОЕ РАСПРЕДЕЛЕНИЕ ПО НАПРАВЛЕНИЯМ';grid.before(eyebrow);}if(!selector.querySelector('.join-privacy')){const privacy=document.createElement('p');privacy.className='join-privacy';privacy.innerHTML='Результаты сохраняются локально.<br>Клуб не передаёт вашу растерянность третьим лицам.<br><strong>У нас своей достаточно.</strong>';grid.after(privacy);}}
  function decorateCards(){[...grid.querySelectorAll('.sphere')].forEach(card=>{const title=card.querySelector('strong')?.textContent?.trim();if(!title||!cardCopy[title])return;const body=card.querySelector('p');if(body&&body.dataset.procedureCopy!==title){body.innerHTML=cardCopy[title];body.dataset.procedureCopy=title}const done=!!card.querySelector('.badge.done')||card.classList.contains('dc9-has-result');const foot=card.querySelector('.sphere-foot');if(!foot)return;let ui=foot.querySelector(':scope > [data-procedure-ui]');if(!ui){ui=document.createElement('span');ui.className='procedure-ui';ui.dataset.procedureUi='1';foot.prepend(ui)}const stateKey=done?'done':'new';if(ui.dataset.state!==stateKey){ui.dataset.state=stateKey;ui.innerHTML=`<span class="procedure-status">${done?'УХУДШЕНИЕ ПОДТВЕРЖДЕНО':'ДЕГРАДАЦИЯ НЕ НАЧАТА'}</span><span class="procedure-cta">${done?'УХУДШИТЬ ЕЩЁ РАЗ →':'НАЧАТЬ ДЕГРАДАЦИЮ →'}</span>`}})}
  const permutations=[[2,0,3,1],[1,3,0,2],[3,1,2,0],[0,2,1,3],[2,3,1,0],[1,0,3,2],[3,0,1,2],[0,3,2,1]];
  function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function shuffleVisibleAnswers(){const answers=host.querySelector('.question .answers');if(!answers)return;const buttons=[...answers.querySelectorAll('.answer')];if(buttons.length!==4)return;const sphere=new URLSearchParams(location.search).get('sphere')||'club';const step=parseInt(document.getElementById('counter')?.textContent||'1',10)||1;const key=`${sphere}:${step}:v8`;if(answers.dataset.shuffleKey===key)return;const perm=permutations[hash(key)%permutations.length];const byScore=new Map(buttons.map(btn=>[Number(btn.dataset.i),btn]));perm.forEach(score=>{const btn=byScore.get(score);if(btn)answers.appendChild(btn)});[...answers.querySelectorAll('.answer')].forEach((btn,i)=>{const letter=btn.querySelector('b');if(letter)letter.textContent=String.fromCharCode(65+i)});answers.dataset.shuffleKey=key;}
  function decorateQuizStage(){const stage=document.getElementById('stageLabel');if(!stage)return;const sphere=new URLSearchParams(location.search).get('sphere');if(!sphere)return;const first=(parseInt(document.getElementById('counter')?.textContent||'1',10)||1)===1;stage.textContent=first?'ЗАФИКСИРОВАТЬ ИСХОДНОЕ СОСТОЯНИЕ':'ПРОЦЕДУРА ДЕГРАДАЦИИ';}
  decorateStaticSelector();decorateCards();shuffleVisibleAnswers();decorateQuizStage();let scheduled=false;const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;decorateCards();shuffleVisibleAnswers();decorateQuizStage()})};new MutationObserver(schedule).observe(grid,{childList:true});new MutationObserver(schedule).observe(host,{childList:true});
})();
