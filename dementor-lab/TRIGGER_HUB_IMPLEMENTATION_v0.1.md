# DEMENTOR LAB — Trigger Hub implementation v0.1

**Status:** IMPLEMENTED / QA pending  
**Date:** 2026-09-03  
**Branch:** `agent/dementor-lab-vertical-slice-v0.3`

## Contract

Runtime BehaviorGraph is unchanged. Trigger nodes remain real entry nodes and their edges remain causal.

Mobile BRAIN projects Trigger infrastructure into one compact block:

**НА ЧТО Я РЕАГИРУЮ**

- collapsed presets show trigger chips instead of six full stack cards;
- expanded hub shows every real Trigger, description, and current first destination;
- selecting a Trigger highlights its downstream route;
- `СВЯЗАТЬ` edits the real Trigger edge;
- custom BRAIN with no Trigger asks `НА ЧТО ТЫ РЕАГИРУЕШЬ?`;
- trigger nodes remain available through `+ УЗЕЛ`;
- generated/opponent runtime semantics are not changed.

## Authoring invariant

`Hide infrastructure, never hide causality.`

With multiple Trigger entry nodes the vertical body auto-sequence must not invent a hidden entry edge because two nodes happen to be adjacent in the UI array. Trigger edges are authored/explicit. The normal non-trigger body remains fast to reorder as a vertical sequence.

## QA expectations

- Trigger Hub is one mobile block.
- Collision-ready preset exposes six Trigger chips while the main stack contains only behavioral body cards.
- Expanding the hub reveals real Trigger rows.
- Trigger → body connection uses the real graph node.
- Selecting/connecting a Trigger highlights its downstream route.
- Body drag/reorder does not destroy Trigger ownership.
- No page-level horizontal overflow on iPhone-sized viewport.
- Runtime deterministic regression suite remains unchanged/green.
