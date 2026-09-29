---
artifactId: dementor-club.operations.global-header-bootstrap-stability-live-acceptance-2026-09-29
project: dementor-club
documentType: VALIDATION_EVIDENCE
projectStage: RELEASE
gate: G7_RELEASE
status: PASS
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_EVIDENCE
result: dementor-club.result.global-header-bootstrap-stability-v1
productionCommit: fd184be3306911c4ddb6acbcb77acdd977ea84f8
pagesRun: 136
pagesRunId: 36580299418
---

# Global Header Bootstrap Stability v1 — live acceptance

## Live production observation

After canonical Pages deployment #136 of exact production SHA
`fd184be3306911c4ddb6acbcb77acdd977ea84f8`,
the owner performed the requested live checks on `dementor.club`.

Owner confirmation:

```text
да все работает - проверил
```

This confirmation was given against the explicit acceptance checklist covering:

- desktop canonical Header;
- exactly one public Header;
- CTA and public navigation;
- guest login state;
- navigation + refresh without duplicate Header;
- mobile Header;
- mobile burger open/close;
- mobile 390/360 behavior;
- authenticated identity state;
- identity → Workspace;
- Public Header remaining above Workspace;
- repeated refresh/bootstrap without Header disappearance or duplication.

## Verdict

```text
desktop live acceptance     PASS
mobile live acceptance      PASS
auth/identity live acceptance PASS
duplicate Header regression PASS
bootstrap disappearance     PASS
```

The exact deployed artifact browser smoke had already passed before this owner live observation.

Therefore:

```text
LIVE DOMAIN ACCEPTANCE = PASS
G8 MAY PROCEED
```
