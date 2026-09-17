# Site / Production Reconciliation — Residual Review

These are the 14 paths that preliminary inventory could not safely collapse by timestamp/existence alone.

## `README.md`

- production exists: `true`
- staging exists: `true`
- production last: `5c4e0c3804aab560a418de7f21d86504411a299a 2026-08-29T11:51:04+02:00 docs: define production branch contract and release gate`
- staging last: `f984b7ef0e591fc39ad7c939639f91d61e93637c 2026-08-31T17:10:43+02:00 Add DC-9 result validator to release checklist`

Semantic references:
```text
dementor-club:.weekly-os/PROJECT.json:1:{"schemaVersion":"1.0","_artifact":{"artifactId":"dementor-club.kernel.project","project":"dementor-club","documentType":"STANDARD","projectStage":"BUILD","gate":"G5_BUILD","status":"APPROVED","version":"1.97","updated":"2026-09-17","owner":"Modern Pilgrims","sourceSystem":"GIT","authorityType":"IMPLEMENTATION_AUTHORITY","supersedes":"1.96"},"projectId":"dementor-club","projectName":"Dementor Club","projectType":null,"canonicalRepository":"SLADZARI/degradation_club","defaultBranch":"main","semanticSourceBranch":"dementor-club","projectStage":"BUILD","gate":"G5_BUILD","readFirst":[".weekly-os/PROJECT.json",".weekly-os/ARTIFACT_INDEX.json",".weekly-os/APPROVED_STATE.json",".weekly-os/results/site-production-reconciliation-v1.v0.1.md",".weekly-os/results/thing-projection-runtime-v1.v1.0.md","operations/THING_PROJECTION_RUNTIME_G8_2026-09-17.md","operations/THING_PROJECTION_RUNTIME_LIVE_RETEST_2026-09-17.md","operations/THING_PROJECTION_RUNTIME_PAGES_RELEASE_2026-09-17.md","operations/THING_PROJECTION_RUNTIME_G6_2026-09-17.md","operations/THING_PROJECTION_RUNTIME_G7_RELEASE_CANDIDATE_2026-09-17.md","operations/THING_PROJECTION_RUNTIME_G7_MERGE_2026-09-17.md","projects/dementor-lab/DEMENTOR_LAB_PROJECT_IDENTITY_V1.md",".weekly-os/results/evidence-hygiene-v1.v1.0.md","operations/EVIDENCE_HYGIENE_G8_2026-09-17.md","operations/EVIDENCE_HYGIENE_LIVE_RETEST_2026-09-17.md","operations/EVIDENCE_HYGIENE_PAGES_RELEASE_2026-09-17.md",".weekly-os/results/evidence-hygiene-v1.v0.7.md","operations/EVIDENCE_HYGIENE_PAGES_VALIDATOR_G7_MERGE_2026-09-17.md","operations/EVIDENCE_HYGIENE_PAGES_VALIDATOR_DRIFT_CORRECTIVE_2026-09-17.md","operations/EVIDENCE_HYGIENE_PAGES_CORRECTIVE_G7_MERGE_2026-09-17.md","operations/EVIDENCE_HYGIENE_PAGES_CONTROL_PLANE_INCIDENT_2026-09-17.md","operations/EVIDENCE_HYGIENE_PAGES_CORRECTIVE_2026-09-17.md","operations/EVIDENCE_HYGIENE_BACKEND_RELEASE_2026-09-16.md","operations/EVIDENCE_HYGIENE_G7_MERGE_2026-09-16.md","operations/EVIDENCE_HYGIENE_G6_2026-09-16.md",".weekly-os/results/commerce-truth-guard-v1.v1.0.md","operations/COMMERCE_TRUTH_GUARD_G8_2026-09-16.md","operations/PHASE_0_TRUTH_REALITY_ALIGNMENT_2026-09-15.md",".weekly-os/results/dumai-s-opasnostyu-release-loop-v1.v1.0.md","operations/DUMAI_S_OPASNOSTYU_RELEASE_LOOP_G8_2026-09-16.md","operations/DUMAI_S_OPASNOSTYU_PUBLIC_RELEASE_DECISION_V1.md","concept/PRODUCT_MARKETING_PACKAGE_INDEX_V1.md",".weekly-os/results/semantic-stack-harmonization-v1.v1.0.md","operations/PRODUCT_MARKETING_SEMANTIC_STACK_HARMONIZATION_G8_2026-09-16.md",".weekly-os/results/current-program-projection-v1.v1.0.md","operations/CURRENT_PROGRAM_PROJECTION_G8_2026-09-15.md",".weekly-os/results/board-mobile-harmonization-v1.v1.0.md","operations/BOARD_MOBILE_HARMONIZATION_G8_2026-09-15.md",".weekly-os/results/board-share-receive-ritual-v1.v0.2.md","operations/BOARD_SHARE_RECEIVE_RITUAL_V1.md",".weekly-os/results/board-navigation-adaptive-cards-v1.v1.0.md","operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_G8_2026-09-13.md","operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_RELEASE_2026-09-13.md","operations/BOARD_NAVIGATION_ADAPTIVE_CARDS_V1.md","operations/BOARD_VISUAL_TYPE_LANGUAGE_V0.1.md",".weekly-os/results/board-information-architecture-v1.v0.17.md","operations/BOARD_INFORMATION_ARCHITECTURE_V1.md","operations/BOARD_TELEGRAM_PROMOTION_V1.md","operations/BOARD_TELEGRAM_WORKER_SCHEDULER_G8_PRODUCTION_VALIDATION_2026-09-12.md","operations/BOARD_INFORMATION_ARCHITECTURE_G8_CLEANUP_INVENTORY_2026-09-12.md","operations/BOARD_INFORMATION_ARCHITECTURE_LIVE_RETEST_2026-09-12.md",".weekly-os/results/public-site-visual-tech-debt-cleanup-v1.v1.0.md","operations/PUBLIC_SITE_VISUAL_TECH_DEBT_CLEANUP_G8_2026-09-13.md","operations/PUBLIC_SITE_VISUAL_TECH_DEBT_CLEANUP_REFRESH_2026-09-12.md","operations/PUBLIC_SITE_VISUAL_HARMONIZATION_V1.md",".weekly-os/results/board-access-control-v2.v0.4.md","operations/BOARD_ACCESS_AND_OWNER_ADMIN_V2.md",".weekly-os/results/public-site-visual-harmonization-v1.v1.0.md","operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-10.md",".weekly-os/results/dc9-membership-semantic-integrity-v1.v1.0.md","operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md",".weekly-os/results/workspace-top-navigation.v1.0.md",".weekly-os/results/qa-portal-harmonization.v1.0.md","README.md","operations/IDENTITY_MEMBERSHIP_AND_ENTITY_BOUNDARY_V0.2.md","operations/DEMENTOR_ENTITY_MAP_AND_WORKSPACE_MODULES_V0.1.md","operations/UNIVERSAL_WORKSPACE_WIREFRAME_SPEC_V0.1.md"],"authority":{"mpDslCore":{"sourceSystem":"DRIVE","authorityType":"REFERENCE","url":"https://docs.google.com/document/d/1fYwfF8IpvXh36qIAJxylT6oebOfaqJ_-L2MslXRHHOg/edit","note":"MP_DSL v0.1 source artifacts remain DRAFT / REFERENCE. Dementor Club uses only explicitly approved local rules."},"semanticSource":{"repository":"SLADZARI/degradation_club","ref":"dementor-club","sourceSystem":"GIT","authorityType":"IMPLEMENTATION_AUTHORITY","note":"Semantic source-of-truth branch; individual artifacts retain their own authority/status."},"productMarketingPackageV1":{"sourceSystem":"GIT","authorityType":"IMPLEMENTATION_AUTHORITY","path":"concept/PRODUCT_MARKETING_PACKAGE_INDEX_V1.md","scope":"Canonical navigation/source map for Product & Marketing authorities 01–15","note":"Primary source documents retain their own meaning and scope; the index does not silently redefine them."},"dumaiSOpasnostyuPublicReleaseV1":{"sourceSystem":"GIT","authorityType":"APPROVED_AUTHORITY","path":"operations/DUMAI_S_OPASNOSTYU_PUBLIC_RELEASE_DECISION_V1.md","scope":"Public Release, completion certificate, continuation and return semantics for Думай с опасностью"},"boardInformationArchitectureV1":{"sourceSystem":"GIT","authorityType":"APPROVED_AUTHORITY","path":"operations/BOARD_INFORMATION_ARCHITECTURE_V1.md","scope":"Community Board information architecture and lifecycle semantics","note":"Project-local approved authority. Result v0.17 remains WAITING / G8 and is not reopened by com
```

