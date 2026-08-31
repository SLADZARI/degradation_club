import {DC_SPHERES,esc,formatDate,getClient,currentSession,loginWithGoogle,syncLocalAssessmentRuns,readSphereResults,getEntryStatus,errorMessage,route} from '/community-runtime-v1.js';

const register=document.getElementById('sphereRegister');
const countEl=document.getElementById('resultCount');
const lead=document.getElementById('heroLead');
const nextTitle=document.getElementById('nextTitle');
const nextCopy=document.getElementById('nextCopy');
const nextActions=document.getElementById('nextActions');
const radarStage=document.getElementById('radarStage');
const inspector=document.getElementById('sphereInspector');
const verdictTitle=document.getElementById('verdictTitle');
const verdictCopy=document.getElementById('verdictCopy');
const clubNote=document.getElementById('clubNote');
const clubNoteText=document.getElementById('clubNoteText');
const shareActions=document.getElementById('shareActions');
const shareNote=document.getElementById('shareNote');

const QUIPS=[
  ['тишина. даже подозрительно.','что-то есть. пока не трогаем.','работает без лишнего шума.','уже заметно. можно пользоваться.','сильная сторона. не испортьте.','официально вышло из-под контроля.'],
  ['здесь пустовато. зато честно.','есть признаки жизни.','держится. уже неплохо.','система отвечает.','серьёзный инструмент.','опасная концентрация ресурса.'],
  ['не найдено. объявим розыск.','где-то рядом, но не здесь.','нормальный человеческий минимум.','уверенно присутствует.','заметно из соседней комнаты.','слишком много. клуб одобряет с опаской.']
];

function clampLevel(value){const n=Number(value??0);return Number.isFinite(n)?Math.max(0,Math.min(5,n)):0}
function quip(level,index){return QUIPS[index%QUIPS.length][Math.round(clampLevel(level))]}
function action(label,href,{primary=false,id=''}={}){return `<a ${id?`id="${id}"`:''} class="dc-result-action${primary?' primary':''}" href="${esc(href)}">${esc(label)}</a>`}
function renderError(error){register.innerHTML=`<div class="dc-error"><strong>НЕ УДАЛОСЬ ПРОЧИТАТЬ КАРТУ</strong><code>${esc(errorMessage(error))}</code></div>`;radarStage.innerHTML='<div class="dc-error"><strong>ГЕОМЕТРИЯ НЕ СЛОЖИЛАСЬ.</strong></div>'}

function point(cx,cy,r,index,total){const a=(-Math.PI/2)+(Math.PI*2*index/total);return [cx+Math.cos(a)*r,cy+Math.sin(a)*r]}
function polygonPoints(cx,cy,r,total,scale=1){return Array.from({length:total},(_,i)=>point(cx,cy,r*scale,i,total).join(',')).join(' ')}

function makeVerdict(items){
  const complete=items.filter(item=>item.result);
  if(complete.length<9)return {title:'ЕЩЁ НЕ ДОСМОТРЕЛИ.',copy:'Часть улик отсутствует. Возвращайтесь в DC-9 — допрос продолжается.'};
  const highs=complete.filter(item=>item.level>=4).length;
  const lows=complete.filter(item=>item.level<=1).length;
  const max=Math.max(...complete.map(item=>item.level));
  const min=Math.min(...complete.map(item=>item.level));
  if(highs>=4&&lows>=2)return {title:'СТРУКТУРНО НЕСТАБИЛЕН.',copy:'Сильного много. Слабого тоже. Отличный материал для клуба.'};
  if(highs>=5)return {title:'ПОДОЗРИТЕЛЬНО СПОСОБЕН.',copy:'Слишком много работающих сфер. Мы бы проверили документы.'};
  if(lows>=4)return {title:'НЕРАВНОДУШНО РАЗОБРАН.',copy:'Есть куда лезть руками. Наконец-то нормальный человек.'};
  if(max-min>=4)return {title:'КРАЙНЕ НЕРАВНОМЕРЕН.',copy:'Ваш профиль отказался быть аккуратным. Это хороший знак.'};
  return {title:'ПОТЕНЦИАЛЬНО ОПАСЕН.',copy:'Ничего катастрофического. Именно поэтому мы пока наблюдаем.'};
}

function makeRecommendation(items){
  const complete=items.filter(item=>item.result).sort((a,b)=>a.level-b.level);
  if(complete.length<9)return '';
  const weak=complete.slice(0,2);
  const strong=[...complete].sort((a,b)=>b.level-a.level)[0];
  return `СФОКУСИРУЙТЕСЬ НА «${weak[0].title}» И «${weak[1].title}». А «${strong.title}» ПОКА НЕ ТРОГАЙТЕ — ХОТЬ ЧТО-ТО УЖЕ РАБОТАЕТ.`;
}

