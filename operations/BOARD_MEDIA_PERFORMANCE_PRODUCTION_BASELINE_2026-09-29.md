---
artifactId: dementor-club.operations.board-media-performance-production-baseline-2026-09-29
project: dementor-club
documentType: QA_EVIDENCE
projectStage: DISCOVERY
gate: G4_DESIGN
status: PASS_MEASURED
version: 1.0
updated: 2026-09-29
owner: Modern Pilgrims
sourceSystem: GIT
authorityType: QA_EVIDENCE
parentQa: BQA-20,BQA-27
productionCommit: a24f8d900cc29e5ae922a9a62b751cc02e88f8d9
measurementSource: READ_ONLY_PRODUCTION_QUERY
productionMutation: false
---

# Board / Media Performance — production baseline measurements

## Environment

Exact production baseline:

`a24f8d900cc29e5ae922a9a62b751cc02e88f8d9`

Measurements were obtained read-only. No DDL, INSERT, UPDATE, DELETE or live migration was performed.

## Current Board population

| Measurement | Production value |
|---|---:|
| Published Artifacts on Board | 21 |
| Idea Artifacts | 3 |
| Artifacts with media | 13 |
| Media rows | 13 |
| Current participant-read RPC count | 3 |

## Media object distribution

| Measurement | Production value |
|---|---:|
| min | 2,556 B / 0.003 MB |
| median | 1,871,958 B / 1.872 MB |
| p90 | 2,892,049 B / 2.892 MB |
| max | 3,176,192 B / 3.176 MB |
| objects >= 3.5 MB | 0 |
| Storage objects matched | 13 / 13 |

MIME distribution:

```text
PNG   12 / 13  = 92.3%
WebP   1 / 13  = 7.7%
JPEG   0 / 13  = 0%
```

## Interpretation boundary

These measurements establish current volume/topology, not latency causality.

Current production participant projection performs only 3 per-Idea reads because there are currently 3 Idea Artifacts.

The media path has 13 objects and almost all are PNG. Median object size is about 1.87 MB and p90 about 2.89 MB.

Therefore the next implementation should prioritize measuring and improving:

1. structural Board render before media signing/loading;
2. signed-media deferral;
3. lazy/async image decode/load;
4. client-side normalization for future uploads.

The DEV1 batch participant RPC remains a valid scalability improvement:

```text
3 current Idea RPC → 1 batch RPC
```

but the current production dataset does not support calling participant N+1 the dominant latency bottleneck without timing evidence.

## Query evidence

### Board / Idea / media counts

```sql
with board_artifacts as (
  select id, artifact_type
  from public.dc_artifacts
  where published_at is not null
    and status in ('active','expired','archived')
    and board_hidden_at is null
),
board_media as (
  select m.id, m.artifact_id, m.storage_bucket, m.storage_path
  from public.dc_artifact_media m
  join board_artifacts a on a.id = m.artifact_id
)
select
  count(*)::bigint as published_board_artifacts,
  count(*) filter (
    where lower(artifact_type) = 'idea'
  )::bigint as ideas,
  (
    select count(distinct artifact_id)::bigint
    from board_media
  ) as artifacts_with_media,
  (
    select count(*)::bigint
    from board_media
  ) as media_rows,
  count(*) filter (
    where lower(artifact_type) = 'idea'
  )::bigint as current_participant_read_rpc_count
from board_artifacts;
```

### Storage object sizes

```sql
with board_artifacts as (
  select id
  from public.dc_artifacts
  where published_at is not null
    and status in ('active','expired','archived')
    and board_hidden_at is null
),
objects as (
  select
    m.id as media_id,
    nullif(o.metadata->>'size','')::bigint as size_bytes,
    lower(
      coalesce(
        o.metadata->>'mimetype',
        m.metadata->>'mime',
        ''
      )
    ) as mime
  from public.dc_artifact_media m
  join board_artifacts a
    on a.id = m.artifact_id
  left join storage.objects o
    on o.bucket_id = m.storage_bucket
   and o.name = m.storage_path
)
select
  count(*)::bigint as media_rows,
  count(size_bytes)::bigint as matched_storage_objects,
  min(size_bytes)::bigint as min_bytes,
  percentile_cont(0.5)
    within group (order by size_bytes)::bigint as median_bytes,
  percentile_cont(0.9)
    within group (order by size_bytes)::bigint as p90_bytes,
  max(size_bytes)::bigint as max_bytes,
  count(*) filter (
    where size_bytes >= 3500000
  )::bigint as objects_ge_3_5mb_decimal,
  count(*) filter (
    where size_bytes >= 3670016
  )::bigint as objects_ge_3_5mib
from objects;
```

### MIME distribution

```sql
with board_artifacts as (
  select id
  from public.dc_artifacts
  where published_at is not null
    and status in ('active','expired','archived')
    and board_hidden_at is null
),
objects as (
  select
    lower(
      coalesce(
        o.metadata->>'mimetype',
        m.metadata->>'mime',
        'unknown'
      )
    ) as mime
  from public.dc_artifact_media m
  join board_artifacts a
    on a.id = m.artifact_id
  left join storage.objects o
    on o.bucket_id = m.storage_bucket
   and o.name = m.storage_path
)
select
  case
    when mime in ('image/jpeg','image/jpg') then 'JPEG'
    when mime = 'image/png' then 'PNG'
    when mime = 'image/webp' then 'WebP'
    else mime
  end as mime_group,
  count(*)::bigint as count
from objects
group by 1
order by count desc, mime_group;
```

## Next measurement requirement

DEV2 browser baseline must now measure actual timing against a fixture that reflects this production shape as closely as practical:

```text
21 Artifacts
3 Ideas
13 media rows
PNG-heavy media distribution
```

Synthetic delay tests remain required to prove that media/participant enrichment no longer blocks structural Board usability.
