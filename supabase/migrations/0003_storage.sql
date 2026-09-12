-- Bucket privat per a documents de pacients. Els vídeos es queden per v1.1
-- (decisió ja presa), aquest bucket és només per a PDF/imatges/DOCX.
--
-- Convenció de path OBLIGATÒRIA: '<patient_id>/<uuid>-<nom_fitxer>'
-- Les policies de sota depenen d'aquesta convenció per saber a quin pacient
-- pertany cada objecte (storage.objects no té columna patient_id pròpia).

insert into storage.buckets (id, name, public)
values ('patient-documents', 'patient-documents', false)
on conflict (id) do nothing;

-- El primer segment del path (foldername[1]) ha de ser un patient_id vàlid
-- del qual l'usuari autenticat sigui el therapist_id, o del qual sigui
-- guardian (per permetre, en un futur, que els pares vegin documents propis).

create policy "Logopeda gestiona documents dels seus pacients (storage)"
  on storage.objects for all
  using (
    bucket_id = 'patient-documents'
    and exists (
      select 1 from public.patients p
      where p.id::text = (storage.foldername(name))[1]
        and p.therapist_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'patient-documents'
    and exists (
      select 1 from public.patients p
      where p.id::text = (storage.foldername(name))[1]
        and p.therapist_id = auth.uid()
    )
  );

create policy "Tutors veuen documents dels seus fills (storage)"
  on storage.objects for select
  using (
    bucket_id = 'patient-documents'
    and exists (
      select 1 from public.patient_guardians pg
      where pg.patient_id::text = (storage.foldername(name))[1]
        and pg.parent_id = auth.uid()
    )
  );
