import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.4/+esm';

const cfg=window.DEMENTOR_SITE_CONFIG?.supabase;
if(cfg?.enabled&&cfg.url&&cfg.publishableKey){
  const client=window.DEMENTOR_SUPABASE_CLIENT||createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,flowType:'pkce'}});
  window.DEMENTOR_SUPABASE_CLIENT=client;
  const {data:{session}}=await client.auth.getSession();
  const user=session?.user;
  if(user){
    const path=location.pathname;
    const upsertSignal=async row=>{const {error}=await client.from('dc_progress_signals').upsert(row,{onConflict:'profile_id,source_type,source_ref,stage_ref'});if(error)console.warn('[DC progress signal]',error)};
    const upsertCertificate=async row=>{const {error}=await client.from('dc_program_certificates').upsert(row,{onConflict:'profile_id,program_slug,certificate_type'});if(error)console.warn('[DC certificate]',error)};
    const certCode=slug=>`DC-${slug==='dumai-s-opasnostyu'?'DSP':'CERT'}-${user.id.replace(/-/g,'').slice(0,12).toUpperCase()}`;
    let lastFingerprint='';
    const syncValentin=async()=>{
      let s=null;try{s=JSON.parse(localStorage.getItem('dementor_dumai_course_stage1')||'null')}catch{}
      if(!s)return;
      const d1=s.dayResults?.day1;
      const fingerprint=JSON.stringify([d1,s.status,s.completedAt]);if(fingerprint===lastFingerprint)return;lastFingerprint=fingerprint;
      if(d1)await upsertSignal({profile_id:user.id,source_type:'program',source_ref:'dumai-s-opasnostyu',stage_ref:'day1',degradation_level:null,level_label:`УВЕРЕННОСТЬ ${d1.from}% → ${d1.to}%`,payload:{metric:'confidence',from:d1.from,to:d1.to,delta:d1.delta,title:d1.title,explanation:d1.explanation,details:d1.details||{}}});
      if(s.status==='completed'||s.completedAt)await upsertCertificate({profile_id:user.id,program_slug:'dumai-s-opasnostyu',certificate_type:'completion',certificate_title:'Сертификат повышенной подозрительности',certificate_code:certCode('dumai-s-opasnostyu'),result_json:{class:'Опасно думающий гражданин I класса',initial_confidence:s.initialConfidence,final_confidence:s.currentConfidence,final_decision:s.finalDecision||null,completed_at:s.completedAt||new Date().toISOString()}});
    };
    const syncNikita=async()=>{
      let s=null;try{s=JSON.parse(localStorage.getItem('dc:dengi-na-veter:v01')||'null')}catch{}
      if(!s||!Array.isArray(s.history)||!s.history.length)return;
      const first=s.history[0];const fingerprint=JSON.stringify([s.history.length,s.excuses,first?.at]);if(fingerprint===lastFingerprint)return;lastFingerprint=fingerprint;
      const level=s.excuses>=5?'ВЫСОКАЯ':s.excuses>=2?'СРЕДНЯЯ':'НЕИЗВЕСТНА';
      await upsertSignal({profile_id:user.id,source_type:'program',source_ref:'dengi-na-veter',stage_ref:'first-run',degradation_level:null,level_label:`УСТОЙЧИВОСТЬ ЛОГИКИ: ${level}`,payload:{metric:'logic_resistance',attempt:s.attempt,excuses:s.excuses,answers:s.history.length,first_answer_at:first?.at||null}});
    };
    const sync=()=>path.includes('/courses/dumai-s-opasnostyu/')?syncValentin():path.includes('/courses/dengi-na-veter/')?syncNikita():Promise.resolve();
    await sync();setInterval(sync,1500);window.addEventListener('storage',sync);
  }
}
