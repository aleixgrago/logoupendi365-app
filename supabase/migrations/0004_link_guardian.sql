-- `patient_guardians` no exposa cap manera d'obtenir el `parent_id` a partir
-- d'un email des del client (auth.users no és accessible amb la clau anon).
-- Aquesta funció resol el vincle de forma segura: només el terapeuta
-- propietari del pacient pot cridar-la, i només vincula un usuari que ja
-- existeixi amb rol 'parent'.

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
begin
  -- Només el terapeuta propietari d'aquest pacient pot vincular tutors.
  if not exists (
    select 1 from public.patients
    where id = p_patient_id and therapist_id = auth.uid()
  ) then
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
