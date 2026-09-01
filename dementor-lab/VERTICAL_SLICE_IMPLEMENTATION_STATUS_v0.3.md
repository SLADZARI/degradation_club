# DEMENTOR LAB — Vertical Slice Implementation Status v0.3

**Branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Product contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md`

## Implemented in modular runtime

- Character/state model including persistent `memory`.
- BehaviorGraph family compatibility + human validation.
- Executable STATE/MEMORY (`resentment`, `trust`).
- Deterministic authored Scenario `КРИТИКА ИДЕИ`.
- Two real actor graphs: Геннадий Львович and Марта.
- Encounter state with turn, transcript, traces, patches and result.
- Deterministic graph path selection.
- ExecutionTrace with visited nodes, impulse, reaction, metric deltas, memory changes and loops.
- ENERGY/BRAIN/TENSION/CONTACT updates.
- Predictive HOT PATCH interception before dangerous traversal is committed.
- HOT PATCH reduce-repeat / reduce-impulse / insert-pause / rewire operations.
- Patch preserves turn, metrics, memory and transcript.
- Terminal checks include BRAIN, ENERGY, TENSION and CONTACT-by-objective.
- Phrase-bank dialogue remains a rendering layer rather than graph cause.
- Trace-derived three-stage Result data.
- Same-scenario replay comparison helper.
- VerticalSliceController separates UI orchestration from engine semantics.
- CharacterRenderer remains a separate visual boundary.

## Wired vertical-slice UI

The implementation branch now has a real modular entry page at `dementor-lab/index.html`.

Current connected flow:

`PERSON → BRAIN → SETUP → TALK → predictive HOT PATCH → same-turn resume → RESULT → one-node rerun → BEFORE/AFTER`

UI responsibilities:

- PERSON changes visual identity only.
- BRAIN edits actual player graph params (`BE RIGHT weight`, `REPEAT count`).
- SETUP exposes one authored Scenario and objective contract.
- TALK reads live Encounter state from `VerticalSliceController`.
- AUTO and STEP both call the same runtime.
- TRACE reads actual `ExecutionTrace`.
- HOT PATCH edits the actual graph and then resumes the pending turn.
- RESULT is trace-derived.
- Rerun recreates the same Scenario baseline, asks for one graph change, and compares terminal state through `compareRuns()`.

The UI does not maintain a second copy of encounter semantics.

## Important semantic correction made during implementation

The earlier prototype/runtime ordering could apply a turn, reach terminal state and only then consider HOT PATCH. The modular runtime now predicts the dangerous traversal first. If the breakpoint qualifies, the Encounter enters `HOT_PATCH` **without consuming the turn or mutating metrics/memory/transcript**. After the patch, the same actor retries the pending turn against the changed graph.

This better matches the approved contract: HOT PATCH is an intercept and resumes the same Encounter rather than becoming a post-failure repair screen.

## Test coverage present in branch

- `tests/encounter-runtime-selftest.mjs`
  - deterministic first turn;
  - persistent memory;
  - authored HOT PATCH gate;
  - patch preserves turn/memory/transcript;
  - same Encounter resumes after patch.

- `tests/result-replay-selftest.mjs`
  - Encounter reaches terminal result;
  - Result derives causal data from trace;
  - suspicious node is identified;
  - same-scenario BEFORE/AFTER comparison is produced;
  - changing one graph parameter changes outcome state.

## Next gate

The architecture and UI are now connected enough to stop adding implementation breadth.

Next work is **deterministic QA + browser/device QA of the modular page**, with defects fixed in this branch before PR/deploy.

Required checks:

1. AUTO and STEP produce the same deterministic turn semantics.
2. HOT PATCH appears before dangerous traversal is committed.
3. Applying a patch retries the same actor/turn with preserved state.
4. UI objective wording matches Scenario objective.
5. TRACE matches actual graph path.
6. Result explains actual final trace.
7. Replay uses the same Scenario and shows a real BEFORE/AFTER delta.
8. Mobile Safari and Android Chrome remain readable and operable.

No deploy yet. No new game systems until this gate passes.
