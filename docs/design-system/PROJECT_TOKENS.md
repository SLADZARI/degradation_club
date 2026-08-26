# Project tokens

## Principle

A Dementor Club project may have its own visual dialect without becoming a second global design system.

Inheritance:

```text
Dementor Club foundations
        ↓
Dementor Club semantic layer
        ↓
Global components
        ↓
Project aliases / local authored scenes
```

## Allowed project overrides

A project may define:

- local accent/warning colours;
- local display treatment;
- illustration family;
- image treatment;
- stamps/seals/labels;
- authored composition patterns;
- local motion scene if it follows accessibility rules;
- project-specific metadata language.

## Non-overridable global contracts

Projects must not silently override:

- global navigation behaviour;
- accessibility contrast;
- `text.onSignal = ink`;
- reduced-motion behaviour;
- factual provenance;
- canonical Club identity on shared shell;
- base content readability.

## Logic & Awareness

Status: independent editorial/project subsystem.

Known local identity:

- Ministry / pseudo-official preventive campaign;
- Soviet/constructivist/editorial references allowed locally;
- muted bureaucratic red allowed for seals, warnings and stamps;
- archival/technical-document language;
- propaganda-like composition where conceptually justified;
- CRT/television interference and archival-photo treatment may be authored effects for specific series.

Proposed namespace:

```text
project.logicAwareness.color.warning
project.logicAwareness.color.stamp
project.logicAwareness.type.official
project.logicAwareness.illustration.family
project.logicAwareness.image.archival
project.logicAwareness.image.crtInterference
project.logicAwareness.marker.ministry
```

Important: values remain `TBD` until extracted from approved project assets or explicitly approved. Do not infer a red hex from a screenshot.

## Other projects

Each project should receive one registry document only when it actually introduces repeated visual rules.

Do not create project tokens for one-off artwork.

Template:

```text
project.<id>.inherits = club
project.<id>.accent = <semantic alias>
project.<id>.type = <role override or inherited>
project.<id>.illustration.family = <family>
project.<id>.surface.special = <optional>
project.<id>.motion.special = <optional>
```

## Promotion rule

If the same project token appears in three or more independent project systems and carries the same meaning, review it for promotion to the global semantic layer.

Promotion is deliberate; repetition alone is not enough.
