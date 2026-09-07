-- Board Owner Admin storage alignment v2
-- Reuses the canonical dc-community-artifacts bucket and own-user folder contract.

-- Owner Admin may read the same private Artifact media surface as active Members.
drop policy if exists dc_community_artifacts_storage_select_members on storage.objects;
create policy dc_community_artifacts_storage_select_members
on storage.objects for select to authenticated
using (
  bucket_id = 'dc-community-artifacts'
  and ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()))
);

-- Owner Admin may upload only into their own auth.uid() folder, exactly like a Member.
drop policy if exists dc_community_artifacts_storage_insert_own on storage.objects;
create policy dc_community_artifacts_storage_insert_own
on storage.objects for insert to authenticated
with check (
  bucket_id = 'dc-community-artifacts'
  and ((select public.dc_membership_active()) or (select public.dc_is_owner_admin()))
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
