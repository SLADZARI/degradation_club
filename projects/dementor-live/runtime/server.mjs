import http from 'node:http';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Game, createWorld } from './world.mjs';
import {scanMusic,audioDuration,PLAZA} from './plaza.mjs';
import {createHash} from 'node:crypto';
import { CONFIG } from './config.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const testMode=process.argv.includes('--test');
const port=Number(process.env.DEMENTOR_PORT||4173);
const host=testMode?'127.0.0.1':(process.env.DEMENTOR_HOST||'0.0.0.0');
const addresses=Object.values(os.networkInterfaces()).flat().filter(a=>a.family==='IPv4'&&!a.internal).map(a=>a.address);
const allowedHosts=new Set(['127.0.0.1','localhost',...(testMode?[]:addresses)].map(a=>`${a}:${port}`));
const stateFile=process.env.DEMENTOR_STATE||path.join(root,'data','world.json');
fs.mkdirSync(path.dirname(stateFile),{recursive:true});
const state=fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile,'utf8')):createWorld();
const game=new Game(state);
const musicDir=path.join(root,'data','music');fs.mkdirSync(musicDir,{recursive:true});
function refreshMusic(){game.musicCatalog=scanMusic([[path.join(root,'public','music'),'/music/'],[musicDir,'/custom-music/']]);}
refreshMusic();
const streams=new Map();
let lastBroadcast=0;
function save(){if(!game.dirty)return;fs.writeFileSync(stateFile+'.tmp',JSON.stringify(game.state));fs.renameSync(stateFile+'.tmp',stateFile);game.dirty=false;}
function broadcast(){for(const[id,set]of streams){const p=game.state.players[id];if(!p)continue;const msg=`data: ${JSON.stringify(game.snapshot(p))}\n\n`;for(const res of set)res.write(msg);}}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function body(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>4096)throw Error('Слишком большой запрос');}return JSON.parse(text||'{}');}
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,`http://127.0.0.1:${port}`);
    if(!allowedHosts.has(req.headers.host)|| (req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)){json(res,403,{ok:false,message:'Открой игру по адресу этого сервера'});return;}
    res.setHeader('X-Content-Type-Options','nosniff');
    if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
    if(url.pathname==='/api/health'){json(res,200,{ok:true,version:'0.2.0',testMode});return;}
    if(testMode&&url.pathname==='/__test'&&req.method==='POST'){
      if(req.headers['x-test-key']!=='local-integration-tests'){json(res,403,{ok:false});return;}
      const data=await body(req);
      if(data.player){const p=game.state.players[data.player];if(!p)throw Error('No test player');Object.assign(p,data.patch||{});}
      if(data.resources)for(const patch of data.resources)Object.assign(game.state.resources.find(r=>r.id===patch.id),patch);
      if(data.advanceMs)game.tick(data.advanceMs);
      game.changed();save();broadcast();json(res,200,{ok:true,state:game.state});return;
    }
    if(url.pathname==='/api/join'&&req.method==='POST'){const d=await body(req);const p=game.join(d.name);save();json(res,200,{ok:true,id:p.id,token:p.token});return;}
    if(url.pathname.startsWith('/api/')){
      const token=req.headers.authorization?.replace(/^Bearer /,'')||url.searchParams.get('token');
      const p=game.auth(token);if(!p){json(res,401,{ok:false,message:'Войди в мир заново'});return;}
      if(url.pathname==='/api/events'){
        res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});
        let set=streams.get(p.id);if(!set){set=new Set();streams.set(p.id,set);game.connect(p);}set.add(res);res.write(`data: ${JSON.stringify(game.snapshot(p))}\n\n`);
        req.on('close',()=>{set.delete(res);if(set.size===0){streams.delete(p.id);game.disconnect(p);save();}});return;
      }
      if(url.pathname==='/api/state'){json(res,200,game.snapshot(p));return;}
      if(req.method!=='POST'){json(res,405,{ok:false,message:'Метод не поддерживается'});return;}
      if(url.pathname==='/api/music-upload'){
        if(!['127.0.0.1:'+port,'localhost:'+port].includes(req.headers.host))throw Error('MP3 добавляет хозяин сервера через localhost');
        if(!game.online.has(p.id)||(p.scene||'city')!=='city')throw Error('Войди в город');game.near(p,PLAZA.objects.find(o=>o.id==='jukebox'));
        const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>20*1024*1024)throw Error('MP3 должен быть меньше 20 МБ');chunks.push(chunk);}const bytes=Buffer.concat(chunks);const duration=audioDuration(bytes,'.mp3');if(duration>900)throw Error('Трек должен быть не длиннее 15 минут');
        const title=String(url.searchParams.get('name')||'Новый трек').replace(/\.mp3$/i,'').replace(/[^\p{L}\p{N} ._-]/gu,'').trim().slice(0,80)||'Новый трек';const id=createHash('sha256').update(bytes).digest('hex').slice(0,24);
        if(game.musicCatalog.some(t=>t.id===id)){json(res,200,{ok:true,message:'Этот трек уже есть в автомате'});return;}
        const disk=fs.readdirSync(musicDir).reduce((n,f)=>n+fs.lstatSync(path.join(musicDir,f)).size,0);if(disk+size>100*1024*1024||game.musicCatalog.length>=100)throw Error('Музыкальная коллекция заполнена');fs.writeFileSync(path.join(musicDir,title+'-'+id.slice(0,8)+'.mp3'),bytes,{flag:'wx'});refreshMusic();game.changed();broadcast();json(res,200,{ok:true,message:'MP3 добавлен в музыкальный автомат'});return;
      }
      const data=await body(req);
      if(url.pathname==='/api/input'){if(!game.online.has(p.id))throw Error('Нет подключения к миру');game.input(p,data);json(res,200,{ok:true});return;}
      if(url.pathname==='/api/action'){if(!game.online.has(p.id))throw Error('Нет подключения к миру');const result=game.command(p,data);save();broadcast();json(res,200,result);return;}
      json(res,404,{ok:false,message:'Нет такого действия'});return;
    }
    if(url.pathname.startsWith('/music/')||url.pathname.startsWith('/custom-music/')){
      const track=game.musicCatalog.find(t=>t.url===url.pathname);if(!track){res.writeHead(404);res.end();return;}const dir=url.pathname.startsWith('/custom-music/')?musicDir:path.join(root,'public','music'),file=path.join(dir,decodeURIComponent(url.pathname.split('/').at(-1))),size=fs.statSync(file).size;const range=req.headers.range;let start=0,end=size-1,status=200;if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m||(!m[1]&&!m[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}if(!m[1]){start=Math.max(0,size-Number(m[2]));}else{start=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}if(!Number.isSafeInteger(start)||start>end||start>=size){res.writeHead(416,{'Content-Range':`bytes */${size}`});res.end();return;}status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);}res.writeHead(status,{'Content-Type':file.endsWith('.mp3')?'audio/mpeg':'audio/wav','Content-Length':end-start+1,'Accept-Ranges':'bytes','Cache-Control':'no-cache'});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(file,{start,end}).pipe(res);return;
    }
    const files={'/':'index.html','/app.js':'app.js','/life-ui.js':'life-ui.js','/plaza-ui.js':'plaza-ui.js','/styles.css':'styles.css'};
    const file=files[url.pathname];if(!file){res.writeHead(404);res.end('Not found');return;}
    const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8'};
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'");
    res.writeHead(200,{'Content-Type':types[file.split('.').at(-1)],'Cache-Control':'no-cache'});res.end(fs.readFileSync(path.join(root,'public',file)));
  }catch(e){json(res,400,{ok:false,message:e.message});}
});
let lastTick=Date.now();
const timer=setInterval(()=>{const now=Date.now();game.tick(Math.max(0,now-lastTick));lastTick=now;if(Date.now()-lastBroadcast>=100){broadcast();lastBroadcast=Date.now();}},50);
const saver=setInterval(save,1000);
function stop(){clearInterval(timer);clearInterval(saver);save();for(const set of streams.values())for(const res of set)res.end();server.close(()=>process.exit(0));setTimeout(()=>process.exit(0),500).unref();}
process.on('SIGTERM',stop);process.on('SIGINT',stop);
server.listen(port,host,()=>{
  console.log(`Dementor Live · http://127.0.0.1:${port}${testMode?' · isolated test server':''}`);
  if(!testMode&&host==='0.0.0.0')for(const address of addresses)console.log(`Для второго устройства в вашей сети: http://${address}:${port}`);
});
server.on('error',e=>{console.error(e.message);process.exit(1);});
