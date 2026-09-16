# Evidence Hygiene v1 — Pages control-plane incident / cleanup observation

Date: 2026-09-17
Issue: #201
Result: `dementor-club.result.evidence-hygiene-v1`
Gate: `G7_RELEASE`

## Incident
An accidental manual Pages release was triggered from the legacy/default-branch workflow:

- workflow path: `.github/workflows/deploy-production.yml`
- workflow name: `Deploy Dementor Production`
- run: `#88 / 35153987885`
- event: `workflow_dispatch`
- workflow control-plane branch: `main`
- run conclusion: `SUCCESS`

The workflow itself explicitly checked out `dementor-club-production`, and the build log proves the checked-out production SHA was:

`b68cd84bd284e599f3adcce46659e4654e23d05d`

Therefore no `main` application code was deployed by this accidental run.

The legacy run uploaded Pages artifact:
- artifact id: `10470551302`
- digest: `sha256:981a117efb423e4392622f53380e83e104e711bc40ec766ba4b95922c2595927`

## Classification
This is a release control-plane / ownership duplication incident, not an Evidence Hygiene product-semantic regression.

Canonical Pages owner for the current release is:

`.github/workflows/deploy-pages.yml`

The accidental legacy run is not accepted as canonical #201 Pages release evidence because its workflow did not execute the current canonical validation sequence.

## Cleanup observation
Duplicate/legacy Pages workflow ownership must not remain implicit. It is recorded as a G8 cleanup observation.

No additional release-architecture mutation is authorized by this evidence artifact. If final retirement or redesign of legacy workflow ownership requires an architecture/change decision, it must be handled as a separate follow-up rather than silently redefining canonical release ownership inside #201.

## Current release boundary
The corrective candidate `234ee1f67a9b579a1c50caec5a701f54d01d3774` was validated in Site Integrity `#1198 / run 35159581757 / SUCCESS` and merged through PR #217 to production commit `e8c8a1e3cac8aaf83e03696de8facd8167a29255`.

Only the canonical `.github/workflows/deploy-pages.yml` release from that exact production SHA is acceptable for the next #201 Pages release step.