function renderInspector(item){
  inspector.innerHTML=`<span class="dc-inspector__meta">СФЕРА ${String(item.index+1).padStart(2,'0')} / ${item.result?`${item.level} ИЗ 5`:'НЕ ОБСЛЕДОВАНО'}</span><strong>${esc(item.title)}</strong><p>${item.result?esc(quip(item.level,item.index)):'Эта часть карты пока молчит. Возможно, из принципа.'}</p>`;
  radarStage.querySelectorAll('.dc-radar-node').forEach(node=>node.classList.toggle('is-active',Number(node.dataset.index)===item.index));
}

function renderRadar(items){
  const complete=items.filter(item=>item.result);
  if(!complete.length){radarStage.innerHTML='<div class="dc-state">ПОКА НЕЧЕГО РИСОВАТЬ.</div>';return}
  const W=760,H=760,cx=380,cy=380,r=250,total=items.length;
  const rings=[.2,.4,.6,.8,1].map(scale=>`<polygon class="dc-radar-grid" points="${polygonPoints(cx,cy,r,total,scale)}"/>`).join('');
  const axes=items.map((_,i)=>{const [x,y]=point(cx,cy,r,i,total);return `<line class="dc-radar-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`}).join('');
  const shape=items.map((item,i)=>{const scale=item.result?clampLevel(item.level)/5:0;return point(cx,cy,r*scale,i,total).join(',')}).join(' ');
  const nodes=items.map((item,i)=>{
    const scale=item.result?clampLevel(item.level)/5:0;
    const [x,y]=point(cx,cy,r*scale,i,total);
    const [lx,ly]=point(cx,cy,r+70,i,total);
    const anchor=lx<cx-30?'end':lx>cx+30?'start':'middle';
    return `<g><circle class="dc-radar-node" data-index="${i}" tabindex="0" role="button" aria-label="${esc(item.title)}: ${item.result?`${item.level} из 5`:'не обследовано'}" cx="${x}" cy="${y}" r="11"/><text class="dc-radar-label" x="${lx}" y="${ly}" text-anchor="${anchor}">${esc(item.title.toUpperCase())}</text><text class="dc-radar-level" x="${lx}" y="${ly+20}" text-anchor="${anchor}">${item.result?`${item.level}/5`:'—'}</text></g>`;
  }).join('');
  radarStage.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Карта девяти сфер DC-9">${rings}${axes}<polygon class="dc-radar-shape" points="${shape}"/>${nodes}</svg>`;
  radarStage.querySelectorAll('.dc-radar-node').forEach(node=>{
    const open=()=>renderInspector(items[Number(node.dataset.index)]);
    node.addEventListener('click',open);
    node.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open()}});
  });
}

