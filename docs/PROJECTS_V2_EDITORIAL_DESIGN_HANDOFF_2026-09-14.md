# #169 Projects v2 — editorial + design handoff

Date: 2026-09-14
Branch: `agent/169-projects-hub-v2`
Status: APPROVED EDITORIAL / DESIGN DIRECTION FOR IMPLEMENTATION

## 1. What changes

Rebuild only `/projects/` as the Projects hub. Do not redesign the site shell or Home hero as part of this work.

The hub contains four project territories:

1. Dementor Lab
2. Dementor Battle
3. Robo Games
4. Логика и осознанность

The page idea is not “catalogue of projects”. The first-screen thought is:

> **У ВСЕГО ЕСТЬ СВЯЗЬ.**
>
> Идея начинается с разговора. Потом кто-то приносит механику. Кто-то — картинку. Кто-то — возражение.
>
> Через некоторое время у неё появляется собственный адрес.
>
> **Проекты живут отдельно. Связь остаётся.**

Primary first-screen CTA:

`ПОСМОТРЕТЬ BOARD →`

The page then moves directly into the four projects.

## 2. Canon comparison / what must be preserved

Current site shell and Home are already production authority. Projects v2 must integrate into that system rather than recreate it.

Preserve unchanged:

- shared `topbar` / `DEMENTOR CLUB` brand treatment;
- current global site navigation and mobile INDEX behavior;
- Home `dc-home .dc-hero` composition, image, typography and actions;
- global site tokens PAPER `#F2F0E8`, INK `#111111`, ACID `#D8FF3E`;
- current site typography hierarchy: metadata/kicker → oversized display → short lead/body → literal action;
- 12-column editorial rhythm on desktop and current mobile guardrails;
- project independence: project-specific visual world may diverge after the Club shell.

Hard visual principle:

> **System first. Violation second.**

At distance the page stays clean, controlled and editorial. Handmade/naive visual interruption happens inside project territories and the common-table illustration, not by turning the whole page into grunge or a generic collage.

### Important implementation boundary

Do not ship the standalone prototype CSS literally as a replacement for global site CSS. The prototype redefines generic selectors such as `body`, `.topbar`, `.brand`, `.nav`, `.shell`, `.action`; production implementation must keep the existing shared shell and confine new Projects presentation to the Projects surface.

No change to Home hero styles is required for #169.

## 3. `/projects/` content order

### A. Hero

Meta:

`PROJECTS / DEMENTOR CLUB / 2026`

Secondary meta:

`04 PROJECTS · ONE CONNECTION` or Russian equivalent if the implementation keeps all metadata in Russian.

Headline:

# У ВСЕГО ЕСТЬ СВЯЗЬ.

Copy:

> Идея начинается с разговора. Потом кто-то приносит механику. Кто-то — картинку. Кто-то — возражение.
>
> Через некоторое время у неё появляется собственный адрес.
>
> **Проекты живут отдельно. Связь остаётся.**

CTA:

`ПОСМОТРЕТЬ BOARD →`

Hero may contain the supplied Projects reel, but video is enhancement, not authority. It must be muted, looping and inline when autoplay is available. If the YouTube Shorts embed does not actually play in production, show a stable visual fallback rather than a broken/blank media frame. The page must remain complete without the video.

### B. Transition

Use only:

`ВОТ ЧТО УЖЕ ВЫРОСЛО.`

No additional explanation of the Projects architecture here.

### C. Dementor Lab

Status:

`PUBLIC / APPROVED`

Name:

`DEMENTOR LAB`

Project line:

`ИГРАЕМ В РЕАЛЬНОСТЬ`

Description:

> Интерактивная история, где одну ситуацию можно прожить ещё раз — изменив один ход.

CTA:

`ОТКРЫТЬ DEMENTOR LAB →`

Destination:

`/projects/dementor-lab/`

Authority is the approved `dementor_lab_landing_v19_selfcontained.html`. The hub may borrow a verified Lab visual, but must not rewrite the Lab project world. The destination page remains a separate project experience.

### D. Dementor Battle

Status:

`IN DEVELOPMENT`

Name:

`DEMENTOR BATTLE`

Headline:

`ПОЛЕ УЖЕ ЕСТЬ.`

Copy:

> Тактическая игра в разработке.
>
> Поле, персонажи, движение, укрытия уже есть. Правила ещё договариваются.

