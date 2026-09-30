-- =========================================================
-- CENTERS — la unitat d'aïllament multi-tenant
-- =========================================================

create table centers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text unique not null,
  created_at timestamptz not null default now()
);

alter table centers enable row level security;

-- Els membres del propi centre poden veure'n les dades bàsiques (nom,
-- codi d'invitació). Cap altre centre no hi té accés.
create policy "Els membres veuen el seu propi centre"
  on centers for select
  using (
    id = (select center_id from profiles where id = auth.uid())
  );

alter table profiles add column center_id uuid references centers(id);

-- El pacient queda vinculat al centre en el moment de crear-lo (l'app ho
-- omple automàticament amb el centre del terapeuta que el dona d'alta).
-- Nul·lable per no trencar els pacients de prova ja creats abans
-- d'aquesta migració — a la pràctica, tot pacient nou en tindrà sempre.
alter table patients add column center_id uuid references centers(id);

-- ---------------------------------------------------------
-- Funcions SECURITY DEFINER: després del bug de recursió infinita entre
-- `patients` i `patient_guardians`, qualsevol comprovació que travessi
-- taules amb RLS pròpia es fa ara SEMPRE amb una funció d'aquest tipus,
-- que bypassa RLS internament i no pot tornar a disparar cap policy.
-- ---------------------------------------------------------

create or replace function public.my_center_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select center_id from profiles where id = auth.uid();
$$;

create or replace function public.is_center_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'center_admin'
  );
$$;

-- ---------------------------------------------------------
-- Visibilitat de l'admin de centre: veu (i gestiona) tots els pacients
-- del seu centre, i veu (només lectura) els perfils del seu centre.
-- La visibilitat del terapeuta sobre "els seus pacients" (therapist_id =
-- auth.uid()) NO canvia — aquesta és una capa addicional per a l'admin,
-- no un reemplaçament.
-- ---------------------------------------------------------

create policy "L'admin del centre gestiona els pacients del seu centre"
  on patients for all
  using (is_center_admin() and center_id = my_center_id())
  with check (is_center_admin() and center_id = my_center_id());

create policy "L'admin del centre veu els perfils del seu centre"
  on profiles for select
  using (is_center_admin() and center_id = my_center_id());

-- ---------------------------------------------------------
-- Vincular tutors: ara també ho pot fer l'admin del centre, no només el
-- terapeuta propietari del pacient (útil si l'admin s'encarrega de l'alta
-- administrativa mentre el terapeuta se centra en la part clínica).
-- ---------------------------------------------------------

create or replace function public.link_guardian_by_email(
  p_patient_id uuid,
  p_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent_id uuid;
  v_authorized boolean;
begin
  select exists (
    select 1 from patients
    where id = p_patient_id
      and (
        therapist_id = auth.uid()
        or (is_center_admin() and center_id = my_center_id())
      )
  ) into v_authorized;

  if not v_authorized then
    raise exception 'No autoritzat';
  end if;

  select u.id into v_parent_id
  from auth.users u
  join public.profiles p on p.id = u.id
  where lower(u.email) = lower(p_email) and p.role = 'parent';

  if v_parent_id is null then
    raise exception 'No existeix cap compte de pare/tutor amb aquest email. Ha de registrar-se primer.';
  end if;

  insert into public.patient_guardians (patient_id, parent_id)
  values (p_patient_id, v_parent_id)
  on conflict do nothing;
end;
$$;
