---
artifactId: dementor-club.operations.fuengirola-public-access-alignment-g6-2026-09-23
project: dementor-club
documentType: EVIDENCE
projectStage: BUILD
gate: G6_VALIDATION
status: APPROVED
version: 1.0
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentIssue: 228
scope:
  - BQA-10
  - Fuengirola public access alignment
---

# Fuengirola Public Access Alignment · G6

Production base:

`7827a4d5e8bee21c142390a9e9ea78e4542e1ee9`

Validated candidate:

`a63768c391eabd102c1dac1e9c123fc5c7b5b260`

PR:

`#242 · DRAFT / UNMERGED`

Site Integrity / Release Readiness:

`#1258 / 35882072137 · SUCCESS`

Exact production → candidate diff:

1. `content/events/fuengirola.json`
2. `events/fuengirola/index.html`
3. `events/index.html`
4. `scripts/validate-public-harmonization-browser.mjs`
5. `scripts/validate-site.mjs`
6. `scripts/validate-visual-contract.mjs`

Acceptance covered:

- Fuengirola listing no longer exposes DETAILS AFTER JOIN;
- Event detail exposes confirmed PLANNED facts directly;
- Event-owned Join CTA absent;
- registration remains disabled;
- no booking/waitlist/payment CTA invented;
- implementation mirror no longer carries legacy `access` / `ctaLabel`;
- 1440 / 1024 / 768 / 390 / 360 public browser matrix PASS;
- 390 + 360 two-tap Events path PASS;
- Current Program / Board / ThingProjection untouched;
- route / visual / site / release validators PASS.

Schema / RPC / RLS / Supabase:

`NOT REQUIRED`
