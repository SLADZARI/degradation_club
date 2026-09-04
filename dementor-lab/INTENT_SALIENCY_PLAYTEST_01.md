# DEMENTOR LAB — Intent / Saliency Playtest 01

Status: EXECUTED / EXPERIMENTAL
Branch: `experiment/dementor-lab-intent-saliency-v0.5`

## Question
Can the same visible Reaction (`EXPLAIN`) produce a legibly different World Event because the target character is in a different relationship/state context, while staying deterministic?

## Fixed input
- Player impulse: `BE_RIGHT`
- Player reaction: `EXPLAIN`
- Derived intent: `MAKE_UNDERSTOOD`
- No RNG / no LLM.

## Case A — baseline Marta
Target state used for the saliency decision:
- CONTACT 60
- TENSION 17
- BRAIN 15
- TRUST 0
- RESENTMENT 0

Ranking:
1. `COUNTERPOINT` — 70.8
2. `ACCEPTANCE` — 46.75
3. `NO_RESPONSE` — 8.0

Winner: `COUNTERPOINT → pushback`.

Read: the existing game behavior is preserved. Gena explains; Marta pushes back.

## Case B — warm / trusted Marta
Target state:
- CONTACT 92
- TENSION 4
- BRAIN 15
- TRUST 3
- RESENTMENT 0

Ranking:
1. `ACCEPTANCE` — 79.2
2. `COUNTERPOINT` — 65.6
3. `NO_RESPONSE` — 8.0

Winner: `ACCEPTANCE → acceptance`.

Read: the exact same `EXPLAIN` is accepted because the relationship context is materially different. This is the intended proof of the saliency layer: action stays the same; reception changes because state/memory changed.

## Case C — overloaded / disengaged Marta
Target state:
- CONTACT 12
- TENSION 20
- BRAIN 96
- TRUST 0
- RESENTMENT 0

Ranking:
1. `COUNTERPOINT` — 72.0
2. `NO_RESPONSE` — 55.2
3. `ACCEPTANCE` — 29.2

Winner: `COUNTERPOINT`.

Read: this is the useful failure found by the playtest. At BRAIN 96 + CONTACT 12 the human expectation is closer to shutdown / disengagement, but the current formula still makes resistance dominate. The layer is therefore directionally useful but the `NO_RESPONSE` saliency curve is too weak at severe overload / collapsed contact.

## Verdict
**KEEP THE EXPERIMENT, DO NOT PROMOTE TO CANON YET.**

The core hypothesis passes: baseline and high-trust states produce different, deterministic reception of the same Reaction, and the difference is causally legible.

The playtest also found a concrete balance flaw: `EXPLAIN` under severe overload still prefers `COUNTERPOINT` when `NO_RESPONSE` should plausibly win. Before integrating into canonical runtime, add a strong overload/collapse term or threshold for disengagement and re-run the same three-case playtest.

## Product read
The layer is valuable only if TALK exposes enough of the causal change for the player to understand it. The UI should not show saliency scores, but the trace can explain the difference in human terms, e.g.:

- baseline: `Марта возражает`;
- after trust/contact change: `Марта принимает объяснение`;
- overload state: expected `Марта перестаёт отвечать` after tuning.

This preserves the principle: **Graph/state is cause. Dialogue is output.**
