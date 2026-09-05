function n(v,d=0){const x=Number(v);return Number.isFinite(x)?x:d}

export function portraitEmotion({state={},reaction=null,isSpeaking=false,terminal=null,isLoser=false}={}){
  if(terminal&&isLoser)return 'defeated';
  const brain=n(state.brain),tension=n(state.tension),contact=n(state.contact,60),energy=n(state.energy,70);
  if(brain>=96||energy<=8)return 'meltdown';
  if(brain>=82||tension>=78)return 'heated';
  if(contact<=22||reaction==='pressure')return 'annoyed';
  if(isSpeaking&&(reaction==='explain'||reaction==='agree'))return 'confident';
  if(!isSpeaking)return 'listening';
  return 'neutral';
}

export const PORTRAIT_FACE_MAP=Object.freeze({
  neutral:['eyes-neutral','brows-neutral','mouth-neutral'],
  listening:['eyes-neutral','brows-neutral','mouth-neutral'],
  confident:['eyes-neutral','brows-neutral','mouth-soft'],
  annoyed:['eyes-tense','brows-tense','mouth-tense'],
  heated:['eyes-tense','brows-angry','mouth-open'],
  meltdown:['eyes-overheat','brows-angry','mouth-open'],
  defeated:['eyes-sleepy','brows-tense','mouth-tense']
});

function choose(root,prefix,id){root?.querySelectorAll?.(`[id^="${prefix}-"]`)?.forEach(el=>{el.style.opacity=el.id===id?'1':'0'})}
export function applyPortraitEmotion(root,emotion='neutral'){
  const [eyes,brows,mouth]=PORTRAIT_FACE_MAP[emotion]||PORTRAIT_FACE_MAP.neutral;
  choose(root,'eyes',eyes);choose(root,'brows',brows);choose(root,'mouth',mouth);
  const svg=root?.querySelector?.('svg');if(!svg)return emotion;
  svg.style.transform=emotion==='defeated'?'translateY(8px) rotate(-2deg)':emotion==='listening'?'rotate(1deg)':emotion==='meltdown'?'rotate(-1deg) scale(1.015)':'none';
  svg.style.opacity=emotion==='defeated'?'.62':'1';
  return emotion;
}
