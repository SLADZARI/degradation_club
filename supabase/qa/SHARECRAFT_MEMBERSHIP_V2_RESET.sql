-- DEMENTOR CLUB / MEMBERSHIP V2 QA FIXTURE RESET
-- TARGET: sharecraftwideo@gmail.com
-- RUN ONLY AFTER Membership v2 site cutover is complete.
-- This intentionally preserves assessment history, Community Artifacts and Artifact grants.

begin;

update public.dc_system_memberships m
set status = 'waiting',
    valid_to = null,
    source_system = 'dementor-club',
    source_ref = 'membership-v2-qa-reset',
    provenance_status = 'confirmed',
    confirmed_at = now(),
    updated_at = now()
from public.profiles p
where p.id = m.profile_id
  and lower(p.email) = 'sharecraftwideo@gmail.com';

-- Do not delete dc_member_public_profiles, dc_artifacts, assessment_runs,
-- assessment_snapshots or dc_artifact_slot_grants.

commit;

-- EXPECTED AFTER RESET:
-- server DC-9 = 9/9
-- membership = waiting
-- application = none/open according to test stage
-- historical Artifacts preserved
-- initial slot grant preserved, so v2 acceptance will not duplicate it