Production references to exact path:
```text
dementor-club-production:content/page-readiness.json:13:      "source": ["dementor-club/concept/DEGRADATION_AS_A_SERVICE.md", "dementor-club/concept/ecosystem.md", "dementor-club/events/fuengirola.md", "logic-awareness/README.md", "dementor-club/courses/dumai-s-opasnostyu.md", "dementor-club/courses/dumai-s-opasnostyu-production-stage-1.md"],
dementor-club-production:content/page-readiness.json:42:      "source": ["dementor-club/concept/ecosystem.md", "logic-awareness/README.md", "docs/PROJECTS_V2_EDITORIAL_DESIGN_HANDOFF_2026-09-14.md"],
dementor-club-production:content/page-readiness.json:72:      "source": ["logic-awareness/README.md"],
dementor-club-production:content/page-readiness.json:141:      "source": ["dementor-club/merch/README.md", "dementor-club/merch/products/OBJECT_001_NE_NADO.md", "dementor-club/merch/products/SH_DEM_01_OVERTHINKING_IS_MY_CARDIO.md", "dementor-club/merch/products/SH_DEM_02_PERSONAL_GROWTH_CANCELLED.md", "dementor-club/merch/products/SH_DEM_03_SUCCESS_IS_BORING.md", "dementor-club/merch/products/SH_DEM_04_POTENTIAL_TOO_LONG_REVEALED.md", "dementor-club/operations/ACCOUNT_PROGRESS_AND_MERCH_RUNTIME_V0.1.md"],
dementor-club-production:content/projects/logic-awareness.json:15:    "path": "README.md",
dementor-club-production:docs/DEMENTOR_DESIGN_CANON_v10.md:154:Production artwork follows the asset contract in `assets/ink/README.md`.
dementor-club-production:docs/MOTION_NAV_SEO_IMPLEMENTATION_v1.md:75:Asset contract is stored in `assets/ink/README.md`.
dementor-club-production:docs/homepage-refresh/DEPLOYMENT_PREP.md:22:- `docs/homepage-refresh/README.md` — batch register.
dementor-club-production:docs/homepage-refresh/DEPLOYMENT_PREP.md:23:- `docs/homepage-refresh/logic-awareness/README.md` — approved Logic & Awareness block contract.
dementor-club-production:docs/homepage-refresh/README.md:32:Block contract: `docs/homepage-refresh/logic-awareness/README.md`
dementor-club-production:scripts/build-pages.mjs:34:  '.deploy-trigger', 'DEPLOY_TRIGGER.txt', 'DRIVE.md', 'README.md', 'production-route-manifest.json',
dementor-club-production:scripts/validate-production-release.mjs:29:  'README.md',
```

