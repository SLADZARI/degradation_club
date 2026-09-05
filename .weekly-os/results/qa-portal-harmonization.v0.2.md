---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.2
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.1
---

# MP | Dementor Club | RELEASE | Portal QA Harmonization | v0.2

## Goal
Bring the current Dementor Club portal through pre-advertising QA while progressively harmonizing implementation with the project kernel and approved local operating rules, without duplicate UI/navigation/auth/domain systems or silent semantic mutation.

## Status
**ACTIVE / G7_RELEASE / LIVE DB MIGRATED + CORRECTED / CORRECTIVE DEPLOY #34 PASS / REAL SAFARI GOOGLE AUTH + LOGOUT/RELOGIN PASS / MY ACTIVITY + MY ARTIFACTS LIVE PASS / LIVE RETEST CONTINUES**

Implementation branch: `result/qa-portal-harmonization`  
Current release branch: `release/qa-portal-harmonization-v02-auth1`  
Production branch: `dementor-club-production`  
Current deployed production HEAD: `723c5404d28530ae9805a76c4442daa0b6bedfcb`

## Authority / protected boundaries
- Workspace-specific approved authority: `operations/WORKSPACE_MEMBER_ACTIVATION_AND_SHELL_V1.md`.
- Canonical QA ledger: `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`.
- Protected admission boundary: `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`.
- Protected member activation: `MEMBER_ACTIVE → FIRST_ARTIFACT_REQUIRED → MEMBER_ACTIVATED`.
- First complete DC-9 baseline is immutable; repeat attempts remain separate history.
- No new universal Activity entity/table is authorized; My Activity is a projection of existing canonical data.
- Public login remains owned by canonical `global-header.js`; PKCE callback remains `/auth/callback/`; logout remains owned by Workspace.
- MP_DSL v0.1 remains global DRAFT/REFERENCE; only explicitly approved Dementor Club local operating rules apply.

## Implemented coherent packages before first release
All implementation remained inside one Result and extended existing owners:
1. PR #95 — canonical Russian public Header/auth identity — G6 #715 PASS.
2. PR #97 — canonical Application auth handoff — G6 #718 PASS.
3. PR #98 — direct DC-9 result → Application — G6 #720 PASS.
4. PR #99 — merged DC-9 intro/sphere picker — G6 #722 PASS.
5. PR #100 — canonical private Workspace shell + Member activation spotlight — G6 #727 PASS.
6. PR #101 — immutable first-complete DC-9 baseline — G6 #729 PASS.
7. PR #102 — Community participation → My Activity projection — G6 #732 PASS.
8. PR #103 — WebKit auth regression proxy — corrected G6 #735 PASS.
9. PR #104 — My Artifacts archive-history harmonization — G6 #737 PASS.

Source-backed no-op: `/join/` already opens on the nine-sphere picker; no parallel pre-DC-9 confirmation owner was introduced.

## First clean production release
Original clean candidate was built from the then-current production baseline rather than merging `dementor-club-site` blindly.
- release branch: `release/qa-portal-harmonization-v02`;
- candidate: `e42de43fe637225bc4101095b67229bf8328d196`;
- production PR #105;
- Production Release Readiness #739 PASS;
- merged as `1f383f2c2fe020ce8839286ab56ee29436dbf569`.

## Live database release and runtime correction
The user explicitly authorized the first G7 release with `деплой`.

Live Supabase migration was applied as:
- `20260905084028_dc9_immutable_first_baseline_v1`.

Before Pages deploy, live PostgreSQL verification exposed a runtime-only defect: the trigger referenced nonexistent `jsonb_object_length(jsonb)`. Pages deploy was stopped before execution.

Corrective live migration was applied as:
- `20260905084118_dc9_immutable_first_baseline_v1_fix_jsonb_key_count`.

The corrected trigger uses `pg_catalog.jsonb_object_keys(...)` and preserves the approved 9-key gate and immutable first-baseline semantics.

Live verification after correction:
- baseline function exists;
- lock function exists;
- trigger exists;
- both release migrations are recorded;
- 3 complete first baselines found in existing history;
- all complete baselines contain exactly 9 keys;
- 2 complete profiles already contain later repeat runs;
- 0 malformed complete baselines.

