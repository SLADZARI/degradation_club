# DEV2 — Artifact Collaboration live corrective · Detail hierarchy + destructive UX

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

- BQA-25 — Artifact detail action hierarchy;
- BQA-26 — LEFT/REMOVED destructive-action UX.

No participation-state semantic changes.

Do not start Owner Admin operations UI (BQA-23), richer Idea content model (BQA-29), media normalization (BQA-20) or Board performance (BQA-27).

## Existing canonical semantics

Preserve exactly:

```text
AUTHOR != PARTICIPANT
INVITED != JOINED
LEFT = participant self-action
REMOVED = author/Owner Admin action
```

Current RPC owners remain unchanged.

Relations remain under the existing canonical detail Relations owner.

## BQA-25 target

The first visible action must match the viewer's job.

### INVITED

Current live problem: `ПРИСОЕДИНИТЬСЯ` is present but visually weak.

Required:

- invitation block appears before secondary controls;
- `ПРИСОЕДИНИТЬСЯ` is the strongest CTA;
- target visual: black background / white text;
- `НЕ СЕЙЧАС` remains secondary;
- copy stays explicit: `<AUTHOR> ЗОВЁТ ВАС В ЭТУ ИДЕЮ`.

Do not globally redefine every `.primary` button if that changes unrelated surfaces. Use a bounded collaboration CTA role/class.

### JOINED

After join:
- show `ВЫ В ДЕЛЕ` as a compact state, not a large dominant action panel;
- do not put `ВЫЙТИ` in the central primary-action area;
- move self-leave to a low-priority destructive section at the bottom of the detail.

### Detail sections

Keep one canonical Artifact detail page.

Reorganize presentation into role-aware sections without duplicating owners. Candidate hierarchy:

```text
PRIMARY VIEWER ACTION / STATE
CONTENT / MEDIA
COLLABORATION / PEOPLE
RELATIONS
AUTHOR CONTROLS          collapsed/secondary
OWNER ADMIN / SETTINGS  collapsed/secondary, existing controls only
DESTRUCTIVE / LEAVE     bottom
```

Do not create a second detail/modal/settings system.

Existing Owner Admin controls such as Telegram suppression / Board hide may be grouped/collapsed for hierarchy, but do not add new Owner Admin capabilities here.

## BQA-26 target

Current backend semantics are correct; presentation is confusing.

Required:

- participant sees one self-action: `ВЫЙТИ ИЗ ИДЕИ`;
- author/Owner Admin sees participant-management removal separately: `УБРАТЬ ИЗ ИДЕИ`;
- no UI implies that LEFT and REMOVED are the same operation;
- `×` control must have explicit accessible label/meaning and must not appear as the participant's own leave action;
- self-leave must require a deliberate second confirmation step;
- cancel leaves JOINED unchanged;
- repeat/double activation must not generate an invalid second transition.

The owner asked for a delayed destructive confirmation, but the exact timer duration is not yet canonical. Do **not** invent 3/5/10 seconds. Implement the hierarchy and two-step confirmation in a way that can accept a later delay constant without changing state semantics. Report the remaining timer micro-decision.

## File ownership

Primary:

```text
community/artifact/artifact.js
community/artifact/artifact.css
```

Do not change Board invitation presentation owned by DEV1.

If a shared validator file must change, coordinate by returning a separate validator commit or wait for the other lane's exact head; do not overwrite concurrent regression coverage.

## Acceptance

INVITED:
- invitation visible before secondary settings;
- join CTA black/white and dominant;
- “Не сейчас” secondary;
- mobile 390/360 usable with no overflow.

JOINED:
- `ВЫ В ДЕЛЕ` compact;
- leave control only in bottom destructive area;
- self-leave requires deliberate two-step confirmation;
- cancel keeps JOINED;
- successful leave uses canonical `dc_artifact_leave_v1`.

Author/Owner Admin:
- participant row removal uses canonical `dc_artifact_remove_participant_v1`;
- removal is clearly separate from participant self-leave;
- author controls do not appear to ordinary non-author participants;
- current Owner Admin-only controls may be collapsed but their RPCs/meaning do not change.

Regression:
- invite search/invite still works;
- CIRCLE ACL unchanged;
- Relations unchanged;
- back/deeplink/history unchanged;
- S2 detail Relations regression remains PASS;
- desktop + 390 + 360;
- full Site Integrity exact head.

## Return

```text
exact SHA
changed files
BQA-25 PASS/FAIL
BQA-26 PASS/FAIL
INVITED desktop/390/360
JOINED desktop/390/360
LEFT vs REMOVED semantics preserved YES/NO
S2 regression PASS/FAIL
full Site Integrity run # / id / conclusion
backend changed YES/NO
timer duration decision still required YES/NO
```

## Stop

```text
production merge = NO
production deploy = NO
live DB mutation = NO
new permissions = NO
new participation states = NO
G6 claim = NO until coordinator review
```
