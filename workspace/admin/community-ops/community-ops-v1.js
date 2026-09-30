const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const root=document.documentElement;
const profileForm=document.getElementById('profileSearchForm');
const profileResults=document.getElementById('profileResults');
const slotPanel=document.getElementById('slotPanel');
const artifactForm=document.getElementById('artifactSearchForm');
const artifactResults=document.getElementById('artifactResults');
const artifactPanel=document.getElementById('artifactPanel');

let client=null;
let selectedProfileId=null;
let selectedArtifactId=null;
let selectedArtifact=null;
let grantPending=false;

const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const shortRef=id=>'USER-'+String(id||'').slice(0,8).toUpperCase();
const fmtDate=value=>{
  if(!value)return'—';
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return'—';
  return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(d).replace(',',' ·').toUpperCase();
};
function state(el,message,state=''){
  if(!el)return;
  el.innerHTML=`<div class="dco-state" data-state="${esc(state)}">${esc(message)}</div>`;
}
function errorText(error){
  const message=String(error?.message||error||'UNKNOWN_ERROR');
  if(message.includes('OWNER_ADMIN_REQUIRED'))return'Нужна роль OWNER_ADMIN.';
  if(message.includes('PROFILE_NOT_FOUND'))return'Профиль не найден.';
  if(message.includes('PROFILE_QUERY_INVALID'))return'Введите от 2 до 80 символов.';
  if(message.includes('SLOT_GRANT_AMOUNT_INVALID'))return'Количество slots должно быть больше нуля.';
  if(message.includes('SLOT_GRANT_REASON_INVALID'))return'Укажите причину.';
  if(message.includes('SLOT_GRANT_PROVENANCE_REQUIRED'))return'Укажите provenance / source ref.';
  if(message.includes('ARTIFACT_NOT_FOUND')||message.includes('ARTIFACT_NOT_AVAILABLE'))return'Artifact недоступен.';
  return message;
}
async function waitOwnerAdmin(){
  if(root.dataset.dcOwnerAdmin==='1')return;
  await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('OWNER_ADMIN_GUARD_TIMEOUT')),8000);
    window.addEventListener('dc:owner-admin-ready',()=>{clearTimeout(timer);resolve()},{once:true});
  });
}
async function boot(){
  await waitOwnerAdmin();
  client=window.DEMENTOR_SUPABASE_CLIENT;
  if(!client)throw new Error('SUPABASE_CLIENT_UNAVAILABLE');
  bind();
  state(profileResults,'Введите имя, ник или USER-ref.');
  state(artifactResults,'Введите часть заголовка или текста Artifact.');
}
function bind(){
  profileForm?.addEventListener('submit',event=>{event.preventDefault();searchProfiles().catch(showFatal)});
  profileResults?.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-profile-id]');
    if(button)selectProfile(button.dataset.profileId).catch(showFatal);
  });
  slotPanel?.addEventListener('submit',event=>{
    if(event.target?.matches?.('#slotGrantForm')){event.preventDefault();grantSlots(event.target).catch(showFatal)}
  });

  artifactForm?.addEventListener('submit',event=>{event.preventDefault();searchArtifacts().catch(showFatal)});
  artifactResults?.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-artifact-id]');
    if(button)selectArtifact(button.dataset.artifactId).catch(showFatal);
  });
  artifactPanel?.addEventListener('click',event=>{
    const inviteSearch=event.target.closest?.('[data-invite-search]');
    if(inviteSearch)searchInviteCandidates().catch(showArtifactStatus);
    const invite=event.target.closest?.('[data-invite-profile]');
    if(invite)inviteProfile(invite.dataset.inviteProfile).catch(showArtifactStatus);
    const remove=event.target.closest?.('[data-remove-profile]');
    if(remove)removeParticipant(remove.dataset.removeProfile).catch(showArtifactStatus);
    const close=event.target.closest?.('[data-close-artifact]');
    if(close)closeArtifact().catch(showArtifactStatus);
  });
  artifactPanel?.addEventListener('keydown',event=>{
    if(event.key==='Enter'&&event.target?.matches?.('#opsInviteSearch')){
      event.preventDefault();searchInviteCandidates().catch(showArtifactStatus);
    }
  });
}
function showFatal(error){
  console.warn('[Community Ops]',error);
  const target=selectedArtifactId?artifactPanel:slotPanel;
  state(target,errorText(error),'error');
}
function showArtifactStatus(error){
  const el=artifactPanel?.querySelector('[data-artifact-status]');
  if(el){el.textContent=errorText(error);el.dataset.state='error'}
  else showFatal(error);
}

