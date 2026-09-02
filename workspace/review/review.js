import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const host=document.getElementById('reviewHost');
const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
const base=location.pathname.startsWith('/degradation_club/')?'/degradation_club':'';
const requested=new URLSearchParams(location.search).get('application');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>{try{return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(v))}catch{return String(v||'—')}};
const SPHERES=[
  ['personality','Личность',['самоирония','отказ от роли','границы','несовершенство']],
  ['work','Работа',['незанятость','делегирование','результат','антигероизм']],
  ['consumption','Потребление',['достаточность','непокупка','антистатус','использование']],
  ['relationships','Отношения',['прямота','границы','неспасательство','конфликт']],
  ['control','Контроль',['доверие','неопределённость','отпускание','выборочный контроль']],
  ['information','Информация',['наблюдение','факты','источники','смена мнения']],
  ['self_development','Саморазвитие',['достаточность','неоптимизация','практика','неидеальность']],
  ['meaning','Смысл',['локальный смысл','бессмысленность','присутствие','собственный выбор']],
  ['technology','Технологии',['автоматизация','инструментальность','цифровая автономия','нетехнофетиш']]
];
const sphereData=Object.fromEntries((window.DC9_SPHERE_DATA||[]).map(x=>[SPHERES[x.index]?.[0],x]));

