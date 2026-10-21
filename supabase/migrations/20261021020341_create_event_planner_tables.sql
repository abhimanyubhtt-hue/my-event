/*
# Create Celebration & Event Planner tables (single-tenant, no auth)

1. Overview
This app lets a single user plan celebrations and events. There is no sign-in screen,
so all data is intentionally shared/public and the anon-key client must be able to
read and write every table. Policies therefore target `anon, authenticated`.

2. New Tables
- `events`
  - `id` (uuid, primary key)
  - `title` (text, not null) — name of the event
  - `event_type` (text, not null) — one of: wedding, birthday, community, corporate
  - `budget` (numeric, not null, default 0) — overall budget in currency units
  - `event_date` (date, nullable) — the scheduled date of the event
  - `guest_count` (integer, nullable) — estimated number of guests
  - `vibe` (text, nullable) — free-text style/vibe descriptor used by the AI generator
  - `settings` (jsonb, default '{}') — extra configuration (palette, theme, etc.)
  - `created_at` (timestamptz, default now())
- `budget_allocations`
  - `id` (uuid, primary key)
  - `event_id` (uuid, references events, cascade delete)
  - `category` (text, not null) — one of: venue, catering, decor, entertainment, photography
  - `allocated` (numeric, not null, default 0) — amount allocated to the category
  - `spent` (numeric, not null, default 0) — amount already spent
  - `created_at` (timestamptz, default now())
- `checklist_items`
  - `id` (uuid, primary key)
  - `event_id` (uuid, references events, cascade delete)
  - `category` (text, not null) — vendor type: venue, catering, decor, entertainment, photography, other
  - `label` (text, not null) — the checklist task text
  - `completed` (boolean, not null, default false)
  - `sort_order` (integer, not null, default 0)
  - `created_at` (timestamptz, default now())

3. Indexes
- `budget_allocations.event_id`
- `checklist_items.event_id`

4. Security
- Enable RLS on all three tables.
- All tables are intentionally shared (no sign-in), so CRUD is open to
  `anon, authenticated` with `USING (true)` / `WITH CHECK (true)`.

5. Notes
- `numeric` is used for monetary values to avoid floating point errors.
- Cascade deletes keep child rows consistent when an event is removed.
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'My Event',
  event_type text NOT NULL DEFAULT 'birthday',
  budget numeric NOT NULL DEFAULT 0,
  event_date date,
  guest_count integer,
  vibe text,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS budget_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category text NOT NULL,
  allocated numeric NOT NULL DEFAULT 0,
  spent numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category text NOT NULL,
  label text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_budget_allocations_event_id ON budget_allocations(event_id);
CREATE INDEX IF NOT EXISTS idx_checklist_items_event_id ON checklist_items(event_id);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- events policies
DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE
  TO anon, authenticated USING (true);

-- budget_allocations policies
DROP POLICY IF EXISTS "anon_select_budget_allocations" ON budget_allocations;
CREATE POLICY "anon_select_budget_allocations" ON budget_allocations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_budget_allocations" ON budget_allocations;
CREATE POLICY "anon_insert_budget_allocations" ON budget_allocations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_budget_allocations" ON budget_allocations;
CREATE POLICY "anon_update_budget_allocations" ON budget_allocations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_budget_allocations" ON budget_allocations;
CREATE POLICY "anon_delete_budget_allocations" ON budget_allocations FOR DELETE
  TO anon, authenticated USING (true);

-- checklist_items policies
DROP POLICY IF EXISTS "anon_select_checklist_items" ON checklist_items;
CREATE POLICY "anon_select_checklist_items" ON checklist_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_checklist_items" ON checklist_items;
CREATE POLICY "anon_insert_checklist_items" ON checklist_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_checklist_items" ON checklist_items;
CREATE POLICY "anon_update_checklist_items" ON checklist_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_checklist_items" ON checklist_items;
CREATE POLICY "anon_delete_checklist_items" ON checklist_items FOR DELETE
  TO anon, authenticated USING (true);
