# PROJECT_MEMORY.md

Logoupendi365 — SaaS de logopèdia. Next.js 15 (App Router) + Supabase +
Vercel. Monòlit modular, sense microserveis. Beta privada, dades
fictícies, plans gratuïts (Supabase Free + Vercel Hobby).

## Rols
`therapist`, `parent`, `center_admin` (enum `user_role`). Redirecció per
rol centralitzada a `ROLE_HOME` dins `lib/auth/guards.ts`.

## Multi-tenant
Cada `profiles` (therapist/center_admin) té `center_id`. Un terapeuta
sense codi d'invitació obté un centre individual propi en registrar-se
(trigger `handle_new_user`, migració 0013). Pares NO tenen `center_id`
(accedeixen via `patient_guardians`).

## i18n
Dues coses separades a propòsit:
- UI: cookie `locale` (ca/es), sense prefix d'URL (`lib/i18n/`).
- Clínic: `exercises.language` / `goals.language` (ca/es), independent.
Landing pública SÍ porta prefix (`/ca`, `/es`) per SEO — única excepció.

## Client Supabase
`lib/supabase/server.ts` i `client.ts` **sense genèric `<Database>`**
(decisió deliberada: conflictes de tipatge amb versions recents
d'`@supabase/supabase-js` que no valia la pena perseguir — veure
`lib/types/database.types.ts`, que és manual i només informatiu).

## Patrons establerts (seguir-los, no reinventar)
- Server Actions que poden fallar per motiu "normal" (no bug) → retornar
  `{ error }` + `useActionState`, mai `throw` (petaria tota la pàgina amb
  "Application error"). Exemple: `linkGuardian` /
  `components/patients/link-guardian-form.tsx`.
- Qualsevol comprovació RLS que travessi taules → funció `SECURITY
  DEFINER` (veure `SECURITY_RULES.md`), mai subquery directa.
- Exercicis "plantilla" compartits: `exercises.therapist_id = null`,
  visibles a tothom via policy addicional, mai editables des de l'app.
- Biblioteca d'exercicis: 66 exercicis sembrats (migració 0010) amb
  materials + passos (migració 0014/0015) — contingut de referència, no
  protocol clínic validat; recordar-ho a qualsevol UI que els mostri.

## Pendent conegut (no repetir com a "descobriment nou")
- Traducció i18n incompleta a biblioteca d'exercicis i fitxa de pacient.
- Edició de pacients existents: no implementada (només alta+lectura).
- `/center`: no permet reassignar pacients ni veure detall clínic.
- Textos de Privacitat/Termes: placeholder, no legal real.
