-- Paràmetres de feedback amb default null: compatible amb la crida
-- actual (nomès assignment_id) sense tocar encara cap Server Action.
create or replace function public.mark_assignment_completed(
  assignment_id uuid,
  p_ease_rating smallint default null,
  p_motivation_rating smallint default null,
  p_needed_help boolean default null,
  p_outcome text default null,
  p_feedback_comment text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update exercise_assignments ea
  set status = 'completed',
      completed_at = now(),
      ease_rating = p_ease_rating,
      motivation_rating = p_motivation_rating,
      needed_help = p_needed_help,
      outcome = p_outcome,
      feedback_comment = p_feedback_comment
  where ea.id = assignment_id
    and exists (
      select 1 from patient_guardians pg
      where pg.patient_id = ea.patient_id and pg.parent_id = auth.uid()
    );
end;
$$;

-- Bessona de mark_assignment_completed. Neteja també el feedback: queda
-- associat a "l'última compleció", no té sentit mostrar-lo amb
-- l'exercici tornat a pendent.
create or replace function public.undo_assignment_completion(assignment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update exercise_assignments ea
  set status = 'pending',
      completed_at = null,
      ease_rating = null,
      motivation_rating = null,
      needed_help = null,
      outcome = null,
      feedback_comment = null
  where ea.id = assignment_id
    and exists (
      select 1 from patient_guardians pg
      where pg.patient_id = ea.patient_id and pg.parent_id = auth.uid()
    );
end;
$$;
