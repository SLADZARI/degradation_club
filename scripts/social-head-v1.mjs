import fs from 'node:fs';
import path from 'node:path';

export const SOCIAL_ORIGIN = 'https://dementor.club';
export const DEFAULT_SOCIAL_IMAGE_PATH = '/assets/ink/home-community-01.webp';
export const COMMUNITY_SOCIAL_IMAGE_PATH = '/assets/ink/community-hero-01.webp';
export const FAVICON_PATH = '/favicon.svg';

const SOCIAL_IMAGE_OVERRIDES = new Map([
  ['/community/', COMMUNITY_SOCIAL_IMAGE_PATH],
  ['/share/artifact/', COMMUNITY_SOCIAL_IMAGE_PATH],
]);

const escapeRegExp = value => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapeAttr = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const toPosix = value => String(value).replaceAll('\\', '/');

export function routeFromHtmlRel(rel) {
  const clean = toPosix(rel);
  if (clean === 'index.html') return '/';
  if (clean.endsWith('/index.html')) return `/${clean.slice(0, -'/index.html'.length)}/`;
  return `/${clean}`;
}

function isNoindexHtml(html) {
  return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
    || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
}

function getMetaContent(html, key, value) {
  const escaped = escapeRegExp(value);
  const keyFirst = new RegExp(`<meta\\b[^>]*\\b${key}=["']${escaped}["'][^>]*\\bcontent=["']([^"']*)["'][^>]*>`, 'i');
  const contentFirst = new RegExp(`<meta\\b[^>]*\\bcontent=["']([^"']*)["'][^>]*\\b${key}=["']${escaped}["'][^>]*>`, 'i');
  return html.match(keyFirst)?.[1] ?? html.match(contentFirst)?.[1] ?? null;
}

function hasLinkRel(html, rel) {
  return new RegExp(`<link\\b[^>]*\\brel=["'][^"']*\\b${escapeRegExp(rel)}\\b[^"']*["'][^>]*>`, 'i').test(html);
}

function getTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || 'Dementor Club';
}

function getDescription(html) {
  return getMetaContent(html, 'name', 'description') || 'Dementor Club — клуб и культурная платформа.';
}

function getFirstImageAlt(html) {
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const alt = match[1].match(/\balt=["']([^"']+)["']/i)?.[1]?.trim();
    if (alt) return alt;
  }
  return null;
}

function imageType(url) {
  const clean = String(url).split(/[?#]/, 1)[0].toLowerCase();
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'image/jpeg';
  if (clean.endsWith('.png')) return 'image/png';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.gif')) return 'image/gif';
  return null;
}

function removeMeta(html, key, value) {
  const escaped = escapeRegExp(value);
  return html.replace(new RegExp(`<meta\\b(?=[^>]*\\b${key}=["']${escaped}["'])[^>]*>\\s*`, 'gi'), '');
}

function appendHead(html, lines) {
  if (!lines.length) return html;
  if (!html.includes('</head>')) throw new Error('Cannot inject canonical social head: </head> missing');
  return html.replace('</head>', `${lines.join('\n')}\n</head>`);
}

function ensureMeta(html, key, value, content) {
  if (getMetaContent(html, key, value) !== null) return html;
  return appendHead(html, [`<meta ${key}="${escapeAttr(value)}" content="${escapeAttr(content)}">`]);
}

function ensureCanonical(html, absoluteUrl) {
  if (hasLinkRel(html, 'canonical')) return html;
  return appendHead(html, [`<link rel="canonical" href="${escapeAttr(absoluteUrl)}">`]);
}

function ensureFavicon(html) {
  if (new RegExp(`<link\\b[^>]*\\brel=["'](?:icon|shortcut icon)["'][^>]*\\bhref=["']${escapeRegExp(FAVICON_PATH)}["']`, 'i').test(html)) return html;
  return appendHead(html, [
    `<link rel="icon" type="image/svg+xml" href="${FAVICON_PATH}" sizes="any">`,
    '<link rel="manifest" href="/site.webmanifest">',
  ]);
}

function replaceSocialImage(html, absoluteImage) {
  for (const [key, value] of [['property','og:image'], ['property','og:image:secure_url'], ['property','og:image:type'], ['name','twitter:image']]) {
    html = removeMeta(html, key, value);
  }
  const type = imageType(absoluteImage) || 'image/webp';
  return appendHead(html, [
    `<meta property="og:image" content="${escapeAttr(absoluteImage)}">`,
    `<meta property="og:image:secure_url" content="${escapeAttr(absoluteImage)}">`,
    `<meta property="og:image:type" content="${type}">`,
    `<meta name="twitter:image" content="${escapeAttr(absoluteImage)}">`,
  ]);
}

export function normalizeCanonicalSocialHead(html, rel) {
  const route = routeFromHtmlRel(rel);
  const absoluteUrl = new URL(route, SOCIAL_ORIGIN).href;
  const noindex = isNoindexHtml(html);
  html = ensureFavicon(html);

  const overridePath = SOCIAL_IMAGE_OVERRIDES.get(route);
  if (overridePath) html = replaceSocialImage(html, new URL(overridePath, SOCIAL_ORIGIN).href);
  if (noindex && route !== '/share/artifact/') return html;

  const title = getTitle(html);
  const description = getDescription(html);
  html = ensureCanonical(html, absoluteUrl);
  html = ensureMeta(html, 'property', 'og:site_name', 'DEMENTOR CLUB');
  html = ensureMeta(html, 'property', 'og:title', title);
  html = ensureMeta(html, 'property', 'og:description', description);
  html = ensureMeta(html, 'property', 'og:type', 'website');
  html = ensureMeta(html, 'property', 'og:locale', 'ru_RU');
  html = ensureMeta(html, 'property', 'og:url', absoluteUrl);

  let ogImage = getMetaContent(html, 'property', 'og:image');
  if (!ogImage) {
    ogImage = new URL(DEFAULT_SOCIAL_IMAGE_PATH, SOCIAL_ORIGIN).href;
    html = replaceSocialImage(html, ogImage);
  } else {
    html = ensureMeta(html, 'property', 'og:image:secure_url', ogImage);
    const type = imageType(ogImage);
    if (type) html = ensureMeta(html, 'property', 'og:image:type', type);
  }

  const defaultAlt = route === '/community/' || route === '/share/artifact/'
    ? 'Люди Dementor Club'
    : getFirstImageAlt(html) || title;
  html = ensureMeta(html, 'property', 'og:image:alt', defaultAlt);
  html = ensureMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = ensureMeta(html, 'name', 'twitter:title', getMetaContent(html, 'property', 'og:title') || title);
  html = ensureMeta(html, 'name', 'twitter:description', getMetaContent(html, 'property', 'og:description') || description);
  html = ensureMeta(html, 'name', 'twitter:image', getMetaContent(html, 'property', 'og:image') || ogImage);
  html = ensureMeta(html, 'name', 'twitter:image:alt', getMetaContent(html, 'property', 'og:image:alt') || defaultAlt);
  return html;
}

function localAssetFromAbsolute(url) {
  try {
    const parsed = new URL(url);
    if (parsed.origin !== SOCIAL_ORIGIN) return null;
    return decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  } catch {
    return null;
  }
}

function validateRaster(file, label, errors) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { errors.push(`${label}: file missing`); return; }
  const bytes = fs.readFileSync(file);
  if (bytes.length < 32) { errors.push(`${label}: file too small`); return; }
  if (bytes.subarray(0, 2).equals(Buffer.from([0xff,0xd8]))) return;
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))) return;
  if (bytes.subarray(0,4).toString('ascii') === 'RIFF' && bytes.subarray(8,12).toString('ascii') === 'WEBP') {
    const declared = bytes.readUInt32LE(4) + 8;
    if (bytes.length < declared) errors.push(`${label}: truncated WebP (${bytes.length} < ${declared})`);
    return;
  }
  if (bytes.subarray(0,4).toString('ascii').startsWith('GIF8')) return;
  errors.push(`${label}: unsupported or corrupt raster signature`);
}

