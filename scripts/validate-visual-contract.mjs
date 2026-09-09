import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');
const fail = [];
const must = (ok, message) => { if (!ok) fail.push(message); };

const visual = read('visual-standard-v2.css');
const profile = read('dementor-profile.css');
const visualTokens = read('visual-tokens.css');
const illustrationSurfaces = read('illustration-surfaces.css');
const styles = read('styles.css');
const bridge = read('course-bridge-v1.css');
const home = read('index.html');
const community = read('community/index.html');
const communityCss = read('community-v2.css');
const eventsIndex = read('events/index.html');
const event = read('events/fuengirola/index.html');
const merch = read('merch/index.html');
const gabil = read('community/gabil/index.html');
const relations = read('dementor-relations-v1.js');

const tokens = {
  valentin: '#EFE5D3',
  nikita: '#F6E9D4',
  gabil: '#EFE6D3',
  evgeniy: '#F6EDD9'
};
for (const [name, color] of Object.entries(tokens)) {
  must(visualTokens.includes(`--dc-dementor-${name}-bg:${color}`), `missing ${name} background token ${color}`);
}

must(styles.includes("@import url('/visual-tokens.css');"), 'visual-tokens.css is not loaded globally');
must(styles.includes("@import url('/illustration-surfaces.css');"), 'illustration-surfaces.css is not loaded globally');
must(styles.includes("@import url('/visual-standard-v2.css');"), 'visual-standard-v2.css is not loaded globally');
must(!bridge.includes("ui-redesign-drive-v1.css"), 'legacy ui-redesign-drive-v1.css import still active in course bridge');
must(visual.includes('--dc-event-media-position:right top'), 'event media anchor is not top-right');
must(visual.includes("background-size:auto 100%"), 'event media is not height-first');
must(visual.includes('.dc-dementor-micro'), 'MICRO contract missing');
must(visual.includes('.dc-dementor-relation'), 'RELATION contract missing');
must(visual.includes('.dc-dementor-feature'), 'FEATURE contract missing');
must(profile.includes('.dc-dementor-profile .dc-dementor-hero__portrait'), 'HERO portrait contract missing from canonical profile owner');
must(illustrationSurfaces.includes('var(--dc-ink-bg-fuengirola)'), 'Fuengirola illustration surface token binding missing');
must(home.includes('/courses/dumai-s-opasnostyu/'), 'Home course feature missing');
must(home.includes('/events/fuengirola/'), 'Home event feature missing');
must(visual.includes(".dc-home section.dc-event:has(a[href=\"/courses/dumai-s-opasnostyu/\"])::after"), 'Home course FEATURE portrait layer missing');
must(visual.includes(".dc-home section.dc-event:has(a[href=\"/events/fuengirola/\"])::after"), 'Home Event FEATURE media layer missing');
must(visual.includes("/assets/people/dementors/valentin/dementor_valentin.webp"), 'Valentin portrait binding missing');
must((home.match(/<a class="dc-course-prototype__mentor"/g) || []).length === 1, 'Home course must contain exactly one Valentin mentor-card');
must(!home.includes('Дементор: Валентин Лосев.'), 'Home duplicate textual Valentin attribution must stay removed');

// Community hero owns one semantic source across desktop/mobile layouts.
must((community.match(/<h1\b/g) || []).length === 1, 'Community hero must contain exactly one h1');
must((community.match(/community-hero-01\.webp/g) || []).length === 1, 'Community hero image source must occur exactly once');
must((community.match(/class="hero-ref__lead"/g) || []).length === 1, 'Community hero lead source must occur exactly once');
must((community.match(/class="hero-ref__copy"/g) || []).length === 1, 'Community hero body-copy source must occur exactly once');
must(!community.includes('hero-ref__desktop'), 'Community duplicate desktop hero tree must stay removed');
must(!community.includes('hero-ref__mobile'), 'Community duplicate mobile hero tree must stay removed');
must(community.includes('hero-ref__content'), 'Community canonical hero content root missing');
must(communityCss.includes('.hero-ref__content'), 'Community canonical hero CSS owner missing');
must(communityCss.includes('minmax(0,.9fr) minmax(0,1.35fr) minmax(0,.9fr)'), 'Community 1024-safe hero grid contract missing');

