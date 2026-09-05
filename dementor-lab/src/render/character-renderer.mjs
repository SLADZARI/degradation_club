export function visualStateFromMetrics(s){
  const brain=s.brain??0,tension=s.tension??0,energy=s.energy??100,contact=s.contact??50;
  let eyes='neutral',brows='neutral',mouth='neutral';
  // Face states must be readable during ordinary turns, not only at terminal values.
  // The production SVGs were fine; previous thresholds left almost every real run neutral.
  if(energy<=48)eyes='sleepy';
  if(brain>=22)eyes='tense';
  if(brain>=55)eyes='overheat';
  if(tension>=22)brows='tense';
  if(tension>=45)brows='angry';
  if(contact>=66&&brain<55&&tension<45)mouth='soft';
  if(contact<=52)mouth='tense';
  if(brain>=62||tension>=68)mouth='open';
  return {eyes,brows,mouth,motion:{amplitude:energy<=25?.45:energy<=60?.72:1,headDrop:energy<=25?1:0,headInstability:brain>=55?Math.min(1,(brain-54)/46):0,gestureSharpness:tension>=22?Math.min(1,(tension-21)/79):0,orientToPartner:contact>=66?.5:contact<=52?-.35:0}};
}
export function resolveVisualState(character={}){const derived=visualStateFromMetrics(character.state||{}),override=character.face||{};return {...derived,...override,motion:{...derived.motion,...(override.motion||{})}}}
export function reactionCueFromDelta(delta={}){
  const brain=Number(delta.brain||0),tension=Number(delta.tension||0),contact=Number(delta.contact||0),energy=Number(delta.energy||0);
  let kind='steady',strength=0;
  const candidates=[['overheat',Math.max(0,brain)/18],['tension',Math.max(0,tension)/14],['withdraw',Math.max(0,-contact)/12],['connect',Math.max(0,contact)/12],['relief',Math.max(0,-tension)/12],['fatigue',Math.max(0,-energy)/16]];
  for(const [next,value] of candidates)if(value>strength){kind=next;strength=value}
  return {kind,strength:Math.max(0,Math.min(1,strength))};
}
export function faceOverrideFromReactionCue(cue={}){
  const strength=Number(cue.strength||0);if(strength<=0)return {};
  if(cue.kind==='overheat')return {eyes:strength>.55?'overheat':'tense',brows:'tense',motion:{headInstability:.35+.65*strength,gestureSharpness:.25+.5*strength}};
  if(cue.kind==='tension')return {brows:strength>.55?'angry':'tense',mouth:'tense',motion:{gestureSharpness:.3+.7*strength}};
  if(cue.kind==='withdraw')return {eyes:'tense',mouth:'tense',motion:{orientToPartner:-.25-.5*strength}};
  if(cue.kind==='connect')return {mouth:'soft',motion:{orientToPartner:.25+.5*strength}};
  if(cue.kind==='relief')return {brows:'neutral',mouth:'soft',motion:{orientToPartner:.15+.25*strength}};
  if(cue.kind==='fatigue')return {eyes:'sleepy',motion:{amplitude:Math.max(.45,1-.45*strength),headDrop:.25+.75*strength}};
  return {};
}
export const APPEARANCE_LAYERS=Object.freeze(['hat','glasses','beard','accessory','outfit','shoes']);
export const APPEARANCE_VARIANTS=Object.freeze({hat:{key:'hatVariant',prefix:'hat',legacy:'hat'},glasses:{key:'glassesVariant',prefix:'glasses',legacy:'glasses'},facialHair:{key:'facialHairVariant',prefix:'facial-hair',legacy:'beard'},accessory:{key:'accessoryVariant',prefix:'accessory',legacy:'accessory'},outfit:{key:'outfitVariant',prefix:'outfit',legacy:'outfit',baseWhenNull:true},shoes:{key:'shoesVariant',prefix:'shoes',legacy:'shoes',baseWhenNull:true}});
const COLOR_KEYS=Object.freeze({outfitPrimary:'outfit-primary',outfitSecondary:'outfit-secondary',shoesPrimary:'shoes-primary'});
const DEFAULT_RIG=Object.freeze({head:[352,270],shoulderLeft:[275,345],shoulderRight:[425,345],hipLeft:[311,590],hipRight:[393,591]});
const FACE_LINE='fill="none" stroke="#111" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="1"';
const LEGACY_FACE_GEOMETRY=Object.freeze({
  'character-01':Object.freeze({
    'eyes-tense':`<path d="M309 210 L332 205 M371 205 L394 210" ${FACE_LINE}/>` ,
    'eyes-sleepy':`<path d="M310 210 Q322 217 334 210 M370 210 Q382 217 394 210" ${FACE_LINE}/>` ,
    'eyes-overheat':`<path d="M312 199 L332 219 M332 199 L312 219 M372 199 L392 219 M392 199 L372 219" ${FACE_LINE}/>` ,
    'brows-tense':`<path d="M308 191 L336 184 M368 184 L396 191" ${FACE_LINE}/>` ,
    'brows-angry':`<path d="M308 187 L336 196 M368 196 L396 187" ${FACE_LINE}/>` ,
    'mouth-soft':`<path d="M333 260 Q352 278 372 260" ${FACE_LINE}/>` ,
    'mouth-tense':`<path d="M331 269 L374 269" ${FACE_LINE}/>` ,
    'mouth-open':'<ellipse cx="352" cy="267" rx="19" ry="13" fill="#111" stroke="none" opacity="1"/>'
  }),
  'character-02':Object.freeze({
    'eyes-tense':`<path d="M311 214 L334 207 M370 207 L393 214" ${FACE_LINE}/>` ,
    'eyes-sleepy':`<path d="M312 214 Q324 220 336 214 M368 214 Q380 220 392 214" ${FACE_LINE}/>` ,
    'eyes-overheat':`<path d="M314 203 L334 223 M334 203 L314 223 M370 203 L390 223 M390 203 L370 223" ${FACE_LINE}/>` ,
    'brows-tense':`<path d="M310 194 L338 187 M366 187 L394 194" ${FACE_LINE}/>` ,
    'brows-angry':`<path d="M310 190 L338 199 M366 199 L394 190" ${FACE_LINE}/>` ,
    'mouth-soft':`<path d="M334 267 Q352 283 370 267" ${FACE_LINE}/>` ,
    'mouth-tense':`<path d="M333 274 L371 274" ${FACE_LINE}/>` ,
    'mouth-open':'<ellipse cx="352" cy="273" rx="18" ry="12" fill="#111" stroke="none" opacity="1"/>'
  })
});
function readRig(svg,fallback=null){if(!svg)return fallback||DEFAULT_RIG;const raw=svg.getAttribute('data-rig-pivots');if(raw){try{return {...DEFAULT_RIG,...JSON.parse(raw)}}catch{}}const meta=svg.querySelector('metadata#dementor-rig-meta');if(meta?.textContent){try{return {...DEFAULT_RIG,...JSON.parse(meta.textContent)}}catch{}}return fallback||DEFAULT_RIG}
function unprefixedId(id='',side=''){return String(id).replace(new RegExp(`^${side}-`),'')}
export function isNumberedVariantId(id,prefix,side=''){const normalized=unprefixedId(id,side);return normalized.startsWith(`${prefix}-`)&&/^\d+$/.test(normalized.slice(prefix.length+1))}
function authoredVisible(el){return el?.getAttribute?.('display')!=='none'&&el?.style?.display!=='none'}
export function legacyVariantLayerDisplay({hasVariants=false,wrapsVariants=false,baseWhenNull=false,selected=null}={}){if(hasVariants)return wrapsVariants?'inline':'none';return baseWhenNull?'':selected?'':'none'}
export class CharacterRenderer{
  constructor({side,root,rigFallback=null}){this.side=side;this.root=root;this.rigFallback=rigFallback;this.svg=root?.querySelector('svg')||null;this.rig=readRig(this.svg,rigFallback);this.variantDefaults=new Map();this.restoreLegacyFaceGeometry()}
  refresh(){this.svg=this.root?.querySelector('svg')||null;this.rig=readRig(this.svg,this.rigFallback);this.variantDefaults.clear();this.restoreLegacyFaceGeometry();return this}
  el(name){if(!this.svg)return null;const escaped=CSS.escape(name),prefixed=CSS.escape(`${this.side}-${name}`);return this.svg.querySelector(`#${prefixed}`)||this.svg.querySelector(`#${escaped}`)}
  characterId(){return this.root?.dataset?.character||this.svg?.querySelector('[data-character-id]')?.getAttribute('data-character-id')||'character-01'}
  restoreLegacyFaceGeometry(){
    if(!this.svg)return;
    const geometry=LEGACY_FACE_GEOMETRY[this.characterId()]||LEGACY_FACE_GEOMETRY['character-01'];
    for(const [id,markup] of Object.entries(geometry)){
      const el=this.el(id);if(!el)continue;
      el.innerHTML=markup;
      el.dataset.faceGeometry='legacy-semantic-v2-self-painted';
      el.style.display='none';el.style.visibility='hidden';el.style.opacity='0';
    }
  }
  forceFaceVisible(el,on){
    if(!el)return;
    el.style.display=on?'inline':'none';el.style.visibility=on?'visible':'hidden';el.style.opacity=on?'1':'0';
    if(on){
      el.removeAttribute('display');el.removeAttribute('visibility');el.removeAttribute('opacity');el.removeAttribute('fill-opacity');el.removeAttribute('stroke-opacity');
      el.querySelectorAll('*').forEach(node=>{
        node.style.display='inline';node.style.visibility='visible';node.style.opacity='1';
        node.removeAttribute('display');node.removeAttribute('visibility');node.removeAttribute('opacity');
        if(node.tagName?.toLowerCase()==='path'&&node.getAttribute('fill')==='none'){
          node.setAttribute('stroke','#111');node.setAttribute('stroke-width','7');node.setAttribute('stroke-linecap','round');node.setAttribute('stroke-linejoin','round');node.setAttribute('stroke-opacity','1');
        }
        if(node.hasAttribute('fill-opacity'))node.setAttribute('fill-opacity','1');
      });
    }
  }
  variants(group,active){
    const groups={eyes:['neutral','tense','sleepy','overheat'],brows:['neutral','tense','angry'],mouth:['neutral','soft','tense','open']};
    const wrapper=this.el(group);if(wrapper){wrapper.style.display='inline';wrapper.style.visibility='visible';wrapper.style.opacity='1';wrapper.removeAttribute('display');wrapper.removeAttribute('visibility');wrapper.removeAttribute('opacity')}
    ;(groups[group]||[]).forEach(v=>this.forceFaceVisible(this.el(`${group}-${v}`),v===active));
  }
  variantElements(prefix){if(!this.svg)return [];const selectors=[`[id^="${CSS.escape(prefix)}-"]`,`[id^="${CSS.escape(`${this.side}-${prefix}`)}-"]`];return [...new Set(selectors.flatMap(selector=>[...this.svg.querySelectorAll(selector)]))].filter(el=>isNumberedVariantId(el.id,prefix,this.side))}
  setVariant(prefix,active,{baseWhenNull=false}={}){const variants=this.variantElements(prefix);if(!this.variantDefaults.has(prefix))this.variantDefaults.set(prefix,new Set(variants.filter(authoredVisible).map(el=>unprefixedId(el.id,this.side))));const defaults=this.variantDefaults.get(prefix)||new Set();variants.forEach(el=>{const id=unprefixedId(el.id,this.side),show=active?id===active:baseWhenNull&&defaults.has(id);el.style.display=show?'inline':'none'});return variants.length>0}
  setColorTarget(id,value){if(!value||!this.svg)return;const escaped=CSS.escape(id),prefixed=CSS.escape(`${this.side}-${id}`);const roots=[...new Set([...this.svg.querySelectorAll(`[data-color-target="${escaped}"]`),...this.svg.querySelectorAll(`[id="${escaped}"]`),...this.svg.querySelectorAll(`[id="${prefixed}"]`)])];if(!roots.length)return;const paint=el=>{const fill=el.getAttribute?.('fill');if(fill!=='none')el.style.fill=value};roots.forEach(root=>{paint(root);root.querySelectorAll?.('[fill]').forEach(paint)})}
  appearance(visual={}){const state=visual.appearance||{};if(state.variantContract){Object.values(APPEARANCE_VARIANTS).forEach(({key,prefix,legacy,baseWhenNull=false})=>{const selected=state[key]??null;const variantEls=this.variantElements(prefix);const hasVariants=this.setVariant(prefix,selected,{baseWhenNull});const legacyEl=this.el(legacy);if(legacyEl){const wrapsVariants=hasVariants&&variantEls.some(el=>el!==legacyEl&&legacyEl.contains(el));legacyEl.style.display=legacyVariantLayerDisplay({hasVariants,wrapsVariants,baseWhenNull,selected})}});const colors=state.colors||{};Object.entries(COLOR_KEYS).forEach(([key,id])=>this.setColorTarget(id,colors[key]));return}APPEARANCE_LAYERS.forEach(name=>{const el=this.el(name);if(el)el.style.display=state[name]===false?'none':''})}
  render(character){if(!character)return;if(!this.svg)this.refresh();if(!this.svg)return;const face=resolveVisualState(character),m=face.motion||{},rig=this.rig||DEFAULT_RIG;this.appearance(character.visual||{});this.variants('eyes',face.eyes||'neutral');this.variants('brows',face.brows||'neutral');this.variants('mouth',face.mouth||'neutral');const head=this.el('head-rig');if(head){const [cx,cy]=rig.head||DEFAULT_RIG.head;head.style.transformOrigin=`${cx}px ${cy}px`;const sign=this.side==='A'?1:-1;head.style.transform=`translateY(${(m.headDrop||0)*6}px) rotate(${((m.headInstability||0)+(m.orientToPartner||0))*2*sign}deg)`}const left=this.el('body-arm-left'),right=this.el('body-arm-right'),amp=m.amplitude??1,sharp=m.gestureSharpness||0;if(left){const [cx,cy]=rig.shoulderLeft||DEFAULT_RIG.shoulderLeft;left.style.transformOrigin=`${cx}px ${cy}px`;left.style.transform=`rotate(${-sharp*7*amp}deg)`}if(right){const [cx,cy]=rig.shoulderRight||DEFAULT_RIG.shoulderRight;right.style.transformOrigin=`${cx}px ${cy}px`;right.style.transform=`rotate(${sharp*9*amp}deg)`}}
  breakdown(character,reason){this.render(character);this.root?.classList.remove('lost','brain','energy','contact');this.root?.classList.add('lost');const key=String(reason||'').toUpperCase().includes('ENERGY')?'energy':String(reason||'').toUpperCase().includes('CONTACT')?'contact':'brain';this.root?.classList.add(key);if(key==='brain'){this.variants('eyes','overheat');this.variants('brows','angry');this.variants('mouth','open')}if(key==='energy'){this.variants('eyes','sleepy');this.variants('brows','neutral');this.variants('mouth','tense')}if(key==='contact'){this.variants('eyes','tense');this.variants('brows','tense');this.variants('mouth','tense')}}
}
