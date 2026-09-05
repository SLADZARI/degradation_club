---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: DRAFT
version: 0.6
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.5
---

# MP | Dementor Club | RELEASE | Portal QA Harmonization | v0.6

## Goal
Close pre-advertising technical QA through one evidence-backed corrective release without parallel owners, semantic mutation or blind `dementor-club-site → production` merging.

## Status
**ACTIVE / G7_RELEASE / CORRECTIVE PRODUCTION DEPLOYED / TARGETED LIVE RETEST REQUIRED**

Integration branch: `result/qa-portal-harmonization`  
Corrective release branch: `release/qa-portal-harmonization-v04-corrective1`  
Production branch: `dementor-club-production`  
Current production HEAD: `326e24debf8696b3c12ddbcef45b8e1615efb11d`  
Current live deployed content HEAD: `326e24debf8696b3c12ddbcef45b8e1615efb11d`  
Current live deploy: `Deploy Dementor Production #36`

## Protected boundaries
Inherited unchanged from v0.5 and approved local decisions:
- `AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`;
- DC-9 remains usable without mandatory login;
- login is required only before Application;
- first complete DC-9 9/9 baseline is immutable;
- repeats do not overwrite the baseline;
- Workspace remains the single authenticated shell;
- active Member default entry remains Community Board;
- Artifact creation remains owned by the existing Board slot/composer flow;
- owner/admin role does not silently grant unlimited publication;
- no second Header, Workspace nav, auth callback, composer or membership lifecycle was introduced.

## Corrective package inherited from v0.5
The deployed corrective package contains only defects evidenced during live QA:
1. Artifact detail return restores previous Board context when opened from Board, with canonical Board fallback for direct entry.
2. Public Header suppresses guest/member auth controls while auth state is `checking`, preventing the transient wrong-state flash.
3. `/join/` no longer renders the duplicate guest auth panel from `dementor-account-sync-v8.js`; canonical Header remains the only public auth owner.
4. DC-9 storage guard is attached directly to the current DC-9 flow rather than depending on legacy presentation runtime ownership.
5. timed Support prompt is suppressed during active `/join/*` flow without globally removing Support.
6. owner/admin System Tests A3 now validates the RPC-owned Membership Application contract rather than requiring an obsolete authenticated direct INSERT policy.
7. existing shell/WebKit/DC-9 regression contracts were strengthened around these fixes.

No DB migration is part of this corrective package.

## Validation before production merge
Corrective integration PR `#115` tested head `3d8380e5f7f1c0860df844eff930bf4e64f8cea0` with exactly 11 changed files. G6 / Site Integrity `#770` passed completely.

A clean release candidate was created directly from the prior live production baseline `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`:
- candidate commit: `4df167d1d5d2756c395b56bef289fd09c40923d0`;
- candidate tree: `6230e550d3c845eaa688b505c601716cdb1fe57a`;
- ahead: 1 commit;
- behind: 0;
- changed files: exactly 11;
- no `dementor-club-site` history in the candidate.

Production Readiness `#772` passed completely. PR `#116` merged to `dementor-club-production` as `326e24debf8696b3c12ddbcef45b8e1615efb11d`. The merge commit has the same validated tree `6230e550d3c845eaa688b505c601716cdb1fe57a`.

## Explicit deploy #36 evidence
The user explicitly authorized this specific corrective deployment with `деплой`. The authorization was consumed by the manual workflow dispatch.

Canonical workflow: `Deploy Dementor Production`  
Run: `#36`  
Run id: `33990245535`  
Trigger: `workflow_dispatch` from workflow definition on `main`  
Result: **SUCCESS**

Build evidence:
- `Checkout canonical production branch`: PASS;
- workflow checkout ref: `dementor-club-production`;
- `git log -1 --format=%H` resolved exactly to `326e24debf8696b3c12ddbcef45b8e1615efb11d`;
- registry/routes/features: PASS, 0 errors / 0 warnings;
- sitemap/robots: 31 URLs checked;
- internal references: 800 checked across 58 HTML files;
- content readiness: PASS;
- visual contract: PASS;
- production Pages build: PASS;
- analytics/consent guard: PASS;
- production release guard: PASS, 48 HTML routes covered;
- Pages artifact upload: PASS.

Pages artifact:
- artifact id: `9976400705`;
- size: `14737616` bytes;
- digest: `sha256:afb105fd63229036dae8cb961fad377ad97956da71b32b2ef33ff21c2e956ed0`.

Deploy evidence:
- `Deploy to GitHub Pages`: PASS;
- GitHub Pages reported `success`;
- environment URL resolved to `http://dementor.club/` in the action output.

As with the previous deployment, GitHub Pages metadata uses the `main` workflow-definition SHA (`583a9001...`) as `pages_build_version`. The build log independently proves that the deployed artifact content was built from canonical production commit `326e24de...`. Therefore live content authority is `326e24debf8696b3c12ddbcef45b8e1615efb11d`.

## Route / canonical / SEO evidence
The corrective artifact passed route/canonical/SEO checks in G6 #770, Production Readiness #772 and deploy #36 production guards. Current manifest intent remains:
- `/join/` indexable;
- `/join/apply/` and `/join/result/` noindex;
- `/workspace/*` noindex;
- sitemap excludes private/compat routes;
- compatibility routes remain G8 cleanup candidates rather than current public IA.

Classification: **TECHNICAL ROUTE/CANONICAL/SEO CHECK = PASS ON DEPLOYED ARTIFACT**.

## Required targeted live retest
Do not repeat the full earlier QA matrix. Retest only the changed/evidenced surfaces:
1. Artifact opened from Board → `← BOARD` returns to the previous Board context/viewport.
2. Active Member returning to public site does not see a flash of `Вступить в клуб` / guest auth controls during auth resolution.
3. mobile `/join/` starts with the canonical Header without the duplicate top auth panel/gap.
4. DC-9 progress still works with storage guard attached directly to canonical DC-9 controls.
5. no timed Support prompt appears during active `/join/*` flow.
6. owner/admin System Tests A3 reflects RPC-owned Application submission and no longer fails for absence of a direct authenticated INSERT policy.

If these six targeted checks pass, reconcile the canonical QA ledger, perform G8 cleanup, then close this Result. Do not reopen already evidenced flows unless contradictory evidence appears.

## Deferred / next Result
Outside the current technical QA Result:
- answer-selection micro-feedback (`выбрано / можно продолжать`) — UX polish;
- consent wording polish while preserving equally simple acceptance/refusal;
- final DC-9 onboarding/result/application copy and visual polish;
- Workspace left-sidebar → top-navigation redesign after G7/G8, preserving one canonical Workspace navigation owner;
- owner/admin unlimited/system-card publication, if desired, requires an explicit product decision;
- compatibility-route deletion and old implicit/hash auth-preboot cleanup — G8.

## Gate
Current gate remains **G7_RELEASE**. The corrective artifact is deployed, but the Result is not yet `DONE`, `VALIDATED` or closed until the six targeted live checks are completed and the QA ledger/G8 cleanup are reconciled.