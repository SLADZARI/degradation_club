# Technical Debt

## Local Supabase development stack — GOOD CASE

Status: **good infrastructure case / deferred / not a blocker for the current UI release**

### Why

The project currently uses hosted Supabase on the Free plan. Supabase database branching is not part of the Free plan, so a paid preview branch should not become a required release dependency.

### Preferred long-term workflow

Run a complete local Supabase stack through **Supabase CLI + Docker**:

1. Start local Postgres / Auth / Storage / API services from the repository.
2. Reproduce the current production schema by applying the repository migration history.
3. Apply new migrations locally first.
4. Run database/RLS/function/trigger tests and linting.
5. Run Community smoke cases against the local stack.
6. Apply only validated migrations to hosted production.

### Community cases to cover

- `9 SPHERES → RESULT → IDENTITY → MEMBERSHIP → BOARD → ARTIFACT` remains intact.
- `FIRST_ARTIFACT_REQUIRED → publish first Artifact → MEMBER_ACTIVATED` transition.
- Reaction/response gate before and after activation.
- Artifact media attachment and storage contract.
- Distribution outbox remains independent from publication success.
- Board position backfill for existing Artifacts.
- Automatic position creation for newly published Artifacts.
- Owner-only Artifact movement and stale-position conflict handling.
- Telegram worker/outbox integrations are not silently affected by schema changes.

### Outcome

This should become the normal migration QA path for Dementor Club because it is reproducible, free of hosted branching costs, does not consume hosted project quota, and allows destructive/resettable database testing without touching production.

This item is intentionally deferred from the current Board UI release and should be implemented as infrastructure work in the technical/workflow layer (`main`).
