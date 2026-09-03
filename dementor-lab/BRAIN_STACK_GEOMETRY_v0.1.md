# DEMENTOR LAB — BRAIN STACK GEOMETRY v0.1

Status: IMPLEMENTED / QA GATE

## Mobile-first geometry
- BRAIN stack reserves a stable left causal rail before card content.
- Cards keep maximum readable width; controls must not permanently steal horizontal space.
- Vertical spacing separates nodes without breaking the sense of one causal chain.
- Drag handle remains a dedicated touch target, visually separated from semantic content.

## Open card
On mobile, opening a card must not shift its semantic content sideways into a narrow column.
Actions reveal as an internal horizontal row while the card body keeps full usable width.

## Branches
A source with 2–3 outgoing routes must remain legible without opening an inspector.
The source card may show the direct route label on up to two lines.
The graph rail/edge layer remains the authoritative visual connection.

## Connection target
CONNECT MODE must preserve enough width for both target title and the `СОЕДИНИТЬ` touch target.
No connection action may require horizontal scrolling.

## Principle
`Reserve space for causality; do not sacrifice the readable character card to editor chrome.`
