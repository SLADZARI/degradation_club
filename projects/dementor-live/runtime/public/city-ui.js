/* Public buildings in the existing paper-world UI (no external assets). */
function civicPanel(mode,rows,row,canAct){
 const title=$('cityPanelTitle'),intro=$('cityPanelIntro'),note=$('cityPanelNote');
 const button=(text,click,disabled=false,id)=>({text,click,disabled,id});
 if(mode==='public-garden'){
   title.textContent='Городской опытный огород';
   const complete=state.gardenProject.stage>=state.config.cityGarden.stages.length;
   intro.textContent=complete?'Три общие грядки. Любой житель может посадить, полить и собрать. Урожай и покупки сохраняются.':'Отдельный городской участок пока строится: материалы принимаются на площадке за счёт казны.';
   if(!complete){
     const p=state.gardenProject,c=state.config.cityGarden;
     row('Стройка огорода',`🪵 ${p.accepted.wood}/${c.need.wood} · 🪨 ${p.accepted.stone}/${c.need.stone} · стадия ${p.stage}/${c.stages.length}`,[
       button('Сдать материалы',()=>navigateTo('public-garden-drop')),
       button('Идти на стройку',()=>navigateTo('public-garden-build'))]);
     return true;
   }
   const close=nearby('public-garden')&&canAct;
   const source=state.publicGarden.waterSource;
   row('Общий источник воды',`Остаток: ${source.left} / 20 л. У тебя: ${me.bag.water} / 4 л. Источник пополняется со временем.`,[
     button('Набрать 1 л',()=>act('publicDrawWater','public-garden'),!close||me.bag.water>=4||source.left<1),
     button('Идти к источнику',()=>navigateTo('public-garden'))]);
   for(const bed of state.publicGarden.beds){
     const ripe=bed.crop&&bed.watered&&bed.readyAt<=state.now;
     const crop=bed.crop?(bed.crop==='carrot'?'Морковь':'Конопля'):'Свободна';
     const remain=bed.crop&&bed.watered&&!ripe?Math.ceil((bed.readyAt-state.now)/1000):0;
     row(`Грядка ${Number(bed.id.split('-').at(-1))+1} · ${crop}`,!bed.crop?'Выбери семена':!bed.watered?'Нужны 2 л воды':ripe?'Урожай созрел':`Рост · ещё ${remain} секунд`,[
       button('Морковь',()=>act('publicSow',bed.id,{crop:'carrot'}),!close||!!bed.crop||!me.bag.seed_carrot),
       button('Конопля',()=>act('publicSow',bed.id,{crop:'hemp'}),!close||!!bed.crop||!me.bag.seed_hemp),
       button('Полить',()=>act('publicWater',bed.id),!close||!bed.crop||bed.watered||me.bag.water<2),
       button('Собрать',()=>act('publicHarvest',bed.id),!close||!ripe)]);
   }
   row('Общие результаты',`Урожай собран ${state.publicGarden.harvests} раз. Доступно каждому игроку.\nНаходясь рядом с грядками, используй кнопки выше.`,[
      button('Идти к огороду',()=>navigateTo('public-garden'))]);
   note.textContent='Городской огород — общий тестовый участок; личные грядки на купленных участках работают отдельно.';
   return true;
 }
 if(mode==='city-registry'){
   title.textContent='Реестр городов';intro.textContent='Отдельные миры с независимыми складами, ресурсами и стройками. Жители могут переходить между городами, сохраняя свои вещи и кошелёк.';
   const near=nearby('city-registry')&&canAct&&!me.delivery?.picked;
   const registry=state.cityNetwork||{current:'origin',cities:[{id:'origin',name:'Первый город',online:1}]};
   for(const city of registry.cities){
     row(city.name+(city.id===registry.current?' · ты здесь':''),`Жителей онлайн: ${city.online}`,[
       button(city.id===registry.current?'Текущий город':'Перейти',()=>act('travelCity','city-registry',{cityId:city.id}),!near||city.id===registry.current)]);
   }
   const form=document.createElement('form');form.className='civic-create-form';
   const label=document.createElement('label');label.textContent='Название нового города';
   const input=document.createElement('input');input.name='cityName';input.maxLength=36;input.minLength=3;input.placeholder='Название от 3 символов';input.required=true;
   const submit=document.createElement('button');submit.type='submit';submit.id='city-create';submit.textContent='Основать город';submit.disabled=!near||registry.cities.length>=13;
   label.append(input);form.append(label,submit);
   form.onsubmit=async e=>{e.preventDefault();const result=await act('createCity','city-registry',{name:input.value.trim()});if(result?.ok){input.value='';toast('Город создан. Открой реестр для перехода.');updateCityPanels(true);}};
   rows.append(form);
   note.textContent=near?'Новый город создаётся как отдельное сохранение на том же сервере. Другой игрок увидит его в реестре.':'Подойди к городскому реестру на карте, чтобы создать город или перейти в другой.';
   return true;
 }
 return false;
}