if(!host||!cfg?.enabled){
  if(host)host.innerHTML='<div class="dcr-error">Review service unavailable.</div>';
}else{
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session}}=await client.auth.getSession();
  const user=session?.user||null;

  if(!user){
    host.innerHTML='<section class="dcr-state"><div class="dcr-kicker">AUTH REQUIRED</div><h2>СНАЧАЛА ВОЙТИ.</h2><p>Очередь заявок видят только действующие дементоры.</p><button class="dcr-login" type="button" data-login>ВОЙТИ ЧЕРЕЗ GOOGLE</button></section>';
    host.querySelector('[data-login]').onclick=async()=>{
      const next=base+location.pathname.replace(base,'')+location.search;
      const callback=location.origin+base+'/auth/callback/?next='+encodeURIComponent(next);
      const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:callback}});
      if(error)host.innerHTML='<div class="dcr-error">'+esc(error.message)+'</div>';
    };
  }else{
    const {data:role,error:roleError}=await client.from('dc_role_assignments')
      .select('role,status,valid_from,valid_to')
      .eq('profile_id',user.id).eq('role','dementor').eq('status','active').maybeSingle();

    if(roleError||!role){
      host.innerHTML='<section class="dcr-state"><div class="dcr-kicker">ACCESS DENIED</div><h2>НЕ ВАША<br>ОЧЕРЕДЬ.</h2><p>Аккаунт существует, но активная роль Dementor для него не найдена.</p><a class="dcr-login" href="'+base+'/workspace/">В ЛИЧНЫЙ КАБИНЕТ →</a></section>';
    }else{
      await load();
    }

    async function load(){
      host.innerHTML='<section class="dcr-state"><strong>ЗАГРУЖАЕМ ЗАЯВКИ…</strong></section>';
      let query=client.from('join_applications')
        .select('id,profile_id,email,full_name,answers,status,source,created_at,reviewed_at,candidate_snapshot,decision_version')
        .order('created_at',{ascending:true});
      query=requested?query.eq('id',requested):query.in('status',['submitted','reviewing']);
      const {data:apps,error}=await query;
      if(error){host.innerHTML='<div class="dcr-error">'+esc(error.message)+'</div>';return}
      if(!apps?.length){host.innerHTML='<section class="dcr-state"><div class="dcr-kicker">QUEUE / 0</div><p class="dcr-empty">НИКТО НЕ<br>СТУЧИТСЯ.</p></section>';return}

      const ids=apps.map(a=>a.id);
      const {data:reviews,error:reviewError}=await client.from('dc_membership_reviews')
        .select('id,application_id,reviewer_profile_id,decision,internal_note,created_at,updated_at')
        .in('application_id',ids);
      if(reviewError){host.innerHTML='<div class="dcr-error">'+esc(reviewError.message)+'</div>';return}

      const reviewerIds=[...new Set((reviews||[]).map(r=>r.reviewer_profile_id))];
      const reviewerNames={};
      if(reviewerIds.length){
        const {data:people}=await client.from('profiles').select('id,display_name,full_name').in('id',reviewerIds);
        for(const p of people||[])reviewerNames[p.id]=p.display_name||p.full_name||'Dementor';
      }

      host.innerHTML=apps.map(app=>renderCard(app,(reviews||[]).filter(r=>r.application_id===app.id),reviewerNames)).join('');
      host.querySelectorAll('[data-review-form]').forEach(form=>{
        form.addEventListener('click',async event=>{
          const button=event.target.closest('button[data-decision]');
          if(!button)return;
          const applicationId=form.dataset.reviewForm;
          const note=form.querySelector('textarea')?.value?.trim()||null;
          form.querySelectorAll('button').forEach(b=>b.disabled=true);
          const {data,error}=await client.rpc('dc_review_membership_application_v2',{
            p_application_id:applicationId,
            p_decision:button.dataset.decision,
            p_internal_note:note
          });
          if(error){
            form.insertAdjacentHTML('beforeend','<div class="dcr-error">'+esc(error.message)+'</div>');
            form.querySelectorAll('button').forEach(b=>b.disabled=false);
            return;
          }
          if(data?.status==='accepted'&&!requested){
            await load();
            return;
          }
          await load();
        });
      });
    }

    function renderCard(app,reviews,names){
      const interests=app.answers?.interest_distribution||{};
      const snapshot=app.candidate_snapshot||{};
      const own=reviews.find(r=>r.reviewer_profile_id===user.id);
      const closed=!['submitted','reviewing'].includes(app.status);
      const reviewRows=reviews.length?reviews.map(r=>`<div class="dcr-review-line"><span>${esc(r.reviewer_profile_id===user.id?'Вы':names[r.reviewer_profile_id]||'Другой дементор')}</span><strong>${decisionLabel(r.decision)}</strong>${r.internal_note?`<small>${esc(r.internal_note)}</small>`:''}</div>`).join(''):'<div class="dcr-review-line"><span>Решений пока нет</span><strong>0 / 2</strong></div>';
      const sphereHtml=SPHERES.map(([id,title,tags])=>renderSphere(id,title,tags,snapshot[id])).join('');
      return `<article class="dcr-card" id="application-${esc(app.id)}">
        <header class="dcr-head">
          <div><div class="dcr-kicker">APPLICATION / ${esc(app.id)}</div><h2>${esc(app.full_name||'Без имени')}</h2><div class="dcr-meta"><span>${esc(app.email)}</span><span>${fmt(app.created_at)}</span><span>DC-9 / ${Object.keys(snapshot).length}/9</span></div></div>
          <div class="dcr-status">${esc(app.status)}</div>
        </header>
        <div class="dcr-grid">
          <section class="dcr-panel">
            <h3>Candidate context</h3>
            <div class="dcr-copy">
              <article><small>Кто</small><p>${esc(app.answers?.about||'—')}</p></article>
              <article><small>Почему клуб</small><p>${esc(app.answers?.why_club||'—')}</p></article>
              <article><small>Контакт</small><p>${app.answers?.social_url?`<a href="${esc(app.answers.social_url)}" target="_blank" rel="noopener noreferrer">${esc(app.answers.social_url)}</a>`:'—'}</p></article>
            </div>
            <h3 style="margin-top:22px">Interest Map</h3>
            <div class="dcr-interest">${SPHERES.map(([id,title])=>`<div class="dcr-interest-row"><span>${title}</span><strong>${Number(interests[id]||0)}%</strong></div>`).join('')}</div>
          </section>
          <section class="dcr-panel">
            <h3>Review state</h3>
            <div class="dcr-review-state">${reviewRows}</div>
            <div class="dcr-review-form" data-review-form="${esc(app.id)}">
              <textarea placeholder="Внутренняя заметка. Кандидат её не видит." ${closed?'disabled':''}>${esc(own?.internal_note||'')}</textarea>
              <div class="dcr-actions">
                <button type="button" data-decision="approve" ${closed?'disabled':''}>ПОДТВЕРДИТЬ</button>
                <button type="button" data-decision="more_context" ${closed?'disabled':''}>НУЖЕН КОНТЕКСТ</button>
                <button type="button" data-decision="not_now" ${closed?'disabled':''}>ПОКА НЕТ</button>
              </div>
            </div>
          </section>
        </div>
        <section class="dcr-panel"><h3>Sphere Map / snapshot at submission</h3><div class="dcr-spheres">${sphereHtml}</div></section>
      </article>`;
    }

    function renderSphere(id,title,tags,entry){
      if(!entry)return `<article class="dcr-sphere"><div class="dcr-sphere-head"><h4>${title}</h4><strong class="dcr-level">—</strong></div><p>В snapshot нет результата.</p></article>`;
      const result=entry.result||{};
      const levels=Array.isArray(result.tagLevels)?result.tagLevels:[];
      const tagHtml=tags.map((tag,i)=>`<div class="dcr-tag"><span>#${esc(tag)}</span><strong>${Number(levels[i]??0)}</strong></div>`).join('');
      const data=sphereData[id];
      const answers=Array.isArray(entry.answers)?entry.answers:[];
      const answerHtml=data&&answers.length?answers.map((answer,i)=>{
        const q=data.questions?.[i];
        const chosen=q?.answers?.find(a=>Number(a.score)===Number(answer.score));
        return `<div class="dcr-answer"><small>${esc(q?.kind||answer.kind||`Q${i+1}`)} · SCORE ${Number(answer.score??0)}</small><p>${esc(chosen?.text||'Ответ сохранён как числовой score; текст варианта не найден в текущей версии вопроса.')}</p></div>`;
      }).join(''):'<div class="dcr-answer"><p>Подробные ответы для этого run не сохранены.</p></div>';
      return `<article class="dcr-sphere">
        <div class="dcr-sphere-head"><h4>${title}</h4><strong class="dcr-level">${Number(result.level??0)}</strong></div>
        <div class="dcr-axes"><span>INTENTIONALITY ${Number(result.intent??0)}</span><span>RESPONSIBILITY ${Number(result.responsibility??0)}</span><span>${fmt(entry.completed_at)}</span></div>
        <div class="dcr-tags">${tagHtml}</div>
        <details class="dcr-answers"><summary>ПОКАЗАТЬ ОТВЕТЫ</summary>${answerHtml}</details>
      </article>`;
    }

    function decisionLabel(value){
      return ({approve:'APPROVE',more_context:'MORE CONTEXT',not_now:'NOT NOW'})[value]||String(value||'—').toUpperCase();
    }
  }
}
