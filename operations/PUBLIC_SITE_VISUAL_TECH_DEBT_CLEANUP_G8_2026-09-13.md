---
artifactId: dementor-club.evidence.public-site-visual-tech-debt-cleanup-g8-2026-09-13
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: APPROVED_EVIDENCE
updated: 2026-09-13
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
result: dementor-club.result.public-site-visual-tech-debt-cleanup-v1
---

# Public Site Visual Tech-Debt Cleanup v1 — G8 closure evidence

## Release evidence

Validated candidate: `bf8156f0c8934aabfd062b6a2def3910c3921e44`.

Full Site Integrity / Release Readiness #1026 / run `34720030176` — PASS.

Production merge commit: `43b6dcaa11292f49564c989add219e0b095fbf8d`.

Deploy Dementor Production #64 / run `34720912365` — SUCCESS.

Build logs confirm checkout of `dementor-club-production` and `git log -1` = `43b6dcaa11292f49564c989add219e0b095fbf8d`.

Pages artifact: `10305384132`.

Artifact digest: `sha256:ce4324fd48037817c7a5c188104611edde913477339106234bc1a890699905b2`.

Project owner live smoke after deploy: PASS. Client preview status: READY.

## G8 inventory

### Stale PR / branch state

- PR #155 is merged and is the canonical released implementation for this Result.
- PR #144 from `agent/public-site-visual-tech-debt-cleanup-v1` was still open after supersession. It is now explicitly CLOSED as `G8 RETIRED / SUPERSEDED — DO NOT MERGE`.
- `agent/public-site-visual-tech-debt-cleanup-v1` is retired historical state only.
- `agent/public-site-visual-tech-debt-cleanup-v1-refresh` is the merged historical integration branch only.
- neither branch remains the project active integration owner after this Result closes.

The physical Git refs may remain as history; semantic/current ownership is retired and no open release PR remains for them.

### Compatibility / temporary layers

The released Result did not introduce a new compatibility CSS owner.

The existing Home/Fuengirola compatibility declarations in `ink-layout-v2.css` / `ink-layout-v2-tuning.css` remain intentionally retained because G6 experiments proved they still participate in accepted geometry. Their physical migration/deletion is explicitly deferred to a separately scoped geometry refactor with browser evidence.

This retained compatibility is not treated as a temporary flag introduced by this Result and must not be removed opportunistically.

### Ownership cleanup

The released implementation narrows active Ink runtime ownership to Home Hero + About + Logic and retires obsolete Community/Fuengirola runtime injection where canonical presentation already exists.

Merch runtime ownership is canonicalized around visible SKU `SH-DEM-01..04`; positional card mapping is not the owner.

No Board, Membership/DC-9, Workspace/auth, Supabase, Telegram worker/outbox or workflow ownership was added by this Result.

### Stale QA/status cleanup

Project kernel and Artifact Index were updated after deploy #64 to point at exact production commit, workflow run, Pages artifact/digest, owner live smoke and CLIENT PREVIEW READY state.

No production/deploy authorization is carried forward to unrelated future Results.

## G8 conclusion

This Result has sufficient evidence for closure:

- release validated;
- exact production commit deployed;
- owner live smoke PASS;
- stale open PR retired;
- historical branches no longer own active integration;
- retained compatibility is explicitly classified and deferred rather than accidentally duplicated;
- kernel pointers are current.

`dementor-club.result.public-site-visual-tech-debt-cleanup-v1` may move to APPROVED / completed history.

This closure does not approve any new Board UX work and does not promote the DRAFT public visual harmonization reference to project-wide DESIGN authority.
