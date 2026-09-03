# DEMENTOR LAB — Trigger Hub implementation v0.1

**Status:** IMPLEMENTED / FINAL AUTOMATED GATE RUNNING  
**Date:** 2026-09-03  
**Branch:** `agent/dementor-lab-vertical-slice-v0.3`

## Contract

Runtime BehaviorGraph is unchanged. Trigger nodes remain real entry nodes and their edges remain causal.

Mobile BRAIN projects Trigger infrastructure into one compact block:

**НА ЧТО Я РЕАГИРУЮ**

- collapsed presets show trigger chips instead of six full stack cards;
- expanded hub shows every real Trigger, description, and **all immediate destinations**;
- selecting a Trigger highlights its downstream route;
- `СВЯЗАТЬ` edits the real Trigger edge;
- custom BRAIN with no Trigger asks `НА ЧТО ТЫ РЕАГИРУЕШЬ?`;
- custom BRAIN keeps the Trigger Hub open while authoring;
- authored presets default to a compact/collapsed Hub;
- trigger nodes remain available through `+ УЗЕЛ`;
- generated/opponent runtime semantics are not changed.

## Authoring invariant

`Hide infrastructure, never hide causality.`

With multiple Trigger entry nodes the vertical body auto-sequence must not invent a hidden entry edge because two nodes happen to be adjacent in the UI array. Trigger edges are authored/explicit. The normal non-trigger body remains fast to reorder as a vertical sequence.

If one Trigger has multiple outgoing edges, the expanded Hub lists all immediate destinations (for example `→ БЫТЬ ПРАВЫМ · ОБЪЯСНИТЬ`) rather than silently showing only the first branch.

## UI projection invariant

A Trigger → body connection belongs to the Trigger Hub projection and is not duplicated as a second metro line inside the behavioral body stack. Body-stack edge counts therefore describe only visible body-to-body causality.

## Related mobile control repair

The BRAIN parameter bottom sheet now initializes its slider state synchronously. A first immediate keyboard/touch change cannot be overwritten by a delayed initialization frame.

## QA expectations

- Trigger Hub is one mobile block.
- Collision-ready preset exposes six Trigger chips while the main stack contains only behavioral body cards.
- Custom authoring keeps the Hub open by default.
- Expanding the hub reveals real Trigger rows.
- Trigger → body connection uses the real graph node.
- Multiple Trigger destinations remain visible in the expanded Hub.
- Selecting/connecting a Trigger highlights its downstream route.
- Body drag/reorder does not destroy Trigger ownership.
- Parameter bottom sheet keeps the first user change.
- No page-level horizontal overflow on iPhone-sized viewport.
- Runtime deterministic regression suite remains unchanged/green.
