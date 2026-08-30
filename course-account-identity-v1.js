(()=>{
  if(!location.pathname.includes('/courses/dumai-s-opasnostyu/'))return;
  const STORAGE='dementor_dumai_course_stage1';

  const accountEmail=()=>String(window.DEMENTOR_AUTH_USER?.email||'').trim().toLowerCase();
  const patchStoredState=email=>{
    if(!email)return;
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE)||'null');
      if(raw&&raw.email!==email){raw.email=email;localStorage.setItem(STORAGE,JSON.stringify(raw));}
    }catch(_){ }
    try{
      if(typeof state!=='undefined'&&state&&state.email!==email){state.email=email;if(typeof save==='function')save();}
    }catch(_){ }
  };

  const decorateEmailScreen=()=>{
    const email=accountEmail();
    if(!email)return false;
    patchStoredState(email);
    const input=document.getElementById('email');
    if(!input)return false;
    if(input.value!==email){input.value=email;input.dispatchEvent(new Event('input',{bubbles:true}));}
    input.readOnly=true;
    input.setAttribute('aria-readonly','true');
    input.autocomplete='email';
    const screen=input.closest('.screen');
    const title=screen?.querySelector('h2');
    const lead=screen?.querySelector('.lead');
    const note=screen?.querySelector('.note');
    if(title)title.textContent='К какому аккаунту привязать это дело?';
    if(lead)lead.textContent='Курс использует e-mail Google-аккаунта, под которым вы вошли. Отдельный адрес для этого дела не создаётся.';
    if(note)note.innerHTML=`<b>ACCOUNT:</b> ${email}<br>Ответы курса остаются связаны с этим аккаунтом.`;
    return true;
  };

  const sync=()=>decorateEmailScreen();
  window.addEventListener('dc-auth-ready',sync);
  const app=document.getElementById('app');
  if(app)new MutationObserver(sync).observe(app,{childList:true});
  sync();
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(accountEmail()||tries>=80)clearInterval(timer);
    decorateEmailScreen();
  },100);
})();
