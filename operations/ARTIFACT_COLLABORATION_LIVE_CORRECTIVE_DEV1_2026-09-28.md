# DEV1 — Artifact Collaboration live corrective · Board invitation + freshness

## Authority

Read first:

```text
.weekly-os/PROJECT.json
.weekly-os/ARTIFACT_INDEX.json
.weekly-os/APPROVED_STATE.json
operations/QA_RECONCILIATION_2026-09-28.md
.weekly-os/results/artifact-collaboration-v1.v1.8.md
operations/MEMBERSHIP_V2_PRODUCTION_FLOW_QA_2026-09-02.md
```

Current Result:

`dementor-club.result.artifact-collaboration-v1`

Current Gate:

`G5_BUILD`

Active integration branch:

`result/artifact-collaboration-v1-live-ux-corrective`

Exact base:

`260c5fe911fb0cad9902ad2db5d76060f47c18cc`

Do not work from the historical `result/artifact-collaboration-v1` branch.

## Scope

Only:

- BQA-24 — invitation discoverability;
- BQA-28 — collaboration roster/projection refresh without manual reload.

No backend/schema/RLS/migration work unless current frontend/read contract is proven insufficient. Do not start BQA-20/23/27/29.

## Existing canonical behavior

Board already receives per-Idea participant rows through:

`dc_artifact_participants_read_v1`

and `collaborationCardMarkup()` already derives the current viewer's state:

`INVITED / JOINED`.

The card already has a weak local signal:

`ВАС ЗОВУТ · ОТКРОЙТЕ ИДЕЮ`.

Extend this existing projection. Do not create a notification table, inbox entity or second participation owner.

## BQA-24 target

An invited Member entering Workspace/Board without guidance must immediately understand that action is waiting and be able to reach the exact Idea.

Required:

1. invited card has a visually unmistakable invited state;
2. explicit copy remains `ВАС ЗОВУТ`;
3. one compact Board-level invitation indicator is visible, especially on mobile;
4. indicator count/state is derived only from canonical current `INVITED` rows;
5. activating the indicator focuses/opens the exact invited Idea using the existing Board/detail navigation owner;
6. with multiple invitations, the user can reach each pending invited Idea without a new inbox system;
7. CIRCLE invitation remains visible only to the invited profile / author / Owner Admin under existing ACL;
8. accept/decline removes the pending signal immediately.

Candidate presentation is allowed to include a strong card outline/marker and a compact `ПРИГЛАШЕНИЯ · N` Board strip. Do not introduce a global notification platform.

## BQA-28 target

Current live defect:

```text
invite mutation succeeds
DB/detail shows INVITED
return to Board
card roster remains stale
manual reload
roster becomes correct
```

Fix the projection invalidation path, not the data owner.

Required:

```text
INVITED / JOINED / DECLINED / LEFT / REMOVED mutation
→ canonical participant state becomes current
→ Board card roster/indicator refreshes
→ no manual page reload
→ no duplicate cache owner
```

First inventory existing navigation lifecycle, `pageshow`/BFCache behavior and existing Board refresh/event hooks. Prefer one explicit invalidation/refresh path over polling.

Do not solve by periodic polling, local shadow participant state, or a second roster store.

## File ownership

Primary owner:

`community/board/board.js`

Use existing Board CSS owner only as needed.

Avoid `community/artifact/artifact.js` unless an exact minimal invalidation signal from the mutation owner is necessary. If that becomes necessary, keep it isolated and report it explicitly so DEV2 does not overwrite it.

## Acceptance

Desktop + mobile 390 + mobile 360:

- Member with one INVITED Idea immediately notices the invite;
- Member with multiple INVITED Ideas gets correct count and can reach each;
- invited card is visually distinct but normal cards are unchanged;
- CIRCLE hidden/uninvited user gets no signal/oracle;
- author invite updates Board roster without manual reload;
- invitee JOINED updates `ПОЗВАНЫ → В ДЕЛЕ`;
- DECLINED removes invite signal;
- LEFT removes joined state;
- author/Admin REMOVED updates roster;
- focus/back/history remain canonical;
- no new schema/RPC/role semantics;
- existing Board filters/spatial camera remain intact.

Run existing Artifact Collaboration + Board browser regressions and full Site Integrity on exact head.

## Return

Return only after exact-head validation:

```text
exact SHA
changed files
root cause / refresh mechanism
BQA-24 PASS/FAIL
BQA-28 PASS/FAIL
desktop PASS/FAIL
390 PASS/FAIL
360 PASS/FAIL
CIRCLE privacy PASS/FAIL
full Site Integrity run # / id / conclusion
backend changed YES/NO
```

## Stop

```text
production merge = NO
production deploy = NO
live DB mutation = NO
new notification system = NO
G6 claim = NO until coordinator review
```
