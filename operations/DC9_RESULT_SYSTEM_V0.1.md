# DC-9 Result System v0.1

Status: **APPROVED PRESENTATION CONTRACT / IMPLEMENTATION QA REQUIRED**  
Date: 2026-08-31  
Presentation revision: **2026-09-01 — public sphere numbering removed**

## Current visual reference

**Graph Linked Cards v5** is the current approved working reference for the DC-9 result page.

Reference name: `DC-9 Result — Graph Linked Cards v5`  
Reference artifact: `dementor-dc9-graph-linked-cards-v5.html`  
Status: **CURRENT WORKING REFERENCE**  
Supersedes for further result-page development: earlier DC-9 result layout experiments and v1–v4 visual prototypes.

All further DC-9 result design, responsive work, dossier work and site implementation should begin from Graph Linked Cards v5 unless an explicit later approval replaces it.

Graph Linked Cards v5 fixes the following presentation principles:

- the radar itself is readable and connected to the result list;
- canonical sphere numbering remains internal to the model and implementation but is **not shown to the public user**;
- each radar axis shows the final `/5` value;
- the strongest visible sphere results may be marked by simple black dots on the radar;
- the legend resolves `sphere icon → sphere name → score`;
- highlighted legend cells may use the acid field to connect them visually to radar peaks;
- public A/B/C markers are not used;
- result cards do not repeat sphere numbers;
- result cards use the sphere icon instead of decorative empty circles;
- card hierarchy is `icon → sphere → final level → level name → short editorial line`;
- internal `tagLevels / intent / responsibility / base` remain in the factual model but do not clutter the main result cards;
- the page order remains `hero → linked graph → highlighted results → remaining results → dossier → Community`;
- mobile layouts must preserve graph readability rather than hiding the graph semantics in a separate unexplained visual.

This reference is a presentation baseline, not a new diagnostic model. It does not modify the nine-sphere taxonomy, score calculation, Community gate, or membership semantics defined below.

## Purpose

This document defines the result-layer boundary for the completed DC-9 Sphere Map. It does not replace `operations/ONBOARDING_SYSTEM.md` or `operations/CONTENT_TAXONOMY_AND_DEMENTOR_LEVELS.md`.

## Authorities

Diagnostic meaning and sphere model:
- `operations/ONBOARDING_SYSTEM.md`
- `operations/CONTENT_TAXONOMY_AND_DEMENTOR_LEVELS.md`

Community transition after 9/9:
- `community/MEMBER_ENTRY_AND_ARTIFACT_FLOW_V1.md`

Implementation branch:
- `dementor-club-site`

## Canonical spheres

Exactly nine permanent spheres, in canonical internal order:

1. `personality` — Личность
2. `work` — Работа
3. `consumption` — Потребление
4. `relationships` — Отношения
5. `control` — Контроль
6. `information` — Информация
7. `self_development` — Саморазвитие
8. `meaning` — Смысл
9. `technology` — Технологии

This order remains canonical for storage, calculation, QA and deterministic tie-breaking. It is not a required public numbering system.

Alternative top-level sphere lists are not allowed in the production DC-9 result experience.

## Current factual result payload

The current DC-9 implementation stores, per completed sphere:

- `level` — final 0–5 sphere level;
- `base` — thematic base before guard cap;
- `tagLevels[4]` — level for each canonical tag;
- `intent` — intentionality guard, 0–3;
- `responsibility` — responsibility guard, 0–3;
- `date` — completion timestamp.

Current calculation implemented in `/join/`:

1. thematic answer score is 0–3;
2. tag level = `round((score / 3) * 5)`;
3. base = rounded mean of four tag levels;
4. guard = `min(intent, responsibility)`;
5. guard cap: `0 → 1`, `1 → 2`, `2 → 4`, `3 → 5`;
6. final sphere level = `min(base, guard_cap)`.

Therefore high thematic answers cannot produce a high final level when intentionality or responsibility is weak.

## Legacy key compatibility

The canonical runtime / database sphere id is `self_development`. Historical local results may contain `self-development`.

All result-read, progress-map and local→Supabase synchronization layers must normalize:

`self-development → self_development`

When legacy and canonical records both exist, the newest dated result wins. Compatibility must remain until historical local profiles have safely migrated.

## Non-negotiable semantic boundary

The Sphere Map is a set of nine independent results.

The final page must **not** create:

- a universal Dementor score;
- an aggregate psychological score;
- a general psychotype;
- a tenth diagnostic axis;
- automatic Dementor role/status from level 5;
- membership permission from a sphere result;
- AI-generated interpretation as a Community gate.

