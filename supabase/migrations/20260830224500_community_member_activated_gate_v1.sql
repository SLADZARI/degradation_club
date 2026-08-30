-- Dementor Club Community — participation-before-reaction gate.
-- Safe additive hardening on top of the existing Community v1 runtime.
-- Keeps current direct table writes from board.js; authorization is enforced by RLS.

begin;

create or replace function public.dc_member_activated_v1()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    auth.uid() is not null
    and public.dc_membership_active(auth.uid())
    and exists (
      select 1
      from public.dc_artifacts a
      where a.author_profile_id = auth.uid()
        and a.published_at is not null
        and a.status <> 'removed'
    );
$$;

revoke all on function public.dc_member_activated_v1() from public, anon;
grant execute on function public.dc_member_activated_v1() to authenticated;

-- Reaction insert: active Member + first Artifact already published + readable active target.
drop policy if exists dc_artifact_reactions_insert_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_insert_own
on public.dc_artifact_reactions
for insert
to authenticated
with check (
  (select auth.uid()) = profile_id
  and (select public.dc_member_activated_v1())
  and exists (
    select 1
    from public.dc_artifacts a
    where a.id = artifact_id
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

-- A Member who has activated Community may remove their own reaction.
drop policy if exists dc_artifact_reactions_delete_own on public.dc_artifact_reactions;
create policy dc_artifact_reactions_delete_own
on public.dc_artifact_reactions
for delete
to authenticated
using (
  (select auth.uid()) = profile_id
  and (select public.dc_member_activated_v1())
);

-- Response insert: preserve current self-response prohibition and target-state checks.
drop policy if exists dc_artifact_responses_insert_own on public.dc_artifact_responses;
create policy dc_artifact_responses_insert_own
on public.dc_artifact_responses
for insert
to authenticated
with check (
  (select auth.uid()) = responder_profile_id
  and status = 'submitted'
  and (select public.dc_member_activated_v1())
  and exists (
    select 1
    from public.dc_artifacts a
    where a.id = artifact_id
      and a.author_profile_id <> (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
      and (a.expires_at is null or a.expires_at > now())
  )
);

-- Preserve withdrawal/update semantics, now with the same activation boundary.
drop policy if exists dc_artifact_responses_update_own on public.dc_artifact_responses;
create policy dc_artifact_responses_update_own
on public.dc_artifact_responses
for update
to authenticated
using (
  (select auth.uid()) = responder_profile_id
  and (select public.dc_member_activated_v1())
)
with check (
  (select auth.uid()) = responder_profile_id
  and status in ('submitted','withdrawn')
);

-- Current data was checked before preparing this migration: no duplicate submitted responses.
create unique index if not exists dc_artifact_responses_one_submitted_per_member_idx
on public.dc_artifact_responses (artifact_id, responder_profile_id)
where status = 'submitted';

commit;
