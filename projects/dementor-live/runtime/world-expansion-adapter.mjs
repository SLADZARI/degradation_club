import {Game as CoreGame,createWorld} from './world.mjs';
import {WORLD_SCENES,WORLD_CITY_TARGETS,WORLD_OBSTACLES,SECOND_BRIDGE,terrainBlocked,initializeWorldTravel,worldTravelAction,worldTravelView} from './world-expansion.mjs';
import {initSecondBridge,secondBridgeOpen,secondBridgeAction} from './second-bridge.mjs';
import {PHONE_BOOTHS} from './telecom.mjs';
import {civicAction,civicView} from './civic-earnings.mjs';
import {losevAction,losevView} from './losev-courses.mjs';
import {worldFootprints,blockedByRect} from './world-footprints.mjs';
import {mountainMovement,onSummitTrail,summitPosition} from './mountain-trail.mjs';
export {createWorld};
export class Game extends CoreGame{
  constructor(state,c){
    super(state,c);initializeWorldTravel(this);initSecondBridge(this);
    for(const o of WORLD_OBSTACLES.filter(o=>o.biome==='forest')){
      const id='forest-wood-'+o.x+'-'+o.y;
      if(!this.state.resources.some(r=>r.id===id))this.state.resources.push({id,type:'wood',species:(o.x+o.y)%3===0?'spruce':'common',visualVariant:(o.x+o.y)%3===0?3:0,x:o.x+o.w/2,y:o.y+o.h/2,stock:18,initial:18,regrowAt:0});
    }
    // Extra green forest is persisted like the previous Southern forests. No infinite wood.
    for(const [id,x,y] of [['mountain-stone-a',55,64],['mountain-stone-b',74,63],['mountain-stone-c',88,63]]){
      if(!this.state.resources.some(r=>r.id===id))this.state.resources.push({id,type:'stone',x,y,stock:1000000,initial:1000000,regrowAt:0});
    }
    // Tiered stone deposits. Fixed IDs ensure cold restarts never restore depleted stock.
    for(const [tier,x,y,stock] of [[2,105,69,12],[3,115,38,32],[4,121,70,72],[5,148,39,150]]){
      const id='tiered-rock-'+tier;
      if(!this.state.resources.some(r=>r.id===id))this.state.resources.push({id,type:'stone',x,y,rockSize:tier,stock,initial:stock,regrowAt:0});
    }
  }
  join(name,gender='unspecified'){const p=super.join(name,gender);initializeWorldTravel(this);return p;}
  target(id){return PHONE_BOOTHS.find(o=>o.id===id)||WORLD_CITY_TARGETS.find(o=>o.id===id)||Object.values(WORLD_SCENES)
    .flatMap(region=>[region.exit,region.main]).find(o=>o.id===id)||super.target(id);}
  movementBiome(p,input){return mountainMovement(p,input);}
  walkable(x,y,p=null){
    const scene=p?.scene||'city',r=.3,c=this.c;
     if(PHONE_BOOTHS.some(b=>b.scene===scene&&Math.hypot(x-b.x,y-b.y)<.50))return false;
    if(WORLD_SCENES[scene])return !terrainBlocked(scene,x,y,r);
    if(scene==='city'){
      // A single physical catalogue is consumed by the server and sent to client.
      if(worldFootprints(this).some(o=>(o.kind!=='mountain'||!onSummitTrail(x,y))&&blockedByRect(x,y,r,o)))return false;
      if(secondBridgeOpen(this)&&x+r>c.river.x&&x-r<c.river.x+c.river.w&&y-r>=SECOND_BRIDGE.y&&y+r<=SECOND_BRIDGE.y+SECOND_BRIDGE.h){
        if(x<r||y<r||x>c.width-r||y>c.height-r)return false;
        if(this.rects().some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h))return false;
        return !this.state.resources.some(o=>o.stock>0&&o.type!=='food'&&Math.hypot(x-o.x,y-o.y)<.58);
      }
    }
    return super.walkable(x,y,p);
  }
  action(p,cmd){
    const course=losevAction(this,p,cmd);if(course)return course;
    const task=civicAction(this,p,cmd);if(task)return task;
    const build=secondBridgeAction(this,p,cmd);if(build)return build;
    if(cmd?.type==='worldUse'||cmd?.type==='touristBuy')return worldTravelAction(this,p,cmd);
    return super.action(p,cmd);
  }
  snapshot(p){
    const actual=p.scene||'city',extended=!!WORLD_SCENES[actual];
    let base;
    if(extended)p.scene='city';
    try{base=super.snapshot(p);}finally{if(extended)p.scene=actual;}
    if(extended){
      base.scene=actual;
      base.home=null;base.homeTargets=[];
      base.drops=this.state.drops.filter(o=>(o.scene||'city')===actual);
      const self=base.players.find(o=>o.id===p.id);
      if(self)self.scene=actual;
    }
    base.worldTravel=worldTravelView(this,p);
    if(actual==='city'){base.worldTravel.footprints=worldFootprints(this);base.worldTravel.summitElevation=summitPosition(p.x,p.y)?.elevation||0;}
    base.civicJobs=civicView(this,p);
    base.losevCourse=losevView(p,this.now);
    return base;
  }

}
