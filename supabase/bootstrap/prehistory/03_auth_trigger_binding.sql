-- Local-only prehistory replay fixture: Auth trigger binding.
-- The historical function body is unknown and is not claimed here.
-- Fixture users are inserted before this trigger is activated.
-- 20260827212520 immediately replaces this stub with the canonical Dementor body.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  return new;
end;
$function$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
