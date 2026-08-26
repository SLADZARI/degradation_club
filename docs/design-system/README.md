# Dementor Club — Design System v1

Status: working source-of-truth
Audit date: 2026-08-26

Этот раздел собирает разрозненные правила сайта, CSS-переменные, типографику, иллюстрационные контракты и локальные проектные исключения в одну систему.

## Зачем это нужно

До этого дизайн-система существовала одновременно в:

- `docs/DESIGN_PRESENTATION_GUIDE.md`;
- `docs/COMPONENT_SYSTEM_v1.md`;
- `ui-v2.css`;
- `editorial-system.css`;
- `mouthwash-v1.css`;
- `dia-v1.css`;
- `ink-interventions.css`;
- `accessibility-v1.css`;
- asset specs и локальных проектных правилах.

Новая документация не заменяет эти источники одним большим файлом. Она вводит слой нормализации: что является primitive token, что semantic token, что component token, а что локальным project override.

## Архитектура

1. **Foundations** — базовые значения: цвет, шрифты, размеры, сетка, ритм, motion.
2. **Semantic** — назначение значений: surface, text, signal, border, focus, state.
3. **Components** — применение semantic tokens в кнопках, индексах, editorial primitives, navigation и Ink slots.
4. **Illustration** — художественные и интеграционные правила изображений.
5. **Projects** — разрешённые локальные overrides отдельных проектов.

## Главный контракт

`primitive → semantic → component → project override`

Локальный проект не меняет глобальный token напрямую. Он переопределяет только разрешённый semantic alias.

## Документы

- `TOKEN_HIERARCHY.md` — уровни и naming.
- `FOUNDATIONS.md` — базовые токены и текущие значения.
- `TYPOGRAPHY.md` — роли шрифтов, размеры, начертания, responsive rules.
- `COMPONENT_TOKEN_MAP.md` — связь компонентов с токенами.
- `ILLUSTRATION_TOKENS.md` — Dementor Ink и интеграция raster art.
- `PROJECT_TOKENS.md` — локальные системы проектов.
- `AUDIT_2026-08-26.md` — найденные дубли, конфликты, временные решения и решения по нормализации.
- `/design-tokens/dementor.tokens.json` — machine-readable baseline.

## Source hierarchy

При конфликте использовать приоритет:

1. accessibility / contrast contract;
2. approved design guide;
3. component system;
4. normalized design tokens;
5. implementation CSS;
6. page-specific exception.

Если исключение повторяется на нескольких страницах, оно должно быть либо повышено до токена, либо удалено как drift.

## Не является токеном автоматически

Любое значение, встреченное в CSS, не становится design token только потому, что оно повторяется.

Не повышаем до глобального уровня без семантической причины:

- случайный margin конкретного блока;
- единичный rotation;
- crop конкретной картинки;
- ширину конкретной editorial quote;
- локальный цвет проекта;
- временный fallback шрифта.

## Текущий канон

Глобальная визуальная система строится по порядку:

**structure → typography → composition → motion → disruption**

Dementor Ink нарушает уже существующую систему. Он не должен подменять её.
