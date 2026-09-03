import { NODE_SPECS } from '../core/model.mjs';

const node=(id,type,p={},x=160,y=0)=>({id,type,p:{...(NODE_SPECS[type]?.defaults||{}),...p},ui:{x,y}});
const edge=(id,from,to)=>({id,from,to});
const RESPONSE_TRIGGERS=Object.freeze(['ignore','pushback','acceptance','deflection','underpressure']);
const SYSTEM_TRIGGER_TYPES=Object.freeze(['criticism',...RESPONSE_TRIGGERS]);
function graph(id,nodes,edges){
  const opening=nodes.find(n=>n.type==='criticism');if(!opening)return {id,nodes,edges};
  const targets=edges.filter(e=>e.from===opening.id).map(e=>e.to);
  const extraNodes=RESPONSE_TRIGGERS.map((type,i)=>node(`${opening.id}-${type}`,type,{},160,-90-(i*70)));
  const extraEdges=[];for(const n of extraNodes)for(const to of targets)extraEdges.push(edge(`${n.id}-to-${to}`,n.id,to));
  return {id,nodes:[...nodes,...extraNodes],edges:[...edges,...extraEdges]};
}

export const BRAIN_PRESETS=Object.freeze([
  {id:'always-right',label:'Я ВСЕГДА ПРАВ',graph:graph('preset-always-right',[
    node('p1-trigger','criticism',{},160,30),node('p1-state','resentment',{},160,150),node('p1-impulse','beright',{weight:5},160,270),node('p1-reaction','explain',{},160,390),node('p1-repeat','repeat',{count:3},160,510)
  ],[edge('p1-e1','p1-trigger','p1-state'),edge('p1-e2','p1-state','p1-impulse'),edge('p1-e3','p1-impulse','p1-reaction'),edge('p1-e4','p1-reaction','p1-repeat')])},
  {id:'explain-everything',label:'СЕЙЧАС ВСЁ ОБЪЯСНЮ',graph:graph('preset-explain-everything',[
    node('p2-trigger','criticism',{},160,30),node('p2-impulse','understand',{weight:2},70,170),node('p2-right','beright',{weight:4},250,170),node('p2-reaction','explain',{},160,330),node('p2-repeat','repeat',{count:4},160,470)
  ],[edge('p2-e1','p2-trigger','p2-impulse'),edge('p2-e2','p2-trigger','p2-right'),edge('p2-e3','p2-impulse','p2-reaction'),edge('p2-e4','p2-right','p2-reaction'),edge('p2-e5','p2-reaction','p2-repeat')])},
  {id:'keep-peace',label:'ЛИШЬ БЫ НЕ РУГАЛИСЬ',graph:graph('preset-keep-peace',[
    node('p3-trigger','criticism',{},160,30),node('p3-trust','trust',{delta:1},160,150),node('p3-liked','beliked',{weight:5},160,270),node('p3-agree','agree',{},80,400),node('p3-silent','silent',{},250,400),node('p3-stop','stop',{},160,540)
  ],[edge('p3-e1','p3-trigger','p3-trust'),edge('p3-e2','p3-trust','p3-liked'),edge('p3-e3','p3-liked','p3-agree'),edge('p3-e4','p3-liked','p3-silent'),edge('p3-e5','p3-agree','p3-stop'),edge('p3-e6','p3-silent','p3-stop')])},
  {id:'just-asked',label:'Я ПРОСТО СПРОСИЛ',graph:graph('preset-just-asked',[
    node('p4-trigger','criticism',{},160,30),node('p4-understand','understand',{weight:4},160,170),node('p4-joke','joke',{},160,310),node('p4-stop','stop',{},160,450)
  ],[edge('p4-e1','p4-trigger','p4-understand'),edge('p4-e2','p4-understand','p4-joke'),edge('p4-e3','p4-joke','p4-stop')])},
  {id:'dont-care',label:'МНЕ ВСЁ РАВНО',graph:graph('preset-dont-care',[
    node('p5-trigger','criticism',{},160,30),node('p5-silent','silent',{},160,190),node('p5-stop','stop',{},160,350)
  ],[edge('p5-e1','p5-trigger','p5-silent'),edge('p5-e2','p5-silent','p5-stop')])},
  {id:'see-what-happens',label:'ПОСМОТРИМ, ЧТО БУДЕТ',graph:graph('preset-see-what-happens',[
    node('p6-trigger','criticism',{},160,30),node('p6-joke','joke',{},70,190),node('p6-pressure','pressure',{},250,190),node('p6-repeat','repeat',{count:2},250,350),node('p6-stop','stop',{},100,500)
  ],[edge('p6-e1','p6-trigger','p6-joke'),edge('p6-e2','p6-trigger','p6-pressure'),edge('p6-e3','p6-pressure','p6-repeat'),edge('p6-e4','p6-joke','p6-stop'),edge('p6-e5','p6-repeat','p6-stop')])}
]);

export const BLANK_BRAIN=Object.freeze({
  id:'custom-catastrophe',
  nodes:SYSTEM_TRIGGER_TYPES.map((type,i)=>node(`custom-${type}`,type,{enabled:false},160,-30-(i*70))),
  edges:[]
});
export function cloneBrainGraph(source){return {id:source.id,nodes:source.nodes.map(n=>({...n,p:{...(n.p||{})},ui:{...(n.ui||{})}})),edges:source.edges.map(e=>({...e}))}}
export function brainPreset(id){return BRAIN_PRESETS.find(p=>p.id===id)||null}
