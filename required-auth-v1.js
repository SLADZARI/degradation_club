import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
if(cfg?.enabled&&cfg.url&&cfg.publishableKey){
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
  const current=location.pathname+location.search+location.hash;
  const callback=location.origin+base+'/auth/callback/?next='+encodeURIComponent(current);
  const ensureStyle=()=>{if(document.getElementById('dc-auth-required-style'))return;const s=document.createElement('style');s.id='dc-auth-required-style';s.textContent=`.dc-auth-required{position:fixed;inset:0;z-index:4000;background:#f2f0e8;color:#111;display:grid;place-items:center;padding:24px}.dc-auth-required__box{width:min(760px,100%);border:1px solid #111;padding:clamp(24px,5vw,54px)}.dc-auth-required__k{font:800 10px/1 Arial,sans-serif;letter-spacing:.14em}.dc-auth-required h1{font:900 clamp(42px,8vw,86px)/.86 Arial,sans-serif;letter-spacing:-.055em;margin:14px 0 22px}.dc-auth-required p{max-width:48em;font:400 14px/1.5 Arial,sans-serif}.dc-auth-required button{margin-top:18px;border:1px solid #111;background:#d8ff3e;padding:15px 18px;font:900 12px Arial,sans-serif;cursor:pointer}.dc-auth-required button:hover{background:#111;color:#d8ff3e}`;document.head.appendChild(s)};
  const showGate=()=>{ensureStyle();if(document.querySelector('.dc-auth-required'))return;const gate=document.createElement('div');gate.className='dc-auth-required';gate.innerHTML=`<div class="dc-auth-required__box"><div class="dc-auth-required__k">ACCOUNT REQUIRED / RESULT MUST HAVE AN OWNER</div><h1>СНАЧАЛА<br>НУЖЕН<br>АККАУНТ.</h1><p>Этот опрос или интерактивная программа сохраняет ваши ответы, результат и изменения уровня в личном кабинете. Анонимный прогресс больше не создаётся.</p><button type="button" data-dc-required-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button></div>`;document.body.appendChild(gate);gate.querySelector('[data-dc-required-login]').addEventListener('click',async()=>{const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback}});if(error){console.error('[DC Auth Gate]',error);gate.querySelector('p').textContent='Не удалось начать вход. Обновите страницу и попробуйте ещё раз.'}})};
  const {data:{session}}=await client.auth.getSession();
  if(!session){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showGate,{once:true});else showGate();}
}
