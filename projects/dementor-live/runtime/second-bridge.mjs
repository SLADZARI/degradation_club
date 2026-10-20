import {recordMaterial} from './city-expansion.mjs';
// A SECOND, independently funded crossing. Never inferred from bridge 1 progress.
export const SECOND_BRIDGE_PRICE={wood:12,stone:8,works:4,workReward:2};
export const SECOND_BRIDGE_SITE={id:'second-bridge-site',type:'world-bridge',x:33,y:55,title:'Строительство второго моста'};
export function initSecondBridge(g){
 g.state.secondBridgeProject||={stage:0,accepted:{wood:0,stone:0},consumed:{wood:0,stone:0},work:0,spent:0};
}
export function secondBridgeOpen(g){return g.state.secondBridgeProject?.stage===2;}
export function secondBridgeAction(g,p,cmd){
 if(!['secondBridgeDeliver','secondBridgeWork'].includes(cmd?.type))return null;
 if((p.scene||'city')!=='city'||p.spirit||p.job||p.delivery?.picked)throw Error('Сначала завершите текущую работу и вернитесь в город');
 g.near(p,SECOND_BRIDGE_SITE);initSecondBridge(g);
 const project=g.state.secondBridgeProject;
 if(project.stage===2)throw Error('Вторая переправа уже построена');
 if(cmd.type==='secondBridgeDeliver'){
   if(project.stage!==0)throw Error('Материалы уже доставлены');
   const kind=cmd.kind;
   if(!['wood','stone'].includes(kind))throw Error('Привезите древесину или камень');
   const need=SECOND_BRIDGE_PRICE[kind]-project.accepted[kind],qty=Math.min(need,p.bag[kind]||0);
   if(qty<=0)throw Error('Больше материалов этого вида пока не требуется');
   p.bag[kind]-=qty;project.accepted[kind]+=qty;recordMaterial(g,'second-bridge-delivery',kind,qty,'bag','second-bridge',p.id);
   if(project.accepted.wood===SECOND_BRIDGE_PRICE.wood&&project.accepted.stone===SECOND_BRIDGE_PRICE.stone){
     project.stage=1;project.consumed={...project.accepted};for(const kind of ['wood','stone'])recordMaterial(g,'second-bridge-build',kind,project.consumed[kind],'second-bridge','structure',p.id);
   }
   return {message:'Принято на второй мост: '+qty+' '+(kind==='wood'?'древесины':'камня')};
 }
 if(project.stage!==1)throw Error('Сначала доставьте все материалы');
 if(g.cityFunds()<SECOND_BRIDGE_PRICE.workReward)throw Error('Городской бюджет работ исчерпан');
 g.transfer(p,SECOND_BRIDGE_PRICE.workReward,'second-bridge-work');
 project.spent+=SECOND_BRIDGE_PRICE.workReward;
 project.work++;
 if(project.work===SECOND_BRIDGE_PRICE.works){project.stage=2;return {message:'Второй мост открыт для всех жителей!',reward:SECOND_BRIDGE_PRICE.workReward};}
 return {message:'Работа выполнена '+project.work+'/'+SECOND_BRIDGE_PRICE.works,reward:SECOND_BRIDGE_PRICE.workReward};
}
