---
artifactId: dementor-club.operations.supabase-observed-production-compatibility-overlay-v1
project: dementor-club
documentType: IMPLEMENTATION_CONTRACT
projectStage: BUILD
gate: G5_BUILD
status: APPROVED
version: 1.0
updated: 2026-09-24
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: VALIDATION_COMPATIBILITY_STATE
result: dementor-club.result.artifact-collaboration-v1
integrationBranch: result/artifact-collaboration-v1
liveDatabaseMutationAuthorized: false
productionMergeAuthorized: false
productionDeployAuthorized: false
---

# Supabase Observed Production Compatibility Overlay v1

## Purpose

This local-only overlay gives G5 validation an accurate observed-production target without changing historical migrations, production data, or production meaning.

Canonical local validation chain:

```text
PREHISTORY REPLAY FIXTURE
→ tracked migrations through 20260921134959
→ OBSERVED PRODUCTION COMPATIBILITY OVERLAY
→ exact observed production structural fingerprint
→ Artifact Collaboration migration
```

This artifact is **VALIDATION_COMPATIBILITY_STATE** only.

It is not semantic authority, not a production repair, not a new migration, and not approval to replace tracked history with live drift.

## Frozen input evidence

Pre-overlay tracked replay:

```text
parts = 1292
md5   = 55e1ea1b2484f4d4516f47c06313f27b
```

Observed production baseline:

```text
parts = 1291
md5   = beb6fcdf35c889bfa37fd1d725507b7e
```

The exact set difference is limited to:

- 10 function definitions;
- production form of `public.dc_merch_items.dc_merch_public_read`;
- absence of `public.join_applications.join_applications_auth_insert`.

No table, column/default, constraint, index, enum, table-RLS-state, or trigger difference is part of this overlay.

## Exact local-only files

`supabase/bootstrap/production-compatibility/01_observed_production_functions.sql`

Contains exact read-only `pg_get_functiondef` captures for:

- `public.dc_admin_board_hide_artifact_v1`
- `public.dc_admin_promote_artifact_telegram_v1`
- `public.dc_admin_resolve_delivery_unknown_v1`
- `public.dc_admin_suppress_artifact_telegram_v1`
- `public.dc_distribution_claim_pending_v1`
- `public.dc_guest_board_interest_toggle_v1`
- `public.dc_member_entry_status_v1`
- `public.dc_publish_artifact_v1`
- `public.dc_set_artifact_activity_v1`
- `public.dc_submit_membership_application_v2`

`supabase/bootstrap/production-compatibility/02_observed_production_policies.sql`

Contains only:

- production form of `dc_merch_public_read`: `USING (public_visible = true)`;
- removal of `join_applications_auth_insert`.

## Artifact Collaboration ownership boundary

Artifact Collaboration intentionally `CREATE OR REPLACE`s exactly three of the ten observed-production functions:

- `dc_distribution_claim_pending_v1`;
- `dc_guest_board_interest_toggle_v1`;
- `dc_publish_artifact_v1`.

After Artifact Collaboration applies, those three must reflect the Artifact Collaboration migration.

The other seven observed-production function definitions must remain unchanged by Artifact Collaboration.

The unrelated production-drift policies must remain compatible after Artifact Collaboration:

- `join_applications_auth_insert` remains absent;
- `dc_merch_public_read` remains `public_visible = true` only.

## Ephemeral materialization

The overlay files must never be committed into `supabase/migrations/`.

The validator may materialize them only inside its temporary local replay workspace as:

`20260924002459_observed_production_compatibility_overlay.sql`

That ephemeral migration sorts after tracked production history and before:

`20260924002500_artifact_collaboration_v1.sql`.

## Hard guard

Artifact Collaboration validation may proceed only if overlay application produces exactly:

```text
1291|beb6fcdf35c889bfa37fd1d725507b7e
```

Do not weaken or tune this fingerprint.

## Boundaries

```text
LIVE SUPABASE APPLY = NO
REMOTE SQL MUTATION = NO
DB PUSH = NO
LINKED RESET = NO
PAID INFRASTRUCTURE = NO
HISTORICAL MIGRATION EDIT = NO
PRODUCTION MERGE = NO
PRODUCTION DEPLOY = NO
```

Production access for this overlay is read-only catalog observation only.

Reconciliation of tracked history versus live production drift is a separate future task outside Artifact Collaboration v1.
