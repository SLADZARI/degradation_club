---
artifactId: dementor-club.evidence.evidence-hygiene-live-retest-2026-09-17
project: dementor-club
documentType: QA_EVIDENCE
status: PASS_LAYERED_PRODUCTION_EVIDENCE
updated: 2026-09-17
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.evidence-hygiene-v1
issue: 201
productionCommit: 374defbe583fac0839a43611b151d1104b47a42b
pagesDeployRun: 119
pagesDeployRunId: 35211118478
pagesDeployAttempt: 2
pagesArtifactId: 10492111474
pagesArtifactDigest: sha256:e076fe6c94bb5b009d52d1f2395987b9ad05e2a478d63b875966903087e3ca8a
liveRetest: PASS_LAYERED_PRODUCTION_EVIDENCE
---

# Evidence Hygiene v1 · consolidated production live evidence

## Result

**PASS_LAYERED_PRODUCTION_EVIDENCE**

Evidence model:

`LIVE SMOKE + EXACT DEPLOYED-CODE AUTOMATED ACCEPTANCE`

This file deliberately does **not** claim that GA4 / Clarity network interception was repeated against live production after deploy. Analytics suppression/control proof comes from automated browser acceptance on the exact runtime source that was subsequently deployed; live smoke proves that the canonical release is serving correctly.

## 1. Backend production verification

Canonical backend release evidence:

`operations/EVIDENCE_HYGIENE_BACKEND_RELEASE_2026-09-16.md`

Production verification established:
- canonical Supabase workflow run `35150249462` = `SUCCESS`;
- migration `20260916213500_evidence_hygiene_v1.sql` applied;
- post-migration ledger clean / no additional pending migration;
- canonical `dc_create_artifact_draft_v1(text,text,text,timestamptz,timestamptz,text)` exposes optional `p_source_ref` while preserving omitted-argument calls;
- deployed canonical RPC contains OWNER_ADMIN-only QA provenance guard and canonical lowercase `qa:` requirement;
- source_ref is written at canonical Artifact creation;
- canonical `dc_public_activity_read_v1(integer,timestamptz,uuid)` contains `(a.source_ref is null or a.source_ref not like 'qa:%')`;
- existing 15-field public Activity contract, ordering and keyset predicate remain intact;
- normal production Activity rows remain eligible;
- no historical Artifact rewrite was performed;
- no Membership, DC-9, Telegram, Current Program, RLS or Artifact lifecycle semantic mutation was introduced.

No production QA Artifact was created solely for closure testing. That is intentional: the deployed function/read-model definitions plus exact automated differential QA fixture evidence establish the contract without polluting production operational evidence.

Historical caveat remains:

`pre-cutover evidence may contain QA/internal activity`

## 2. Exact deployed-code automated acceptance

G6 evidence:

`operations/EVIDENCE_HYGIENE_G6_2026-09-16.md`

Corrective validation evidence:

`operations/EVIDENCE_HYGIENE_PAGES_VALIDATOR_DRIFT_CORRECTIVE_2026-09-17.md`

Site Integrity / Release Readiness:
- run number: `#1199`;
- run id: `35161854100`;
- exact validated corrective head: `842d96b07b7ef20f298578e078467148cfa27675`;
- conclusion: `SUCCESS`;
- all 51 validation steps passed.

The corrective changed only the canonical Pages workflow command from the stale raw shell validator to the already-current Board v2.1 compatibility validator. It did not alter product runtime code. The production merge commit `374defbe583fac0839a43611b151d1104b47a42b` has exact validated corrective `842d96b...` as its second parent; therefore the Evidence Hygiene runtime implementation accepted in the validation chain is the runtime source subsequently deployed.

Relevant automated Evidence Hygiene acceptance proves:
- source fixture contains a `qa:` Artifact and public Activity excludes it;
- ordinary eligible public Artifact remains visible;
- Home Activity excludes QA fixture on desktop and mobile;
- Community first page and load-more preserve normal pagination while QA remains absent;
- QA production-mode browser session sets the QA session marker preboot via the acceptance harness and, even with previously granted consent, performs no GA4 request, no Clarity request, injects no tracker SDK/script, creates no tracker globals/dataLayer/page_view, and leaves semantic `track()` inert;
- normal consented production-mode control session loads both configured analytics SDK paths and emits the manual GA4 page_view;
- normal semantic analytics path is not suppressed by the QA guard;
- Current Program acceptance covers canonical Home + Board consumers and remains independent from Artifact publication;
- mobile/public harmonization matrices include the 390-class mobile behavior;
- route manifest and production artifact release gate pass;
- Board, auth recovery, DC-9 sync, WebKit auth regression and related release regressions pass.

