---
artifactId: dementor-club.result.dc9-membership-semantic-integrity-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G3_BUILD
status: ACTIVE
version: 0.1
updated: 2026-09-08
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
supersedes: null
---

# MP | Dementor Club | BUILD | DC-9 / Membership Semantic Integrity v1 | v0.1

## Goal
Remove semantic and state-integrity drift between DC-9 local state, account sync, sphere identity, first-complete baseline, application gate, membership validity, Interest Map server invariants and Supabase client ownership without changing the approved Membership lifecycle.

Protected boundary:

`AUTHENTICATION ≠ DC9 COMPLETE ≠ APPLICATION ≠ MEMBERSHIP`

## Status
**ACTIVE / G3 BUILD**

Implementation branch: `agent/dc9-membership-semantic-integrity-v1`  
Production baseline: `dementor-club-production` @ `a9511a271fbb3524c486c2a9ecd0dc8a3ff22380`  
Canonical QA ledger: `operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md`  
Implementation specification: `operations/QA_DC9_MEMBERSHIP_SEMANTIC_INTEGRITY_2026-09-08.md`  
Path/safety map: `operations/QA_DC9_MEMBERSHIP_PATH_MAP_2026-09-08.md`  
Handoff entry point: `operations/QA_EXTERNAL_DEVELOPER_PACKAGE_2026-09-08.md`

## QA cluster
This Result owns the coherent fix cluster `QA-MEM-035…042`:
1. account sync must not destroy partial DC-9 drafts/state;
2. `self-development` must canonicalize to `self_development` before persistence/source-key generation;
3. application and entry-status 9/9 decisions must consume the canonical immutable first-complete baseline primitive rather than duplicate server semantics;
4. Interest Map invariants must be enforced by the backend, not only UI;
5. active membership decisions must honor `valid_from/valid_to` through the canonical membership-active primitive;
6. Join compatibility routing must use the shared base-path model instead of raw `/join` assumptions;
7. one canonical Supabase client must own the browser session; account sync must not replace it;
8. G6 must gain executable contracts for sync integrity, semantic authority and affected authenticated browser flows.

## Existing-before-new constraints
Do not create:
- a new membership lifecycle or membership state;
- a new DC-9 engine/version merely to fix these bugs;
- a new assessment/baseline/application/profile table when existing canonical owners can be extended;
- a second auth/session provider;
- a second route/base-path system;
- a second Interest Map domain model;
- a new Board/Workspace mechanism.

Use existing canonical primitives first, including where applicable:
- `canonicalSphereId()`;
- `community-runtime-v1.js` client/runtime ownership;
- `dc_first_complete_baseline_v1()`;
- `dc_membership_active()`;
- existing `assessment_runs`, application and Workspace/Board owners.

## Acceptance criteria
- partial DC-9 progress survives login/sync and can restore from remote state;
- unknown forward-compatible local state is not silently erased by merge;
- new server persistence never emits legacy `self-development` identity/source keys;
- first 9/9 baseline remains immutable through later repeats;
- Application gate and Member Entry Status use one canonical first-complete completion meaning;
- wrong assessment version cannot satisfy canonical DC-9 9/9;
- invalid Interest Map JSON/keys/values/total are rejected server-side;
- expired/future memberships are not misclassified as active;
- Header / Application / Workspace / Board membership meaning remains consistent;
- browser runtime uses one Supabase client instance;
- `/degradation_club/join/` compatibility does not bypass storage guards while canonical production URLs remain root-based;
- Chromium + WebKit + static/SQL contracts pass in the existing G6 workflow;
- no live Supabase migration, production merge or deploy occurs without separate authorization.

## Release boundary
Implementation may create a migration file in this branch/PR. That does **not** authorize applying it to live Supabase.

`commit ≠ merge ≠ database release ≠ deploy`.

## Gate
Current: **G3_BUILD**.
