-- Local-only prehistory replay fixture: schema fragment.
-- This is a minimum structural fixture justified by read-only production structure.
-- It is NOT asserted to be the exact historical EDU schema source.

create type public.company_status as enum ('active','inactive');
create type public.burnout_risk as enum ('low','medium','high');
create type public.adoption_status as enum ('observing','experimenting','applying','integrating');
create type public.user_role as enum ('admin','mentor','owner','employee');
create type public.user_status as enum ('active','inactive');
create type public.recommendation_priority as enum ('low','medium','high');
create type public.session_status as enum ('planned','completed','needs_follow_up','skipped');
create type public.task_status as enum ('assigned','in_progress','done','reviewed','stuck');

create table public.companies (
  id uuid not null default gen_random_uuid(),
  company_name text not null,
  logo_url text,
  description text,
  status public.company_status not null default 'active'::public.company_status,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint companies_pkey primary key (id),
  constraint companies_created_by_fkey foreign key (created_by) references auth.users(id)
);

create table public.departments (
  id uuid not null default gen_random_uuid(),
  company_id uuid not null,
  name text not null,
  lead_id uuid,
  created_at timestamptz not null default now(),
  constraint departments_pkey primary key (id),
  constraint departments_company_id_fkey foreign key (company_id) references public.companies(id) on delete cascade,
  constraint departments_lead_id_fkey foreign key (lead_id) references auth.users(id)
);

create table public.profiles (
  id uuid not null,
  email text not null,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'employee'::public.user_role,
  company_id uuid,
  department_id uuid,
  status public.user_status not null default 'active'::public.user_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_id_fkey foreign key (id) references auth.users(id) on delete cascade,
  constraint users_company_id_fkey foreign key (company_id) references public.companies(id) on delete set null,
  constraint users_department_id_fkey foreign key (department_id) references public.departments(id) on delete set null
);

create table public.employee_profiles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  position text,
  work_context text,
  main_tools text[],
  pain_points text,
  learning_goal text,
  burnout_risk public.burnout_risk not null default 'low'::public.burnout_risk,
  adoption_status public.adoption_status not null default 'observing'::public.adoption_status,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employee_profiles_pkey primary key (id),
  constraint employee_profiles_user_id_key unique (user_id),
  constraint employee_profiles_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade
);

create table public.mentor_assignments (
  id uuid not null default gen_random_uuid(),
  mentor_id uuid not null,
  company_id uuid not null,
  assigned_by uuid,
  created_at timestamptz not null default now(),
  constraint mentor_assignments_pkey primary key (id),
  constraint mentor_assignments_mentor_id_fkey foreign key (mentor_id) references public.profiles(id) on delete cascade,
  constraint mentor_assignments_company_id_fkey foreign key (company_id) references public.companies(id) on delete cascade,
  constraint mentor_assignments_assigned_by_fkey foreign key (assigned_by) references public.profiles(id)
);

create table public.sessions (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  mentor_id uuid not null,
  company_id uuid not null,
  department_id uuid,
  title text not null,
  session_date timestamptz not null,
  status public.session_status not null default 'planned'::public.session_status,
  mentor_progress_mark integer,
  employee_self_mark integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sessions_pkey primary key (id),
  constraint sessions_employee_id_fkey foreign key (employee_id) references public.profiles(id) on delete cascade,
  constraint sessions_mentor_id_fkey foreign key (mentor_id) references public.profiles(id) on delete cascade,
  constraint sessions_company_id_fkey foreign key (company_id) references public.companies(id) on delete cascade,
  constraint sessions_department_id_fkey foreign key (department_id) references public.departments(id) on delete set null
);

create table public.session_summaries (
  id uuid not null default gen_random_uuid(),
  session_id uuid not null,
  summary text,
  what_was_done text,
  key_insights text,
  next_recommendation text,
  mentor_notes text,
  visibility text default 'mentor_owner'::text,
  created_by uuid,
  created_at timestamptz not null default now(),
  constraint session_summaries_pkey primary key (id),
  constraint session_summaries_session_id_fkey foreign key (session_id) references public.sessions(id) on delete cascade,
  constraint session_summaries_created_by_fkey foreign key (created_by) references public.profiles(id)
);

create table public.session_links (
  id uuid not null default gen_random_uuid(),
  session_id uuid not null,
  type text not null,
  title text,
  url text not null,
  created_at timestamptz not null default now(),
  constraint session_links_pkey primary key (id),
  constraint session_links_session_id_fkey foreign key (session_id) references public.sessions(id) on delete cascade
);

create table public.tasks (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  assigned_by uuid not null,
  assigned_to uuid,
  title text not null,
  description text,
  type text not null default 'text'::text,
  external_link text,
  due_date timestamptz,
  status public.task_status not null default 'assigned'::public.task_status,
  mentor_feedback text,
  owner_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_pkey primary key (id),
  constraint tasks_employee_id_fkey foreign key (employee_id) references public.profiles(id) on delete cascade,
  constraint tasks_assigned_by_fkey foreign key (assigned_by) references public.profiles(id) on delete cascade,
  constraint tasks_assigned_to_fkey foreign key (assigned_to) references public.profiles(id) on delete set null
);

create table public.recommendations (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  created_by uuid,
  title text not null,
  description text,
  priority public.recommendation_priority not null default 'medium'::public.recommendation_priority,
  status text not null default 'active'::text,
  created_at timestamptz not null default now(),
  constraint recommendations_pkey primary key (id),
  constraint recommendations_employee_id_fkey foreign key (employee_id) references public.profiles(id) on delete cascade,
  constraint recommendations_created_by_fkey foreign key (created_by) references public.profiles(id)
);

create table public.feedback (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  author_id uuid not null,
  visibility text not null default 'mentor_owner'::text,
  message text not null,
  created_at timestamptz not null default now(),
  constraint feedback_pkey primary key (id),
  constraint feedback_employee_id_fkey foreign key (employee_id) references public.profiles(id) on delete cascade,
  constraint feedback_author_id_fkey foreign key (author_id) references public.profiles(id) on delete cascade
);

alter table public.companies enable row level security;
alter table public.departments enable row level security;
alter table public.employee_profiles enable row level security;
alter table public.feedback enable row level security;
alter table public.mentor_assignments enable row level security;
alter table public.profiles enable row level security;
alter table public.recommendations enable row level security;
alter table public.session_links enable row level security;
alter table public.session_summaries enable row level security;
alter table public.sessions enable row level security;
alter table public.tasks enable row level security;

create policy profiles_select_authenticated
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);
