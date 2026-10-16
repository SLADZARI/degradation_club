// DEMENTOR LIVE GA-01: synthetic deterministic event replay tests.
// Isolated TEST fixture. Not a simulation of the actual game server.
function runSyntheticReplay() {
  const cases=[];
  function test(id, observed, expected, detail) {
    const pass=JSON.stringify(observed)===JSON.stringify(expected);
    cases.push({id,pass,observed,expected,detail});
  }
  function world(plant) {
    return {
      plant,
      stocks:{water_ml:40000,seeds:4,hemp:0,flax:0,wood:0,fiber:0,sheets:0},
      outputCap:32,
      seen:{}
    };
  }
  function addEvents(plant){
    const e=[];let serial=0;
    function ev(t,priority,type,items){e.push({id:plant+"-"+(++serial),t,priority,type,items});}
    if(plant==="HEMP"){
      ev(0,0,"DEBIT",{water_ml:4000,seeds:4});
      ev(22.5,0,"DEBIT",{water_ml:4000});
      ev(45,0,"CREDIT",{hemp:12});
      for(let i=0;i<4;i++) ev(47+2*i,0,"CONVERT",{hemp:-3,fiber:6});
      for(let i=0;i<4;i++) {
        ev(53+4*i,1,"CONVERT",{fiber:-6,water_ml:-8000});
        ev(57+4*i,0,"CREDIT",{sheets:6});
      }
    } else {
      ev(0,0,"DEBIT",{water_ml:4000,seeds:4});
      ev(25,0,"DEBIT",{water_ml:4000});
      ev(50,0,"DEBIT",{water_ml:4000});
      ev(75,0,"CREDIT",{flax:16});
      for(let i=0;i<4;i++) ev(78+3*i,0,"CONVERT",{flax:-4,fiber:8});
      for(let i=0;i<4;i++) {
        ev(87+5*i,1,"CONVERT",{fiber:-8,water_ml:-6000});
        ev(92+5*i,0,"CREDIT",{sheets:8});
      }
    }
    return e.sort((a,b)=>a.t-b.t||a.priority-b.priority||a.id.localeCompare(b.id));
  }
  function apply(w,e){
    if(w.seen[e.id]) return;
    const delta={};for(const [key,val] of Object.entries(e.items))delta[key]=e.type==="DEBIT"?-val:val;
    for(const [key,val] of Object.entries(delta)){if(w.stocks[key]+val<0)throw new Error(e.id+" insufficient "+key);}
    if(w.stocks.sheets+(delta.sheets||0)>w.outputCap)throw new Error(e.id+" output overflow");
    for(const [key,val] of Object.entries(delta))w.stocks[key]+=val;
    w.seen[e.id]=true;
  }
  function advance(w,events,until){for(const e of events)if(e.t<=until)apply(w,e);}
  function snapshot(w){return JSON.stringify({stocks:w.stocks,events:Object.keys(w.seen).sort()});}
  for(const crop of ["HEMP","FLAX"]){
    const duration=crop==="HEMP"?69:107;
    const events=addEvents(crop);
    const online=world(crop),offline=world(crop),chunked=world(crop);
    for(let t=0;t<=duration*2;t++)advance(online,events,t/2);
    advance(offline,events,duration);
    for(const t of [0,25,45,53,69,75,87,107].filter(x=>x<=duration))advance(chunked,events,t);
    test("RPL-"+crop+"-ONLINE-OFFLINE",snapshot(online),snapshot(offline),"Equal state and event IDs");
    test("RPL-"+crop+"-CHUNKED",snapshot(chunked),snapshot(offline),"Checkpointing must not change result");
    const prior=snapshot(offline);advance(offline,events,duration);
    test("RPL-"+crop+"-IDEMPOTENT",snapshot(offline),prior,"Duplicate replay must do nothing");
    const s=offline.stocks;
    test("RPL-"+crop+"-SHEETS",s.sheets,crop==="HEMP"?24:32,"Paper output from expected recipe");
    test("RPL-"+crop+"-WATER-LEFT",s.water_ml,crop==="HEMP"?0:4000,"Conserved water under test fixture");
  }
  // Same-water contention, stable priority (lower seq wins).
  const tank={available:10000,processed:{}};
  function waterRequest(id,amount) {if(tank.processed[id])return tank.processed[id];const ok=tank.available>=amount; if(ok)tank.available-=amount; tank.processed[id]={ok};return tank.processed[id];}
  test("CONCURRENT-WATER-FIRST",waterRequest("one",8000).ok,true,"First wins priority");
  test("CONCURRENT-WATER-SECOND",waterRequest("two",8000).ok,false,"Second waits");
  waterRequest("one",8000);test("CONCURRENT-WATER-REPLAY",tank.available,2000,"No second debit on retry");
  // Two land buyers, one parcel, no double transfer.
  const plot={owner:null}, wallets={A:1000,B:1000}, treasury={balance:0};
  function buy(who){if(plot.owner || wallets[who]<360)return false;wallets[who]-=360;treasury.balance+=360;plot.owner=who;return true;}
  test("PARCEL-FIRST",buy("A"),true,"First purchase commits");
  test("PARCEL-SECOND",buy("B"),false,"Second cannot own same plot");
  test("PARCEL-B-WALLET",wallets.B,1000,"Failed buyer wallet untouched");
  test("PARCEL-CONSERVATION",wallets.A+wallets.B+treasury.balance,2000,"Treasury+wallet transfer conserves PAPER");
  // Escrow commit idempotence and exclusive refund.
  const pay={buyer:100,seller:0,escrow:0,state:"OPEN",settles:0};
  function reserve(){if(pay.state!=="OPEN")return;pay.buyer-=100;pay.escrow+=100;pay.state="FUNDED";}
  function settle(){if(pay.state!=="FUNDED")return false;pay.escrow-=100;pay.seller+=100;pay.state="SETTLED";pay.settles++;return true;}
  function refund(){if(pay.state!=="FUNDED")return false;pay.escrow-=100;pay.buyer+=100;pay.state="REFUNDED";return true;}
  reserve();settle();
  test("ESCROW-REPLAY",settle(),false,"Cannot settle twice");
  test("ESCROW-REFUND-AFTER-SETTLE",refund(),false,"Cannot refund after settlement");
  test("ESCROW-SUPPLY",pay.buyer+pay.seller+pay.escrow,100,"No PAPER created by escrow");
  test("ESCROW-COUNT",pay.settles,1,"Exactly once settlement in fixture");
  const failed=cases.filter(x=>!x.pass);
  return {kind:"SYNTHETIC_DESIGN_MODEL",date:"2026-10-17",executed:cases.length,passed:cases.length-failed.length,failed,cases,note:"No game server, concurrency primitives, database or real transactions were executed. This model documents required behavior."};
}
if(typeof module!=="undefined"&&module.exports)module.exports={runSyntheticReplay};
