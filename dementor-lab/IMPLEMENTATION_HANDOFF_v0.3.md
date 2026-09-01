# DEMENTOR LAB — VERTICAL SLICE IMPLEMENTATION HANDOFF v0.3

**STATUS:** IMPLEMENTATION STARTED  
**BRANCH:** `agent/dementor-lab-vertical-slice-v0.3`  
**BASE:** `dementor-club-site`  
**PRODUCT CONTRACT:** `projects/dementor-lab/DEMENTOR_LAB_PRODUCT_FLOW_INTERACTION_SPEC_v0.3.md` on `dementor-club`  
**ENGINE CONTRACT:** `projects/dementor-lab/DEMENTOR_LAB_GAME_ARCHITECTURE_V0.1.md` on `dementor-club`  
**CHARACTER CONTRACT:** `projects/dementor-lab/DEMENTOR_LAB_CHARACTER_SYSTEM_V0.1.md` on `dementor-club`

## Stage objective

Turn the validated mobile prototype into a maintainable vertical slice without changing approved product semantics.

The exploratory UX stage is closed. The first implementation pass is architecture + deterministic flow + mobile QA, not new content.

## Implementation order

1. Extract Character/state and node definitions.
2. Extract BehaviorGraph validation/compatibility/runtime.
3. Extract Encounter state machine, traces and HOT PATCH resume.
4. Extract deterministic Dialogue Layer.
5. Extract `CharacterRenderer`.
6. Build PERSON/BRAIN/TALK workspaces over the same Character object.
7. Reproduce the approved mobile density/readability rules.
8. Add deterministic scenario fixture and automated tests.
9. Run physical mobile QA.
10. Only then connect the slice to a public route.

## Required module boundaries

```text
dementor-lab/
  src/
    core/
      model.*
      graph.*
      encounter.*
    dialogue/
      phrase-bank.*
    render/
      character-registry.*
      character-renderer.*
    app/
      mobile-interaction.*
    ui/
      person.*
      brain.*
      talk.*
      result.*
```

Exact extension/framework may follow the existing site stack. Responsibility boundaries are mandatory; names are not.

## Non-negotiable runtime invariants

- Visual appearance does not determine personality.
- Graph is cause; dialogue is output.
- Character owns persistent state/memory.
- ENERGY high is healthy; low is dangerous.
- BRAIN high is dangerous.
- CONTACT and TENSION are independent dimensions.
- HOT PATCH resumes current Encounter; it does not restart Scenario.
- Objective is one contract shared by setup, runtime and result.
- Result is trace-derived, not generic psychology.
- Production renderer owns SVG state changes; graph runtime does not manipulate SVG DOM.
- Current production roster contains exactly two base bodies: `character-01` and `character-02`.
- Each base body owns its rig, outfit and shoes.
- Headwear, glasses, facial-hair category and general accessory are shared appearance categories.
- A third base-character SVG must not enter runtime by file accumulation; it requires an explicit product/registry decision.

## Mobile implementation invariants

- phone-first layout;
- effective touch targets ~44 CSS px;
- node drag separated from tap by drag slop;
- second pointer yields to pinch;
- no accidental inspector open after drag;
- invalid graph targets do not pretend to connect;
- bottom sheets own temporary detail;
- remove duplicate UI before shrinking copy;
- avoid permanent developer/QA microtext;
- preserve reduced-motion behavior and safe areas.

## Scope freeze

Do not add before vertical-slice gate:

- extra scenario packs;
- additional base character bodies beyond the approved two;
- user accounts;
- social sharing;
- LLM dialogue;
- large persistence system;
- new universal scoring model;
- new behavioral families outside approved six.

## First deterministic fixture

Scenario: **КРИТИКА ИДЕИ**  
Premise: **Марта считает идею Гены плохой.**

Player graph baseline should preserve the proven causal loop:

```text
CRITICISM
→ BE RIGHT
→ EXPLAIN
→ REPEAT
```

At least one implementation fixture should also include executable STATE / MEMORY so persistence is exercised.

Opponent must be a real BehaviorGraph, not a scripted phrase sequence.

## Done for implementation stage 1

Stage 1 is complete when:

- modular runtime exists;
- one scenario runs deterministically;
- PERSON/BRAIN/TALK use the same Character;
- the two approved base characters use the character registry and their own rig metadata;
- BRAIN editing works on phone;
- STATE / MEMORY persists;
- TRACE describes actual traversal;
- HOT PATCH resumes correctly;
- result and replay reflect the same Scenario state;
- automated runtime tests pass;
- physical phone QA has no blocking gesture/readability defects.

No deploy is implied by this branch or by completing code locally. Commit ≠ deploy.
