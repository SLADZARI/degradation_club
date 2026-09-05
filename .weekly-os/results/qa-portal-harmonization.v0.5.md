---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.5
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.4
---

# MP | Dementor Club | RELEASE | Portal QA Harmonization | v0.5

## Goal
Close pre-advertising technical QA through one evidence-backed corrective release without parallel owners, semantic mutation or blind `dementor-club-site → production` merging.

## Status
**ACTIVE / G7_RELEASE / LIVE QA COMPLETE ENOUGH FOR CORRECTIVE PACKAGE / CORRECTIVE PRODUCTION MERGED / CORRECTIVE DEPLOY NOT AUTHORIZED**

Integration branch: `result/qa-portal-harmonization`  
Corrective release branch: `release/qa-portal-harmonization-v04-corrective1`  
Production branch: `dementor-club-production`  
Current production HEAD: `326e24debf8696b3c12ddbcef45b8e1615efb11d`  
Current live deployed content HEAD: `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`  
Current live deploy: `Deploy Dementor Production #35`

## Protected boundaries
Inherited unchanged from v0.4 and approved local decisions:
- `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`;
- DC-9 remains usable without mandatory login;
- login is required only before Application;
- first complete DC-9 9/9 baseline is immutable;
- repeats do not overwrite the baseline;
- Workspace remains the single authenticated shell;
- active Member default entry remains Community Board;
- Artifact creation remains owned by the existing Board slot/composer flow;
- owner/admin role does not silently grant unlimited publication;
- no second Header, Workspace nav, auth callback, composer or membership lifecycle was added.

## Live QA accepted before corrective package
Evidence from deploy #35 is retained in v0.4. The sequential pass established or accepted:
- Safari Google login + callback: LIVE PASS;
- Workspace logout → repeated login: LIVE PASS;
- guest Header + login → active Member → Board: LIVE PASS;
- Board slot occupied state / geometry: LIVE PASS;
- Board drag persistence: LIVE PASS;
- My Activity: LIVE PASS;
- My Artifacts active + archive history including archived `гусь`: LIVE PASS;
- owner/admin + Membership Review + System Tools surfaces: LIVE PASS;
- mobile Application geometry: LIVE PASS;
- mobile DC-9 inner question/answer flow: LIVE PASS;
- guest DC-9 completion → 9/9 result → Join CTA → canonical `/join/apply/` auth boundary: LIVE PASS;
- exact post-login attachment of that guest completion was intentionally not repeated because the available browser account was not controlled by the user; accepted as LOW RISK based on existing auth/application contracts and prior live DB immutable-baseline evidence.

## Evidenced defects included in corrective package
Only current-Result defects observed during live QA were included:
1. Artifact detail return lost the previous Board viewport/scroll context.
2. Public Header could briefly flash guest auth controls while membership state was still resolving.
3. `/join/` could render a duplicate guest auth panel from `dementor-account-sync-v8.js`, producing the observed mobile top gap before the canonical Header.
4. canonical DC-9 still depended on legacy `/script.js` as an indirect transport for the storage guard; storage capability protection is now attached directly to the current DC-9 owner and current controls.
5. timed `ПОДДЕРЖАТЬ ДЕГРАДАЦИЮ` support prompt could interrupt active `/join/*` flow.
6. owner/admin System Tests A3 expected an obsolete direct authenticated INSERT policy even though canonical Application submission is RPC-owned via `dc_submit_membership_application_v2`.
7. existing shell/WebKit/DC-9 regression contracts were strengthened around these fixes.

No DB migration is part of this corrective package.

## Integration validation
Corrective integration PR: `#115`  
Tested integration head: `3d8380e5f7f1c0860df844eff930bf4e64f8cea0`  
Scope: exactly 11 changed files.

