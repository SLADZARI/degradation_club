# Project architecture

## Repository

`SLADZARI/degradation_club`

### Branch map

| Direction | Git branch | Google Drive |
|---|---|---|
| Логика и осознанность | `logic-awareness` | https://drive.google.com/drive/folders/19yyCldn77GIgf5QVy3OEqlM23fLYpGFj |
| Dementor Club | `dementor-club` | https://drive.google.com/drive/folders/1o5yPQdQ75zpzO0NBLhv26EpGHD_LPWMS |
| Dementor Club Official Site — staging / implementation | `dementor-club-site` | https://drive.google.com/drive/folders/1GKqhB8NGxGeD6vEStwkfBfaHep-GXg_b |
| Dementor Club Official Site — production candidate | `dementor-club-production` | same approved site assets; no independent semantic source |
| Shared repository infrastructure | `main` | n/a |

## Responsibility boundaries

### `logic-awareness`
Independent editorial/content system. Source-of-truth for posts, series, tone of voice, publishing plan and visual prompts for the channel.

### `dementor-club`
Source-of-truth for the club itself: concept, positioning, programs, products, membership logic, operating rules and approved club copy.

### `dementor-club-site`
Implementation/staging branch. Contains website code, website assets/configuration and web-ready content. Layouts may be developed and approved here using test/demo material. Semantic changes originate in `dementor-club`, not here.

### `dementor-club-production`
Protected production-candidate branch for `dementor.club`. It is not a workspace. Changes enter through a pull request and must pass the required `validate` GitHub Actions check. Force pushes and branch deletion are blocked.

A layout approved on test material does **not** approve that test material for production. Before release, mock/demo/test/placeholder content must be replaced by separately approved public content, or the route must be explicitly kept non-public/disabled by the production release guard.

### `main`
Shared repository infrastructure only: repository architecture and manual production dispatcher. It does not replace the club, project or site source-of-truth branches.

## Git ↔ Drive rule

**Git = structure, text, versioning, code, status.**

**Drive = media, source assets, working documents, exports.**

Every production item should have a stable project ID. The same ID is used in Git filenames and Drive folders/assets.

Recommended prefixes:

- `LA-###` — Logic & Awareness;
- `DC-###` — Dementor Club;
- `DCS-###` — Dementor Club Site.

## Change flow

### Channel
Idea → Git draft → approved text → visual production on Drive → final link back into Git → publish → archive.

### Club
Research/idea → Git concept → approval → supporting files on Drive → approved source-of-truth in Git.

### Site
Approved club content (`dementor-club`) → implementation/staging (`dementor-club-site`) → layout approval → replace test/demo material with approved public material → PR into `dementor-club-production` → required `validate` check → merge → explicit manual production dispatch → `dementor.club`.

Production deployment is manual-only. The dispatcher lives on `main` so GitHub exposes `workflow_dispatch`, but it checks out and builds only `dementor-club-production` and requires the operator to type `APPROVED`.
