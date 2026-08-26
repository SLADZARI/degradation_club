# Typography

Status: normalized current system + explicit future font contract

## 1. Two functional font roles

Dementor Club uses two roles, not one universal family.

### Reading / Interface

Current implementation:

```text
Inter, Arial, Helvetica, sans-serif
```

Role:

- body;
- navigation;
- actions;
- metadata;
- captions;
- forms;
- long reading;
- mobile display fallback where condensed display becomes unsafe.

Important: Inter is an implementation fallback, not the final identity font.

Target direction from approved guide: neutral grotesque with excellent Cyrillic, ABC Favorit or equivalent.

### Display

Current implementation:

```text
"Arial Narrow", "Helvetica Neue", Arial, sans-serif
```

Role:

- `display-xl`;
- `display-l`;
- large index/entity titles;
- sphere names;
- editorial pull quotes;
- oversized authored statements.

Target direction: heavy condensed / multi-width family with strong Cyrillic, Druk Cyrillic or equivalent.

Current display stack is a fallback and must not be treated as the permanent brand font.

## 2. Typography roles

| Role | Purpose | Current/target behaviour |
|---|---|---|
| `type.display.xl` | dominant page statement | very large, condensed, tight tracking |
| `type.display.l` | section statement | large display hierarchy |
| `type.heading.m` | conventional editorial heading | 40–72px target |
| `type.lead` | intro / explanatory block | 24–36px target, short measure |
| `type.body` | long reading | 17–22px desktop; 17–20px mobile |
| `type.kicker` | category/status/number | 9–13px, uppercase/tracked |
| `type.meta` | factual metadata | 9–13px, tabular numerals where useful |
| `type.caption` | image/source annotation | ~11px, structured two-part caption |
| `type.footnote` | editorial/source note | 9–12px |
| `type.action` | procedure/action | compact uppercase, strong weight |
| `type.pullquote` | authored editorial impact | display role; extremely short measure |

## 3. Existing implementation values

### Display XL

Desktop target from guide:

```text
120–220px
line-height 0.78–0.90
```

Current implementation also uses responsive `clamp()` values per scene.

Mobile currently forces readable non-condensed behaviour:

```text
font-family: reading stack
font-size roughly 42–58px depending on viewport
line-height roughly .84–.89
tracking roughly -.055em to -.07em
```

This substitution is intentional. It protects Cyrillic words from unsafe compression and clipping.

### Editorial opening headline

Current:

```text
font-size: clamp(54px, 7.5vw, 124px)
line-height: .84
letter-spacing: -.075em
```

Mobile:

```text
font-size: clamp(40px, 11vw, 52px)
line-height: .88
letter-spacing: -.055em
font-family: reading stack
```

### Pullquote

Current:

```text
font-size: clamp(48px, 7vw, 116px)
line-height: .84
letter-spacing: -.07em
max-width: 13ch
```

### Body measure

```text
body.maxMeasure = 66ch
lead.maxMeasure = 29ch
```

Some local editorial contexts intentionally use 52ch, 31ch, 23ch etc. These are composition-level exceptions, not global text tokens.

## 4. Weight rules

Until final font families are selected, do not encode specific numeric weights as identity tokens beyond functional need.

Recommended semantic roles:

```text
font.weight.regular
font.weight.medium
font.weight.bold
font.weight.black
```

Actual mapping is decided when final font files/families are approved.

Do not assume `900` in Inter will map visually to the final display family.

## 5. Tracking rules

Tracking is semantic in this system.

- large display: strongly negative;
- body: neutral;
- kicker/meta/action: positive and often uppercase;
- pressure/type-mutation states may alter tracking temporarily.

Do not apply negative display tracking to reading text.

## 6. Casing

Uppercase is appropriate for:

- metadata;
- service labels;
- statuses;
- procedural UI;
- administrative labels.

Long body text and meaningful editorial statements should retain normal language casing unless the authored concept requires otherwise.

## 7. Cyrillic gate

Any candidate font must be tested before approval with at least:

- НЕЭФФЕКТИВНОСТЬ
- ОТРИЦАТЕЛЬНЫЙ
- ОСОЗНАННОСТЬ
- СОМНЕНИЕ

Reject families that only look correct in Latin.

## 8. Responsive rule

Mobile typography is a separate composition, not scaled desktop.

Rules:

- no clipped essential words;
- no hyphenation in display by default;
- display may switch from condensed role to reading family;
- authored edge pressure is allowed, accidental loss of text is not;
- body remains at least practical mobile reading size;
- hover-driven type effects are removed/reduced.

## 9. Font replacement protocol

When final fonts are selected:

1. test Cyrillic;
2. map roles, not selectors;
3. compare line breaks across main pages;
4. update token aliases;
5. test 1440 / 1024 / 768 / 430 / 390 / 360 widths;
6. validate OG/social typography separately;
7. only then remove fallback status from Inter / Arial Narrow.

Changing a family is a design-system migration, not a local CSS edit.
