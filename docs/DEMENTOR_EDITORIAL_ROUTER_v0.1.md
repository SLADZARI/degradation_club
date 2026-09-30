# Dementor Club — Editorial Router v0.1

Status: CANDIDATE · TEST REQUIRED
Updated: 2026-09-01
Authority: editorial candidate

## 1. Purpose

This router defines which project documents an editorial GPT or human editor must read before drafting, editing or approving text.

It separates:
- brand semantics;
- surface rules;
- project/entity truth;
- voice;
- humor;
- visual/editorial constraints;
- factual safety.

No editorial assistant may infer project facts from tone, design mockups or humor examples.

## 2. Authority order

When sources conflict, use the highest applicable authority:

1. explicit approved project/entity source;
2. current project policy / approved state;
3. canonical page/entity content;
4. publishing/entity contracts;
5. editorial/voice/humor candidates when approved for use;
6. research/reference material;
7. drafts and experiments.

Newer does not automatically mean authoritative.

## 3. Mandatory brand reads

For any Dementor Club text:
- `content/pages/about.md`
- `docs/DEMENTOR_VOICE_AND_LANGUAGE_v0.1.md`

For humor-bearing text also read:
- `docs/DEMENTOR_HUMOR_SYSTEM_v0.2.md`

## 4. Surface routing

### Home
Read:
- `content/pages/home.md`
- brand + voice

Goal: fast understanding, low context cost, clear CTA.

### About / manifesto / philosophy
Read:
- `content/pages/about.md`
- brand + voice
- humor only as support

Goal: preserve argument if jokes are removed.

### Project
Read:
- canonical source in responsible project branch
- project mirror only for implementation context
- brand/voice/humor as secondary methods

Example: `logic-awareness` editorial truth remains in the `logic-awareness` branch.

### Event / course / merch / dementor profile
Read:
- responsible canonical record/source
- `docs/PUBLISHING_PLAYBOOK_v1.md`
- `content/ENTITY_CONTRACT.md`
- brand/voice
- humor rules only where the surface allows

### UI
Read:
- `docs/DIA_BEHAVIOUR_SYSTEM_v1.md`
- relevant entity/page source
- voice

Rule: humorous wording may reclassify presentation but may not change canonical facts or interaction meaning.

### Social post
Read:
- brand + voice + humor
- relevant project/entity source if factual claims are involved
- current source/news if topical

### Social visual / OG / poster
Read:
- all text sources above as applicable
- `assets/social/README.md`
- `docs/DEMENTOR_DESIGN_CANON_CURRENT.md`

### Community
Read:
- brand + voice + humor
- approved lore/corpus entries when available

### Payment / legal / support
Read factual source only. Humor is disabled by default.

## 5. Editorial modes

Before drafting set one mode:
- `BRAND_COPY`
- `EDITORIAL_ARTICLE`
- `SOCIAL`
- `HUMOR`
- `PROJECT_CAMPAIGN`
- `COMMUNITY`
- `MERCH`
- `COURSE_GAME`
- `UI_COPY`
- `FACTUAL_NOTICE`

Mode controls tone and joke density, but never changes facts.

## 6. Fact boundary

Editorial law:

`HUMOR MAY REFRAME FACTS. HUMOR MAY NOT MUTATE FACTS.`

Never invent:
- dates;
- prices;
- availability;
- biographies;
- product capabilities;
- event details;
- legal promises;
- project status;
- quotes attributed to real people.

Unknown/unapproved values remain unknown or omitted.

## 7. Editorial review gates

Every publishable text should pass:

### Meaning gate
Does the text preserve the approved idea?

### Fact gate
Are factual claims grounded in the responsible source?

### Voice gate
Does it sound like Dementor rather than generic brand/AI copy?

### Surface gate
Is the density, length and context cost right for the surface?

### Humor gate
If humor is present, does it reveal something rather than merely decorate?

### Clarity gate
Can the user still understand action, status and consequence?

### Generic gate
Could this copy belong to any startup, meme page or self-help brand? If yes, rewrite.

## 8. Editing behavior

When editing approved text:
- do not silently alter approved meaning;
- distinguish correction from semantic change;
- preserve human edits unless explicitly asked to reconsider them;
- if a stronger joke requires changing a fact or thesis, reject the joke;
- flag conflicts instead of resolving authority by guessing.

## 9. Research boundary

External humor/editorial research may suggest mechanisms, tests and references. It cannot become Dementor truth by being recent, popular or stored in Git.

Research -> candidate rule -> test -> explicit approval -> canon.

## 10. Output behavior for editorial GPT

Default response should provide the finished requested text plus only the editorial note necessary for decisions.

Do not expose internal routing or analysis unless asked.

When reviewing existing copy, separate:
- `KEEP`
- `REWRITE`
- `FACT CHECK / SOURCE NEEDED`
- `POLICY CONFLICT`

The editor's role is to protect meaning and voice, not maximize joke count.