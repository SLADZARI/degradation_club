import {DC_SPHERES,esc,getClient,currentSession,loginWithGoogle,syncLocalAssessmentRuns,readSphereResults,getEntryStatus,errorMessage,route} from '/community-runtime-v1.js';
import {DC9_LEVEL_NAMES,DC9_RESULT_MODEL,presentationProminence} from '/join/result/result-model-v1.js';

const byId=new Map(DC9_RESULT_MODEL.map(x=>[x.id,x]));
const countEl=document.getElementById('resultCount');
const heroStamp=document.getElementById('heroStamp');
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

function clampLevel(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(5,Math.round(n))):null}
function clampGuard(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(3,Math.round(n))):null}
function point(cx,cy,r,index,total){const a=(-Math.PI/2)+(Math.PI*2*index/total);return[cx+Math.cos(a)*r,cy+Math.sin(a)*r]}
function polygonPoints(cx,cy,r,total,scale=1){return Array.from({length:total},(_,i)=>point(cx,cy,r*scale,i,total).join(',')).join(' ')}
function action(label,href,{primary=false,id=''}={}){return `<a ${id?`id="${id}"`:''} class="dc-result-action${primary?' primary':''}" href="${esc(href)}">${esc(label)}</a>`}
function button(label,id,{primary=false}={}){return `<button class="dc-result-action${primary?' primary':''}" type="button" id="${id}">${esc(label)}</button>`}

function itemFromResult(id,title,index,result){
  const model=byId.get(id)||{id,title,number:String(index+1).padStart(2,'0'),icon:'',tags:[],quips:[]};
  const level=result?clampLevel(result.level):null;
  return{...model,title,index,result:result||null,level,levelName:level==null?'Не обследовано':DC9_LEVEL_NAMES[level]||'Уровень зафиксирован',quip:level==null?'Эта сфера пока подозрительно цела.':model.quips?.[level]||'Результат зафиксирован.',tagLevels:Array.isArray(result?.tagLevels)?result.tagLevels.slice(0,4).map(v=>clampLevel(v)):[],intent:clampGuard(result?.intent),responsibility:clampGuard(result?.responsibility)};
}

function renderRadar(items,highlights,{dossier=false}={}){
  const W=760,H=760,cx=380,cy=380,r=245,total=items.length;
  const rings=[.2,.4,.6,.8,1].map(scale=>`<polygon class="dc-radar-grid" points="${polygonPoints(cx,cy,r,total,scale)}"/>`).join('');
  const axes=items.map((_,i)=>{const[x,y]=point(cx,cy,r,i,total);return `<line class="dc-radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`}).join('');
  const shape=items.map((item,i)=>point(cx,cy,r*((item.level??0)/5),i,total).join(',')).join(' ');
  const labels=dossier?'':items.map((item,i)=>{const[lx,ly]=point(cx,cy,r+58,i,total);const anchor=lx<cx-30?'end':lx>cx+30?'start':'middle';return `<text class="dc-radar-label" x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(item.title.toUpperCase())}</text><text class="dc-radar-level" x="${lx}" y="${ly+17}" text-anchor="${anchor}">${item.level==null?'—':item.level+'/5'}</text>`}).join('');
  const focus=highlights.map(item=>{const[x,y]=point(cx,cy,r*Math.max((item.level??0)/5,.08),item.index,total);return `<circle class="dc-radar-focus-dot" cx="${x}" cy="${y}" r="9"/>`}).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Карта девяти сфер DC-9">${rings}${axes}<polygon class="dc-radar-shape" points="${shape}"/>${labels}${focus}</svg>`;
}

function renderHighlightCard(item){
  return `<article class="dc-highlight-card"><div class="dc-highlight-top"><img class="dc-sphere-icon" src="${esc(route(item.icon))}" alt=""><strong>${esc(item.title)}</strong><b>${item.level}/5</b></div><div class="dc-level-name">${esc(item.levelName)}</div><p>${esc(item.quip)}</p></article>`;
}

function renderSphereCard(item){
  return `<article class="dc-sphere-card${item.result?'':' is-missing'}"><div class="dc-sphere-card__head"><img class="dc-sphere-icon" src="${esc(route(item.icon))}" alt=""><span class="dc-sphere-card__num">${esc(item.number)}</span><strong>${esc(item.title)}</strong><b>${item.level==null?'—':item.level+'/5'}</b></div><p>${esc(item.quip)}</p></article>`;
}

