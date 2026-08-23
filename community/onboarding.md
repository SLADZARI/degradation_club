# Dementor Club — global onboarding (superseded)

Status: **SUPERSEDED / historical reference only**
Updated: 2026-08-24

This file previously described the v2 unified psychometric onboarding model.
That model is no longer canonical.

## Current source-of-truth

Use:

`operations/ONBOARDING_SYSTEM.md`

Current canon:

`Dementor Club → Sphere → Profile onboarding → Tags → Dementor level → User profile`

The public `/join/` entry point now routes into nine profile-specific onboarding branches:

1. Личность
2. Работа
3. Потребление
4. Отношения
5. Контроль
6. Информация
7. Саморазвитие
8. Смысл
9. Технологии

There is no single global psychological score or competing general personality classification.
The previous v2 unified model remains available in Git history only as a design/research reference.

## Implementation rule

All future onboarding changes must first be approved in `operations/ONBOARDING_SYSTEM.md` and related operation documents, then implemented in `dementor-club-site`.
