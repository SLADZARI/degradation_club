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
const memberRuntime=read('join/member/member.js');
const workspaceMembership=read('workspace-membership-link-v1.js');
const boardRuntime=read('community/board/board.js');
const boardIndex=read('community/board/index.html');
const boardQaCss=read('community/board/board-qa-fix-v1.css');
const artifactHardening=read('supabase/migrations/20260830095500_community_artifact_qa_hardening.sql');

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

// Community member identity must not silently persist a provider/contact mismatch.
requireText(memberRuntime,'function inferProvider(contact)','Community provider inference');
requireText(memberRuntime,'function normalizeContactUrl(value)','Community contact URL normalization');
requireText(memberRuntime,'providerSelect.value=inferred','Community provider auto-selection');
requireText(memberIndex,'member.js?v=20260830-02','Community member cache bust');

// Artifact composer production QA contract.
requireText(boardRuntime,"const maxFileSize=4*1024*1024",'Community 4 MiB media limit');
requireText(boardRuntime,"new Set(['image/jpeg','image/png','image/webp'])",'Community image-only media surface');
forbid(boardRuntime,/application\/pdf|text\/plain/,'Community generic file upload');
requireText(boardRuntime,'function normalizeExternalUrl(value)','Artifact URL normalization');
requireText(boardRuntime,'function showComposerError(message,fieldId=null)','Artifact inline error preservation');
requireText(boardRuntime,"expiresDate.getTime()<=Date.now()",'Artifact past-expiry guard');
requireText(boardRuntime,"rel=\"noopener noreferrer\"",'Artifact safe external links');
requireText(boardRuntime,'openDementorExplainer','Dementor prompt explainer');
requireText(boardRuntime,'Member ≠ Dementor.','Dementor role distinction');
requireText(boardRuntime,'CLUB_RECORDS','Source-backed Board records');
requireText(boardRuntime,"dc_enqueue_artifact_distribution_v1",'Non-blocking distribution outbox enqueue');
requireText(boardIndex,'board-qa-fix-v1.css?v=20260830-01','Community Board QA CSS');
requireText(boardIndex,'board.js?v=20260830-02','Community Board cache bust');
requireText(boardQaCss,'.dc-composer-error','Composer error styling');
requireText(boardQaCss,'.dc-explainer','Dementor explainer styling');
requireText(boardQaCss,'.dc-club-records','Source-backed Board record styling');

// Server/storage boundary mirrors the browser restriction and prepares Telegram as
// downstream distribution without making publication depend on Telegram availability.
requireText(artifactHardening,'file_size_limit = 4194304','Storage 4 MiB media limit');
requireText(artifactHardening,"array['image/jpeg','image/png','image/webp']::text[]",'Storage image-only MIME allowlist');
requireText(artifactHardening,'create table if not exists public.dc_distribution_outbox','Distribution outbox table');
requireText(artifactHardening,'dc_enqueue_artifact_distribution_v1','Distribution enqueue RPC');
requireText(artifactHardening,'unique (artifact_id, channel)','Distribution enqueue idempotence');

if(process.exitCode)process.exit(process.exitCode);
console.log('Interactive runtime safety checks passed.');