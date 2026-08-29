# About v10 — pre-deploy QA

Status: **ready for preview integration, not ready for production merge**.

## Automated preflight

Local production bundle passed 22/22 static checks:

- one H1;
- unique IDs;
- `lang=ru` and viewport meta;
- canonical `/about/`;
- OG/Twitter metadata;
- no placeholder `#` CTA and no broken internal anchors;
- required routes present: `/`, `/about/`, `/events/`, `/projects/`, `/community/`, `/merch/`, `/archive/`, `/join/`;
- four required WebP assets present;
- alt text present for all images;
- CSS parses without syntax errors;
- tablet breakpoint `561–1024` present;
- mobile breakpoint `<=560` present;
- tiny-mobile breakpoint `<=390` present;
- SERVICE IMAGE mobile lockup protection present;
- OFFLINE right-anchor rule present;
- DEMENTOR mobile split rule present;
- HOW IT WORKS overflow protection present;
- Community mobile typography rule present;
- `/motion-v1.js` integration present.

## Manual preview matrix

Run after Git/Vercel preview exists:

- 1440×900 / 1440×1000;
- 1024×1366;
- 834×1194;
- 430×932;
- 390×844;
- 375×812;
- 360×800;
- 320×568.

Check specifically:

1. SERVICE IMAGE slogan does not touch the brain/hand/person.
2. OFFLINE artwork remains right-anchored; one metadata label on mobile; small copy remains readable.
3. DEMENTOR mobile split keeps body copy on paper, not over the dark chair.
4. `ВАШЕ УЧАСТИЕ НЕ ОБЯЗАНО МАСШТАБИРОВАТЬСЯ` has no viewport overflow.
5. Community principles remain readable and do not collapse into one-word lines.
6. 07 image composition survives tablet/mobile.
7. Global menu works and all route links resolve.
8. No horizontal scrollbar.
9. Reduced-motion mode does not hide content.

## Deploy gate

1. Merge approved source copy from PR #27 into `dementor-club`.
2. Integrate v10 production HTML/CSS into the site feature branch.
3. Generate deployed preview.
4. Run the viewport matrix and click-test routes.
5. Mark site PR ready only after visual sign-off.
6. Merge into `dementor-club-site`.
7. Use the protected production release flow; do not bypass it.

Note: the current execution sandbox blocks local browser navigation, so final browser-level viewport sign-off must be performed on the deployed preview. Static checks are green and prior rendered design review supports moving to preview integration.
