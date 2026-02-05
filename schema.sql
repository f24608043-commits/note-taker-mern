-- Create the 'notes' table with robust constraints
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled',
  content text,
  due_date timestamp with time zone,
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  completed boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- Create Index for faster queries on user_id
create index notes_user_id_idx on public.notes (user_id);

-- Create Index for sorting by created_at
create index notes_created_at_idx on public.notes (created_at desc);

-- RLS POLICY: ALLOW ALL Actions for Owners
create policy "Users can manage their own notes"
on public.notes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- FUNCTION & TRIGGER: Automatically update 'updated_at'
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_notes_updated
  before update on public.notes
  for each row
  execute procedure public.handle_updated_at();
