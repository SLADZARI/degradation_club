import {DC_SPHERES,esc,getClient,currentSession,syncLocalAssessmentRuns,readSphereResults,getEntryStatus,errorMessage,route} from '/community-runtime-v1.js';
import {DC9_LEVEL_NAMES,DC9_RESULT_MODEL,presentationProminence} from '/join/result/result-model-v2.js';

const byId=new Map(DC9_RESULT_MODEL.map(x=>[x.id,x]));
const countEl=document.getElementById('resultCount');
const heroStamp=document.getElementById('heroStamp');
const heroTitle=document.getElementById('heroTitle');
const heroLead=document.getElementById('heroLead');
const radarStage=document.getElementById('radarStage');
const highlightGrid=document.getElementById('highlightGrid');
const register=document.getElementById('sphereRegister');
const dossierSection=document.getElementById('dossierSection');
const dossierRadar=document.getElementById('dossierRadar');
const dossierRows=document.getElementById('dossierRows');
const shareNote=document.getElementById('shareNote');
const nextTitle=document.getElementById('nextTitle');
const nextCopy=document.getElementById('nextCopy');
const nextActions=document.getElementById('nextActions');
const communityState=document.getElementById('communityState');

const SCORING_V09=Object.freeze({
  thresholds:[0.35,0.95,1.30,1.70,2.15],
  spheres:{
    personality:{weights:[1.00,1.50,1.50,1.00],core:[1,2]},
    work:{weights:[1.25,1.50,1.25,1.50],core:[1,3]},
    consumption:{weights:[1.25,1.50,1.00,1.25],core:[0,1]},
    relationships:{weights:[1.50,1.25,1.50,1.25],core:[0,2]},
    control:{weights:[1.00,1.25,1.25,1.50],core:[2,3]},
    information:{weights:[1.00,1.25,1.50,1.50],core:[2,3]},
    self_development:{weights:[1.25,1.50,1.50,1.00],core:[1,2]},
    meaning:{weights:[1.00,1.25,1.25,1.50],core:[1,3]},
    technology:{weights:[1.25,1.50,1.25,1.50],core:[1,3]}
  }
});

function clampLevel(value){if(value===null||value===undefined||value==='')return null;const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(5,Math.round(n))):null}
function clampGuard(value){if(value===null||value===undefined||value==='')return null;const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(3,Math.round(n))):null}
function clampScore(value){if(value===null||value===undefined||value==='')return null;const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(3,Math.round(n))):null}
function point(cx,cy,r,index,total){const a=(-Math.PI/2)+(Math.PI*2*index/total);return[cx+Math.cos(a)*r,cy+Math.sin(a)*r]}
function polygonPoints(cx,cy,r,total,scale=1){return Array.from({length:total},(_,i)=>point(cx,cy,r*scale,i,total).join(',')).join(' ')}
function action(label,href,{primary=false,id=''}={}){return `<a ${id?`id="${id}"`:''} class="dc-result-action${primary?' primary':''}" href="${esc(href)}">${esc(label)}</a>`}

function levelFromWeightedAverage(avg){
  const t=SCORING_V09.thresholds;
  if(avg<t[0])return 0;
  if(avg<t[1])return 1;
  if(avg<t[2])return 2;
  if(avg<t[3])return 3;
  if(avg<t[4])return 4;
  return 5;
}
function guardCap(intent,responsibility){
  if(responsibility===0)return 2;
  if(intent===0)return 3;
  if(responsibility===1||intent===1)return 4;
  return 5;
}
function scoreFromLegacyTagLevel(value){
  const level=clampLevel(value);
  return level==null?null:Math.max(0,Math.min(3,Math.round((level/5)*3)));
}
function scoringFromEvidence(id,result){
  const cfg=SCORING_V09.spheres[id];
  if(!cfg||!result)return null;
  let scores=[];
  if(Array.isArray(result.tagScores)&&result.tagScores.length>=4)scores=result.tagScores.slice(0,4).map(clampScore);
  else if(Array.isArray(result.tagLevels)&&result.tagLevels.length>=4)scores=result.tagLevels.slice(0,4).map(scoreFromLegacyTagLevel);
  if(scores.length<4||scores.some(x=>x==null))return null;
  const intent=clampGuard(result.intent),responsibility=clampGuard(result.responsibility);
  if(intent==null||responsibility==null)return null;
  const totalWeight=cfg.weights.reduce((a,b)=>a+b,0);
  const weightedAverage=scores.reduce((sum,score,i)=>sum+score*cfg.weights[i],0)/totalWeight;
  let base=levelFromWeightedAverage(weightedAverage);
  if(base===5&&cfg.core.some(i=>scores[i]<2))base=4;
  const cap=guardCap(intent,responsibility);
  return{level:Math.min(base,cap),base,cap,weightedAverage,scores,intent,responsibility};
}

