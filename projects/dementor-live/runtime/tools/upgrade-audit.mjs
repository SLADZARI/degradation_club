#!/usr/bin/env node
// Read-only compatibility audit of saved world -> candidate runtime.
// Never writes to the source; runs constructors on a parsed in-memory copy.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {CityNetwork} from '../city-network.mjs';

const file=process.argv[2];
if(!file){console.error('Usage: node tools/upgrade-audit.mjs /path/to/backup/world.json');process.exit(2);}
const buf=fs.readFileSync(file),original=JSON.parse(buf.toString('utf8'));
const cities=source=>source?.schema==='dementor-cities-v1'
  ?[['origin',source.origin],...Object.entries(source.cities||{}).map(([id,city])=>[id,city.state])]
  :[['origin',source]];
function assertPreserved(before,after,route='state'){
 if(before===undefined)return;
 if(before===null||typeof before!=='object'){
   if(before!==after)throw Error('Compatibility failure: lost existing value at '+route);
   return;
 }
 if(Array.isArray(before)){
   if(!Array.isArray(after)||after.length<before.length)throw Error('Compatibility failure: array truncated at '+route);
   before.forEach((v,i)=>assertPreserved(v,after[i],route+'['+i+']'));return;
 }
 for(const [key,value] of Object.entries(before)){
   // Job state and transient input are intentionally reset when a session restarts.
   if(['job','results','lastMessage','lastActiveGameplayAt','online'].includes(key))continue;
   if(!after||!Object.hasOwn(after,key))throw Error('Compatibility failure: missing '+route+'.'+key);
   assertPreserved(value,after[key],route+'.'+key);
 }
}
function extract(raw){
 const counts={cities:0,players:0,plots:0,ownedPlots:0,worldResources:0,treasury:0,wallets:0,stock:{wood:0,stone:0},projectStages:0};
 for(const [,s] of cities(raw)){
  counts.cities++;counts.players+=Object.keys(s?.players||{}).length;counts.plots+=(s?.plots||[]).length;
  counts.ownedPlots+=(s?.plots||[]).filter(p=>p.owner).length;
  counts.worldResources+=(s?.resources||[]).length;counts.treasury+=s?.treasury||0;
  for(const player of Object.values(s?.players||{})){counts.wallets+=player.wallet||0;}
  for(const r of s?.resources||[])if(r.type==='wood'||r.type==='stone')counts.stock[r.type]+=r.stock||0;
  for(const name of ['project','bridge','forge','seedMarket','gardenProject','secondBridgeProject'])
   counts.projectStages+=s?.[name]?.stage||0;
 }
 return counts;
}
const input=extract(original),network=new CityNetwork(structuredClone(original)),roundtrip=network.serialize();
const from=new Map(cities(original)),to=new Map(cities(roundtrip));
for(const [cityId,old]of from){
 const upgraded=to.get(cityId);
 if(!upgraded)throw Error('Compatibility failure: city missing');
 for(const [id,p]of Object.entries(old?.players||{})){
  const next=upgraded.players?.[id];
  if(!next)throw Error('Compatibility failure: player missing');
  for(const field of ['id','token','name','wallet','bag','tools','toolItems','activeTools','health','hunger','stamina','pagerInbox','pagerNumber','pagerOwns'])
   if(Object.hasOwn(p,field))assertPreserved(p[field],next[field],'players.'+field);
 }
 for(const oldPlot of old?.plots||[]){
  const next=upgraded.plots.find(p=>p.id===oldPlot.id);
  if(!next)throw Error('Compatibility failure: plot missing');
  for(const field of ['id','owner','home','lease','shop','zoning','landUse'])
   if(Object.hasOwn(oldPlot,field))assertPreserved(oldPlot[field],next[field],'plots.'+field);
 }
 const resources=new Map((upgraded.resources||[]).map(x=>[x.id,x]));
 for(const r of old?.resources||[]){
  const next=resources.get(r.id);
  if(!next||next.stock!==r.stock||next.initial!==r.initial)throw Error('Compatibility failure: resource stock changed');
 }
 for(const k of ['treasury','transactions','warehouse','project','forge','bridge','seedMarket','gardenProject','secondBridgeProject','drops','materialEvents','materialScrap','mayorMail','thefts','trades'])
  if(Object.hasOwn(old,k))assertPreserved(old[k],upgraded[k],k);
}
const after=extract(roundtrip);
for(const key of ['cities','players','ownedPlots','treasury','wallets','projectStages'])
 if(after[key]!==input[key])throw Error('Compatibility failure: aggregate '+key+' changed');
for(const k of ['wood','stone'])if(after.stock[k]<input.stock[k])throw Error('Compatibility failure: world '+k+' stock decreased');
for(const g of network.values())for(const p of Object.values(g.state.players))g.snapshot(p);
console.log(JSON.stringify({status:'PASS_READ_ONLY',sha256:createHash('sha256').update(buf).digest('hex'),
 schemaBefore:original.schema||'legacy',schemaAfter:roundtrip.schema,
 countsBefore:input,countsAfter:after,sourceFileUntouched:true},null,2));