## `assets/home/events/fuengirola-banner.webp`

- production exists: `false`
- staging exists: `true`
- staging last: `b9856a2de43f42d63b67ae017f3707030f1f2645 2026-08-28T21:49:10+02:00 assets(home): add exact Fuengirola banner artwork`

Semantic references:
```text
dementor-club:.weekly-os/results/public-site-visual-harmonization-v1.v0.10.md:45:- old corrupted `assets/home/events/fuengirola-banner.webp` remains unreferenced tech debt for a later cleanup Result;
dementor-club:.weekly-os/results/public-site-visual-harmonization-v1.v0.7.md:52:Exact Pages artifact #51 contained `assets/home/events/fuengirola-banner.webp` as a truncated/corrupted binary. Repository size is only `29 921` bytes and external decoder checks reject the file.
dementor-club:.weekly-os/results/public-site-visual-tech-debt-cleanup-v1.v0.1.md:54:- retired corrupted `assets/home/events/fuengirola-banner.webp` removed;
dementor-club:operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md:63:`assets/home/events/fuengirola-banner.webp`
dementor-club:operations/PUBLIC_SITE_VISUAL_HARMONIZATION_LIVE_SMOKE_2026-09-09.md:76:The corrupted `assets/home/events/fuengirola-banner.webp` file itself is not deleted in Result 1; once unreferenced it becomes tech-debt inventory for Result 2 rather than another visual mutation.
```

Production references to exact path:
```text
NONE
```

Production references to basename:
```text
NONE
```

## `community/board/telegram-worker-trigger-v3.js`

- production exists: `false`
- staging exists: `true`
- staging last: `9550539198186c6025581217330c02906afd0955 2026-09-03T16:57:44+02:00 fix(board): restore production spatial and integration stack`

Semantic references:
```text
dementor-club:operations/BOARD_INFORMATION_ARCHITECTURE_G8_CLEANUP_INVENTORY_2026-09-12.md:42:`community/board/telegram-worker-trigger-v3.js`
```

Production references to exact path:
```text
NONE
```

Production references to basename:
```text
dementor-club-production:scripts/validate-interactive-runtime.mjs:106:requireText(boardIndex,'telegram-worker-trigger-v3.js?v=20260831-02','Telegram worker trigger cache bust');
```

## `dementor-account-sync-v8.js`

- production exists: `false`
- staging exists: `true`
- staging last: `220c6ac2a8cc120536916fef3af27fd36ff54770 2026-09-05T22:04:30+02:00 fix(join): remove duplicate guest auth panel while keeping assessment sync`

Semantic references:
```text
dementor-club:.weekly-os/results/dc9-membership-semantic-integrity-v1.v0.10.md:53:1. `dementor-account-sync-v8.js` — removed;
dementor-club:.weekly-os/results/dc9-membership-semantic-integrity-v1.v0.8.md:44:1. remove `dementor-account-sync-v8.js`;
dementor-club:.weekly-os/results/dc9-membership-semantic-integrity-v1.v0.9.md:58:1. `dementor-account-sync-v8.js` — removed;
dementor-club:.weekly-os/results/dc9-membership-semantic-integrity-v1.v1.0.md:93:1. remove retired `dementor-account-sync-v8.js`;
dementor-club:.weekly-os/results/qa-portal-harmonization.v0.5.md:63:3. `/join/` could render a duplicate guest auth panel from `dementor-account-sync-v8.js`, producing the observed mobile top gap before the canonical Header.
dementor-club:.weekly-os/results/qa-portal-harmonization.v0.6.md:48:3. `/join/` no longer renders the duplicate guest auth panel from `dementor-account-sync-v8.js`; canonical Header remains the only public auth owner.
dementor-club:operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md:851:- `dementor-account-sync-v8.js`;
dementor-club:operations/QA_DC9_MEMBERSHIP_PATH_MAP_2026-09-08.md:159:- at package creation, canonical Join still loads `dementor-account-sync-v8.js`.
dementor-club:operations/QA_DC9_MEMBERSHIP_PATH_MAP_2026-09-08.md:165:`dementor-account-sync-v8.js`
dementor-club:operations/QA_DC9_MEMBERSHIP_SEMANTIC_INTEGRITY_2026-09-08.md:51:The active production configuration still loads `dementor-account-sync-v8.js` for canonical `/join/`.
```

