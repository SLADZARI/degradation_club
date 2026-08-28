import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const SUPABASE_URL='https://mmekfydwbvptbdatwitj.supabase.co';
const SUPABASE_KEY='sb_publishable_a7e_Ndwwii8lyt_xmezoVw_ijxfh_yg';
const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
const current=location.pathname+location.search+location.hash;
const callback=location.origin+base+'/auth/callback/?next='+encodeURIComponent(current);
const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
window.DEMENTOR_SUPABASE_CLIENT=client;

const style=document.createElement('style');
style.textContent=`.dc-owner-gate{position:fixed;inset:0;z-index:99999;background:#f2f0e8;color:#111;display:grid;place-items:center;padding:24px;font-family:Arial,Helvetica,sans-serif}.dc-owner-gate__box{width:min(760px,100%);border:1px solid #111;padding:clamp(24px,5vw,54px)}.dc-owner-gate__k{font:800 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em}.dc-owner-gate h1{font:900 clamp(42px,8vw,88px)/.84 Arial,sans-serif;letter-spacing:-.06em;margin:14px 0 22px}.dc-owner-gate p{max-width:52em;font:14px/1.5 Arial,sans-serif}.dc-owner-gate button,.dc-owner-gate a{display:inline-block;margin:16px 8px 0 0;border:1px solid #111;background:#d8ff3e;color:#111;padding:13px 16px;font:900 11px Arial,sans-serif;text-decoration:none;cursor:pointer}.dc-owner-gate .secondary{background:transparent}`;
document.head.appendChild(style);

const gate=document.createElement('div');gate.className='dc-owner-gate';gate.innerHTML='<div class="dc-owner-gate__box"><div class="dc-owner-gate__k">DEMENTOR CLUB / OWNER_ADMIN</div><h1>ПРОВЕРКА<br>ДОСТУПА.</h1><p>Внутренние инструменты доступны только активному OWNER_ADMIN.</p><div data-actions></div></div>';document.body.appendChild(gate);
const actions=gate.querySelector('[data-actions]');
const setText=text=>{gate.querySelector('p').textContent=text};
const active=row=>row?.status==='active'&&(!row.valid_from||Date.parse(row.valid_from)<=Date.now())&&(!row.valid_to||Date.parse(row.valid_to)>Date.now());

async function login(){const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback}});if(error)setText('Не удалось начать вход: '+error.message)}
async function boot(){
  const {data:{session},error}=await client.auth.getSession();if(error)throw error;
  if(!session){setText('Нужен аккаунт OWNER_ADMIN.');actions.innerHTML='<button type="button" data-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button><a class="secondary" href="'+base+'/">НА САЙТ</a>';actions.querySelector('[data-login]').onclick=login;return;}
  const {data:userData,error:userError}=await client.auth.getUser();if(userError)throw userError;const user=userData.user;
  const {data:roles,error:roleError}=await client.from('dc_role_assignments').select('role,status,valid_from,valid_to').eq('profile_id',user.id).eq('role','owner_admin');if(roleError)throw roleError;
  if(!(roles||[]).some(active)){setText((user.email||'Этот аккаунт')+' авторизован, но OWNER_ADMIN не назначен.');actions.innerHTML='<a href="'+base+'/workspace/">В ЛИЧНЫЙ КАБИНЕТ</a><button class="secondary" type="button" data-logout>ВЫЙТИ</button>';actions.querySelector('[data-logout]').onclick=async()=>{await client.auth.signOut();location.reload()};return;}
  document.documentElement.dataset.dcOwnerAdmin='1';window.dispatchEvent(new CustomEvent('dc:owner-admin-ready',{detail:{userId:user.id,email:user.email||null}}));gate.remove();
}
boot().catch(error=>{console.error('[DC OWNER GATE]',error);setText('Ошибка проверки доступа: '+error.message);actions.innerHTML='<a href="'+base+'/workspace/">В ЛИЧНЫЙ КАБИНЕТ</a>'});