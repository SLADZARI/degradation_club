import {getClient,currentSession,loginWithGoogle,syncLocalAssessmentRuns,getEntryStatus,getOwnProfile,DC_TERMS_VERSION,DC_PRIVACY_VERSION,esc,errorMessage,route} from '/community-runtime-v1.js';

const host=document.getElementById('memberHost');
const gateState=document.getElementById('gateState');

function showError(error){
  const old=host.querySelector('.dc-member-error');if(old)old.remove();
  const el=document.createElement('div');el.className='dc-member-error';el.textContent=typeof error==='string'?error:errorMessage(error);host.prepend(el);
}
function panel(label,title,copy,actions=''){return `<section class="dc-member-panel"><div class="dc-member-panel__label">${esc(label)}</div><div class="dc-member-panel__body"><h2>${title}</h2><p>${esc(copy)}</p>${actions}</div></section>`}
function normalizeContactUrl(value){
  const raw=String(value||'').trim();if(!raw)return null;
  let candidate=raw;
  if(!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)&&/^[^\s/@]+\.[^\s]+/i.test(candidate))candidate=`https://${candidate}`;
  let parsed;try{parsed=new URL(candidate)}catch{return null}
  if(!['http:','https:'].includes(parsed.protocol)||!parsed.hostname)return null;
  return parsed.href.length<=1000?parsed.href:null;
}
function inferProvider(contact){
  const normalized=normalizeContactUrl(contact);if(!normalized)return null;
  const hostname=new URL(normalized).hostname.toLowerCase().replace(/^www\./,'');
  if(hostname==='t.me'||hostname==='telegram.me'||hostname.endsWith('.telegram.me'))return 'telegram';
  if(hostname==='instagram.com'||hostname.endsWith('.instagram.com'))return 'instagram';
  if(hostname==='linkedin.com'||hostname.endsWith('.linkedin.com'))return 'linkedin';
  return 'website';
}
function providerLabel(value){return ({telegram:'Telegram',instagram:'Instagram',linkedin:'LinkedIn',website:'сайт',other:'другое'})[value]||value}

