# DEMENTOR LAB — UX / Causality Pass v0.6

Status: EXPERIMENTAL / SAFE TO DROP

Base branch: `experiment/dementor-lab-intent-saliency-v0.5`
Experiment branch: `experiment/dementor-lab-ux-causality-v0.6`

## Scope

Presentation-only pass. Encounter/runtime semantics are intentionally unchanged.

Changes:
- PERSON: removes implementation ownership suffixes and uses player-facing category names (`ГОЛОВА / АКСЕССУАРЫ / ЛИЦО / ОДЕЖДА`).
- BRAIN: reduces engineering density, makes causal cards and active route visually dominant, simplifies REPEAT helper copy.
- TALK: gives more viewport to dialogue, makes metrics quieter, keeps `ПОЧЕМУ ТАК?` opt-in and adds a compact explanation that event selection is state-driven rather than random.
- RESULT: adds compact `ФАКТ / ПАТТЕРН / МЕНЯЕМ` diagnostic strip while retaining the full canonical result text below it.
- Acid color is treated primarily as the current choice/current causal path.

## Runtime boundary

`src/ui/app.mjs`, encounter rules, saliency formulas, repeat semantics, scenario contracts and character renderer are not changed by this pass.

New presentation files:
- `ux-v06.css`
- `ux-v06.mjs`

`index.html` only wires these files after the existing v0.5 surface.

## Rollback

Nothing was merged into v0.5. To return to the exact previous experiment:

```bash
git switch experiment/dementor-lab-intent-saliency-v0.5
```

To test v0.6 again:

```bash
git switch experiment/dementor-lab-ux-causality-v0.6
```

The v0.5 branch remains untouched and is the rollback checkpoint.
