// GA-03 DEMENTOR LIVE finite onboarding. TEST-only, not runtime.
const KIT=Object.freeze({grant:80,jobs:4,wage:90,plot:360,cabin:60,wood:6,sheets:4});
function simulate({n=20,cash=10000,wood=600,sheets=400,plots=1000,policy="ROUND_ROBIN"}){
 const city={cash,wood,sheets,plots}, players=Array.from({length:n},(_,i)=>({i,cash:0,wood:0,sheets:0,stage:0,jobs:0,complete:false}));
 const history=new Set(),flows={grant:0,wage:0,plots:0,cabins:0},blocked={funding:0,materials:0},retries={rejected:0};
 function pay(from,to,amount,id,type){if(history.has(id)){retries.rejected++;return true;}
  if(from.cash<amount)return false;from.cash-=amount;to.cash+=amount;history.add(id);flows[type]+=amount;return true;}
 function next(p){
  const st=p.stage;
  if(st===0){if(!pay(city,p,KIT.grant,"g"+p.i,"grant")){blocked.funding++;return false;}}
  else if(st<=4){if(!pay(city,p,KIT.wage,"w"+p.i+"-"+st,"wage")){blocked.funding++;return false;}p.jobs++;}
  else if(st===5){if(city.plots===0){blocked.materials++;return false;}if(!pay(p,city,KIT.plot,"plot"+p.i,"plots")){blocked.funding++;return false;}city.plots--;}
  else if(st===6){if(!pay(p,city,KIT.cabin,"cabin"+p.i,"cabins")){blocked.funding++;return false;}}
  else if(st===7){if(city.wood<KIT.wood||city.sheets<KIT.sheets){blocked.materials++;return false;}city.wood-=KIT.wood;city.sheets-=KIT.sheets;p.wood+=KIT.wood;p.sheets+=KIT.sheets;p.complete=true;}
  else return false;
  p.stage++;return true;
 }
 if(policy==="ROUND_ROBIN"){for(let st=0;st<8;st++)for(const p of players)if(p.stage===st)next(p);}
 else if(policy==="SEQUENTIAL"){for(const p of players)for(let i=0;i<8;i++)if(!next(p))break;}
 else throw Error("policy");
 const before=players.reduce((a,p)=>a+p.cash,city.cash);
 if(players[0].stage>=1)pay(city,players[0],KIT.grant,"g0","grant");
 if(players[0].stage>=2)pay(city,players[0],KIT.wage,"w0-1","wage");
 const after=players.reduce((a,p)=>a+p.cash,city.cash);
 const checks={moneyConserved:after===cash,unchangedAfterValidRetries:after===before,
  noNegative:city.cash>=0&&players.every(p=>p.cash>=0),
  materialConserved:city.wood+players.reduce((a,p)=>a+p.wood,0)===wood&&
    city.sheets+players.reduce((a,p)=>a+p.sheets,0)===sheets,
  allCompletedOwnStarterKit:players.every(p=>!p.complete||(p.stage===8&&p.wood===6&&p.sheets===4&&p.cash===20&&p.jobs===4)),
  flowLedgerMatches:flows.grant+flows.wage-flows.plots-flows.cabins===cash-city.cash,
  validRetryCount:retries.rejected===(players[0].stage>=2?2:players[0].stage>=1?1:0)};
 if(Object.values(checks).some(v=>!v))throw Error("FAILED "+JSON.stringify(checks));
 return {n,cash,wood,sheets,policy,completed:players.filter(p=>p.complete).length,
  cityCash:city.cash,playerCash:players.reduce((a,p)=>a+p.cash,0),
  cityWood:city.wood,citySheets:city.sheets,flow:flows,blocked,
  stages:players.reduce((o,p)=>(o[p.stage]=(o[p.stage]||0)+1,o),{}),checks};
}
function suite(){const configs=[
 {n:1,cash:10000,wood:6,sheets:4},
 {n:20,cash:10000,wood:120,sheets:80},
 {n:100,cash:10000,wood:600,sheets:400},
 {n:100,cash:50000,wood:600,sheets:400},
 {n:100,cash:10000,wood:600,sheets:400,policy:"SEQUENTIAL"},
 {n:100,cash:50000,wood:120,sheets:80},
 {n:20,cash:50000,wood:0,sheets:0},
 {n:20,cash:0,wood:120,sheets:80}];
 const scenarios=configs.map(simulate);
 return {type:"SYNTHETIC_NOT_RUNTIME",date:"2026-10-17",fixtures:KIT,
  count:scenarios.length,assertions:scenarios.length*7,scenarios};}
if(typeof module!=="undefined")module.exports={simulate,suite};
