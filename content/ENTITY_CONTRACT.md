# Dementor Club — Entity Contract v1

Status: implementation contract
Branch responsibility: `dementor-club-site`

This file defines how approved club entities are mirrored into the official-site implementation.
It is not a source of truth for club facts.

## Core record

Every addressable public entity uses these fields:

- `id` — stable public identifier, never recycled;
- `entityType` — `event | project | merch | course | archive-record`;
- `title` — approved public title;
- `slug` — stable route slug;
- `status` — approved status from the responsible source branch;
- `publicUrl` — permanent site URL;
- `preview` — optional raster preview asset;
- `provenance` — responsible source branch and path;
- `updatedAt` — date of implementation mirror update.

## Optional typed fields

Typed records may add fields such as:

- event: `location`, `dateTime`, `venue`, `programme`, `price`, `registrationUrl`, `relatedProjects`;
- project: `editorialSource`, `summary`, `publicationStatus`;
- merch: `statement`, `material`, `edition`, `price`, `shopStatus`;
- course: `delivery`, `dementor`, `modules`, `progressStorage`.

Unknown or unapproved values are `null` or omitted. They are never inferred from design copy.

## Status law

Status is factual metadata, not UI copy.
DIA reclassification may change interface wording but must not change the underlying record status.

## Provenance law

`dementor-club-site` only mirrors approved facts.
Canonical responsibility remains with the owning branch:

- club/event/merch/community facts → `dementor-club`;
- Logic & Awareness editorial facts → `logic-awareness`;
- web implementation → `dementor-club-site`.

## URL law

One entity = one stable URL.
Lifecycle changes status and archive placement, not the URL.
