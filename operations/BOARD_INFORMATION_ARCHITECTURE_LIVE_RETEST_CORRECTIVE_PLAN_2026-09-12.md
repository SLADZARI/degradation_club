# Board Information Architecture v1 — live retest corrective plan

Status: implementation prepared / validation pending.

Scope is limited to QA-BOARD-LIVE-001 discovered in the first production live retest after deploy #57.

Corrective diff:
- `community/artifact/artifact.js`: safe minimal emphasis renderer for stored `**bold**` syntax; escape first, then add only `<strong>` wrappers.
- `scripts/validate-board-batch-a-contract.mjs`: regression assertions that the formatter exists, escapes before rendering markup, and is used by Artifact detail.
- `operations/BOARD_INFORMATION_ARCHITECTURE_LIVE_RETEST_2026-09-12.md`: screenshot-grounded evidence.

No database, RLS, worker, membership, role, lifecycle, route, spatial ownership or Telegram state-machine changes are included.

Required before production correction:
1. corrective PR against `dementor-club-production`;
2. full Site Integrity / Release Readiness PASS;
3. explicit production corrective deploy authorization;
4. post-deploy Artifact detail retest confirming literal `**` no longer appears.
