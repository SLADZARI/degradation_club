---
artifactId: dementor-club.result.qa-portal-harmonization
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G8_CLEANUP
status: APPROVED
version: 1.0
updated: 2026-09-05
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.6
---

# MP | Dementor Club | RELEASE | Portal QA Harmonization | v1.0

## Goal
Close the pre-advertising technical QA / portal harmonization cycle with validated production evidence, targeted live retest, and an explicit entropy audit without creating parallel owners or silently changing product semantics.

## Final status
**APPROVED / RELEASED / TARGETED LIVE RETEST PASS / G8 ENTROPY AUDIT COMPLETE**

Integration branch: `result/qa-portal-harmonization`  
Corrective release branch: `release/qa-portal-harmonization-v04-corrective1`  
Production branch: `dementor-club-production`  
Production/live commit: `326e24debf8696b3c12ddbcef45b8e1615efb11d`  
Live deploy: `Deploy Dementor Production #36`  
Deploy run id: `33990245535`

## Protected semantics preserved
The Result did not change the approved Membership v2 boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Preserved rules:
- DC-9 remains usable before login;
- login is required only before Application;
- 9/9 does not itself create membership;
- Membership follows review acceptance;
- the first complete DC-9 baseline is immutable;
- later repeats remain separate and do not overwrite the baseline;
- Workspace remains the single authenticated shell;
- ordinary active Member entry remains Community Board;
- Artifact publication remains owned by the existing Board slot/composer model;
- owner/admin role does not silently create unlimited publication rights.

## Validation lineage
Corrective integration PR `#115` passed G6 / Site Integrity `#770` with exactly 11 changed files.

Clean production candidate:
- base: prior live production `6a7c4d617b6519e0e7dcc4aeb1d27c3102eb943c`;
- candidate: `4df167d1d5d2756c395b56bef289fd09c40923d0`;
- tree: `6230e550d3c845eaa688b505c601716cdb1fe57a`;
- ahead: 1;
- behind: 0;
- exactly 11 intended files;
- no blind `dementor-club-site → production` history merge.

Production Readiness `#772` passed. Production PR `#116` merged as `326e24debf8696b3c12ddbcef45b8e1615efb11d` with the same validated tree.

## Deploy #36 evidence
The user explicitly authorized the corrective deploy. Canonical manual workflow `Deploy Dementor Production` completed successfully.

Build evidence:
- checkout ref: `dementor-club-production`;
- build resolved exact production commit `326e24debf8696b3c12ddbcef45b8e1615efb11d`;
- site registry/routes/features: PASS;
- sitemap/robots: PASS;
- content readiness: PASS;
- visual contract: PASS;
- production Pages build: PASS;
- analytics + consent guard: PASS;
- production release guard: PASS for 48 HTML routes;
- Pages artifact id: `9976400705`;
- artifact digest: `sha256:afb105fd63229036dae8cb961fad377ad97956da71b32b2ef33ff21c2e956ed0`;
- GitHub Pages deploy: SUCCESS.

## Targeted live retest — PASS
The user completed all six targeted checks after deploy #36:

1. **Artifact → Board context restore — LIVE PASS**  
   Artifact opened from Board returns through `← BOARD` to the prior Board context/viewport rather than resetting the Board.

2. **Public Header auth-state flash — LIVE PASS**  
   Returning from authenticated Workspace to the public site no longer flashes the guest `Вступить в клуб` state before Member identity resolves.

3. **Mobile `/join/` canonical Header — LIVE PASS**  
   The duplicate guest auth panel / top light+black gap is gone. The canonical Header is the only public auth/navigation owner at the top of DC-9.

4. **DC-9 storage/progress — LIVE PASS**  
   Mobile live retest confirmed sphere progress remains visible after returning to the sphere list (`ОТНОШЕНИЯ 1/5`, `КОНТРОЛЬ 2/5` observed), proving the current storage/progress path still functions after direct storage-guard ownership cleanup.

5. **No timed Support interruption in `/join/*` — LIVE PASS**  
   User remained in the DC-9 flow beyond the previous timer window; `ПОДДЕРЖАТЬ ДЕГРАДАЦИЮ` did not appear.

6. **Owner/Admin System Tests A3 — LIVE PASS**  
   User confirmed the corrected System Tests surface is green for the previously stale A3 Application assertion and the tested owner/admin surfaces remain normal.

No contradictory live evidence was reported on the previously passed guest/login/Workspace/Board/My Activity/My Artifacts/Review flows.

## Route / canonical / SEO outcome
Technical route/canonical/SEO checks passed in G6 #770, Production Readiness #772 and deploy #36 release guards.

Current contract remains:
- `/join/` indexable;
- `/join/apply/` and `/join/result/` noindex;
- `/workspace/*` noindex/private;
- sitemap excludes private/compat routes;
- canonical/OG URLs remain on `https://dementor.club`;
- compatibility routes are not active IA owners.

## G8 entropy audit
G8 was performed after the released corrective Result.

### Canonical owners
No blocking parallel runtime owner remains in the validated/live surfaces:
- Public Header → canonical GlobalHeader;
- Public Footer → canonical GlobalFooter;
- authenticated Workspace → canonical Workspace Shell;
- Workspace identity/logout → Workspace Shell;
- Board publication → existing slot/composer owner;
- Membership Application → canonical RPC-owned submission flow;
- DC-9 storage/progress → current DC-9 owner + direct storage guard.

### Compatibility routes
The following are retained only as explicit compatibility/noindex surfaces, not as current IA owners:
- `/community/board/` → canonical `/workspace/board/`;
- `/join/member/` → canonical Membership v2 continuation;
- `/profile/` → canonical Workspace/profile continuation;
- `/auth/callback/` → auth compatibility/callback surface.

They must not be promoted back into primary navigation. Physical deletion remains safe only after zero-use evidence and a separate route cleanup release.

### Repository branch entropy
The repository still contains many historical `agent/*`, old QA, asset-slot, hotfix and staging branches. They are not current integration authority. Current Result authority was limited to `result/qa-portal-harmonization` and the explicit corrective release branch. Branch deletion is repository housekeeping and is not mixed into a production code release.

### Dead/legacy code candidates
Several historical runtime/assets remain candidates for later zero-reference cleanup (for example compatibility auth-preboot/runtime copies and old versioned assets/scripts). They were not deleted blindly during this Result because safe deletion requires explicit reference inventory and would itself create a new implementation/release mutation. The current release gates show no broken runtime references or duplicate active shell owner.

### Superseded QA assumptions
The stale A3 direct-INSERT assumption is removed from active validation semantics: Membership Application remains RPC-owned. Old ledger text that described pre-deploy states is historical evidence only and is superseded by this Result's final live state.

## Deferred product/design work
Not part of this QA Result:
- answer-selection micro-feedback (`выбрано / можно продолжать`);
- consent wording polish while preserving equally simple accept/refuse actions;
- final DC-9 onboarding/result/application copy and visual polish;
- Workspace left-sidebar → top-navigation redesign;
- owner/admin unlimited/system-card publication (requires explicit product decision);
- physical deletion of compatibility routes after zero-use evidence;
- broader repository branch/file housekeeping.

## Closure
G5 implementation: PASS.  
G6 validation: PASS.  
G7 release: PASS — explicit deploy #36.  
Targeted live retest: PASS — all six corrective surfaces.  
G8 entropy audit: COMPLETE for active runtime ownership; non-runtime housekeeping is explicitly deferred rather than silently mixed into production.

**Result closed.**
