import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const app = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');
const life = fs.readFileSync(path.join(root, 'public/life-ui.js'), 'utf8');
const travel = fs.readFileSync(path.join(root, 'public/world-ui.js'), 'utf8');

// Evaluate the ACTUAL client functions without a browser. This test does not
// mock or duplicate the ISO math, only canvas/DOM arguments unrelated to it.
function sourceBetween(begin, end) {
  const first = app.indexOf(begin);
  assert.notEqual(first, -1, 'client function missing: ' + begin);
  const last = app.indexOf(end, first + begin.length);
  assert.notEqual(last, -1, 'client function boundary missing: ' + end);
  return app.slice(first, last);
}
const projectionSource = sourceBetween('const ISO_COS=', 'function blocked(');
const motionSource = sourceBetween('function screenAlignedMotion(', 'setInterval(()=>{');
const floorSource = sourceBetween('function groundRect(', 'function shadow(');
const makeClient = new Function('view', 'state', 'ctx', 'poly', 'rounded',
  projectionSource + '\n' + motionSource + '\n' + floorSource +
  '\nreturn {screen,worldPoint,screenAlignedMotion,groundRect};');
const approx = (actual, expected, label) =>
  assert.ok(Math.abs(actual - expected) < 1e-8, label + ': ' + actual + ' vs ' + expected);
const scenes = ['city','plot','interior','expedition','museum','farlands'];

for (const scene of scenes) {
  test('ISO30 inverse click geometry stays aligned in ' + scene, () => {
    for (const zoom of [.65, 1, 1.8, 2.5]) {
      const view = {w:1280,h:800,cx:8,cy:8,s:32*zoom};
      const {screen,worldPoint} = makeClient(view,{scene},{setLineDash(){}},()=>{},()=>{});
      for (const [x,y] of [[8,8],[0,0],[16,16],[4.25,11.7]]) {
        const point = screen(x,y), roundTrip = worldPoint(point.x,point.y);
        approx(roundTrip.x,x,'x click ' + scene);
        approx(roundTrip.y,y,'y click ' + scene);
      }
    }
  });
  test('WASD / arrows / touch stick point along SCREEN axes in ' + scene, () => {
    const view = {w:1280,h:800,cx:8,cy:8,s:32};
    const {screen,screenAlignedMotion} = makeClient(view,{scene},{setLineDash(){}},()=>{},()=>{});
    const origin = screen(8,8);
    for (const [name,sx,sy] of [['W',0,-1],['S',0,1],['A',-1,0],['D',1,0]]) {
      const [wx,wy] = screenAlignedMotion(sx,sy);
      approx(Math.hypot(wx,wy),1,'world speed '+name);
      const end = screen(8+wx,8+wy);
      const px = end.x-origin.x,py = end.y-origin.y;
      assert.ok(sx ? px*sx > 0 : Math.abs(px)<1e-8, 'horizontal key '+name);
      assert.ok(sy ? py*sy > 0 : Math.abs(py)<1e-8, 'vertical key '+name);
      if(sx)approx(py,0,'no vertical drift '+name);
      if(sy)approx(px,0,'no horizontal drift '+name);
    }
    assert.deepEqual(screenAlignedMotion(0,0),[0,0]);
  });
  test('scene floor uses the same four-corner isometric plane in ' + scene, () => {
    const view = {w:1280,h:800,cx:8,cy:8,s:32};
    let vertices = null;
    const {screen,groundRect} = makeClient(view,{scene},{setLineDash(){}},(p)=>{vertices=p},()=>{throw Error('rectangular fallback');});
    groundRect({x:0,y:0,w:16,h:16},'#eee','#888');
    assert.equal(vertices?.length,4,'four polygon vertices');
    const expected = [[0,0],[16,0],[16,16],[0,16]].map(([x,y])=>{const v=screen(x,y);return [v.x,v.y]});
    assert.deepEqual(vertices,expected);
    assert.ok(vertices[0][1]!==vertices[1][1],'not an orthographic square');
    assert.ok(vertices[0][0]===vertices[2][0],'ISO30 diagonals match');
  });
}

test('all interior/region scene renderers use shared projected screen and floor',()=>{
  assert.match(life,/function drawHome\(time\)/);
  assert.match(life,/groundRect\(\{x:0,y:0,w:16,h:16\}/);
  assert.match(travel,/function drawTravelScene\(time\)/);
  assert.match(travel,/groundRect\(\{x:0,y:0,w:region.width,h:region.height\}/);
});
test('manual motion is remapped, but autopilot world-coordinate route stays unrotated',()=>{
  assert.match(app,/if\(\(touchMove\|\|.*?keys.*?\)\&\&\(dx\|\|dy\)\)\[dx,dy\]=screenAlignedMotion\(dx,dy\)/);
  assert.match(app,/const n=Math\.hypot\(dx,dy\);if\(n\)\{const throttle/);
});
