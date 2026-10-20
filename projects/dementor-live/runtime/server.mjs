import http from 'node:http';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Game, createWorld } from './world-expansion-adapter.mjs';
import {CityNetwork} from './city-network.mjs';
import {createQARecorder} from './qa-recorder.mjs';
import {scanMusic,audioDuration,PLAZA} from './plaza.mjs';
import {createHash,timingSafeEqual} from 'node:crypto';
import {packTerrainSse} from './terrain-delta.mjs';
import { CONFIG } from './config.mjs';
import { combatRoot,createCombat,joinCombat,combatAction,combatView,advanceCombat } from './combat-p0.mjs';
import {withActionCode,withHttpCode} from './result-codes.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const version=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version;
const testMode=process.argv.includes('--test');
const port=Number(process.env.DEMENTOR_PORT||4173);
const host=testMode?'127.0.0.1':(process.env.DEMENTOR_HOST||'0.0.0.0');
const addresses=Object.values(os.networkInterfaces()).flat().filter(a=>a.family==='IPv4'&&!a.internal).map(a=>a.address);
const allowedHosts=new Set(['127.0.0.1','localhost',...(testMode?[]:addresses)].map(a=>`${a}:${port}`));
let publicOrigin='';
if(!testMode&&process.env.DEMENTOR_PUBLIC_URL){
  const publicUrl=new URL(process.env.DEMENTOR_PUBLIC_URL);
  if(!['http:','https:'].includes(publicUrl.protocol)||publicUrl.username||publicUrl.password||publicUrl.pathname!=='/'||publicUrl.search||publicUrl.hash)throw new Error('DEMENTOR_PUBLIC_URL должен быть корневым http(s) URL без логина, пути и параметров');
  publicOrigin=publicUrl.origin;
  allowedHosts.add(publicUrl.host);
}
const stateFile=process.env.DEMENTOR_STATE||path.join(root,'data','world.json');
const qaRecorder=createQARecorder(stateFile,{enabled:testMode||process.env.DEMENTOR_QA_LOG==='1'});
fs.mkdirSync(path.dirname(stateFile),{recursive:true});
const state=fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile,'utf8')):createWorld();
const legacySaveRequiresBackup=fs.existsSync(stateFile)&&state?.schema!=='dementor-cities-v1';
let legacyBackupDone=false;
const network=new CityNetwork(state);
const game=network.origin;
const adminKey=String(process.env.DEMENTOR_QA_ADMIN_KEY||'');
const adminAvailable=adminKey.length>=24&&(testMode||publicOrigin.startsWith('https://'));
const stateFor=p=>({...network.snapshot(p),qaMode:testMode,qaRecording:qaRecorder.enabled,qaAdminAvailable:adminAvailable});
const musicDir=path.join(root,'data','music');fs.mkdirSync(musicDir,{recursive:true});
function refreshMusic(){network.setMusic(scanMusic([[path.join(root,'public','music'),'/music/'],[musicDir,'/custom-music/']]));}
refreshMusic();
const streams=new Map();
let lastBroadcast=0;
function save(){
  if(!network.needsSave())return;
  if(legacySaveRequiresBackup&&!legacyBackupDone){
    const original=stateFile+'.before-city-upgrade-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
    fs.copyFileSync(stateFile,original,fs.constants.COPYFILE_EXCL);
    legacyBackupDone=true;
  }
  fs.writeFileSync(stateFile+'.tmp',JSON.stringify(network.serialize()));
  fs.renameSync(stateFile+'.tmp',stateFile);
  network.markSaved();
}
const terrainCursors=new WeakMap();
function terrainEvent(snapshot,res){const packed=packTerrainSse(snapshot,terrainCursors.get(res));terrainCursors.set(res,packed.cursor);return `data: ${JSON.stringify(packed.snapshot)}\n\n`;}
function broadcast(){for(const[id,set]of streams){const p=network.findId(id)?.p;if(!p)continue;const snapshot=stateFor(p);for(const res of set)res.write(terrainEvent(snapshot,res));}}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(withHttpCode(data,status)));}
async function body(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>4096)throw Error('Слишком большой запрос');}return JSON.parse(text||'{}');}
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,`http://127.0.0.1:${port}`);
    if(!allowedHosts.has(req.headers.host)|| (req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`&&req.headers.origin!==publicOrigin)){json(res,403,{ok:false,message:'Открой игру по адресу этого сервера'});return;}
    res.setHeader('X-Content-Type-Options','nosniff');
    if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
    if(url.pathname==='/api/health'){json(res,200,{ok:true,version,testMode});return;}
    if(testMode&&url.pathname==='/__test'&&req.method==='POST'){
      if(req.headers['x-test-key']!=='local-integration-tests'){json(res,403,{ok:false});return;}
      const data=await body(req);
      if(data.player){const p=game.state.players[data.player];if(!p)throw Error('No test player');Object.assign(p,data.patch||{});}
      if(data.resources)for(const patch of data.resources)Object.assign(game.state.resources.find(r=>r.id===patch.id),patch);
      if(data.advanceMs)game.tick(data.advanceMs);
      game.changed();save();broadcast();json(res,200,{ok:true,state:game.state});return;
    }
    if(url.pathname==='/api/join'&&req.method==='POST'){const d=await body(req);const p=game.join(d.name,d.gender);network.snapshot(p);qaRecorder.join(p,'origin');save();json(res,200,{ok:true,id:p.id,token:p.token});return;}
    if(url.pathname.startsWith('/api/')){
      const token=req.headers.authorization?.replace(/^Bearer /,'')||url.searchParams.get('token');
      const p=network.findToken(token)?.p;if(!p){json(res,401,{ok:false,message:'Войди в мир заново'});return;}
      if(url.pathname==='/api/events'){
        res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});
        let set=streams.get(p.id);if(!set){set=new Set();streams.set(p.id,set);network.gameFor(p).connect(p);qaRecorder.connect(p,network.findId(p.id)?.cityId);}set.add(res);res.write(terrainEvent(stateFor(p),res));
        req.on('close',()=>{set.delete(res);if(set.size===0){streams.delete(p.id);qaRecorder.disconnect(p,network.findId(p.id)?.cityId);network.gameFor(p)?.disconnect(p);save();}});return;
      }
      if(url.pathname==='/api/state'){json(res,200,stateFor(p));return;}
      if(url.pathname==='/api/qa-marker'&&req.method==='POST'){if(!qaRecorder.enabled){json(res,403,{ok:false,message:'Включи DEMENTOR_QA_LOG=1 на тестовом сервере'});return;}const info=await body(req),item=qaRecorder.marker(p,network.findId(p.id)?.cityId,info.label);json(res,200,{ok:true,marker:item});return;}
      if(testMode&&url.pathname==='/api/qa-export'&&req.method==='GET'){res.writeHead(200,{'Content-Type':'application/x-ndjson; charset=utf-8','Content-Disposition':'attachment; filename="'+path.basename(qaRecorder.file)+'"','Cache-Control':'no-store'});res.end(qaRecorder.export());return;}
      if(url.pathname==='/api/combat/state'&&req.method==='GET'){
        const g=network.gameFor(p),id=p.combatP0?.activeSessionId||p.combatP0?.lastSessionId;
        const battle=id?combatRoot(g.state).sessions[id]:null;
        json(res,200,{ok:true,active:!!(battle&&battle.status!=='CLOSED'),cityId:network.findId(p.id)?.cityId,
          battle:battle?combatView(g.state,id,p.id):null,me:p.id,name:p.name,
          profile:p.combatP0?{weapon:p.combatP0.weapon,ammo:p.combatP0.ammo}:null,food:p.bag.food,wallet:p.wallet,
          ammoShop:g.state.combatAmmoShop||{ammo:240}});
        return;
      }
      if(url.pathname==='/api/combat/lobbies'&&req.method==='GET'){
        const g=network.gameFor(p),root=combatRoot(g.state);
        json(res,200,{ok:true,lobbies:Object.values(root.sessions).filter(s=>s.status==='LOBBY')
          .map(s=>({id:s.id,owner:g.state.players[s.ownerId]?.name||'Житель',
            participants:Object.keys(s.members).length}))});return;
      }
      if(req.method!=='POST'){json(res,405,{ok:false,message:'Метод не поддерживается'});return;}
      if(url.pathname==='/api/music-upload'){
        if(!['127.0.0.1:'+port,'localhost:'+port].includes(req.headers.host))throw Error('MP3 добавляет хозяин сервера через localhost');
        if(!network.gameFor(p).online.has(p.id)||(p.scene||'city')!=='city')throw Error('Войди в город');network.gameFor(p).near(p,PLAZA.objects.find(o=>o.id==='jukebox'));
        const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>20*1024*1024)throw Error('MP3 должен быть меньше 20 МБ');chunks.push(chunk);}const bytes=Buffer.concat(chunks);const duration=audioDuration(bytes,'.mp3');if(duration>900)throw Error('Трек должен быть не длиннее 15 минут');
        const title=String(url.searchParams.get('name')||'Новый трек').replace(/\.mp3$/i,'').replace(/[^\p{L}\p{N} ._-]/gu,'').trim().slice(0,80)||'Новый трек';const id=createHash('sha256').update(bytes).digest('hex').slice(0,24);
        if(game.musicCatalog.some(t=>t.id===id)){json(res,200,{ok:true,message:'Этот трек уже есть в автомате'});return;}
        const disk=fs.readdirSync(musicDir).reduce((n,f)=>n+fs.lstatSync(path.join(musicDir,f)).size,0);if(disk+size>100*1024*1024||game.musicCatalog.length>=100)throw Error('Музыкальная коллекция заполнена');fs.writeFileSync(path.join(musicDir,title+'-'+id.slice(0,8)+'.mp3'),bytes,{flag:'wx'});refreshMusic();game.changed();broadcast();json(res,200,{ok:true,message:'MP3 добавлен в музыкальный автомат'});return;
      }
      const data=await body(req);
      if(url.pathname==='/api/combat/action'){
        const g=network.gameFor(p),kind=String(data.type||''),now=Date.now(),walletBeforeCombat=p.wallet;
        // HTTP Bearer token authenticates combat independently of city's SSE connection.
        if(!data.requestId||typeof data.requestId!=='string'||data.requestId.length<4||data.requestId.length>100)throw Error('Требуется requestId');
        let result;
        if(['create','join','buyAmmo'].includes(kind)){
          const old=p.results?.find(r=>r.id===data.requestId);if(old){json(res,200,withActionCode(old.result));return;}
          if((p.scene||'city')!=='city'||p.spirit||p.delivery?.picked||p.job)throw Error('Закончи городское дело перед боем');
          if(network.findId(p.id)?.cityId!=='origin')throw Error('Пока боевая зона только у первого города');
          g.near(p,{x:29,y:35});
          if(kind==='create'){
            if(p.combatP0?.activeSessionId)throw Error('Ты уже записан в экспедицию');
            const sessionId=createCombat(g.state,g.state.players,p.id,now);
            p.combatP0.activeSessionId=sessionId;result={ok:true,sessionId};
          }else if(kind==='join'){
            if(typeof data.sessionId!=='string')throw Error('Выбери экспедицию');
            joinCombat(g.state,g.state.players,data.sessionId,p.id);
            p.combatP0.activeSessionId=data.sessionId;result={ok:true,sessionId:data.sessionId};
          }else{
            if(p.combatP0?.activeSessionId)throw Error('Вернись из боя');
            const shop=g.state.combatAmmoShop||={ammo:240},quantity=12,price=12;
            if(!Number.isSafeInteger(shop.ammo)||shop.ammo<quantity||p.wallet<price)throw Error('Патроны закончились в лавке или недостаточно PAPER');
            shop.ammo-=quantity;p.wallet-=price;g.state.treasury+=price;
            if(!p.combatP0)throw Error('Сначала получи стартовое оружие');
            p.combatP0.ammo+=quantity;
            g.state.transactions.push({id:data.requestId,player:p.id,amount:-price,reason:'combat-ammo',time:now});
            result={ok:true,ammo:p.combatP0.ammo,shopRemaining:shop.ammo};
          }
          p.results||=[];p.results.push({id:data.requestId,result});p.results=p.results.slice(-128);
        }else{
          const id=p.combatP0?.activeSessionId;
          if(!id&&kind==='input'){json(res,200,{ok:true,ignored:true});return;}
          if(!id)throw Error('Нет активной экспедиции');
          result=combatAction(g.state,g.state.players,id,p.id,data,now);
          if(kind==='extract'||kind==='retreat'){
            const members=g.state.combatP0.sessions[id].members;
            for(const memberId of Object.keys(members)){
              const m=g.state.players[memberId];if(!m)continue;
              m.combatP0.lastSessionId=id;m.combatP0.activeSessionId=null;
            }
          }
        }
        // High-frequency movement is transient: never sync-write the entire world on every 125ms input.
        // Critical inventory/weapon/combat commands are still persisted immediately.
        if(kind==='input'){qaRecorder.input(p,network.findId(p.id)?.cityId,data);json(res,200,result);return;}
        qaRecorder.command(p,network.findId(p.id)?.cityId,{...data,type:'combat:'+kind},{ok:true},walletBeforeCombat);g.changed();save();json(res,200,withActionCode(result));return;
      }
      if(url.pathname==='/api/admin/treasury'){
        if(!adminAvailable){json(res,403,{ok:false,message:'Тестовая казна отключена: нужны HTTPS и серверный ключ'});return;}
        const supplied=Buffer.from(String(req.headers['x-dementor-qa-admin']||'')),expected=Buffer.from(adminKey);
        if(supplied.length!==expected.length||!timingSafeEqual(supplied,expected)){json(res,403,{ok:false,message:'Нет полномочий казначея'});return;}
        const amount=Number(data.amount),target=network.findId(data.targetPlayerId||p.id);
        if(!Number.isSafeInteger(amount)||amount<1||amount>500||!target)throw Error('Укажи жителя и от 1 до 500 PAPER');
        if(target.g.state.treasury<amount)throw Error('В казне нет этой суммы');
        target.g.transfer(target.p,amount,'qa-treasury-grant');
        target.g.state.transactions.at(-1).approvedBy=p.id;
        qaRecorder.command(p,network.findId(p.id)?.cityId,{type:'admin:treasury-grant',targetPlayerId:target.p.id,amount},{ok:true},p.wallet);
        target.g.changed();save();broadcast();
        json(res,200,{ok:true,message:'Перечислено '+amount+' PAPER из казны',treasury:target.g.state.treasury});return;
      }
      if(url.pathname==='/api/input'){if(!network.gameFor(p).online.has(p.id))throw Error('Нет подключения к миру');network.gameFor(p).input(p,data);qaRecorder.input(p,network.findId(p.id)?.cityId,data);json(res,200,{ok:true});return;}
      if(url.pathname==='/api/action'){if(!network.gameFor(p).online.has(p.id))throw Error('Нет подключения к миру');const before=p.wallet;const result=['createCity','travelCity','pagerBuy','pagerSend','pagerRead','pagerBlock','pagerList','pagerDial'].includes(data.type)?network.command(p,data):network.gameFor(p).command(p,data);qaRecorder.command(p,network.findId(p.id)?.cityId,data,result,before);save();broadcast();json(res,200,withActionCode(result));return;}
      json(res,404,{ok:false,message:'Нет такого действия'});return;
    }
    if(url.pathname.startsWith('/music/')||url.pathname.startsWith('/custom-music/')){
      const track=game.musicCatalog.find(t=>t.url===url.pathname);if(!track){res.writeHead(404);res.end();return;}const dir=url.pathname.startsWith('/custom-music/')?musicDir:path.join(root,'public','music'),file=path.join(dir,decodeURIComponent(url.pathname.split('/').at(-1))),size=fs.statSync(file).size;const range=req.headers.range;let start=0,end=size-1,status=200;if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}if(!m[1]){start=Math.max(0,size-Number(m[2]));}else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}if(!Number.isSafeInteger(start)||start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);}res.writeHead(status,{'Content-Type':file.endsWith('.mp3')?'audio/mpeg':'audio/wav','Content-Length':end-start+1,'Accept-Ranges':'bytes','Cache-Control':'no-cache'});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file,{start,end}).pipe(res);return;
    }
    // DL-TERRAIN-01 immutable, allowlisted assets; no arbitrary filesystem reads.
    const terrainFile=/^\/assets\/terrain\/(manifest\.json|dl-terrain-01-atlas-(?:128|256)-[a-f0-9]{12}\.(?:png|webp))$/.exec(url.pathname);
    if(terrainFile){
      const name=terrainFile[1],filePath=path.join(root,'public','assets','terrain',name);
      if(!fs.existsSync(filePath)){res.writeHead(404);res.end('Terrain not built');return;}
      const isManifest=name==='manifest.json';
      res.writeHead(200,{'Content-Type':isManifest?'application/json; charset=utf-8':name.endsWith('.webp')?'image/webp':'image/png',
        'Cache-Control':isManifest?'no-cache':'public, max-age=31536000, immutable'});
      if(req.method==='HEAD'){res.end();return;}
      fs.createReadStream(filePath).pipe(res);return;
    }
    const files={'/':'index.html','/app.js':'app.js','/life-ui.js':'life-ui.js','/plaza-ui.js':'plaza-ui.js','/city-ui.js':'city-ui.js','/estate-ui.js':'estate-ui.js','/telecom-ui.js':'telecom-ui.js','/admin-ui.js':'admin-ui.js','/civic-ui.js':'civic-ui.js','/world-ui.js':'world-ui.js','/world-ui-fixes.js':'world-ui-fixes.js','/world-quests.js':'world-quests.js','/styles.css':'styles.css','/terrain-01.js':'terrain-01.js','/combat':'combat.html','/combat.html':'combat.html','/combat.js':'combat.js','/combat.css':'combat.css','/manifest.webmanifest':'manifest.webmanifest'};
    const file=files[url.pathname];if(!file){res.writeHead(404);res.end('Not found');return;}
    const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',webmanifest:'application/manifest+json; charset=utf-8'};
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'");
    res.writeHead(200,{'Content-Type':types[file.split('.').at(-1)],'Cache-Control':'no-cache'});res.end(file==='index.html'?fs.readFileSync(path.join(root,'public',file),'utf8').replace('</body>','<script src="/world-ui.js" defer></script><script src="/world-ui-fixes.js" defer></script><script src="/world-quests.js" defer></script><script src="/telecom-ui.js" defer></script><script src="/admin-ui.js" defer></script><script src="/civic-ui.js" defer></script></body>'):fs.readFileSync(path.join(root,'public',file)));
  }catch(e){json(res,400,{ok:false,message:e.message});}
});
let lastTick=Date.now();
const timer=setInterval(()=>{const now=Date.now();for(const [cityId,g] of network.games){
  g.tick(Math.max(0,now-lastTick));
  qaRecorder.sampleState(g,cityId);
   for(const [sid,s] of Object.entries(g.state.combatP0?.sessions||{})){
    if(s.status==='ACTIVE'){advanceCombat(g.state,sid,now);g.changed();}
  }
}lastTick=now;if(Date.now()-lastBroadcast>=100){broadcast();lastBroadcast=Date.now();}},50);
const saver=setInterval(save,1000);
function stop(){clearInterval(timer);clearInterval(saver);qaRecorder.finish();save();for(const set of streams.values())for(const res of set)res.end();server.close(()=>process.exit(0));setTimeout(()=>process.exit(0),500).unref();}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
server.listen(port,host,()=>{
  console.log(`Dementor Live · http://127.0.0.1:${port}${testMode?' · isolated test server':''}`);
  if(!testMode&&host==='0.0.0.0')for(const address of addresses)console.log(`Для второго устройства в вашей сети: http://${address}:${port}`);
});
server.on('error',e=>{console.error(e.message);process.exit(1);});