function renderAll(items){
  const completed=items.filter(x=>x.result&&x.level!=null);
  const highlights=presentationProminence(items);
  countEl.textContent=`${completed.length} / 9`;
  const done=completed.length===9;
  heroStamp.textContent=done?'ПРОТОКОЛ DC-9 ЗАВЕРШЁН.':'КАРТА ЕЩЁ СОБИРАЕТСЯ.';
  heroLead.textContent=done?'Девять сфер. Девять отдельных результатов. Никакого общего балла.':`Готово ${completed.length} из 9 сфер.`;
  radarStage.innerHTML=renderRadar(items,highlights);
  highlightGrid.innerHTML=highlights.map(renderHighlightCard).join('');
  const highlightedIds=new Set(highlights.map(x=>x.id));
  register.innerHTML=(done?items.filter(x=>!highlightedIds.has(x.id)):items).map(renderSphereCard).join('');
  dossierSection.hidden=!done;
  if(done){
    dossierRadar.innerHTML=renderRadar(items,highlights,{dossier:true});
    dossierRows.innerHTML=highlights.map(item=>`<div class="dc-dossier-row"><img class="dc-sphere-icon" src="${esc(route(item.icon))}" alt=""><strong>${esc(item.title)}</strong><b>${item.level}/5</b><p>${esc(item.quip)}</p></div>`).join('');
    wireDossier(items,highlights);
  }
  return{completed,done,highlights};
}