Level 5 means only the diagnostic state `Дементор` inside that specific sphere.

## Presentation layer

The public result page must be simpler than the internal result payload.

The stored `tagLevels`, `intent`, `responsibility` and `base` remain part of the factual model, but they are not required on the first public result screen. They may be used for future detailed/profile views, interpretation logic or QA evidence.

The public result page shows:

- full Sphere Map / radar;
- final `/5` values on the graph;
- readable `sphere pictogram → sphere name → score` legend;
- three visually highlighted sphere results;
- remaining six sphere results in compact form;
- shareable personal dossier;
- Community CTA after 9/9.

The public result page does **not** show canonical `01–09` sphere numbers. Those numbers are internal navigation/model indices only.

### Highlighted three

The three highlighted results are presentation only, never a diagnostic rank.

Approved deterministic contrast rule for v0.1:

1. highest completed sphere level;
2. lowest completed sphere level;
3. most pronounced remaining result by absolute distance from midpoint `2.5`; tie-break by higher final level, then canonical internal sphere order.

No public A/B/C labels are used. Highlighted points on the radar are simple black dots. Public sphere identification uses pictogram + sphere name, not internal numeric indexes.

If fewer than three spheres are complete, available results are ordered by distance from midpoint, then higher level, then canonical internal sphere order.

This is `presentation prominence` only. It does not create importance, quality, membership relevance or aggregate interpretation.

## Approved public UX order after 9/9

1. Completion state `9 / 9` and result hero.
2. Graph Linked Sphere Map with `/5` values and icon-linked legend.
3. Three highlighted results: sphere icon, sphere name, final level, level name and one short editorial line.
4. Remaining six results: sphere icon, sphere name, final level, level name where useful, and one short editorial line.
5. Compact personal dossier preview + `СКАЧАТЬ ДОСЬЕ` / `ПОДЕЛИТЬСЯ`.
6. Strong Community CTA.

Do not show internal sphere numbers in the public graph, legend or result cards.

Do not use decorative empty circles in result cards. Use the canonical sphere pictogram instead.

Do not repeat tags, guard axes or diagnostic explanations throughout the public page. Do not add a separate club-manifesto block between results and dossier unless it has a proven user task.

Public framing uses `ДЕВЯТЬ СФЕР. ОДНА КАРТА.` and must not imply a single psychotype/profile score.

## Dossier

The share dossier must be generated from the same factual values shown on screen.

Recommended contents:

- `DEMENTOR CLUB / DC-9`;
- `МОЯ КАРТА`;
- Sphere Map;
- three highlighted independent sphere results;
- sphere icons;
- exact final levels;
- short editorial lines;
- `9 СФЕР / БЕЗ ОБЩЕГО БАЛЛА`;
- `DEMENTOR.CLUB`.

Highlighted radar points are black dots without A/B/C labels. Public sphere numbers are not required in the dossier; use icons/names when labels are needed. Do not place developer explanations inside the dossier.

## Community boundary

After all nine spheres are complete:

`SPHERES COMPLETE → IDENTITY → MEMBERSHIP → COMMUNITY BOARD → FIRST ARTIFACT`

The result page must send the user to the approved membership route and must not silently skip identity/membership gates.

## Responsive / QA

Validate independently at 1440 / 1024 / 768 / 390 / 375 / 320.

Required:

- no horizontal overflow;
- no clipped public copy;
- graph `/5` values remain readable on mobile;
- legend remains the textual resolution layer for the graph;
- sphere pictograms remain legible at mobile sizes;
- no public `01–09` sphere numbering;
- no public A/B/C marker system;
- result cards contain no redundant sphere numbering;
- all nine results remain visible without mandatory interaction;
- mobile page should avoid repeating the same analytical payload in multiple formats;
- share preview fits mobile viewport;
- Community CTA remains the strongest final action;
- `prefers-reduced-motion` disables decorative CTA breathing/pulse;
- exported dossier matches screen values;
- 9/9 remains 9/9 for historical `self-development` local results after normalization.

## Current staging QA snapshot

Graph Linked Cards v5 remains the baseline for all further responsive QA, with the 2026-09-01 public-index revision: icons/names identify spheres; canonical numeric indexes stay under the hood.

Earlier page-height and copy-volume measurements from v4 remain historical evidence only and must not be treated as the current design target.

Production publication still requires real staging/browser/provider QA and explicit release approval.