CTA:

`ОБСУДИТЬ НА BOARD →`

Do not add invented win conditions, progression, classes, release date or finished-playable language.

### E. Robo Games

Status:

`IN DEVELOPMENT`

Name:

`ROBO GAMES`

Headline:

`ТВОЙ РОБОТ ДОСТОИН ИГР.`

Copy:

> Соревнуйся в роботостроении с друзьями и гордись результатами.
>
> Игры ещё собираются.

CTA:

`ОБСУДИТЬ НА BOARD →`

Do not show `PLAYABLE`, `ИГРАТЬ`, disciplines, scoring, tournament mechanics, dates or prizes until a real source confirms them.

### F. Логика и осознанность

Status:

`EDITORIAL PROJECT`

Name:

`ЛОГИКА И ОСОЗНАННОСТЬ`

Headline:

`ЛОГИКА. ФАКТЫ. ОСОЗНАННОСТЬ.`

Copy:

> Редакционный проект, оформленный как профилактическая кампания.
>
> Для убедительности есть своё ведомство.

CTA:

`ОТКРЫТЬ ПРОЕКТ →`

Destination:

`/projects/logic-awareness/`

Keep its Ministry/dossier visual world. The red/burgundy seal/warning system is allowed only inside this local project identity; it does not become a global Club accent.

### G. Common-table illustration

Place the approved/generated Dementor illustration after the four projects and before the final CTA.

Headline:

`ПРОЕКТЫ РАЗНЫЕ. СТОЛ ОБЩИЙ.`

Small line:

`ИДЕИ / ЛЮДИ / ИГРЫ / BOARD`

Do not use this illustration as a replacement for project-specific visuals. It explains the relationship between projects.

### H. Final CTA

Headline:

`ЕСТЬ ЧТО ДОБАВИТЬ?`

Copy:

> Проект не обязательно начинать с проекта.
>
> Иногда достаточно положить идею на стол.

CTA:

`ПРИНЕСТИ НА BOARD →`

## 4. Button rule

Acid is a background accent; text on acid is INK/black. Do not render white CTA text on the Club acid token.

Primary Club action:

- acid background;
- black text;
- literal label;
- no decorative ambiguity.

Project-local buttons may follow their responsible project source, but functional readability wins over style.

## 5. Home consistency without touching Home hero

The current Home ecosystem row for Projects still says `01 ACTIVE PROJECT`. Once this hub ships that becomes factually stale.

Required small Home copy correction only:

`PROJECTS / INDEPENDENT WORLDS / 04 PROJECTS`

Do not modify Home hero markup, Home hero visual, Home hero typography, Home hero CTAs or Home hero CSS while making this correction.

## 6. Metadata / sharing

The `/projects/` title, description and OG copy must describe the Projects hub, not only Logic & Awareness.

Do not keep the old statement that only one independent project is publicly registered.

Use a Club-level Projects OG image. The common-table illustration is an acceptable candidate after it is approved and committed as a stable site asset.

Each project slug keeps its own project metadata/source authority.

## 7. Architecture / regression requirements

- `/projects/` uses the existing Club shell and navigation.
- Project territories may vary visually; do not force four identical SaaS cards.
- Board is linked, not embedded as a second feed/CMS.
- Lab and Logic link to their project pages.
- Battle and Robo Games point to Board until a stronger destination/source exists.
- Do not introduce global selectors that can mutate Home, About, Community or other surfaces.
- Existing project-specific routes remain canonical.
- #44 remains part of release acceptance: fresh non-hash navigation starts at top; valid hash deep-links still work; browser history is not destroyed by a blanket scroll reset; desktop/mobile are tested separately.

## 8. QA gate for this page

Before Ready:

- first screen communicates connection + projects in under ~20–30 seconds;
- four projects are visible and factually bounded;
- no unsupported mechanics/statuses in visible copy, metadata, alt text or OG copy;
- acid buttons use black text;
- desktop and mobile preserve shared header behavior;
- no horizontal overflow;
- Hero reel has a fallback and does not create an empty/broken first screen;
- Lab CTA resolves to `/projects/dementor-lab/`;
- Logic CTA resolves to `/projects/logic-awareness/`;
- Battle/Robo Board CTAs resolve to the canonical Board route;
- Home hero is visually unchanged after the Projects release.
