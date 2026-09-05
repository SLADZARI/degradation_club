import {CharacterRenderer} from '../render/character-renderer.mjs';
import {CHARACTER_REGISTRY,characterSpec,characterAssetText,loadCharacterContract,appearanceForCharacter,variantOptions,variantKey,SHARED_APPEARANCE_CATEGORIES,CHARACTER_OWNED_CATEGORIES} from '../render/character-registry.mjs';

const CATEGORIES=Object.freeze([
  {id:'hat',label:'ГОЛОВА',scope:'shared'},
  {id:'glasses',label:'ОЧКИ',scope:'shared'},
  {id:'facialHair',label:'ЛИЦО',scope:'shared'},
  {id:'accessory',label:'АКСЕССУАР',scope:'shared'},
  {id:'outfit',label:'ОДЕЖДА',scope:'owned'},
  {id:'shoes',label:'ОБУВЬ',scope:'owned'}
]);
const EMPTY_SHARED=()=>({hatVariant:null,glassesVariant:null,facialHairVariant:null,accessoryVariant:null});
const EMPTY_OWNED=()=>({outfitVariant:null,shoesVariant:null});
const EMPTY_COLORS=()=>({outfitPrimary:null,outfitSecondary:null,shoesPrimary:null});
const FACE_PREVIEWS=Object.freeze([
  {label:'НОРМАЛЬНО',face:{eyes:'neutral',brows:'neutral',mouth:'neutral'}},
  {label:'НАПРЯГСЯ',face:{eyes:'tense',brows:'tense',mouth:'tense'}},
  {label:'ЗАКИПЕЛ',face:{eyes:'overheat',brows:'angry',mouth:'open'}},
  {label:'ОТПУСТИЛО',face:{eyes:'neutral',brows:'neutral',mouth:'soft'}}
]);

export async function ensureCharacterContracts(){
  await Promise.allSettled(Object.keys(CHARACTER_REGISTRY).map(id=>loadCharacterContract(id)));
}

async function assetText(id){
  const cached=characterAssetText(id);if(cached)return cached;
  const spec=characterSpec(id),r=await fetch(spec.asset);if(!r.ok)throw new Error(`Character asset ${id} ${r.status}`);return r.text();
}

export async function mountCharacter(root,id,{side='A',appearance=null,state=null,face=null}={}){
  if(!root)return null;
  root.innerHTML=await assetText(id);root.dataset.character=id;
  const renderer=new CharacterRenderer({side,root,rigFallback:characterSpec(id).rigFallback});
  renderer.render({state:state||{energy:72,brain:15,tension:10,contact:60,memory:{}},face:face||{},visual:{characterId:id,appearance:appearance||{variantContract:true}}});
  return renderer;
}