Production references to exact path:
```text
dementor-club-production:scripts/validate-dc9-sync-integrity.mjs:91:expect(siteConfig.includes('/dementor-account-sync-v10.js')&&!siteConfig.includes('/dementor-account-sync-v8.js')&&!siteConfig.includes('/dementor-account-sync-v9.js'),'DC9 sync: site config does not select exactly the v10 account sync owner');
dementor-club-production:scripts/validate-dc9-sync-integrity.mjs:92:expect(!fs.existsSync(path.join(root,'dementor-account-sync-v8.js'))&&!fs.existsSync(path.join(root,'dementor-account-sync-v9.js')),'DC9 G8: superseded v8/v9 account sync sources still exist');
```

## `design-system/dc9-entry-state-test/index.html`

- production exists: `false`
- staging exists: `true`
- staging last: `db1bde36d04037b76793cc57ffeb6c265166df0e 2026-09-02T12:28:05+02:00 copy(dc9): refine entry-state tone to canon`

Semantic references:
```text
dementor-club:operations/DC9_ENTRY_STATE_ROUTING_AND_QA_V0.1.md:432:`dementor-club-site/design-system/dc9-entry-state-test/index.html`
dementor-club:operations/DC9_ENTRY_STATE_ROUTING_AND_QA_V0.1.md:521:- QA artifact: `design-system/dc9-entry-state-test/index.html`.
```

Production references to exact path:
```text
NONE
```

Production references to basename:
```text
dementor-club-production:community/artifact/artifact-club-publisher-v1.js:16:  return index>=0&&parts[index+1]&&parts[index+1]!=='index.html'?parts[index+1]:null;
dementor-club-production:community/artifact/artifact.js:10:function idFromLocation(){const query=new URLSearchParams(location.search).get('id');if(query)return query;const parts=location.pathname.split('/').filter(Boolean);const i=parts.indexOf('artifact');return i>=0&&parts[i+1]&&parts[i+1]!=='index.html'?parts[i+1]:null}
dementor-club-production:docs/PROJECTS_V2_LAB_V19_INTEGRATION_EVIDENCE_2026-09-14.md:18:- `projects/dementor-lab/index.html`
dementor-club-production:docs/PROJECTS_V2_SOURCE_AUDIT_GATE_2026-09-14.md:40:- Canonical source: current production project page `projects/logic-awareness/index.html`, plus #169 for registry/status framing and #44 for navigation behavior.
dementor-club-production:docs/homepage-refresh/DEPLOYMENT_PREP.md:21:- current production `index.html` — existing Home markup; no semantic rewrite required.
dementor-club-production:docs/homepage-refresh/DEPLOYMENT_PREP.md:44:Production CSS is staged against the existing `.dc-project` markup in the Home `index.html`.
dementor-club-production:docs/homepage-refresh/README.md:56:- `index.html` — inherited unchanged from current `dementor-club-site`; existing markup already supports both block compositions.
dementor-club-production:docs/homepage-refresh/logic-awareness/README.md:52:The approved block is staged as CSS overrides against the existing `.dc-project` markup on Home. No semantic rewrite of `index.html` is required.
dementor-club-production:merch-runtime-v1.js:30:    if(path.endsWith('/merch/')||path.endsWith('/merch/index.html')){
dementor-club-production:merch-runtime-v1.js:57:    const route=Object.keys(routes).find(r=>path.endsWith(r)||path.endsWith(r+'index.html'));
dementor-club-production:operations/BOARD_DEEPLINK_AUTH_RETURN_G2_2026-09-12.md:39:Shared owner: `auth/callback/index.html` + `community-runtime-v1.js`.
dementor-club-production:operations/COMMERCE_TRUTH_GUARD_G6_PREP_2026-09-16.md:18:- `objects/001-ne-nado/index.html` fails closed before runtime and no longer exposes stale EUR 220 or a public list that could imply current PREORDER/SOLD OUT truth.
dementor-club-production:production-route-manifest.json:14:    "/workspace/admin/design/": "design-system/index.html",
dementor-club-production:production-route-manifest.json:15:    "/workspace/admin/tests/": "design-system/admin/tests/index.html",
dementor-club-production:production-route-manifest.json:16:    "/workspace/admin/auth-test/": "design-system/auth-test/index.html",
dementor-club-production:production-route-manifest.json:17:    "/workspace/admin/sync-test/": "design-system/sync-test/index.html"
dementor-club-production:public-activity-v1.js:89:  const home=path==='/'||path==='/index.html';const community=/^\/community\/?(?:index\.html)?$/.test(path);
dementor-club-production:script.js:2:// Scoring and scenario logic lives in /join/index.html only.
dementor-club-production:scripts/build-pages.mjs:25:  { from:'design-system/index.html', to:'workspace/admin/design/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:28:  { from:'design-system/admin/tests/index.html', to:'workspace/admin/tests/index.html' },
dementor-club-production:scripts/build-pages.mjs:29:  { from:'design-system/auth-test/index.html', to:'workspace/admin/auth-test/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:30:  { from:'design-system/sync-test/index.html', to:'workspace/admin/sync-test/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:130:  if (rel === 'auth/callback/index.html') return html;
dementor-club-production:scripts/build-pages.mjs:166:    if (rel === 'projects/logic-awareness/index.html' && !html.includes('/content-series-v1.js')) html = html.replace('</body>', '<script src="/content-series-v1.js" defer></script>\n</body>');
dementor-club-production:scripts/build-pages.mjs:167:    if (rel === 'projects/logic-awareness/index.html' && !html.includes('/logic-awareness-covers-v1.js')) html = html.replace('</body>', '<script src="/logic-awareness-covers-v1.js" defer></script>\n</body>');
dementor-club-production:scripts/diagnose-home-fuengirola-media.mjs:10:  if(pathname.endsWith('/'))pathname+='index.html';
dementor-club-production:scripts/social-head-v1.mjs:13:  if(clean==='index.html')return '/';
dementor-club-production:scripts/social-head-v1.mjs:14:  if(clean.endsWith('/index.html'))return `/${clean.slice(0,-'/index.html'.length)}/`;
dementor-club-production:scripts/validate-artifact-history.mjs:13:  if(pathname.endsWith('/'))pathname+='index.html';
dementor-club-production:scripts/validate-board-admin-telegram-optin-contract.mjs:9:const html=read('workspace/board/index.html');
dementor-club-production:scripts/validate-board-batch-a-contract.mjs:15:const artifactsPage=read('workspace/artifacts/index.html');
dementor-club-production:scripts/validate-board-club-publisher-contract.mjs:7:const boardHtml=read('workspace/board/index.html');
dementor-club-production:scripts/validate-board-club-publisher-contract.mjs:9:const artifactHtml=read('community/artifact/index.html');
dementor-club-production:scripts/validate-board-deeplink-auth-return-browser.mjs:30:const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname==='/__deeplink_harness__'){res.setHeader('content-type','text/html; charset=utf-8');res.end(harness());return}if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}const requestPath=u.pathname.endsWith('/')?`${u.pathname}index.html`:u.pathname;const file=path.resolve(root,requestPath.replace(/^\/+/,''));if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('not found');return}res.setHeader('content-type',mime[path.extname(file)]||'applic
```

