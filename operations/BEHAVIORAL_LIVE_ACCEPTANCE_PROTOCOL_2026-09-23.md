---
artifactId: dementor-club.qa.behavioral-live-acceptance-protocol-2026-09-23
project: dementor-club
documentType: QA_EVIDENCE
projectStage: CLEANUP
gate: G8_CLEANUP
status: ACTIVE_EVIDENCE
version: 1.0
updated: 2026-09-23
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: EVIDENCE
parentIssue: 228
productionCommit: df8a24eca2bcca25339f128c7da93982515cf442
pagesWorkflowRunNumber: 134
pagesWorkflowRunId: 35885907613
runtimeMutationAuthorized: false
newResultAuthorized: false
---

# Dementor Club — #228 Behavioral Live Acceptance Protocol

## Purpose

Executable live behavioral acceptance kit for the remaining #228 scenarios:

`BQA-01 / 02 / 03 / 04 / 05 / 06 / 08 / 09`.

This artifact is evidence and test protocol only.

It authorizes no runtime mutation, schema/RLS change, Membership/DC-9/Auth semantic change, role mutation, new Result, merge or deploy.

Current exact production under test:

`dementor-club-production@df8a24eca2bcca25339f128c7da93982515cf442`

Pages:

`#134 / 35885907613 = SUCCESS`

`currentResult = null`.

## Governing acceptance rule

```text
technical PASS != behavioral PASS
assisted completion != PASS
```

A tester must complete the behavioral job without directional help.

If the tester asks where to click, the facilitator may answer only with a neutral phrase such as:

> Do what seems natural from what you see.

Any directional hint, UI label, location, expected button, expected consequence or explanation that materially helps completion changes the behavioral verdict to at best `ASSISTED PASS`.

For discoverability steps, allow one uninterrupted attempt of up to 3 minutes. If there is no meaningful progress, record `FAIL` for the unassisted attempt. Assistance may then be given only to continue a downstream scenario, and that assisted continuation must be recorded separately.

A runtime failure is a `FAIL`, not a behavioral misunderstanding. Do not patch during the session. Record observation → exact reproduction → canonical owner → authority check → existing equivalent inventory before deciding whether the follow-up is bugfix / new Result / Change Proposal / no code.

`PRODUCT GAP` is never inferred merely from a weak experience. It requires an exercised user job, a negative behavioral result, authority/equivalent inventory and evidence that no approved/runtime capability closes the job.

## Identity / state handling

Do not model Guest, Applicant, Membership states and roles as one lifecycle progression.

Before each test, record the actor's actual canonical state/role as resolved by the existing production system. Do not manufacture or mutate a state for QA.

Relevant current distinctions remain:

`AUTHENTICATION != DC9 COMPLETE != APPLICATION != MEMBERSHIP`.

`OWNER_ADMIN` is an operational role, not a substitute Membership state.

`DEMENTOR` role alone does not grant global Board moderation.

## Minimal live test set

Use real existing identities only.

### EXT-01 — external authenticated recipient

Purpose:
- BQA-01
- BQA-02
- optionally BQA-03

Requirements:
- external-to-core tester;
- already has a legitimate authenticated identity;
- Board-readable under its existing state;
- has not been briefed on Share → Receive UI.

Do not change its Membership, DC-9, Application or role state for the test.

### PREMEM-01 — one legitimate Guest OR Applicant identity

Purpose:
- BQA-08.

Accept whichever legitimate current state already exists:
- authenticated Guest; or
- Applicant.

Record the exact resolved state. Do not complete DC-9, submit/cancel an Application or mutate permissions just to obtain a preferred state.

One identity does not prove every possible pre-membership state. Evidence must say exactly which state was exercised.

### MEMBER-01 — one legitimate Member identity

Purpose:
- BQA-03
- BQA-04
- BQA-05
- BQA-06
- BQA-09.

Use a Member who has at least one own readable Artifact and can legitimately interact with another person's readable Thing.

Do not elevate to Dementor or Owner Admin for these scenarios.

### OWNER-ADMIN

Not required for BQA-01/02/03/04/05/06/08/09.

Use Owner Admin only if a later authority-specific test explicitly requires privileged create/move/archive behavior. Do not include it merely to broaden coverage.

## Common evidence package

For every exercised scenario capture:

