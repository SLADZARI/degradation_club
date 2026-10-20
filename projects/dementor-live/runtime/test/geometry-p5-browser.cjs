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
 await page.evaluate(()=>{const old=window.__worldEntities;window.__p5Passes=0;window.__worldEntities=()=>{window.__p5Passes++;return old();};});
 await page.waitForFunction(()=>window.__p5Passes>3,{timeout:10000});
 assert.deepEqual(errors,[],'No JS errors during real Canvas render');
 console.log('P5 DEPTH BROWSER PASS — one painter queue, structure depth, mapped summit, giant rocks and cactus');
}catch(e){console.error('P5 DEPTH BROWSER FAIL',e);process.exitCode=1;}finally{if(browser)await browser.close();if(server&&server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(r=>server.once('exit',r)),sleep(900)]);}fs.rmSync(temp,{recursive:true,force:true});}})();
