import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {createQARecorder} from '../qa-recorder.mjs';
test('JSONL QA session captures synchronized game events without saving private messages or auth tokens',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dementor-qa-'));try{
 const recorder=createQARecorder(path.join(dir,'test-save.json')),p={id:'fixture-id',name:'Женя',x:8.234,y:13,scene:'city',wallet:10};
 recorder.join(p,'origin');recorder.connect(p,'origin');recorder.input(p,'origin',{dx:1,dy:0,sprint:false});
 recorder.command(p,'origin',{type:'pagerSend',target:'phone-square',requestId:'public-test-id',text:'PRIVATE MESSAGE BODY',token:'PRIVATE AUTH TOKEN'}, {ok:true},11);
 const m=recorder.marker(p,'origin','CAM-001');
 assert.equal(m.type,'video_marker');assert.equal(m.label,'CAM-001');
 recorder.disconnect(p,'origin');recorder.finish();
 const text=recorder.export(),parsed=text.trim().split('\n').map(x=>JSON.parse(x));
 assert.ok(parsed.some(x=>x.type==='game_action'));
 assert.ok(parsed.some(x=>x.type==='movement_sample'));
 assert.ok(parsed.some(x=>x.type==='player_disconnect'));
 assert.ok(parsed.every(x=>typeof x.wallTime==='string'&&Number.isInteger(x.offsetMs)));
 assert.ok(!text.includes('PRIVATE MESSAGE BODY')&&!text.includes('PRIVATE AUTH TOKEN'));
 assert.ok(path.basename(recorder.file).startsWith('session-'));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
