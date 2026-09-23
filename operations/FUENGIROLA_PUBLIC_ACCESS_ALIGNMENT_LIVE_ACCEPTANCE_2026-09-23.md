---
artifactId: dementor-club.operations.fuengirola-public-access-alignment-live-acceptance-2026-09-23
project: dementor-club
documentType: EVIDENCE
projectStage: BUILD
gate: G8_CLEANUP
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

# Fuengirola Public Access Alignment · owner live acceptance

Exact production:

`df8a24eca2bcca25339f128c7da93982515cf442`

Pages:

`Deploy Dementor Production #134 / 35885907613 · SUCCESS`

Exact Pages head SHA:

`df8a24eca2bcca25339f128c7da93982515cf442`

Owner human live retest:

- public Events route works — PASS;
- Fuengirola opens directly — PASS;
- confirmed Event information is visible — PASS;
- legacy Membership / Join Event gate is absent — PASS;
- no Event-owned Join CTA — PASS;
- registration remains disabled — PASS;
- mobile behavior works — PASS;
- desktop behavior works — PASS.

Owner statement:

`всё проверил — работает`

Conclusion:

`BQA-10 LIVE ACCEPTANCE = PASS`

No Supabase / schema / RPC / RLS mutation was required.
