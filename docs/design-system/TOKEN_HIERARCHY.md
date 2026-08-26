# Token hierarchy

## 1. Primitive tokens

Primitive — физическое значение без знания компонента.

Examples:

- `color.paper = #F2F0E8`
- `color.ink = #111111`
- `color.acid = #D8FF3E`
- `motion.duration.fast = 220ms`
- `motion.ease.primary = cubic-bezier(.2,.8,.2,1)`

Primitive нельзя использовать как описание смысла интерфейса.

## 2. Semantic tokens

Semantic token отвечает на вопрос «зачем это значение здесь».

Examples:

- `surface.primary → color.paper`
- `surface.inverse → color.ink`
- `signal.primary → color.acid`
- `text.primary → color.ink`
- `text.inverse → color.paper`
- `text.onSignal → color.ink`
- `border.default → color.line`
- `focus.ring → signal.primary`

Semantic layer является основной точкой переопределения темы/проекта.

## 3. Component tokens

Component tokens описывают применение semantic tokens.

Examples:

- `action.primary.background → signal.primary`
- `action.primary.foreground → text.onSignal`
- `indexRow.hover.background → signal.primary`
- `indexRow.hover.foreground → text.onSignal`
- `inkSlot.background → surface.primary`
- `inkSlot.border → border.strong`

Компонент не должен самостоятельно изобретать новый raw color, easing или typography role.

## 4. Project override

Проект может переопределять разрешённые aliases.

Пример:

```text
project.logicAwareness.warning → color.bureaucraticRed
project.logicAwareness.illustrationMode → ministry
```

Но проект не меняет:

```text
color.acid
text.onSignal
accessibility.contrast
```

То есть локальная идентичность добавляется поверх клуба, а не переписывает фундамент.

## Naming contract

Используем lower camelCase в JSON и CSS-переменные с `--dc-`.

Recommended mapping:

```text
color.paper                   → --dc-paper
color.ink                     → --dc-ink
color.acid                    → --dc-acid
surface.primary               → --dc-surface-primary
text.primary                  → --dc-text-primary
motion.duration.fast          → --dc-dia-fast
rhythm.tight                  → --dc-rhythm-tight
illustration.ink.edge         → --dc-ink-edge
```

## Promotion rule

Значение становится токеном, если выполняется хотя бы одно условие:

1. повторяется в разных component/page families;
2. выражает утверждённое правило бренда;
3. участвует в accessibility contract;
4. должно меняться централизованно;
5. является разрешённой точкой project override.

Значение остаётся exception, если оно специфично для одного сюжета, изображения или editorial scene.

## Deprecation

Старый token не удаляется молча. Сначала:

`active → deprecated → removed`

В документации указываются replacement и причина.
