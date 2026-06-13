/*supabase sql editor commands*/

create table ride_history (
  id text primary key,
  trip_id text not null,
  rider_id text not null,
  driver_id text not null,
  pickup_address text not null,
  dropoff_address text not null,
  price numeric not null,
  status text not null,
  duration_minutes numeric not null,
  timestamp timestamptz default now()
);

alter table ride_history enable row level security;

create policy "Allow public inserts" on ride_history 
for insert 
with check (true);

create policy "Allow public selects" on ride_history 
for select 
using (true);