1. test ID;
2. date/time;
3. exact production SHA;
4. actor alias only: `EXT-01`, `PREMEM-01`, `MEMBER-01`;
5. actual resolved user state / relevant role, without publishing unnecessary PII;
6. device + viewport;
7. start URL;
8. end URL;
9. uninterrupted screen recording or sequential screenshots;
10. exact neutral facilitator prompt;
11. every additional facilitator statement after start;
12. tester's spontaneous explanation of what they think happened;
13. observable consequence;
14. verdict;
15. cleanup/reset result.

Recommended evidence names:

`BQA-XX_20260923_<actor>_<device>_<kind>`.

Do not use CI/browser fixture evidence as a substitute for this human evidence.

---

# BQA-01 — share/Telegram → received Artifact

## Required actor/state

`EXT-01`.

Any legitimate authenticated Board-readable state is acceptable, but record the exact state. The purpose is recipient behavior, not state transition.

## Clean starting state

- recipient authenticated in production;
- no Artifact detail open;
- no stale `focus` or `from=share` query in the active Board tab;
- use one real readable Artifact chosen by the facilitator/sender;
- recipient has not seen the target in this session;
- no pre-brief about receive postcard or its controls.

## Exact entry URL/action

Sender obtains the canonical share transport for the chosen Artifact:

`https://dementor.club/share/artifact/?id=<artifact_uuid>`

Deliver it through the real intended channel (Telegram or ordinary copied link).

Recipient opens the link without being told what the next screen should look like.

The canonical resolved Board arrival is expected to preserve:

`/workspace/board/?focus=artifact:<uuid>&from=share`

but the tester must not be told this.

## What tester is allowed to know

Only:

> Someone from Dementor Club sent you something. Open it and decide what you want to do.

## What tester MUST NOT be told

- that a postcard/modal should appear;
- the text `ВАМ ПЕРЕДАЛИ АРТЕФАКТ`;
- where the Artifact is located;
- which control means accept/stay;
- that `from=share` or `focus` exists;
- what the expected URL should become.

## Observable task

Tester opens the shared item, explains in their own words what they believe they received, and chooses a next action.

## Success criterion

`PASS` only if, without directional help:

- tester understands that a specific item was sent to them;
- they understand they have a deliberate choice rather than an automatic forced open;
- they successfully choose either to inspect it or stay on the Board;
- their explanation is materially consistent with the visible product behavior.

Technical correctness of the URL alone is insufficient.

## Failure criterion

`FAIL` if any of the following occurs unassisted:

- tester cannot tell what was received;
- tester is forced/opened without meaningful choice;
- tester cannot find a viable next action;
- tester believes the screen is an error/loading state;
- target is wrong or unusable;
- facilitator must point to a control.

If facilitator guidance enables completion, record `ASSISTED PASS`, not PASS.

## Evidence to capture

- original share URL;
- resulting Board URL;
- persistent receive presentation screenshot/video;
- tester's first spontaneous description;
- chosen action;
- resulting URL;
- whether any help was provided.

## Cleanup/reset after test

If tester chose stay/close:
- confirm no stale `from=share` or `focus` remains and Board is usable.

If tester chose inspect:
- close the detail normally;
- return to plain Board;
- confirm no receive ritual reopens on ordinary Board refresh.

Do not delete or alter the source Artifact.

## Related WAITING Result

`dementor-club.result.board-share-receive-ritual-v1`.

---

# BQA-02 — received Artifact → Board context

## Required actor/state

`EXT-01`, preferably immediately after BQA-01 Accept.

## Clean starting state

- BQA-01 receive ritual completed by explicit inspect/accept;
- exact received Artifact is open;
- `from=share` consumed;
- canonical Artifact focus may remain;
- no facilitator explanation of “Board”, spatial context or object taxonomy.

## Exact entry URL/action

Continue from BQA-01 after the tester has chosen to inspect the Artifact.

If run independently, enter through the same canonical share URL and allow the tester to reach the opened Artifact unassisted first.

## What tester is allowed to know

Only:

> Continue exploring what you received. Tell us where you think you are and what surrounds this item.

## What tester MUST NOT be told

- that the correct answer is “Board”;
- that the Artifact is a Board card/detail;
- how to close/minimize;
- how to pan/zoom/focus;
- what surrounding cards/entities mean.

## Observable task

Tester explains:
- where they believe the received item lives;
- whether it is isolated or part of a larger club context;
- how they would look around for related/nearby context.

Then they attempt to expose that surrounding context.

