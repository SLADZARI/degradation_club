---
artifactId: dementor-club.result.evidence-hygiene-v1
project: dementor-club
documentType: RESULT
projectStage: VALIDATION
gate: G6_VALIDATION
status: G6_PASS_AWAITING_MERGE_AUTHORIZATION
version: 0.2
updated: 2026-09-16
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: .weekly-os/results/evidence-hygiene-v1.v0.1.md
---

# MP | Dementor Club | Evidence Hygiene v1 | Result v0.2

## Goal
Отделить QA/internal evidence от реальной editorial/public activity без новой публичной ontology и без изменения product semantics Board / Current Program / Membership.

Invariant:

`QA EVIDENCE ≠ AUDIENCE EVIDENCE ≠ PROGRAMMING MOMENT`

## Candidate
- baseline: `dementor-club-production@0e13e2d1bd2bc5e5245d73759ec0b4a7f61b3fd4`
- integration branch: `result/evidence-hygiene-v1`
- exact G6 head: `0a9687266aa27ea2bd40fa12099052e1308b6ae2`
- validation PR: draft `#216`
- Site Integrity run: `35141615180` → `SUCCESS`
- G6 evidence: `operations/EVIDENCE_HYGIENE_G6_2026-09-16.md`

## Implemented scope
### A. Artifact QA provenance
- existing `dc_artifacts.source_ref` only;
- prospective `qa:` prefix;
- optional `p_source_ref` added to the same canonical `dc_create_artifact_draft_v1` owner;
- OWNER_ADMIN-only QA provenance write guard;
- ordinary Artifact creation remains unchanged when marker is omitted;
- no historical rewrite;
- `provenance_status` unchanged.

### B. Production analytics QA guard
- owner: `production-analytics-v1.js`;
- marker: `sessionStorage["dc_qa_session_v1"]="1"`;
- QA return occurs before consent boot / GA4 / Clarity / page_view / semantic listeners;
- ordinary production analytics behavior preserved.

### C. Public Activity evidence guard
- owner: `dc_public_activity_read_v1`;
- tracked migration excludes `source_ref like 'qa:%'` from public Activity;
- pagination semantics preserved;
- no client-side hiding layer.

### D. Current Program
`current-program-v1.js` unchanged, SHA `59cd30edcf715bba6c19e7a101a4ca0cc7c5aaf3` on both baseline and Result head.

`ARTIFACT EXISTS ≠ PROGRAMMING MOMENT`

### E. Historical evidence rule
No retrospective inference or rewrite.

`pre-cutover evidence may contain QA/internal activity`

## G6 acceptance
PASS on exact head:
- deterministic prospective QA provenance contract exists at Artifact creation owner;
- ordinary Artifact path has no QA marker by default;
- historical rows untouched;
- public Activity excludes QA source evidence at read-model level;
- normal public Activity and pagination pass browser validation;
- QA production analytics is hard-suppressed before external SDK boot;
- normal consented analytics regression passes;
- Current Program unchanged;
- no new public/domain ontology or Artifact taxonomy;
- Membership / DC-9 / Contribution / Programming / Telegram semantics unchanged;
- Full Site Integrity exact-head SUCCESS;
- sequential browser evidence PASS on desktop/mobile Activity and QA/normal analytics.

## Explicit non-goals remain out of scope
- #213 ThingProjection Runtime;
- Programming Decision v1;
- Contribution / Direct Publish;
- FIRST_ARTIFACT activation changes;
- new Activity / History ontology;
- new analytics platform / QA dashboard;
- new Artifact taxonomy;
- historical smoke cleanup;
- Telegram refactor;
- unrelated Board fixes.

## Gate
**G6 PASS / AWAITING EXPLICIT MERGE AUTHORIZATION.**

No merge, backend deploy, Pages deploy, live retest or G8 has been performed.

`G6 PASS ≠ merge ≠ deploy ≠ G8`
