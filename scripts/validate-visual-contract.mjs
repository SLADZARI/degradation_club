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
const inkLayout = read('ink-layout-v2.css');
const inkTuning = read('ink-layout-v2-tuning.css');
const home = read('index.html');
const homeEventCss = read('home-event-fuengirola-20260828.css');
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
must(!inkLayout.includes('dc-has-integrated-ink--fuengirola') && !inkLayout.includes('dc-ink-integrated--fuengirola'), 'retired Fuengirola owner selectors returned to ink-layout-v2.css');
must(!inkTuning.includes('dc-has-integrated-ink--fuengirola') && !inkTuning.includes('dc-ink-integrated--fuengirola'), 'retired Fuengirola owner selectors returned to ink-layout-v2-tuning.css');
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
must(visual.includes(".dc-home section.dc-event:has(a[href=\"/events/fuengirola/\"])::after"), 'Legacy Home Event media layer unexpectedly disappeared before guarded owner cleanup');
must(homeEventCss.includes("background-image:url('/assets/ink/event-fuengirola-03.webp')!important"), 'Home Fuengirola canonical decodable event asset owner missing');
must(!homeEventCss.includes('/assets/home/events/fuengirola-banner.webp'), 'Retired/corrupted Home Fuengirola banner path returned to runtime CSS');
must(homeEventCss.includes('.dc-home .dc-event.dc-section::after'), 'Home Fuengirola shared-overlay suppression missing');
must(homeEventCss.includes('content:none!important') && homeEventCss.includes('background-image:none!important'), 'Home Fuengirola duplicate image overlay is not neutralized');
must(homeEventCss.includes('width:100vw!important'), 'Home Fuengirola desktop feature is not full-bleed');
must(homeEventCss.includes('margin:0 0 0 -50vw!important'), 'Home Fuengirola full-bleed viewport anchor missing');
must(homeEventCss.includes('background-size:cover!important'), 'Home Fuengirola desktop image must cover the full feature');
must(!homeEventCss.includes('Габиль Тагиев\\A дементор'), 'Home Fuengirola decorative duplicate Gabil treatment survived');
must(relations.includes("add(fuengirola?.querySelector('.dc-event__meta'),'gabil','ДЕМЕНТОР СОБЫТИЯ')"), 'Home Fuengirola semantic Gabil relation owner missing');
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

// Events now presents the real event directly; lifecycle mechanics remain internal data, not public layout.
must((eventsIndex.match(/<div class="dc-programme__lane\b/g) || []).length === 1, 'Events must keep exactly one full programme lane for the real event');
must((eventsIndex.match(/dc-programme__empty-state/g) || []).length === 0, 'Events empty lifecycle mechanics must stay out of public DOM');
must(eventsIndex.includes('БЛИЖАЙШЕЕ СОБЫТИЕ'), 'Events visitor-facing current-event label missing');
for (const marker of ['PROGRAMME / STATUS INDEX','STATE / 01','ARCHIVE RULE','NOTES / EVENTS','Пустое состояние — тоже данные','канонической записи события']) {
  must(!eventsIndex.includes(marker), `Events public mechanics returned: ${marker}`);
}

must(event.includes('/assets/ink/event-fuengirola-03.webp'), 'Fuengirola approved event asset missing');
must(event.includes('/assets/people/dementors/gabil/dementor_gabil.webp'), 'Fuengirola Gabil relation portrait missing');

// Public-site harmonization: Fuengirola owns one static event→Gabil relation.
must((event.match(/<a class="dc-event-hero__relation\b/g) || []).length === 1, 'Fuengirola must contain exactly one static event→Gabil relation');
must(!relations.includes("if(path==='/events/fuengirola/')"), 'Fuengirola route-specific relation injection must stay retired');
must(!event.includes('dc-dementor-feature--gabil'), 'Fuengirola second dominant Gabil feature must stay removed');
must(!event.includes('participant relation from entity record'), 'Fuengirola internal entity-record copy leaked into public UI');
must(event.includes('ДЕМЕНТОР СОБЫТИЯ'), 'Fuengirola compact public relation label missing');

// Merch must read as a live catalog. Commercial truth still comes from the existing runtime source.
must(merch.includes('LIVE CATALOG'), 'Merch live-catalog framing missing');
must(merch.includes('Актуальная цена и доступность указаны на карточках.'), 'Merch visitor-facing price/availability copy missing');
for (const marker of ['SALES NOT OPEN','WEAR / PREVIEW','MERCH / SALES RULE','Визуальные макеты существуют','Продажи открываются только после утверждения']) {
  must(!merch.includes(marker), `Merch intent/preview framing returned: ${marker}`);
}

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
  'MECHANICS PENDING',
  'Пустое состояние — тоже данные',
  'канонической записи события',
  'OBJECT / WEAR / DROP сущности',
  'WORKING ASSETS',
  'MERCH CONTRACT'
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
console.log('✓ retired Fuengirola ink-layout selectors absent');
console.log('✓ HERO / MICRO / RELATION / FEATURE contracts present');
console.log('✓ Home course/person FEATURE and full-bleed Home Fuengirola FEATURE bound to approved assets');
console.log('✓ Home Fuengirola reuses canonical decodable event asset; retired corrupted banner is not referenced');
console.log('✓ Home Fuengirola has one image owner and one semantic Gabil treatment');
console.log('✓ Home course keeps one Valentin mentor identity');
console.log('✓ Community hero has one semantic content source across breakpoints');
console.log('✓ Events exposes the current event without lifecycle/process mechanics');
console.log('✓ Merch reads as live catalog while runtime remains commercial-state owner');
console.log('✓ public implementation/data-model markers are blocked on touched surfaces');
console.log('✓ Fuengirola media = canonical asset / top-right / height-first');
console.log('✓ Fuengirola relation owner is static; runtime duplicate + second dominant Gabil feature absent');
console.log('✓ Community roster + 4 profile heroes use canonical portraits');
console.log('0 error(s)');
