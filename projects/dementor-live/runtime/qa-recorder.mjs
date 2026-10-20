// Dedicated, append-only playtest timeline. One file per recording session, adjacent to its save.
// JSONL stores actions and rough coordinates, NEVER token, message bodies or raw player input.
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
export function createQARecorder(stateFile){
 const startedAt=Date.now(),sessionId=startedAt+'-'+randomUUID().slice(0,8);
 const base=path.dirname(stateFile),folder=path.join(base,'qa-recordings');fs.mkdirSync(folder,{recursive:true});
 const file=path.join(folder,'session-'+sessionId+'.ndjson');
 const players=new Map(),lastMotion=new Map();let sequence=0;
 const write=(type,data={})=>{
   const record={seq:++sequence,sessionId,wallTime:new Date().toISOString(),offsetMs:Date.now()-startedAt,type,...data};
   fs.appendFileSync(file,JSON.stringify(record)+'\n',{encoding:'utf8',flag:'a'});
   return record;
 };
 write('recording_started',{schema:'dementor-qa-v1',notes:'Synchronize audio/video via QA marker'});
 const round=n=>Number.isFinite(n)?Math.round(n*10)/10:null;
 const where=(p,cityId)=>({playerId:p.id,playerName:p.name?.slice(0,20),cityId,scene:p.scene||'city',x:round(p.x),y:round(p.y)});
 const session={file,sessionId,startedAt,write,
  join(p,cityId){write('player_join',where(p,cityId));},
  connect(p,cityId){write('player_connect',where(p,cityId));},
  disconnect(p,cityId){write('player_disconnect',where(p,cityId));},
  input(p,cityId,input){const now=Date.now(),last=lastMotion.get(p.id)||0;if(now-last<2000)return;lastMotion.set(p.id,now);write('movement_sample',{...where(p,cityId),motion:{dx:round(input.dx),dy:round(input.dy),sprint:!!input.sprint}});},
  command(p,cityId,cmd,result,before){
    // Deliberately avoid storing private chat, pager numbers or free-text letters.
    write('game_action',{...where(p,cityId),action:String(cmd.type||'unknown').slice(0,48),target:String(cmd.target||'').slice(0,72),requestId:String(cmd.requestId||'').slice(0,100),ok:!!result.ok,walletBefore:before,walletAfter:p.wallet,deltaPaper:p.wallet-before,errorCode:result.ok?null:'ACTION_REJECTED'});
  },
  marker(p,cityId,label){
    const title=String(label||'').replace(/[<>\x00-\x1f]/g,'').trim().slice(0,80);
    if(!title)throw Error('Укажи название момента записи');
    return write('video_marker',{...where(p,cityId),label:title});
  },
  export(){return fs.readFileSync(file,'utf8');},
  finish(){write('recording_stopped');}
 };
 return session;
}
