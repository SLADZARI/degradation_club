let bagSelection=null;
function sameScene(p){return (p.scene||'city')===(me.scene||'city')&&((me.scene||'city')==='city'||p.plotId===me.plotId);}
function livingTargets(){return [...state.homeTargets,...state.drops,...state.players.filter(p=>p.id!==me.id&&p.online&&sameScene(p)).map(p=>({...p,type:'social'}))];}
function lifePanel(mode,rows,row,canAct){
 const title=$('cityPanelTitle'),intro=$('cityPanelIntro'),note=$('cityPanelNote');note.textContent='Числа пробные. Все предметы, деньги и изменения сохраняются.';
 const action=(type,target,extra={})=>()=>act(type,target,extra);
 const button=(text,click,disabled=false,id)=>({text,click,disabled,id});
 const itemName=k=>state.items[k]?.name||k;
 const nearbyPeople=state.players.filter(p=>p.id!==me.id&&p.online&&sameScene(p)&&Math.hypot(p.x-me.x,p.y-me.y)<=state.config.actionRange);
 const select=(label,options)=>{const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('select');for(const[value,text]of options){const option=document.createElement('option');option.value=value;option.textContent=text;input.append(option);}wrap.append(input);return wrap;};
 const num=(label,value=0)=>{const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('input');input.type='number';input.min=0;input.max=10000;input.step=1;input.value=value;wrap.append(input);return wrap;};
 const nav=()=>row('Твои дела','Всё для жизни в общем мире',[button('Рюкзак',()=>openCityPanel('bag')),button('Жители и сделки',()=>openCityPanel('social')),button('Семена',()=>openCityPanel('seeds')),button('Общий огород',()=>openCityPanel('public-garden')),button('Города',()=>openCityPanel('city-registry')),button('Доска воров',()=>openCityPanel('thefts'))]);
 if(mode==='bag'){
  title.textContent='🎒 Рюкзак';intro.textContent=`Вес ${cargo().toFixed(1)} / ${state.config.capacity} · инструменты ${me.toolItems.length} / 12`;note.textContent='Выбери ячейку. Торговля — в «Жителях», семена — у городской лавки.';
  const emoji={wood:'🪵',stone:'🪨',food:'🫐',seed_hemp:'🌰',seed_carrot:'🫘',hemp:'🌿',carrot:'🥕',water:'💧'};
  const grid=document.createElement('div');grid.className='bag-grid';
  for(const[k,def]of Object.entries(state.items)){const tile=document.createElement('button');tile.className='bag-cell'+(bagSelection===k?' chosen':'');tile.id='bag-item-'+k;tile.setAttribute('aria-label',`${def.name}: ${me.bag[k]||0}`);const glyph=document.createElement('span'),count=document.createElement('b');glyph.textContent=emoji[k];count.textContent=me.bag[k]||0;tile.append(glyph,count);tile.title=def.name;tile.onclick=()=>{bagSelection=k;updateCityPanels(true);};grid.append(tile);}rows.append(grid);
  const tools=document.createElement('div');tools.className='bag-grid tool-grid';
  for(const t of me.toolItems){const tile=document.createElement('button');tile.className='bag-cell'+(bagSelection===t.id?' chosen':'')+(me.activeTools[t.kind]===t.id?' equipped':'');tile.id='tool-item-'+t.id;tile.setAttribute('aria-label',`${toolNames[t.kind]} ${t.durability} из ${t.max}`);const glyph=document.createElement('span'),count=document.createElement('b');glyph.textContent=t.kind==='axe'?'🪓':'⛏️';count.textContent=`${t.durability}/${t.max}`;tile.append(glyph,count);tile.onclick=()=>{bagSelection=t.id;updateCityPanels(true);};tools.append(tile);}rows.append(tools);
  const tool=me.toolItems.find(t=>t.id===bagSelection);
  if(bagSelection){const choices=document.createElement('div');choices.className='quick-assign';for(let i=0;i<6;i++){const b=document.createElement('button');b.textContent='↧ '+(i+1);b.title='Поместить в быструю ячейку '+(i+1);b.onclick=()=>assignQuick(i,bagSelection);choices.append(b);}rows.append(choices);}
  if(tool){row(`${tool.kind==='axe'?'🪓':'⛏️'} ${toolNames[tool.kind]}`,`Прочность ${tool.durability} / ${tool.max}${me.activeTools[tool.kind]===tool.id?' · выбран':''}`,[button('Взять в руки',()=>{assignQuick(quickIndex,tool.id);selectQuick(quickIndex);},!canAct||tool.durability<=0,'equip-tool'),button('Удалить',()=>{if(confirm('Удалить этот инструмент безвозвратно?'))act('discardTool',tool.id);},!canAct,'discard-tool')]);}
  else if(state.items[bagSelection]){const k=bagSelection;row(`${emoji[k]} ${itemName(k)} · ${me.bag[k]||0}`,`Вес единицы ${state.items[k].weight}`,[button('Выложить 1',action('drop',null,{kind:k,quantity:1}),!canAct||!me.bag[k],'drop-one-'+k),button('Выложить всё',action('drop',null,{kind:k}),!canAct||!me.bag[k],'drop-all-'+k),...(['carrot','food'].includes(k)?[button('Съесть',action(k==='carrot'?'eatCarrot':'eat'),!me.bag[k])]:[])]);const section=rows.lastChild,field=num('Количество',1),drop=document.createElement('button');field.querySelector('input').max=me.bag[k]||0;drop.textContent='Выложить';drop.disabled=!canAct||!me.bag[k];drop.onclick=()=>act('drop',null,{kind:k,quantity:Number(field.querySelector('input').value)});section.append(field,drop);}
  else row('Выбери предмет','Нажми на ячейку, чтобы посмотреть количество и действия.');
  if(me.delivery)row('Городской груз · отдельно',`${me.delivery.quantity} · ${itemName(me.delivery.kind)}. ${me.delivery.picked?'Груз у тебя и занимает вес.':'Ожидает на складе.'} Нельзя подарить или продать.`);
  return true;
 }
 if(mode==='seeds'){
  title.textContent='Семенная лавка';intro.textContent=state.seedMarket.stage<state.config.seedMarket.stages.length?'Отдельное здание строится за счёт городской казны. Сдай материалы на стройке лавки.':'Лавка построена. Покупай семена у прилавка, а затем используй их в личном или городском огороде.';
  for(const kind of ['seed_hemp','seed_carrot',...Object.keys(state.treeSpecies||{})])row((kind==='seed_hemp'?'🌰 ':'🫘 ')+itemName(kind),`В лавке ${state.seedShop[kind]} · у тебя ${me.bag[kind]}. Цена 2 PAPER/шт.`,[button('Купить 1',action('buySeeds',null,{kind,quantity:1}),!canAct||state.scene!=='city'||state.seedMarket.stage<state.config.seedMarket.stages.length||!nearby('seed-shop')||!state.seedShop[kind]||me.wallet<2),button('Идти к лавке',()=>navigateTo('seed-shop'),state.scene!=='city')]);
  row('Лопата · '+(me.gardenTools?.shovel||0)+' использований','Нужна для подготовки земли на своём участке.',[button('Купить лопату · 5 PAPER',action('buyShovel','seed-shop'),!canAct||!nearby('seed-shop')||me.wallet<5||me.gardenTools?.shovel>0)]);
  return true;
 }
 if(mode==='resident'){
  const other=state.players.find(p=>p.id===selected&&nearbyPeople.some(n=>n.id===p.id));title.textContent=other?.name||'Житель';intro.textContent='Что хочешь сделать?';note.textContent='Для передачи вещей нужно согласие обоих.';if(!other){row('Подойди ближе','Житель отошёл.');return true;}
  row('Общение','',[button('💬 Беседа',()=>{$('chatInput').focus();$('cityPanel').close();}),button('🫐 Накормить',action('give',other.id),!canAct||!me.bag.food),button('🎁 Подарить предмет',()=>openCityPanel('social')),button('🤝 Обменяться',()=>openCityPanel('social'))]);return true;
 }
 if(mode==='social'){
  title.textContent='Жители и сделки';intro.textContent='Подарок, обмен или продажа: предложи точные условия. Сосед принимает их целиком; до этого предметы остаются у владельцев.';
  const fmt=leg=>[...Object.entries(leg.items).map(([k,n])=>`${itemEmoji[k]||''} ${itemName(k)} × ${n}`),...(leg.paper?[`${leg.paper} PAPER`]:[])].join(', ')||'Ничего · подарок';
  for(const t of state.trades){const from=state.players.find(p=>p.id===t.from)?.name||'Житель',to=state.players.find(p=>p.id===t.to)?.name||'Житель';row(`${from} → ${to}`,`Передаёт: ${fmt(t.give)}. Получает: ${fmt(t.take)}. Срок предложения — 2 минуты.`,[...(t.to===me.id?[button('Принять сделку',action('tradeAccept',t.id),!canAct,'trade-accept')]:[]),button('Отменить / отказаться',action('tradeCancel',t.id),false,'trade-cancel')]);}
  if(state.trades.length){const t=state.trades[0],table=document.createElement('div');table.className='trade-form';for(const [id,leg] of [[t.from,t.give],[t.to,t.take]]){const side=document.createElement('section'),h=document.createElement('h3'),cells=document.createElement('div');side.className='trade-side';h.textContent='🙂 '+(state.players.find(p=>p.id===id)?.name||'Житель');cells.className='trade-cells';for(const[k,n]of Object.entries(leg.items)){const c=document.createElement('span');c.textContent=(itemEmoji[k]||'')+' × '+n;cells.append(c);}const cash=document.createElement('p');cash.textContent='🪙 '+leg.paper+' PAPER';side.append(h,cells,cash);table.append(side);}const status=document.createElement('p');status.textContent=t.from===me.id?'✓ Ты подтвердил. Ждём согласия соседа.':'Сосед подтвердил условия. Проверь предметы и монеты и прими сделку.';table.append(status);rows.append(table);return true;}
  if(!nearbyPeople.length){row('Подойди к соседу','Обмен доступен рядом, в одной сцене.');return true;}

  const offerItems={give:{},take:{}};const form=document.createElement('form');form.className='trade-form';form.id='trade-form';const people=select('Кому',nearbyPeople.map(p=>[p.id,p.name]));people.querySelector('select').id='trade-person';if(nearbyPeople.some(p=>p.id===selected))people.querySelector('select').value=selected;
  const options=[['','Без предмета'],...Object.entries(state.items).map(([k,v])=>[k,(itemEmoji[k]||'')+' '+v.name])];const give=select('Я передаю',options),gq=num('Количество',1),gp=num('Мои PAPER'),take=select('Хочу получить',options),tq=num('Количество',1),tp=num('PAPER соседа');
  [give,gq,gp,take,tq,tp].forEach((el,i)=>el.querySelector('input,select').id=['trade-give','trade-give-qty','trade-give-paper','trade-take','trade-take-qty','trade-take-paper'][i]);
  const submit=document.createElement('button');submit.type='submit';submit.textContent='Подтвердить условия и предложить';submit.disabled=!canAct||state.trades.length>0;const left=document.createElement('section'),table=document.createElement('section'),right=document.createElement('section');left.className='trade-side';right.className='trade-side';table.className='trade-table';const own=document.createElement('h3'),partner=document.createElement('h3'),shared=document.createElement('h3');own.textContent='🙂 '+me.name;partner.textContent='🙂 '+(nearbyPeople.find(p=>p.id===selected)?.name||nearbyPeople[0]?.name||'Сосед');shared.textContent='🤝 Общий стол';const stock=document.createElement('p');stock.textContent=Object.entries(me.bag).filter(([,n])=>n).map(([k,n])=>(itemEmoji[k]||'')+' '+n).join(' · ')||'Рюкзак пуст';left.append(own,stock,give,gq,gp);const remote=document.createElement('p');remote.textContent='Предметы соседа — по согласованным условиям';right.append(partner,people,remote,take,tq,tp);table.append(shared);const cells=document.createElement('div');cells.className='trade-cells';for(let i=0;i<6;i++){const cell=document.createElement('span');cell.textContent='□';cells.append(cell);}table.append(cells);for(const [side,field,qty,parent,start] of [['give',give,gq,left,0],['take',take,tq,right,3]]){const add=document.createElement('button');add.type='button';add.textContent='В стол +';add.onclick=()=>{const k=field.querySelector('select').value,n=Number(qty.querySelector('input').value);if(!k||!Number.isInteger(n)||n<1)return;if(!offerItems[side][k]&&Object.keys(offerItems[side]).length>=3){toast('В этой стороне стола три ячейки');return;}offerItems[side][k]=n;for(let i=0;i<3;i++){const entry=Object.entries(offerItems[side])[i];cells.children[start+i].textContent=entry?(itemEmoji[entry[0]]||'')+' '+entry[1]:'□';}};parent.append(add);}
  const preview=()=>{const a=give.querySelector('select').value,b=take.querySelector('select').value;cells.children[0].textContent=(itemEmoji[a]||'□')+' '+gq.querySelector('input').value;cells.children[3].textContent=(itemEmoji[b]||'□')+' '+tq.querySelector('input').value;};form.addEventListener('change',preview);form.append(left,table,right,submit);form.onsubmit=e=>{e.preventDefault();const value=el=>el.querySelector('select,input').value;act('tradeOffer',value(people),{give:{paper:Number(value(gp)),items:{...offerItems.give,...(value(give)?{[value(give)]:Number(value(gq))}:{})}},take:{paper:Number(value(tp)),items:{...offerItems.take,...(value(take)?{[value(take)]:Number(value(tq))}:{})}}});};rows.append(form);return true;
 }
 if(mode==='thefts'){
  title.textContent='Городская Доска воров';intro.textContent='Здесь фиксируется успешный сбор чужого урожая без разрешения. Обычные подарки и обмены сюда не попадают.';
  if(!state.thefts.length)row('Пока записей нет','Посещение чужого участка и право забирать урожай — разные разрешения.');
  for(const t of [...state.thefts].reverse())row(`${state.players.find(p=>p.id===t.actor)?.name||'Житель'} · ${itemName(t.crop)} × ${t.quantity}`,`У ${state.players.find(p=>p.id===t.victim)?.name||'соседа'} · ${new Date(t.at).toLocaleString('ru-RU')}`);return true;
 }
 if(mode!=='home')return false;
 const h=state.home,t=state.homeTargets.find(t=>t.id===selected)||state.homeTargets.find(t=>t.id===context?.id),owner=h?.owner===me.id;title.textContent=t?.title||'Свой участок';intro.textContent=owner?'Расчищай, строй и выращивай. В ☷ доступны все места участка.':'Ты в гостях. Посещение не даёт права на чужой сундук или урожай.';
 if(!h||!t){row('Выбери объект','Закрой окно и подойди к нужному месту.');return true;}
 const closeUse=type=>async()=>{const r=await act(type,t.id);if(r?.ok)$('cityPanel').close();};
 if(['plot-exit','home-exit','tent'].includes(t.id))row(t.title,t.id==='tent'&&h.tent<3?'Пробный рецепт: 6 древесины + 2 камня. Каркас → крыша → завершение.': 'Переход в отдельную сцену с тем же рюкзаком.',[button(t.title,closeUse('homeUse'),!nearby(t.id), 'home-use')]);
 else if(t.id==='well')row('Вода из ручного источника','Источник: запас до 20 л, пополнение 1 л/мин. Переносимая ёмкость — 4 л.',[button('Набрать 1 л',action('homeWater',t.id),!canAct||!nearby(t.id),'home-water')]);
 else if(t.id==='bed')row('Отдых','Восстанавливает силы. Еду не заменяет.',[button('Отдохнуть',action('homeUse',t.id),!canAct,'home-rest')]);
 else if(t.id==='chest'){
  if(!owner)row('Сундук закрыт','Доступен владельцу.');else for(const[k,def]of Object.entries(state.items))row((itemEmoji[k]||'')+' '+def.name,`В сундуке ${h.chest[k]} · в рюкзаке ${me.bag[k]}`,[button('Убрать 1',action('homeStore',t.id,{kind:k,quantity:1}),!canAct||!me.bag[k]),button('Убрать всё',action('homeStore',t.id,{kind:k,quantity:me.bag[k]}),!canAct||!me.bag[k]),button('Взять 1',action('homeStore',t.id,{kind:k,quantity:1,withdraw:true}),!canAct||!h.chest[k])]);note.textContent='Сундук: до 80 единиц веса. Изъятие проверяет свободное место в рюкзаке.';
 }
 else if(t.id==='garden')row('Новая грядка',`Подготовлено ${h.beds.length} / 6. Сначала расчисти дикую растительность возле грядок.`,[button('Подготовить',action('homePrepare',t.id),!owner||!canAct||h.beds.length>=6,'home-prepare'),button('Вскопать рядом · лопата',action('homeDig','garden'),!owner||!canAct||!me.gardenTools?.shovel||h.soil?.length>=6,'home-dig')]);
 else if(h.nodes.some(n=>n.id===t.id))row(t.title,'Добыча конечна и сохраняется. Для дерева нужен топор, для камня — кирка.',[button('Добыть / расчистить',action('homeClear',t.id),!owner||!canAct||!t.left,'home-clear')]);
 else if(h.soil?.some(s=>s.id===t.id)){
  const occupied=h.plantedTrees?.some(tree=>tree.soilId===t.id);
  row('Вскопанная земля',occupied?'Здесь уже растёт дерево.':'Выбери один из пяти видов.',occupied?[]:Object.entries(state.treeSpecies||{}).map(([kind,def])=>button('Посадить · '+def.name,action('homeSowTree',t.id,{kind}),!owner||!me.bag[kind])));
 }
 else if(h.plantedTrees?.some(tree=>tree.id===t.id)){
  const tree=h.plantedTrees.find(tree=>tree.id===t.id),stage=!tree.wateredAt?1:state.now-tree.wateredAt>=360000?3:state.now-tree.wateredAt>=180000?2:1;
  row(t.title,tree.wateredAt?'Рост '+stage+'/3 · '+(stage===3?'Древесины осталось '+tree.stock:'Дерево ещё растёт'):'Полей двумя литрами воды.',[
    button('Полить · 2 л',action('homeWaterTree',t.id),!owner||!!tree.wateredAt||me.bag.water<2),
    button('Рубить · 1 древесина',action('homeFellTree',t.id),!owner||stage<3||!me.tools.axe)
  ]);
 }
 else {const b=h.beds.find(b=>b.id===t.id);if(b){const ripe=b.crop&&b.watered&&state.now>=b.readyAt,allowed=owner;row(t.title,!b.crop?'Выбери культуру. Семя будет потрачено.':b.watered?ripe?'Можно собирать.':`До готовности ${Math.max(1,Math.ceil((b.readyAt-state.now)/1000))} сек.`:'Нужно 2 л воды.',!b.crop?[button('Посеять коноплю',action('homeSow',b.id,{crop:'hemp'}),!owner||!me.bag.seed_hemp,'sow-hemp'),button('Посеять морковь',action('homeSow',b.id,{crop:'carrot'}),!owner||!me.bag.seed_carrot,'sow-carrot')]:[button('Полить',action('homeWater',b.id),!owner||b.watered,'water-crop'),button(allowed?'Собрать':'Собрать с разрешением',action('homeHarvest',b.id),!ripe,'harvest-crop'),...(!owner?[button('Взять без разрешения · кража',action('homeHarvest',b.id,{steal:true}),!ripe,'steal-crop')]:[]),...(owner&&b.crop==='carrot'&&!b.seedPlant?[button('Оставить на семена',action('homeSeed',b.id),!ripe,'seed-crop')]:[])]);}}
 if(owner){row('Гости',h.open?'Участок открыт. Чужой сундук остаётся закрытым.':'Участок закрыт для посетителей.',[button(h.open?'Закрыть участок':'Открыть для гостей',action('homeAccess',null,{open:!h.open}),false,'toggle-visitors')]);for(const other of state.players.filter(p=>p.id!==me.id&&p.online))row(other.name,h.permits[other.id]?'Разрешено забирать урожай':'Без права на урожай',[button(h.permits[other.id]?'Отозвать право сбора':'Разрешить забирать урожай',action('homeAccess',null,{open:h.open,player:other.id,harvest:!h.permits[other.id]}))]);}
 return true;
}
// Local furniture: ISO30 prisms anchored to the same physical footprints as collisions.
function localPrism(o,height,front,side,top,elevation=0){
 const base=[[o.x,o.y],[o.x+o.w,o.y],[o.x+o.w,o.y+o.h],[o.x,o.y+o.h]]
   .map(([x,y])=>{const p=screen(x,y);return [p.x,p.y-elevation*view.s];});
 const raised=base.map(([x,y])=>[x,y-height*view.s]);
 poly([base[3],base[2],raised[2],raised[3]],front,'#847c69');
 poly([base[2],base[1],raised[1],raised[2]],side,'#847c69');
 poly(raised,top,'#847c69');
}
function localTent(o,stage){
 const s=view.s,base=[[o.x,o.y],[o.x+o.w,o.y],[o.x+o.w,o.y+o.h],[o.x,o.y+o.h]]
   .map(([x,y])=>{const p=screen(x,y);return [p.x,p.y];});
 const ridgeBack=screen(o.x+o.w/2,o.y),ridgeFront=screen(o.x+o.w/2,o.y+o.h),h=s*1.9;
 const rb=[ridgeBack.x,ridgeBack.y-h],rf=[ridgeFront.x,ridgeFront.y-h];
 groundRect(o,'#c9c0a4','#9b987d');
 if(stage===1){
   for(let i=0;i<4;i++){const peak=i<2?rb:rf;line(base[i][0],base[i][1],peak[0],peak[1],'#8b8165',2.5);}
   line(...rb,...rf,'#8b8165',2.5);return;
 }
 poly([base[0],rb,rf,base[3]],'#e6ddc4','#8d846b');
 poly([rb,base[1],base[2],rf],stage>=3?'#bdae91':'#d7ceb6','#8d846b');
 poly([base[3],rf,base[2]],'#dac8a7','#8d846b');
 const doorLeft=screen(o.x+o.w*.36,o.y+o.h),doorRight=screen(o.x+o.w*.64,o.y+o.h);
 poly([[doorLeft.x,doorLeft.y],[ridgeFront.x,ridgeFront.y-h*.57],[doorRight.x,doorRight.y]],'#586457','#77785f');
}
function localWell(o){
 localPrism(o,.58,'#b7a386','#95856d','#d8cab0');
 const pad=.15,water=[[o.x+pad,o.y+pad],[o.x+o.w-pad,o.y+pad],[o.x+o.w-pad,o.y+o.h-pad],[o.x+pad,o.y+o.h-pad]]
   .map(([x,y])=>{const p=screen(x,y);return [p.x,p.y-.59*view.s]});
 poly(water,'#9bbaaf','#748f87');
}
function localChest(o){
 localPrism(o,.85,'#ae9471','#897459','#d2bb93');
 localPrism({x:o.x-.05,y:o.y-.05,w:o.w+.1,h:o.h+.1},.15,'#cfb389','#9a8060','#e0cba4',.85);
 const p=screen(o.x+o.w,o.y+o.h);line(p.x-6,p.y-view.s*.5,p.x+6,p.y-view.s*.5,'#77654f',2);
}
function localBed(o){
 localPrism(o,.48,'#9d8b74','#81725e','#cfc3aa');
 localPrism({x:o.x+.18,y:o.y+.15,w:o.w-.36,h:o.h-.3},.12,'#d8d5c9','#c6c1b2','#ebe6d9',.48);
 const pillow=screen(o.x+.48,o.y+.48),edge=screen(o.x+.95,o.y+.48);
 line(pillow.x,pillow.y-.62*view.s,edge.x,edge.y-.62*view.s,'#b9b5a7',view.s*.18);
}
function localCrop(b){
 groundRect({x:b.x-.55,y:b.y-.55,w:1.1,h:1.1},'#b7a083','#8f8066');
 if(!b.crop)return;
 const q=screen(b.x,b.y),ripe=b.watered&&state.now>=b.readyAt,k=view.s*(ripe?.25:.13);
 if(b.crop==='hemp')drawHempBush(b.x,b.y);
 else if(b.crop==='carrot'){
   poly([[q.x-k*.5,q.y-k],[q.x+k*.5,q.y-k],[q.x,q.y+k]],'#c89362','#9a7857');
   poly([[q.x,q.y-k],[q.x-k,q.y-k*2],[q.x,q.y-k*1.7],[q.x+k,q.y-k*2]],'#8fa476','#73886a');
 }else{
   for(const side of [-1,1])poly([[q.x,q.y],[q.x+side*k,q.y-k],[q.x+side*k*.9,q.y-k*1.7],[q.x,q.y-k*.8]],side<0?'#8ba678':'#a4b58c','#708966');
   line(q.x,q.y,q.x,q.y-k*2,'#718466',1.5);
 }
}
function drawHome(time){
 const h=state.home,scene=state.scene,interior=scene==='interior',mission=scene==='expedition';
 const footprints=state.homeFootprints||[],object=(id,fallback)=>footprints.find(o=>o.id===id)||fallback;
 groundRect({x:0,y:0,w:16,h:16},interior?'#e2d5b9':'#e4e7cf','#929c7b');
 for(let i=0;i<=16;i++){
   const a=screen(i,0),b=screen(i,16),c=screen(0,i),d=screen(16,i);
   line(a.x,a.y,b.x,b.y,'#a1a58630',.6);
   line(c.x,c.y,d.x,d.y,'#a1a58630',.6);
 }
 const entities=[],add=(depth,fn)=>entities.push({depth,fn});
 if(interior){
   for(const id of ['room-wall-north','room-wall-west']){
     const wall=footprints.find(o=>o.id===id);
     if(wall)localPrism(wall,wall.height,'#cfbea0','#b3a78e','#e4d7be');
   }
   const chest=object('chest',{x:3,y:4.8,w:1.6,h:1.3});
   const bed=object('bed',{x:8.4,y:5.1,w:2.4,h:1.7});
   add(chest.x+chest.w/2+chest.y+chest.h/2,()=>localChest(chest));
   add(bed.x+bed.w/2+bed.y+bed.h/2,()=>localBed(bed));
 }else{
   label(mission?'Общая миссия · расчистка':'Участок · '+(state.players.find(p=>p.id===h.owner)?.name||'житель'),8,1);
   for(const dirt of h.soil||[])groundRect({x:dirt.x-.35,y:dirt.y-.35,w:.7,h:.7},'#a98e6d','#796f5b');
   for(const n of h.nodes||[])if(n.left)add(n.x+n.y,()=>{
     const o={...n,stock:n.left};
     if(n.kind==='wood')drawTree(o);else if(n.kind==='stone')drawStone(o);else drawFood(o);
   });
   for(const tree of h.plantedTrees||[])add(tree.x+tree.y,()=>{
     const stage=!tree.wateredAt?1:state.now-tree.wateredAt>=360000?3:state.now-tree.wateredAt>=180000?2:1;
     const k=[0,.34,.61,1][stage],q=screen(tree.x,tree.y),variant=state.treeSpecies?.[tree.kind]?.variant??0;
     ctx.save();ctx.translate(q.x,q.y);ctx.scale(k,k);ctx.translate(-q.x,-q.y);
     drawTree({...tree,stock:1,visualVariant:variant});ctx.restore();
   });
   if(!mission){
     if(h.tent){
       const tent=object('tent-visual',{x:6,y:5,w:4,h:3});
       add(tent.x+tent.w/2+tent.y+tent.h,()=>localTent(tent,h.tent));
     }
     const well=object('well',{x:13.45,y:2.45,w:1.1,h:1.1});
     add(well.x+well.w/2+well.y+well.h/2,()=>localWell(well));
     for(const b of h.beds||[])add(b.x+b.y,()=>localCrop(b));
   }
 }
 // Dropped inventory appears as a little ISO30 bundle at its actual world position.
 // Pickups remain walkable and do not gain new physical restrictions.
 for(const drop of state.drops||[])add(drop.x+drop.y,()=>{
   const stone=drop.kind==='stone';
   localPrism({x:drop.x-.18,y:drop.y-.18,w:.36,h:.36},.18,
     stone?'#9a9e96':'#bdac8c',stone?'#747d76':'#89775d',stone?'#cbd0c5':'#e0d2b2');
 });
 // One painter queue for props, furniture, terrain and both players.
 for(const p of state.players.filter(p=>(p.online||p.id===me.id)&&sameScene(p))){
   const v=visualPlayers.get(p.id)||p;
   add(v.x+v.y,()=>drawPlayer(p,time));
 }
 entities.sort((a,b)=>a.depth-b.depth);
 for(const entry of entities)entry.fn();
 if(!interior){
   for(const n of h.nodes||[])if(n.left&&n.kind!=='wood'&&n.kind!=='stone')label(n.kind==='food'?'Дикие ягоды':names[n.kind],n.x,n.y+1,true);
   for(const tree of h.plantedTrees||[])label(state.treeSpecies?.[tree.kind]?.name||'Дерево',tree.x,tree.y-1,true);
   for(const b of h.beds||[])label(b.crop?b.seedPlant?'На семена':b.watered?(state.now>=b.readyAt?'Созрело':'Растёт'):'Полей':'Грядка',b.x,b.y+1,true);
 }else{label('Сундук',4,6,true);label('Кровать',10,7,true);}
 for(const t of state.homeTargets.filter(t=>['mission-exit','plot-exit','home-exit','tent','well','garden'].includes(t.id)))label(t.title,t.x,t.y,true);
 for(const d of state.drops)label(names[d.kind]+' × '+d.quantity,d.x,d.y,true);
 if(context){
   const q=screen(context.x,context.y);ctx.beginPath();
   ctx.ellipse(q.x,q.y+4,view.s*.7,view.s*.25,0,0,Math.PI*2);
   ctx.strokeStyle='#829569';ctx.stroke();
 }
}

