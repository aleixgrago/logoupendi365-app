-- =========================================================
-- Preparació per a v1.1 / v2 — taules creades ara (amb RLS des del primer
-- dia, com sempre) però SENSE cap ruta ni component que hi escrigui encara.
-- Zero risc per a la v1: si no hi ha codi que les faci servir, no hi ha
-- superfície d'atac addicional real, només estructura a punt.
-- =========================================================

-- ---------------------------------------------------------
-- VIDEOS (v1.1) — mateix patró que `documents`, però amb camps propis
-- per validar durada/mida abans de pujar-los (es farà des de l'app, no
-- des de la BBDD, però deixem la columna preparada per si cal filtrar-hi).
-- ---------------------------------------------------------
create table videos (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  exercise_assignment_id uuid references exercise_assignments(id) on delete set null,
  uploaded_by uuid not null references profiles(id),
  storage_path text not null,
  duration_seconds int,
  created_at timestamptz not null default now()
);

create index idx_videos_patient on videos(patient_id);

alter table videos enable row level security;

create policy "Logopeda veu vídeos dels seus pacients"
  on videos for select
  using (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  );

create policy "Tutors gestionen els vídeos que pugen dels seus fills"
  on videos for all
  using (
    exists (
      select 1 from patient_guardians pg
      where pg.patient_id = videos.patient_id and pg.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from patient_guardians pg
      where pg.patient_id = videos.patient_id and pg.parent_id = auth.uid()
    )
  );

-- ---------------------------------------------------------
-- CLINICAL_SESSIONS (v2) — notes clíniques redactades pel logopeda per
-- cada sessió presencial. Diferent de `history_events`: aquella taula és
-- un log automàtic d'accions del sistema; aquesta és contingut clínic
-- redactat pel professional (i, per tant, dada de salut sensible amb el
-- mateix nivell de protecció que `patients.diagnosis`).
-- ---------------------------------------------------------
create table clinical_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  therapist_id uuid not null references profiles(id),
  session_date date not null default current_date,
  duration_minutes int,
  notes text,
  language text check (language in ('ca', 'es')),
  created_at timestamptz not null default now()
);

create index idx_clinical_sessions_patient on clinical_sessions(patient_id, session_date desc);

alter table clinical_sessions enable row level security;

create policy "Logopeda gestiona notes de sessió dels seus pacients"
  on clinical_sessions for all
  using (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  )
  with check (
    exists (select 1 from patients p where p.id = patient_id and p.therapist_id = auth.uid())
  );

-- Deliberadament NO hi ha policy de select per a `patient_guardians`: les
-- notes clíniques redactades pel professional no es mostren directament
-- als pares en aquesta fase (decisió a revisar en v2, no tècnica sinó de
-- producte/clínica — quant se n'ha de compartir amb la família tal qual).

-- ---------------------------------------------------------
-- NOTA: `reports` (informes IA) ja es va crear a 0001_init.sql amb el
-- flux draft → reviewed → final. No cal cap canvi addicional aquí; ja
-- està preparada per a la funcionalitat d'IA de la v2.
-- ---------------------------------------------------------
