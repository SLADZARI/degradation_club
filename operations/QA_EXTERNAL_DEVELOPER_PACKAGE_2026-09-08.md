# Dementor Club — External Developer QA Handoff Package

Status: **HANDOFF / QA IMPLEMENTATION PACKAGE / NO DEPLOY AUTHORIZATION**  
Prepared: **2026-09-08**  
Repository: `SLADZARI/degradation_club`

## Purpose

This is the single entry point to hand to an external developer or their LLM for the current DC-9 / Membership semantic-integrity bug cluster.

The package is intentionally attached to the existing QA process. It does **not** create a second QA system, a second membership model, a second DC-9 engine, a second auth owner, or a second release flow.

## Read in this order

1. `.weekly-os/PROJECT.json` on branch `dementor-club`
2. `.weekly-os/ARTIFACT_INDEX.json` on branch `dementor-club`
3. `.weekly-os/APPROVED_STATE.json` on branch `dementor-club`
4. `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md` on branch `dementor-club` — canonical QA ledger
5. `operations/QA_DC9_MEMBERSHIP_SEMANTIC_INTEGRITY_2026-09-08.md` — findings + complete implementation specification
6. `operations/QA_DC9_MEMBERSHIP_PATH_MAP_2026-09-08.md` — exact code/SQL/test/release paths and do-not-touch rules
7. Current Result referenced by `.weekly-os/PROJECT.json`
8. Only then inspect implementation on the current `dementor-club-production` baseline.

## Critical repository rule

`dementor-club-site` is **not** a safe release base for this work.

At handoff preparation time:
- semantic source branch: `dementor-club`;
- semantic source HEAD: `3714fce66703258234ea5ea8ab8a84d46c4c73dd`;
- production branch: `dementor-club-production`;
- production HEAD: `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`;
- audited `dementor-club-site` HEAD: `7a036ba4cd7ccd635ba273931c2087227d0f4c94`;
- `dementor-club-site` and `dementor-club-production` have divergent history.

**Before coding, re-read the current production HEAD. Do not assume the SHA above is still current.**

Implementation must start from the then-current `dementor-club-production` baseline and carry only the explicit Result diff.

## Protected product meaning

Do not change this boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

Approved local rules also include:
- DC-9 may be completed without mandatory login;
- login is required before application;
- application is available after canonical 9/9;
- 9/9 does not create membership;
- membership starts only after review/acceptance;
- the first complete DC-9 is an immutable baseline;
- later attempts do not overwrite that baseline.

If a proposed fix changes any of those meanings, stop and request a Decision/Change Proposal. Do not implement it as a refactor.

## Work authorization boundary

This package authorizes analysis and preparation of a fix branch/PR for the listed QA findings. It does **not** authorize:
- direct writes to `dementor-club-production`;
- merge to production;
- live Supabase DDL/migration application;
- production deploy;
- rewriting historical user/application data;
- creating new membership/DC-9/profile/application entities without an explicit decision.

`commit ≠ merge ≠ database release ≠ deploy`.

## Required implementation shape

Treat the bug cluster as one coherent Result candidate:

`dementor-club.result.dc9-membership-semantic-integrity-v1`

Recommended implementation branch name:

`agent/dc9-membership-semantic-integrity-v1`

Do not mix unrelated Board, design, merch, events, content, or public-site work into this branch.

## Required delivery from the external developer

Return:
1. root-cause confirmation for each QA finding;
2. exact changed-file list;
3. migration file(s), if required, committed but **not applied live**;
4. new/extended executable QA contracts;
5. browser-test evidence for partial DC-9 → login/sync and cross-device recovery;
6. SQL test evidence for 9/9, membership validity and Interest Map validation;
7. full Site Integrity / Release Readiness result;
8. PR from a clean current production baseline;
9. explicit list of remaining compatibility/dead-code items for G8 cleanup.

## Stop conditions

Stop implementation and report the conflict if:
- `PROJECT.json`, `ARTIFACT_INDEX.json`, approved local decisions and production runtime disagree on product meaning;
- a fix requires a new state/table/profile/application/auth system where an existing owner exists;
- the current production baseline changed materially during the work;
- a live DB mutation appears necessary before G6 evidence exists;
- the only way forward seems to be merging `dementor-club-site` wholesale into production.

## Package files

- Canonical ledger: `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`
- Full task: `operations/QA_DC9_MEMBERSHIP_SEMANTIC_INTEGRITY_2026-09-08.md`
- Path/safety map: `operations/QA_DC9_MEMBERSHIP_PATH_MAP_2026-09-08.md`

Start with the full task, then use the path map before touching code.