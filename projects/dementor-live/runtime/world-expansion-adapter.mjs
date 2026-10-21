import {Game as CoreGame,createWorld} from './world.mjs';
import {WORLD_SCENES,WORLD_CITY_TARGETS,WORLD_OBSTACLES,SECOND_BRIDGE,terrainBlocked,initializeWorldTravel,worldTravelAction,worldTravelView} from './world-expansion.mjs';
import {initSecondBridge,secondBridgeOpen,secondBridgeAction} from './second-bridge.mjs';
import {PHONE_BOOTHS} from './telecom.mjs';
import {civicAction,civicView} from './civic-earnings.mjs';
import {losevAction,losevView} from './losev-courses.mjs';
import {worldFootprints,blockedByRect} from './world-footprints.mjs';
import {mountainMovement,onSummitTrail,summitPosition} from './mountain-trail.mjs';
import {recoverBlockedSavedResidents} from './resident-recovery.mjs';
import {MUNICIPAL_SITES,municipalBuilt} from './municipal-buildings.mjs';
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
      if(!this.state.resources.some(r=>r.id===id))this.state.resources.push({id,type:'stone',x,y,stock:144,initial:144,regrowAt:0});
    }
    // Tiered stone deposits. Fixed IDs ensure cold restarts never restore depleted stock.
    for(const [tier,x,y,stock] of [[2,105,69,12],[3,115,38,32],[4,121,70,72],[5,148,39,150]]){
      const id='tiered-rock-'+tier;
      if(!this.state.resources.some(r=>r.id===id))this.state.resources.push({id,type:'stone',x,y,rockSize:tier,stock,initial:stock,regrowAt:0});
    }
    recoverBlockedSavedResidents(this);
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
      let footprints=worldFootprints(this);
      if(this.state.startingCity)footprints=footprints.filter(o=>{
        if(['forest','mountain','cactus','tree','stone'].includes(o.kind))return true;
        if(o.kind==='payphone')return o.id==='phone-square'&&municipalBuilt(this.state,'phone-square');
        if(String(o.id||'').startsWith('structure-')){const id=o.id.slice('structure-'.length);if(MUNICIPAL_SITES[id])return municipalBuilt(this.state,id);if(id==='second-bridge-site')return this.state.secondBridgeProject?.stage>=2;if(['monument','jukebox','donation-board','theft-board'].includes(id))return this.state.project.stage>=this.c.stages.length;return false;}
        return true;
      });
      if(footprints.some(o=>(o.kind!=='mountain'||!onSummitTrail(x,y))&&blockedByRect(x,y,r,o)))return false;
      if(secondBridgeOpen(this)&&x+r>c.river.x&&x-r<c.river.x+c.river.w&&y-r>=SECOND_BRIDGE.y&&y+r<=SECOND_BRIDGE.y+SECOND_BRIDGE.h){
        if(x<r||y<r||x>c.width-r||y>c.height-r)return false;
        if(this.rects().some(o=>x+r>o.x&&x-r<o.x+o.w&&y+r>o.y&&y-r<o.y+o.h))return false;
        return !this.state.resources.some(o=>o.stock>0&&o.type!=='food'&&Math.hypot(x-o.x,y-o.y)<.58);
      }
    }
    return super.walkable(x,y,p);
  }
  action(p,cmd){
    const intro=this.state.startingCity&&!this.state.expedition?.completedAt;
    if(intro){
      const allowed=new Set(['missionEnter','homeClear','homeUse','board','tools','equip','equipItem','mine','gather','pickup','drop']);
      if(!allowed.has(cmd?.type))throw Error('Сначала расчисти стартовый участок. Городские объекты появятся по мере строительства.');
      if(cmd.type==='homeClear'&&(p.scene||'city')!=='expedition')throw Error('Сначала войди в миссию расчистки.');
      if(cmd.type==='homeUse'&&cmd.target!=='mission-exit')throw Error('Сейчас доступен только выход с расчистки.');
    }
    if(this.state.startingCity&&!intro){
      const site=MUNICIPAL_SITES[cmd?.target];
      if(site&&!municipalBuilt(this.state,site.id)&&!/^municipal-.+-(drop|build)$/.test(String(cmd?.target||'')))throw Error('Сначала построй этот городской объект в три этапа.');
      if(['donate','monumentAnswer','musicRequest','musicPlay'].includes(cmd?.type)&&this.state.project.stage<this.c.stages.length)throw Error('Сначала построй городскую площадь.');
    }
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
    if(this.state.startingCity){
      const intro=!this.state.expedition?.completedAt;
      const constructionIds=new Set(['tourist-kiosk','university-site','robo-stadium-site','industry-site','museum-entry']);
      base.worldTravel.targets=intro?[]:base.worldTravel.targets.filter(t=>constructionIds.has(t.id)?municipalBuilt(this.state,t.id):t.id!=='second-bridge-site'||this.state.secondBridgeProject?.stage>=2);
      base.worldTravel.booths=intro||!municipalBuilt(this.state,'phone-square')?[]:base.worldTravel.booths.filter(t=>t.id==='phone-square');
      base.worldTravel.footprints=(base.worldTravel.footprints||[]).filter(o=>{
        if(intro)return ['forest','mountain','cactus','rock'].includes(o.kind);
        const id=String(o.id||'').replace(/^structure-/,'');
        if(id==='second-bridge-site')return this.state.secondBridgeProject?.stage>=2;
        if(constructionIds.has(id)||id==='phone-square')return municipalBuilt(this.state,id);
        return true;
      });
    }
    base.civicJobs=civicView(this,p);
    base.losevCourse=losevView(p,this.now);
    return base;
  }

}
