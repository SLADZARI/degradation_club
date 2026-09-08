---
artifactId: dementor-club.result.board-access-control-v2
project: dementor-club
documentType: RESULT
projectStage: RELEASE
gate: G7_RELEASE
status: WAITING
version: 0.4
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: 0.3
---

# MP | Dementor Club | RELEASE | Board Access Control v2 | v0.4

## Goal
Harmonize the Community Board permission model from authenticated Guest through Owner Admin and complete first-Artifact Member interaction and Owner Admin authority gaps without parallel Board, membership, layout, composer or storage systems.

## Current status
**WAITING / RELEASED TO PRODUCTION / PARTIAL LIVE RETEST EVIDENCED / RESIDUAL ROLE QA REGISTERED / NOT CLOSED**

This Result is intentionally removed from `currentResult` so the higher-priority DC-9 / Membership semantic-integrity defects can become the single active implementation Result. This transition does **not** claim full Board live validation and does **not** mark the Result DONE/CLOSED.

## Production evidence
Original Board Access v2 release:
- integration PR: `#133`;
- production commit: `f74eeb7267e664ed61f6bc3ad08ebe3e6191c0a5`;
- G6: Site Integrity / Release Readiness `#869` — PASS;
- live Board migrations applied;
- initial production deploy complete.

G7 corrective discovered during human production QA:
- canonical spatial `data-mine` / `focusMine()` already existed;
- fullscreen CSS hid the control;
- existing Board v2.1 contract also protected that hidden state;
- corrective PR `#135` restored the existing own-Artifact locator instead of adding a second navigation/camera/filter system;
- when an own live Artifact exists, `МОЁ` is visible;
- if the active canonical filter hides Member cards, `МОЁ` first asks the existing filter owner to reveal Member cards and then calls the existing `focusMine()`;
- legacy slot control remains hidden.

Corrective production evidence:
- corrective G6: Site Integrity / Release Readiness `#873` — PASS across Board contracts, Chromium/WebKit Board matrix, shell, My Artifacts, auth, routes and release guard;
- corrective production commit: `a9511a271fbb3524c486c2a9ecd0dc8a3ff22380`;
- fresh deploy workflow: `Deploy Dementor Production #47`;
- deploy run id: `34220090345`, attempt `1`, conclusion `success`;
- build checkout ref: `dementor-club-production`;
- resolved checkout commit: `a9511a271fbb3524c486c2a9ecd0dc8a3ff22380`;
- Pages artifact id: `10053362035`;
- artifact digest: `sha256:c24dc7ebe5e781eba795748fce11a9c834255e242525a734d8625e84fabfb241`;
- build + deploy jobs: SUCCESS.

## Human live evidence — 2026-09-08
On production `/workspace/board/` the project owner confirmed:
- own Member Artifact was successfully published and remained present;
- `ОТ ЛЮДЕЙ` exposed Member Artifact cards;
- `К ЖИЗНИ` fitted visible cards into view;
- `МОЁ ОБЪЯВЛЕНИЕ` opened the own Artifact detail panel;
- after corrective deploy the `МОЁ` locator appeared and worked, eliminating the observed "published but cannot find it" failure.

The specific G7 defect discovered in this session is therefore fixed and live-confirmed.

## Residual live QA — still open
The following role/state checks have G6 fixture/browser evidence but were not all re-confirmed under real production identities in this session:
1. authenticated Guest states 2–4: read/pan/zoom/open/react/respond; create gated; no move/close;
2. `MEMBER_NOT_ACTIVATED`: reaction/response before first Artifact while spotlight remains;
3. Owner Admin: canonical create plus move/archive of another Member Artifact; ordinary Member negative authority;
4. mobile 360/390 production interaction and 75vw card ceiling;
5. live drag/reload persistence confirmation for own-card movement.

These items remain QA debt and must stay visible in the canonical QA process. They are not evidence for a DONE/VALIDATED claim.

## Why Result is parked
The released Board code has complete G6 evidence, deploy provenance, live confirmation of the newly found own-Artifact navigation defect, and no active implementation branch is required for the remaining role-state retests. Keeping it as the sole `currentResult` would block a higher-priority P0/P1 data-integrity cluster without improving Board implementation safety.

Therefore:
- Board Result status becomes **WAITING** at G7;
- no further Board code work is authorized by this transition;
- residual live QA stays open;
- G8/closure can be resumed after the priority integrity Result or when the required production role identities are available.

## Gate
Current: **G7_RELEASE / WAITING**.

Not DONE. Not fully live validated. Not G8 closed.
