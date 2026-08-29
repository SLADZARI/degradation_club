# Dementor Club QA Preview Deployment v1

Status: INFRA_READY / CREDENTIAL_BLOCKED
Effective: 2026-08-30
Branch: `dementor-club-qa`

## Purpose

Provide an isolated browser-testable QA preview without touching `dementor.club` or `dementor-club-production`.

## Implemented

- dedicated QA artifact builder: `scripts/build-qa.mjs`;
- dedicated workflow: `.github/workflows/deploy-qa-preview.yml`;
- workflow runs on pushes to `dementor-club-qa` and by manual dispatch;
- registry/routes, content readiness and visual contract validations run before packaging;
- QA artifact is uploaded to GitHub Actions for seven days;
- deployment target is a separate Vercel project named `dementor-club-qa` in scope `sharecraftwideo-5699s-projects`;
- production CNAME and production-only hardening are not applied to QA artifact;
- `/design-system/*` and other QA-only tools may remain present according to `qa/QA_ENVIRONMENT_POLICY_v1.md`.

## Current blocker

The connected Vercel team currently contains no project and the repository does not have a `VERCEL_TOKEN` Actions secret.

First workflow run:
- run `#1` / GitHub Actions run `33281229659`;
- validation: PASS;
- QA artifact build: PASS;
- QA artifact upload: PASS;
- Vercel credential gate: FAIL (`VERCEL_TOKEN` absent);
- Vercel deploy: not executed.

The parallel `Production Candidate Integrity` run `#399` for the same commit passed successfully.

## Required one-time connection

Add a repository or protected QA-environment Actions secret named `VERCEL_TOKEN` with a Vercel token that can create/deploy projects inside the `sharecraftwideo-5699s-projects` scope.

Do not put the token in source files, issues, commit messages, chat transcripts, or public configuration.

After the secret exists, rerun the failed QA workflow or push a new QA commit. The workflow will create/link the isolated `dementor-club-qa` project and deploy `_qa_site` as a Preview deployment.

## Release boundary

This workflow must never deploy with `--prod`, must never mutate `dementor-club-production`, and must never attach `dementor.club` to the QA project.

Production remains blocked until Browser Interaction QA passes and release approval is explicit.
