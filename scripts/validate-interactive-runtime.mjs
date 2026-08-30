import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const fail=message=>{console.error(`RUNTIME SAFETY ERROR: ${message}`);process.exitCode=1};
const requireText=(source,text,label)=>{if(!source.includes(text))fail(`${label}: missing ${text}`)};
const forbid=(source,pattern,label)=>{if(pattern.test(source))fail(`${label}: forbidden pattern ${pattern}`)};

const join=read('script.js');
const communityBridge=read('join/community-entry-bridge-v1.js');
const auth=read('required-auth-v1.js');
const valentinIndex=read('courses/dumai-s-opasnostyu/index.html');
const accountIdentity=read('course-account-identity-v1.js');

// Exact regression that froze /join/: an observer watched the whole grid subtree while
// decorateCards() replaced sphere-foot innerHTML, so its own writes retriggered itself.
forbid(join,/observe\(grid,\{[^}]*subtree\s*:\s*true/i,'Join grid observer');
forbid(join,/observe\(host,\{[^}]*subtree\s*:\s*true/i,'Join question observer');
forbid(join,/foot\.innerHTML\s*=/,'Join sphere-foot decorator');
forbid(join,/foot\.querySelectorAll\([^\n]*\.badge[^\n]*\.remove\(/,'Join completion badge removal');
requireText(join,"data-procedure-ui",'Join idempotent decorator');
requireText(join,"observe(grid,{childList:true})",'Join direct-child observer');
requireText(join,"card.classList.contains('dc9-has-result')",'Join server progress compatibility');
requireText(join,'#selector .sphere-foot > .badge{display:none}','Join completion badge retained as hidden state');

// Community progress must never observe the whole document subtree.
forbid(communityBridge,/observe\(document\.documentElement,\{[^}]*subtree\s*:\s*true/i,'Community progress observer');
requireText(communityBridge,'dataset.signature','Community progress idempotence');

// Authenticated interactive products expose one account identity.
requireText(auth,'window.DEMENTOR_AUTH_USER','Required auth identity');
requireText(auth,"'dc-auth-ready'",'Required auth ready event');
requireText(valentinIndex,'/course-account-identity-v1.js','Valentin account identity bridge');
requireText(accountIdentity,'input.readOnly=true','Valentin account email readonly');
requireText(accountIdentity,'DEMENTOR_AUTH_USER','Valentin Google account source');

if(process.exitCode)process.exit(process.exitCode);
console.log('Interactive runtime safety checks passed.');