Git/live migration history was reconciled without introducing a new baseline table. PR #106 merged to `dementor-club-site` after G6 #745 PASS. Clean production correction PR #107 passed Production Release Readiness #747 and merged as `25dc061e292f79c996d2346c6d51fddc5245b642`.

## Pages deploy #33
The user manually dispatched canonical `Deploy Dementor Production` from the workflow definition on `main` with `release_confirmation=APPROVED`. The workflow itself checked out `dementor-club-production`.

Run #33 (`33958979752`) completed successfully:
- build: PASS;
- production validators: PASS;
- Pages artifact upload: PASS;
- GitHub Pages deploy: PASS.

This deployed production commit `25dc061e292f79c996d2346c6d51fddc5245b642` and established the first live post-v0.2 test surface.

## Real Safari live failure — 2026-09-05
Real Safari human retest immediately disproved closure of the auth criterion:
- public Google login reached `accounts.google.com`;
- Google responded with HTTP-style **400 malformed request** page;
- the flow did not return to `/auth/callback/`.

Supabase Auth log evidence around the failed Safari attempt:
- `/authorize` succeeded with HTTP 302 and logged `Redirecting to external provider`;
- no corresponding Supabase `/callback` followed the failed attempt;
- nearby auth traffic contained `refresh_token_not_found`, indicating stale browser auth-session noise;
- historical/current Google PKCE flows on the same Supabase project had succeeded, so provider configuration was not globally dead.

Therefore the failure boundary was after Supabase `/authorize` and before the canonical app callback. Existing WebKit coverage was insufficient because it stubbed `signInWithOAuth` and did not inspect the real provider redirect.

## Corrective Safari / Google handoff package
The correction preserves existing auth architecture and changes no membership/DC-9 meaning.

Implementation PR #108 changed exactly four files:
- `global-header.js`: Google PKCE login explicitly requests `queryParams: { prompt: 'select_account' }` so Google presents account selection instead of silently reusing existing Google account state;
- `scripts/validate-webkit-auth.mjs`: locks the account-chooser contract;
- `scripts/validate-google-oauth-handoff.mjs`: new release gate calls the real Supabase `/auth/v1/authorize` endpoint and verifies redirect to `accounts.google.com`, canonical Supabase provider callback, client id, code response type and `prompt=select_account`;
- `.github/workflows/site-integrity.yml`: runs the provider-handoff gate permanently.

PR #108 passed full G6 **#748 PASS**, including the new real provider-handoff check, Chromium, My Artifacts, WebKit, routes and release guard; it merged to `dementor-club-site` as `6132326cfce07924d7063909b5231fb7335713ac`.

A clean production branch `release/qa-portal-harmonization-v02-auth1` was created directly from production `25dc061e...` and projected only those four files. Compare: **4 commits ahead / 0 behind / 4 files**.

Production PR #109 passed full Production Release Readiness **#750 PASS** and merged to `dementor-club-production` as:
`723c5404d28530ae9805a76c4442daa0b6bedfcb`.

## Corrective Pages deploy #34 and Safari live PASS
The user explicitly authorized the corrective artifact with a new `деплой` command.

Canonical `Deploy Dementor Production` run #34 (`33966550857`) completed successfully on 2026-09-05:
- workflow definition ran from `main`;
- checkout explicitly used `ref: dementor-club-production`;
- `git log -1 --format=%H` inside the build resolved exactly to `723c5404d28530ae9805a76c4442daa0b6bedfcb`;
- registry/routes/feature validation: PASS;
- content readiness: PASS;
- visual contract: PASS;
- production build: PASS;
- analytics + consent guard: PASS;
- production release guard: PASS (`48 HTML routes`);
- Pages artifact upload: PASS, artifact id `9969603168`, SHA256 `0e9e2694ec284fa189cce8780858a9475af64783167baa415625891569077a4c`;
- GitHub Pages deploy: PASS.

Real Safari human retest after deploy #34:
- Google account handoff completed successfully;
- PKCE callback returned to `dementor.club`;
- authenticated Workspace loaded successfully;
- ordinary Member landed on `COMMUNITY BOARD` inside the canonical private Workspace shell;
- visible Workspace logout control is present.

Live Supabase Auth logs independently confirm the successful Safari PKCE sequence:
- `/authorize` → 302;
- Google provider `/callback` → 302;
- PKCE `/token` → 200;
- `/user` → 200.