async function boot(){
  const client=getClient();
  const session=await currentSession(client);
  if(!session){
    gateState.textContent='AUTH REQUIRED';
    host.innerHTML=panel('AUTHENTICATION ≠ MEMBERSHIP','СНАЧАЛА<br>ВОЙДИТЕ.','Нам нужен конкретный аккаунт, к которому принадлежат результаты девяти сфер и участие в клубе.','<div class="dc-member-actions"><button class="dc-member-action primary" id="memberLogin" type="button">ВОЙТИ ЧЕРЕЗ GOOGLE →</button><a class="dc-member-action" href="'+route('/join/result/')+'">К КАРТЕ DC-9</a></div>');
    document.getElementById('memberLogin').onclick=async event=>{const button=event.currentTarget;button.disabled=true;button.textContent='ПЕРЕХОД К GOOGLE…';try{await loginWithGoogle('/join/member/',client)}catch(error){button.disabled=false;button.textContent='ВОЙТИ ЧЕРЕЗ GOOGLE →';showError(error)}};
    return;
  }

  await syncLocalAssessmentRuns(client,session.user.id);
  const status=await getEntryStatus(client);
  gateState.textContent=status.community_activation_state||'CHECKED';

  if(status.membership_active){
    host.innerHTML=`<section class="dc-member-done"><div class="dc-member-done__meta">MEMBERSHIP / ACTIVE</div><h2>ДОПУСК<br>ЕСТЬ.</h2><p>${status.community_activation_state==='MEMBER_ACTIVATED'?'Вы уже оставили след в Community.':'Теперь нужен первый Artifact — ваше объявление другим участникам.'}</p><div class="dc-member-actions"><a class="dc-member-action primary" href="${route('/community/board/')}">ОТКРЫТЬ COMMUNITY BOARD →</a><a class="dc-member-action" href="${route('/join/result/')}">КАРТА DC-9</a></div></section>`;
    return;
  }

  if(!status.sphere_gate_complete){
    host.innerHTML=panel('GATE / DC-9','НЕ ХВАТАЕТ<br>СФЕР.','Для Community v1 нужно завершить все девять независимых обследований.','<div class="dc-member-actions"><a class="dc-member-action primary" href="'+route('/join/result/')+'">ПРОВЕРИТЬ КАРТУ →</a><a class="dc-member-action" href="'+route('/join/')+'">ПРОДОЛЖИТЬ DC-9</a></div>');
    return;
  }

  const profile=await getOwnProfile(client,session.user.id);
  const suggested=profile?.display_name||profile?.full_name||session.user.user_metadata?.full_name||session.user.user_metadata?.name||'';
  const nickname=profile?.nickname||'';
  host.innerHTML=`<section class="dc-member-panel"><div class="dc-member-panel__label">IDENTITY / MINIMUM</div><div class="dc-member-panel__body"><h2>КАК ВЫ<br>БУДЕТЕ<br>ЗДЕСЬ?</h2><p>Никакой новой биографии писать не надо. Имя для Community и один внешний идентификатор — достаточно.</p></div></section>
  <form class="dc-member-form" id="memberForm" novalidate>
    <div class="dc-member-field"><label for="displayName">Имя в Community *</label><input id="displayName" name="display_name" maxlength="80" required value="${esc(suggested)}" autocomplete="name"><small>Это имя увидят другие участники. Оно не обязано совпадать с юридическим именем.</small></div>
    <div class="dc-member-field"><label for="nickname">Никнейм</label><input id="nickname" name="nickname" maxlength="80" value="${esc(nickname)}" autocomplete="nickname"><small>Опционально. Можно оставить пустым.</small></div>
    <div class="dc-member-field"><label for="provider">Где вас найти *</label><select id="provider" name="provider" required><option value="telegram">Telegram</option><option value="instagram">Instagram</option><option value="linkedin">LinkedIn</option><option value="website">Сайт</option><option value="other">Другое</option></select><small id="providerHint">Если вставить ссылку Telegram / Instagram / LinkedIn, тип определится автоматически.</small></div>
    <div class="dc-member-field"><label for="contact">Ссылка или ник *</label><input id="contact" name="contact" maxlength="1000" required placeholder="https://… или @nickname" autocomplete="url"><small>Достаточно одного способа связи. Контакт по умолчанию не публикуется на общей доске.</small></div>
    <div class="dc-member-checks">
      <label class="dc-member-check"><input type="checkbox" name="terms" required><span>Принимаю <a href="${route('/legal/terms/')}" target="_blank" rel="noopener">Условия использования v${DC_TERMS_VERSION}</a> для входа в Community.</span></label>
      <label class="dc-member-check"><input type="checkbox" name="privacy" required><span>Ознакомился с <a href="${route('/legal/privacy/')}" target="_blank" rel="noopener">Privacy v${DC_PRIVACY_VERSION}</a>. Это подтверждение ознакомления, а не отдельное согласие на обработку.</span></label>
    </div>
    <div class="dc-member-actions"><button class="dc-member-action primary" type="submit">ВОЙТИ В COMMUNITY →</button><a class="dc-member-action" href="${route('/join/result/')}">НАЗАД К КАРТЕ</a></div>
  </form>`;

  const form=document.getElementById('memberForm');const providerSelect=document.getElementById('provider');const contactInput=document.getElementById('contact');const providerHint=document.getElementById('providerHint');
  const syncProvider=()=>{const inferred=inferProvider(contactInput.value);if(!inferred){providerHint.textContent='Тип не определён автоматически — оставьте нужный вариант вручную.';return}providerSelect.value=inferred;providerHint.textContent=`Определено по ссылке: ${providerLabel(inferred)}.`};
  contactInput.addEventListener('input',syncProvider);contactInput.addEventListener('blur',()=>{const normalized=normalizeContactUrl(contactInput.value);if(normalized){contactInput.value=normalized;syncProvider()}});

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const button=form.querySelector('button[type=submit]');const fd=new FormData(form);
    const displayName=String(fd.get('display_name')||'').trim();const nick=String(fd.get('nickname')||'').trim();let provider=String(fd.get('provider')||'').trim();let contact=String(fd.get('contact')||'').trim();
    if(!displayName||!contact||!fd.get('terms')||!fd.get('privacy')){showError('Заполните обязательные поля и подтвердите условия.');return}
    const normalizedUrl=normalizeContactUrl(contact);const inferred=inferProvider(contact);if(inferred)provider=inferred;
    if(normalizedUrl){contact=normalizedUrl;contactInput.value=contact;providerSelect.value=provider}
    const isUrl=Boolean(normalizedUrl);const handle=isUrl?null:contact;const url=isUrl?contact:null;
    if(!isUrl&&!/^@?[\p{L}\p{N}._-]{2,80}$/u.test(handle)){showError('Проверьте контакт: вставьте обычную ссылку или короткий ник/handle.');contactInput.focus();return}
    button.disabled=true;button.textContent='ФИКСИРУЕМ ДОПУСК…';
    try{
      const {data,error}=await client.rpc('dc_activate_membership_v1',{p_display_name:displayName,p_provider:provider,p_handle:handle,p_url:url,p_nickname:nick||null,p_terms_version:DC_TERMS_VERSION,p_privacy_version:DC_PRIVACY_VERSION});
      if(error)throw error;
      gateState.textContent=data?.community_activation_state||'FIRST_ARTIFACT_REQUIRED';
      host.innerHTML=`<section class="dc-member-done"><div class="dc-member-done__meta">MEMBERSHIP / ACTIVE</div><h2>ДОПУСК<br>ПОЛУЧЕН.</h2><p>Вы внутри. Но пока ещё ничего не сделали. На общей доске вас ждёт одно свободное место для первого объявления.</p><div class="dc-member-actions"><a class="dc-member-action primary" href="${route('/community/board/')}">ВОЙТИ НА ДОСКУ →</a></div></section>`;
    }catch(error){button.disabled=false;button.textContent='ВОЙТИ В COMMUNITY →';console.warn('[DC Member] activation failed',error);showError('Не удалось активировать участие. Проверьте контакт и попробуйте ещё раз.')}
  });
}

boot().catch(error=>{gateState.textContent='ERROR';host.innerHTML='<div class="dc-member-state">НЕ УДАЛОСЬ ЗАГРУЗИТЬ ВХОД.</div>';showError(error)});