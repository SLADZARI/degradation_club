#!/usr/bin/env node
// Read-only check of a COPIED city world save. No in-place migration and no writes to the file.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {CityNetwork} from '../city-network.mjs';
import {aggregateWorld} from '../organism-bridge.mjs';
const filename=process.argv[2];
if(!filename){console.error('Usage: node tools/organism-save-readback.mjs /path/to/COPY-of-world.json');process.exit(2);}
const hash=buf=>createHash('sha256').update(buf).digest('hex');
try{
 const first=fs.readFileSync(filename),before=hash(first),world=JSON.parse(first.toString('utf8'));
 const net=new CityNetwork(structuredClone(world));
 const snapshot=aggregateWorld(net,{version:'save-copy-readback',testMode:true});
 const after=hash(fs.readFileSync(filename));
 if(after!==before)throw Error('READBACK SOURCE CHANGED: abort');
 if(!Number.isSafeInteger(snapshot.population.players)||snapshot.money.trackedTotal<0)throw Error('Invalid snapshot');
 console.log(JSON.stringify({ok:true,schema:snapshot.schema,sourceFileHash:before,sourceUnchanged:true,cities:snapshot.cities.length,trackedPAPER:snapshot.money.trackedTotal,physicalKinds:Object.keys(snapshot.resources.total).length,coverage:snapshot.coverage},null,2));
}catch(err){console.error('ORGANISM READBACK FAIL:',err.message);process.exit(1);}
