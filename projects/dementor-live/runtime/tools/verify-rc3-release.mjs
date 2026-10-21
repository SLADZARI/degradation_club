import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
assert.equal(JSON.parse(read('package.json')).version,'0.5.0-rc.4');
const world=read('world.mjs');
for(const marker of ['evacuateNewFootprints(', 'this.evacuateNewFootprints(added)','constructionRescues'])assert.ok(world.includes(marker),'Missing anti-trap gameplay fix '+marker);
const browser=read('test/browser.cjs');
for(const marker of ['purchaseEstate(', '#mobileActionButton', 'NAVIGATE'])assert.ok(browser.includes(marker),'Missing browser fix '+marker);
assert.ok(read('test/inventory.cjs').includes('#bag-item-food'));
assert.ok(read('test/mobile.cjs').includes('MOBILE TAP_ROUTE_INPUT_ARRIVAL PASS'));
assert.ok(read('test/dynamic-footprint-evacuation.test.mjs').includes('completed forge never traps'));
assert.ok(read('test/rc2-cross-chain.test.mjs').includes('RC2-LINK-03'));
const publish=read('deploy/publish-preserve-world.sh');
for(const marker of ['--dry-run','--apply','--apply-fresh','full-world.tar.gz','upgrade-audit.mjs','rollback','dementor-live-world','rm -f /world/world.json'])
 assert.ok(publish.includes(marker),'Missing save-preservation guard '+marker);
assert.ok(publish.indexOf('full-world.tar.gz')<publish.indexOf('rm -f /world/world.json'),'Fresh start must archive the full world before resetting the active save');
console.log('RC3 RELEASE CONTENT PASS: corrected building geometry, tested UI chains, version and safe volume migration.');