## Success criterion

`PASS` only if without directional help the tester:

- recognizes the received item as part of a broader club/community context rather than a dead-end page;
- can recover or expose the surrounding Board context;
- can describe a plausible relationship between the opened item and what is around it.

Exact internal taxonomy vocabulary is not required.

## Failure criterion

`FAIL` if tester:

- believes the item is an isolated page with no recoverable context;
- cannot return/expose the surrounding Board;
- becomes trapped or loses the received object entirely;
- requires instruction about where/how to recover context.

Guided recovery is `ASSISTED PASS`.

## Evidence to capture

- opened received Artifact;
- first spontaneous “where am I?” answer;
- path used to expose Board context;
- final visible context;
- any facilitator hint.

## Cleanup/reset after test

Return to plain `/workspace/board/` with no receive state and no open detail.

## Related WAITING Results

- `dementor-club.result.board-share-receive-ritual-v1`
- `dementor-club.result.board-information-architecture-v1`

---

# BQA-03 — detail → close/minimize/back

## Required actor/state

`MEMBER-01`.

May also be observed with `EXT-01`, but the recorded primary run uses MEMBER-01.

## Clean starting state

- plain live Board;
- no open detail;
- no share query;
- normal Board filter/view chosen by the tester, not pre-positioned on a target.

## Exact entry URL/action

Start at:

`https://dementor.club/workspace/board/`

Neutral task:

> Open something that interests you, look at it, and then return to where you were.

## What tester is allowed to know

Only the neutral task above.

## What tester MUST NOT be told

- which card to open;
- which close/minimize/back control to use;
- whether browser Back is acceptable;
- what camera/focus state should be restored.

## Observable task

Tester independently:
1. opens a Thing/detail;
2. inspects it;
3. returns to a usable Board context.

## Success criterion

`PASS` only if:
- open is understandable;
- return path is discovered without instruction;
- after return, Board is usable and context is not confusingly lost;
- tester can explain where they returned.

## Failure criterion

`FAIL` if:
- no discoverable return path;
- close/back traps them, opens a wrong state, or loses Board usability;
- they require directional instruction;
- runtime remains in loading/blank/terminal state unexpectedly.

If directional help is needed, at best `ASSISTED PASS`.

## Evidence to capture

- start Board view;
- chosen Thing identity;
- opened detail;
- action used to return;
- end Board view + URL;
- tester's explanation of where they are after return.

## Cleanup/reset after test

Return to plain Board with no detail overlay and no stale query state.

## Related WAITING Result

`dementor-club.result.board-information-architecture-v1`.

---

# BQA-04 — relation create discoverability

## Required actor/state

`MEMBER-01`.

Member must own Artifact A. Target Thing B must be a legitimate readable target. Do not use a relation that the Member lacks authority to originate.

## Clean starting state

- own Artifact A exists and is readable;
- eligible target B exists and is readable;
- no active A → B relation of the relation type intended for the test;
- Relations UI not pre-opened;
- facilitator has not demonstrated relation controls in this session.

## Exact entry URL/action

Start at plain Board:

`https://dementor.club/workspace/board/`

Neutral prompt:

> These two things belong together in some way. Show that connection in the system.

Identify A and B by their visible titles only if needed to define the task. Do not name the “relation” feature or where it lives.

## What tester is allowed to know

- the two specific Things A and B;
- the intended semantic connection in ordinary language.

## What tester MUST NOT be told

- the word/button/location used to create relations;
- that the action lives in detail/card controls;
- which relation type label to choose;
- sequence of clicks.

## Observable task

Tester discovers and completes a valid relation creation from an authorized origin.

## Success criterion

`PASS` only if tester independently:
- finds the relation capability;
- understands enough of the relation choices to select a materially appropriate type;
- creates the relation;
- recognizes that the action completed.

## Failure criterion

`FAIL` if:
- tester cannot find the relation action within the uninterrupted discovery attempt;
- chooses an obviously wrong mechanism because relation creation is not discoverable;
- cannot tell whether creation succeeded;
- facilitator points to the relation UI or names the required action.

Assisted completion remains `ASSISTED PASS`.

## Evidence to capture

- A and B identities;
- before-state proving no tested relation;
- uninterrupted discovery video;
- selected relation type;
- acknowledgement after create;
- after-state and, where available, relation identifier.

## Cleanup/reset after test

