-- =========================================================
-- Logoupendi365 — Esquema de base de dades (Supabase/Postgres)
-- Abast: v1 MVP (sense IA, sense vídeos — veure notes al final)
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------
create type user_role as enum ('therapist', 'parent');
create type patient_status as enum ('active', 'inactive');
create type goal_status as enum ('active', 'achieved', 'paused');
create type assignment_status as enum ('pending', 'in_progress', 'completed');
create type report_status as enum ('draft', 'reviewed', 'final'); -- preparat per v2

-- ---------------------------------------------------------
-- PROFILES (extén auth.users amb el rol)
-- ---------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  phone text,
  consent_accepted_at timestamptz, -- consentiment RGPD (per a pares)
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Els usuaris veuen el seu propi perfil"
  on profiles for select
  using (id = auth.uid());

create policy "Els usuaris actualitzen el seu propi perfil"
  on profiles for update
  using (id = auth.uid());

-- ---------------------------------------------------------
-- PATIENTS
-- ---------------------------------------------------------
create table patients (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references profiles(id) on delete restrict,
  first_name text not null,
  last_name text not null,
  birth_date date not null,
  diagnosis text,           -- dada de categoria especial: accés restringit via RLS
  notes text,
  status patient_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_patients_therapist on patients(therapist_id);
create index idx_patients_status on patients(status);

alter table patients enable row level security;

-- Taula pont: un pacient pot tenir 1 o 2 tutors amb accés
create table patient_guardians (
  patient_id uuid not null references patients(id) on delete cascade,
  parent_id uuid not null references profiles(id) on delete cascade,
  primary key (patient_id, parent_id)
);

alter table patient_guardians enable row level security;

create policy "El logopeda gestiona els seus pacients"
  on patients for all
  using (therapist_id = auth.uid())
  with check (therapist_id = auth.uid());

create policy "Els tutors veuen els pacients vinculats"
  on patients for select
  using (
    exists (
      select 1 from patient_guardians pg
      where pg.patient_id = patients.id and pg.parent_id = auth.uid()
    )
  );

create policy "El logopeda gestiona els vincles de tutors"
  on patient_guardians for all
  using (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  );

create policy "El tutor veu el seu propi vincle"
  on patient_guardians for select
  using (parent_id = auth.uid());

-- ---------------------------------------------------------
-- GOALS (objectius terapèutics)
-- ---------------------------------------------------------
create table goals (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  title text not null,
  description text,
  start_date date not null default current_date,
  status goal_status not null default 'active',
  progress_pct smallint not null default 0 check (progress_pct between 0 and 100),
  created_at timestamptz not null default now()
);

create index idx_goals_patient on goals(patient_id);

alter table goals enable row level security;

create policy "Accés a objectius via propietat del pacient"
  on goals for all
  using (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  )
  with check (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  );

create policy "Tutors veuen objectius dels seus fills"
  on goals for select
  using (
    exists (
      select 1 from patient_guardians pg
      where pg.patient_id = goals.patient_id and pg.parent_id = auth.uid()
    )
  );

-- ---------------------------------------------------------
-- EXERCISES (biblioteca — no és IA, és catàleg gestionat pel logopeda)
-- ---------------------------------------------------------
create table exercises (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  estimated_minutes int,
  recommended_frequency text, -- p.ex. "3 cops/setmana"
  pdf_path text,              -- ruta a Supabase Storage
  created_at timestamptz not null default now()
);

create index idx_exercises_therapist on exercises(therapist_id);

alter table exercises enable row level security;

create policy "El logopeda gestiona la seva biblioteca d'exercicis"
  on exercises for all
  using (therapist_id = auth.uid())
  with check (therapist_id = auth.uid());

-- ---------------------------------------------------------
-- EXERCISE_ASSIGNMENTS
-- ---------------------------------------------------------
create table exercise_assignments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  exercise_id uuid not null references exercises(id) on delete restrict,
  goal_id uuid references goals(id) on delete set null,
  assigned_date date not null default current_date,
  status assignment_status not null default 'pending',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_assignments_patient on exercise_assignments(patient_id);
create index idx_assignments_status on exercise_assignments(status);

alter table exercise_assignments enable row level security;

create policy "Logopeda gestiona assignacions dels seus pacients"
  on exercise_assignments for all
  using (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  )
  with check (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  );

create policy "Tutors veuen assignacions dels seus fills"
  on exercise_assignments for select
  using (
    exists (
      select 1 from patient_guardians pg
      where pg.patient_id = exercise_assignments.patient_id and pg.parent_id = auth.uid()
    )
  );

-- IMPORTANT: els pares NO reben permís UPDATE directe sobre la fila (evitem que
-- puguin canviar patient_id, exercise_id, etc. via RLS de columna, que Postgres
-- no suporta nativament). En comptes d'això, marquen "completat" via una funció
-- SECURITY DEFINER controlada:
create or replace function mark_assignment_completed(assignment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update exercise_assignments ea
  set status = 'completed', completed_at = now()
  where ea.id = assignment_id
    and exists (
      select 1 from patient_guardians pg
      where pg.patient_id = ea.patient_id and pg.parent_id = auth.uid()
    );
end;
$$;

-- ---------------------------------------------------------
-- DOCUMENTS
-- ---------------------------------------------------------
create table documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  uploaded_by uuid not null references profiles(id),
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);

create index idx_documents_patient on documents(patient_id);

alter table documents enable row level security;

create policy "Logopeda gestiona documents dels seus pacients"
  on documents for all
  using (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  )
  with check (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  );

create policy "Tutors veuen documents dels seus fills"
  on documents for select
  using (
    exists (
      select 1 from patient_guardians pg
      where pg.patient_id = documents.patient_id and pg.parent_id = auth.uid()
    )
  );

-- ---------------------------------------------------------
-- HISTORY_EVENTS (timeline + auditoria d'accés)
-- ---------------------------------------------------------
create table history_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  event_type text not null, -- 'goal_created' | 'exercise_assigned' | 'document_uploaded' | 'patient_viewed' | ...
  payload jsonb,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create index idx_history_patient on history_events(patient_id, created_at desc);

alter table history_events enable row level security;

create policy "Logopeda veu l'historial dels seus pacients"
  on history_events for select
  using (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  );

create policy "El sistema insereix events (via backend, no des del client)"
  on history_events for insert
  with check (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
    or exists (
      select 1 from patient_guardians pg
      where pg.patient_id = history_events.patient_id and pg.parent_id = auth.uid()
    )
  );

-- ---------------------------------------------------------
-- REPORTS — taula preparada per a v2 (IA), NO s'exposa a UI al v1
-- ---------------------------------------------------------
create table reports (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  generated_by uuid references profiles(id),
  content jsonb not null,
  status report_status not null default 'draft', -- mai 'final' sense revisió humana
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table reports enable row level security;

create policy "Logopeda gestiona informes dels seus pacients"
  on reports for all
  using (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  )
  with check (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  );

-- =========================================================
-- NOTES D'IMPLEMENTACIÓ
-- =========================================================
-- 1. La taula `videos` NO es crea en aquest script perquè es mou a v1.1.
--    Quan es construeixi, ha de seguir el mateix patró que `documents`
--    (accés via patients.therapist_id / patient_guardians) més: caducitat
--    d'URL signada, límit de mida/durada, i política de retenció explícita.
--
-- 2. Totes les insercions a `history_events` s'han de fer des de Route
--    Handlers / Server Actions (mai directament des del client amb la clau
--    anon), perquè els events d'auditoria ('patient_viewed') no es poden
--    confiar a l'usuari.
--
-- 3. Abans de producció amb dades reals: activar Point-in-Time Recovery
--    a Supabase, revisar que el bucket de Storage NO sigui públic, i
--    documentar aquest esquema al Registre d'Activitats de Tractament (RGPD).