async function searchProfiles(){
  const query=String(document.getElementById('profileSearch')?.value||'').trim();
  if(query.length<2){state(profileResults,'Введите минимум 2 символа.','error');return}
  state(profileResults,'ИЩЕМ…');
  const result=await client.rpc('dc_admin_profile_search_v1',{p_query:query,p_limit:12});
  if(result.error)throw result.error;
  const rows=Array.isArray(result.data)?result.data:[];
  if(!rows.length){state(profileResults,'СОВПАДЕНИЙ НЕТ.');return}
  profileResults.innerHTML=rows.map(row=>`
    <button class="dco-result" type="button" data-profile-id="${esc(row.profile_id)}" aria-current="${row.profile_id===selectedProfileId?'true':'false'}">
      <strong>${esc(row.display_name||row.profile_ref)}</strong>
      <small>${row.nickname?'@'+esc(String(row.nickname).replace(/^@/,''))+' · ':''}${esc(row.profile_ref)} · ${esc(row.membership_status||'NO MEMBERSHIP')}</small>
    </button>`).join('');
}
async function selectProfile(profileId){
  selectedProfileId=profileId;
  profileResults?.querySelectorAll('[data-profile-id]').forEach(el=>el.setAttribute('aria-current',el.dataset.profileId===profileId?'true':'false'));
  state(slotPanel,'ЧИТАЕМ SLOT STATE…');
  const result=await client.rpc('dc_admin_artifact_slot_status_v1',{p_profile_id:profileId});
  if(result.error)throw result.error;
  renderSlotPanel(result.data||{});
}
function renderSlotPanel(data){
  const profile=data.profile||{};
  const history=Array.isArray(data.grant_history)?data.grant_history:[];
  slotPanel.innerHTML=`
    <div class="dco-panel">
      <div class="dco-panel__head">
        <div><span class="dco-label">SELECTED PROFILE</span><h3>${esc(profile.display_name||profile.profile_ref||'PROFILE')}</h3></div>
        <div class="dco-panel__meta">${profile.nickname?'@'+esc(String(profile.nickname).replace(/^@/,''))+'<br>':''}${esc(profile.profile_ref||shortRef(profile.profile_id))}<br>${esc(profile.membership_status||'NO MEMBERSHIP')}</div>
      </div>
      <div class="dco-metrics">
        <div class="dco-metric"><span>GRANTED</span><strong>${Number(data.artifact_slots_granted||0)}</strong></div>
        <div class="dco-metric"><span>CONSUMING</span><strong>${Number(data.artifact_slots_consuming||0)}</strong></div>
        <div class="dco-metric"><span>AVAILABLE</span><strong>${Number(data.artifact_slots_available||0)}</strong></div>
        <div class="dco-metric"><span>PUBLISHED</span><strong>${Number(data.published_artifact_count||0)}</strong></div>
      </div>
      <div class="dco-grid">
        <div class="dco-card">
          <h4>ДОБАВИТЬ SLOTS</h4>
          <form id="slotGrantForm" class="dco-fields">
            <div class="dco-field"><label for="slotAmount">Количество *</label><input id="slotAmount" name="amount" type="number" min="1" step="1" inputmode="numeric" required></div>
            <div class="dco-field"><label for="slotReason">Причина *</label><textarea id="slotReason" name="reason" maxlength="500" required placeholder="Зачем выдаётся дополнительная ёмкость"></textarea></div>
            <div class="dco-field"><label for="slotSource">Provenance / source ref *</label><input id="slotSource" name="source_ref" maxlength="500" required placeholder="Например: owner-admin/community-ops/2026-09-30"></div>
            <button class="dco-action" type="submit">ПОДТВЕРДИТЬ GRANT →</button>
            <div class="dco-status" data-slot-status aria-live="polite"></div>
          </form>
        </div>
        <div class="dco-card">
          <h4>GRANT HISTORY</h4>
          <div class="dco-history">
            ${history.length?history.map(row=>`
              <div class="dco-history-row">
                <strong>+${Number(row.amount||0)}</strong>
                <div>${esc(row.reason||'—')}<br><small>${esc(row.source_ref||'—')} · ${esc(row.granted_by_display_name||'OWNER ADMIN')}</small></div>
                <time>${esc(fmtDate(row.created_at))}</time>
              </div>`).join(''):'<div class="dco-state">ИСТОРИИ GRANT ПОКА НЕТ.</div>'}
          </div>
        </div>
      </div>
    </div>`;
}
async function grantSlots(form){
  if(grantPending||!selectedProfileId)return;
  const amount=Number(form.elements.amount.value);
  const reason=String(form.elements.reason.value||'').trim();
  const sourceRef=String(form.elements.source_ref.value||'').trim();
  const status=form.querySelector('[data-slot-status]');
  if(!Number.isInteger(amount)||amount<=0){status.textContent='Количество должно быть целым и больше нуля.';status.dataset.state='error';return}
  if(!reason){status.textContent='Укажите причину.';status.dataset.state='error';return}
  if(!sourceRef){status.textContent='Укажите provenance / source ref.';status.dataset.state='error';return}
  if(!confirm(`Выдать +${amount} Artifact slot выбранному профилю?\n\nПричина: ${reason}\nSource: ${sourceRef}`))return;
  grantPending=true;
  const button=form.querySelector('button[type="submit"]');button.disabled=true;
  status.textContent='ВЫДАЁМ…';status.dataset.state='busy';
  try{
    const result=await client.rpc('dc_admin_grant_artifact_slots_v1',{p_profile_id:selectedProfileId,p_amount:amount,p_reason:reason,p_source_ref:sourceRef});
    if(result.error)throw result.error;
    status.textContent=`PASS · TOTAL GRANTED ${Number(result.data?.total_granted||0)}`;status.dataset.state='pass';
    await selectProfile(selectedProfileId);
  }catch(error){
    status.textContent=errorText(error);status.dataset.state='error';
  }finally{
    grantPending=false;
    if(button?.isConnected)button.disabled=false;
  }
}

