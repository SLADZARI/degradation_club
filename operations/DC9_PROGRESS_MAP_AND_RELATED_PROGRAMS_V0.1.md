# DC-9 PROGRESS MAP & RELATED PROGRAMS v0.1

Status: APPROVED PRODUCT UX / 2026-08-28

## Purpose

`/join/` is not only a selector of nine independent questionnaires. For an authenticated person it is a persistent personal **Map of Degradation** built from saved DC-9 assessment results.

Canonical source for DC-9 numeric level remains `assessment_runs` / `assessment_snapshots`.

## Card states

Each of the nine spheres must render from the latest saved assessment for the current authenticated person:

- not assessed → `ДЕГРАДАЦИЯ НЕ НАЧАТА`;
- assessed → latest level `0–5`, level name, last assessment date, CTA `УЛУЧШИТЬ ДЕГРАДАЦИЮ →`;
- level 5 remains an achieved diagnostic state, not a membership or system-role grant.

The page summary may show:

- assessed spheres / 9;
- average of latest numeric DC-9 levels;
- next unassessed sphere.

## Related programs

A DC-9 sphere may show a small **related program / next practice** badge when there is a meaningful club-program relation approved for UX discovery.

Initial UX mapping:

- Personality → `Слабоумие и отвага` / Евгений;
- Work → `НЕ КОМАНДА` / Габиль;
- Consumption → `Деньги на ветер` / Никита;
- Relationships → `НЕ КОМАНДА` / Габиль;
- Control → `Думай с опасностью` / Валентин;
- Information → `Думай с опасностью` / Валентин.

No related-program badge is required for Self-development, Meaning or Technology until an approved program relation exists.

## Critical boundary

**RELATED PROGRAM ≠ AUTOMATIC DC-9 LEVEL INCREASE.**

Program completion/checkpoints are stored independently (`dc_progress_signals`, `dc_program_certificates`). A program may be shown as a next practice, and its completion may be shown as confirmed, but it must not mathematically change the DC-9 0–5 sphere score until a separate aggregation formula is explicitly approved.

This relation also does not mean ownership, authorship, membership or permission assignment.
