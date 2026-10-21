import assert from 'node:assert/strict';
import {Game,createWorld} from '../world.mjs';
import {CONFIG} from '../config.mjs';
import {MUNICIPAL_SITES} from '../municipal-buildings.mjs';
import {telecomSnapshot} from '../telecom.mjs';

const state=createWorld(CONFIG,{startingCity:true});
const game=new Game(state,CONFIG);
const player=game.join('QA');
player.scene='city';player.x=9;player.y=3;

const locked=game.command(player,{type:'researchPayphones',target:'mayor',requestId:'phone-tech-locked'});
assert.equal(locked.ok,false,'research stays unavailable before mayor level 2');
assert.equal(state.technologies.payphones,undefined);

state.project.stage=CONFIG.stages.length;
state.mayorLevel=2;
const start=game.command(player,{type:'researchPayphones',target:'mayor',requestId:'phone-tech-start'});
assert.equal(start.ok,true);
assert.equal(state.phoneResearch.endsAt-state.phoneResearch.startedAt,240000);

const makeNetwork=()=>({data:{},directoryDirty:false,values:()=>[game],findId:id=>id===player.id?{g:game,p:player}:null});
assert.deepEqual(telecomSnapshot(makeNetwork(),player).booths,[],'no payphones show before research');
game.tick(239999);
assert.equal(state.technologies.payphones,undefined,'the technology remains locked for 239 seconds');
game.tick(1);
assert.equal(state.technologies.payphones,true,'research completes at 240 seconds');
assert.deepEqual(telecomSnapshot(makeNetwork(),player).booths,[],'research alone does not create payphones');

state.municipalBuildings['phone-square'].stage=MUNICIPAL_SITES['phone-square'].stages.length;
assert.deepEqual(telecomSnapshot(makeNetwork(),player).booths.map(b=>b.siteId),['phone-square'],'only constructed municipal booths enter the live directory');

const legacy=new Game(createWorld(CONFIG),CONFIG);
legacy.state.technologies.payphones=true;
const oldPlayer=legacy.join('Legacy');
const oldNetwork={data:{},directoryDirty:false,values:()=>[legacy],findId:id=>id===oldPlayer.id?{g:legacy,p:oldPlayer}:null};
assert.deepEqual(telecomSnapshot(oldNetwork,oldPlayer).booths,[],'legacy static payphones remain hidden');