## `design-system/dc9-mobile-qa/index.html`

- production exists: `false`
- staging exists: `true`
- staging last: `8b282e9c61a1069b32e18da7bf50d0e2a6f957f6 2026-09-02T13:26:43+02:00 qa(dc9): add mobile-only interaction prototype`

Semantic references:
```text
dementor-club:operations/DC9_MOBILE_QA_PASS_V0.1.md:123:`design-system/dc9-mobile-qa/index.html`
```

Production references to exact path:
```text
NONE
```

Production references to basename:
```text
dementor-club-production:community/artifact/artifact-club-publisher-v1.js:16:  return index>=0&&parts[index+1]&&parts[index+1]!=='index.html'?parts[index+1]:null;
dementor-club-production:community/artifact/artifact.js:10:function idFromLocation(){const query=new URLSearchParams(location.search).get('id');if(query)return query;const parts=location.pathname.split('/').filter(Boolean);const i=parts.indexOf('artifact');return i>=0&&parts[i+1]&&parts[i+1]!=='index.html'?parts[i+1]:null}
dementor-club-production:docs/PROJECTS_V2_LAB_V19_INTEGRATION_EVIDENCE_2026-09-14.md:18:- `projects/dementor-lab/index.html`
dementor-club-production:docs/PROJECTS_V2_SOURCE_AUDIT_GATE_2026-09-14.md:40:- Canonical source: current production project page `projects/logic-awareness/index.html`, plus #169 for registry/status framing and #44 for navigation behavior.
dementor-club-production:docs/homepage-refresh/DEPLOYMENT_PREP.md:21:- current production `index.html` — existing Home markup; no semantic rewrite required.
dementor-club-production:docs/homepage-refresh/DEPLOYMENT_PREP.md:44:Production CSS is staged against the existing `.dc-project` markup in the Home `index.html`.
dementor-club-production:docs/homepage-refresh/README.md:56:- `index.html` — inherited unchanged from current `dementor-club-site`; existing markup already supports both block compositions.
dementor-club-production:docs/homepage-refresh/logic-awareness/README.md:52:The approved block is staged as CSS overrides against the existing `.dc-project` markup on Home. No semantic rewrite of `index.html` is required.
dementor-club-production:merch-runtime-v1.js:30:    if(path.endsWith('/merch/')||path.endsWith('/merch/index.html')){
dementor-club-production:merch-runtime-v1.js:57:    const route=Object.keys(routes).find(r=>path.endsWith(r)||path.endsWith(r+'index.html'));
dementor-club-production:operations/BOARD_DEEPLINK_AUTH_RETURN_G2_2026-09-12.md:39:Shared owner: `auth/callback/index.html` + `community-runtime-v1.js`.
dementor-club-production:operations/COMMERCE_TRUTH_GUARD_G6_PREP_2026-09-16.md:18:- `objects/001-ne-nado/index.html` fails closed before runtime and no longer exposes stale EUR 220 or a public list that could imply current PREORDER/SOLD OUT truth.
dementor-club-production:production-route-manifest.json:14:    "/workspace/admin/design/": "design-system/index.html",
dementor-club-production:production-route-manifest.json:15:    "/workspace/admin/tests/": "design-system/admin/tests/index.html",
dementor-club-production:production-route-manifest.json:16:    "/workspace/admin/auth-test/": "design-system/auth-test/index.html",
dementor-club-production:production-route-manifest.json:17:    "/workspace/admin/sync-test/": "design-system/sync-test/index.html"
dementor-club-production:public-activity-v1.js:89:  const home=path==='/'||path==='/index.html';const community=/^\/community\/?(?:index\.html)?$/.test(path);
dementor-club-production:script.js:2:// Scoring and scenario logic lives in /join/index.html only.
dementor-club-production:scripts/build-pages.mjs:25:  { from:'design-system/index.html', to:'workspace/admin/design/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:28:  { from:'design-system/admin/tests/index.html', to:'workspace/admin/tests/index.html' },
dementor-club-production:scripts/build-pages.mjs:29:  { from:'design-system/auth-test/index.html', to:'workspace/admin/auth-test/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:30:  { from:'design-system/sync-test/index.html', to:'workspace/admin/sync-test/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:130:  if (rel === 'auth/callback/index.html') return html;
dementor-club-production:scripts/build-pages.mjs:166:    if (rel === 'projects/logic-awareness/index.html' && !html.includes('/content-series-v1.js')) html = html.replace('</body>', '<script src="/content-series-v1.js" defer></script>\n</body>');
dementor-club-production:scripts/build-pages.mjs:167:    if (rel === 'projects/logic-awareness/index.html' && !html.includes('/logic-awareness-covers-v1.js')) html = html.replace('</body>', '<script src="/logic-awareness-covers-v1.js" defer></script>\n</body>');
dementor-club-production:scripts/diagnose-home-fuengirola-media.mjs:10:  if(pathname.endsWith('/'))pathname+='index.html';
dementor-club-production:scripts/social-head-v1.mjs:13:  if(clean==='index.html')return '/';
dementor-club-production:scripts/social-head-v1.mjs:14:  if(clean.endsWith('/index.html'))return `/${clean.slice(0,-'/index.html'.length)}/`;
dementor-club-production:scripts/validate-artifact-history.mjs:13:  if(pathname.endsWith('/'))pathname+='index.html';
dementor-club-production:scripts/validate-board-admin-telegram-optin-contract.mjs:9:const html=read('workspace/board/index.html');
dementor-club-production:scripts/validate-board-batch-a-contract.mjs:15:const artifactsPage=read('workspace/artifacts/index.html');
dementor-club-production:scripts/validate-board-club-publisher-contract.mjs:7:const boardHtml=read('workspace/board/index.html');
dementor-club-production:scripts/validate-board-club-publisher-contract.mjs:9:const artifactHtml=read('community/artifact/index.html');
dementor-club-production:scripts/validate-board-deeplink-auth-return-browser.mjs:30:const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname==='/__deeplink_harness__'){res.setHeader('content-type','text/html; charset=utf-8');res.end(harness());return}if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}const requestPath=u.pathname.endsWith('/')?`${u.pathname}index.html`:u.pathname;const file=path.resolve(root,requestPath.replace(/^\/+/,''));if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('not found');return}res.setHeader('content-type',mime[path.extname(file)]||'applic
```

