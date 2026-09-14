alter table if exists public.mp_spore_credits
  add column if not exists tool_leverage numeric(4,2) not null default 1.00,
  add column if not exists tool_refs jsonb not null default '[]'::jsonb,
  add column if not exists tool_leverage_reason text;

alter table if exists public.mp_spore_credits
  drop constraint if exists mp_spore_credits_tool_leverage_check;

alter table if exists public.mp_spore_credits
  add constraint mp_spore_credits_tool_leverage_check
  check (tool_leverage >= 1.00 and tool_leverage <= 1.20);

comment on column public.mp_spore_credits.tool_leverage is
  'MP-SPORES-v0.4 ToolLeverage multiplier. Default 1.0; >1.0 requires reviewed reusable leverage evidence.';
comment on column public.mp_spore_credits.tool_refs is
  'JSON array of tool IDs/evidence references supporting the person-level contribution.';
comment on column public.mp_spore_credits.tool_leverage_reason is
  'Human-readable reason for ToolLeverage > 1.0. Tool usage alone is insufficient.';