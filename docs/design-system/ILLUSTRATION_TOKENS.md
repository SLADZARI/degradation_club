# Illustration tokens

Status: normalized from approved Dementor Ink contracts and current integration CSS

## 1. Illustration is a separate design-system layer

Illustration tokens describe two different things:

1. **art direction** — how artwork is made;
2. **integration** — how approved artwork behaves inside the site.

Do not mix them. CSS can control integration but must not fake the artwork.

## 2. Global art-direction primitives

Dementor Ink global characteristics:

- black ink;
- warm paper / transparent field;
- nervous hand line;
- variable line weight;
- dry brush where meaningful;
- unfinished areas;
- exaggerated gesture;
- blots/splashes only as part of drawing;
- semantic contradiction: `normal situation + one wrong condition`.

Forbidden as global defaults:

- generic grunge;
- stock texture packs;
- CSS splatter as substitute for artwork;
- horror/gothic identity;
- monsters/skulls/blood as recurring brand device;
- polished digital painting;
- vector autotrace.

## 3. Illustration colour tokens

```text
illustration.paper       → color.paper
illustration.ink         → color.ink
illustration.signal      → color.acid
illustration.projectWarn → project-specific alias
```

Artwork does not need to contain all global colours. Black + paper/alpha is often preferred.

ACID remains signal, never default image background.

## 4. Density tokens

Approved distribution:

```text
illustration.density.l0 = none        // target ~40%
illustration.density.l1 = trace       // target ~30%
illustration.density.l2 = intervention// target ~20%
illustration.density.l3 = takeover    // target ~10%
```

Meaning:

- **L0** — no illustration;
- **L1 / TRACE** — small mark, hand, blot, evidence fragment;
- **L2** — object/character/field record that breaks the local grid;
- **L3 / TAKEOVER** — rare page-scale rupture.

Density is a page/system role, not a visual-effects slider.

## 5. Existing integration primitives

Current CSS already exposes:

```text
illustration.ink.edge = clamp(18px,3vw,48px)
illustration.ink.tilt.l1 = .12deg
illustration.ink.tilt.l2 = .34deg
illustration.ink.tilt.l3 = .46deg
```

Shared integration:

```text
background = surface.primary
blendMode = multiply
contrast ≈ 1.05
border = 1px ink when intervention breaks grid
```

These values are legitimate integration tokens because they recur across multiple Ink roles.

## 6. Scene roles

### TRACE / L1

Purpose: system dominates; Ink leaves evidence.

Typical behaviour:

- tiny label;
- short line;
- small 4:3 media fragment;
- slight rotation;
- no page-scale interruption.

### CONTAMINATION / LEAK / FIELD RECORD / L2

Purpose: illustration physically contaminates the clean editorial system.

Typical behaviour:

- width up to ~106vw desktop;
- small rotation;
- negative margins;
- 1px border;
- image scale ~1.03–1.04;
- ACID service label;
- deliberate crossing of section boundary.

Local labels such as `SERVICE CONTAMINATION`, `EVIDENCE LEAK`, `FIELD RECORD` are authored scene metadata, not global token names.

### TAKEOVER / L3

Purpose: rare dominant rupture.

Current Home implementation:

- width ~108vw desktop;
- negative horizontal margin;
- large negative vertical overlap;
- height 640–980px responsive;
- tilt around L3 value;
- slight image scale;
- optional subtle hover expansion.

Do not make this the default image component.

## 7. Mobile integration

Mobile removes much of the deliberate physical distortion:

- width returns to 100%;
- horizontal overflow is removed;
- rotation is removed;
- side borders may disappear;
- image scale reduces;
- negative overlap remains only where composition survives safely.

This is intentional. Mobile preserves the interruption concept without sacrificing content.

## 8. Raster production tokens / constraints

Delivery contract:

```text
format.default = WebP
format.alpha = PNG when required
format.photoScan = JPG/WebP
colorSpace = sRGB
```

No artistic SVG.

Recommended widths by use case:

- major Home interruption: 2000–2400px;
- About / project illustration: 1600–2200px;
- large event field record: 1800–2400px.

OG/social delivery remains exactly `1200×630`.

## 9. Responsive safety

Every important composition is tested at:

- 1440;
- 1024;
- 768;
- 390;
- 360.

Dedicated mobile crop is created only if meaning is lost, not by default.

Essential text must not be baked into artwork.

## 10. Accessibility

Alt text describes the scene/meaning, not the style.

Bad:

`Dementor Ink illustration`

Good:

`Мужчина сидит в офисном кресле, а его тень показывает неприличный жест.`

Critical facts cannot exist only inside raster art.

## 11. Illustration families beyond Dementor Ink

A project may introduce another illustration family, but it must be registered as a project layer rather than silently mutating Dementor Ink.

Examples:

```text
project.logicAwareness.illustration.family = ministryEditorial
project.logicAwareness.illustration.warning = bureaucraticRed
project.logicAwareness.illustration.effects = archival / CRT / stamps
```

These do not become global Club tokens unless deliberately promoted after repeated cross-project use.