function itemFromResult(id,title,index,result){
  const model=byId.get(id)||{id,title,number:String(index+1).padStart(2,'0'),icon:'',tags:[],quips:[]};
  const scored=scoringFromEvidence(id,result);
  const storedLevel=result?clampLevel(result.level):null;
  const level=scored?.level??storedLevel;
  return{...model,title,index,result:result||null,level,levelName:level==null?'Не обследовано':DC9_LEVEL_NAMES[level]||'Уровень зафиксирован',quip:level==null?'Эта сфера пока подозрительно цела.':model.quips?.[level]||'Результат зафиксирован.',tagLevels:Array.isArray(result?.tagLevels)?result.tagLevels.slice(0,4).map(v=>clampLevel(v)):[],intent:scored?.intent??clampGuard(result?.intent),responsibility:scored?.responsibility??clampGuard(result?.responsibility),scoring:scored};
}

function radarSvg(items,highlights,{dossier=false}={}){
  const W=820,H=820,cx=410,cy=410,r=252,total=items.length,labelR=r+76;
  const highlightIds=new Set(highlights.map(x=>x.id));
  const rings=[.2,.4,.6,.8,1].map((scale,i)=>`<polygon class="dc-radar-grid" points="${polygonPoints(cx,cy,r,total,scale)}"/><text class="dc-radar-ring-label" x="${cx+10}" y="${cy-r*scale+4}">${i+1}</text>`).join('');
  const axes=items.map((_,i)=>{const[x,y]=point(cx,cy,r,i,total);return `<line class="dc-radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`}).join('');
  const shape=items.map((item,i)=>point(cx,cy,r*((item.level??0)/5),i,total).join(',')).join(' ');
  const nodes=items.map((item,i)=>{const level=item.level??0;const[x,y]=point(cx,cy,r*(level/5),i,total);const hi=highlightIds.has(item.id);return `${hi?`<circle class="dc-radar-focus-halo" cx="${x}" cy="${y}" r="13"/>`:''}<circle class="dc-radar-node${hi?' is-highlight':''}" cx="${x}" cy="${y}" r="5"/>`}).join('');
  const labels=dossier?'':items.map((item,i)=>{const[lx,ly]=point(cx,cy,labelR,i,total);const anchor=lx<cx-36?'end':lx>cx+36?'start':'middle';const yOffset=ly<cy-220?-7:ly>cy+220?8:0;return `<text class="dc-radar-label" x="${lx}" y="${ly+yOffset}" text-anchor="${anchor}">${esc(item.title.toUpperCase())}</text><text class="dc-radar-level" x="${lx}" y="${ly+yOffset+17}" text-anchor="${anchor}">${item.level==null?'—':item.level+'/5'}</text>`}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Карта девяти независимых сфер DC-9. Центр — ноль, внешний контур — пять.">${rings}${axes}<polygon class="dc-radar-shape" points="${shape}"/>${nodes}${labels}<circle class="dc-radar-center" cx="${cx}" cy="${cy}" r="3"/><text class="dc-radar-zero" x="${cx+9}" y="${cy+4}">0</text></svg>`;
}
function mobileLegend(items,highlights){
  const highlightIds=new Set(highlights.map(x=>x.id));
  return `<div class="dc-radar-mobile-legend" aria-label="Результаты девяти сфер">${items.map(item=>`<div class="dc-radar-mobile-legend__item${highlightIds.has(item.id)?' is-highlight':''}"><img class="dc-sphere-icon" src="${esc(route(item.icon))}" alt=""><span class="dc-radar-mobile-legend__title">${esc(item.title)}</span><span class="dc-radar-mobile-legend__level">${item.level==null?'—':item.level+'/5'}</span></div>`).join('')}</div>`;
}
function renderRadar(items,highlights,{dossier=false}={}){
  const svg=radarSvg(items,highlights,{dossier});
  if(dossier)return svg;
  return `<div class="dc-radar-v6">${svg}<p class="dc-radar-scale-note">ЦЕНТР — 0 · ВНЕШНИЙ КОНТУР — 5 · ПЛОЩАДЬ ФИГУРЫ НИЧЕГО НЕ СЧИТАЕТ</p>${mobileLegend(items,highlights)}</div>`;
}

function renderHighlightCard(item){
  return `<article class="dc-highlight-card"><div class="dc-highlight-label">ВЫДЕЛЕНО ДЛЯ КОНТРАСТА</div><div class="dc-highlight-top"><img class="dc-sphere-icon" src="${esc(route(item.icon))}" alt=""><strong>${esc(item.title)}</strong><b>${item.level}/5</b></div><div class="dc-level-name">${esc(item.levelName)}</div><p>${esc(item.quip)}</p></article>`;
}
function renderSphereCard(item){
  return `<article class="dc-sphere-card${item.result?'':' is-missing'}"><div class="dc-sphere-card__head"><img class="dc-sphere-icon" src="${esc(route(item.icon))}" alt=""><strong>${esc(item.title)}</strong><b>${item.level==null?'—':item.level+'/5'}</b></div><div class="dc-level-name">${esc(item.levelName)}</div><p>${esc(item.quip)}</p></article>`;
}

function renderAll(items){
  const completed=items.filter(x=>x.result&&x.level!=null);
  const highlights=presentationProminence(items);
  const done=completed.length===9;
  const allFive=done&&items.every(x=>x.level===5);
  countEl.textContent=`${completed.length} / 9`;
  if(allFive){
    heroStamp.textContent='9 / 9 · ПОКАЗАНО ДЕМЕНТОРСТВО';
    heroTitle.innerHTML='К ДЕМЕНТОРСТВУ<br><span class="dc-acid-word">ГОТОВ.</span>';
    heroLead.innerHTML='Девять из девяти.<br>Дальнейшая диагностика не требуется.<br>Срочно в клуб.';
  }else{
    heroStamp.textContent=done?'DC-9 ПРОЙДЕН':'КАРТА ЕЩЁ СОБИРАЕТСЯ.';
    heroTitle.innerHTML='ВОТ ВАША<br><span class="dc-acid-word">КАРТА.</span>';
    heroLead.innerHTML=done?'Девять сфер.<br>Девять отдельных результатов.<br>Общего балла нет.':`Готово ${completed.length} из 9 сфер.`;
  }
  radarStage.innerHTML=renderRadar(items,highlights);
  highlightGrid.innerHTML=highlights.map(renderHighlightCard).join('');
  const highlightedIds=new Set(highlights.map(x=>x.id));
  register.innerHTML=(done?items.filter(x=>!highlightedIds.has(x.id)):items).map(renderSphereCard).join('');
  dossierSection.hidden=!done;
  if(done){
    dossierRadar.innerHTML=renderRadar(items,highlights,{dossier:true});
    dossierRows.innerHTML=highlights.map(item=>`<div class="dc-dossier-row"><img class="dc-sphere-icon" src="${esc(route(item.icon))}" alt=""><strong>${esc(item.title)}</strong><b>${item.level}/5</b><p>${esc(item.quip)}</p></div>`).join('');
    wireDossier(items,highlights,allFive);
  }
  return{completed,done,highlights,allFive};
}

function bytesToBase64(bytes){let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary)}
async function iconDataUri(path){const response=await fetch(route(path));if(!response.ok)throw new Error(`ICON_FETCH_${response.status}`);const text=await response.text();return `data:image/svg+xml;base64,${bytesToBase64(new TextEncoder().encode(text))}`}
function wrapText(text,maxChars){const words=String(text).split(/\s+/);const lines=[];let line='';for(const word of words){const next=line?`${line} ${word}`:word;if(next.length>maxChars&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line);return lines}

async function dossierSvg(items,highlights,allFive=false){
  const W=1080,H=1350,cx=540,cy=605,r=220,total=items.length;
  const highlightIds=new Set(highlights.map(x=>x.id));
  const rings=[.2,.4,.6,.8,1].map(scale=>`<polygon points="${polygonPoints(cx,cy,r,total,scale)}" fill="none" stroke="#111" stroke-opacity=".18" stroke-width="2"/>`).join('');
  const axes=items.map((_,i)=>{const[x,y]=point(cx,cy,r,i,total);return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#111" stroke-opacity=".18" stroke-width="2"/>`}).join('');
  const shape=items.map((item,i)=>point(cx,cy,r*((item.level??0)/5),i,total).join(',')).join(' ');
  const nodes=items.map((item,i)=>{const[x,y]=point(cx,cy,r*((item.level??0)/5),i,total);const hi=highlightIds.has(item.id);return `${hi?`<circle cx="${x}" cy="${y}" r="13" fill="#d8ff3e" stroke="#111" stroke-width="2"/>`:''}<circle cx="${x}" cy="${y}" r="5" fill="#111"/>`}).join('');
  const icons=await Promise.all(highlights.map(x=>iconDataUri(x.icon)));
  const rows=highlights.map((item,rank)=>{const y=900+rank*115;const lines=wrapText(item.quip,43).slice(0,2);const tspans=lines.map((line,i)=>`<tspan x="430" dy="${i?30:0}">${esc(line)}</tspan>`).join('');return `<line x1="65" y1="${y-48}" x2="1015" y2="${y-48}" stroke="#111" stroke-opacity=".22"/><image href="${icons[rank]}" x="75" y="${y-28}" width="38" height="38"/><text x="135" y="${y}" font-family="Arial" font-size="29" font-weight="900" fill="#111">${esc(item.title.toUpperCase())}</text><text x="330" y="${y}" font-family="Arial" font-size="29" font-weight="900" fill="#111">${item.level}/5</text><text x="430" y="${y}" font-family="Arial" font-size="24" font-weight="800" fill="#111">${tspans}</text>`}).join('');
  const title=allFive?'К ДЕМЕНТОРСТВУ ГОТОВ.':'МОЯ КАРТА.';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#f2f0e8"/><text x="65" y="72" font-family="Arial" font-size="30" font-weight="900" fill="#111">DEMENTOR CLUB / DC-9</text><rect x="65" y="105" width="${allFive?750:470}" height="92" fill="#d8ff3e"/><text x="80" y="170" font-family="Arial" font-size="${allFive?49:62}" font-weight="900" fill="#111">${title}</text>${rings}${axes}<polygon points="${shape}" fill="#d8ff3e" fill-opacity=".42" stroke="#111" stroke-width="5"/>${nodes}${rows}<line x1="65" y1="1240" x2="1015" y2="1240" stroke="#111"/><text x="65" y="1285" font-family="Arial" font-size="20" font-weight="900" fill="#111">9 СФЕР / БЕЗ ОБЩЕГО БАЛЛА</text><text x="1015" y="1285" text-anchor="end" font-family="Arial" font-size="20" font-weight="900" fill="#111">DEMENTOR.CLUB</text></svg>`;
}
async function svgToPngFile(svgText){const blob=new Blob([svgText],{type:'image/svg+xml;charset=utf-8'});const url=URL.createObjectURL(blob);try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');ctx.fillStyle='#f2f0e8';ctx.fillRect(0,0,1080,1350);ctx.drawImage(img,0,0);const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png',.95));if(!png)throw new Error('PNG_EXPORT_FAILED');return new File([png],'dementor-dc9-dossier.png',{type:'image/png'})}finally{URL.revokeObjectURL(url)}}
function wireDossier(items,highlights,allFive){
  const download=document.getElementById('downloadDossier'),share=document.getElementById('shareDossier');if(!download||!share)return;
  const make=async()=>svgToPngFile(await dossierSvg(items,highlights,allFive));
  download.onclick=async()=>{download.disabled=true;shareNote.textContent='СОБИРАЕМ КАРТУ…';try{const file=await make();const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);shareNote.textContent='КАРТА ГОТОВА.'}catch(error){shareNote.textContent='НЕ УДАЛОСЬ СОБРАТЬ КАРТУ.';console.error(error)}finally{download.disabled=false}};
  share.onclick=async()=>{share.disabled=true;try{const file=await make();if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'Моя карта DC-9',text:allFive?'К дементорству готов. Девять из девяти.':'Девять сфер. Общего балла нет.'});else{const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)}}catch(error){if(error?.name!=='AbortError'){shareNote.textContent='ШАРИНГ НЕ ОТКРЫЛСЯ. СКАЧАЙТЕ КАРТУ.';console.error(error)}}finally{share.disabled=false}};
}
function renderError(error){register.innerHTML=`<div class="dc-error"><strong>НЕ УДАЛОСЬ ПРОЧИТАТЬ КАРТУ</strong><code>${esc(errorMessage(error))}</code></div>`;radarStage.innerHTML='<div class="dc-error"><strong>ГЕОМЕТРИЯ НЕ СЛОЖИЛАСЬ.</strong></div>'}

