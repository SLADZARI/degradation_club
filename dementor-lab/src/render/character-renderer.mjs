export function visualStateFromMetrics(s){
  const brain=s.brain??0,tension=s.tension??0,energy=s.energy??100,contact=s.contact??50;
  let eyes='neutral',brows='neutral',mouth='neutral';
  if(energy<=25)eyes='sleepy';
  if(brain>=65)eyes='tense';
  if(brain>=85)eyes='overheat';
  if(tension>=55)brows='tense';
  if(tension>=75)brows='angry';
  if(contact>=75&&brain<85&&tension<55)mouth='soft';
  if(contact<=25)mouth='tense';
  if(brain>=92)mouth='open';
  return {eyes,brows,mouth,motion:{amplitude:energy<=25?.45:energy<=60?.72:1,headDrop:energy<=25?1:0,headInstability:brain>=85?Math.min(1,(brain-84)/16):0,gestureSharpness:tension>=55?Math.min(1,(tension-54)/46):0,orientToPartner:contact>=75?.5:contact<=25?-.35:0}};
}
export function resolveVisualState(character={}){const derived=visualStateFromMetrics(character.state||{}),override=character.face||{};return {...derived,...override,motion:{...derived.motion,...(override.motion||{})}}}
export const APPEARANCE_LAYERS=Object.freeze(['hat','glasses','beard','accessory','outfit','shoes']);
export const APPEARANCE_VARIANTS=Object.freeze({
  hat:{key:'hatVariant',prefix:'hat',legacy:'hat'},
  glasses:{key:'glassesVariant',prefix:'glasses',legacy:'glasses'},
  facialHair:{key:'facialHairVariant',prefix:'facial-hair',legacy:'beard'},
  accessory:{key:'accessoryVariant',prefix:'accessory',legacy:'accessory'},
  outfit:{key:'outfitVariant',prefix:'outfit',legacy:'outfit',baseWhenNull:true},
  shoes:{key:'shoesVariant',prefix:'shoes',legacy:'shoes',baseWhenNull:true}
});
const COLOR_KEYS=Object.freeze({outfitPrimary:'outfit-primary',outfitSecondary:'outfit-secondary',shoesPrimary:'shoes-primary'});
const DEFAULT_RIG=Object.freeze({head:[352,270],shoulderLeft:[275,345],shoulderRight:[425,345],hipLeft:[311,590],hipRight:[393,591]});

function readRig(svg,fallback=null){
  if(!svg)return fallback||DEFAULT_RIG;
  const raw=svg.getAttribute('data-rig-pivots');
  if(raw){try{return {...DEFAULT_RIG,...JSON.parse(raw)}}catch{}}
  const meta=svg.querySelector('metadata#dementor-rig-meta');
  if(meta?.textContent){try{return {...DEFAULT_RIG,...JSON.parse(meta.textContent)}}catch{}}
  return fallback||DEFAULT_RIG;
}

export class CharacterRenderer{
  constructor({side,root,rigFallback=null}){this.side=side;this.root=root;this.rigFallback=rigFallback;this.svg=root?.querySelector('svg')||null;this.rig=readRig(this.svg,rigFallback)}
  refresh(){this.svg=this.root?.querySelector('svg')||null;this.rig=readRig(this.svg,this.rigFallback);return this}
  el(name){if(!this.svg)return null;const escaped=CSS.escape(name),prefixed=CSS.escape(`${this.side}-${name}`);return this.svg.querySelector(`#${prefixed}`)||this.svg.querySelector(`#${escaped}`)}
  variants(group,active){const groups={eyes:['neutral','tense','sleepy','overheat'],brows:['neutral','tense','angry'],mouth:['neutral','soft','tense','open']};(groups[group]||[]).forEach(v=>{const el=this.el(`${group}-${v}`);if(el)el.style.opacity=v===active?'1':'0'})}
  variantElements(prefix){
    if(!this.svg)return [];
    const selectors=[`[id^="${CSS.escape(prefix)}-"]`,`[id^="${CSS.escape(`${this.side}-${prefix}`)}-"]`];
    return [...new Set(selectors.flatMap(selector=>[...this.svg.querySelectorAll(selector)]))];
  }
  setVariant(prefix,active){
    const variants=this.variantElements(prefix);
    variants.forEach(el=>{const id=el.id.replace(new RegExp(`^${this.side}-`),'');el.style.display=id===active?'':'none'});
    return variants.length>0;
  }
  setColorTarget(id,value){
    if(!value)return;
    const root=this.el(id);if(!root)return;
    const paint=el=>{const fill=el.getAttribute?.('fill');if(fill!=='none')el.style.fill=value};
    paint(root);root.querySelectorAll?.('[fill]').forEach(paint);
  }
  appearance(visual={}){
    const state=visual.appearance||{};
    if(state.variantContract){
      Object.values(APPEARANCE_VARIANTS).forEach(({key,prefix,legacy,baseWhenNull=false})=>{
        const selected=state[key]??null;
        const hasVariants=this.setVariant(prefix,selected);
        const legacyEl=this.el(legacy);
        if(legacyEl)legacyEl.style.display=hasVariants?'none':baseWhenNull?'':selected?'':'none';
      });
      const colors=state.colors||{};Object.entries(COLOR_KEYS).forEach(([key,id])=>this.setColorTarget(id,colors[key]));
      return;
    }
    APPEARANCE_LAYERS.forEach(name=>{const el=this.el(name);if(el)el.style.display=state[name]===false?'none':''});
  }
  render(character){
    if(!character)return;if(!this.svg)this.refresh();if(!this.svg)return;
    const face=resolveVisualState(character),m=face.motion||{},rig=this.rig||DEFAULT_RIG;
    this.appearance(character.visual||{});this.variants('eyes',face.eyes||'neutral');this.variants('brows',face.brows||'neutral');this.variants('mouth',face.mouth||'neutral');
    const head=this.el('head-rig');if(head){const [cx,cy]=rig.head||DEFAULT_RIG.head;head.style.transformOrigin=`${cx}px ${cy}px`;const sign=this.side==='A'?1:-1;head.style.transform=`translateY(${(m.headDrop||0)*6}px) rotate(${((m.headInstability||0)+(m.orientToPartner||0))*2*sign}deg)`}
    const left=this.el('body-arm-left'),right=this.el('body-arm-right'),amp=m.amplitude??1,sharp=m.gestureSharpness||0;
    if(left){const [cx,cy]=rig.shoulderLeft||DEFAULT_RIG.shoulderLeft;left.style.transformOrigin=`${cx}px ${cy}px`;left.style.transform=`rotate(${-sharp*7*amp}deg)`}
    if(right){const [cx,cy]=rig.shoulderRight||DEFAULT_RIG.shoulderRight;right.style.transformOrigin=`${cx}px ${cy}px`;right.style.transform=`rotate(${sharp*9*amp}deg)`}
  }
  breakdown(character,reason){this.render(character);this.root?.classList.remove('lost','brain','energy','contact');this.root?.classList.add('lost');const key=String(reason||'').toUpperCase().includes('ENERGY')?'energy':String(reason||'').toUpperCase().includes('CONTACT')?'contact':'brain';this.root?.classList.add(key);if(key==='brain'){this.variants('eyes','overheat');this.variants('brows','angry');this.variants('mouth','open')}if(key==='energy'){this.variants('eyes','sleepy');this.variants('brows','neutral');this.variants('mouth','tense')}if(key==='contact'){this.variants('eyes','tense');this.variants('brows','tense');this.variants('mouth','tense')}}
}
