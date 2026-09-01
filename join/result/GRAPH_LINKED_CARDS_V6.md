# DC-9 Result — Graph Linked Cards v6

Status: **CURRENT WORKING REFERENCE**  
Approved by user direction: **2026-09-01**

Supersedes: `GRAPH_LINKED_CARDS_V5.md`.

## Result contract

- nine spheres remain nine independent results;
- there is no aggregate DC-9 score;
- public level names are:
  - 0 — `Неприлично функционален`;
  - 1 — `Первые нарушения режима`;
  - 2 — `Деградация началась`;
  - 3 — `Стабильно хуже`;
  - 4 — `Случай запущен`;
  - 5 — `Показано дементорство`;
- if all nine final sphere levels are 5, the result page switches to the special state `К ДЕМЕНТОРСТВУ ГОТОВ` with the line `Срочно в клуб.`;
- special 9×5 state is a join transition, not a seventh diagnostic level.

## Scoring v0.9 on the result surface

The result page recalculates the displayed sphere level from stored evidence when four tag levels plus both guards are available.

`weightedAverage = Σ(answerScore × questionWeight) / Σ(questionWeight)`

Thresholds:
- 0: `< 0.35`
- 1: `0.35–0.94`
- 2: `0.95–1.29`
- 3: `1.30–1.69`
- 4: `1.70–2.14`
- 5: `≥ 2.15`

Level 5 also requires both authored core questions in the sphere to have canonical answer score `≥ 2`.

Guards do not add points. They only cap false high results:
- responsibility `0` → max level 2;
- intentionality `0` → max level 3;
- either guard `1` → max level 4;
- both guards `2–3` → no additional cap.

Legacy stored tag levels are converted back to canonical 0–3 evidence for result recalculation. If evidence is insufficient, the page falls back to the stored level instead of inventing missing data.

## Radar / “rose” graph v6

The graph is a map, not a total score.

- center explicitly means `0`;
- outer contour explicitly means `5`;
- all five rings are labelled;
- all nine sphere nodes are visible;
- each desktop axis exposes sphere name and `/5` value;
- mobile uses `pictogram → sphere → /5`, without `01–09` numeric indexing;
- the filled polygon remains for fast pattern recognition, but the UI explicitly states that its area is not calculated;
- three contrast points use equal highlight treatment;
- highlighted cards are not ranked and no first card receives a stronger “winner” treatment;
- public cards do not expose tagLevels, guards, base or weightedAverage;
- sphere cards do not expose decorative canonical numbers;
- exported personal card uses the same nine-axis geometry.

## Page order

1. hero;
2. nine-axis map;
3. three contrast points;
4. remaining six results;
5. personal map export/share;
6. next / membership / Community state.

## Copy rule

Result copy uses the approved editorial pass. Internal diagnostic vocabulary remains internal. Public result language may reframe the evidence but may not change its meaning.
