# Site / Production Reconciliation — Final Classification

Date: 2026-09-17  
Result: `dementor-club.result.site-production-reconciliation-v1`  
Issue: #221

## Baseline

- production: `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`
- historical staging inventory head: `7a036ba4cd7ccd635ba273931c2087227d0f4c94`
- merge base: `8194f580b7fd26bc748e0c0a8514119d7764a7e5`
- net differing paths: 315

Production remains runtime/release baseline. This classification does not authorize any production mutation.

## Inventory disposition

The exact inventory produced these preliminary groups:

- 202 `PRODUCTION_BASELINE_ONLY` → **KEEP PRODUCTION BASELINE**
- 79 `SUPERSEDED_REVIEW` → **SUPERSEDED BY CURRENT PRODUCTION**, unless a residual review proves a staging-only responsibility
- 20 `OBSOLETE_REVIEW` → **OBSOLETE / DO NOT REVIVE**
- 9 `PRESERVE_REVIEW` → individually reviewed below
- 5 `DECISION_REQUIRED` → individually reviewed below

The purpose of reconciliation is not to recover the old staging tree. It is to recover the staging **responsibility** on top of current production ancestry.

## Residual review

### `README.md` — PRESERVE RESPONSIBILITY / REWRITE, NOT OLD CONTENT

The staging README correctly owns one branch-local fact: `dementor-club-site` is the development/staging branch and must not deploy production directly.

The old README must not be copied wholesale because it also contains historical design-authority and implementation-source claims that are not authority under the current Weekly OS (`APPROVED_STATE` still has no project-wide DESIGN authority).

Action: keep current production code baseline and replace only branch-role README wording with a minimal current staging contract referencing semantic source + Weekly OS governance.

### `assets/home/events/fuengirola-banner.webp` — OBSOLETE

Semantic evidence explicitly records this file as corrupted, unreferenced tech debt and later retired. Current production has no reference to it. Do not restore.

### `community/board/telegram-worker-trigger-v3.js` — OBSOLETE

Board G8 cleanup evidence states browser trigger v3 is no longer a valid worker authority under the service-role trust boundary and should be retired after trusted scheduling exists. Current canonical Board no longer ships this file. Do not restore.

### `dementor-account-sync-v8.js` — SUPERSEDED / MUST REMAIN ABSENT

Current production validator explicitly requires v10 as sole account-sync owner and asserts v8/v9 files do not exist. Do not restore.

### `design-system/dc9-entry-state-test/index.html` — HISTORICAL QA / OBSOLETE RUNTIME SURFACE
### `design-system/dc9-mobile-qa/index.html` — HISTORICAL QA / OBSOLETE RUNTIME SURFACE
### `design-system/dc9-mobile-result-qa/index.html` — HISTORICAL QA / OBSOLETE RUNTIME SURFACE

These were staging QA artifacts tied to DRAFT QA material. Current production CI owns DC-9 baseline, sync and browser acceptance. Reintroducing parallel manual QA pages would add another QA surface without a current owner. Git history preserves them if historical inspection is needed.

### `join/result/GRAPH_LINKED_CARDS_V5.md` — SUPERSEDED

The document itself declares `Status: SUPERSEDED` and points to v6. Do not restore.

### `scripts/validate-dc9-result-model.mjs` — SUPERSEDED QA

Current Site Integrity validates the released DC-9 contract through the active baseline/sync/browser validator stack. This old staging-only validator has no current production execution owner. Do not restore as a second validation path.

### `ui-redesign-drive-v1.css` — OBSOLETE / MUST REMAIN UNREFERENCED

Semantic cleanup evidence records it as removed. Current production visual validator explicitly rejects legacy `ui-redesign-drive-v1.css` imports. Do not restore.

### `docs/FEATURE_ACTIVATION_MATRIX_v1.md` — STAGING VERSION SUPERSEDED

The staging version encodes obsolete product claims, including the historical Community-v1 membership path and staging statuses. Operational state may not override current semantic authorities. Keep the current production baseline copy only; do not import the old staging edits.

### `join/join-progress-map-v2.js` — OBSOLETE

Current canonical `/join/` does not load this file. DC-9 now uses the current baseline/data/immersive/entry-state stack. Do not restore.

### `join/result/result.js` — OBSOLETE

Current canonical `/join/result/` loads `result-v6.js` and `result-copy-v7.js`, not legacy `result.js`. Do not restore.

### `vercel.json` — STAGING REWRITE NOT PRESERVED

Both branches disable Vercel git deployment. The old staging-only rewrite is not part of current GitHub Pages release/runtime ownership and has no current canonical consumer. Keep production baseline `vercel.json`.

## Reconciled candidate delta

Runtime/product delta to preserve from historical staging: **0 files**.

Staging-specific repository responsibility to preserve: **1 documentation file (`README.md`)**, rewritten against current governance rather than copied from old staging.

Reconciliation evidence files are Result evidence and do not change runtime behavior.

Therefore the clean candidate is:

`current production baseline + current staging-role README + reconciliation evidence`

No old staging runtime, auth, Board, DC-9, Catalog, Supabase or release implementation is replayed.

## Required validation before branch realignment

1. exact candidate topology against production;
2. full current `Site Integrity / Release Readiness` stack on candidate;
3. production SHA remains `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`;
4. only the documented staging-role/evidence delta exists;
5. only after PASS may `dementor-club-site` be realigned to the candidate;
6. after realignment the normal `dementor-club-site` push validation must PASS;
7. PR #21 is then closed as superseded, never merged.
