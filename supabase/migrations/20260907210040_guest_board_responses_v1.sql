-- Authenticated Guests may respond to active community artifacts without becoming Members.
-- Member response policy remains unchanged; this is an additional narrow Guest policy.

create policy dc_artifact_responses_insert_guest
on public.dc_artifact_responses
for insert
to authenticated
with check (
  (select auth.uid()) = responder_profile_id
  and status = 'submitted'
  and not (select public.dc_membership_active())
  and exists (
    select 1
    from public.dc_artifacts a
    where a.id = dc_artifact_responses.artifact_id
      and a.author_profile_id <> (select auth.uid())
      and a.visibility = 'community'
      and a.status = 'active'
      and a.published_at is not null
      and (a.starts_at is null or a.starts_at <= now())
      and (a.expires_at is null or a.expires_at > now())
  )
);