let questListSignature='';
function questObjectives(){
 const tasks=[],add=(id,title,done,hint,target,extra={})=>tasks.push({id,title,done:!!done,hint,target,...extra});
 const ownPlot=state.plots.find(p=>p.owner===me.id),h=state.home,home=state.scene!=='city',mine=home&&h?.owner===me.id;
 if(me.spirit)add('recover','Вернуть тело',false,'Подойди к ягодам или попроси соседа накормить',home?(state.scene==='expedition'?'mission-exit':state.scene==='interior'?'home-exit':'plot-exit'):state.resources.find(r=>r.type==='food'&&r.stock)?.id,{priority:true});
 else if(me.hunger<state.config.slowBelow)add('food','Поесть',false,me.bag.food||me.bag.carrot?'F — съесть еду из рюкзака':'Найди куст с ягодами',home?(state.scene==='interior'?'home-exit':h.nodes.find(n=>n.kind==='food'&&n.left)?.id):state.resources.find(r=>r.type==='food'&&r.stock)?.id,{priority:true});
 if(state.scene==='expedition'){for(const n of h.nodes.filter(n=>['wood','stone'].includes(n.kind)))add(n.id,(n.kind==='wood'?'Расчистить дерево':'Расчистить камень'),n.left===0,`${n.initial-n.left}/${n.initial} собрано · нужен ${n.kind==='wood'?'топор':'кирка'}`,n.id);add('return','Вернуться в город',false,state.expedition.completedAt?'Два новых участка открыты':'Можно вернуться, разгрузиться и продолжить','mission-exit',{optional:!state.expedition.completedAt});return {title:state.expedition.completedAt?'Новая территория открыта':'Расчистка новой земли',category:'ОБЩАЯ МИССИЯ',tasks};}
 if(home&&!mine){add('guest','В гостях',false,'Чужой урожай — только с разрешения хозяина',state.scene==='interior'?'home-exit':'plot-exit');return {title:'Гостевой участок',category:'ГОСТИ',tasks};}
 if(mine){
  const m=h.progress||{},harvested=!!m.harvested||h.log.some(e=>e.actor===me.id&&!e.theft),sown=harvested||m.sown||h.beds.some(b=>b.crop),watered=harvested||m.watered||h.beds.some(b=>b.watered),ripe=h.beds.find(b=>b.crop&&b.watered&&state.now>=b.readyAt),growing=h.beds.find(b=>b.crop&&b.watered),bed=h.beds.find(b=>!b.crop),dry=h.beds.find(b=>b.crop&&!b.watered),planted=h.beds.some(b=>b.crop);
  const via=id=>state.homeTargets.some(t=>t.id===id)?id:state.scene==='interior'?'home-exit':id==='chest'?'tent':id;
  const obstacle=h.nodes.find(n=>n.left&&Math.hypot(n.x-6,n.y-10)<1.5),source=obstacle||h.nodes.find(n=>n.left&&['wood','stone'].includes(n.kind)),hasTools=me.toolItems.some(t=>t.durability>0);
  add('tools','Подготовить инструмент',hasTools,'Топор — дерево, кирка — камень',via('plot-exit'));
  add('clear','Начать расчистку участка',m.cleared||h.tent>0||h.beds.length>0||h.nodes.some(n=>n.left<({wood:12,stone:8,food:6}[n.kind]||4)),'Подойди к ресурсу · E — добыть',via(source?.id||'garden'));
  add('tent-stock','Собрать материалы палатки',h.tent>0,`🪵 ${Math.min(6,me.bag.wood)}/6 · 🪨 ${Math.min(2,me.bag.stone)}/2`,via(h.nodes.find(n=>n.left&&n.kind===(me.bag.wood<6?'wood':'stone'))?.id||'tent'),{ready:me.bag.wood>=6&&me.bag.stone>=2});
  if(h.tent===0&&me.bag.wood>=6&&me.bag.stone>=2)tasks.at(-1).done=true;
  add('tent','Построить палатку',h.tent>=3,`${h.tent}/3 · каркас → крыша → закрепить`,via('tent'));
  add('interior','Зайти в свой дом',m.entered||state.scene==='interior', 'Вход в готовую палатку · E',via('tent'));
  add('garden','Подготовить первую грядку',h.beds.length>0,obstacle?'Сначала расчисти место первой грядки':'Огород · подготовить грядку',via(obstacle?.id||'garden'));
  add('sow','Посеять первую культуру',sown,me.bag.seed_carrot||me.bag.seed_hemp?'Выбери морковь или коноплю на пустой грядке':'Собери дикие семена на участке',via(me.bag.seed_carrot||me.bag.seed_hemp?bed?.id||'garden':h.nodes.find(n=>n.kind.startsWith('seed_')&&n.left)?.id||'plot-exit'));
  add('water','Полить посев',watered,me.bag.water>=2?'Полей посев · нужно 2 л':`Набери воду: ${Math.min(2,me.bag.water)}/2 л`,via(me.bag.water>=2?dry?.id||'garden':'well'));
  const remaining=growing?Math.max(0,Math.ceil((growing.readyAt-state.now)/1000)):0;
  add('grow','Дождаться урожая',harvested||!!ripe,growing?remaining?`Растёт · ещё ${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`:'Урожай созрел':'Рост начнётся после посева и полива',via(growing?.id||'garden'),{waiting:!!growing&&!ripe&&!harvested});
  add('harvest','Собрать первый урожай',harvested,ripe?'Урожай готов — подойди к грядке':'Собери созревшую культуру',via(ripe?.id||'garden'));
  add('store','Убрать вещи в сундук',m.stored||Object.values(h.chest||{}).some(n=>n>0),'Личный сундук внутри палатки',via('chest'),{optional:true});
  return {title:tasks.filter(t=>!t.optional&&!t.priority).every(t=>t.done)?'Участок обустроен':'Первый дом и огород',category:'ТВОЙ УЧАСТОК',tasks};
 }
 if(me.delivery){const d=me.delivery;add('delivery','Твой курьерский заказ',false,d.picked?`Доставь ${d.quantity} · ${names[d.kind]} → ${deliveryLabel(d)}`:`Забери ${d.quantity} · ${names[d.kind]} на складе`,d.picked?deliveryTarget(d):'warehouse',{priority:true});}
 add('tools','Получить инструменты',me.toolItems.length>0,'Бесплатный топор и кирка у мэрии','tools');
 for(const [id,title,project,c,drop,build,available]of [['square','Городская площадь',state.project,state.config,'project','build',true],['forge','Общественная кузница',state.forge,{...state.config,...state.config.forge},'forge-drop','forge-build',forgeActive()],['bridge','Мост на другой берег',state.bridge,{...state.config,...state.config.bridge},'bridge-drop','bridge-build',bridgeActive()]]){
  if(!available)continue;const complete=project.stage>=c.stages.length;
  add(id+'-wood',title+' · древесина',project.accepted.wood>=c.need.wood,`🪵 ${project.accepted.wood}/${c.need.wood} принято`,me.bag.wood?drop:state.resources.find(r=>r.type==='wood'&&r.stock)?.id,{ready:!complete&&c.stages[project.stage].wood>project.stock.wood});
  add(id+'-stone',title+' · камень',project.accepted.stone>=c.need.stone,`🪨 ${project.accepted.stone}/${c.need.stone} принято`,me.bag.stone?drop:state.resources.find(r=>r.type==='stone'&&r.stock)?.id,{ready:!complete&&c.stages[project.stage].stone>project.stock.stone});
  add(id+'-build',title+' · строительство',complete,complete?'Готово для жителей':`${c.stages[project.stage].title}: ${project.work}/${c.stages[project.stage].works} работ`,build,{ready:!complete&&projectReady(project,c)});
 }
 add('land','Свой участок',!!ownPlot,ownPlot?'Участок куплен':`${me.wallet}/${state.config.plotPrice} PAPER · заработай на городских работах`,ownPlot?.id||state.plots.find(p=>!p.owner&&!p.locked)?.id);
 if(ownPlot)add('home','Обустроить свой участок',false,'Зайди на участок — там расчистка, палатка и огород',ownPlot.id,{priority:true});
 if(!me.delivery)for(const offer of state.courierOffers)add('courier-'+offer.kind+'-'+offer.destination,'Курьерская доставка',false,`${offer.quantity} · ${names[offer.kind]} → ${deliveryLabel(offer)} · +${offer.reward} PAPER`,'board',{optional:true});
 add('frontier','Открыть новую территорию',!!state.expedition.completedAt,`${state.expedition.total-state.expedition.remaining}/${state.expedition.total} · выход на юге города`,'frontier-gate',{optional:true});
 add('work-board','Другие работы мэрии',false,'Все текущие предложения и условия','board',{optional:true});
 return {title:'Общий город и свой дом',category:'ТВОИ ЗАДАНИЯ',tasks};
}
function updateQuestTracker(){
 const data=questObjectives(),tasks=data.tasks,active=tasks.find(t=>!t.done&&t.priority)||tasks.find(t=>t.id==='tools'&&!t.done)||tasks.find(t=>!t.done&&!t.optional&&t.ready)||tasks.find(t=>!t.done&&!t.optional),core=tasks.filter(t=>!t.optional&&!t.priority),done=core.filter(t=>t.done).length;
 const signature=JSON.stringify([data,active?.id]);
 $('questCategory').textContent=data.category;document.querySelector('#quest h1').textContent=data.title;$('task').textContent=active?'→ '+active.title+' · '+active.hint:'Основные этапы выполнены. Развивай участок и помогай городу.';$('projectPercent').textContent=`${done}/${core.length}`;$('projectBar').style.width=(core.length?done/core.length*100:0)+'%';$('stageTitle').textContent='✓ Выполнено · → Сейчас · ○ Дальше';
 const focus=$('questActive');$('questActiveTitle').textContent=active?'→ '+active.title:'Основные задания выполнены';$('questActiveHint').textContent=active?.hint||'Исследуй мир и помогай соседям';focus.disabled=!active?.target;focus.onclick=()=>{if(active?.target)navigateTo(active.target);};
 const finished=tasks.filter(t=>t.done);$('questDoneToggle').hidden=!finished.length;$('questDoneToggle').textContent='✓ '+finished.length+' выполнено';if(signature===questListSignature)return;questListSignature=signature;
 function item(t){const li=document.createElement('li'),button=document.createElement('button'),title=document.createElement('b'),hint=document.createElement('small');li.dataset.quest=t.id;li.className=t.done?'done':t.id===active?.id?'active':t.optional?'optional':'pending';title.textContent=(t.done?'✓ ':t.id===active?.id?'→ ':'○ ')+t.title;hint.textContent=t.done?'Выполнено':t.optional?'Дополнительно · '+t.hint:t.hint;button.append(title,hint);button.disabled=!t.target||t.done;button.onclick=()=>{if(t.target)navigateTo(t.target);};button.title=t.done?'Выполнено':'Показать путь к заданию';if(t.id===active?.id)button.setAttribute('aria-current','step');li.append(button);return li;}
 $('questList').replaceChildren(...[...(active?[active]:[]),...tasks.filter(t=>t!==active&&!t.done)].map(item));$('questDoneList').replaceChildren(...finished.map(item));
}
