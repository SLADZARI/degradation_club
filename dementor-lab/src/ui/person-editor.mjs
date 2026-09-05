import {CharacterRenderer} from '../render/character-renderer.mjs';
import {CHARACTER_REGISTRY,characterSpec,characterAssetText,loadCharacterContract,appearanceForCharacter,variantOptions,variantKey,SHARED_APPEARANCE_CATEGORIES} from '../render/character-registry.mjs';

// Product-facing wardrobe taxonomy. Keep the richer SVG contract underneath,
// but expose the compact four-part menu we already validated on mobile.
const CATEGORIES=Object.freeze([
  {id:'hat',label:'ГОЛОВА'},
  {id:'accessories',label:'АКСЕССУАРЫ'},
  {id:'facialHair',label:'УСЫ'},
  {id:'outfit',label:'ОДЕЖДА'}
]);
const RANDOM_CATEGORIES=Object.freeze(['hat','glasses','accessory','facialHair','outfit']);
const EMPTY_SHARED=()=>({hatVariant:null,glassesVariant:null,facialHairVariant:null,accessoryVariant:null});
const EMPTY_OWNED=()=>({outfitVariant:null,shoesVariant:null});
const EMPTY_COLORS=()=>({outfitPrimary:null,outfitSecondary:null,shoesPrimary:null});
const NEUTRAL_FACE=Object.freeze({eyes:'neutral',brows:'neutral',mouth:'neutral'});

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
    this.activeCategory='hat';this.renderer=null;this.ready=false;
  }
  appearance(){return appearanceForCharacter(this.baseCharacterId,this.shared,this.owned[this.baseCharacterId],this.colors[this.baseCharacterId]);}
  value(){return {baseCharacterId:this.baseCharacterId,gender:this.baseCharacterId==='character-02'?'female':'male',sharedAppearance:{...this.shared},ownedAppearance:{...this.owned[this.baseCharacterId]},colors:{...this.colors[this.baseCharacterId]},appearance:this.appearance()};}
  async init(){
    await ensureCharacterContracts();this.ready=true;
    // v1.0 temporarily exposed implementation notes under PERSON. They are QA
    // copy, not game UI, so remove the old sibling if this editor is mounted in it.
    this.root.parentElement?.querySelector('.person-fact')?.remove();
    this.renderShell();await this.mount();this.renderControls();this.emit();return this;
  }
  renderShell(){
    this.root.innerHTML=`
      <div class="person-switch" role="group" aria-label="Основа персонажа">
        <button type="button" data-base="character-01">ГЕНА</button><button type="button" data-base="character-02">МАРТА</button>
      </div>
      <div class="person-stage-v10"><div id="person-live" class="character-slot big"></div><div class="person-tools"><button type="button" data-random title="Случайный образ" aria-label="Случайный образ">↻</button><button type="button" data-reset title="Сбросить образ" aria-label="Сбросить образ">×</button></div></div>
      <div class="person-cats" data-cats></div><div class="person-variants" data-variants></div>`;
    this.root.querySelectorAll('[data-base]').forEach(b=>b.onclick=()=>this.setBase(b.dataset.base));
    this.root.querySelector('[data-random]').onclick=()=>this.randomize();
    this.root.querySelector('[data-reset]').onclick=()=>this.reset();
  }
  async mount(){const preview=this.root.querySelector('#person-live');this.renderer=await mountCharacter(preview,this.baseCharacterId,{side:'A',appearance:this.appearance(),face:NEUTRAL_FACE});this.syncBase();}
  syncBase(){this.root.querySelectorAll('[data-base]').forEach(b=>b.classList.toggle('active',b.dataset.base===this.baseCharacterId));}
  available(category){return variantOptions(this.baseCharacterId,category);}
  selected(category){const key=variantKey(category);const bucket=SHARED_APPEARANCE_CATEGORIES.includes(category)?this.shared:this.owned[this.baseCharacterId];return key?bucket[key]??null:null;}
  categoryCount(id){if(id==='accessories')return this.available('glasses').length+this.available('accessory').length;return this.available(id).length;}
  categoryDisabled(id){if(id==='accessories')return this.categoryCount(id)===0;return this.available(id).length===0;}
  renderControls(){
    const cats=this.root.querySelector('[data-cats]');
    cats.innerHTML=CATEGORIES.map(c=>{const count=this.categoryCount(c.id),disabled=this.categoryDisabled(c.id);return `<button type="button" data-cat="${c.id}" class="${this.activeCategory===c.id?'active':''}" ${disabled?'disabled':''}>${c.label}<small>${disabled?'—':count}</small></button>`}).join('');
    cats.querySelectorAll('[data-cat]:not([disabled])').forEach(b=>b.onclick=()=>{this.activeCategory=b.dataset.cat;this.renderControls()});
    if(this.activeCategory==='accessories')this.renderAccessories();else this.renderSingle(this.activeCategory);
    this.syncBase();
  }
  renderSingle(category){
    const rack=this.root.querySelector('[data-variants]'),opts=this.available(category),active=this.selected(category);
    if(!opts.length){rack.innerHTML='';return;}
    const baseLabel=category==='outfit'?'БАЗА':'НЕТ';
    rack.innerHTML=`<button type="button" data-category="${category}" data-variant="" class="${active==null?'active':''}">${baseLabel}</button>${opts.map((id,i)=>`<button type="button" data-category="${category}" data-variant="${id}" class="${active===id?'active':''}">${String(i+1).padStart(2,'0')}</button>`).join('')}`;
    rack.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>this.setVariant(b.dataset.category,b.dataset.variant||null));
  }
  renderAccessories(){
    const rack=this.root.querySelector('[data-variants]'),groups=[['glasses','ОЧКИ'],['accessory','ДЕТАЛИ']];
    rack.innerHTML=groups.map(([category,label])=>{const opts=this.available(category),active=this.selected(category);if(!opts.length)return '';return `<div class="variant-group"><b>${label}</b><div><button type="button" data-category="${category}" data-variant="" class="${active==null?'active':''}">НЕТ</button>${opts.map((id,i)=>`<button type="button" data-category="${category}" data-variant="${id}" class="${active===id?'active':''}">${String(i+1).padStart(2,'0')}</button>`).join('')}</div></div>`}).join('');
    rack.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>this.setVariant(b.dataset.category,b.dataset.variant||null));
  }
  async setBase(id){if(!CHARACTER_REGISTRY[id]||id===this.baseCharacterId)return;this.baseCharacterId=id;const valid=this.appearance();for(const c of SHARED_APPEARANCE_CATEGORIES){const key=variantKey(c);if(key)this.shared[key]=valid[key]??null}if(this.categoryDisabled(this.activeCategory))this.activeCategory='hat';await this.mount();this.renderControls();this.emit();}
  setVariant(category,value){const key=variantKey(category),options=this.available(category);if(!key)return;const next=value&&options.includes(value)?value:null;if(SHARED_APPEARANCE_CATEGORIES.includes(category))this.shared={...this.shared,[key]:next};else this.owned={...this.owned,[this.baseCharacterId]:{...this.owned[this.baseCharacterId],[key]:next}};this.renderCurrent();this.renderControls();this.emit();}
  renderCurrent(){this.renderer?.render({state:{energy:72,brain:15,tension:10,contact:60,memory:{}},face:NEUTRAL_FACE,visual:{characterId:this.baseCharacterId,appearance:this.appearance()}});}
  reset(){this.shared=EMPTY_SHARED();this.owned={'character-01':EMPTY_OWNED(),'character-02':EMPTY_OWNED()};this.colors={'character-01':EMPTY_COLORS(),'character-02':EMPTY_COLORS()};this.activeCategory='hat';this.renderCurrent();this.renderControls();this.emit();}
  randomize(){for(const category of RANDOM_CATEGORIES){const opts=this.available(category),key=variantKey(category);if(!opts.length||!key)continue;const choices=[null,...opts],next=choices[Math.floor(Math.random()*choices.length)];if(SHARED_APPEARANCE_CATEGORIES.includes(category))this.shared={...this.shared,[key]:next};else this.owned={...this.owned,[this.baseCharacterId]:{...this.owned[this.baseCharacterId],[key]:next}}}this.renderCurrent();this.renderControls();this.emit();}
  emit(){this.onChange(this.value());}
}
