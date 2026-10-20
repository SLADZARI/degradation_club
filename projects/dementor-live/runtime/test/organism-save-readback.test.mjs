import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';import {tmpdir} from 'node:os';import {join} from 'node:path';import {fileURLToPath} from 'node:url';import {createWorld} from '../world-expansion-adapter.mjs';
test('clone of current in-memory world stays byte-for-byte untouched after readback',()=>{
 const root=mkdtempSync(join(tmpdir(),'organism-save-'));
 try{const p=join(root,'world.json'),raw=JSON.stringify(createWorld());writeFileSync(p,raw);
  const cwd=fileURLToPath(new URL('../',import.meta.url));
  const child=spawnSync(process.execPath,['tools/organism-save-readback.mjs',p],{cwd,encoding:'utf8',timeout:12000});
  assert.equal(child.status,0,child.stderr);const result=JSON.parse(child.stdout);
  assert.equal(result.ok,true);assert.equal(result.sourceUnchanged,true);assert.equal(readFileSync(p,'utf8'),raw);
 }finally{rmSync(root,{recursive:true,force:true})}
});
