import {getClient,currentSession,loginWithGoogle,syncLocalAssessmentRuns,route} from '/community-runtime-v1.js';

const host=document.getElementById('applyHost');
const SPHERES=[['personality','Личность'],['work','Работа'],['consumption','Потребление'],['relationships','Отношения'],['control','Контроль'],['information','Информация'],['self_development','Саморазвитие'],['meaning','Смысл'],['technology','Технологии']];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=v=>{try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(v))}catch{return String(v||'—')}};
const errorCopy=message=>{
  const m=String(message||'');
  if(m.includes('SPHERE_GATE_INCOMPLETE'))return 'Заявка откроется после завершения всех девяти сфер.';
  if(m.includes('ACTIVE_APPLICATION_EXISTS'))return 'Активная заявка уже существует. Обновите страницу.';
  if(m.includes('ALREADY_MEMBER'))return 'Членство уже активно. Повторная заявка не требуется.';
  if(m.includes('LEGAL_CONSENT_REQUIRED'))return 'Нужно подтвердить условия клуба и политику приватности.';
  if(m.includes('SOCIAL_URL_REQUIRED'))return 'Нужна корректная ссылка на социальную сеть или сайт.';
  return m||'Не удалось отправить заявку.';
};

function showError(msg){
  if(!host)return;
  let el=host.querySelector('.dc-apply-error');
  if(!el){el=document.createElement('div');el.className='dc-apply-error';host.prepend(el)}
  el.textContent=msg;
}

