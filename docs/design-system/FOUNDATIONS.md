# Foundations

Status: normalized from current implementation

## Colour primitives

| Token | Value | Status | Notes |
|---|---:|---|---|
| `color.paper` | `#F2F0E8` | canonical | Основная светлая поверхность |
| `color.ink` | `#111111` | canonical | Основной текст / тёмная поверхность |
| `color.acid` | `#D8FF3E` | canonical | Signal only |
| `color.line` | `rgba(17,17,17,.20)` | canonical candidate | В старом слое встречается `.18`; нормализуем к `.20` |
| `color.muted` | `#777777` | legacy candidate | Лучше заменить semantic opacity/text-secondary |
| `color.bureaucraticRed` | TBD | project-only | Logic & Awareness / Ministry; не глобальный club token |

## Semantic colour baseline

```text
surface.primary       → color.paper
surface.inverse       → color.ink
signal.primary        → color.acid
text.primary          → color.ink
text.inverse          → color.paper
text.onSignal         → color.ink
border.default        → color.line
focus.ring            → signal.primary
```

### Contrast invariant

ACID является светлой signal surface. На ACID всегда используется INK. Светлый/white/PAPER foreground на ACID запрещён независимо от родительской секции.

## Layout

### Grid

Desktop:

- 12 columns;
- target max width: 1440–1600px;
- implementation shell currently reaches 1500/1600 depending on layer;
- outer margin: 24–40px;
- gutters: 12–24px.

Tablet: 8 columns.

Mobile: 4 columns, обычно одна главная reading column.

### Normalization proposal

```text
layout.shell.max = 1600px
layout.grid.desktop.columns = 12
layout.grid.tablet.columns = 8
layout.grid.mobile.columns = 4
layout.gutter.min = 12px
layout.gutter.default = 16px
layout.gutter.max = 24px
layout.edge.min = 18px
layout.edge.desktop = 28px
```

`1500px` считать implementation legacy, не новым фундаментом.

## Vertical rhythm

Уже существует зрелый token set из Mouthwash layer:

```text
rhythm.tight  = clamp(54px, 6vw, 92px)
rhythm.medium = clamp(96px, 11vw, 170px)
rhythm.wide   = clamp(150px, 17vw, 270px)
rhythm.huge   = clamp(210px, 23vw, 360px)
```

Mobile overrides intentional; это не ошибка, а отдельная композиция.

Semantic usage:

- `dense → rhythm.tight`
- `index → rhythm.medium`
- `quiet → rhythm.wide`
- `oversized → rhythm.huge`
- `hit → top wide / bottom huge`

## Silence / whitespace

```text
space.silence.default = clamp(110px,16vw,260px)
space.silence.large   = clamp(170px,23vw,360px)
```

Whitespace является смысловой частью системы и не должен сворачиваться в единый conventional spacing scale 4/8/16/24/32.

## Motion primitives

Из DIA:

```text
motion.ease.primary    = cubic-bezier(.2,.8,.2,1)
motion.duration.fast   = 220ms
motion.duration.medium = 480ms
motion.duration.slow   = 820ms
```

Editorial/large scenes могут использовать более длинные durations согласно design guide:

- UI: 300–700ms;
- large type: 800–1600ms;
- ambient: 8–30s.

DIA tokens применяются для component behaviour; guide ranges — для authored scenes.

## Geometry

Глобальный интерфейс предпочитает:

- прямоугольники;
- 1px structural rules;
- квадратные / почти квадратные actions;
- отсутствие pill shapes;
- border radius по умолчанию = 0 для identity-bearing UI.

Circle допустим как отдельная графическая форма, но не как дефолтный shape token компонентов.

## Responsive thresholds found in implementation

Current breakpoints:

- `900px` — major desktop/tablet transition;
- `700px` — principal mobile composition;
- `430px` — small mobile type adjustment;
- `390px` — rhythm adjustment;
- `360px` — minimum compact rhythm.

Предлагаемые aliases:

```text
breakpoint.tablet = 900px
breakpoint.mobile = 700px
breakpoint.mobileSmall = 430px
breakpoint.mobileCompact = 390px
breakpoint.mobileMin = 360px
```

Не добавлять новые breakpoint values без проверки существующего набора.