## `design-system/dc9-mobile-result-qa/index.html`

- production exists: `false`
- staging exists: `true`
- staging last: `b58f90bc8cbd8adba369f988497ee21c7cd21d1f 2026-09-02T13:31:42+02:00 qa(dc9): add mobile result graph prototype`

Semantic references:
```text
dementor-club:operations/DC9_MOBILE_QA_PASS_V0.1.md:163:`dementor-club-site/design-system/dc9-mobile-result-qa/index.html`
```

Production references to exact path:
```text
NONE
```

Production references to basename:
```text
dementor-club-production:community/artifact/artifact-club-publisher-v1.js:16:  return index>=0&&parts[index+1]&&parts[index+1]!=='index.html'?parts[index+1]:null;
dementor-club-production:community/artifact/artifact.js:10:function idFromLocation(){const query=new URLSearchParams(location.search).get('id');if(query)return query;const parts=location.pathname.split('/').filter(Boolean);const i=parts.indexOf('artifact');return i>=0&&parts[i+1]&&parts[i+1]!=='index.html'?parts[i+1]:null}
dementor-club-production:docs/PROJECTS_V2_LAB_V19_INTEGRATION_EVIDENCE_2026-09-14.md:18:- `projects/dementor-lab/index.html`
dementor-club-production:docs/PROJECTS_V2_SOURCE_AUDIT_GATE_2026-09-14.md:40:- Canonical source: current production project page `projects/logic-awareness/index.html`, plus #169 for registry/status framing and #44 for navigation behavior.
dementor-club-production:docs/homepage-refresh/DEPLOYMENT_PREP.md:21:- current production `index.html` — existing Home markup; no semantic rewrite required.
dementor-club-production:docs/homepage-refresh/DEPLOYMENT_PREP.md:44:Production CSS is staged against the existing `.dc-project` markup in the Home `index.html`.
dementor-club-production:docs/homepage-refresh/README.md:56:- `index.html` — inherited unchanged from current `dementor-club-site`; existing markup already supports both block compositions.
dementor-club-production:docs/homepage-refresh/logic-awareness/README.md:52:The approved block is staged as CSS overrides against the existing `.dc-project` markup on Home. No semantic rewrite of `index.html` is required.
dementor-club-production:merch-runtime-v1.js:30:    if(path.endsWith('/merch/')||path.endsWith('/merch/index.html')){
dementor-club-production:merch-runtime-v1.js:57:    const route=Object.keys(routes).find(r=>path.endsWith(r)||path.endsWith(r+'index.html'));
dementor-club-production:operations/BOARD_DEEPLINK_AUTH_RETURN_G2_2026-09-12.md:39:Shared owner: `auth/callback/index.html` + `community-runtime-v1.js`.
dementor-club-production:operations/COMMERCE_TRUTH_GUARD_G6_PREP_2026-09-16.md:18:- `objects/001-ne-nado/index.html` fails closed before runtime and no longer exposes stale EUR 220 or a public list that could imply current PREORDER/SOLD OUT truth.
dementor-club-production:production-route-manifest.json:14:    "/workspace/admin/design/": "design-system/index.html",
dementor-club-production:production-route-manifest.json:15:    "/workspace/admin/tests/": "design-system/admin/tests/index.html",
dementor-club-production:production-route-manifest.json:16:    "/workspace/admin/auth-test/": "design-system/auth-test/index.html",
dementor-club-production:production-route-manifest.json:17:    "/workspace/admin/sync-test/": "design-system/sync-test/index.html"
dementor-club-production:public-activity-v1.js:89:  const home=path==='/'||path==='/index.html';const community=/^\/community\/?(?:index\.html)?$/.test(path);
dementor-club-production:script.js:2:// Scoring and scenario logic lives in /join/index.html only.
dementor-club-production:scripts/build-pages.mjs:25:  { from:'design-system/index.html', to:'workspace/admin/design/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:28:  { from:'design-system/admin/tests/index.html', to:'workspace/admin/tests/index.html' },
dementor-club-production:scripts/build-pages.mjs:29:  { from:'design-system/auth-test/index.html', to:'workspace/admin/auth-test/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:30:  { from:'design-system/sync-test/index.html', to:'workspace/admin/sync-test/index.html', ownerGate:true },
dementor-club-production:scripts/build-pages.mjs:130:  if (rel === 'auth/callback/index.html') return html;
dementor-club-production:scripts/build-pages.mjs:166:    if (rel === 'projects/logic-awareness/index.html' && !html.includes('/content-series-v1.js')) html = html.replace('</body>', '<script src="/content-series-v1.js" defer></script>\n</body>');
dementor-club-production:scripts/build-pages.mjs:167:    if (rel === 'projects/logic-awareness/index.html' && !html.includes('/logic-awareness-covers-v1.js')) html = html.replace('</body>', '<script src="/logic-awareness-covers-v1.js" defer></script>\n</body>');
dementor-club-production:scripts/diagnose-home-fuengirola-media.mjs:10:  if(pathname.endsWith('/'))pathname+='index.html';
dementor-club-production:scripts/social-head-v1.mjs:13:  if(clean==='index.html')return '/';
dementor-club-production:scripts/social-head-v1.mjs:14:  if(clean.endsWith('/index.html'))return `/${clean.slice(0,-'/index.html'.length)}/`;
dementor-club-production:scripts/validate-artifact-history.mjs:13:  if(pathname.endsWith('/'))pathname+='index.html';
dementor-club-production:scripts/validate-board-admin-telegram-optin-contract.mjs:9:const html=read('workspace/board/index.html');
dementor-club-production:scripts/validate-board-batch-a-contract.mjs:15:const artifactsPage=read('workspace/artifacts/index.html');
dementor-club-production:scripts/validate-board-club-publisher-contract.mjs:7:const boardHtml=read('workspace/board/index.html');
dementor-club-production:scripts/validate-board-club-publisher-contract.mjs:9:const artifactHtml=read('community/artifact/index.html');
dementor-club-production:scripts/validate-board-deeplink-auth-return-browser.mjs:30:const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://local');if(u.pathname==='/__deeplink_harness__'){res.setHeader('content-type','text/html; charset=utf-8');res.end(harness());return}if(u.pathname==='/community-runtime-v1.js'){res.setHeader('content-type','text/javascript; charset=utf-8');res.end(runtimeStub);return}const requestPath=u.pathname.endsWith('/')?`${u.pathname}index.html`:u.pathname;const file=path.resolve(root,requestPath.replace(/^\/+/,''));if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;res.end('not found');return}res.setHeader('content-type',mime[path.extname(file)]||'applic
```