// Events keeps the real record dominant and represents empty lifecycle states compactly.
must((eventsIndex.match(/<div class="dc-programme__lane\b/g) || []).length === 1, 'Events must keep exactly one full programme lane for the real event');
must((eventsIndex.match(/<span class="dc-programme__empty-state"/g) || []).length === 5, 'Events compact lifecycle rail must contain five empty states');
must((eventsIndex.match(/Пустое состояние/gi) || []).length === 1, 'Events empty-state editorial rule must be stated once');
for (const state of ['ANNOUNCED','REGISTRATION','SOLD-OUT','COMPLETED','CANCELLED']) must(eventsIndex.includes(`<strong>${state}</strong>`), `Events compact lifecycle missing ${state}`);

must(event.includes('/assets/ink/event-fuengirola-03.webp'), 'Fuengirola approved event asset missing');
must(event.includes('/assets/people/dementors/gabil/dementor_gabil.webp'), 'Fuengirola Gabil relation portrait missing');

// Public-site harmonization: Fuengirola owns one static event→Gabil relation.
// Guard runtime ownership and editorial identity density as separate invariants.
must((event.match(/<a class="dc-event-hero__relation\b/g) || []).length === 1, 'Fuengirola must contain exactly one static event→Gabil relation');
must(!relations.includes("if(path==='/events/fuengirola/')"), 'Fuengirola route-specific relation injection must stay retired');
must(!event.includes('dc-dementor-feature--gabil'), 'Fuengirola second dominant Gabil feature must stay removed');
must(!event.includes('participant relation from entity record'), 'Fuengirola internal entity-record copy leaked into public UI');
must(event.includes('ДЕМЕНТОР СОБЫТИЯ'), 'Fuengirola compact public relation label missing');

// Public copy denylist targets implementation/data-model leaks, not generic club status vocabulary.
const publicSurfaces = {home,events:eventsIndex,fuengirola:event,merch,gabil};
const forbiddenMarkers = [
  'source-of-truth',
  'canonical source-of-truth',
  'participant relation from entity record',
  'sales_state',
  'production spec',
  'CHECKOUT / DISABLED',
  'PRICE / TBD',
  'MECHANICS PENDING'
];
for (const [surface, html] of Object.entries(publicSurfaces)) {
  for (const marker of forbiddenMarkers) must(!html.toLowerCase().includes(marker.toLowerCase()), `${surface}: forbidden public implementation marker survived: ${marker}`);
}

const portraitPath = (name) => `/assets/people/dementors/${name}/dementor_${name}.webp`;
const hasPortrait = (html, name) => html.includes(portraitPath(name));

for (const name of ['valentin','nikita','gabil','evgeniy']) {
  const p = `community/${name}/index.html`;
  const html = read(p);
  must(html.includes('dc-dementor-hero'), `${p}: standard Dementor hero missing`);
  must(hasPortrait(html, name), `${p}: canonical portrait missing`);
}

for (const name of ['valentin','nikita','gabil','evgeniy']) {
  must(hasPortrait(community, name), `Community roster missing ${name} portrait`);
}

if (fail.length) {
  console.error('Dementor Club visual contract validation failed');
  for (const item of fail) console.error(`✗ ${item}`);
  process.exit(1);
}

console.log('Dementor Club visual contract validation');
console.log('✓ canonical visual token runtime + illustration surfaces active');
console.log('✓ 4 Dementor identity background tokens');
console.log('✓ global visual layer active; legacy course import absent');
console.log('✓ HERO / MICRO / RELATION / FEATURE contracts present');
console.log('✓ Home course/person FEATURE and Home event FEATURE bound to approved assets');
console.log('✓ Home course keeps one Valentin mentor identity');
console.log('✓ Community hero has one semantic content source across breakpoints');
console.log('✓ Events keeps one real lane + compact five-state lifecycle rail');
console.log('✓ public implementation/data-model markers are blocked on touched surfaces');
console.log('✓ Fuengirola media = canonical asset / top-right / height-first');
console.log('✓ Fuengirola relation owner is static; runtime duplicate + second dominant Gabil feature absent');
console.log('✓ Community roster + 4 profile heroes use canonical portraits');
console.log('0 error(s)');