Do not immediately delete if BQA-05 will follow using the same relation.

If BQA-05 is not run next, delete the test relation using the normal authorized UI after evidence capture and verify removal after refresh.

No direct DB cleanup.

## Related WAITING Result

`dementor-club.result.board-relations-v1`.

---

# BQA-05 — relation consequence after create/delete/refresh

## Required actor/state

`MEMBER-01`.

## Clean starting state

Preferred:
- continue directly from a successful or assisted BQA-04 with one known A → B relation present.

Independent fallback:
- facilitator uses an already authorized existing actor/UI before the test to create one clean test relation;
- tester may be told only that A and B were connected earlier;
- tester must not be shown where the consequence appears or how deletion works.

## Exact entry URL/action

Open plain Board:

`https://dementor.club/workspace/board/`

Neutral prompt:

> Check what changed because these two things were connected. Then undo that connection and make sure it is really gone.

## What tester is allowed to know

- A and B;
- that a connection was created.

## What tester MUST NOT be told

- where the relation line/indicator/detail consequence is;
- where delete lives;
- what refresh should prove;
- which exact UI state indicates success.

## Observable task

Tester:
1. identifies a visible/understandable consequence of the relation;
2. deletes/removes the relation through the normal UI;
3. refreshes/re-enters;
4. verifies the relation no longer appears.

## Success criterion

`PASS` only if unassisted:
- relation consequence is understandable;
- deletion action is discoverable enough to complete;
- tester sees acknowledgement/consequence;
- after refresh the absence is understood as successful removal;
- tester can explain what changed.

## Failure criterion

`FAIL` if:
- relation technically exists but tester cannot find/understand its consequence;
- deletion completes but no understandable feedback exists;
- refresh resurrects/still shows the relation;
- tester requires directional explanation.

## Evidence to capture

- pre-delete relation manifestation;
- delete action;
- immediate post-delete state;
- refreshed state;
- tester's explanation before and after;
- URLs and timestamps.

## Cleanup/reset after test

Final required state:
- test relation absent;
- plain Board usable;
- no open relation editor/detail caused by the test.

No DB/manual data mutation outside the normal authorized flow.

## Related WAITING Result

`dementor-club.result.board-relations-v1`.

---

# BQA-06 — interaction with another person's Thing

## Required actor/state

`MEMBER-01`.

Target must be another person's readable Thing/Artifact. MEMBER-01 must not own it and must not have Owner Admin authority for the test.

## Clean starting state

- target is readable;
- tester does not own target;
- no open detail;
- preferably choose a controlled Artifact whose author consents to QA interaction;
- do not pre-explain allowed/forbidden actions.

## Exact entry URL/action

Start from plain Board and identify the target only by visible title if necessary.

Neutral prompt:

> This belongs to someone else and it interests you. Do something appropriate with it, then tell us what you think you changed and what you now control.

## What tester is allowed to know

- that the target belongs to another person;
- that they may interact only through whatever the product legitimately offers.

## What tester MUST NOT be told

- which action to choose;
- that reaction/response is expected;
- what ownership/moderation permissions they do or do not have;
- where relation or response actions live.

## Observable task

Tester independently chooses a legitimate interaction such as reaction/response or another approved non-ownership action, observes the consequence, and explains the resulting boundary.

## Success criterion

`PASS` only if tester:
- finds at least one legitimate interaction without help;
- receives/understands its acknowledgement;
- correctly understands that interacting did not transfer ownership or global moderation authority;
- does not reasonably conclude they can move/archive/edit the source merely because they interacted.

## Failure criterion

`FAIL` if:
- no legitimate interaction is discoverable;
- action appears to grant ownership/control that authority does not grant;
- tester believes they now own/moderate the source because of the interaction;
- directional help is required.

## Evidence to capture

- proof target is another person's Thing without exposing unnecessary PII;
- chosen interaction;
- acknowledgement/consequence;
- tester's answer to “what changed?” and “what do you now control?”;
- any help provided.

## Cleanup/reset after test

Prefer a reversible reaction on a controlled target.

If the chosen interaction is reversibly removable through normal UI, remove it after capture.

If no normal undo exists, do not perform ad-hoc DB cleanup. Use a controlled QA target and record the persistent interaction as test evidence.

## Related WAITING Result

`dementor-club.result.board-relations-v1` for relation/interaction comprehension scope.

BQA-06 may also contribute contextual evidence to Board IA, but does not by itself close Board Access or Membership semantics.