async function boot(){
  let client=null,session=null;
  try{client=getClient();session=await currentSession(client);if(session)await syncLocalAssessmentRuns(client,session.user.id)}catch(error){console.warn('[DC9 result auth]',error)}
  const results=await readSphereResults(client,session?.user?.id||null);
  const items=DC_SPHERES.map(([id,title],index)=>itemFromResult(id,title,index,results[id]));
  const state=renderAll(items);
  if(!state.done){communityState.textContent='КАРТА НЕ ЗАВЕРШЕНА';nextTitle.innerHTML='СНАЧАЛА 9 / 9.';nextCopy.textContent=`Сейчас готово ${state.completed.length} из 9 сфер.`;nextActions.innerHTML=action('ПРОДОЛЖИТЬ DC-9',route('/join/'),{primary:true});return}
  if(session){
    const status=await getEntryStatus(client);
    if(status.membership_active){communityState.textContent=status.community_activation_state==='MEMBER_ACTIVATED'?'MEMBER ACTIVATED':'MEMBER ACTIVE';nextTitle.innerHTML=status.community_activation_state==='MEMBER_ACTIVATED'?'ВЫ УЖЕ ВНУТРИ.':'КАРТА ГОТОВА.<br>МОЖНО ВНУТРЬ.';nextCopy.textContent=status.community_activation_state==='MEMBER_ACTIVATED'?'Возвращайтесь к общей доске клуба.':'Следующий шаг — первый Artifact на общей доске.';nextActions.innerHTML=action('ОТКРЫТЬ COMMUNITY BOARD →',route('/workspace/board/'),{primary:true});return}
  }
  if(state.allFive){communityState.textContent='9 / 9 · ПОКАЗАНО ДЕМЕНТОРСТВО';nextTitle.innerHTML='К ДЕМЕНТОРСТВУ ГОТОВ.<br>СРОЧНО В КЛУБ.';nextCopy.textContent='Девять из девяти. Дальнейшая диагностика не требуется.';nextActions.innerHTML=action('ВСТУПИТЬ В КЛУБ →',route('/join/apply/'),{primary:true})}
  else{communityState.textContent='9 / 9';nextTitle.innerHTML='КАРТА ГОТОВА.<br>ДАЛЬШЕ — ПО ЖЕЛАНИЮ.';nextCopy.textContent='Карта ничего не назначает и никуда не зачисляет. Если хочется продолжить — можно оформить участие и зайти в клуб.';nextActions.innerHTML=action('ВСТУПИТЬ В КЛУБ →',route('/join/apply/'),{primary:true})}
}
boot().catch(renderError);
