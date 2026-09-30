-- BUG: "infinite recursion detected in policy for relation patients"
--
-- La policy de `patients` que deixa veure els pacients als tutors consulta
-- `patient_guardians`. La policy de `patient_guardians` que dona accés al
-- logopeda consultava directament `patients`. Quan Postgres avalua si una
-- fila de `patients` és visible, dispara la policy de `patient_guardians`,
-- que al seu torn torna a disparar les policies de `patients` — cicle
-- infinit. Només calia arreglar un dels dos costats per trencar el cicle;
-- s'arregla el de `patient_guardians`.
--
-- SOLUCIÓ: la comprovació "aquest pacient és meu?" es fa ara amb una funció
-- SECURITY DEFINER, que s'executa amb els privilegis del propietari de la
-- funció (normalment un rol amb BYPASSRLS a Supabase) i per tant NO torna
-- a disparar les policies de `patients` — trenca el cicle.
--
-- NOTA: aquesta migració ja es va aplicar directament a Supabase abans
-- que existís com a fitxer al repositori — es desa aquí ara només per
-- mantenir l'historial complet. Si ja la tens aplicada, tornar-la a
-- executar no fa cap mal (CREATE OR REPLACE FUNCTION + DROP POLICY IF
-- EXISTS són idempotents).

create or replace function public.is_patient_therapist(p_patient_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from patients
    where id = p_patient_id and therapist_id = auth.uid()
  );
$$;

drop policy if exists "El logopeda gestiona els vincles de tutors" on patient_guardians;

create policy "El logopeda gestiona els vincles de tutors"
  on patient_guardians for all
  using (is_patient_therapist(patient_id))
  with check (is_patient_therapist(patient_id));