G6 / Site Integrity run `#770` passed completely:
- registry/routes/features;
- page readiness;
- visual contract;
- immutable DC-9 baseline contract;
- production build;
- analytics/consent;
- canonical shell;
- built JavaScript syntax;
- live Google OAuth provider handoff;
- Chromium browser shell/Workspace recovery;
- My Artifacts history;
- WebKit auth regression;
- production route manifest;
- production artifact release gate.

PR #115 merged to `dementor-club-site` as `0f86c903936b11d491e1275a39b094ccb9f3b1e6`.

## Clean corrective production candidate
The release branch was created directly from the live production baseline `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`.

Candidate commit: `4df167d1d5d2756c395b56bef289fd09c40923d0`  
Candidate tree: `6230e550d3c845eaa688b505c601716cdb1fe57a`

Compare against production baseline:
- ahead: 1 commit;
- behind: 0;
- changed files: exactly 11;
- no `dementor-club-site` history was merged into the candidate.

Production PR: `#116`.

Production Release Readiness `#772` passed completely, including build, baseline contract, analytics/consent, canonical shell, JavaScript syntax, live Google handoff, Chromium, My Artifacts, WebKit, route manifest and production release gate.

PR #116 merged to `dementor-club-production` as:
`326e24debf8696b3c12ddbcef45b8e1615efb11d`

The production merge commit has the exact same validated tree:
`6230e550d3c845eaa688b505c601716cdb1fe57a`

Therefore the production merge is tree-equivalent to the Release Readiness candidate.

## Route / canonical / SEO evidence
The candidate route/release contracts passed in G6 #770 and Production Readiness #772. Current manifest intent remains:
- `/join/` indexable;
- `/join/apply/` and `/join/result/` private/noindex surfaces;
- `/workspace/*` private/noindex;
- compatibility routes remain noindex and are cleanup candidates, not current public IA;
- sitemap excludes private/compat routes;
- production release gate checks canonical/OG/robots/CNAME/legacy-origin and forbidden internal-route constraints.

Classification: **TECHNICAL ROUTE/CANONICAL/SEO CHECK = PASS ON VALIDATED CORRECTIVE ARTIFACT**. Compatibility-route deletion remains G8 and is not mixed into this corrective release.

## Deployment boundary
**Corrective production commit `326e24de...` is MERGED BUT NOT DEPLOYED.**

The previous explicit deploy authorization was consumed by deploy #35 for `6a7c4d61...`. It does not authorize this corrective artifact.

Do not deploy until the user explicitly says `деплой` again.

## Required targeted live retest after corrective deploy
Do not repeat the entire earlier QA matrix. Retest only changed/evidenced surfaces:
1. Artifact opened from Board → `← BOARD` returns to the previous Board context/viewport.
2. Active Member returning to public site does not see a flash of `Вступить в клуб` / guest auth controls during auth resolution.
3. mobile `/join/` starts with the canonical Header without the duplicate top auth panel/gap.
4. DC-9 progress still works with storage guard attached directly to canonical DC-9 controls.
5. no timed Support prompt appears during active `/join/*` flow.
6. owner/admin System Tests A3 reflects RPC-owned Application submission and no longer fails for absence of a direct authenticated INSERT policy.

If these targeted checks pass, reconcile the canonical QA ledger, perform G8 cleanup, and close this Result. Do not reopen already evidenced flows unless contradictory evidence appears.

## Deferred / next Result
Outside the current technical QA Result:
- answer-selection micro-feedback (`выбрано / можно продолжать`) — UX polish;
- consent wording polish while preserving equally simple acceptance/refusal;
- final DC-9 onboarding/result/application copy and visual polish;
- Workspace left-sidebar → top-navigation redesign after G7/G8, preserving one canonical Workspace navigation owner;
- owner/admin unlimited/system-card publication, if desired, requires an explicit product decision;
- compatibility-route deletion and old implicit/hash auth-preboot cleanup — G8.

## Gate
Current gate remains **G7_RELEASE**. Do not mark `DONE`, `VALIDATED`, `PRODUCTION READY` or `RELEASED` for the corrective artifact until it is explicitly deployed and the targeted live retest is complete.
