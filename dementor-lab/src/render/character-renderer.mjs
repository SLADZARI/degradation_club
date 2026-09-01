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

export function resolveVisualState(character={}){
  const derived=visualStateFromMetrics(character.state||{}),override=character.face||{};
  return {...derived,...override,motion:{...derived.motion,...(override.motion||{})}};
}

export const APPEARANCE_LAYERS=Object.freeze(['hat','glasses','beard','accessory','outfit','shoes']);

export class CharacterRenderer{
  constructor({side,root}){this.side=side;this.root=root;this.svg=root?.querySelector('svg')||null}
  refresh(){this.svg=this.root?.querySelector('svg')||null;return this}
  el(name){
    if(!this.svg)return null;
    const escaped=CSS.escape(name),prefixed=CSS.escape(`${this.side}-${name}`);
    return this.svg.querySelector(`#${prefixed}`)||this.svg.querySelector(`#${escaped}`);
  }
  variants(group,active){
    const groups={eyes:['neutral','tense','sleepy','overheat'],brows:['neutral','tense','angry'],mouth:['neutral','soft','tense','open']};
    (groups[group]||[]).forEach(v=>{const el=this.el(`${group}-${v}`);if(el)el.style.opacity=v===active?'1':'0'});
  }
  appearance(visual={}){
    const state=visual.appearance||{};
    APPEARANCE_LAYERS.forEach(name=>{const el=this.el(name);if(el)el.style.display=state[name]===false?'none':''});
  }
  render(character){
    if(!character)return;
    if(!this.svg)this.refresh();
    if(!this.svg)return;
    const face=resolveVisualState(character),m=face.motion||{};
    this.appearance(character.visual||{});
    this.variants('eyes',face.eyes||'neutral');this.variants('brows',face.brows||'neutral');this.variants('mouth',face.mouth||'neutral');
    const head=this.el('head-rig');
    if(head){head.style.transformOrigin='352px 270px';const sign=this.side==='A'?1:-1;head.style.transform=`translateY(${(m.headDrop||0)*6}px) rotate(${((m.headInstability||0)+(m.orientToPartner||0))*2*sign}deg)`}
    const left=this.el('body-arm-left'),right=this.el('body-arm-right'),amp=m.amplitude??1,sharp=m.gestureSharpness||0;
    if(left){left.style.transformOrigin='275px 345px';left.style.transform=`rotate(${-sharp*7*amp}deg)`}
    if(right){right.style.transformOrigin='425px 345px';right.style.transform=`rotate(${sharp*9*amp}deg)`}
  }
  breakdown(character,reason){
    this.render(character);this.root?.classList.remove('lost','brain','energy','contact');this.root?.classList.add('lost');
    const key=String(reason||'').toUpperCase().includes('ENERGY')?'energy':String(reason||'').toUpperCase().includes('CONTACT')?'contact':'brain';this.root?.classList.add(key);
    if(key==='brain'){this.variants('eyes','overheat');this.variants('brows','angry');this.variants('mouth','open')}
    if(key==='energy'){this.variants('eyes','sleepy');this.variants('brows','neutral');this.variants('mouth','tense')}
    if(key==='contact'){this.variants('eyes','tense');this.variants('brows','tense');this.variants('mouth','tense')}
  }
}
