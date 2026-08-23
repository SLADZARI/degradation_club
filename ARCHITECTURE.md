# Project architecture

## Repository

`SLADZARI/degradation_club`

### Branch map

| Direction | Git branch | Google Drive |
|---|---|---|
| Логика и осознанность | `logic-awareness` | https://drive.google.com/drive/folders/19yyCldn77GIgf5QVy3OEqlM23fLYpGFj |
| Dementor Club | `dementor-club` | https://drive.google.com/drive/folders/1o5yPQdQ75zpzO0NBLhv26EpGHD_LPWMS |
| Dementor Club Official Site | `dementor-club-site` | https://drive.google.com/drive/folders/1GKqhB8NGxGeD6vEStwkfBfaHep-GXg_b |

## Responsibility boundaries

### `logic-awareness`
Independent editorial/content system. Source-of-truth for posts, series, tone of voice, publishing plan and visual prompts for the channel.

### `dementor-club`
Source-of-truth for the club itself: concept, positioning, programs, products, membership logic, operating rules and approved club copy.

### `dementor-club-site`
Implementation branch. Contains only website code, website assets/configuration and web-ready content. Semantic changes originate in `dementor-club`, not here.

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
Approved club content (`dementor-club`) → web implementation (`dementor-club-site`) → assets from site Drive folder → deploy.