---

# BQA-08 — authenticated Guest / Applicant Board

## Required actor/state

`PREMEM-01`.

Use the identity's legitimate current canonical state:
- authenticated Guest; OR
- Applicant.

Record exactly which one was exercised.

Do not convert one into the other for QA.

## Clean starting state

- authenticated identity;
- plain Board;
- no share/focus query;
- no open detail;
- facilitator does not explain what is gated.

## Exact entry URL/action

Open:

`https://dementor.club/workspace/board/`

Neutral prompt:

> Explore this Board. Find something useful, interact with it if that makes sense, and then try to add something of your own. Tell us what you think you are allowed to do here.

## What tester is allowed to know

Only that they are signed in with their normal account.

## What tester MUST NOT be told

- whether they are a Member;
- expected capabilities;
- that create must be gated;
- where DC-9/Application continuation should appear;
- that login and Membership are distinct — the UI itself must support that understanding.

## Observable task

Tester:
1. explores/pans/opens;
2. attempts a normal interaction;
3. attempts the visible create/add path;
4. explains what they believe is available vs gated.

## Success criterion

`PASS` only if without guidance:
- Board is understandable/usable;
- legitimate read/open/interaction is discoverable;
- create/add does not silently grant unauthorized publishing;
- tester understands that their current authenticated state does not automatically mean unrestricted Membership publishing;
- resulting gate/continuation is understandable for the actual state exercised.

## Failure criterion

`FAIL` if:
- Board is inaccessible contrary to current authority;
- tester can publish/move/archive despite the actual pre-membership state;
- tester cannot understand why create is gated;
- UI strongly implies authentication itself equals Membership;
- directional help is required.

## Evidence to capture

- actor alias + exact resolved current state;
- Board entry;
- one read/open interaction;
- one interaction attempt;
- create/add attempt;
- resulting route/surface;
- tester's explanation of their permissions;
- proof no state/role mutation was performed for the test.

## Cleanup/reset after test

- return to plain Board;
- revert reversible reaction if used;
- do not change DC-9 completion, Application, Membership or roles.

## Related WAITING Result

`dementor-club.result.board-access-control-v2`.

This run proves only the exact real state exercised; it must not be generalized to untested Guest/Applicant states.

---

# BQA-09 — return / context comprehension after 1–3 days

## Current status

`NOT EXERCISED / BEHAVIORAL VERDICT PENDING`.

Not `PRODUCT GAP`.

No product-gap conclusion is permitted before Visit 2.

## Required actor/state

`MEMBER-01`.

Use the same legitimate identity for Visit 1 and Visit 2. Do not change Membership/roles for the test.

## Visit 1 — baseline snapshot now

### Clean starting state

- plain Board;
- no share query;
- no open detail;
- tester uses the product naturally;
- do not tell tester this is a memory test;
- do not ask tester to memorize labels, card positions or counts.

### Exact entry URL/action

`https://dementor.club/workspace/board/`

Neutral prompt:

> Spend a few minutes using the Board as you normally would. Open whatever seems relevant and stop when you feel you understand what is happening.

### What tester is allowed to know

Only the neutral task above.

### What tester MUST NOT be told

- which Thing will be used as an anchor;
- what will be compared on Visit 2;
- that they need to memorize the layout;
- which Current Program / relation / history elements matter;
- what changes are expected over the next 1–3 days.

### Baseline snapshot evidence to capture now

Observer captures, without tutoring the tester:

1. timestamp;
2. production SHA;
3. actor alias + actual state/role relevant to access;
4. device/viewport;
5. exact entry URL;
6. active Board filter/view at the moment tester says they understand the Board;
7. visible Current Program/context block, if present;
8. titles/IDs of up to 3 Things the tester naturally noticed or opened;
9. one Thing the tester spontaneously identifies as personally relevant, if any;
10. any visible relation/history/continuation signal the tester notices;
11. tester's spontaneous answers:
   - “What is happening now?”
   - “What seems relevant to you?”
   - “What could you do next?”
12. final Board screenshot/video;
13. no coaching confirmation.

This baseline is observer evidence. Do not show it back to the tester before Visit 2.

### Visit 1 success/failure

Visit 1 does not produce the final BQA-09 verdict.

After baseline capture, status remains:

`NOT EXERCISED / AWAITING 1–3 DAY RETURN`.

