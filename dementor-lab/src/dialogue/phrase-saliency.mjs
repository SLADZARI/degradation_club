import { PHRASE_BANK, resolvePhrase } from './phrase-bank.mjs';

function hash(input=''){
  let h=2166136261;
  for(const ch of String(input)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return h>>>0;
}

function recentPhrases(recentTranscript=[]){return recentTranscript.map(x=>x.phrase).filter(Boolean)}
function inflect(text,gender='male'){
  const female=gender==='female';
  const forms={agree:female?'согласна':'согласен',Agree:female?'Согласна':'Согласен',understood:female?'поняла':'понял'};
  return String(text||'').replace(/\{\{(agree|Agree|understood)\}\}/g,(_,key)=>forms[key]||'');
}

export function resolveSalientPhrase(context={}){
  const preferred=resolvePhrase(context);
  const recent=recentPhrases(context.recentTranscript||[]);
  if(!recent.includes(preferred))return preferred;

  const reaction=context.reaction||'silent';
  const list=PHRASE_BANK[reaction]||PHRASE_BANK.silent;
  if(list.length<2)return preferred;

  const scores=list.map((raw,index)=>{
    const text=inflect(raw,context.gender);
    const age=[...recent].reverse().findIndex(x=>x===text);
    const recentPenalty=age<0?0:Math.max(1,6-age)*20;
    const deterministicTie=hash([reaction,context.impulse||'',context.scenario?.id||'',context.turn||0,index].join('|'))%17;
    return {text,score:100-recentPenalty+deterministicTie};
  });
  scores.sort((a,b)=>b.score-a.score||a.text.localeCompare(b.text));
  return scores[0]?.text||preferred;
}
