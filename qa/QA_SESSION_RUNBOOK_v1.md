---
artifactId: dementor-club.runbook.qa-session
project: dementor-club
documentType: RUNBOOK
projectStage: BUILD
gate: G6_VALIDATION
status: DRAFT
version: 0.1
updated: 2026-08-31
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
---

# Dementor Club — QA Session Runbook

Use with the QA preview built from `dementor-club-qa`.

## Rule

During the discovery pass: do not fix while walking. Capture first, normalize/deduplicate second, implement third.

## Reviewer workflow

For every issue, provide only:

1. where you are;
2. what you did;
3. what happened;
4. what should happen;
5. screenshot.

The QA HUD supplies route/surface/block/viewport/build context. Use `Inspect block` when the screenshot needs a more precise block label, then `Copy QA context` if text context is useful.

## Screenshot naming

Preferred sequential ID:

`DCQA-001.png`, `DCQA-002.png`, ...

Do not create nested folders by bug category. Classification belongs in the QA register.

## Critical traversal order

### A. Promotion/public path

1. `/`
2. `/about/`
3. promoted project/event/course/profile URLs if used in campaign
4. `/join/`
5. relevant CTA destination
6. social preview / OG check for the exact advertising URL

### B. Anonymous → authenticated

1. anonymous navigation
2. join/auth initiation where currently active
3. `/auth/callback/`
4. session restoration after reload
5. `/profile/`
6. `/workspace/`

### C. Member/community path

1. `/community/`
2. current membership state rendering
3. first Artifact gate where applicable
4. Artifact creation/publish
5. reaction/response permissions before/after activation
6. Board position/movement where implemented
7. persistence after reload

### D. Integration regression

1. Telegram-triggering action if present in current runtime
2. publication success independent from distribution/outbox failure
3. no duplicate visible action caused by retry
4. no user-facing secret/debug payload

## Required viewports

- 360 px
- 390 px
- 768 px
- 1024 px
- 1440 px

For broad traversal, 390 + 1440 are the primary passes. Use the full matrix on promoted public surfaces and any page with a responsive finding.

## Stop / escalation conditions

Stop implementing a finding and mark it as semantic review / Change Proposal candidate when the fix requires:

- new or redefined member/application state;
- changed role/permission meaning;
- changed entity ownership;
- changed approved core flow;
- changed data ownership/auth boundary;
- conflicting authoritative behavior.

Do not invent a state to make an interaction easier to implement.

## Session close

At the end of a traversal, produce:

- count of raw findings;
- normalized QA register;
- duplicate/root-cause groups;
- P0/P1/P2/P3 counts;
- blockers;
- Change Proposal candidates;
- next implementation batch;
- untouched areas requiring another traversal.