## `docs/FEATURE_ACTIVATION_MATRIX_v1.md`

- production exists: `true`
- staging exists: `true`
- production last: `d7e628a9e03bc385a706463177ddbf3ad2a4d2f7 2026-08-24T16:31:43+02:00 Update feature activation matrix after Join consolidation`
- staging last: `0e7e1b5028aebdc162e599634598de7e6a3acce6 2026-08-30T01:39:08+02:00 Update activation matrix for Community v1 staging`

Semantic references:
```text
NONE
```

Production references to exact path:
```text
dementor-club-production:README.md:54:- `docs/FEATURE_ACTIVATION_MATRIX_v1.md`
```

Production references to basename:
```text
dementor-club-production:README.md:54:- `docs/FEATURE_ACTIVATION_MATRIX_v1.md`
```

## `join/join-progress-map-v2.js`

- production exists: `true`
- staging exists: `true`
- production last: `3d4edd84deda09cbb4177705c0f60baa64f15056 2026-08-29T00:47:54+02:00 Place DC-9 progress runtime under join namespace`
- staging last: `b9071a753b3c0855ae71c441effc21372280e464 2026-08-31T16:39:24+02:00 fix(dc9): normalize legacy self-development result key`

Semantic references:
```text
NONE
```

Production references to exact path:
```text
dementor-club-production:design-system/admin/tests/index.html:45:  const routes=['/join/','/join/apply/','/workspace/','/merch/','/join/join-progress-map-v2.js','/join/join-progress-map-v2.css','/join/apply/apply.js','/join/apply/apply.css'];const routeResult=await safe(async()=>{const rows=[];for(const path of routes){const r=await fetch(base+path,{cache:'no-store'});rows.push({path,status:r.status,ok:r.ok})}return rows});const routeOk=!routeResult.error&&routeResult.every(x=>x.ok);add('B4','PRODUCTION ROUTES',routeOk?'pass':'fail',routeResult.error?routeResult.error.message:routeResult.map(x=>`${x.ok?'OK':'FAIL'} ${x.status} ${x.path}`).join('\n'));
dementor-club-production:site-config.js:55:      if(cfg.onboarding?.progressMap)addScript('/join/join-progress-map-v2.js?v=20260829-01',{module:true});
```

