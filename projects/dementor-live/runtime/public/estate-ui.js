/* Civil registry: one panel for all owned, rented, commercial and public properties. */
function estatePanel(mode,rows,row,canAct){
 if(mode!=='estate'&&mode!=='mayor')return false;
 const title=$('cityPanelTitle'),intro=$('cityPanelIntro'),note=$('cityPanelNote');
 const button=(text,click,disabled=false,id)=>({text,click,disabled,id});
 const field=(label,value,limit=80)=>{
   const wrap=document.createElement('label');wrap.className='estate-input';wrap.textContent=label;
   const input=document.createElement('input');input.maxLength=limit;input.value=value||'';wrap.append(input);return {wrap,input};
 };
 if(mode==='mayor'){
  title.textContent='Мэрия · идеи жителей';
  intro.textContent='Здесь можно предложить доработку города или игры. Письмо сохраняется в городском ящике мэра. За первую подходящую идею в сутки — до 50 PAPER из свободной казны.';
  if(me.delivery?.picked)row('Курьерская доставка','Передать городской груз мэрии.',[button('Сдать груз',()=>act('courierDeliver','mayor'),!canAct||!nearby('mayor'))]);
  const wrap=document.createElement('form');wrap.id='mayor-letter-form';wrap.className='estate-compose';
  const label=document.createElement('label');label.textContent='Что бы вы хотели добавить или доработать?';
  const textarea=document.createElement('textarea');textarea.required=true;textarea.minLength=20;textarea.maxLength=600;textarea.rows=4;textarea.placeholder='Опишите идею для мэра…';label.append(textarea);
  const send=document.createElement('button');send.type='submit';send.textContent='Отправить мэру';send.disabled=!canAct||!nearby('mayor');
  wrap.append(label,send);wrap.onsubmit=async e=>{e.preventDefault();const result=await act('mayorIdea','mayor',{text:textarea.value});if(result?.ok){textarea.value='';updateCityPanels(true);}};
  rows.append(wrap);
  for(const letter of (state.mayorMail||[]).slice().reverse())row('Твоё письмо · '+new Date(letter.at).toLocaleDateString('ru-RU'),letter.text+(letter.reward?' · +'+letter.reward+' PAPER':''));
  note.textContent='Идеи принимаются с 20 символов. Повторы отклоняются. Письма хранятся на сервере; внешняя электронная почта пока не подключена.';
  return true;
 }
 title.textContent='Земля и помещения';intro.textContent='Можно владеть несколькими участками в любом городе. Жилые участки — для жизни, коммерческие изначально открыты всем, универсальные совмещают возможности.';
 const all=state.plots||[],current=state.cityNetwork?.current||'origin';
 const names={residential:'Жилой',business:'Для бизнеса',universal:'Универсальный'};
 const chosen=all.find(p=>p.id===selected)||all.find(p=>p.owner===me.id)||all[0];
 for(const owned of state.cityNetwork?.estates||[]){
   row('Моя земля · '+owned.cityName+' / '+owned.plotId,(names[owned.landUse]||'Универсальный')+' · '+(owned.leased?'аренда':'собственность')+(owned.sign?' · «'+owned.sign+'»':''),[
    button(owned.cityId===current?'Показать':'Перейти в город',()=>{if(owned.cityId===current){selected=owned.plotId;updateCityPanels(true);}else openCityPanel('city-registry');})]);
 }
 for(const plot of all){
   row((plot.id===chosen?.id?'→ ':'')+plot.id+' · '+(names[plot.zoning]||'Универсальный'),plot.owner?(plot.owner===me.id?'Твой':plot.ownerName||'Житель')+' · '+(plot.lease?'аренда':'собственность')+(plot.shop?.sign?' · «'+plot.shop.sign+'»':''):plot.locked?'Откроется после расчистки':'Свободен для оформления',[
    button(plot.id===chosen?.id?'Выбран':'Выбрать',()=>{selected=plot.id;updateCityPanels(true);})]);
 }
 if(!chosen){note.textContent='В городе пока нет участков.';return true;}
 const near=!!nearby(chosen.id)&&canAct;
 if(chosen.locked){note.textContent='Для открытия участка сначала завершите миссию расчистки.';return true;}
 const mine=chosen.owner===me.id,canEnter=chosen.owner&&(mine||chosen.publicAccess);
 const landUse=chosen.zoning==='universal'?'universal':chosen.zoning;
 if(!chosen.owner){
  row('Оформить '+chosen.id,'Стоимость покупки '+state.config.plotPrice+' PAPER. Для бизнеса и универсальной земли доступна аренда 1 PAPER/сутки.',[
   button('Купить · '+state.config.plotPrice+' PAPER',()=>act('buy',chosen.id,{landUse}),!near||me.wallet<state.config.plotPrice,'estate-buy'),
   button('Арендовать · 1 PAPER/день',()=>act('plotRent',chosen.id,{landUse}),!near||me.wallet<1||landUse==='residential','estate-rent')]);
 }else{
  row('Посетить участок',chosen.landUse==='business'?'Общее пространство: вход открыт всем, если аренда активна.':'Право входа зависит от владельца.',[
   button('Войти',()=>act('enterPlot',chosen.id),!near||!canEnter,'estate-enter'),
   ...(mine&&chosen.lease?[button('Продлить аренду · 1 PAPER',()=>act('plotRenew',chosen.id),!near||me.wallet<1)]:[])]);
 }
 if(mine){
  if(chosen.zoning==='universal'){
   row('Доступ для гостей',chosen.publicAccess?'Открыт':'Закрыт',[button(chosen.publicAccess?'Закрыть':'Открыть',()=>act('plotUse',chosen.id,{landUse:chosen.landUse,open:!chosen.publicAccess}),!near)]);
   row('Назначение','Можно использовать для дома, бизнеса или совмещать.',[
    ...['residential','business','universal'].map(use=>button(names[use],()=>act('plotUse',chosen.id,{landUse:use,open:chosen.landUse==='business'||!!chosen.home?.open}),!near||chosen.landUse===use))]);
  }
  if(['business','universal'].includes(chosen.landUse)){
   const sign=field('Вывеска (видна всем)',chosen.shop?.sign||'',80);
   const line=row('Публичная вывеска','Текст появится над участком и в списке мест.');
   line.append(sign.wrap);const save=document.createElement('button');save.textContent='Сохранить вывеску';save.disabled=!near;save.onclick=()=>act('plotSign',chosen.id,{text:sign.input.value});line.append(save);
  }
 }
 if(chosen.owner&&['business','universal'].includes(chosen.landUse)){
  const stock=chosen.shop?.stock||{},prices=chosen.shop?.prices||{};
  const products=['wood','stone','food','hemp','carrot'];
  for(const kind of products){
   const label=state.items[kind]?.name||kind,qty=stock[kind]||0,price=prices[kind]||0;
   row(label+' · '+qty+' шт.',(price?price+' PAPER/шт.':'Цена не назначена')+' · '+(mine?'в твоём рюкзаке '+(me.bag[kind]||0):'продаётся в витрине'),mine?[
    button('Выставить 1',()=>act('shopStock',chosen.id,{kind,quantity:1}),!near||!me.bag[kind]),
    button('Вернуть 1',()=>act('shopUnstock',chosen.id,{kind,quantity:1}),!near||qty<1),
    button('Цена +1',()=>act('shopPrice',chosen.id,{kind,price:Math.min(999,price+1)}),!near)
   ]:[button('Купить 1',()=>act('shopBuy',chosen.id,{kind,quantity:1}),!near||!canEnter||!price||qty<1||me.wallet<price)]);
  }
  if(mine)row('Выручка · '+(chosen.shop?.till||0)+' PAPER','Деньги от продаж хранятся на участке, пока владелец их не заберёт.',[
   button('Забрать выручку',()=>act('shopCollect',chosen.id),!near||!chosen.shop?.till)]);
 }
 note.textContent='Аренда обновляется за сутки по 1 PAPER при достаточном балансе и присутствии в городе. Просроченную аренду можно продлить вручную; товары остаются за владельцем. Прямые сделки с другими игроками не отменяются.';
 return true;
}
