import {Game as CoreGame,createWorld} from './world.mjs';
import {WORLD_SCENES,WORLD_CITY_TARGETS,SECOND_BRIDGE,terrainBlocked,initializeWorldTravel,worldTravelAction,worldTravelView} from './world-expansion.mjs';
export {createWorld};
export class Game extends CoreGame{
  constructor(state,c){
    super(state,c);initializeWorldTravel(this);
    for(const [id,x,y] of [['mountain-stone-a',55,64],['mountain-stone-b',74,63],['mountain-stone-c',88,63]]){
      if(!this.state.resources.some(r=>r.id===id))this.state.resources.push({id,type:'stone',x,y,stock:1000000,initial:1000000,regrowAt:0});
    }
  }
  join(name){const p=super.join(name);initializeWorldTravel(this);return p;}
  target(id){return WORLD_CITY_TARGETS.find(o=>o.id===id)||Object.values(WORLD_SCENES)
    .flatMap(region=>[region.exit,region.main]).find(o=>o.id===id)||super.target(id);}
  walkable(x,y,p=null){
    const scene=p?.scene||'city',r=.3,c=this.c;
    if(WORLD_SCENES[scene])return !terrainBlocked(scene,x,y,r);
    if(scene==='city'){
      if(terrainBlocked('city',x,y,r))return false;
      if(x+r>c.river.x&&x-r<c.river.x+c.river.w&&y-r>=SECOND_BRIDGE.y&&y+r<=SECOND_BRIDGE.y+SECOND_BRIDGE.h){
        if(x<r||y<r||x>c.width-r||y>c.height-r)return false;
        if(this.rects().some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h))return false;
        return !this.state.resources.some(o=>o.stock>0&&o.type!=='food'&&Math.hypot(x-o.x,y-o.y)<.58);
      }
    }
    return super.walkable(x,y,p);
  }
  action(p,cmd){
    if(cmd?.type==='worldUse'||cmd?.type==='touristBuy')return worldTravelAction(this,p,cmd);
    return super.action(p,cmd);
  }
}