Production references to basename:
```text
dementor-club-production:design-system/admin/tests/index.html:45:  const routes=['/join/','/join/apply/','/workspace/','/merch/','/join/join-progress-map-v2.js','/join/join-progress-map-v2.css','/join/apply/apply.js','/join/apply/apply.css'];const routeResult=await safe(async()=>{const rows=[];for(const path of routes){const r=await fetch(base+path,{cache:'no-store'});rows.push({path,status:r.status,ok:r.ok})}return rows});const routeOk=!routeResult.error&&routeResult.every(x=>x.ok);add('B4','PRODUCTION ROUTES',routeOk?'pass':'fail',routeResult.error?routeResult.error.message:routeResult.map(x=>`${x.ok?'OK':'FAIL'} ${x.status} ${x.path}`).join('\n'));
dementor-club-production:site-config.js:55:      if(cfg.onboarding?.progressMap)addScript('/join/join-progress-map-v2.js?v=20260829-01',{module:true});
```

## `join/result/GRAPH_LINKED_CARDS_V5.md`

- production exists: `false`
- staging exists: `true`
- staging last: `92dc438b456e2778b5e13a62ca6ca8e9ef040f5b 2026-09-01T22:49:53+02:00 docs(dc9): mark graph linked cards v5 superseded`

Semantic references:
```text
dementor-club:operations/DC9_RESULT_LANGUAGE_STANDARD_V0.1.md:17:- `join/result/GRAPH_LINKED_CARDS_V5.md` on `dementor-club-site`.
```

Production references to exact path:
```text
NONE
```

Production references to basename:
```text
NONE
```

## `join/result/result.js`

- production exists: `true`
- staging exists: `true`
- production last: `ef0bdc8b4da059f01395298a5b785175b6e2ae9f 2026-08-30T01:41:51+02:00 Release candidate: Community member entry and first Artifact v1`
- staging last: `386302f85a36e70f81c5e6c1b215961312ae85ab 2026-08-31T17:45:04+02:00 Simplify DC-9 result presentation`

Semantic references:
```text
NONE
```

Production references to exact path:
```text
NONE
```

Production references to basename:
```text
NONE
```

## `scripts/validate-dc9-result-model.mjs`

- production exists: `false`
- staging exists: `true`
- staging last: `0291a67a0f236069cbf8adb0c3432118df607f21 2026-08-31T17:33:11+02:00 Extend DC-9 validator for result UX refinements`

Semantic references:
```text
dementor-club:operations/DC9_RESULT_QA_V0.1.md:86:`dementor-club-site/scripts/validate-dc9-result-model.mjs` now checks:
```

Production references to exact path:
```text
NONE
```

Production references to basename:
```text
NONE
```

## `ui-redesign-drive-v1.css`

- production exists: `false`
- staging exists: `true`
- staging last: `abe80f301635bd03e34e166086316a8f167a01a2 2026-08-26T14:35:52+02:00 Sync approved Drive UI redesign rules`

Semantic references:
```text
dementor-club:.weekly-os/results/public-site-visual-tech-debt-cleanup-v1.v0.1.md:55:- unreferenced `ui-redesign-drive-v1.css` removed.
```

Production references to exact path:
```text
dementor-club-production:docs/UI_REDESIGN_SYNC_v1.md:46:`ui-redesign-drive-v1.css`
dementor-club-production:scripts/validate-visual-contract.mjs:49:must(!bridge.includes('ui-redesign-drive-v1.css'), 'legacy ui-redesign-drive-v1.css import still active in course bridge');
```

## `vercel.json`

- production exists: `true`
- staging exists: `true`
- production last: `c1849f5c2dba702f683d3badb2689eaf1bfcc63a 2026-08-26T17:59:21+02:00 Disable automatic Vercel Git deployments`
- staging last: `7a90dbc74f93c168b70909eb217487833f1dede2 2026-08-30T01:34:23+02:00 Add stable Community Artifact route rewrite`

Semantic references:
```text
NONE
```

Production references to exact path:
```text
NONE
```
