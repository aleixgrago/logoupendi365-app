# SECURITY_RULES.md

## RLS — regla d'or
Qualsevol policy que necessiti consultar una ALTRA taula amb RLS pròpia
(per comprovar propietat/pertinença) ha de fer-ho a través d'una funció
`SECURITY DEFINER` (`language sql`, `set search_path = public`,
`stable`), MAI amb una subquery directa dins la policy. Motiu: subquery
directa pot crear recursió infinita si l'altra taula té, al seu torn, una
policy que torna a consultar la primera (ja ens va passar, migració
0008). Funcions ja disponibles per reutilitzar:
`is_patient_therapist()`, `my_center_id()`, `is_center_admin()`.

## Dades sensibles / RGPD
- Beta actual: només dades fictícies (acordat explícitament amb
  l'usuari). `diagnosis`, `relevant_background` (si s'implementa) i
  qualsevol camp clínic són dades de categoria especial (Art. 9 RGPD) +
  dades de menors (Art. 8) — RLS obligatòria des del primer commit, mai
  com a refactor posterior.
- `history_events` fa de log d'auditoria (qui ha vist què i quan) —
  mantenir-lo en inserir qualsevol acció clínica nova.
- Informes IA (`reports`, futur): mai marcar `status = 'final'` sense
  revisió humana explícita — flux obligatori `draft → reviewed → final`.
- Si s'envien dades a una API d'IA externa (OpenAI, futur v2): mai
  identificable (nom/cognoms) al prompt, només `patient_id` intern.

## Claus i secrets
- `NEXT_PUBLIC_*` → sempre "Config" a Vercel (són per al navegador,
  segurs d'exposar; la seguretat real la fa RLS, no amagar la clau).
- `CRON_SECRET` → sempre "Secret" a Vercel (mai `NEXT_PUBLIC_`).
- Mai fer servir la `service_role` key de Supabase des del client ni de
  cap Route Handler sense justificació explícita i revisió — cap funcionalitat
  actual la necessita.

## Patró d'error en Server Actions
Un error "normal" (validació, recurs no trobat) mai ha de fer `throw`
— `throw` en una Server Action crida directament des d'un `<form
action={...}>` fa petar tota la pàgina amb "Application error". Fer
servir `useActionState` i retornar `{ error: string | null }`.

## Multi-tenant
`center_id` és la frontera d'aïllament. Qualsevol taula nova amb dades
per pacient/centre ha de portar (o heretar via `patient_id`) un camí clar
cap a `center_id`, i les policies d'admin de centre (`is_center_admin()
and center_id = my_center_id()`) s'han d'afegir explícitament — no vénen
soles només per existir la taula `patients`.
