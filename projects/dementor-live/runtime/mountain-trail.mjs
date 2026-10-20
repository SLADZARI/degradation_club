// Deterministic, server-controlled uphill simulation with a real summit/route.
import {WORLD_SUMMIT_TRAIL} from './world-expansion.mjs';
const halfWidth=.95;
const segments=[];let length=0;
for(let i=1;i<WORLD_SUMMIT_TRAIL.length;i++){
 const [ax,ay]=WORLD_SUMMIT_TRAIL[i-1],[bx,by]=WORLD_SUMMIT_TRAIL[i],d=Math.hypot(bx-ax,by-ay);
 segments.push({ax,ay,bx,by,d,start:length});length+=d;
}
export function summitPosition(x,y){
 let nearest=null;
 for(const line of segments){
  const t=Math.max(0,Math.min(1,((x-line.ax)*(line.bx-line.ax)+(y-line.ay)*(line.by-line.ay))/(line.d**2)));
  const footX=line.ax+(line.bx-line.ax)*t,footY=line.ay+(line.by-line.ay)*t,d=Math.hypot(x-footX,y-footY);
  if(!nearest||d<nearest.distance)nearest={distance:d,progress:(line.start+line.d*t)/length,elevation:Math.round(100*(line.start+line.d*t)/length)};
 }
 return nearest&&nearest.distance<=halfWidth?nearest:null;
}
export const onSummitTrail=(x,y)=>!!summitPosition(x,y);
export function mountainMovement(p,input){
 if((p.scene||'city')!=='city')return null;
 const current=summitPosition(p.x,p.y);
 if(!current)return null;
 const next=summitPosition(p.x+input.dx*.35,p.y+input.dy*.35);
 const uphill=(next?.progress??current.progress)>current.progress+.0005;
 const depleted=p.stamina<15;
 return {onTrail:true,uphill,speed:depleted?.38:uphill?.62:.9,staminaDelta:uphill?-9:depleted?1:-2,
   hungerExtra:uphill?.35:.10,elevation:current.elevation};
}
