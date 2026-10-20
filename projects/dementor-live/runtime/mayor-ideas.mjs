import {createHash,randomUUID} from 'node:crypto';
const RATE_MS=300000,REWARD_WINDOW=86400000,ACTIVE_MS=900000;
export function initMayor(g){g.state.mayorMail||=[];for(const p of Object.values(g.state.players)){p.mayorFeedback||={lastAt:0,lastRewardAt:0,hashes:[]};p.activeGameMs||=0;}}
export function mayorAction(g,p,cmd){
 if(cmd?.type!=='mayorIdea')return null;
 if((p.scene||'city')!=='city')throw Error('Напиши мэру из города');
 if(p.spirit)throw Error('Верни тело перед обращением');
 if(cmd.fromPrompt){if((p.activeGameMs||0)<ACTIVE_MS)throw Error('Окно предложений появится после 15 минут активной игры');}
 else g.near(p,g.target('mayor'));
 const text=String(cmd.text||'').trim().replace(/[<>\x00-\x1f]/g,'').slice(0,600);
 if(text.length<20)throw Error('Опиши идею подробнее — хотя бы 20 символов');
 const profile=p.mayorFeedback||={lastAt:0,lastRewardAt:0,hashes:[]};
 const hash=createHash('sha256').update(text.replace(/\s+/g,' ').toLowerCase()).digest('hex');
 if(profile.hashes.includes(hash))throw Error('Такая идея уже отправлена мэру');
 if(profile.lastAt&&g.now-profile.lastAt<RATE_MS)throw Error('Новую идею можно отправить через 5 минут');
 const reward=(!profile.lastRewardAt||g.now-profile.lastRewardAt>=REWARD_WINDOW)&&g.cityFunds()>=50?50:0;
 if(reward){g.transfer(p,50,'mayor-idea');profile.lastRewardAt=g.now;}
 profile.lastAt=g.now;profile.hashes.push(hash);profile.hashes=profile.hashes.slice(-100);
 const letter={id:randomUUID(),player:p.id,name:p.name,gender:p.gender||'unspecified',text,at:g.now,cityId:p.cityId||'origin',reward};
 g.state.mayorMail.push(letter);g.state.mayorMail=g.state.mayorMail.slice(-500);
 return {message:reward?'Письмо доставлено в мэрию · награда 50 PAPER':'Письмо доставлено мэру. Награда за идеи доступна раз в сутки при наличии средств города.',reward,id:letter.id};
}
