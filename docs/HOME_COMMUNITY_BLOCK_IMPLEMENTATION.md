# Home Community Block — implementation contract

STATUS: APPROVED FOR IMPLEMENTATION
DATE: 2026-08-28
AUTHORITY: `dementor-club/docs/COMMUNITY_HOME_BLOCK.md`
BRANCH RESPONSIBILITY: `dementor-club-site`

## Existing destination

The site already has `/community/` and it is the destination for the Home Community block.

Current Community page responsibilities:

- Community context/opening;
- public Dementor roster;
- current activity;
- nine club spheres;
- explicit membership-system status.

Do not create a second Community root page. Extend `/community/` as the Community entity/index surface when new approved records appear.

## Home block

Use the existing clean asset:

`/assets/ink/home-community-01.webp`

The screen is recomposed in HTML/CSS. Do not create a new image derivative and do not use a raster caption.

Approved visual rules:

- surface: `#F1E9D8`;
- one black CTA strip only;
- CTA: `COMMUNITY / PEOPLE / ACTIVITY →`;
- link: `/community/`;
- no overlay/filter/multiply/dimming;
- desktop: dominant media with CTA over the artwork;
- mobile: full artwork visible with `object-fit: contain`, no crop;
- mobile CTA spans the full width of the block.

## Recommended semantic markup

```html
<section class="dc-home-community" aria-label="Community / People / Activity">
  <a class="dc-home-community__media" href="/community/">
    <img
      src="/assets/ink/home-community-01.webp"
      alt="Группа людей движется вместе, отдельно стоит человек с листом"
      loading="lazy"
      decoding="async">
    <span class="dc-home-community__caption">COMMUNITY / PEOPLE / ACTIVITY →</span>
  </a>
</section>
```

## Critical implementation rule

Any legacy/reference image that already contains the black caption must not be used as the production block image. Otherwise the caption appears twice.

## Asset policy

All required imagery already exists in the site asset system. This implementation is a layout/composition change only.
