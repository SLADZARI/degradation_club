# QA-INFRA-0003 — Vercel QA preview credential missing

Status: OPEN
Type: INFRASTRUCTURE
Severity: P1 for collaborative pre-ad QA; not a production defect by itself
Observed: 2026-08-31
Branch: `dementor-club-qa`

## FACT

GitHub Actions run `33379839955` completed all registry/content/visual validation and the `Build QA preview artifact` step successfully.

The run then failed at `Require Vercel QA credential`; the isolated QA project/deploy steps were skipped.

## Impact

The QA artifact exists and builds, but the team does not receive the intended isolated Vercel QA URL from this workflow. This blocks the preferred shared browser walkthrough with the QA HUD until the credential/deployment path is restored or an equivalent isolated preview path is used.

## Boundary

Do not solve this by deploying the QA branch to `dementor.club` or by weakening production release controls.

## Resolution criteria

- isolated QA preview deployment succeeds;
- preview URL is produced by the QA workflow or equivalent approved isolated QA path;
- QA HUD is visible in the generated QA preview;
- production domain/branch remains untouched.

## Evidence

- workflow: `Deploy Dementor QA Preview`
- run: `33379839955`
- failing step: `Require Vercel QA credential`
