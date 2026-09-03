# DEMENTOR LAB — REACTION STRATEGY AUDIT v0.1

Status: IMPLEMENTED / QA

## Goal

A Reaction must not be a cosmetic label over nearly identical metric deltas. Each Reaction needs a distinct strategic role, a distinct benefit, and a distinct cost.

## Strategy identities

### ОБЪЯСНИТЬ
Role: cognitive pressure.

- Costs meaningful ENERGY.
- Raises the speaker's BRAIN/TENSION.
- Also raises the listener's BRAIN.
- Damages CONTACT moderately rather than catastrophically.
- Emits COUNTERPOINT → PUSHBACK, keeping the argument alive.

Use when the character is willing to risk heat to keep pushing an explanation.

### СОГЛАСИТЬСЯ
Role: relationship repair.

- Strongest CONTACT repair on the listener.
- Strong TENSION reduction.
- Explicit ACCEPTANCE cancels the other character's pending REPEAT.
- Does not attack the listener's resources.

Use when preserving the relationship matters more than winning the argument.

### ПОШУТИТЬ
Role: tension release / deflection.

- Strongest immediate TENSION reduction.
- Only weak CONTACT repair.
- Does not count as ACCEPTANCE and therefore does not cancel REPEAT.
- Emits DEFLECTION, creating a different next Trigger from agreement.

Use when the character wants to cool the scene without actually conceding.

### ПРОМОЛЧАТЬ
Role: energy survival.

- Cheapest Reaction by ENERGY cost.
- Adds only a small amount of internal heat.
- Loses CONTACT because the listener receives NO_RESPONSE → IGNORE.

Use when conserving resources matters more than maintaining connection.

### ДАВИТЬ
Role: aggressive depletion.

- Highest relational and tension cost.
- Raises the speaker's BRAIN/TENSION sharply.
- Directly drains the listener's ENERGY and raises the listener's BRAIN.
- Emits PRESSURE → UNDERPRESSURE.

Use when the character is willing to sacrifice CONTACT to overwhelm the other side.

## Regression invariants

QA must preserve these inequalities/relationships rather than only exact numbers:

- AGREE repairs more target CONTACT than JOKE.
- JOKE reduces target TENSION more than AGREE.
- SILENT costs less self ENERGY than EXPLAIN.
- EXPLAIN creates positive target BRAIN load.
- PRESSURE drains target ENERGY and adds target BRAIN load.
- PRESSURE damages target CONTACT more than EXPLAIN.
- ACCEPTANCE continues to cancel pending REPEAT.

## Design principle

`Every Reaction buys something and sacrifices something.`

A dangerous Reaction is allowed to be dangerous, but it must not be mechanically pointless. A safe Reaction is allowed to be strong, but it must not solve every problem at once.
