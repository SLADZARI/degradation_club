import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,createWorld} from '../world-expansion-adapter.mjs';

test('completed forge never traps builders or a neighboring human within new collision geometry',()=>{
 const g=new Game(createWorld()),builder=g.join('Builder'),neighbor=g.join('Neighbor'),safe=g.join('Outside');
 g.connect(builder);g.connect(neighbor);g.connect(safe);
 builder.x=27;builder.y=26;neighbor.x=26.5;neighbor.y=25;safe.x=18;safe.y=16;
 const before={x:safe.x,y:safe.y};
 assert.equal(g.rects().some(o=>o.id==='forge'),false);
 g.state.forge.stage=g.c.forge.stages.length-1;
 g.state.forge.work=g.c.forge.stages.at(-1).works-1;
 const total=g.state.treasury+builder.wallet+neighbor.wallet+safe.wallet;
 assert.equal(g.command(builder,{requestId:'forge-final-work',type:'build',target:'forge-build'}).ok,true);
 g.tick(g.c.buildMs+10);
 assert.equal(g.state.forge.stage,g.c.forge.stages.length);
 assert.equal(g.rects().some(o=>o.id==='forge'),true);
 assert.equal(g.state.constructionRescues.length,2);
 assert.ok(g.walkable(builder.x,builder.y,builder),'builder must be able to walk after construction');
 assert.ok(g.walkable(neighbor.x,neighbor.y,neighbor),'second player must be free');
 assert.deepEqual({x:safe.x,y:safe.y},before,'unaffected resident must not be moved');
 assert.equal(g.state.treasury+builder.wallet+neighbor.wallet+safe.wallet,total,'no money minted or lost');
 assert.equal(builder.wallet,g.c.pay.work,'paid once for final work');
 const recovered=new Game(structuredClone(g.state));
 assert.ok(recovered.walkable(recovered.auth(builder.token).x,recovered.auth(builder.token).y,recovered.auth(builder.token)));
 assert.ok(recovered.walkable(recovered.auth(neighbor.token).x,recovered.auth(neighbor.token).y,recovered.auth(neighbor.token)));
});
test('civic garden collision footprint also moves a resident out, without touching their belongings',()=>{
 const g=new Game(createWorld()),p=g.join('Gardener');g.connect(p);
 p.x=27.5;p.y=9.5;p.bag.wood=3;p.wallet=11;
 const money=p.wallet;const wood=p.bag.wood;
 g.state.gardenProject.stage=g.c.cityGarden.stages.length;
 g.changed();
 assert.equal(g.rects().some(o=>o.id==='public-garden'),true);
 assert.ok(g.walkable(p.x,p.y,p));
 assert.equal(p.wallet,money);assert.equal(p.bag.wood,wood);
 assert.equal(g.state.constructionRescues.at(-1)?.building,'public-garden');
});
