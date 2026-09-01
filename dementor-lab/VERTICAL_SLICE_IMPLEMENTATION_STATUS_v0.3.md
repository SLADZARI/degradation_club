# DEMENTOR LAB — Vertical Slice Implementation Status v0.3

**Branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Product contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md`  
**Character contract:** `dementor-club/projects/dementor-lab/DEMENTOR_LAB_CHARACTER_SYSTEM_V0.1.md`

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
- Terminal checks follow approved contract: BRAIN, ENERGY, CONTACT when objective-terminal, plus turn limit/scenario rules. TENSION remains a live pressure metric, not a universal terminal by itself.
- Phrase-bank dialogue remains a rendering layer rather than graph cause.
- Trace-derived three-stage Result data.
- Same-scenario replay comparison helper.
- VerticalSliceController separates UI orchestration from engine semantics.
- CharacterRenderer remains a separate visual boundary.

## Base character system

The vertical slice now has a fixed production roster of exactly two base visual characters:

- `character-01` — base character 01;
- `character-02` — base character 02 / female visual archetype.

Runtime character assets are intentionally limited to:

```text
assets/characters/character-01/character-01-layered.svg
assets/characters/character-02/character-02-layered.svg
```

Character ownership rules:

- body/rig is character-specific;
- `outfit` is character-specific;
- `shoes` are character-specific;
- `hat`, `glasses`, `beard`/facial-hair category and `accessory` are shared appearance categories;
- shared appearance state can persist while switching base body;
- outfit/shoes state belongs to the selected base character;
- visual identity never changes BehaviorGraph automatically.

The renderer reads rig metadata from the active SVG rather than assuming one universal skeleton. The implementation uses `src/render/character-registry.mjs` as the runtime roster boundary.

Prototype/reference character SVGs must not accumulate in the production character asset folder. Adding a third base body requires an explicit product/registry decision.

## Wired vertical-slice UI

The implementation branch has a real modular entry page at `dementor-lab/index.html`.

Current connected flow:

`PERSON → BRAIN → SETUP → TALK → predictive HOT PATCH → same-turn resume → RESULT → one-node rerun → BEFORE/AFTER`

UI responsibilities:

- PERSON chooses one of the two base visual bodies and edits appearance only.
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

The BRAIN loop breakpoint is aligned with the architecture baseline at predicted `BRAIN ≥ 88` with repeated loop activity.

## Test coverage present in branch

The deterministic suite covers Encounter/HOT PATCH, replay/result, renderer behavior, mobile readability, UI contracts and character-asset contracts.

Browser smoke additionally verifies the phone-sized end-to-end flow and base-character/appearance switching contract.

## Current gate

Implementation breadth remains frozen. Continue with QA and visual accuracy rather than adding new game systems.

Required checks before integration PR:

1. AUTO and STEP produce the same deterministic turn semantics.
2. HOT PATCH appears before dangerous traversal is committed.
3. Applying a patch retries the same actor/turn with preserved state.
4. UI objective wording matches Scenario objective.
5. TRACE matches actual graph path.
6. Result explains actual final trace.
7. Replay uses the same Scenario and shows a real BEFORE/AFTER delta.
8. Both base characters render correctly with their own rigs/outfit/shoes.
9. Shared appearance state behaves consistently between both base characters.
10. Mobile Safari and Android Chrome remain readable and operable.

No deploy yet. No new game systems until this gate passes.
