begin;

revoke all on schema legacy_edu from public;
revoke all on schema legacy_edu from anon;
revoke all on schema legacy_edu from authenticated;

revoke all privileges on all tables in schema legacy_edu from anon;
revoke all privileges on all tables in schema legacy_edu from authenticated;
revoke all privileges on all sequences in schema legacy_edu from anon;
revoke all privileges on all sequences in schema legacy_edu from authenticated;
revoke all privileges on all functions in schema legacy_edu from anon;
revoke all privileges on all functions in schema legacy_edu from authenticated;

alter table legacy_edu.profiles enable row level security;

commit;