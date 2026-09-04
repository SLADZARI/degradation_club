# DEMENTOR LAB — PHYSICAL PLAYTEST PROTOCOL v0.1

Status: ACTIVE after automated mobile gates are green.

## Purpose
Test whether a new player can understand and complete the vertical slice on a real phone without developer commentary.

This is not a bug-hunt script. It is a comprehension test.

## Device
Primary: iPhone / narrow mobile viewport.
Start from a fresh session when possible so first-run guidance is visible.

## Rule for observer
Do not explain controls, goals, BRAIN semantics, or failure causes while the player is acting.
If the player asks a question, record the question before answering.

## One uninterrupted path
`PERSON → BRAIN → SETUP → TALK → RESULT → REPAIR`

### 1. PERSON
Prompt only: **«Собери себя и продолжай.»**
Observe:
- does the player notice that name is required?
- do appearance controls read as appearance rather than mechanics?
- does the player discover BRAIN through the persistent navigation?

Pass signal: the player reaches BRAIN without being told where BRAIN is.

### 2. BRAIN
Prompt only: **«Собери, как ты обычно реагируешь.»**
Observe:
- can the player explain `ВХОДЫ → ЦЕПОЧКА → РЕЗУЛЬТАТ` in their own words?
- do they understand that lines mean causality?
- do they expect adding a card to create a connection automatically?
- can they connect an input to a behavioral chain?
- do they understand why SETUP is blocked when the chain cannot run?

Pass signal: player creates or selects a runnable BRAIN without developer explanation.

### 3. SETUP
Give no prompt.
Ask after 5–10 seconds:
1. **«Что сейчас произойдёт?»**
2. **«Чего ты пытаешься добиться?»**
3. **«Как здесь проиграть?»**

Pass signal: situation, goal and loss condition are all recoverable from the screen.

### 4. TALK
Let the encounter run or advance by STEP.
Observe:
- who does the player think is speaking?
- can they follow the latest exchange without reading technical evidence?
- do they understand visible human consequences?
- do they open `ПОЧЕМУ ТАК?` voluntarily when causality is unclear?

Pass signal: player can describe what their character did and what changed before opening technical detail.

### 5. RESULT
Before touching anything ask:
- **«Почему всё закончилось именно так?»**
- **«Что бы ты поменял?»**

Pass signal: answer refers to a behavior/mechanism, not only to score numbers.

### 6. REPAIR
Prompt only: **«Попробуй исправить результат.»**
Observe:
- does `ПОЧИНИТЬ МОЗГ` clearly return to the same experiment?
- does the suggested suspicious node read as a recommendation, not a forced edit?
- can the player change any relevant BRAIN node and rerun?

Pass signal: player performs one counterfactual rerun without being told which exact control to use.

## What to record
For every hesitation, record only:
- SCREEN
- WHAT THE PLAYER TRIED
- WHAT THEY EXPECTED
- WHAT HAPPENED
- SEVERITY: BLOCKER / CONFUSION / POLISH

Do not turn observations into solutions during the session.

## Stop conditions
Stop the test and mark BLOCKER if the player:
- cannot leave PERSON after entering required identity;
- cannot make/select a runnable BRAIN;
- cannot state the SETUP goal;
- cannot distinguish speaker/target in TALK;
- reaches RESULT but cannot find a way to continue/repair.

## Acceptance
The vertical slice is ready for an external playtest when:
- automated deterministic QA is green;
- iPhone browser smoke is green;
- one physical run completes the whole path without observer instruction;
- no BLOCKER remains;
- repeated confusion is converted into a product issue before adding new mechanics.

## Product rule
**During playtest, confusion is evidence. Do not explain away the interface.**
