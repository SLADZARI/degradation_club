# DEMENTOR LAB — Portrait UX Prototype Spec v0.1

Status: EXPERIMENTAL / UX PROTOTYPE / NON-CANON
Branch: `experiment/dementor-lab-portrait-flow-v0.7`
Base: `experiment/dementor-lab-ux-causality-v0.6`

## 1. Product decision

The current runtime is already rich enough to produce interesting encounters, but the first-time experience exposes too much of the machinery. The next prototype must make the game read as a sequence of human situations, not as a graph editor or telemetry console.

Core player fantasy:

> Собери человека → выбери, с каким мозгом он пойдёт в ситуацию → посмотри, что он натворит → пойми почему → измени одну причину → проверь ещё раз.

The prototype does **not** change balance, encounter rules, saliency formulas, REPEAT semantics, opponent generation or result causality. It changes presentation, order and depth.

## 2. Portrait-first rule

Full-body characters are removed from the primary game flow. The main visual object is a large portrait.

Why:
- dialogue is the primary activity;
- facial state communicates gameplay faster than clothing or body pose;
- larger faces make speaker / listener / failure state readable on mobile;
- portrait cards free vertical space for conversation;
- current SVG contracts already separate eyes / brows / mouth, so the prototype can project runtime state into a face without changing the encounter engine.

Required portrait states for v0.1:
1. `neutral`
2. `listening`
3. `confident`
4. `annoyed`
5. `heated`
6. `meltdown`
7. `defeated`

The renderer may map these product states onto currently available SVG layers (`eyes-*`, `brows-*`, `mouth-*`) and small head motion. Missing variants must fall back safely to neutral.

## 3. Information architecture

Primary flow:

`INTRO → NAME → PORTRAIT → CASE → BRAIN PRESET → VS → TALK → RESULT → FIX/RERUN`

Secondary flow:

`INTRO / RESULT → ARCHIVE → EXPERIMENT LIST → EXPERIMENT DETAIL`

Advanced flow:

`BRAIN PRESET → СОБРАТЬ СВОЙ → existing BRAIN editor`

The advanced editor is never required for the first successful playthrough.

## 4. Screen contracts

### 00 — INTRO
Goal: explain the game in under 10 seconds.

Visible:
- DEMENTOR LAB
- `СОБЕРИ ХАРАКТЕР. ПРОВЕРЬ ЕГО В РАЗГОВОРЕ. ПОСМОТРИ, ЧТО СЛОМАЕТСЯ.`
- primary CTA `НАЧАТЬ ЭКСПЕРИМЕНТ →`
- secondary CTA `АРХИВ`

No metrics, graph language or technical terminology.

### 01 — NAME
Goal: establish identity.

Visible:
- `КАК ЕГО ЗОВУТ?`
- one text field
- CTA `ДАЛЬШЕ →`

No appearance controls yet.

### 02 — PORTRAIT
Goal: establish visual identity without turning the page into a character editor dashboard.

Visible:
- large portrait taking ~55–65% of useful height;
- 3–4 horizontal categories only: `ГОЛОВА / ЛИЦО / АКСЕССУАР` (+ body choice only if necessary);
- one row of variants for the selected category;
- CTA `ГОТОВО →`.

Not visible:
- full body;
- outfit/shoe engineering controls;
- ownership labels `ОБЩ / СВОЁ`;
- rig controls.

### 03 — CASE
Goal: make the player enter a human situation before seeing mechanics.

Visible:
- situation title;
- 2–3 line premise;
- objective choice;
- opponent portrait, name and one behavioral sentence;
- CTA `ВЫБРАТЬ МОЗГ →`.

Example:

`НЕУДОБНЫЙ ВОПРОС`

> Ира уже дважды ответила не совсем на тот вопрос. Тебе всё ещё нужен прямой ответ.

Objectives:
- `СОХРАНИТЬ КОНТАКТ`
- `ДОБИТЬСЯ ОТВЕТА`

### 04 — BRAIN PRESET
Goal: let a new player choose behavior without understanding BehaviorGraph.

First layer is a set of large cards:
- `Я ВСЁ ОБЪЯСНЮ`
- `ЛИШЬ БЫ НЕ РУГАЛИСЬ`
- `Я ВСЕГДА ПРАВ`
- `ПЕРЕВЕДУ В ШУТКУ`

Each card contains:
- one human rule;
- one short risk / strength;
- no node IDs, weights or graph connections.

Secondary CTA:
- `СОБРАТЬ СВОЙ МОЗГ →` opens the existing advanced BRAIN editor.

### 05 — VS
Goal: create a clear start-of-round beat.

Visible:
- large player portrait;
- large opponent portrait;
- names;
- selected brain preset labels;
- one concise objective contract;
- `AUTO / STEP`;
- CTA `ПОЕХАЛИ →`.

No editing from this screen.

### 06 — TALK
Goal: make the conversation own the viewport.

Priority order:
1. portraits / speaker state;
2. dialogue;
3. objective progress;
4. only then diagnostics.

Portraits:
- two large cropped faces;
- active speaker receives acid highlight + subtle mouth/head animation;
- listener shows reaction state;
- loser card darkens / desaturates.

Default visible metrics:
- `BRAIN`
- `CONTACT`

