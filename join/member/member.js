import {getClient,currentSession,loginWithGoogle,syncLocalAssessmentRuns,getEntryStatus,getOwnProfile,DC_TERMS_VERSION,DC_PRIVACY_VERSION,esc,errorMessage,route} from '/community-runtime-v1.js';

const host=document.getElementById('memberHost');
const gateState=document.getElementById('gateState');

function showError(error){
  const old=host.querySelector('.dc-member-error');if(old)old.remove();
  const el=document.createElement('div');el.className='dc-member-error';el.textContent=errorMessage(error);host.prepend(el);
}
function panel(label,title,copy,actions=''){return `<section class="dc-member-panel"><div class="dc-member-panel__label">${esc(label)}</div><div class="dc-member-panel__body"><h2>${title}</h2><p>${esc(copy)}</p>${actions}</div></section>`}

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
    <div class="dc-member-field"><label for="provider">Где вас найти *</label><select id="provider" name="provider" required><option value="telegram">Telegram</option><option value="instagram">Instagram</option><option value="linkedin">LinkedIn</option><option value="website">Сайт</option><option value="other">Другое</option></select><small>Контакт нужен для идентификации участника. По умолчанию он не публикуется на общей доске.</small></div>
    <div class="dc-member-field"><label for="contact">Ссылка или ник *</label><input id="contact" name="contact" maxlength="1000" required placeholder="https://… или @nickname" autocomplete="url"><small>Достаточно одного способа связи.</small></div>
    <div class="dc-member-checks">
      <label class="dc-member-check"><input type="checkbox" name="terms" required><span>Принимаю <a href="${route('/legal/terms/')}" target="_blank" rel="noopener">Условия использования v${DC_TERMS_VERSION}</a> для входа в Community.</span></label>
      <label class="dc-member-check"><input type="checkbox" name="privacy" required><span>Ознакомился с <a href="${route('/legal/privacy/')}" target="_blank" rel="noopener">Privacy v${DC_PRIVACY_VERSION}</a>. Это подтверждение ознакомления, а не отдельное согласие на обработку.</span></label>
    </div>
    <div class="dc-member-actions"><button class="dc-member-action primary" type="submit">ВОЙТИ В COMMUNITY →</button><a class="dc-member-action" href="${route('/join/result/')}">НАЗАД К КАРТЕ</a></div>
  </form>`;

  document.getElementById('memberForm').addEventListener('submit',async event=>{
    event.preventDefault();
    const form=event.currentTarget;const button=form.querySelector('button[type=submit]');const fd=new FormData(form);
    const displayName=String(fd.get('display_name')||'').trim();const nick=String(fd.get('nickname')||'').trim();const provider=String(fd.get('provider')||'').trim();const contact=String(fd.get('contact')||'').trim();
    if(!displayName||!contact||!fd.get('terms')||!fd.get('privacy')){showError('Заполните обязательные поля и подтвердите условия.');return}
    const isUrl=/^https?:\/\//i.test(contact);const handle=isUrl?null:contact;const url=isUrl?contact:null;
    button.disabled=true;button.textContent='ФИКСИРУЕМ ДОПУСК…';
    try{
      const {data,error}=await client.rpc('dc_activate_membership_v1',{p_display_name:displayName,p_provider:provider,p_handle:handle,p_url:url,p_nickname:nick||null,p_terms_version:DC_TERMS_VERSION,p_privacy_version:DC_PRIVACY_VERSION});
      if(error)throw error;
      gateState.textContent=data?.community_activation_state||'FIRST_ARTIFACT_REQUIRED';
      host.innerHTML=`<section class="dc-member-done"><div class="dc-member-done__meta">MEMBERSHIP / ACTIVE</div><h2>ДОПУСК<br>ПОЛУЧЕН.</h2><p>Вы внутри. Но пока ещё ничего не сделали. На общей доске вас ждёт одно свободное место для первого объявления.</p><div class="dc-member-actions"><a class="dc-member-action primary" href="${route('/community/board/')}">ВОЙТИ НА ДОСКУ →</a></div></section>`;
    }catch(error){button.disabled=false;button.textContent='ВОЙТИ В COMMUNITY →';showError(error)}
  });
}

boot().catch(error=>{gateState.textContent='ERROR';host.innerHTML='<div class="dc-member-state">НЕ УДАЛОСЬ ЗАГРУЗИТЬ ВХОД.</div>';showError(error)});
