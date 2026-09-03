# DEMENTOR LAB — IMPULSE / PAUSE STRATEGY AUDIT v0.1

Status: IMPLEMENTED / QA

## Goal

Impulses and abilities must create trade-offs, not simply add more good numbers to a path.

## Impulses

### БЫТЬ ПРАВЫМ
Role: escalation drive.

- Strongly increases route selection weight through W1–W5.
- Adds BRAIN and TENSION when the route executes.
- Damages the other side of CONTACT.

The player buys decisiveness and pays with heat and relationship safety.

### НРАВИТЬСЯ
Role: self-regulation / social smoothing.

- Reduces the character's own TENSION.
- Supports self CONTACT and gives a small benefit to the other side.
- Adds no BRAIN surcharge.

The player buys calm and social safety rather than deep engagement.

### ПОНЯТЬ
Role: relational investment.

- Improves the other side of CONTACT more than НРАВИТЬСЯ.
- Reduces the listener's TENSION.
- Costs BRAIN on the acting character.

The player buys better mutual contact by spending cognitive capacity.

## PAUSE

PAUSE is a regulation ability, not a free buff.

It still strongly reduces BRAIN/TENSION and supports target CONTACT, but now consumes meaningful ENERGY. This creates a real decision: spend stamina now to avoid escalation, or keep stamina and accept more heat.

Current invariant:
- PAUSE self ENERGY cost is at least 4;
- PAUSE still reduces self BRAIN and TENSION;
- PAUSE still improves target CONTACT.

## Regression invariants

- BE RIGHT adds BRAIN and damages target CONTACT.
- BE LIKED reduces self TENSION without adding self BRAIN.
- UNDERSTAND improves target CONTACT more than BE LIKED.
- UNDERSTAND adds self BRAIN cost.
- PAUSE has a meaningful ENERGY price while preserving its regulation role.

## Principle

`Regulation must cost something. Escalation must buy something.`
