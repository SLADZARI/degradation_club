# DEMENTOR LAB — BRAIN CARD HIERARCHY v0.1

Status: IMPLEMENTED / QA GATE

## Closed card
A closed behavioral node shows only information required to read the causal chain:
1. FAMILY / TYPE
2. NODE TITLE
3. PARAMETER VALUE when the node owns one (`W4`, `×2`, `+1`, `>70`)
4. DIRECT OUTGOING ROUTE (`→ ...`) when one exists

The full semantic description is not permanently visible in the stack.

## Open card
Tap reveals the node action drawer and the full semantic description. The card may grow vertically; readability takes priority over fixed height.

## Connection visibility
A real authored connection must be readable in three equivalent ways:
- graph line;
- `→ DESTINATION` label on the source card;
- acid focus on the selected source, its edge(s), and directly related node(s).

## Principle
`Hide explanation until requested; never hide causality.`

This hierarchy applies consistently to STATE, IMPULSE, REACTION, CONTROL and ABILITY nodes. Trigger infrastructure remains projected through Trigger Hub under its separate approved contract.
