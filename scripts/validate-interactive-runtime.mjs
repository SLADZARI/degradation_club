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
const siteConfig=read('site-config.js');
const accountSync=read('dementor-account-sync-v9.js');
const sphereCompat=read('join/dc9-sphere-compat-v1.js');
const resultIndex=read('join/result/index.html');
const memberIndex=read('join/member/index.html');
const workspaceMembership=read('workspace-membership-link-v1.js');

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

// DC-9 server boundary is canonical even while the legacy assessment UI still uses
// `self-development` locally.
requireText(siteConfig,'/dementor-account-sync-v9.js','Join canonical account sync');
forbid(siteConfig,/dementor-account-sync-v8\.js/,'Legacy account sync injection');
requireText(accountSync,"const canonicalSphere=id=>id===LEGACY_SELF?CANON_SELF:id",'DC-9 canonical sphere mapping');
requireText(accountSync,"sphere_id:canonical",'Canonical assessment run write');
requireText(accountSync,"state_json:canonical",'Canonical assessment snapshot write');
requireText(sphereCompat,"const CANONICAL='self_development'",'Community sphere compatibility');
requireText(resultIndex,'/join/dc9-sphere-compat-v1.js','Result compatibility preboot');
requireText(memberIndex,'/join/dc9-sphere-compat-v1.js','Membership compatibility preboot');

// Guest workspace must never revive the deprecated /join/apply/ flow or a body-wide
// self-mutating observer. The canonical Community v1 gate owns membership entry.
forbid(workspaceMembership,/\/join\/apply\//,'Deprecated workspace membership route');
forbid(workspaceMembership,/observe\(document\.body,\{[^}]*subtree\s*:\s*true/i,'Workspace membership body observer');
requireText(workspaceMembership,"destination=base+'/join/result/'",'Workspace canonical membership route');
requireText(workspaceMembership,"observe(root,{childList:true})",'Workspace direct-child observer');
requireText(siteConfig,'workspace-membership-link-v1.js?v=20260830-02','Workspace membership cache bust');

// Authenticated interactive products expose one account identity.
requireText(auth,'window.DEMENTOR_AUTH_USER','Required auth identity');
requireText(auth,"'dc-auth-ready'",'Required auth ready event');
requireText(valentinIndex,'/course-account-identity-v1.js','Valentin account identity bridge');
requireText(accountIdentity,'input.readOnly=true','Valentin account email readonly');
requireText(accountIdentity,'DEMENTOR_AUTH_USER','Valentin Google account source');

if(process.exitCode)process.exit(process.exitCode);
console.log('Interactive runtime safety checks passed.');