export class PersonEditor{
  constructor({root,onChange=()=>{}}={}){
    this.root=root;this.onChange=onChange;this.baseCharacterId='character-01';
    this.shared=EMPTY_SHARED();this.owned={'character-01':EMPTY_OWNED(),'character-02':EMPTY_OWNED()};
    this.colors={'character-01':EMPTY_COLORS(),'character-02':EMPTY_COLORS()};
    this.activeCategory='hat';this.faceIndex=0;this.renderer=null;this.ready=false;
  }
  appearance(){return appearanceForCharacter(this.baseCharacterId,this.shared,this.owned[this.baseCharacterId],this.colors[this.baseCharacterId]);}
  value(){return {baseCharacterId:this.baseCharacterId,gender:this.baseCharacterId==='character-02'?'female':'male',sharedAppearance:{...this.shared},ownedAppearance:{...this.owned[this.baseCharacterId]},colors:{...this.colors[this.baseCharacterId]},appearance:this.appearance()};}
  async init(){await ensureCharacterContracts();this.ready=true;this.renderShell();await this.mount();this.renderControls();this.emit();return this;}
  renderShell(){
    this.root.innerHTML=`
      <div class="person-switch" role="group" aria-label="Основа персонажа">
        <button type="button" data-base="character-01">ГЕНА</button><button type="button" data-base="character-02">МАРТА</button>
      </div>
      <div class="person-stage-v10"><div id="person-live" class="character-slot big"></div><div class="person-tools"><button type="button" data-random title="Случайный образ">↻</button><button type="button" data-face title="Проверить мимику">◉</button></div><div class="face-preview-label" data-face-label></div></div>
      <div class="person-cats" data-cats></div><div class="person-variants" data-variants></div>
      <p class="person-rule" data-rule></p>`;
    this.root.querySelectorAll('[data-base]').forEach(b=>b.onclick=()=>this.setBase(b.dataset.base));
    this.root.querySelector('[data-random]').onclick=()=>this.randomize();
    this.root.querySelector('[data-face]').onclick=()=>this.cycleFace();
  }
  async mount(){const preview=this.root.querySelector('#person-live');this.renderer=await mountCharacter(preview,this.baseCharacterId,{side:'A',appearance:this.appearance(),face:FACE_PREVIEWS[this.faceIndex].face});this.syncBase();}
  syncBase(){this.root.querySelectorAll('[data-base]').forEach(b=>b.classList.toggle('active',b.dataset.base===this.baseCharacterId));}
  available(category){return variantOptions(this.baseCharacterId,category);}
  selected(category){const key=variantKey(category);const bucket=SHARED_APPEARANCE_CATEGORIES.includes(category)?this.shared:this.owned[this.baseCharacterId];return key?bucket[key]??null:null;}
  renderControls(){
    const cats=this.root.querySelector('[data-cats]');
    cats.innerHTML=CATEGORIES.map(c=>{const count=this.available(c.id).length,disabled=count===0;return `<button type="button" data-cat="${c.id}" class="${this.activeCategory===c.id?'active':''}" ${disabled?'disabled':''}>${c.label}<small>${disabled?'—':count}</small></button>`}).join('');
    cats.querySelectorAll('[data-cat]:not([disabled])').forEach(b=>b.onclick=()=>{this.activeCategory=b.dataset.cat;this.renderControls()});
    const opts=this.available(this.activeCategory),active=this.selected(this.activeCategory),rack=this.root.querySelector('[data-variants]');
    if(!opts.length){rack.innerHTML='<span class="no-variants">ДЛЯ ЭТОЙ ОСНОВЫ ОТДЕЛЬНЫХ ВАРИАНТОВ НЕТ.</span>';}else{
      const baseLabel=CHARACTER_OWNED_CATEGORIES.includes(this.activeCategory)?'БАЗА':'НЕТ';
      rack.innerHTML=`<button type="button" data-variant="" class="${active==null?'active':''}">${baseLabel}</button>${opts.map((id,i)=>`<button type="button" data-variant="${id}" class="${active===id?'active':''}">${String(i+1).padStart(2,'0')}</button>`).join('')}`;
      rack.querySelectorAll('[data-variant]').forEach(b=>b.onclick=()=>this.setVariant(this.activeCategory,b.dataset.variant||null));
    }
    const female=this.baseCharacterId==='character-02';
    this.root.querySelector('[data-rule]').textContent=female?'У МАРТЫ НЕТ ОТДЕЛЬНОЙ БОРОДЫ И СМЕННОЙ ОДЕЖДЫ: ЭТО НЕ БАГ — ТАК УСТРОЕН ИСХОДНЫЙ SVG.':'ОБВЕС ОБЩИЙ МЕЖДУ ОСНОВАМИ, ОДЕЖДА И ОБУВЬ — СВОИ ДЛЯ КАЖДОЙ.';
    this.root.querySelector('[data-face-label]').textContent=`МИМИКА: ${FACE_PREVIEWS[this.faceIndex].label} · ТОЛЬКО ПРОСМОТР`;
    this.syncBase();
  }
  async setBase(id){if(!CHARACTER_REGISTRY[id]||id===this.baseCharacterId)return;this.baseCharacterId=id;const valid=this.appearance();for(const c of SHARED_APPEARANCE_CATEGORIES){const key=variantKey(c);if(key)this.shared[key]=valid[key]??null}this.activeCategory=this.available(this.activeCategory).length?this.activeCategory:'hat';await this.mount();this.renderControls();this.emit();}
  setVariant(category,value){const key=variantKey(category),options=this.available(category);if(!key)return;const next=value&&options.includes(value)?value:null;if(SHARED_APPEARANCE_CATEGORIES.includes(category))this.shared={...this.shared,[key]:next};else this.owned={...this.owned,[this.baseCharacterId]:{...this.owned[this.baseCharacterId],[key]:next}};this.renderCurrent();this.renderControls();this.emit();}
  renderCurrent(){this.renderer?.render({state:{energy:72,brain:15,tension:10,contact:60,memory:{}},face:FACE_PREVIEWS[this.faceIndex].face,visual:{characterId:this.baseCharacterId,appearance:this.appearance()}});}
  cycleFace(){this.faceIndex=(this.faceIndex+1)%FACE_PREVIEWS.length;this.renderCurrent();this.renderControls();}
  randomize(){for(const c of CATEGORIES){const opts=this.available(c.id),key=variantKey(c.id);if(!opts.length||!key)continue;const choices=[null,...opts],next=choices[Math.floor(Math.random()*choices.length)];if(SHARED_APPEARANCE_CATEGORIES.includes(c.id))this.shared={...this.shared,[key]:next};else this.owned={...this.owned,[this.baseCharacterId]:{...this.owned[this.baseCharacterId],[key]:next}}}this.renderCurrent();this.renderControls();this.emit();}
  emit(){this.onChange(this.value());}
}
