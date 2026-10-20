import test from 'node:test';
import assert from 'node:assert/strict';
import {stablePlotTentVariant,candidateTentSVG} from './visual-variants.mjs';
test('8 starting plot IDs have 8 distinct graphics; stable on reload',()=>{
 const values=Array.from({length:8},(_,i)=>stablePlotTentVariant('origin',`plot-${i+1}`));
 assert.deepEqual(values,[1,2,3,4,5,6,7,8]);
 assert.equal(new Set(values).size,8);
 for(const cityId of ['origin','city-01','test-other-city']){
  const variants=Array.from({length:8},(_,i)=>stablePlotTentVariant(cityId,`plot-${i+1}`));
  assert.equal(new Set(variants).size,8);
  assert.deepEqual(variants,Array.from({length:8},(_,i)=>stablePlotTentVariant(cityId,`plot-${i+1}`)));
 }
 assert.equal(candidateTentSVG('origin','plot-8'),'plot-personal-tent-plot-8.svg');
});