Canonical invariant retained:

`ARTIFACT EXISTS ≠ PROGRAMMING MOMENT`

`current-program-v1.js` remained byte-identical to the pre-Result baseline (`59cd30edcf715bba6c19e7a101a4ca0cc7c5aaf3`) through the Evidence Hygiene implementation boundary.

## 3. Canonical Pages release

Release evidence:

`operations/EVIDENCE_HYGIENE_PAGES_RELEASE_2026-09-17.md`

Canonical workflow:
- `.github/workflows/deploy-pages.yml`;
- run `#119 / 35211118478`;
- attempt `2`;
- final conclusion `SUCCESS`;
- exact production source / deployed build version: `374defbe583fac0839a43611b151d1104b47a42b`;
- deploy job `SUCCESS`;
- Pages artifact id: `10492111474`;
- artifact digest: `sha256:e076fe6c94bb5b009d52d1f2395987b9ad05e2a478d63b875966903087e3ca8a`;
- deployment id: `355b02cde90bbf14706cdff2698573a57c6b0a34`;
- deployed URL: `http://dementor.club/`.

The initial attempt of the same run was blocked only by the pre-existing `github-pages` environment branch allow-list. After `dementor-club-production` was explicitly allowed, only the failed deployment path was retried and the same exact built artifact deployed successfully. No application/runtime/database semantics changed in that correction.

## 4. Live production smoke

TinyFish read-only production run:

`38317605-010b-4172-b1f6-9e0d3b405456`

Observed live after the canonical release:
- Home: PASS;
- Community: PASS;
- `/workspace/board/` guest shell: PASS;
- `/join/`: PASS;
- normal public Activity visible on Home and Community;
- Home canonical Current Program visible with three entries: `ДЕНЬГИ НА ВЕТЕР`, `DEMENTOR LAB`, `ФУЭНХИРОЛА`;
- Board guest surface exposes the expected locked/auth-required shell and Current Program cards;
- no observed JavaScript/runtime errors across the exercised routes;
- normal public Activity rows remained visible after deploy;
- pagination state remained coherent for the currently small live Activity set.

The Community `PEOPLE / CURRENT DEMENTORS` section is **not** used as Current Program evidence. Canonical Current Program evidence comes from Home + Board and the exact automated acceptance.

## 5. TinyFish limitations and reclassification

The TinyFish live smoke is supporting evidence, not the sole proof of analytics semantics.

Reclassification:
- prior smoke check 3 (QA analytics): `UNVERIFIED` as live network interception because TinyFish could not install a pre-navigation init script;
- prior smoke check 4 (normal analytics): `PARTIAL / UNVERIFIED` at live-network level because DOM observation is insufficient;
- prior smoke check 6 (390 viewport): `UNVERIFIED` in TinyFish because that session could not force the viewport;
- prior smoke check 8: Community PEOPLE data removed from Current Program comparison.

A dedicated follow-up TinyFish run `ba927f59-580e-4e58-a0ee-25dedb3b78c5` also returned `UNVERIFIED` for preboot QA network proof because that browser tool could not execute pre-navigation page JS/init scripts. This limitation is preserved, not hidden.

Those TinyFish limitations do not negate closure because the exact deployed-code automated acceptance already proves the programmatic QA/normal analytics behavior and mobile/current-program contracts, while the live smoke proves that the exact canonical Pages release is serving and the principal production surfaces remain healthy.

## 6. Why no controlled production QA Artifact was created

No new QA Artifact was created in production for closure testing.

Reason:
- production backend read-only verification confirms the canonical QA provenance guard and the canonical `qa:%` exclusion predicate are deployed;
- the exact deployed-code browser acceptance includes the controlled QA Artifact fixture and proves differential exclusion across Home / Community / pagination while preserving a normal Artifact;
- creating a throwaway production Artifact solely for QA would add avoidable operational evidence and contradict the Evidence Hygiene goal when no additional semantic mutation is required.

This is evidence layering, not an inference from absence alone.

## Final live conclusion

**PASS_LAYERED_PRODUCTION_EVIDENCE**

Equivalent release statement:

`BACKEND PRODUCTION VERIFIED + EXACT DEPLOYED-CODE AUTOMATED ACCEPTANCE PASS + CANONICAL PAGES EXACT-SHA DEPLOY SUCCESS + LIVE PRODUCTION SMOKE PASS`

No claim is made that live GA4/Clarity network interception itself was repeated after Pages deploy.

This evidence is sufficient to enter G8 cleanup for #201 / Evidence Hygiene v1.
