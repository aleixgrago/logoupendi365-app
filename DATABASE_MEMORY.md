# DATABASE_MEMORY.md

Migracions a `supabase/migrations/`, numerades 0001-0015, **mai editar
una ja existent** — sempre una de nova. Aplicar-les manualment (copiar/
enganxar) a l'SQL Editor de Supabase; no hi ha CLI ni CI connectats.

## Taules principals
- `profiles` (role, center_id, locale) — 1:1 amb `auth.users`.
- `centers` (name, join_code) — multi-tenant.
- `patients` (therapist_id, center_id, preferred_language, diagnosis...).
- `patient_guardians` (patient_id, parent_id) — relació pares↔pacients.
- `goals`, `exercises` (therapist_id nullable = plantilla compartida),
  `exercise_assignments`, `documents`, `history_events`, `reports`
  (preparada per IA, no usada encara), `videos`/`clinical_sessions`
  (preparades per v1.1/v2, `clinical_sessions` sense UI encara).
- `disorder_categories` (taxonomia de referència, 11 categories, lectura
  oberta a tothom).

## Camps afegits a `exercises` (migracions successives)
`language`, `source`, `disorder_category_id`, `min_age`, `max_age`,
`difficulty`, `materials`, `steps` (jsonb `[{instruction, tip}]`).

## Funcions RPC (totes `SECURITY DEFINER`)
- `mark_assignment_completed(assignment_id)` — pare marca exercici fet.
- `link_guardian_by_email(p_patient_id, p_email)` — vincula tutor; permet
  terapeuta propietari O center_admin del mateix centre.
- `is_patient_therapist(p_patient_id)`, `my_center_id()`,
  `is_center_admin()` — helpers per trencar recursió RLS, reutilitzar-los
  sempre que calgui una comprovació creuada entre taules.

## Bug ja resolt (no el reintrodueixis)
Recursió infinita entre policies de `patients` i `patient_guardians`
(migració 0008) — la lliçó apresa: qualsevol policy que faci una subquery
a una altra taula amb RLS pròpia ha de passar per una funció `SECURITY
DEFINER`, no una subquery directa.

## Pendent (del document de Fase 1, si s'aprova la Fase 2)
- `clinical_sessions`: afegir `goal_ids uuid[]`, `activities`,
  `evolution`, `next_steps`.
- `patients`: afegir `referral_reason`, `relevant_background`.
- `exercise_assignments`: afegir `scheduled_days text[]`,
  `ease_rating`, `motivation_rating`, `needed_help`, `outcome`,
  `feedback_comment`.
- Nova funció `undo_assignment_completion`, bessona de
  `mark_assignment_completed`.
