---
artifactId: dementor-club.result.catalog-release-truth-v1
project: dementor-club
documentType: RESULT
projectStage: BUILD
gate: G5_BUILD
status: DRAFT
version: 0.1
updated: 2026-09-17
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: IMPLEMENTATION_AUTHORITY
issue: 202
integrationBranch: result/catalog-release-truth-v1
productionBaseCommit: 23d4266a4009d34042b29ec1fb73fb0cbad6b62e
activationAuthorized: true
implementationStartAuthorized: true
productionMergeAuthorized: false
productionDeployAuthorized: false
liveDatabaseMutationAuthorized: false
---

# Catalog / Release Truth v1

**STATUS: ACTIVE / G5 BUILD**  
**ISSUE:** #202  
**INTEGRATION BRANCH:** `result/catalog-release-truth-v1`  
**PRODUCTION BASELINE:** `23d4266a4009d34042b29ec1fb73fb0cbad6b62e`

## Goal

Remove stale-truth behavior from the public Catalog and production release-status documentation without creating a universal registry, second Product authority, or new deployment-status owner.

## Existing owners to preserve

- Program/Event facts remain owned by their existing canonical sources and runtime representation.
- Projects retain project-specific source authorities; absence from `dc_entities` is not absence of Project identity.
- Merch/Wear facts remain owned by the merch source/runtime; unresolved #199 facts must not be reasserted by Catalog.
- Deployment truth is GitHub Actions / release evidence, not `.github/production-release.txt`.
- Catalog remains a secondary provenance/navigation surface only.

## G5 scope

1. Remove hard volatile Catalog totals/counts and live-looking status labels that can drift from source owners.
2. Preserve Catalog rows as provenance/navigation only; do not infer Product state from Catalog.
3. Ensure project-specific identities are not filtered through `dc_entities`; include approved public Project routes independently of DB presence where already proven.
4. Replace `.github/production-release.txt` current-status semantics with an explicit non-authoritative pointer to GitHub Actions / recorded release evidence.
5. Add static/build validation that prevents Catalog from reintroducing hard counts/live-status authority and prevents release marker from claiming current pending/deployed state.

## Explicit non-goals

- no universal Thing/entity registry;
- no `dc_entities` expansion for Projects;
- no #199 merch source-truth decision;
- no #204 Fuengirola eligibility decision;
- no #214 activation/contribution decision;
- no Board IA / Relations work;
- no membership/auth changes;
- no database migration;
- no production merge or deploy.

## Acceptance before G6

- `/catalog/` contains no hard global/category counts presented as current truth;
- Catalog status column no longer asserts volatile lifecycle/readiness states owned elsewhere;
- approved public Project identity does not depend on a `dc_entities` row to appear in Catalog navigation;
- unresolved merch entries do not claim live/current status;
- `.github/production-release.txt` explicitly states it is not current deployment truth and points to GitHub Actions / release evidence;
- build/release guard fails if stale current-status semantics or legacy hard Catalog counts are reintroduced;
- route integrity for every Catalog link remains intact;
- no unrelated semantic or runtime owner is introduced.