## Visit 2 — 1–3 days later

Run between 24 and 72 hours after Visit 1 with the same identity.

### Clean starting state

- start from a fresh ordinary Board entry;
- do not restore a saved `focus` query;
- do not show Visit 1 screenshots;
- do not preselect the previous Thing;
- do not summarize what changed.

### Exact entry URL/action

`https://dementor.club/workspace/board/`

Neutral prompt:

> You have come back after a few days. Use what you see and tell us what is happening, what changed or matters to you, and what you would do next.

## What tester MUST NOT be told

- what changed;
- which Thing they used last time;
- where to find history/relations/current program;
- what “meaningful delta” means internally;
- what answer is expected.

## Observable task

Without coaching, tester attempts to answer:

1. What is happening now?
2. What changed meaningfully, if anything?
3. Which Thing is relevant to me?
4. What can I do with it?
5. Where would I expect to see the consequence later?

Observer compares the answers to the Visit 1 baseline and actual current product state.

## Success criterion

`PASS` if the tester can, without directional help:
- re-establish enough context to orient themselves;
- distinguish current/relevant activity from old context well enough to choose a plausible next move;
- recover a familiar or relevant Thing when needed;
- understand where an action/consequence would live.

The tester does not need perfect memory or exact card positions.

## Failure criterion

`FAIL` if, despite functioning runtime:
- tester cannot re-establish context;
- cannot tell what is current/relevant;
- cannot recover a familiar/relevant Thing through the existing product;
- cannot identify any plausible next move;
- materially misreads stale context as current because the UI gives no usable cue;
- needs directional explanation.

A negative Visit 2 result is first recorded as `FAIL`.

Only after root-cause/authority/equivalent inventory may it later be classified as:
- bugfix in existing owner;
- product gap;
- decision needed;
- no code.

Do not jump directly from FAIL to PRODUCT GAP.

## Evidence to capture

Visit 2:
- timestamp;
- production SHA;
- same actor alias/state;
- full return session video;
- entry/end URL;
- spontaneous answers to the five questions;
- Things found/opened;
- actual meaningful changes since Visit 1, derived by observer evidence rather than tester briefing;
- whether assistance was required;
- comparison against Visit 1 baseline.

## Cleanup/reset after test

No special data reset is required unless tester created a reversible QA interaction.

Do not mutate history, membership, roles or content to improve the result.

## Related WAITING Result

`dementor-club.result.board-information-architecture-v1`.

---

# Execution order

Recommended single-session order for Visit 1:

```text
EXT-01
BQA-01 → BQA-02 → optional BQA-03 observation

MEMBER-01
BQA-03 → BQA-04 → BQA-05 → BQA-06 → BQA-09 Visit 1 baseline

PREMEM-01
BQA-08
```

Then:

```text
24–72 hours later
MEMBER-01
BQA-09 Visit 2
```

Do not reuse explanations from one tester with another. A tester who has watched another scenario is contaminated for discoverability evidence and must not be treated as clean for that same discovery question.

# Current evidence matrix — 2026-09-23

This matrix records the state before executing this protocol.

| BQA | Current evidence verdict | Closure effect |
|---|---|---|
| BQA-01 | ASSISTED PASS | no closure |
| BQA-02 | ASSISTED PASS | no closure |
| BQA-03 | ASSISTED PASS | no closure |
| BQA-04 | ASSISTED PASS | no closure |
| BQA-05 | ASSISTED PASS | no closure |
| BQA-06 | ASSISTED PASS | no closure |
| BQA-08 | ASSISTED PASS | no closure |
| BQA-09 | NOT EXERCISED | no closure; Visit 1 + Visit 2 required |

`ASSISTED PASS != closure`.

`NOT EXERCISED != FAIL != PRODUCT GAP`.

# WAITING Results

No WAITING Result is closed by creation of this protocol.

Remain open:

- `dementor-club.result.board-share-receive-ritual-v1`;
- `dementor-club.result.board-information-architecture-v1`;
- `dementor-club.result.board-relations-v1`;
- `dementor-club.result.board-access-control-v2`.

Future G8 closure requires the corresponding human evidence, not only existing technical G6/G7 evidence.

# Stop boundary

After this protocol/evidence registration:

```text
runtime mutation = NO
new Result = NO
role/permission mutation = NO
Membership/DC-9/Auth semantic mutation = NO
WAITING closure = NO
feature implementation = STOP
```
