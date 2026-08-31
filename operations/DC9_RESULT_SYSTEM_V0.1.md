# DC-9 Result System v0.1

Status: **DRAFT / IMPLEMENTATION CANDIDATE / REVIEW REQUIRED**  
Date: 2026-08-31

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

Exactly nine permanent spheres, in canonical order:

1. `personality` — Личность
2. `work` — Работа
3. `consumption` — Потребление
4. `relationships` — Отношения
5. `control` — Контроль
6. `information` — Информация
7. `self_development` — Саморазвитие
8. `meaning` — Смысл
9. `technology` — Технологии

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

The current staging questionnaire historically stores Саморазвитие under the legacy local key:

`self-development`

The canonical runtime / database sphere id is:

`self_development`

All result-read, progress-map and local→Supabase synchronization layers must normalize:

`self-development → self_development`

When legacy and canonical records both exist, the newest dated result wins. Compatibility must remain until historical local profiles have safely migrated.

This alias is a storage/runtime compatibility rule only. Public and semantic sphere identity remains `self_development` / Саморазвитие.

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

The result page may show:

- all nine sphere levels;
- level names 0–5;
- canonical sphere icons;
- the Sphere Map / radar geometry;
- canonical tag levels when useful;
- intentionality/responsibility quality state when useful;
- short club-style editorial copy associated with a sphere + level;
- three visually highlighted sphere results;
- a shareable personal dossier;
- Community CTA after 9/9.

### Highlighted three

A `Top 3` block is presentation only, never a diagnostic rank.

Candidate deterministic rule for v0.1:

1. calculate each sphere's distance from midpoint `2.5`;
2. select the three largest absolute distances;
3. tie-break by higher final level;
4. final tie-break by canonical sphere order.

This rule must be described internally as `presentation prominence`, not importance, quality or membership relevance.

## Recommended public UX order after 9/9

1. Completion state: `9 / 9`.
2. Full Sphere Map.
3. Three highlighted independent results with icon, level, level name, source-backed tag values and short editorial line.
4. Remaining six sphere results, already expanded; no mandatory clicking to understand the result.
5. Personal dossier / share object.
6. Strong Community CTA.

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

Do not place developer explanations inside the dossier.

## Community boundary

After all nine spheres are complete:

`SPHERES COMPLETE → IDENTITY → MEMBERSHIP → COMMUNITY BOARD → FIRST ARTIFACT`

The result page must send the user to the approved membership route and must not silently skip identity/membership gates.

## Responsive / QA

Validate independently at 1440 / 1024 / 768 / 390 / 320.

Required:

- no horizontal overflow;
- no clipped radar labels;
- no hidden result information requiring JS interaction to understand the completed result;
- all nine results visible without mandatory interaction;
- share preview fits mobile viewport;
- Community CTA remains the strongest final action;
- `prefers-reduced-motion` disables decorative CTA breathing/pulse;
- exported dossier matches screen values;
- 9/9 remains 9/9 for historical `self-development` local results after normalization.

## Editorial copy status

Sphere-specific humorous lines beyond the existing canonical diagnostic verdicts are **presentation copy** and require editorial approval before production. They must never change the stored level, tags, guard values or Community gate.