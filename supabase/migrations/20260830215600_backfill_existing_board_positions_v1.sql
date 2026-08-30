-- Backfill existing active Community Artifacts so the spatial Board does not lose pre-v2 content.

begin;

with ranked as (
  select
    a.id,
    row_number() over (order by coalesce(a.published_at,a.created_at),a.id) - 1 as rn
  from public.dc_artifacts a
  where a.visibility='community'
    and a.status='active'
    and (a.expires_at is null or a.expires_at>now())
)
insert into public.dc_artifact_board_positions(
  artifact_id,board_id,x,y,rotation,size_class,position_version,placed_at,moved_at
)
select
  r.id,
  'community',
  1700 + (r.rn % 6) * 520,
  900 + floor(r.rn / 6) * 430,
  ((r.rn % 5) - 2) * 0.35,
  'S',
  1,
  now(),
  now()
from ranked r
on conflict (artifact_id) do nothing;

commit;
