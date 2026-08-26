import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const fail = [];
const must = (ok, message) => { if (!ok) fail.push(message); };

const visual = read('visual-standard-v2.css');
const styles = read('styles.css');
const bridge = read('course-bridge-v1.css');
const home = read('index.html');
const community = read('community/index.html');
const event = read('events/fuengirola/index.html');

const tokens = {
  valentin: '#EFE5D3',
  nikita: '#F6E9D4',
  gabil: '#EFE6D3',
  evgeniy: '#F6EDD9'
};
for (const [name, color] of Object.entries(tokens)) {
  must(visual.includes(`--dc-dementor-${name}-bg:${color}`), `missing ${name} background token ${color}`);
}

must(styles.includes("@import url('/visual-standard-v2.css');"), 'visual-standard-v2.css is not loaded globally');
must(!bridge.includes("ui-redesign-drive-v1.css"), 'legacy ui-redesign-drive-v1.css import still active in course bridge');
must(visual.includes('--dc-event-media-position:right top'), 'event media anchor is not top-right');
must(visual.includes("background-size:auto 100%"), 'event media is not height-first');
must(visual.includes('.dc-dementor-micro'), 'MICRO contract missing');
must(visual.includes('.dc-dementor-relation'), 'RELATION contract missing');
must(visual.includes('.dc-dementor-feature'), 'FEATURE contract missing');
must(visual.includes('.dc-dementor-hero__portrait'), 'HERO portrait contract missing');
must(home.includes('/courses/dumai-s-opasnostyu/'), 'Home course feature missing');
must(visual.includes("/assets/people/dementors/valentin/portrait-ink.webp"), 'Home Valentin MICRO portrait binding missing');
must(event.includes('/assets/event-fuengirola-03.webp'), 'Fuengirola approved event asset missing');
must(event.includes('/assets/people/dementors/gabil/portrait-ink.webp'), 'Fuengirola Gabil relation portrait missing');

for (const name of ['valentin','nikita','gabil','evgeniy']) {
  const p = `community/${name}/index.html`;
  const html = read(p);
  must(html.includes('dc-dementor-hero'), `${p}: standard Dementor hero missing`);
  must(html.includes(`/assets/people/dementors/${name}/portrait-ink.webp`), `${p}: canonical portrait missing`);
}

for (const name of ['valentin','nikita','gabil','evgeniy']) {
  must(community.includes(`/assets/people/dementors/${name}/portrait-ink.webp`), `Community roster missing ${name} portrait`);
}

if (fail.length) {
  console.error('Dementor Club visual contract validation failed');
  for (const item of fail) console.error(`✗ ${item}`);
  process.exit(1);
}

console.log('Dementor Club visual contract validation');
console.log('✓ 4 Dementor identity background tokens');
console.log('✓ global visual layer active; legacy course import absent');
console.log('✓ HERO / MICRO / RELATION / FEATURE contracts present');
console.log('✓ Fuengirola media = existing asset / top-right / height-first');
console.log('✓ Community roster + 4 profile heroes use canonical portraits');
console.log('0 error(s)');
