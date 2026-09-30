-- =========================================================
-- Categories de trastorn (taxonomia de referència, compartida per a
-- tothom — no és propietat de cap logopeda concret). Es gestiona via
-- migracions, no des de l'app: no hi ha policy d'INSERT/UPDATE/DELETE
-- per a usuaris normals, només SELECT.
-- =========================================================

create table disorder_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  group_key text not null check (group_key in (
    'llenguatge_oral', 'parla', 'fluencia', 'veu', 'motricitat_orofacial',
    'lectoescriptura', 'comunicacio_social', 'trastorns_associats',
    'estimulacio_primerenca'
  )),
  name_ca text not null,
  name_es text not null,
  description_ca text,
  description_es text,
  typical_age_min smallint,
  typical_age_max smallint,
  created_at timestamptz not null default now()
);

alter table disorder_categories enable row level security;

-- Taxonomia de referència: visible per a tothom autenticat, no és dada
-- sensible ni específica de cap pacient.
create policy "Qualsevol usuari autenticat llegeix les categories"
  on disorder_categories for select
  using (true);

-- =========================================================
-- Exercicis: categoria, edat orientativa i dificultat + suport per a
-- exercicis "plantilla" compartits (therapist_id = null), a més dels
-- exercicis privats que cada logopeda ja podia crear.
-- =========================================================

alter table exercises
  add column disorder_category_id uuid references disorder_categories(id);

alter table exercises
  add column min_age smallint;

alter table exercises
  add column max_age smallint;

alter table exercises
  add column difficulty text check (difficulty in ('easy', 'medium', 'hard'));

-- Permet exercicis sense propietari (plantilles compartides, sembrades
-- via migració). Els exercicis privats d'un logopeda continuen tenint
-- therapist_id igual al seu propi id, com fins ara.
alter table exercises
  alter column therapist_id drop not null;

-- La policy "for all" existent (0001_init.sql) ja garanteix que un
-- logopeda gestiona (select/insert/update/delete) els exercicis on
-- therapist_id = auth.uid(). Aquesta policy addicional només amplia la
-- visibilitat en SELECT als exercicis plantilla (therapist_id is null);
-- NINGÚ pot editar-los ni esborrar-los des de l'app, perquè cap policy
-- d'INSERT/UPDATE/DELETE els cobreix.
create policy "Tothom veu els exercicis plantilla compartits"
  on exercises for select
  using (therapist_id is null);
