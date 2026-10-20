// Renderer-regression test: extended world objects must share one depth queue with players.
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{spawn}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'dl-depth-p5-')),port=4297,base='http://127.0.0.1:'+port;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let server,browser;
(async()=>{try{
 server=spawn(process.execPath,['server.mjs','--test'],{cwd:root,env:{...process.env,DEMENTOR_PORT:String(port),DEMENTOR_STATE:path.join(temp,'world.json')},stdio:'pipe'});
 let log='';for(const channel of [server.stdout,server.stderr])channel.on('data',d=>log+=d);
 let ready=false;for(let i=0;i<70;i++){try{ready=(await fetch(base+'/api/health')).ok;if(ready)break;}catch{}await sleep(100);}assert.ok(ready,log);
 browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);
 await page.getByLabel('Как тебя зовут?').fill('Геометр QA');
 await page.getByRole('button',{name:'Войти в мир'}).click();
 await page.waitForFunction(()=>me&&connected&&state.worldTravel?.footprints?.length>20&&typeof window.__worldEntities==='function');
 const snapshot=await page.evaluate(()=>{
   const fp=state.worldTravel.footprints,props=window.__worldEntities();
   const museum=fp.find(t=>t.id==='structure-museum-entry'),rock=fp.find(t=>t.id==='tiered-rock-5');
   const cx=view.cx,cy=view.cy;
   view.cx=96;view.cy=60;
   const visibleMuseumDepth=window.__worldEntities().find(t=>t.depth===museum.depth)?.depth;
   view.cx=cx;view.cy=cy;
   return {hasGround:typeof window.__worldGround==='function',props:props.length,
     buildingDepth:museum.depth,worldBuildingDepth:visibleMuseumDepth,
     blockedSummit:blocked(51,45),blockedOffTrail:blocked(54,45),
     blockedRock:blocked(rock.x+rock.w/2,rock.y+rock.h/2),
     rockWidth:rock.w,desert:state.worldTravel.desert?.w,cacti:state.worldTravel.cacti?.length};
 });
 assert.equal(snapshot.hasGround,true);
 assert.ok(snapshot.props>0,'Nearby world props contribute to the shared queue');
 assert.equal(snapshot.worldBuildingDepth,snapshot.buildingDepth);
 assert.equal(snapshot.blockedSummit,false,'Summit route open on client');
 assert.equal(snapshot.blockedOffTrail,true,'Mountain remains solid off trail');
 assert.equal(snapshot.blockedRock,true);
 assert.equal(snapshot.rockWidth,5);
 assert.ok(snapshot.desert>30&&snapshot.cacti>=3);
 // Real browser / server check: projection AND controls never change on plot/interior entry.
 const playerId=await page.evaluate(()=>me.id);
 async function enterFixture(scene){
   const spawnY=scene==='interior'?11:8; // Test free walking; collisions are asserted independently.
   const response=await fetch(base+'/__test',{method:'POST',headers:{'Content-Type':'application/json','x-test-key':'local-integration-tests'},body:JSON.stringify({player:playerId,patch:{scene,plotId:'plot-1',x:8,y:spawnY}})});
   assert.equal(response.status,200,'isolated scene fixture '+scene);
   await page.waitForFunction(expected=>state?.scene===expected.scene&&me?.x===8&&me?.y===expected.y,{scene,y:spawnY});
   await page.waitForTimeout(200);
   const geometry=await page.evaluate(()=>{const a=screen(8,8),b=screen(9,9),c=screen(10.4,6.2),hit=worldPoint(c.x,c.y);return {diamondX:b.x-a.x,diamondY:b.y-a.y,hitX:hit.x,hitY:hit.y};});
   assert.ok(Math.abs(geometry.diamondX)<.00001&&geometry.diamondY>0,'ISO30 diamond on '+scene);
   assert.ok(Math.abs(geometry.hitX-10.4)<.00001&&Math.abs(geometry.hitY-6.2)<.00001,'click inverse on '+scene);
   if(scene==='plot'||scene==='interior'){
     const props=await page.evaluate(()=>({kinds:(state.homeFootprints||[]).map(o=>o.kind),well:blocked(14,3),chest:blocked(3.8,5.4),bed:blocked(9.6,5.9)}));
     if(scene==='plot'){assert.ok(props.kinds.includes('well'));assert.equal(props.well,true,'well collision rendered on plot');}
     else{
       assert.ok(props.kinds.includes('room-wall')&&props.kinds.includes('chest')&&props.kinds.includes('bed'),'authoritative room furniture serialized');
       assert.equal(props.chest,true,'chest collision');assert.equal(props.bed,true,'bed collision');
       const depth=await page.evaluate(()=>{
         const events=[],origPlayer=drawPlayer,origChest=localChest,origBed=localBed;
         try{
           drawPlayer=function(p,t){events.push('player');return origPlayer(p,t)};
           localChest=function(o){events.push('chest');return origChest(o)};
           localBed=function(o){events.push('bed');return origBed(o)};
           drawHome(performance.now());return events;
         }finally{drawPlayer=origPlayer;localChest=origChest;localBed=origBed;}
       });
       assert.ok(depth.includes('player')&&depth.indexOf('chest')<depth.indexOf('player')&&depth.indexOf('bed')<depth.indexOf('player'),'nearer player paints in front of room furniture');
     }
   }
 }
 async function assertScreenMove(key,axis,sign){
   const before=await page.evaluate(()=>({x:me.x,y:me.y}));
   await page.keyboard.down(key);await page.waitForTimeout(550);await page.keyboard.up(key);
   await page.waitForTimeout(160);
   const after=await page.evaluate(()=>({x:me.x,y:me.y}));
   const worldX=after.x-before.x,worldY=after.y-before.y;
   const screenX=(worldX-worldY)*Math.sqrt(3)/2,screenY=(worldX+worldY)*.5;
   const primary=axis==='x'?screenX:screenY,drift=axis==='x'?screenY:screenX;
   assert.ok(primary*sign>.05,key+' travels '+axis+' on screen');
   assert.ok(Math.abs(drift)<.08,key+' has no unintended diagonal drift: '+drift);
 }
 await enterFixture('plot');
 await assertScreenMove('s','y',1);
 await enterFixture('interior');
 await assertScreenMove('d','x',1);
 await assertScreenMove('w','y',-1);
 await assertScreenMove('a','x',-1);
 // Return to the regular city before checking the P5 render hooks.
 await enterFixture('city');
 await page.evaluate(()=>{const old=window.__worldEntities;window.__p5Passes=0;window.__worldEntities=()=>{window.__p5Passes++;return old();};});
 await page.waitForFunction(()=>window.__p5Passes>3,{timeout:10000});
 assert.deepEqual(errors,[],'No JS errors during real Canvas render');
 console.log('P5 DEPTH BROWSER PASS — one painter queue, structure depth, mapped summit, giant rocks and cactus');
}catch(e){console.error('P5 DEPTH BROWSER FAIL',e);process.exitCode=1;}finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),sleep(900)]);}fs.rmSync(temp,{recursive:true,force:true});}})();
