# Dementor Club — DIA Behaviour System v1

STATUS: implementation contract
UPDATED: 2026-08-23

DIA is used as behavioural identity, not decorative animation.

## 1. BEHAVIOURS

### Pressure
Dominant display type may compress/expand slightly on hover/focus or scroll proximity. Never clip text. Disabled on mobile and reduced motion.

### Reclassification
Visible interface wording may change during interaction, but canonical entity status must not change. Example: PLANNED may become OPEN RECORD / DETAILS RESTRICTED as interface language only.

### State Transition
Lifecycle/status rows may mechanically emphasize current/available states on hover/focus. No transition may imply an unapproved future event state.

### Drift
Metadata, labels and editorial markers may drift a few pixels relative to the main grid. Drift never applies to body copy, buttons, factual tables or mobile layouts.

### Type Mutation
One dominant heading per viewport may mutate scaleX/tracking according to scroll position. Mutation is bounded and must preserve Cyrillic legibility.

### Generative Variation
A route/entity may receive deterministic visual variation derived from its stable route or entity ID. The same route must produce the same variation during a session. No Math.random-driven jitter.

### Mechanical Ticker
Ticker can reverse/pause in response to input. It must remain readable and respect reduced motion.

## 2. FACTUAL SAFETY

Motion never changes canonical facts, publication state, price, dates, availability, programme or membership mechanics.

## 3. MOTION BUDGET

UI reaction: 180–500 ms.
Dominant type transition: 300–900 ms.
Ambient drift: slow, max 8 px displacement.
No more than one strong kinetic behaviour in the same viewport.

## 4. BREAKPOINTS

Desktop > 700 px: full system.
Mobile <= 700 px: no drift, no type mutation, no hover-only meaning; tap/reveal remains explicit.

## 5. REDUCED MOTION

Under prefers-reduced-motion: reduce:
- no drift;
- no pressure transform;
- no scroll-linked type mutation;
- no ticker animation;
- no animated generative transforms;
- all information and controls remain available.