Conditional / hidden metrics:
- `TENSION` appears as an event when significant;
- `ENERGY` appears as an event when significant;
- full metric panel lives behind `СТАТУС +` if needed.

Dialogue:
- speaker name above the line;
- latest lines dominate the space;
- avatars are optional because portraits already establish identity.

Causality disclosure:
- default closed button `ПОЧЕМУ ТАК? +`;
- opened form shows only:
  - `ТЫ СДЕЛАЛ` → reaction;
  - `СОБЕСЕДНИК ВОСПРИНЯЛ` → world event;
  - `ПОЭТОМУ СРАБОТАЛО` → next trigger;
  - one small state hint only when it materially explains saliency.

Technical trace remains one level deeper.

### 07 — HOT PATCH
Goal: interrupt an obvious self-destructive causal loop without opening the whole editor first.

Visible:
- one causal observation;
- highlighted chain;
- one suspected node;
- CTA `ПОЧИНИТЬ ОДНУ ВЕЩЬ`;
- secondary `ОСТАВИТЬ КАК ЕСТЬ`.

Only after confirmation may the prototype reveal the narrow editor for the selected node.

### 08 — RESULT
Goal: deliver payoff as a postmortem, not as a technical report.

Order:
1. verdict / punchline;
2. `ЧТО ПРОИЗОШЛО` — one short human explanation;
3. `ПОЧЕМУ` — one causal chain;
4. `ЧТО ПОПРОБОВАТЬ ПОЧИНИТЬ` — one node;
5. actions.

Actions:
- `ИЗМЕНИТЬ ОДНУ ВЕЩЬ →`
- `СЫГРАТЬ ЕЩЁ РАЗ`
- `В АРХИВ`

Detailed metrics and ExecutionTrace are secondary disclosure.

### 09 — BEFORE / AFTER
Goal: make the counterfactual experiment visually obvious.

Two cards:

`БЫЛО`
- key behavior count;
- BRAIN outcome;
- CONTACT outcome.

`СТАЛО`
- same three measures.

One closing observation. No moral or diagnosis.

### 10 — ARCHIVE
Goal: create return value outside the current encounter.

Top-level sections:
- `ЭКСПЕРИМЕНТЫ`
- `ПЕРСОНАЖИ`
- `ПОЛОМКИ`
- `ИСПРАВЛЕНИЯ`

For v0.1 only `ЭКСПЕРИМЕНТЫ` must be interactive; the other blocks may be previews.

Experiment card contains:
- situation;
- actor vs opponent;
- outcome;
- one memorable causal marker;
- date / run number only if useful.

### 11 — ARCHIVE DETAIL
Goal: preserve the full battle as a readable story.

Sections:
1. summary: who / where / objective / outcome;
2. key dialogue moments;
3. causal chain;
4. state turning points;
5. what was changed in rerun;
6. BEFORE / AFTER.

The full technical trace may be available behind `ТЕХНИЧЕСКИЙ TRACE +`, but must not be the default reading surface.

## 5. Emotion projection v0.1

Product state → suggested SVG projection:

- `neutral`: neutral eyes + neutral brows + neutral mouth
- `listening`: neutral/sleepy eyes + neutral brows + neutral mouth, slight orientation to partner
- `confident`: neutral eyes + neutral brows + soft mouth
- `annoyed`: tense eyes + tense/angry brows + tense mouth
- `heated`: tense/overheat eyes + angry brows + tense/open mouth
- `meltdown`: overheat eyes + angry brows + open mouth + instability
- `defeated`: sleepy eyes + neutral/tense brows + tense mouth + reduced contrast / lowered head

Emotion is derived from actual runtime state / reaction and must not invent an outcome that did not happen.

## 6. Mobile density rules

- One question per screen.
- One primary CTA per screen.
- No more than two persistent gameplay metrics in TALK.
- Advanced diagnostics are opt-in.
- Minimum primary body text: 15–16 px.
- Minimum primary touch target: 44 px.
- Portraits occupy more visual area than controls.
- No screen should require understanding more than one new game concept before proceeding.

## 7. Archive data contract

Prototype archive record:

```js
{
  runId,
  createdAt,
  scenarioId,
  scenarioTitle,
  objective,
  player:{name, characterId, brainPresetId},
  opponent:{name, profileId},
  outcome:{winner, reason, turn},
  highlights:[
    {turn, speaker, line, event, brain, contact}
  ],
  causalChain,
  suspiciousNode,
  rerun:{changedNode, before, after} | null
}
```

For the UX prototype this may live in `localStorage`. Production persistence is out of scope.

## 8. Prototype gate

The portrait flow succeeds if a new tester can answer, without explanation:

1. Who am I playing?
2. What situation am I in?
3. What brain did I choose?
4. What am I trying to achieve?
5. Who is speaking now?
6. Why did the opponent react that way?
7. Why did I win / lose?
8. What one thing can I change?
9. Where can I see what happened before?

If any answer requires reading technical trace or opening the BRAIN editor, the UX gate fails.

## 9. Rollback boundary

This branch is intentionally isolated. No merge is implied.

Rollback target:

`experiment/dementor-lab-ux-causality-v0.6`

The portrait prototype may freely change navigation, screen count, portrait layout and archive surfaces, but must not silently change the encounter runtime or balance.