function bytesToBase64(bytes){let binary='';for(const b of bytes)binary+=String.fromCharCode(b);return btoa(binary)}
async function iconDataUri(path){const response=await fetch(route(path));if(!response.ok)throw new Error(`ICON_FETCH_${response.status}`);const text=await response.text();return `data:image/svg+xml;base64,${bytesToBase64(new TextEncoder().encode(text))}`}
function wrapText(text,maxChars){const words=String(text).split(/\s+/);const lines=[];let line='';for(const word of words){const next=line?`${line} ${word}`:word;if(next.length>maxChars&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line);return lines}

async function dossierSvg(items,highlights){
  const W=1080,H=1350,cx=540,cy=610,r=220,total=items.length;
  const rings=[.2,.4,.6,.8,1].map(scale=>`<polygon points="${polygonPoints(cx,cy,r,total,scale)}" fill="none" stroke="#111" stroke-opacity=".18" stroke-width="2"/>`).join('');
  const axes=items.map((_,i)=>{const[x,y]=point(cx,cy,r,i,total);return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#111" stroke-opacity=".18" stroke-width="2"/>`}).join('');
  const shape=items.map((item,i)=>point(cx,cy,r*((item.level??0)/5),i,total).join(',')).join(' ');
  const focus=highlights.map(item=>{const[x,y]=point(cx,cy,r*Math.max((item.level??0)/5,.08),item.index,total);return `<circle cx="${x}" cy="${y}" r="13" fill="#111"/>`}).join('');
  const icons=await Promise.all(highlights.map(x=>iconDataUri(x.icon)));
  const rows=highlights.map((item,rank)=>{const y=900+rank*115;const lines=wrapText(item.quip,43).slice(0,2);const tspans=lines.map((line,i)=>`<tspan x="430" dy="${i?30:0}">${esc(line)}</tspan>`).join('');return `<line x1="65" y1="${y-48}" x2="1015" y2="${y-48}" stroke="#111" stroke-opacity=".22"/><image href="${icons[rank]}" x="75" y="${y-28}" width="38" height="38"/><text x="135" y="${y}" font-family="Arial" font-size="29" font-weight="900" fill="#111">${esc(item.title.toUpperCase())}</text><text x="330" y="${y}" font-family="Arial" font-size="29" font-weight="900" fill="#111">${item.level}/5</text><text x="430" y="${y}" font-family="Arial" font-size="24" font-weight="800" fill="#111">${tspans}</text>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#f2f0e8"/><text x="65" y="72" font-family="Arial" font-size="30" font-weight="900" fill="#111">DEMENTOR CLUB / DC-9</text><rect x="65" y="105" width="470" height="92" fill="#d8ff3e"/><text x="80" y="170" font-family="Arial" font-size="62" font-weight="900" fill="#111">МОЯ КАРТА.</text>${rings}${axes}<polygon points="${shape}" fill="#d8ff3e" fill-opacity=".62" stroke="#111" stroke-width="5"/>${focus}${rows}<line x1="65" y1="1240" x2="1015" y2="1240" stroke="#111"/><text x="65" y="1285" font-family="Arial" font-size="20" font-weight="900" fill="#111">9 СФЕР / БЕЗ ОБЩЕГО БАЛЛА</text><text x="1015" y="1285" text-anchor="end" font-family="Arial" font-size="20" font-weight="900" fill="#111">DEMENTOR.CLUB</text></svg>`;
}

async function svgToPngFile(svgText){const blob=new Blob([svgText],{type:'image/svg+xml;charset=utf-8'});const url=URL.createObjectURL(blob);try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');ctx.fillStyle='#f2f0e8';ctx.fillRect(0,0,1080,1350);ctx.drawImage(img,0,0);const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png',.95));if(!png)throw new Error('PNG_EXPORT_FAILED');return new File([png],'dementor-dc9-dossier.png',{type:'image/png'})}finally{URL.revokeObjectURL(url)}}

function wireDossier(items,highlights){
  const download=document.getElementById('downloadDossier');const share=document.getElementById('shareDossier');if(!download||!share)return;
  const make=async()=>svgToPngFile(await dossierSvg(items,highlights));
  download.onclick=async()=>{download.disabled=true;shareNote.textContent='СОБИРАЕМ ДОСЬЕ…';try{const file=await make();const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);shareNote.textContent='ДОСЬЕ ГОТОВО.'}catch(error){shareNote.textContent='НЕ УДАЛОСЬ СОБРАТЬ ДОСЬЕ.';console.error(error)}finally{download.disabled=false}};
  share.onclick=async()=>{share.disabled=true;try{const file=await make();if(navigator.canShare?.({files:[file]}))await navigator.share({files:[file],title:'Моя карта DC-9',text:'Девять сфер. Никакого общего балла.'});else{const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)}}catch(error){if(error?.name!=='AbortError'){shareNote.textContent='ШАРИНГ НЕ ОТКРЫЛСЯ. СКАЧАЙТЕ ДОСЬЕ.';console.error(error)}}finally{share.disabled=false}};
}

function renderError(error){register.innerHTML=`<div class="dc-error"><strong>НЕ УДАЛОСЬ ПРОЧИТАТЬ КАРТУ</strong><code>${esc(errorMessage(error))}</code></div>`;radarStage.innerHTML='<div class="dc-error"><strong>ГЕОМЕТРИЯ НЕ СЛОЖИЛАСЬ.</strong></div>'}

async function boot(){
  let client=null,session=null;
  try{client=getClient();session=await currentSession(client);if(session)await syncLocalAssessmentRuns(client,session.user.id)}catch(error){console.warn('[DC9 result auth]',error)}
  const results=await readSphereResults(client,session?.user?.id||null);
  const items=DC_SPHERES.map(([id,title],index)=>itemFromResult(id,title,index,results[id]));
  const state=renderAll(items);
  if(!state.done){communityState.textContent='КАРТА НЕ ЗАВЕРШЕНА';nextTitle.innerHTML='СНАЧАЛА 9 / 9.';nextCopy.textContent=`Сейчас готово ${state.completed.length} из 9 сфер.`;nextActions.innerHTML=action('ПРОДОЛЖИТЬ DC-9',route('/join/'),{primary:true});return}
  if(!session){communityState.textContent='НУЖНА АВТОРИЗАЦИЯ';nextTitle.innerHTML='КАРТА ГОТОВА.<br>ЗАКРЕПИМ ЕЁ.';nextCopy.textContent='Войдите через Google, чтобы сохранить результаты и продолжить.';nextActions.innerHTML=button('ВОЙТИ И ПРОДОЛЖИТЬ →','resultLogin',{primary:true});document.getElementById('resultLogin').onclick=async event=>{const el=event.currentTarget;el.disabled=true;try{if(!client)client=getClient();await loginWithGoogle('/join/result/',client)}catch(error){el.disabled=false;nextCopy.textContent=errorMessage(error)}};return}
  const status=await getEntryStatus(client);
  if(status.membership_active){communityState.textContent=status.community_activation_state==='MEMBER_ACTIVATED'?'MEMBER ACTIVATED':'MEMBER ACTIVE';nextTitle.innerHTML=status.community_activation_state==='MEMBER_ACTIVATED'?'ВЫ УЖЕ ВНУТРИ.':'КАРТА ГОТОВА.<br>МОЖНО ВНУТРЬ.';nextCopy.textContent=status.community_activation_state==='MEMBER_ACTIVATED'?'Возвращайтесь к общей доске клуба.':'Следующий шаг — первый Artifact на общей доске.';nextActions.innerHTML=action('ОТКРЫТЬ COMMUNITY BOARD →',route('/community/board/'),{primary:true})}else{communityState.textContent='9 / 9 COMPLETE';nextTitle.innerHTML='КАРТА ГОТОВА.<br>МОЖНО ВНУТРЬ.';nextCopy.textContent='Оформите участие и переходите в Community.';nextActions.innerHTML=action('ПРОДОЛЖИТЬ В COMMUNITY →',route('/join/member/'),{primary:true})}
}

boot().catch(renderError);
