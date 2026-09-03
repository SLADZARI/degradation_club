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
The BRAIN screen exposes one BehaviorGraph at two clearly separated levels:
1. `КАК Я СЕБЯ ВЕДУ` — the human-readable behavior sentence. This is the comprehension layer and appears before editor mechanics.
2. `ИЗ ЧЕГО ЭТО СОБРАНО` — the real node/edge editor for changing the same graph.

The readable layer uses natural character language, not engine-family labels. Examples:
- criticism → `КОГДА МЕНЯ КРИТИКУЮТ`
- resentment → `ОБИЖАЮСЬ +1`
- beright → `ХОЧУ БЫТЬ ПРАВЫМ`
- understand → `ПЫТАЮСЬ ПОНЯТЬ`
- explain → `НАЧИНАЮ ОБЪЯСНЯТЬ`
- agree → `СОГЛАШАЮСЬ`
- joke → `ОТШУЧИВАЮСЬ`
- silent → `ЗАМОЛКАЮ`
- pressure → `НАЧИНАЮ ДАВИТЬ`
- repeat → `ПОВТОРЯЮ ДО ×N`
- stop → `ОСТАНАВЛИВАЮСЬ`
- ifbrain → `ЕСЛИ BRAIN ВЫШЕ N`
- pause → `БЕРУ ПАУЗУ`

A readable step is clickable and focuses the exact real Trigger/node in the editor. The readable layer never stores its own route state.

The editor heading is deliberately secondary. It may explain editing affordances, but it must not repeat the behavioral meaning already communicated by `КАК Я СЕБЯ ВЕДУ`.

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
- every additional real outgoing edge is rendered under its source step as `ИЛИ → <NATURAL PHRASE>`;
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
- readable behavior appears before editor chrome;
- body node gaps are reduced to 9px;
- `ADD NODE` sits close to the causal stack;
- primary action follows the graph without a large dead zone.

The Hub may grow when explicitly opened for editing. Density optimizations must never hide route destinations, connect actions, or validation errors.

## Connection target
CONNECT MODE must preserve enough width for both target title and the `СОЕДИНИТЬ` touch target.
No connection action may require horizontal scrolling.

## QA note
SVG edge focus is painted on `requestAnimationFrame`; browser smoke waits for the visual frame before asserting edge focus. This is a test timing contract, not a gameplay delay.
Browser smoke verifies that:
- the readable route starts from the real configured Trigger using natural-language copy;
- the readable layer is labelled `КАК Я СЕБЯ ВЕДУ`;
- the editor is labelled `ИЗ ЧЕГО ЭТО СОБРАНО`;
- an authored side branch appears in the readable layer as conversational `ИЛИ`.

## Principle
`Understand the character first; edit the machinery second. One graph, two views, no duplicate truth.`
