# DC-9 Result QA v0.1

Status: **DRAFT QA CONTRACT / STATIC QA PARTIALLY PASSED**  
Date: 2026-08-31

Legend:
- `[x]` — verified from current `dementor-club-site` code / canonical source mapping;
- `[ ]` — requires browser, provider, editorial or release verification.

## Semantic integrity

- [x] Exactly 9 canonical sphere ids/titles are used.
- [x] No legacy/test top-level sphere set appears in the final result model.
- [x] `self-development` is normalized to canonical `self_development` when reading historical local results.
- [x] Latest dated result wins when legacy/canonical duplicates exist in result runtime.
- [x] Every completed sphere result page reads factual `level`, `tagLevels`, `intent`, `responsibility` where present; `base` and `date` remain stored/runtime data but are not currently exposed in the final visual dossier.
- [x] Final sphere level remains 0–5.
- [x] Level 5 never grants membership, role or canonical Dementor entity status.
- [x] No aggregate Dementor score is introduced on `/join/result/`.
- [x] No aggregate psychotype is introduced on `/join/result/`.
- [x] AI interpretation does not block Community entry.

## Presentation

- [x] Sphere Map renderer uses all 9 independent results.
- [x] Three highlighted results are computed by presentation prominence only and do not mutate diagnostic result data.
- [x] Highlight markers on radar and dossier rows share the same ordered `highlights` array.
- [x] When 9/9 is complete, the remaining six spheres render already expanded without mandatory clicking.
- [x] Canonical icons map 1:1 to sphere ids.
- [x] Tag labels match the canonical four tags in the current DC-9 model.
- [x] Tag values come from stored `tagLevels`, never invented fallback values.
- [x] Intent/responsibility copy reflects stored values when present; missing control axes are reported honestly.
- [x] Humorous copy is selected only by sphere + final level and cannot change level or gate.

## Dossier / share

- [x] Dossier generator receives the same nine result items as the on-screen map.
- [x] Highlighted three in dossier use the same `highlights` array as the screen.
- [x] Export pipeline explicitly embeds the corresponding SVG icon files into the dossier SVG before PNG conversion.
- [ ] No black fallback polygon / missing SVG failure — verify in Safari/iOS and Chromium.
- [ ] No clipped text at 1080×1350 — visual export QA required.
- [x] Share code uses Web Share API where supported and PNG download fallback elsewhere.
- [x] Current public share object contains no developer-facing explanatory paragraph.

## Community flow

- [x] <9/9 → CTA returns to `/join/`.
- [x] 9/9 unauthenticated → Google auth route returns to `/join/result/`, after which local results are synced.
- [x] 9/9 authenticated non-member → `/join/member/`.
- [x] active Member → `/community/board/`.
- [x] membership state is read from approved `dc_member_entry_status_v1` RPC, not inferred from DC-9 level.

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
- [x] reduced-motion CSS disables CTA animation.

## Runtime / data

- [x] Result runtime can read localStorage results without an authenticated session.
- [x] local → Supabase sync canonicalizes sphere ids before insert.
- [x] newer remote result overrides older local result.
- [x] newer local result remains selected over older remote result until sync.
- [ ] auth redirect restores a real browser session and result route — browser/provider QA required.
- [x] corrupt/missing sphere payload does not fabricate a score; missing results render as unexamined/partial state.

## Automated guard

`dementor-club-site/scripts/validate-dc9-result-model.mjs` now checks:
- canonical 9-sphere order across runtime/model;
- icon presence/mapping;
- 6 level-copy variants per sphere;
- `self-development` legacy migration and canonical `self_development` questionnaire key;
- 9/9 route to `/join/result/`;
- absence of aggregate score/psychotype on the final result implementation;
- factual detail-field wiring;
- Community membership/Board routes;
- dossier share/download implementation;
- responsive/reduced-motion contract markers.

## Release gate

- [ ] staging browser QA passed;
- [ ] production validation stack passed;
- [ ] Privacy/Terms impact checked;
- [ ] editorial copy approved;
- [ ] explicit production release approval recorded.

## Current conclusion

Static/integration structure is internally consistent enough to proceed to browser QA. This document does **not** authorize production release. The remaining blockers are real browser rendering/export, auth/provider round-trip, privacy/legal review, editorial approval, production validators and explicit release approval.