The same live log stream then records a full logout/recovery sequence for the same account:
- `/logout` → 204 at 12:48:25Z;
- new Google `/authorize` → 302 at 12:48:27Z;
- provider `/callback` → 302 at 12:48:32Z;
- PKCE `/token` → 200 at 12:48:32Z;
- `/user` → 200 at 12:48:33Z.

Therefore both the previously failing real-Safari Google auth criterion and logout → repeated Google login recovery are now **LIVE PASS** for deployed production commit `723c5404...`.

## Live Workspace evidence — My Activity / My Artifacts
Human live screenshots on 2026-09-05 confirm the two history/projection surfaces on deployed production:

`/workspace/#activity` / **МОЯ АКТИВНОСТЬ**:
- counters render `АРТЕФАКТЫ 2`, `ОТКЛИКИ 2`, `РЕАКЦИИ 3`;
- artifact projection contains active `Куда двигаемся - народ?` with `НА ДОСКЕ` state;
- artifact projection contains archived `гусь` with `В АРХИВЕ` state;
- two response records render under `Мои отклики`;
- three reaction records render under `Мои реакции`, including a reaction tied to archived `гусь`;
- completed-test history remains visible below the community participation projection.

`/workspace/artifacts/` / **МОИ АРТЕФАКТЫ**:
- active + archived filters are present;
- active `Куда двигаемся - народ?` renders as `ACTIVE / NOTICE`;
- archived `гусь` remains in history as `ARCHIVED / NOTICE` with closure date `30.08.2026`;
- archive history is therefore not lost when an artifact leaves the live Board.

User also reports both surfaces operate normally after the logout/relogin cycle. This closes the live acceptance criteria for **My Activity response/reaction/Artifact projection** and **My Artifacts active + archived history including archived `гусь`**.

## Current release boundary
`commit ≠ merge ≠ deploy ≠ live-validated`.

Current facts:
- live DB migrations: **APPLIED + VERIFIED**;
- corrective production commit `723c5404...`: **DEPLOYED** by run #34;
- corrective deploy build + Pages deployment: **PASS**;
- real Safari Google login/callback: **LIVE PASS**;
- Safari logout → repeated Google login recovery: **LIVE PASS**;
- Workspace authenticated landing / ordinary Member → Community Board: **LIVE PASS for observed sessions**;
- My Activity participation projection: **LIVE PASS**;
- My Artifacts active + archive history including `гусь`: **LIVE PASS**;
- broader post-audit live-convergence inventory: **PENDING / IN PROGRESS**.

## Remaining live acceptance criteria
Retest sequentially:
1. ~~real Safari Google login must show account choice and complete PKCE callback~~ — **PASS after deploy #34**;
2. ~~logout in Workspace → Google login recovery~~ — **PASS from live Auth logs after deploy #34**;
3. public Header guest/authenticated/member states;
4. authenticated private Workspace shell and guest boundary;
5. ordinary Member default → Community Board — **PASS for observed Safari sessions; keep broader route/state verification**;
6. Board root/child navigation including QA-MEM-033;
7. first Artifact spotlight without false activation;
8. ~~My Activity response/reaction/Artifact projection~~ — **LIVE PASS from human screenshot**;
9. ~~My Artifacts active + archived history including archived `гусь`~~ — **LIVE PASS from human screenshot**;
10. Board spatial behavior / drag-reposition;
11. owner-admin geometry;
12. mobile Join/Application surfaces;
13. DC-9 first baseline → repeat → Application snapshot;
14. live route/canonical/SEO integrity.

The broader post-audit live-convergence inventory remains required after the access blocker is cleared. Findings must be classified as `BUG CURRENT RESULT`, `STALE / LEGACY`, `NEXT RESULT`, or `DECISION REQUIRED`; do not blind-merge `dementor-club-site` into production.

## Next gate
Current gate remains **G7_RELEASE**.

Next action: continue the live sequential Board pass: root/child navigation including QA-MEM-033, then spatial drag/reposition, followed by remaining shell/mobile/DC-9/route checks and canonical QA-ledger reconciliation.

Do not mark this Result `DONE`, `VALIDATED`, `RELEASED` or move to G8 until the remaining live evidence and convergence findings are resolved.
