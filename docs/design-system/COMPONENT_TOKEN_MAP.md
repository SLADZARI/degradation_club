# Component token map

This document prevents components from depending directly on arbitrary raw values.

## Global shell

```text
shell.background → surface.primary
shell.foreground → text.primary
shell.maxWidth → layout.shell.max
shell.edge → layout.edge.*
shell.grid → layout.grid.*
```

## Topbar / navigation

```text
nav.background → surface.primary
nav.foreground → text.primary
nav.border → border.default
nav.focus → focus.ring
nav.activeIndicator → text.primary
```

Backdrop blur is implementation behaviour, not a brand token unless repeated outside navigation.

## Primary action

```text
action.primary.background → signal.primary
action.primary.foreground → text.onSignal
action.primary.border → signal.primary
action.primary.focus → focus.ring
```

Invariant: foreground is always INK, including inside dark parents.

## Secondary action

```text
action.secondary.background → transparent
action.secondary.foreground → current semantic text
action.secondary.border → current semantic text
```

No pill radius.

## Index / entity row

```text
indexRow.border → border.default
indexRow.background → surface.primary
indexRow.foreground → text.primary
indexRow.hover.background → signal.primary
indexRow.hover.foreground → text.onSignal
indexRow.motion → motion.duration.medium + motion.ease.primary
```

Movement on hover/focus is DIA behaviour, disabled/reduced on mobile and reduced-motion.

## Status

Status is not a rounded chip system.

Use:

- text;
- underline/rule;
- border;
- signal field where status needs emphasis.

Do not introduce a generic pill component.

## Editorial opening

```text
editorialOpening.grid → global grid
editorialOpening.headline.type → type.display.xl / authored display role
editorialOpening.copy.type → type.lead/body context
editorialOpening.spacing → rhythm.wide/huge depending family
```

Exact column placement is a composition pattern, not a token value.

## Pullquote

```text
pullquote.type → type.pullquote
pullquote.rule → border/currentColor
pullquote.meta → type.kicker
```

`max-width` may be scene-specific and is not automatically global.

## Caption

```text
caption.type → type.caption
caption.border → border/currentColor
caption.label → type.kicker/meta
```

## Footnotes

```text
footnotes.type → type.footnote
footnotes.border → border/currentColor
footnotes.numerals → tabular
```

## Ink slot

```text
inkSlot.background → illustration.paper
inkSlot.blend → multiply
inkSlot.border → illustration.ink
inkSlot.label.background → signal.primary
inkSlot.label.foreground → text.onSignal
inkSlot.edge → illustration.ink.edge
inkSlot.tilt → illustration.ink.tilt.<density>
```

Slot controls integration only. It never generates fake Ink art.

## Ticker / notice

```text
ticker.type → type.kicker/meta
ticker.border → border.default
ticker.motion → authored mechanical behaviour
```

Continuous motion is allowed only when meaningful content exists.

## Focus

All interactive component families inherit:

```text
focus.ring = signal.primary
focus.width = 2px
focus.offset = 3–4px depending control family
```

The slight current difference (3px vs 4px) is an audit item; do not add a third value.

## Disabled

Current implementation uses opacity around `.4/.42` in different layers. Normalize semantically:

```text
state.disabled.opacity = .42
```

Component-specific pointer/cursor behaviour remains explicit.
