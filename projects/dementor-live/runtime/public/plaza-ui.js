const plazaDrafts={};
const cityAudio=new Audio();cityAudio.loop=false;cityAudio.preload='metadata';cityAudio.volume=.35;
let cityMusicEnabled=false,musicPlaybackId=null,musicBlocked=false,musicAttempted=false;
function syncCityMusic(){
 if(!state?.plaza)return;const playing=state.plaza.playing,button=$('citySound');button.hidden=false;
 if(!playing){cityAudio.pause();musicPlaybackId=null;musicAttempted=false;musicBlocked=false;button.textContent=cityMusicEnabled?'🔊 Звук города включён':'🔇 Включить звук города';return;}
 const track=state.plaza.catalog.find(t=>t.id===playing.track);if(!track){cityAudio.pause();return;}
 if(musicPlaybackId!==playing.id){cityAudio.pause();musicPlaybackId=playing.id;musicAttempted=false;musicBlocked=false;cityAudio.src=track.url;cityAudio.onloadedmetadata=()=>{if(state?.plaza?.playing?.id===playing.id)cityAudio.currentTime=Math.min(cityAudio.duration||track.duration,Math.max(0,(state.now-playing.startedAt)/1000));};}
 const elapsed=Math.max(0,(state.now-playing.startedAt)/1000);if(cityAudio.readyState>=1&&Math.abs(cityAudio.currentTime-elapsed)>1.2)cityAudio.currentTime=Math.min(cityAudio.duration||track.duration,elapsed);
 if(cityMusicEnabled&&!musicAttempted){musicAttempted=true;cityAudio.play().then(()=>{musicBlocked=false;}).catch(()=>{musicBlocked=true;});}else if(!cityMusicEnabled)cityAudio.pause();
 button.textContent=cityMusicEnabled&&!musicBlocked?'🔊 '+playing.title:'🔇 Нажми, чтобы услышать город';button.title=`Поставил ${playing.name}. Нажми, чтобы ${cityMusicEnabled&&!musicBlocked?'выключить':'включить'} звук.`;
}
$('citySound').onclick=()=>{cityMusicEnabled=musicBlocked||!cityMusicEnabled;musicBlocked=false;musicAttempted=false;syncCityMusic();};
cityAudio.onerror=()=>{musicBlocked=true;toast('Не удалось загрузить трек. Попробуй включить звук ещё раз.');};
function plazaPanel(mode,rows,row,canAct){if(!['monument','jukebox','donation-box','donation-board'].includes(mode))return false;const s=state.plaza,near=nearby(mode),title=$('cityPanelTitle'),intro=$('cityPanelIntro'),note=$('cityPanelNote');
 const form=(id,label,placeholder,onSubmit,max=180)=>{const f=document.createElement('form');f.className='plaza-form';f.id=id;const l=document.createElement('label');l.textContent=label;const field=document.createElement('textarea');field.required=true;field.minLength=3;field.maxLength=max;field.placeholder=placeholder;field.id=id+'-text';field.value=plazaDrafts[id]||'';field.oninput=()=>plazaDrafts[id]=field.value;l.append(field);const button=document.createElement('button');button.type='submit';button.textContent=mode==='monument'?'Оставить ответ · получить 50 монет':'Оставить заявку · 1 монета';button.disabled=!canAct||!near;f.append(l,button);f.onsubmit=async e=>{e.preventDefault();const r=await onSubmit(field.value);if(r?.ok){plazaDrafts[id]='';field.value='';if(cityPanelMode===mode)updateCityPanels(true);}};rows.append(f);};
 if(mode==='donation-box'||mode==='donation-board'){title.textContent=mode==='donation-box'?'Пожертвовать городу':'Доска пожертвований';intro.textContent='Добровольная помощь: монеты идут в казну, древесина и камень — на городской склад. Без вознаграждения.';note.textContent='Оплаченные поставки на стройку учитываются отдельно и не попадают на эту доску.';if(mode==='donation-box'){const f=document.createElement('form');f.id='donation-form';f.className='plaza-form';const kind=document.createElement('select');kind.id='donation-kind';for(const[k,name]of [['paper','🪙 Монеты'],['wood','🪵 Древесина'],['stone','🪨 Камень']]){const o=document.createElement('option');o.value=k;o.textContent=name;kind.append(o);}kind.setAttribute('aria-label','Что пожертвовать');const amount=document.createElement('input');amount.id='donation-quantity';amount.type='number';amount.min=1;amount.max=1000000;amount.step=1;amount.value=1;amount.setAttribute('aria-label','Количество пожертвования');const b=document.createElement('button');b.textContent='Пожертвовать';b.disabled=!canAct||!near;f.append(kind,amount,b);f.onsubmit=async e=>{e.preventDefault();await act('donate','donation-box',{kind:kind.value,quantity:Number(amount.value)});};rows.append(f);}const totals=new Map();for(const d of s.donations||[]){const a=totals.get(d.player)||{name:d.name,paper:0,wood:0,stone:0};a[d.kind]+=d.quantity;totals.set(d.player,a);}if(!totals.size)row('Пока пожертвований нет','Здесь появятся имена жителей и их добровольные вклады.');for(const a of totals.values())row(a.name,`🪙 ${a.paper} · 🪵 ${a.wood} · 🪨 ${a.stone}`);return true;}
 if(mode==='monument'){
  title.textContent='🏛️ Будущий памятник';intro.textContent='Какой бы памятник вы оставили на этой площади?';const own=s.ownAnswer||s.answers.find(a=>a.player===me.id);if(own)row('Твой ответ уже принят',own.text+' · награда получена');else form('monument-form','Твоя идея','Кому или чему посвятить памятник?',text=>act('monumentAnswer','monument',{text}),280);
  for(const answer of [...s.answers].reverse())if(answer.player!==me.id)row(answer.name,answer.text);note.textContent='Мэрия платит 50 монет один раз каждому жителю. Деньги берутся из свободной казны, ответ сохраняется.';return true;
 }
 title.textContent='🎵 Музыкальный автомат';intro.textContent=s.playing?`Сейчас: ${s.playing.title}. Поставил ${s.playing.name}.`:'Выбери один трек — он будет играть одновременно для всего города.';
 row('Звук у тебя',cityMusicEnabled?'Включён. Громкость 35%.':'Браузер может потребовать разрешить звук первым нажатием.',[{text:cityMusicEnabled?'Выключить звук':'Включить звук города',click:()=>$('citySound').click()}]);
 for(const track of s.catalog)row(track.title,`${Math.ceil(track.duration)} сек. · один раз · ${s.config.playPrice} монеты`,[{id:'play-'+track.id,text:s.playing?'Уже играет другой трек':'Поставить · 2 монеты',disabled:!canAct||!near||!!s.playing||me.wallet<s.config.playPrice,click:()=>act('musicPlay','jukebox',{track:track.id})}]);
 if(!s.catalog.length)row('Пока нет треков','Добавьте MP3 с компьютера, где запущен сервер.');
 form('music-request-form','Какую музыку добавить?','Исполнитель — название трека',text=>act('musicRequest','jukebox',{text}));
 for(const request of [...s.requests].reverse())row(request.name+' · музыкальная заявка',request.text);
 if(['127.0.0.1','localhost'].includes(location.hostname)){
  const f=document.createElement('form');f.className='plaza-form';const l=document.createElement('label');l.textContent='Добавить MP3 с компьютера сервера';const input=document.createElement('input');input.type='file';input.accept='.mp3,audio/mpeg';input.id='music-file';l.append(input);const button=document.createElement('button');button.type='submit';button.textContent='Добавить MP3';button.disabled=!near;f.append(l,button);f.onsubmit=async e=>{e.preventDefault();const file=input.files[0];if(!file){toast('Выбери MP3');return;}if(file.size>20*1024*1024){toast('Предел — 20 МБ');return;}button.disabled=true;try{const r=await fetch('/api/music-upload?name='+encodeURIComponent(file.name),{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'audio/mpeg'},body:file});const result=await r.json();toast(result.message);if(result.ok)input.value='';}catch{toast('Не удалось добавить MP3');}finally{button.disabled=false;}};rows.append(f);
 }
 note.textContent='Плата идёт в казну. Заявка стоит 1 монету и не гарантирует добавление трека. До 5 заявок на жителя. Звук можно выключить только у себя. Загруженные MP3 хранятся локально на сервере.';return true;
}
function drawPlaza(){if(!state?.plaza)return;const s=view.s;for(const o of state.plaza.config.objects){const p=screen(o.x,o.y);
 if(o.id==='donation-box'){paperOpenBox(o.x,o.y,'Пожертвования городу');continue;}if(o.id==='donation-board'){paperBoard(o.x,o.y,'Доска пожертвований',true);continue;}
 if(o.id==='theft-board'){paperBoard(o.x,o.y,'Доска воров',true);continue;}
 if(o.id==='monument'){
  shadow(p.x,p.y+4,s*.72,s*.19);
  poly([[p.x-s*.6,p.y],[p.x,p.y-s*.24],[p.x+s*.6,p.y],[p.x,p.y+s*.24]],'#d8d5c3','#8b907a');
  poly([[p.x-s*.38,p.y-s*.62],[p.x,p.y-s*.8],[p.x+s*.38,p.y-s*.62],[p.x,p.y-s*.44]],'#e9e4d1','#8b907a');
  poly([[p.x-s*.38,p.y-s*.62],[p.x,p.y-s*.44],[p.x,p.y+s*.04],[p.x-s*.38,p.y-s*.12]],'#c9c6b1','#8b907a');
  poly([[p.x,p.y-s*.44],[p.x+s*.38,p.y-s*.62],[p.x+s*.38,p.y-s*.12],[p.x,p.y+s*.04]],'#aaaF9a','#8b907a');
  label('Памятник · +50',o.x,o.y+1,true);
 }else{
  shadow(p.x,p.y+4,s*.6,s*.17);const x=p.x-s*.36,y=p.y-s*1.2,w=s*.72,h=s*1.3;
  poly([[x,y],[x+w,y],[x+w+s*.2,y-s*.12],[x+s*.2,y-s*.12]],'#d6c4a2','#7f826b');
  poly([[x+w,y],[x+w+s*.2,y-s*.12],[x+w+s*.2,y+h-s*.12],[x+w,y+h]],'#a99174','#7f826b');
  rounded(x,y,w,h,2,'#c4af8c','#7f826b');rounded(x+w*.14,y+h*.13,w*.72,h*.28,1,'#596b60','#7c846d');
  for(let i=0;i<3;i++)line(x+w*.18,y+h*.55+i*s*.1,x+w*.82,y+h*.55+i*s*.1,'#7c8067',1);
  poly([[x+w*.5,y+h*.19],[x+w*.35,y+h*.32],[x+w*.35,y+h*.22]],'#b8c69c',null);
  label('Музыкальный автомат',o.x,o.y+1,true);
 }
}}