async function searchArtifacts(){
  const query=String(document.getElementById('artifactSearch')?.value||'').trim();
  if(query.length<2){state(artifactResults,'Введите минимум 2 символа.','error');return}
  state(artifactResults,'ИЩЕМ…');
  const columns='id,author_profile_id,artifact_type,title,body,status,visibility,published_at,created_at,closed_at';
  const pattern=`%${query}%`;
  const [byTitle,byBody]=await Promise.all([
    client.from('dc_artifacts').select(columns).in('status',['active','expired','archived']).ilike('title',pattern).order('created_at',{ascending:false}).limit(20),
    client.from('dc_artifacts').select(columns).in('status',['active','expired','archived']).ilike('body',pattern).order('created_at',{ascending:false}).limit(20)
  ]);
  if(byTitle.error)throw byTitle.error;
  if(byBody.error)throw byBody.error;
  const map=new Map();
  [...(byTitle.data||[]),...(byBody.data||[])].forEach(row=>map.set(row.id,row));
  const rows=[...map.values()].sort((a,b)=>Date.parse(b.created_at||0)-Date.parse(a.created_at||0)).slice(0,20);
  if(!rows.length){state(artifactResults,'ARTIFACT НЕ НАЙДЕН.');return}
  const authorIds=[...new Set(rows.map(r=>r.author_profile_id).filter(Boolean))];
  const profiles=authorIds.length?await client.from('dc_member_public_profiles').select('profile_id,display_name,nickname').in('profile_id',authorIds):{data:[],error:null};
  if(profiles.error)throw profiles.error;
  const profileMap=new Map((profiles.data||[]).map(p=>[p.profile_id,p]));
  artifactResults.innerHTML=rows.map(row=>{
    const author=profileMap.get(row.author_profile_id);
    return `<button class="dco-result" type="button" data-artifact-id="${esc(row.id)}" aria-current="${row.id===selectedArtifactId?'true':'false'}">
      <strong>${esc(row.title||row.artifact_type||'ARTIFACT')}</strong>
      <small>${esc(row.artifact_type||'artifact').toUpperCase()} · ${esc(row.status||'')} · ${esc(row.visibility||'')}<br>${esc(author?.display_name||shortRef(row.author_profile_id))}</small>
    </button>`;
  }).join('');
}
async function selectArtifact(artifactId){
  selectedArtifactId=artifactId;
  artifactResults?.querySelectorAll('[data-artifact-id]').forEach(el=>el.setAttribute('aria-current',el.dataset.artifactId===artifactId?'true':'false'));
  state(artifactPanel,'ЧИТАЕМ ARTIFACT STATE…');
  const artifactResult=await client.from('dc_artifacts').select('id,author_profile_id,artifact_type,title,body,status,visibility,published_at,created_at,closed_at').eq('id',artifactId).maybeSingle();
  if(artifactResult.error)throw artifactResult.error;
  if(!artifactResult.data)throw new Error('ARTIFACT_NOT_FOUND');
  selectedArtifact=artifactResult.data;
  const [profileResult,participantsResult]=await Promise.all([
    client.from('dc_member_public_profiles').select('profile_id,display_name,nickname').eq('profile_id',selectedArtifact.author_profile_id).maybeSingle(),
    selectedArtifact.artifact_type==='idea'?client.rpc('dc_artifact_participants_read_v1',{p_artifact_id:selectedArtifact.id}):Promise.resolve({data:[],error:null})
  ]);
  if(profileResult.error)throw profileResult.error;
  if(participantsResult.error)throw participantsResult.error;
  renderArtifactPanel(selectedArtifact,profileResult.data,Array.isArray(participantsResult.data)?participantsResult.data:[]);
}
function personLabel(row){
  const name=row.display_name||row.nickname||shortRef(row.profile_id);
  const nick=row.nickname?'@'+String(row.nickname).replace(/^@/,''):'';
  return {name,nick};
}
function rosterRows(rows,stateName){
  const filtered=rows.filter(row=>row.participation_state===stateName);
  if(!filtered.length)return'<div class="dco-state">НЕТ.</div>';
  return filtered.map(row=>{
    const p=personLabel(row);
    return `<div class="dco-person">
      <div class="dco-person__id"><strong>${esc(p.name)}</strong><small>${p.nick?esc(p.nick)+' · ':''}${esc(stateName)}</small></div>
      <button class="dco-action secondary" type="button" data-remove-profile="${esc(row.profile_id)}">УБРАТЬ</button>
    </div>`;
  }).join('');
}
function renderArtifactPanel(artifact,author,participants){
  const authorName=author?.display_name||shortRef(artifact.author_profile_id);
  const activeClose=artifact.status==='active'||artifact.status==='expired';
  const isIdea=artifact.artifact_type==='idea';
  artifactPanel.innerHTML=`
    <div class="dco-panel">
      <div class="dco-panel__head">
        <div><span class="dco-label">${esc(String(artifact.artifact_type||'artifact').toUpperCase())} / ${esc(String(artifact.status||'').toUpperCase())}</span><h3>${esc(artifact.title||'БЕЗ ЗАГОЛОВКА')}</h3></div>
        <div class="dco-panel__meta">${esc(artifact.visibility||'')}<br>${esc(authorName)}<br>${esc(fmtDate(artifact.published_at||artifact.created_at))}</div>
      </div>
      <div class="dco-grid">
        <div class="dco-card">
          <h4>ARTIFACT STATE</h4>
          <p>${esc(String(artifact.body||'').slice(0,600))}</p>
          <div class="dco-actions">
            <a class="dco-action secondary" href="/community/artifact/${encodeURIComponent(artifact.id)}/">ОТКРЫТЬ DETAIL →</a>
            ${activeClose?'<button class="dco-action danger" type="button" data-close-artifact>УБРАТЬ В АРХИВ</button>':'<span class="dco-state">HISTORY / НЕ АКТИВЕН</span>'}
          </div>
        </div>
        <div class="dco-card">
          <h4>IDEA COLLABORATION</h4>
          ${isIdea?`
            <div class="dco-label">В ДЕЛЕ</div><div class="dco-roster">${rosterRows(participants,'JOINED')}</div>
            <div class="dco-label" style="margin-top:16px">ПОЗВАНЫ</div><div class="dco-roster">${rosterRows(participants,'INVITED')}</div>
            <div class="dco-field" style="margin-top:16px"><label for="opsInviteSearch">Позвать зарегистрированного пользователя</label>
              <div class="dco-search__row"><input id="opsInviteSearch" minlength="2" maxlength="80" placeholder="Имя / ник"><button class="dco-action" type="button" data-invite-search>НАЙТИ →</button></div>
            </div>
            <div class="dco-invite-results" data-invite-results></div>
          `:'<div class="dco-state">COLLABORATION ДОСТУПЕН ТОЛЬКО ДЛЯ IDEA.</div>'}
        </div>
      </div>
      <div class="dco-status" data-artifact-status aria-live="polite"></div>
    </div>`;
}
async function searchInviteCandidates(){
  if(!selectedArtifact||selectedArtifact.artifact_type!=='idea')return;
  const input=artifactPanel.querySelector('#opsInviteSearch');
  const results=artifactPanel.querySelector('[data-invite-results]');
  const query=String(input?.value||'').trim();
  if(query.length<2){results.innerHTML='<div class="dco-state" data-state="error">Введите минимум 2 символа.</div>';return}
  results.innerHTML='<div class="dco-state">ИЩЕМ…</div>';
  const result=await client.rpc('dc_artifact_invite_candidates_v1',{p_artifact_id:selectedArtifact.id,p_query:query,p_limit:12});
  if(result.error)throw result.error;
  const rows=Array.isArray(result.data)?result.data:[];
  results.innerHTML=rows.length?rows.map(row=>{
    const p=personLabel(row);
    const blocked=row.current_state==='INVITED'||row.current_state==='JOINED';
    return `<div class="dco-invite-result"><div><strong>${esc(p.name)}</strong><small>${p.nick?' '+esc(p.nick):''}${row.current_state?' · '+esc(row.current_state):''}</small></div><button class="dco-action secondary" type="button" data-invite-profile="${esc(row.profile_id)}" ${blocked?'disabled':''}>${blocked?'УЖЕ В СПИСКЕ':'ПОЗВАТЬ'}</button></div>`;
  }).join(''):'<div class="dco-state">ПОДХОДЯЩИХ ПРОФИЛЕЙ НЕТ.</div>';
}
async function inviteProfile(profileId){
  if(!selectedArtifactId)return;
  const status=artifactPanel.querySelector('[data-artifact-status]');
  status.textContent='ПРИГЛАШАЕМ…';status.dataset.state='busy';
  const result=await client.rpc('dc_artifact_invite_v1',{p_artifact_id:selectedArtifactId,p_profile_id:profileId});
  if(result.error)throw result.error;
  status.textContent='INVITED · PASS';status.dataset.state='pass';
  await selectArtifact(selectedArtifactId);
}
async function removeParticipant(profileId){
  if(!selectedArtifactId)return;
  if(!confirm('Убрать выбранного участника/приглашённого из этой идеи?'))return;
  const status=artifactPanel.querySelector('[data-artifact-status]');
  status.textContent='УБИРАЕМ…';status.dataset.state='busy';
  const result=await client.rpc('dc_artifact_remove_participant_v1',{p_artifact_id:selectedArtifactId,p_profile_id:profileId});
  if(result.error)throw result.error;
  await selectArtifact(selectedArtifactId);
}
async function closeArtifact(){
  if(!selectedArtifactId||!selectedArtifact)return;
  if(!confirm('OWNER ADMIN: убрать Artifact с активной доски и перенести в архив?'))return;
  const status=artifactPanel.querySelector('[data-artifact-status]');
  status.textContent='АРХИВИРУЕМ…';status.dataset.state='busy';
  const result=await client.rpc('dc_close_artifact_v1',{p_artifact_id:selectedArtifactId});
  if(result.error)throw result.error;
  await selectArtifact(selectedArtifactId);
  await searchArtifacts();
}

boot().catch(error=>{
  console.warn('[Community Ops boot]',error);
  state(profileResults,'OWNER ADMIN TOOL НЕДОСТУПЕН.','error');
  state(artifactResults,errorText(error),'error');
});
