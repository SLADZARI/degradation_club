# DEMENTOR LAB — Physical QA Runbook v0.1

**Branch:** `agent/dementor-lab-vertical-slice-v0.3`  
**Purpose:** physical iPhone Safari + Android Chrome + one short FUN PASS before integration into `dementor-club-site`.

## Start locally — no deploy

From `dementor-lab/`:

```bash
npm run qa:phone
```

The command starts a zero-dependency static server on port `4173` and prints one or more LAN URLs such as:

```text
http://192.168.x.x:4173/
```

Open that URL on a phone connected to the same Wi-Fi network.

This does **not** deploy to Vercel or publish the build publicly.

## Gate A — iPhone Safari

Run the complete flow once with `character-01`, then repeat PERSON switching with `character-02`.

Mark each item `PASS`, `FAIL` or `N/A`.

- [ ] Page opens over local Wi-Fi without a blank screen.
- [ ] No horizontal page overflow.
- [ ] Bottom/top Safari chrome does not cover primary navigation or actions.
- [ ] Safe-area spacing remains usable in portrait orientation.
- [ ] PERSON body switch works with one thumb.
- [ ] Variant rail scrolls horizontally without moving the whole page.
- [ ] Male hats, glasses, facial hair, accessories, outfits and shoes can be selected.
- [ ] Female hats, glasses, accessories and shoes can be selected.
- [ ] Female UI does not invent facial-hair or outfit variants.
- [ ] Selected shared compatible appearance survives body switching.
- [ ] Unsupported appearance clears instead of silently substituting another variant.
- [ ] Character geometry is not clipped in PERSON.
- [ ] `glasses-01` and `shoes-01` remain visible on `character-02`.
- [ ] BRAIN controls are readable and touch targets are comfortable.
- [ ] SETUP clearly shows scenario, objective and opponent.
- [ ] `ДРУГОГО →` changes opponent only before PLAY.
- [ ] STEP progression is obvious.
- [ ] AUTO pause/resume is obvious.
- [ ] TALK keeps both characters visually readable.
- [ ] No character jumps/clips unexpectedly during head/arm motion.
- [ ] HOT PATCH appears before the dangerous turn is committed.
- [ ] HOT PATCH can be understood and applied with one hand.
- [ ] After patch, the same turn resumes rather than skipping forward.
- [ ] RESULT explains the actual failure/consequence rather than looking like a generic score.
- [ ] Rerun returns to BRAIN with one-node change semantics clear.
- [ ] Counterfactual replay keeps the same opponent baseline.
- [ ] BEFORE / AFTER comparison is readable without zooming.

## Gate A — Android Chrome

Repeat the same full flow and additionally check:

- [ ] Dynamic browser bottom bar does not cover controls.
- [ ] Viewport resize while Chrome UI expands/collapses does not create clipped panels.
- [ ] Horizontal variant rail remains isolated from page scrolling.
- [ ] Back gesture/browser navigation does not accidentally destroy the active flow during normal use.

## Orientation / scope rule

Portrait is the release gate for this slice. Landscape observations may be recorded, but landscape-only defects are not blockers unless they break recovery back to portrait.

Do not expand assets or add new mechanics during this gate. Fix only reproducible defects in the approved slice.

## Bug record

For each failure record:

```text
Device:
OS / browser:
Screen / orientation:
Step:
Expected:
Actual:
Reproducible: yes / no
Blocking: yes / no
Screenshot/video:
```

Blocker examples:

- cannot progress through the slice;
- primary action covered by browser chrome;
- exact SVG part disappears or clips materially;
- body switch corrupts appearance state;
- HOT PATCH consumes the wrong turn;
- replay changes opponent baseline;
- unreadable core text without zoom.

## Gate D — FUN PASS

Use a fresh adult tester who has not been taught the architecture.

Do not explain BehaviorGraph, state machine, renderer or replay implementation before the run.

Observe whether the person can:

1. build a character without instruction;
2. understand that BRAIN changes behavior, not clothes;
3. understand who the opponent is and what the objective is;
4. start and watch the encounter without selecting every dialogue line;
5. interpret HOT PATCH as intervention in a cause;
6. understand the Result;
7. choose one thing to change and rerun.

Strong success signal:

> «А что будет, если я вот это поменяю?»

Record only observable evidence:

```text
Tester:
Device:
Needed instruction at PERSON: yes / no
Needed instruction at BRAIN: yes / no
Needed instruction at SETUP: yes / no
Understood HOT PATCH without explanation: yes / no
Understood RESULT without explanation: yes / no
Initiated / requested rerun: yes / no
Exact quote / reaction:
Blocking confusion:
```

## Exit condition

The vertical slice may move toward integration only when:

- iPhone Safari has no blocking Gate A defect;
- Android Chrome has no blocking Gate A defect;
- at least one fresh tester completes Gate D;
- any remaining defects are explicitly classified as non-blocking.

Until then: **PR to `dementor-club-site` remains NOT READY.**
