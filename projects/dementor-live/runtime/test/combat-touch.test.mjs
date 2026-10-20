import test from 'node:test';import assert from 'node:assert/strict';import {COMBAT_WEAPONS,createCombat,combatAction,advanceCombat} from '../combat-p0.mjs';
function game(){const world={players:{a:{id:'a',wallet:0,bag:{food:2}}}},sid=createCombat(world,world.players,'a',1000);let seq=0;const act=(type,when,extra={})=>combatAction(world,world.players,sid,'a',{type,requestId:'combat-'+(++seq),...extra},when);act('start',1000);return {world,sid,act,profile:world.players.a.combatP0};}
test('automatic reload after finite rifle magazine, with no free ammunition',()=>{
 const {world,sid,act,profile}=game();assert.equal(profile.magazine,12);
 for(let n=0;n<12;n++)act('fire',1200+n*300,{dx:-1,dy:0});
 assert.equal(profile.ammo,12);assert.equal(profile.magazine,0);assert.ok(profile.reloadEndsAt>0);
 assert.throws(()=>act('fire',4800,{dx:-1,dy:0}),/Reloading|cooling/);
 const at=profile.reloadEndsAt;advanceCombat(world,sid,at+1);
 assert.equal(profile.ammo,12);assert.equal(profile.magazine,12);assert.equal(profile.reloadEndsAt,0);
 act('fire',at+350,{dx:-1,dy:0});assert.equal(profile.ammo,11);
});
test('pistol is slower and weapon switching never refills magazine',()=>{
 const {act,profile}=game();act('weaponSelect',1100,{weapon:'pistol'});assert.equal(profile.magazine,8);
 act('fire',1400,{dx:-1,dy:0});assert.equal(profile.magazine,7);
 assert.throws(()=>act('fire',1700,{dx:-1,dy:0}),/cooling/);
 act('weaponSelect',1750,{weapon:'rifle'});assert.equal(profile.magazine,7);assert.equal(profile.ammo,23);
 assert.ok(COMBAT_WEAPONS.pistol.cooldown>COMBAT_WEAPONS.rifle.cooldown);
 assert.throws(()=>act('weaponSelect',2000,{weapon:'invalid'}),/Unknown/);
});
