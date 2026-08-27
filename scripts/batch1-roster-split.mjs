import fs from 'node:fs';

const profilePath='dementor-profile.css';
const communityPath='community/index.html';
const rosterPath='dementor-roster.css';

let profile=fs.readFileSync(profilePath,'utf8');
const markerStart='/* MICRO / roster — same identity rule at small scale. */';
const markerEnd='@media(max-width:1280px) and (min-width:901px){';
const a=profile.indexOf(markerStart);
const b=profile.indexOf(markerEnd);
if(a<0 || b<0 || b<=a) throw new Error('Roster desktop block markers not found');
const desktopBlock=profile.slice(a,b).trim();
profile=profile.slice(0,a)+profile.slice(b);

const mobileRules=[];
profile=profile.replace(/\n\s*(\.dc-dementor-card\[[^\{]+\]\s*(?:[^\{]*)\{[^}]*\})/g,(full,rule)=>{
  mobileRules.push(rule.trim());
  return '';
});
if(mobileRules.length<5) throw new Error(`Expected mobile roster rules, found ${mobileRules.length}`);
fs.writeFileSync(profilePath,profile);

const roster=`/* Dementor roster identity/component bridge.\n   Full profile HERO geometry is intentionally not defined here.\n   Identity colors remain in /visual-tokens.css. */\n\n${desktopBlock}\n\n@media(max-width:560px){\n${mobileRules.map(x=>'  '+x).join('\n')}\n}\n`;
fs.writeFileSync(rosterPath,roster);

let community=fs.readFileSync(communityPath,'utf8');
const old='<link rel="stylesheet" href="/dementor-profile.css">';
if(!community.includes(old)) throw new Error('Community profile stylesheet link not found');
community=community.replace(old,'<link rel="stylesheet" href="/dementor-roster.css">');
fs.writeFileSync(communityPath,community);

console.log(`Moved roster identity out of ${profilePath}`);
console.log(`Created ${rosterPath} with ${mobileRules.length} mobile roster rules`);
console.log(`Community now loads roster CSS instead of profile CSS`);
