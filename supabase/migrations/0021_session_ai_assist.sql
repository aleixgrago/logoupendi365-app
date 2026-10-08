alter table clinical_sessions add column exercise_ids uuid[];
alter table clinical_sessions add column participation text check (participation in ('low', 'medium', 'high'));
alter table clinical_sessions add column evolution_rating text check (evolution_rating in ('no_change', 'mild_improvement', 'significant_improvement'));
alter table clinical_sessions add column family_summary text;
alter table clinical_sessions add column clinical_summary text;
alter table clinical_sessions add column family_summary_status text not null default 'pending' check (family_summary_status in ('pending', 'draft', 'approved'));

-- Vista NO security_invoker (s'executa amb els privilegis del seu
-- propietari, que bypassa RLS de clinical_sessions) i projecta només 3
-- columnes — mai exercise_ids, clinical_summary ni notes. El filtre de
-- guardian + status='approved' és el que fa de RLS real aquí: un pare mai
-- pot consultar clinical_sessions directament (cap policy l'hi permet),
-- només aquesta vista.
create view patient_session_summaries as
select
  cs.patient_id,
  cs.session_date,
  cs.family_summary
from clinical_sessions cs
join patient_guardians pg on pg.patient_id = cs.patient_id
where pg.parent_id = auth.uid()
  and cs.family_summary_status = 'approved';

grant select on patient_session_summaries to authenticated;
