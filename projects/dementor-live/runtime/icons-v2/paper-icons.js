/* Dementor Live — Paper Cut Icons v2. UI-only; never modifies world state. */
(()=>{
'use strict';
const ids=['wood','stone','food','seed_hemp','seed_carrot','hemp','carrot','water','axe','pick','rifle','ammo','map','shirt','souvenir','paper','backpack','cargo','health','stamina'];
const names=['Древесина','Камень','Ягоды','Семена конопли','Семена моркови','Конопля','Морковь','Вода','Топор','Кирка','Автомат','Патроны','Карта','Майка','Сувенир','PAPER','Рюкзак','Груз','Здоровье','Выносливость'];
const labels=Object.fromEntries(ids.map((id,i)=>[id,names[i]]));
const emojiTokens={'🪵':'wood','🪨':'stone','🫐':'food','🌰':'seed_hemp','🫘':'seed_carrot','🌿':'hemp','🥕':'carrot','💧':'water','🪓':'axe','⚒':'axe','⚒️':'axe','⛏':'pick','⛏️':'pick','🎒':'backpack','🗺':'map','🗺️':'map'};
const matcher=/🪵|🪨|🫐|🌰|🫘|🌿|🥕|💧|🪓|⚒️?|⛏️?|🎒|🗺️?/gu;
const file=id=>'/assets/paper-icons/png_256/'+id+'.png';
function icon(id,decorative=false){
 if(!labels[id])return document.createTextNode('');
 const el=document.createElement('img');el.src=file(id);el.className='paper-icon paper-icon--'+id;el.width=40;el.height=40;
 el.alt=decorative?'':labels[id];el.draggable=false;el.decoding='async';
 if(decorative)el.setAttribute('aria-hidden','true');return el;
}
window.DementorPaperIcons={version:'v2-clean',ids,icon,src:file};
function replaceEmoji(node){
 if(node.nodeType!==Node.TEXT_NODE||!node.parentElement)return;
 if(node.parentElement.closest('script,style,textarea,option,code,kbd'))return;
 const original=node.nodeValue||'';if(!matcher.test(original)){matcher.lastIndex=0;return;}matcher.lastIndex=0;
 const fragment=document.createDocumentFragment();let last=0;
 for(const hit of original.matchAll(matcher)){
  if(hit.index>last)fragment.append(document.createTextNode(original.slice(last,hit.index)));
  fragment.append(icon(emojiTokens[hit[0]]));last=hit.index+hit[0].length;
 }
 if(last<original.length)fragment.append(document.createTextNode(original.slice(last)));
 node.replaceWith(fragment);
}
function decorate(selector,id){
 const element=document.querySelector(selector);if(!element||element.querySelector(':scope > img.paper-icon'))return;
 element.prepend(icon(id,true));element.classList.add('paper-icon-bearing');
}
function decorateShop(){
 document.querySelectorAll('.city-row h3').forEach(h=>{
  if(h.querySelector('img.paper-icon'))return;
  const text=h.textContent||'';
  const id=/Карта путешественника/.test(text)?'map':/Майка Dementor/.test(text)?'shirt':/Маленький сувенир/.test(text)?'souvenir':null;
  if(id){h.prepend(icon(id,true));h.classList.add('paper-icon-bearing');}
 });
}
function visit(node){
 if(!node||!node.isConnected)return;
 if(node.nodeType===Node.TEXT_NODE){replaceEmoji(node);return;}
 if(node.nodeType!==Node.ELEMENT_NODE)return;
 if(node.matches('script,style,textarea,svg,canvas'))return;
 const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
 const items=[];while(walker.nextNode())items.push(walker.currentNode);
 for(const text of items)replaceEmoji(text);
}
let pending=new Set(),scheduled=false;
function render(){
 scheduled=false;const targets=[...pending];pending.clear();
 for(const element of targets)visit(element);
 decorate('#wallet','paper');
 decorate('#cargo','cargo');
 const game=document.querySelector('#game');
 if(game){decorate('label[for="health"]','health');decorate('label[for="stamina"]','stamina');}
 const battle=document.querySelector('#battle');
 if(battle){decorate('#ammo','ammo');decorate('#health','health');decorate('#food','food');decorate('#inventory','rifle');}
 decorateShop();
}
function queue(node){pending.add(node);if(!scheduled){scheduled=true;requestAnimationFrame(render);}}
if(!document.body)return;
queue(document.body);
const observer=new MutationObserver(records=>{
 for(const rec of records){
  if(rec.type==='characterData')queue(rec.target);
  else for(const n of rec.addedNodes)if(n.nodeType===1||n.nodeType===3)queue(n);
 }
});
observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
