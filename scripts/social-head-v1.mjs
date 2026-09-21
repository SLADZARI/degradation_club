import fs from 'node:fs';
import path from 'node:path';

const ORIGIN='https://dementor.club';
const SOCIAL_IMAGE='/assets/social/dementor-social-default.jpg';
const ARTIFACT_SHARE_SOCIAL_IMAGE='/assets/social/dementor-artifact-share-v1-20260921.png';
const FAVICON='/favicon.svg';
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const re=v=>String(v).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const posix=v=>String(v).replaceAll('\\','/');

export function routeFromHtmlRel(rel){
  const clean=posix(rel);
  if(clean==='index.html')return '/';
  if(clean.endsWith('/index.html'))return `/${clean.slice(0,-'/index.html'.length)}/`;
  return `/${clean}`;
}
function noindex(html){return /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)||/<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html)}
function meta(html,key,value){
  const x=re(value);
  return html.match(new RegExp(`<meta\\b[^>]*\\b${key}=["']${x}["'][^>]*\\bcontent=["']([^"']*)["'][^>]*>`,'i'))?.[1]
    ??html.match(new RegExp(`<meta\\b[^>]*\\bcontent=["']([^"']*)["'][^>]*\\b${key}=["']${x}["'][^>]*>`,'i'))?.[1]??null;
}
function add(html,line){if(!html.includes('</head>'))throw new Error('Cannot inject canonical social head: </head> missing');return html.replace('</head>',`${line}\n</head>`)}
function ensureMeta(html,key,value,content){return meta(html,key,value)!==null?html:add(html,`<meta ${key}="${esc(value)}" content="${esc(content)}">`)}
function removeMeta(html,key,value){return html.replace(new RegExp(`<meta\\b(?=[^>]*\\b${key}=["']${re(value)}["'])[^>]*>\\s*`,'gi'),'')}
function title(html){return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g,'').trim()||'Dementor Club'}
function description(html){return meta(html,'name','description')||'Dementor Club — клуб и культурная платформа.'}
function firstAlt(html){for(const m of html.matchAll(/<img\b([^>]*)>/gi)){const a=m[1].match(/\balt=["']([^"']+)["']/i)?.[1]?.trim();if(a)return a}return null}
function canonicalHref(html){return html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1]??null}
function canonical(html,url){
  const current=canonicalHref(html);
  if(current===url)return html;
  if(current!==null)html=html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi,'');
  return add(html,`<link rel="canonical" href="${esc(url)}">`);
}
function favicon(html){
  if(new RegExp(`<link\\b[^>]*\\brel=["'](?:icon|shortcut icon)["'][^>]*\\bhref=["']${re(FAVICON)}["']`,'i').test(html))return html;
  html=add(html,`<link rel="icon" type="image/svg+xml" href="${FAVICON}" sizes="any">`);
  if(!/<link\b[^>]*\brel=["']manifest["']/i.test(html))html=add(html,'<link rel="manifest" href="/site.webmanifest">');
  return html;
}
function mimeFromUrl(url){return /\.png(?:$|[?#])/i.test(url)?'image/png':/\.jpe?g(?:$|[?#])/i.test(url)?'image/jpeg':/\.webp(?:$|[?#])/i.test(url)?'image/webp':null}
function setImage(html,url,type=mimeFromUrl(url)||'image/jpeg'){
  for(const [k,v] of [['property','og:image'],['property','og:image:secure_url'],['property','og:image:type'],['property','og:image:width'],['property','og:image:height'],['name','twitter:image']])html=removeMeta(html,k,v);
  for(const line of [
    `<meta property="og:image" content="${url}">`,
    `<meta property="og:image:secure_url" content="${url}">`,
    `<meta property="og:image:type" content="${type}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta name="twitter:image" content="${url}">`,
  ])html=add(html,line);
  return html;
}

export function normalizeCanonicalSocialHead(html,rel){
  const route=routeFromHtmlRel(rel),url=new URL(route,ORIGIN).href,socialPath=route==='/share/artifact/'?ARTIFACT_SHARE_SOCIAL_IMAGE:SOCIAL_IMAGE,social=new URL(socialPath,ORIGIN).href,isNoindex=noindex(html);
  html=favicon(html);
  if(route==='/community/'||route==='/share/artifact/')html=setImage(html,social);
  if(isNoindex&&route!=='/share/artifact/')return html;
  html=canonical(html,url);
  const t=title(html),d=description(html);
  for(const [k,v,c] of [
    ['property','og:site_name','DEMENTOR CLUB'],['property','og:title',t],['property','og:description',d],['property','og:type','website'],['property','og:locale','ru_RU'],['property','og:url',url],
  ])html=ensureMeta(html,k,v,c);
  let image=meta(html,'property','og:image');
  if(!image){html=setImage(html,social);image=social}else{
    html=ensureMeta(html,'property','og:image:secure_url',image);
    const type=mimeFromUrl(image);
    if(type)html=ensureMeta(html,'property','og:image:type',type);
  }
  const alt=route==='/share/artifact/'?'Вам передали артефакт — Dementor Club':route==='/community/'?'Люди Dementor Club':firstAlt(html)||t;
  html=ensureMeta(html,'property','og:image:alt',alt);
  for(const [v,c] of [['twitter:card','summary_large_image'],['twitter:title',meta(html,'property','og:title')||t],['twitter:description',meta(html,'property','og:description')||d],['twitter:image',meta(html,'property','og:image')||image],['twitter:image:alt',meta(html,'property','og:image:alt')||alt]])html=ensureMeta(html,'name',v,c);
  return html;
}
function local(url){try{const u=new URL(url);return u.origin===ORIGIN?decodeURIComponent(u.pathname.replace(/^\//,'')):null}catch{return null}}
function rasterInfo(file,label,errors){
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){errors.push(`${label}: file missing`);return null}
  const b=fs.readFileSync(file);if(b.length<32){errors.push(`${label}: file too small`);return null}

  if(b.subarray(0,2).equals(Buffer.from([0xff,0xd8]))){
    if(!b.subarray(-2).equals(Buffer.from([0xff,0xd9])))errors.push(`${label}: truncated JPEG (EOI missing)`);
    let width=null,height=null,off=2;
    while(off+3<b.length){
      if(b[off]!==0xff){off++;continue}
      while(off<b.length&&b[off]===0xff)off++;
      if(off>=b.length)break;
      const marker=b[off++];
      if(marker===0xd9||marker===0xda)break;
      if(marker===0x01||(marker>=0xd0&&marker<=0xd7))continue;
      if(off+2>b.length){errors.push(`${label}: truncated JPEG segment header`);break}
      const len=b.readUInt16BE(off);
      if(len<2||off+len>b.length){errors.push(`${label}: truncated JPEG segment`);break}
      if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)&&len>=7){
        height=b.readUInt16BE(off+3);width=b.readUInt16BE(off+5);
      }
      off+=len;
    }
    if(!width||!height)errors.push(`${label}: JPEG dimensions unavailable`);
    return {mime:'image/jpeg',width,height,bytes:b.length};
  }

  if(b.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))){
    const width=b.readUInt32BE(16),height=b.readUInt32BE(20);
    const iend=Buffer.from([0,0,0,0,0x49,0x45,0x4e,0x44,0xae,0x42,0x60,0x82]);
    if(!b.subarray(-12).equals(iend))errors.push(`${label}: truncated PNG (IEND missing)`);
    return {mime:'image/png',width,height,bytes:b.length};
  }

  if(b.subarray(0,4).toString('ascii')==='RIFF'&&b.subarray(8,12).toString('ascii')==='WEBP'){
    const declared=b.readUInt32LE(4)+8;
    if(b.length!==declared)errors.push(`${label}: incomplete WebP container (${b.length} != ${declared})`);
    return {mime:'image/webp',width:null,height:null,bytes:b.length};
  }

  errors.push(`${label}: unsupported or corrupt raster signature`);
  return null;
}
export function validateCanonicalSocialArtifact(root){
  const errors=[],files=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(e.isFile()&&e.name.endsWith('.html'))files.push(f)}};walk(root);
  let publicCount=0;
  for(const f of files){
    const rel=posix(path.relative(root,f)),route=routeFromHtmlRel(rel),html=fs.readFileSync(f,'utf8'),isNoindex=noindex(html),expected=new URL(route,ORIGIN).href;
    if(!new RegExp(`<link\\b[^>]*\\brel=["'](?:icon|shortcut icon)["'][^>]*\\bhref=["']${re(FAVICON)}["']`,'i').test(html))errors.push(`${route}: canonical favicon missing from raw <head>`);
    if(isNoindex&&route!=='/share/artifact/')continue;if(!isNoindex)publicCount++;
    for(const [v,k] of [['og:title','property'],['og:description','property'],['og:type','property'],['og:locale','property'],['og:url','property'],['og:image','property'],['og:image:secure_url','property'],['og:image:type','property'],['og:image:alt','property'],['twitter:card','name'],['twitter:title','name'],['twitter:description','name'],['twitter:image','name'],['twitter:image:alt','name']])if(meta(html,k,v)===null)errors.push(`${route}: ${v} missing`);
    if(!isNoindex&&canonicalHref(html)!==expected)errors.push(`${route}: canonical ${canonicalHref(html)||'missing'} != ${expected}`);
    if(!isNoindex&&meta(html,'property','og:url')!==expected)errors.push(`${route}: og:url ${meta(html,'property','og:url')||'missing'} != ${expected}`);
    const image=meta(html,'property','og:image');
    if(!/^https:\/\//i.test(image||''))errors.push(`${route}: og:image must be absolute HTTPS`);
    const l=local(image),info=l?rasterInfo(path.join(root,l),`${route}: ${l}`,errors):null;
    if(meta(html,'name','twitter:image')!==image)errors.push(`${route}: twitter:image must match og:image`);
    if(route==='/share/artifact/'){
      const expectedImage=new URL(ARTIFACT_SHARE_SOCIAL_IMAGE,ORIGIN).href;
      if(image!==expectedImage)errors.push(`${route}: dedicated Artifact social image drifted (${image||'missing'} != ${expectedImage})`);
      if(meta(html,'property','og:image:secure_url')!==image)errors.push(`${route}: og:image:secure_url must match og:image`);
      const declaredType=meta(html,'property','og:image:type');
      if(info&&declaredType!==info.mime)errors.push(`${route}: og:image:type ${declaredType||'missing'} != binary MIME ${info.mime}`);
      const declaredWidth=Number(meta(html,'property','og:image:width')),declaredHeight=Number(meta(html,'property','og:image:height'));
      if(info&&declaredWidth!==info.width)errors.push(`${route}: og:image:width ${declaredWidth||'missing'} != binary width ${info.width}`);
      if(info&&declaredHeight!==info.height)errors.push(`${route}: og:image:height ${declaredHeight||'missing'} != binary height ${info.height}`);
      if(info&&(info.width!==1200||info.height!==630))errors.push(`${route}: Artifact social raster must be exactly 1200x630, got ${info.width}x${info.height}`);
      if(/dc-community-artifacts|storage\/v1|signedMediaUrl|token=/i.test(html))errors.push(`${route}: private Artifact media reference leaked into social metadata/source`);
    }
  }
  if(!fs.existsSync(path.join(root,FAVICON.slice(1))))errors.push(`${FAVICON}: file missing`);rasterInfo(path.join(root,SOCIAL_IMAGE.slice(1)),SOCIAL_IMAGE,errors);rasterInfo(path.join(root,ARTIFACT_SHARE_SOCIAL_IMAGE.slice(1)),ARTIFACT_SHARE_SOCIAL_IMAGE,errors);
  if(errors.length)throw new Error(`Canonical social metadata validation failed:\n${errors.map(x=>`- ${x}`).join('\n')}`);
  console.log(`Canonical social metadata: ${publicCount} indexable HTML routes covered; favicon + OG/Twitter raw-head contract PASS.`);
}