function renderForm({client,user,profile}){
  const parts=String(profile?.full_name||user.user_metadata?.full_name||user.user_metadata?.name||'').trim().split(/\s+/).filter(Boolean);
  const first=parts.shift()||'';
  const last=parts.join(' ');
  host.innerHTML=`<form class="dc-apply-form" id="membershipForm">
    <section class="dc-apply-section">
      <div class="dc-apply-section-head"><div class="dc-apply-kicker">01 / PERSON</div><div><h2>КТО ВЫ?</h2><p>DC-9 уже закончен. Здесь не второй тест — только контекст для двух дементоров, которые увидят вашу Sphere Map.</p></div></div>
      <div class="dc-apply-grid">
        <div class="dc-field"><label for="firstName">Имя</label><input id="firstName" name="first_name" required autocomplete="given-name" value="${esc(first)}"></div>
        <div class="dc-field"><label for="lastName">Фамилия</label><input id="lastName" name="last_name" required autocomplete="family-name" value="${esc(last)}"></div>
        <div class="dc-field is-wide"><label for="socialUrl">Ссылка на социальную сеть / сайт</label><input id="socialUrl" name="social_url" required inputmode="url" placeholder="https://…"></div>
        <div class="dc-field is-wide"><label for="about">Кто вы — коротко</label><textarea id="about" name="about" required placeholder="Чем занимаетесь, что делаете, что считаете важным"></textarea></div>
        <div class="dc-field is-wide"><label for="whyClub">Почему вы здесь</label><textarea id="whyClub" name="why_club" placeholder="Можно коротко. Можно не убеждать комиссию в своей нормальности."></textarea></div>
      </div>
    </section>
    <section class="dc-apply-section">
      <div class="dc-apply-section-head"><div class="dc-apply-kicker">02 / INTEREST MAP</div><div><div class="dc-regress-title">РЕГРЕСС ОГРАНИЧЕН.<br>РАСПРЕДЕЛИТЕ БЕЗОТВЕТСТВЕННО.</div><p>У вас ровно 100%. Это не результат DC-9, а карта того, куда вам интересно двигаться дальше.</p></div></div>
      <div class="dc-budget"><div><span>РАСПРЕДЕЛЕНО</span><strong id="budgetTotal">100 / 100</strong></div><div class="dc-regress-sub">ОДИН БЮДЖЕТ · ДЕВЯТЬ НАПРАВЛЕНИЙ</div></div>
      <div class="dc-interest-list" id="interestList"></div>
    </section>
    <section class="dc-apply-foot">
      <label class="dc-field is-wide"><span>Перед отправкой</span><span><input type="checkbox" name="legal_accepted" required> Подтверждаю <a href="${route('/legal/terms/')}" target="_blank" rel="noopener">условия клуба</a> и <a href="${route('/legal/privacy/')}" target="_blank" rel="noopener">политику приватности</a>.</span></label>
      <p>Отправка создаёт Membership Application v2 и фиксирует текущий снимок ваших 9/9 результатов. Членство появится только после двух независимых подтверждений дементоров.</p>
      <button class="dc-apply-submit" type="submit">ПОДАТЬ ЗАЯВКУ →</button>
    </section>
  </form>`;

  const list=host.querySelector('#interestList');
  let values=[12,11,11,11,11,11,11,11,11];
  const distribute=(total,weights)=>{if(total<=0)return weights.map(()=>0);const sum=weights.reduce((a,b)=>a+b,0);const raw=(sum>0?weights:weights.map(()=>1)).map(w=>(sum>0?w/sum:1/weights.length)*total);const out=raw.map(Math.floor);let rest=total-out.reduce((a,b)=>a+b,0);const order=raw.map((v,i)=>({i,f:v-Math.floor(v)})).sort((a,b)=>b.f-a.f);for(let k=0;k<rest;k++)out[order[k%order.length].i]++;return out};
  const setValue=(idx,target)=>{target=Math.max(0,Math.min(100,Math.round(Number(target)||0)));const others=values.filter((_,i)=>i!==idx);const distributed=distribute(100-target,others);const next=[];let j=0;for(let i=0;i<values.length;i++)next[i]=i===idx?target:distributed[j++];values=next;paint()};
  const paint=()=>{[...list.querySelectorAll('[data-interest]')].forEach((row,i)=>{const input=row.querySelector('input'),out=row.querySelector('output');input.value=values[i];input.style.setProperty('--p',values[i]+'%');out.value=values[i]+'%';out.textContent=values[i]+'%'});host.querySelector('#budgetTotal').textContent=values.reduce((a,b)=>a+b,0)+' / 100'};
  list.innerHTML=SPHERES.map(([id,title],i)=>`<label class="dc-interest-row" data-interest="${id}"><span class="dc-interest-name">${title}</span><input type="range" min="0" max="100" step="1" value="${values[i]}" aria-label="Интерес: ${title}"><output class="dc-interest-value">${values[i]}%</output></label>`).join('');
  [...list.querySelectorAll('input')].forEach((input,i)=>input.addEventListener('input',()=>setValue(i,input.value)));
  paint();

  host.querySelector('#membershipForm').addEventListener('submit',async e=>{
    e.preventDefault();
    const form=e.currentTarget,button=form.querySelector('button[type=submit]');
    const fd=new FormData(form);
    const firstName=String(fd.get('first_name')||'').trim();
    const lastName=String(fd.get('last_name')||'').trim();
    const social=String(fd.get('social_url')||'').trim();
    const about=String(fd.get('about')||'').trim();
    const why=String(fd.get('why_club')||'').trim();
    const legalAccepted=fd.get('legal_accepted')==='on';
    if(!firstName||!lastName||!social||!about){showError('Заполните имя, фамилию, ссылку и короткое описание.');return}
    if(!/^https?:\/\//i.test(social)){showError('Ссылка должна начинаться с http:// или https://');return}
    if(!legalAccepted){showError('Подтвердите условия клуба и политику приватности.');return}
    const interest_distribution=Object.fromEntries(SPHERES.map(([id],i)=>[id,values[i]]));
    if(Object.values(interest_distribution).reduce((a,b)=>a+b,0)!==100){showError('Распределение должно оставаться ровно 100%.');return}
    button.disabled=true;
    button.textContent='ОТПРАВЛЯЕМ…';
    const fullName=`${firstName} ${lastName}`.trim();
    const {error}=await client.rpc('dc_submit_membership_application_v2',{
      p_full_name:fullName,
      p_social_url:social,
      p_about:about,
      p_why_club:why||null,
      p_interest_distribution:interest_distribution,
      p_terms_version:'0.2',
      p_privacy_version:'0.2',
      p_legal_accepted:true
    });
    if(!error){location.reload();return}
    button.disabled=false;
    button.textContent='ПОДАТЬ ЗАЯВКУ →';
    showError(errorCopy(error.message));
  });
}

async function boot(){
  if(!host)return;
  let client;
  try{client=getClient()}catch(error){host.innerHTML='<div class="dc-apply-error">Сервис заявок сейчас недоступен.</div>';console.warn('[DC apply config]',error);return}

  let session;
  try{session=await currentSession(client)}catch(error){host.innerHTML='<div class="dc-apply-error">Не удалось проверить аккаунт. Обновите страницу.</div>';console.warn('[DC apply session]',error);return}
  const user=session?.user||null;

  if(!user){
    host.innerHTML='<section class="dc-apply-gate"><div class="dc-apply-kicker">AUTHENTICATION ≠ MEMBERSHIP</div><h2>СНАЧАЛА<br>ПРЕДСТАВЬТЕСЬ.</h2><p>Заявка принадлежит конкретному человеку. Войдите через Google. Сам вход не делает вас участником клуба.</p><button type="button" data-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button></section>';
    host.querySelector('[data-login]').onclick=async()=>{const button=host.querySelector('[data-login]');button.disabled=true;try{await loginWithGoogle('/join/apply/',client)}catch(error){button.disabled=false;showError(errorCopy(error.message))}};
    return;
  }

  const uid=user.id;
  try{
    // DC-9 may be completed anonymously. Attach local runs to the authenticated
    // person before evaluating the server-side 9/9 application gate.
    await syncLocalAssessmentRuns(client,uid);
  }catch(error){
    host.innerHTML=`<section class="dc-apply-gate"><div class="dc-apply-kicker">DC-9 / SYNC</div><h2>КАРТА ЕСТЬ.<br>СВЯЗЬ НЕ СОБРАЛАСЬ.</h2><p>Не удалось привязать локальные результаты DC-9 к аккаунту. Заявку пока не отправляем.</p><p><a class="dc-apply-submit" href="${route('/join/result/')}">ВЕРНУТЬСЯ К КАРТЕ →</a></p></section>`;
    console.warn('[DC apply assessment sync]',error);
    return;
  }

  const [{data:profile},{data:membership},{data:applications,error:appError},{data:entryStatus,error:statusError}]=await Promise.all([
    client.from('profiles').select('id,email,full_name,display_name').eq('id',uid).maybeSingle(),
    client.from('dc_system_memberships').select('status,valid_from,valid_to').eq('profile_id',uid).maybeSingle(),
    client.from('join_applications').select('id,status,created_at,reviewed_at,answers,decision_version').eq('profile_id',uid).order('created_at',{ascending:false}).limit(3),
    client.rpc('dc_member_entry_status_v1')
  ]);
  if(appError)showError(appError.message);
  if(statusError)showError(statusError.message);

  const member=membership?.status==='active';
  const current=applications?.[0]||null;
  const sphereCount=Number(entryStatus?.sphere_count||0);
  const gateComplete=entryStatus?.sphere_gate_complete===true||sphereCount===9;

  if(member){
    host.innerHTML=`<section class="dc-apply-done"><div class="dc-apply-kicker">MEMBERSHIP / ACTIVE</div><h2>ВЫ УЖЕ<br>В КЛУБЕ.</h2><p>Повторная заявка не требуется.</p><p><a class="dc-apply-submit" href="${route('/workspace/')}">ОТКРЫТЬ ЛИЧНЫЙ КАБИНЕТ →</a></p></section>`;
  }else if(current&&['submitted','reviewing','accepted'].includes(current.status)){
    const interests=current.answers?.interest_distribution||{};
    const title=current.status==='accepted'?'ВЫ ПРИНЯТЫ.':'ЗАЯВКА\nНА РАССМОТРЕНИИ.';
    const body=current.status==='accepted'?'Два дементора подтвердили заявку. Членство активируется сервером.':'Заявку рассматривают дементоры. Один голос сам по себе членство не создаёт.';
    host.innerHTML=`<section class="dc-apply-done"><div class="dc-apply-kicker">APPLICATION / ${esc(current.status).toUpperCase()}</div><h2>${title.replace('\n','<br>')}</h2><p>Отправлена ${date(current.created_at)}. ${body}</p><div class="dc-apply-section"><div class="dc-apply-kicker">КАРТА ИНТЕРЕСА</div>${SPHERES.map(([id,title])=>`<div class="dc-apply-status"><strong>${title}</strong><span>${Number(interests[id]||0)}%</span></div>`).join('')}</div><p><a class="dc-apply-submit" href="${route('/workspace/')}">В ЛИЧНЫЙ КАБИНЕТ →</a></p></section>`;
  }else if(current?.status==='continue_outside'){
    host.innerHTML=`<section class="dc-apply-done"><div class="dc-apply-kicker">APPLICATION / CONTINUE</div><h2>ПРОДОЛЖАЕМ<br>СНАРУЖИ.</h2><p>Community сейчас не активирована. Ваша Sphere Map и аккаунт остаются с вами — это не отменяет результаты обследования.</p><p><a class="dc-apply-submit" href="${route('/')}">В DEMENTOR CLUB →</a></p></section>`;
  }else if(!gateComplete){
    host.innerHTML=`<section class="dc-apply-gate"><div class="dc-apply-kicker">MEMBERSHIP GATE / ${sphereCount} OF 9</div><h2>СНАЧАЛА<br>ДЕВЯТЬ.</h2><p>Заявка в Community появляется только после всех девяти сфер. Сейчас сервер видит ${sphereCount}/9.</p><p><a class="dc-apply-submit" href="${route('/join/')}">ПРОДОЛЖИТЬ DC-9 →</a></p></section>`;
  }else{
    renderForm({client,user,profile});
  }
}

boot().catch(error=>{
  if(host)host.innerHTML='<div class="dc-apply-error">Не удалось открыть заявку. Обновите страницу.</div>';
  console.error('[DC apply]',error);
});