function shareCardSvg(items,verdict){
  const W=1080,H=1350,cx=540,cy=650,r=270,total=items.length;
  const rings=[.2,.4,.6,.8,1].map(scale=>`<polygon points="${polygonPoints(cx,cy,r,total,scale)}" fill="none" stroke="#111" stroke-opacity=".18" stroke-width="2"/>`).join('');
  const axes=items.map((_,i)=>{const [x,y]=point(cx,cy,r,i,total);return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#111" stroke-opacity=".18" stroke-width="2"/>`}).join('');
  const shape=items.map((item,i)=>point(cx,cy,r*((item.result?clampLevel(item.level):0)/5),i,total).join(',')).join(' ');
  const labels=items.map((item,i)=>{const [x,y]=point(cx,cy,r+70,i,total);const anchor=x<cx-30?'end':x>cx+30?'start':'middle';return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-weight="800" font-size="20" fill="#111">${esc(item.title.toUpperCase())} ${item.result?item.level+'/5':'—'}</text>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#f2f0e8"/><text x="70" y="90" font-family="Arial, sans-serif" font-weight="900" font-size="34" fill="#111">DEMENTOR CLUB / DC-9</text><rect x="70" y="130" width="500" height="150" fill="#d8ff3e"/><text x="88" y="205" font-family="Arial, sans-serif" font-weight="900" font-size="68" fill="#111">КАРТА СОБРАНА.</text><text x="70" y="340" font-family="Arial, sans-serif" font-weight="900" font-size="50" fill="#111">${esc(verdict.title)}</text>${rings}${axes}<polygon points="${shape}" fill="#d8ff3e" fill-opacity=".6" stroke="#111" stroke-width="5"/>${labels}<text x="70" y="1260" font-family="Arial, sans-serif" font-weight="700" font-size="24" fill="#111">9 СФЕР. НИКАКОГО СРЕДНЕГО БАЛЛА.</text><text x="1010" y="1260" text-anchor="end" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#111">DEMENTOR.CLUB</text></svg>`;
}

async function svgToPngFile(svgText){
  const blob=new Blob([svgText],{type:'image/svg+xml;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  try{
    const img=new Image();
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
    const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,1080,1350);
    const png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png',.95));
    return new File([png],'dementor-dc9-map.png',{type:'image/png'});
  }finally{URL.revokeObjectURL(url)}
}

function wireShare(items,verdict){
  shareActions.hidden=false;
  const make=()=>svgToPngFile(shareCardSvg(items,verdict));
  document.getElementById('downloadMap').onclick=async event=>{
    const button=event.currentTarget;button.disabled=true;button.textContent='СОБИРАЕМ PNG…';
    try{const file=await make();const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);shareNote.textContent='Карта собрана. Можно не оправдываться.'}catch{shareNote.textContent='Не удалось собрать PNG. Карта остаётся на месте.'}finally{button.disabled=false;button.textContent='СКАЧАТЬ КАРТУ'}
  };
  document.getElementById('shareMap').onclick=async event=>{
    const button=event.currentTarget;button.disabled=true;
    try{const file=await make();if(navigator.canShare?.({files:[file]})){await navigator.share({files:[file],title:'Моя карта DC-9',text:'9 сфер. Никакого среднего балла.'})}else{await navigator.clipboard?.writeText(location.href);shareNote.textContent='Ссылка скопирована. PNG можно скачать рядом.'}}catch(error){if(error?.name!=='AbortError')shareNote.textContent='Шаринг не открылся. Скачайте PNG вручную.'}finally{button.disabled=false}
  };
}

async function boot(){
  const client=getClient();
  const session=await currentSession(client);
  if(session)await syncLocalAssessmentRuns(client,session.user.id);
  const results=await readSphereResults(client,session?.user?.id||null);
  const items=DC_SPHERES.map(([id,title],index)=>{const result=results[id];return {id,title,index,result,level:result?clampLevel(result.level):0}});
  const completed=items.filter(item=>item.result);
  countEl.textContent=`${completed.length} / 9`;
  lead.textContent=completed.length===9?'Девять сфер. Никакого среднего балла. Только ваша персональная геометрия происходящего.':'Карта собирается постепенно. Даже хаосу нужны все девять точек.';

  const verdict=makeVerdict(items);verdictTitle.textContent=verdict.title;verdictCopy.textContent=verdict.copy;
  renderRadar(items);
  if(completed.length)renderInspector(completed[0]);

  register.innerHTML=items.map(item=>`<div class="dc-sphere-row${item.result?'':' is-missing'}"><span class="dc-sphere-row__num">${String(item.index+1).padStart(2,'0')}</span><strong class="dc-sphere-row__name">${esc(item.title)}</strong><span class="dc-sphere-row__level">${item.result?`${item.level}/5`:'—'}</span><span class="dc-sphere-row__date">${item.result?formatDate(item.result.date):'НЕ ОБСЛЕДОВАНО'}</span><span class="dc-sphere-row__quip">${item.result?esc(quip(item.level,item.index)):'сфера пока делает вид, что её нет.'}</span></div>`).join('');

  if(completed.length===9){clubNote.hidden=false;clubNoteText.textContent=makeRecommendation(items);wireShare(items,verdict)}

  if(completed.length<9){
    nextTitle.innerHTML='КАРТА<br>ЕЩЁ НЕ ГОТОВА.';
    nextCopy.textContent=`Завершено ${completed.length} из 9 сфер. Закрытый Community пока не открывается.`;
    nextActions.innerHTML=action('ПРОДОЛЖИТЬ DC-9',route('/join/'),{primary:true});
    return;
  }

  if(!session){
    nextTitle.innerHTML='СНАЧАЛА<br>ЗАКРЕПИТЕ УЛИКИ.';
    nextCopy.textContent='Войдите через Google. Карта синхронизируется с вашим профилем, а затем откроется оформление участия.';
    nextActions.innerHTML='<button class="dc-result-action primary" type="button" id="resultLogin">ЗАКРЕПИТЬ КАРТУ ЧЕРЕЗ GOOGLE →</button>';
    document.getElementById('resultLogin').onclick=async event=>{const button=event.currentTarget;button.disabled=true;button.textContent='ПЕРЕХОД К GOOGLE…';try{await loginWithGoogle('/join/result/',client)}catch(error){button.disabled=false;button.textContent='ЗАКРЕПИТЬ КАРТУ ЧЕРЕЗ GOOGLE →';nextCopy.textContent=errorMessage(error)}};
    return;
  }

  const status=await getEntryStatus(client);
  if(status.membership_active){
    nextTitle.innerHTML=status.community_activation_state==='MEMBER_ACTIVATED'?'ВЫ УЖЕ<br>ВНУТРИ.':'ДОПУСК<br>УЖЕ ЕСТЬ.';
    nextCopy.textContent=status.community_activation_state==='MEMBER_ACTIVATED'?'Community уже активирован. Возвращайтесь к общей доске — там люди и последствия.':'Членство активно. Следующий шаг — оставить первый Artifact на общей доске.';
    nextActions.innerHTML=action('ОТКРЫТЬ COMMUNITY BOARD',route('/community/board/'),{primary:true});
  }else{
    nextTitle.innerHTML='МОЖНО<br>ЗАХОДИТЬ.';
    nextCopy.textContent='Диагностическая часть закончена. Осталось определить, как вы будете представлены внутри закрытого Community.';
    nextActions.innerHTML=action('ПРОВЕРИТЬ ДОПУСК',route('/join/member/'),{primary:true});
  }
}

boot().catch(renderError);
