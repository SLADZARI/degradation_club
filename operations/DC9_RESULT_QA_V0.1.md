# DC-9 Result QA v0.1

Status: **DRAFT QA CONTRACT**  
Date: 2026-08-31

## Semantic integrity

- [ ] Exactly 9 canonical sphere ids/titles are used.
- [ ] No legacy/test top-level sphere set appears in the production result.
- [ ] `self-development` is normalized to canonical `self_development` when reading historical local results.
- [ ] Latest dated result wins when legacy/canonical duplicates exist.
- [ ] Every completed sphere reads factual `level`, `base`, `tagLevels`, `intent`, `responsibility`, `date` where present.
- [ ] Final sphere level remains 0–5.
- [ ] Level 5 never grants membership, role or canonical Dementor entity status.
- [ ] No aggregate Dementor score is introduced.
- [ ] No aggregate psychotype is introduced.
- [ ] AI interpretation never blocks Community entry.

## Presentation

- [ ] Sphere Map renders all 9 independent results.
- [ ] Three highlighted results are clearly presentation prominence only.
- [ ] Highlight markers on radar correspond to the three dossier rows.
- [ ] Remaining six completed spheres are visible without mandatory clicking.
- [ ] Canonical icons map 1:1 to sphere ids.
- [ ] Tag labels match source tags for that sphere.
- [ ] Tag values come from `tagLevels`, never from invented data.
- [ ] Intent/responsibility copy reflects factual stored values when present.
- [ ] Humorous copy cannot change diagnosis, level or gate.

## Dossier / share

- [ ] Downloaded dossier uses the same nine levels as the screen.
- [ ] Highlighted three match the screen.
- [ ] Icons render in exported PNG.
- [ ] No black fallback polygon / missing SVG failure.
- [ ] No clipped text at 1080×1350.
- [ ] Share uses Web Share API where supported and download fallback elsewhere.
- [ ] No developer-facing explanatory text appears in the public share object.

## Community flow

- [ ] <9/9 → CTA returns to `/join/`.
- [ ] 9/9 unauthenticated → Google auth preserves/syncs local results.
- [ ] 9/9 authenticated non-member → `/join/member/`.
- [ ] active Member → `/community/board/`.
- [ ] membership state is read from approved server RPC, not inferred from DC-9 level.

## Browser / responsive

Validate independently:

- [ ] 1440
- [ ] 1024
- [ ] 768
- [ ] 390
- [ ] 320

For each viewport:

- [ ] no horizontal overflow;
- [ ] no accidental clipping;
- [ ] radar labels remain legible or are intentionally recomposed;
- [ ] cards do not collapse into unreadable density;
- [ ] all 9 results remain accessible;
- [ ] dossier preview fits viewport;
- [ ] Community CTA is visible, tappable and visually dominant;
- [ ] focus states work;
- [ ] reduced-motion disables CTA animation.

## Runtime / data

- [ ] localStorage-only profile works offline enough to show result data.
- [ ] local → Supabase sync uses canonical sphere ids.
- [ ] server latest result overrides older local result.
- [ ] newer local result overrides older server result until sync.
- [ ] auth redirect restores session and result route.
- [ ] corrupt/missing result payload produces an honest state, not fabricated values.

## Release gate

- [ ] staging browser QA passed;
- [ ] production validation stack passed;
- [ ] Privacy/Terms impact checked;
- [ ] editorial copy approved;
- [ ] explicit production release approval recorded.
