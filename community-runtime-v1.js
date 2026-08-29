import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

export const DC_SPHERES=Object.freeze([
  ['personality','Личность'],
  ['work','Работа'],
  ['consumption','Потребление'],
  ['relationships','Отношения'],
  ['control','Контроль'],
  ['information','Информация'],
  ['self_development','Саморазвитие'],
  ['meaning','Смысл'],
  ['technology','Технологии']
]);
export const DC_ASSESSMENT_VERSION='dc9-v1';
export const DC_LOCAL_STORAGE_KEY='dementorClubOnboardingV3';
export const DC_TERMS_VERSION='0.2';
export const DC_PRIVACY_VERSION='0.2';
export const DC_ARTIFACT_BUCKET='dc-community-artifacts';

export const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const formatDate=value=>{if(!value)return '—';try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(value))}catch{return String(value)}};
export const basePath=()=>location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
export const route=path=>`${basePath()}${path.startsWith('/')?path:`/${path}`}`;

export function getConfig(){
  const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
  if(!cfg?.enabled||!cfg.url||!cfg.publishableKey)throw new Error('SUPABASE_CONFIG_UNAVAILABLE');
  return cfg;
}

export function getClient(){
  if(window.DEMENTOR_SUPABASE_CLIENT)return window.DEMENTOR_SUPABASE_CLIENT;
  const cfg=getConfig();
  const client=createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  return client;
}

export async function currentSession(client=getClient()){
  const {data,error}=await client.auth.getSession();
  if(error)throw error;
  return data.session||null;
}

export async function loginWithGoogle(next='/join/result/',client=getClient()){
  const callback=new URL(`${basePath()}/auth/callback/`,location.origin);
  callback.searchParams.set('next',route(next));
  const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback.toString()}});
  if(error)throw error;
}

export function readLocalOnboarding(){
  try{return JSON.parse(localStorage.getItem(DC_LOCAL_STORAGE_KEY)||'null')||{results:{},active:null}}
  catch{return{results:{},active:null}}
}

function sourceKey(sphere,result){return `${DC_ASSESSMENT_VERSION}:${sphere}:${result?.date||'undated'}`}

export async function syncLocalAssessmentRuns(client,userId){
  const local=readLocalOnboarding();
  for(const [sphere,result] of Object.entries(local.results||{})){
    if(!DC_SPHERES.some(([id])=>id===sphere)||!result?.date)continue;
    const {error}=await client.from('assessment_runs').upsert({
      profile_id:userId,
      sphere_id:sphere,
      assessment_version:DC_ASSESSMENT_VERSION,
      result_json:result,
      answers_json:null,
      started_at:null,
      completed_at:result.date,
      source_key:sourceKey(sphere,result)
    },{onConflict:'profile_id,source_key',ignoreDuplicates:true});
    if(error&&error.code!=='23505')throw error;
  }
}

export async function readSphereResults(client,userId){
  const local=readLocalOnboarding().results||{};
  const merged={...local};
  if(userId){
    const {data,error}=await client.from('assessment_runs')
      .select('sphere_id,result_json,completed_at')
      .eq('profile_id',userId)
      .eq('assessment_version',DC_ASSESSMENT_VERSION)
      .order('completed_at',{ascending:false});
    if(error)throw error;
    for(const row of data||[]){
      if(!DC_SPHERES.some(([id])=>id===row.sphere_id))continue;
      const current=merged[row.sphere_id];
      const remote={...(row.result_json||{}),date:row.result_json?.date||row.completed_at};
      if(!current||(Date.parse(remote.date||0)||0)>(Date.parse(current.date||0)||0))merged[row.sphere_id]=remote;
    }
  }
  return merged;
}

export async function getEntryStatus(client=getClient()){
  const {data,error}=await client.rpc('dc_member_entry_status_v1');
  if(error)throw error;
  return data||{};
}

export async function getOwnProfile(client,userId){
  const {data,error}=await client.from('profiles').select('id,email,full_name,display_name,nickname,avatar_url').eq('id',userId).maybeSingle();
  if(error)throw error;
  return data||null;
}

export function providerFromInput(value){
  const v=String(value||'').toLowerCase();
  if(v.includes('t.me')||v.includes('telegram'))return 'telegram';
  if(v.includes('instagram'))return 'instagram';
  if(v.includes('linkedin'))return 'linkedin';
  if(/^https?:\/\//.test(v))return 'website';
  return 'other';
}

export function safeFileName(name){
  const raw=String(name||'file').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  return (raw||'file').slice(-120);
}

export function mediaType(file){return String(file?.type||'').startsWith('image/')?'image':'file'};

export async function signedMediaUrl(client,path,expiresIn=3600){
  const {data,error}=await client.storage.from(DC_ARTIFACT_BUCKET).createSignedUrl(path,expiresIn);
  if(error)throw error;
  return data?.signedUrl||null;
}

export function errorMessage(error){
  const raw=String(error?.message||error||'UNKNOWN_ERROR');
  const map={
    AUTH_REQUIRED:'Нужно войти в аккаунт.',
    SPHERE_GATE_INCOMPLETE:'Сначала завершите все девять сфер.',
    DISPLAY_NAME_REQUIRED:'Укажите имя, которое будет видно внутри клуба.',
    EXTERNAL_IDENTITY_REQUIRED:'Оставьте хотя бы один способ идентификации или связи.',
    LEGAL_VERSION_MISMATCH:'Условия сайта обновились. Перезагрузите страницу и подтвердите актуальную версию.',
    MEMBERSHIP_REQUIRED:'Эта функция доступна только активным участникам клуба.',
    NO_ARTIFACT_SLOT_AVAILABLE:'Сейчас нет свободного места для нового объявления.',
    DRAFT_ALREADY_EXISTS:'У вас уже есть незавершённое объявление. Продолжите его или удалите.',
    ARTIFACT_DRAFT_NOT_FOUND:'Черновик объявления не найден.',
    MEDIA_LIMIT_REACHED:'В первой версии к объявлению можно прикрепить только один файл.',
    MEDIA_OBJECT_NOT_FOUND:'Файл не найден после загрузки.',
    ARTIFACT_ALREADY_EXPIRED:'Нельзя опубликовать объявление с уже прошедшим сроком.'
  };
  const key=Object.keys(map).find(k=>raw.includes(k));
  return key?map[key]:raw;
}
