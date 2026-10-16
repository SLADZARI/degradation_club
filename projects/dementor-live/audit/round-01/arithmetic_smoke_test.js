// DEMENTOR LIVE | GA-01 arithmetic smoke tests | 2026-10-17
// Self-contained JS, no dependencies. Tests published TEST assumptions from GDD v0.1.
// Arithmetic only: does NOT execute or verify the game runtime.
function runSmokeTest() {
  const checks = [];
  const approx = (x,y) => Math.abs(x-y)<0.001;
  function check(id, actual, expected, scope) {
    checks.push({id, actual, expected, pass:typeof actual==="number"&&typeof expected==="number"?approx(actual,expected):actual===expected, scope});
  }
  const bank = 80+4*(30+60), afterCash=bank-360-60, materialCash=6*3+4*5;
  check("AR-001",bank,440,"Onboarding 4 tutorial deliveries");
  check("AR-002",afterCash,20,"After starter land and cabin cash");
  check("AR-003",materialCash,38,"WOODS and PAPER_SHEET city acquisition");
  check("AR-004",afterCash-materialCash,-18,"Starter deficit");
  check("AR-005",30*60/7,257.142857,"Courier lower hourly earnings");
  check("AR-006",30*60/5,360,"Courier upper hourly earnings");
  check("AR-007",12*12*2.5,360,"HOMESTEAD land");
  check("AR-008",16*16*4,1024,"RESIDENTIAL land");
  check("AR-009",24*24*3,1728,"AGRICULTURAL land");
  check("AR-010",24*24*3.5,2016,"FORESTRY land");
  check("AR-011",16*16*8,2048,"COMMERCIAL land");
  check("AR-012",32*32*6,6144,"INDUSTRIAL land");
  const footprint=[4*4,2*3,2*2,2*2,5*5].reduce((a,b)=>a+b,0);
  check("AR-013",footprint,55,"Sum of footprints not accessibility");
  check("AR-014",144-footprint,89,"Remaining raw area of 12x12 plot");
  const hemp={raw:4*3, waterGrow:4*2, batches:(4*3)/3, productPerBatch:6, waterPerBatch:8, stageMinutes:2+4, growMinutes:45};
  const flax={raw:4*4, waterGrow:4*3, batches:(4*4)/4, productPerBatch:8, waterPerBatch:6, stageMinutes:3+5, growMinutes:75};
  const hp=hemp.batches*hemp.productPerBatch, hw=hemp.waterGrow+hemp.batches*hemp.waterPerBatch;
  const fp=flax.batches*flax.productPerBatch, fw=flax.waterGrow+flax.batches*flax.waterPerBatch;
  check("AR-015",hp,24,"HEMP sheet output");
  check("AR-016",hw,40,"HEMP water total");
  check("AR-017",hemp.growMinutes+hemp.batches*hemp.stageMinutes,69,"HEMP serial duration minutes");
  check("AR-018",fp,32,"FLAX sheet output");
  check("AR-019",fw,36,"FLAX water total");
  check("AR-020",flax.growMinutes+flax.batches*flax.stageMinutes,107,"FLAX serial duration minutes");
  check("AR-021",hp*60/hemp.growMinutes,32,"HEMP steady upper sheets/h");
  check("AR-022",hw*60/hemp.growMinutes,53.333333,"HEMP steady water demand L/h");
  check("AR-023",fp*60/flax.growMinutes,25.6,"FLAX steady upper sheets/h");
  check("AR-024",fw*60/flax.growMinutes,28.8,"FLAX steady water demand L/h");
  check("AR-025",hw*60/hemp.growMinutes-30,23.333333,"River pump HEMP water shortfall L/h");
  check("AR-026",2*hw*60/hemp.growMinutes,106.666667,"Two HEMP farms vs city120 L/h");
  check("AR-027",3*hw*60/hemp.growMinutes,160,"Three HEMP farms exceeds city120 L/h");
  check("AR-028",8*3-(4*3+2+2),8,"WOOD-paper profit gross from city wood TEST");
  check("AR-029",Math.floor(32/8),4,"Paper batches before output buffer32 full");
  check("AR-030",Math.floor(32/8)*4,16,"WOOD consumed before output buffer32 full");
  check("AR-031",4*20/4*8,160,"4 trees converted to sheets");
  check("AR-032",4*12+(4*20/4)*10,248,"4 trees irrigation+paper water litres");
  check("AR-033",Math.ceil(36/10)*2,8,"FLAX water purchase block integer PAPER");
  check("AR-034",32-18,14,"Generic fiber alternative water saving for 24 sheets");
  check("AR-035",Math.floor(1440/45)*24,768,"HEMP 24h idealized output");
  check("AR-036",Math.floor(1440/45)*40,1280,"HEMP 24h idealized water");
  check("AR-037",Math.floor(1440/75)*32,608,"FLAX 24h idealized output");
  check("AR-038",Math.floor(1440/75)*36,684,"FLAX 24h idealized water");
  check("AR-039",20*4*90,7200,"20 new players training wage exposure");
  check("AR-040",100*4*90,36000,"100 new players training wage exposure");
  const designFailures=[
    {id:"DESIGN-001",issue:"Starter budget shortfall -18 PAPER if city materials purchased",cc:"CC-029"},
    {id:"DESIGN-002",issue:"Generic PLANT_FIBER allows cross-source recipe water advantage",cc:"CC-028"},
    {id:"DESIGN-003",issue:"No city treasury emission/stock policy for repeated payments",cc:"CC-005/006/037"},
    {id:"DESIGN-004",issue:"30L/h pump cannot sustain steady four HEMP farm+paper processing",cc:"CC-030"},
    {id:"DESIGN-005",issue:"Offline shared-resource concurrency has no actual game runtime implementation/test",cc:"CC-007/036"}
  ];
  return {audit:"GA-01",date:"2026-10-17",scope:"PURE TEST ASSUMPTION ARITHMETIC ONLY",assertions:checks.length,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass),checks,designFailures};
}
if (typeof module!=="undefined" && module.exports) module.exports={runSmokeTest};
