# DEMENTOR LAB — BRAIN Edit Integrity Contract v0.1

Status: APPROVED FOR QA

## Principle
Visual editing must never silently rewrite causal meaning.

## Reorder
- Dragging a body card changes presentation order only.
- Edge count and edge endpoints stay unchanged.
- A runnable custom graph stays runnable after visual reorder.

## Delete
- Deleting a non-trigger node removes that node and only incident edges.
- Deletion must not rebuild a synthetic sequence across the remaining cards.
- Trigger infrastructure remains fixed.

## Add / connect
- Adding a node does not auto-wire it.
- Causal connections are created explicitly through CONNECT mode.

## Visible editor
- Service copy explaining that the editor exists is not repeated inside the mechanism block.
- Real edges, card labels and the human behavior projection carry the mental model.

## Invariant
`card order ≠ causal order; only explicit edges define behavior`
