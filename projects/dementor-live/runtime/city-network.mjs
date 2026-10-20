import {randomUUID} from 'node:crypto';
import {Game,createWorld} from './world-expansion-adapter.mjs';
import {ensureTelephoneDirectory,telecomAction,telecomSnapshot} from './telecom.mjs';

const SCHEMA='dementor-cities-v1';
const ORIGIN='origin';
const validName=name=>String(name||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,36);
export class CityNetwork{
  constructor(saved){
    this.data=saved?.schema===SCHEMA?saved:{schema:SCHEMA,origin:saved||createWorld(),cities:{}};
    this.games=new Map([[ORIGIN,new Game(this.data.origin)]]);
    for(const [id,city]of Object.entries(this.data.cities))this.games.set(id,new Game(city.state));
    this.directoryDirty=false;
    this.catalog=[];ensureTelephoneDirectory(this);
  }
  get origin(){return this.games.get(ORIGIN);}
  values(){return [...this.games.values()];}
  setMusic(catalog){this.catalog=catalog;for(const g of this.values())g.musicCatalog=catalog;}
  findToken(token){for(const [cityId,g]of this.games){const p=g.auth(token);if(p)return {p,g,cityId};}return null;}
  findId(id){for(const [cityId,g]of this.games){const p=g.state.players[id];if(p)return {p,g,cityId};}return null;}
  gameFor(p){return this.findId(p.id)?.g||null;}
  needsSave(){return this.directoryDirty||this.values().some(g=>g.dirty);}
  serialize(){this.data.origin=this.origin.state;for(const [id,city]of Object.entries(this.data.cities))city.state=this.games.get(id).state;return this.data;}
  markSaved(){this.directoryDirty=false;for(const g of this.values())g.dirty=false;}
  list(){
    return [{id:ORIGIN,name:'Первый город',founder:null,online:this.origin.online.size},
     ...Object.entries(this.data.cities).map(([id,c])=>({id,name:c.name,founder:c.founder,online:this.games.get(id).online.size,createdAt:c.createdAt}))];
  }
  snapshot(p){const r=this.findId(p.id);if(!r)throw Error('Житель не найден');
    const estates=[...this.games].flatMap(([cityId,g])=>g.state.plots.filter(t=>t.owner===p.id).map(t=>({cityId,cityName:this.data.cities[cityId]?.name||'Первый город',plotId:t.id,zoning:t.zoning,landUse:t.landUse,leased:!!t.lease,dueAt:t.lease?.dueAt||null,sign:t.shop?.sign||''})));
    return {...r.g.snapshot(p),telecom:telecomSnapshot(this,p),cityNetwork:{current:r.cityId,cities:this.list(),estates}};}
  assertRegistry(p,g){
    if((p.scene||'city')!=='city')throw Error('Реестр городов находится на площади');
    if(p.spirit||p.job||p.delivery)throw Error('Закончи работу или курьерский заказ перед переходом в другой город');
    g.near(p,g.target('city-registry'));
  }
  move(p,destination){
    const existing=this.findId(p.id),g=existing?.g,target=this.games.get(destination);
    if(!g||!target)throw Error('Нет такого города');
    this.assertRegistry(p,g);
    if(existing.cityId===destination)return {message:'Ты уже в этом городе',code:'world.city.alreadyHere',params:{}};
    const online=g.online.has(p.id);
    if(online)g.disconnect(p);
    delete g.state.players[p.id];g.changed();
    p.cityId=destination;p.scene='city';p.plotId=null;p.cityReturn=null;p.job=null;p.delivery=null;
    p.x=8;p.y=8;
    target.state.players[p.id]=p;
    if(online)target.connect(p);
    target.changed();this.directoryDirty=true;
    return {message:'Добро пожаловать в '+(this.data.cities[destination]?.name||'Первый город'),code:'world.city.arrived',params:{cityName:this.data.cities[destination]?.name||'Первый город'}};
  }
  createCity(p,name){
    const r=this.findId(p.id);if(!r)throw Error('Житель не найден');
    this.assertRegistry(p,r.g);
    const title=validName(name);if(title.length<3)throw Error('Название города: от 3 до 36 символов');
    if(Object.keys(this.data.cities).length>=12)throw Error('Пока можно создать не более 12 городов');
    if(Object.values(this.data.cities).some(c=>c.name.toLowerCase()===title.toLowerCase()))throw Error('Город с таким названием уже существует');
    if(Object.values(this.data.cities).some(c=>c.founder===p.id))throw Error('Ты уже основал один город');
    const id='city-'+randomUUID(),game=new Game(createWorld());
    game.musicCatalog=this.catalog;
    this.data.cities[id]={name:title,founder:p.id,createdAt:Date.now(),state:game.state};
    this.games.set(id,game);this.directoryDirty=true;
    return {id,message:'Город «'+title+'» основан. Другие жители могут прийти через реестр.',code:'world.city.created',params:{cityName:title}};
  }
  command(p,cmd){
    if(!['createCity','travelCity','pagerBuy','pagerSend','pagerRead','pagerBlock','pagerList','pagerDial'].includes(cmd?.type))throw Error('Неизвестное действие реестра');
    if(typeof cmd.requestId!=='string'||cmd.requestId.length<4||cmd.requestId.length>100)throw Error('Нет идентификатора действия');
    p.results||=[];const previous=p.results.find(r=>r.id===cmd.requestId);if(previous)return previous.result;
    let result;
    try{result={ok:true,...(['pagerBuy','pagerSend','pagerRead','pagerBlock','pagerList','pagerDial'].includes(cmd.type)?telecomAction(this,p,cmd):cmd.type==='createCity'?this.createCity(p,cmd.name):this.move(p,cmd.cityId))};}
    catch(e){result={ok:false,message:e.message};}
    p.results.push({id:cmd.requestId,result});p.results=p.results.slice(-128);
    this.gameFor(p)?.changed();return result;
  }
}
