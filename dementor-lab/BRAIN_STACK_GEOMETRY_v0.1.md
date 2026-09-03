# DEMENTOR LAB — BRAIN STACK GEOMETRY v0.1

Status: IMPLEMENTED / FINAL QA

## Mobile-first geometry
- BRAIN stack reserves a stable left causal rail before card content.
- Cards keep maximum readable width; controls must not permanently steal horizontal space.
- Vertical spacing separates nodes without breaking the sense of one causal chain.
- Drag handle remains a dedicated touch target, visually separated from semantic content.

## Open card
On mobile, opening a card must not shift its semantic content sideways into a narrow column.
Actions reveal as an internal horizontal row while the card body keeps full usable width.

## Human-readable behavior projection
The BRAIN screen exposes the same BehaviorGraph at two levels:
1. `КАК ЭТО СРАБОТАЕТ` — readable behavioral sentence for comprehension.
2. The card stack and metro edges — editor for changing the same graph.

Readable roles are human-facing projections of node families:
- TRIGGER → `КОГДА`
- STATE → `Я ЧУВСТВУ`
- IMPULSE → `Я ХОЧУ`
- REACTION → `Я ДЕЛАЮ`
- CONTROL → `ДАЛЬШЕ`
- ABILITY → `Я МОГУ`

A readable step is clickable and focuses the exact real Trigger/node in the editor. The readable layer never stores its own route state.

## Branches
A source with 2–3 outgoing routes must remain legible without opening an inspector.
The source card may show the direct route label on up to two lines.
The graph rail/edge layer remains the authoritative visual connection.

The editor distinguishes two visual roles without changing runtime semantics:
- `PRIMARY ROUTE` — the inner metro lane and strongest continuous line; it represents the main readable stack progression.
- `SIDE BRANCH` — authored/manual additional routes; they occupy outer left lanes, use a lighter broken line, and never compete visually with the primary route.
- When a source has several outgoing edges, port slots are separated vertically so lines leave the source independently rather than overlap.
- Selecting a node temporarily promotes every real connected edge to full acid focus, including side branches.

The readable projection mirrors the same distinction:
- primary continuation stays in the main behavioral sentence;
- every additional real outgoing edge is rendered under its source step as `ИЛИ → <TARGET>`;
- tapping an alternative opens the exact target node;
- the `ИЛИ` surface never creates, deletes, or reorders edges.

Primary/side is a UI reading hierarchy only. It must never alter execution order or silently create/remove graph edges.

## Screen density
The BRAIN screen is one instrument, not a stack of separate admin panels.
On phone:
- title/intro spacing is reduced but hierarchy remains readable;
- preset rail uses 38px compact controls;
- validation is a compact status strip rather than a large card;
- collapsed Trigger Hub is 54px high plus compact chips;
- body node gaps are reduced to 9px;
- `ADD NODE` sits close to the causal stack;
- primary action follows the graph without a large dead zone.

The Hub may grow when explicitly opened for editing. Density optimizations must never hide route destinations, connect actions, or validation errors.

## Connection target
CONNECT MODE must preserve enough width for both target title and the `СОЕДИНИТЬ` touch target.
No connection action may require horizontal scrolling.

## QA note
SVG edge focus is painted on `requestAnimationFrame`; browser smoke waits for the visual frame before asserting edge focus. This is a test timing contract, not a gameplay delay.
Browser smoke also verifies that an authored side branch appears in the readable layer as `ИЛИ`, so readable causality cannot silently diverge from the BehaviorGraph.

## Principle
`One main line to read; side lanes and ИЛИ for alternatives. Visual hierarchy never changes causality.`
