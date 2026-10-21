import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.DLGardenVisuals = undefined;
await import('../public/garden-visuals.js');
const { growthStage } = globalThis.DLGardenVisuals;

test('empty and unwatered beds show no plant stage', () => {
  assert.equal(growthStage({ crop: null, watered: false }, 0), 0);
  assert.equal(growthStage({ crop: 'carrot', watered: false, readyAt: 0 }, 0), 0);
});

test('carrot grows through four visible stages over its saved grow duration', () => {
  const bed = { crop: 'carrot', watered: true, readyAt: 120000 };
  assert.equal(growthStage(bed, 0), 1);
  assert.equal(growthStage(bed, 40000), 2);
  assert.equal(growthStage(bed, 80000), 3);
  assert.equal(growthStage(bed, 120000), 4);
});

test('hemp grows through four visible stages over its saved grow duration', () => {
  const bed = { crop: 'hemp', watered: true, readyAt: 180000 };
  assert.equal(growthStage(bed, 0), 1);
  assert.equal(growthStage(bed, 60000), 2);
  assert.equal(growthStage(bed, 120000), 3);
  assert.equal(growthStage(bed, 180000), 4);
});