export function validateCanonicalSocialArtifact(artifactRoot) {
  const errors = [];
  const htmlFiles = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
    }
  };
  walk(artifactRoot);
  let publicCount = 0;
  for (const full of htmlFiles) {
    const rel = toPosix(path.relative(artifactRoot, full));
    const route = routeFromHtmlRel(rel);
    const html = fs.readFileSync(full, 'utf8');
    const noindex = isNoindexHtml(html);

    if (!new RegExp(`<link\\b[^>]*\\brel=["'](?:icon|shortcut icon)["'][^>]*\\bhref=["']${escapeRegExp(FAVICON_PATH)}["']`, 'i').test(html)) {
      errors.push(`${route}: canonical favicon missing from raw <head>`);
    }

    if (noindex && route !== '/share/artifact/') continue;
    if (!noindex) publicCount++;
    const expectedUrl = new URL(route, SOCIAL_ORIGIN).href;
    const required = [
      ['og:title','property'],['og:description','property'],['og:type','property'],['og:locale','property'],['og:url','property'],
      ['og:image','property'],['og:image:secure_url','property'],['og:image:type','property'],['og:image:alt','property'],
      ['twitter:card','name'],['twitter:title','name'],['twitter:description','name'],['twitter:image','name'],['twitter:image:alt','name'],
    ];
    for (const [value,key] of required) if (getMetaContent(html,key,value) === null) errors.push(`${route}: ${value} missing`);
    if (!noindex) {
      if (!hasLinkRel(html,'canonical')) errors.push(`${route}: canonical link missing`);
      const ogUrl = getMetaContent(html,'property','og:url');
      if (ogUrl !== expectedUrl) errors.push(`${route}: og:url ${ogUrl || 'missing'} != ${expectedUrl}`);
    }
    const image = getMetaContent(html,'property','og:image');
    if (!/^https:\/\//i.test(image || '')) errors.push(`${route}: og:image must be absolute HTTPS`);
    const local = localAssetFromAbsolute(image);
    if (local) validateRaster(path.join(artifactRoot, local), `${route}: ${local}`, errors);
    if (getMetaContent(html,'name','twitter:image') !== image) errors.push(`${route}: twitter:image must match og:image`);
  }

  if (!fs.existsSync(path.join(artifactRoot, FAVICON_PATH.slice(1)))) errors.push(`${FAVICON_PATH}: canonical favicon file missing`);
  validateRaster(path.join(artifactRoot, DEFAULT_SOCIAL_IMAGE_PATH.slice(1)), DEFAULT_SOCIAL_IMAGE_PATH, errors);
  validateRaster(path.join(artifactRoot, COMMUNITY_SOCIAL_IMAGE_PATH.slice(1)), COMMUNITY_SOCIAL_IMAGE_PATH, errors);

  if (errors.length) throw new Error(`Canonical social metadata validation failed:\n${errors.map(item=>`- ${item}`).join('\n')}`);
  console.log(`Canonical social metadata: ${publicCount} indexable HTML routes covered; favicon + OG/Twitter raw-head contract PASS.`);
}
