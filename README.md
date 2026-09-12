# Logoupendi365 — v1 (beta amb amics logopedes)

## ⚠️ Regla de la fase de beta (llegeix abans d'usar-ho)

Aquesta versió corre sobre **plans gratuïts de Supabase i Vercel**, acordat
expressament per validar el producte abans d'assumir cost d'infraestructura.
Els plans gratuïts **no tenen backups diaris ni PITR, i el projecte de
Supabase es pausa als 7 dies d'inactivitat**.

👉 **Durant aquesta fase, introduïu només pacients de prova (noms i
diagnòstics inventats), mai dades reals d'un pacient real.** En el moment de
pujar a Supabase Pro + Vercel Pro, aquesta restricció desapareix.

## Setup

1. Crea un projecte a [supabase.com](https://supabase.com) (pla Free).
2. A l'SQL Editor del projecte, executa en aquest ordre exacte (cadascuna
   depèn de l'anterior):
   - `supabase/migrations/0001_init.sql` (contingut del `schema.sql` entregat)
   - `supabase/migrations/0002_profile_trigger.sql`
   - `supabase/migrations/0003_storage.sql`
   - `supabase/migrations/0004_link_guardian.sql`
   - `supabase/migrations/0005_languages.sql`
   - `supabase/migrations/0006_future_prep.sql`
   - `supabase/migrations/0007_profile_locale_trigger.sql`
3. Copia `.env.example` a `.env.local` i emplena `NEXT_PUBLIC_SUPABASE_URL` i
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API).
4. Instal·la dependències i arrenca:
   ```bash
   npm install
   npm run dev
   ```
5. Ves a `/register`, crea el primer usuari amb rol "Logopeda".
6. (Opcional) Genera els tipus reals un cop tinguis el projecte:
   ```bash
   npm run gen:types
   ```

## Què inclou aquest esquelet (v1 completa per a beta)

- Autenticació completa (registre + login) amb creació automàtica de perfil
  via trigger de Postgres.
- Guarda de rol a nivell d'aplicació (`lib/auth/guards.ts`) **i** RLS a nivell
  de base de dades — les dues capes, tal com es va acordar a l'arquitectura.
- Flux vertical complet de **Pacients**: llistat amb cerca/filtre, alta,
  fitxa amb els 5 tabs funcionals:
  - **Resum**: dades bàsiques + gestió de tutors vinculats.
  - **Objectius**: llistat amb progrés + alta de nous objectius.
  - **Exercicis**: assignació des de la biblioteca + estat per assignació.
  - **Documents**: pujada a Storage (privat, amb RLS) + descàrrega via URL
    signada de 60 segons a través d'un Route Handler dedicat.
  - **Historial**: timeline auto-generat (alta, visualitzacions, objectius,
    assignacions, documents, exercicis completats pel pare).
- **Biblioteca d'exercicis** del logopeda (CRUD bàsic).
- **Vinculació pare↔pacient** per email, via funció `SECURITY DEFINER` —
  l'única manera d'obtenir un `parent_id` a partir d'un email sense exposar
  `auth.users` al client.
- **Vista completa del pare per infant**: objectius actius + exercicis amb
  botó "Marcar com fet", que crida `mark_assignment_completed` (RPC) en
  comptes d'un UPDATE directe — així un pare mai pot escriure camps que no
  li pertoquen.
- Dashboard del logopeda amb els 3 KPIs acordats, incloent el KPI
  d'abandonament (pacients sense activitat en 14 dies).

## Què falta construir (properes iteracions)

- Substituir els components `components/ui/*` pels equivalents oficials de
  shadcn (`npx shadcn add button input card`) quan tinguis el repo en local
  amb accés a xarxa — ara mateix són versions lleugeres escrites a mà perquè
  aquest entorn no podia instal·lar el CLI.
- Notificacions per email (exercici assignat / completat) — v1.1.
- Edició de pacients existents (ara mateix només alta i lectura).
- Paginació al llistat de pacients/historial si el volum de dades creix.
- Vídeos dels pares — deliberadament fora d'abast (v1.1, amb consentiment i
  política de retenció específics, ja acordat).

## Idiomes (nou en aquest increment)

Hi ha **dos conceptes d'idioma independents**, a propòsit:

1. **Idioma de la interfície** (`profiles.locale`, cookie `locale`): català/castellà
   ara, ampliable afegint un fitxer de diccionari nou (veure
   `lib/i18n/config.ts` per instruccions exactes). S'implementa amb un
   diccionari JSON propi + una cookie de preferència — **sense cap llibreria
   externa** (no next-intl ni similar): amb 2 idiomes i sense plurals
   complexos, afegir-hi una dependència no aportava prou valor. Si en el
   futur hi ha molts idiomes amb plurals/gèneres, val la pena revisar-ho.
   No s'ha fet routing amb prefix d'idioma (`/ca/...`, `/es/...`) perquè
   aquesta és una app autenticada, no un lloc públic amb necessitats de SEO
   multi-idioma.
2. **Idioma de treball clínic** (`exercises.language`, `goals.language`,
   `patients.preferred_language`): en quin idioma es treballa un exercici o
   objectiu amb el nen. És un concepte clínic, no d'interfície — la
   fonètica/fonologia treballada és diferent en català i castellà. Els
   logopedes poden filtrar per idioma tant a la biblioteca d'exercicis com
   a la fitxa de pacient, i els pares poden filtrar "quines sessions fer"
   per idioma des de la seva vista de l'infant.

**Estat de la traducció de la interfície**: la infraestructura (diccionaris,
selector, cookie, sincronització amb el perfil) està completa i funcional.
S'han traduït completament: login, registre, navegació del logopeda,
dashboard i llistat de pacients. **Falta traduir** (segueixen el mateix
patró — importar `getDictionary`/`getLocale` i substituir els textos fixos):
fitxa de pacient (tabs), biblioteca d'exercicis, i vista del pare. No calia
fer-ho tot per validar que la infraestructura funciona de cap a cap.

## Preparació de la BBDD per a properes versions

Ja hi ha estructura (amb RLS activada, com sempre) per a funcionalitats que
encara no tenen cap UI:

- **`reports`**: flux d'informes IA (`draft` → `reviewed` → `final`), pensat
  perquè un informe generat per IA mai es marqui `final` sense revisió
  humana explícita.
- **`videos`**: mateix patró que `documents`, a punt per a v1.1.
- **`clinical_sessions`**: notes clíniques redactades pel logopeda per
  sessió (diferent de `history_events`, que és un log automàtic d'accions
  del sistema, no contingut clínic redactat).
- **`exercises.source` / `goals.source`** (`manual` / `ai_suggested`): per
  distingir en el futur què ha creat el logopeda i què ha suggerit la IA.

Cap d'aquestes taules té encara cap ruta ni component que hi escrigui —
zero risc afegit per a la v1, estructura a punt per quan calgui.

## Landing page pública i SEO/SEM (nou en aquest increment)

**Estructura d'URLs:**
- `/` — no és cap pantalla; només decideix cap a on enviar la persona (a
  `/app` si ja té sessió, o a `/ca`/`/es` segons preferència/navegador si no).
- `/ca` i `/es` — la landing pública real, la que Google indexa. Cada
  idioma és una URL pròpia amb `hreflang` entre elles i metadades
  completes (title, description, Open Graph, Twitter card, JSON-LD
  `SoftwareApplication`).
- `/ca/privacy`, `/ca/terms` (i equivalents `/es`) — pàgines legals
  **placeholder**, marcades explícitament com a pendents de revisió per un
  professional legal. No les facis servir amb usuaris reals tal qual.
- `/app` — nou punt d'entrada de l'aplicació autenticada (abans vivia a `/`).
- `/robots.txt` i `/sitemap.xml` — generats automàticament
  (`app/robots.ts`, `app/sitemap.ts`); l'app autenticada (`/app`,
  `/dashboard`, `/patients`...) queda explícitament exclosa de l'indexat.

**Per què la landing SÍ porta prefix d'idioma i l'app NO**: és la mateixa
lògica que ja vam aplicar als idiomes de treball clínic, aplicada ara a
SEO — la landing necessita URLs diferents per idioma perquè Google les
indexi per separat; l'app autenticada no la indexa ningú, així que la
cookie que ja teníem és suficient i més simple.

**El component `DashboardPreview` és un mockup fet amb HTML/CSS**, no una
captura real de l'app — encara no hi ha cap desplegament públic per
fer-ne una, i fabricar-ne una de falsa hauria estat enganyós. Un cop
tinguis l'app desplegada, substitueix-lo per una captura autèntica.

**Abans d'invertir en SEM (Google Ads) hi ha dues coses pendents**:
1. **Imatge Open Graph real** (1200×630px) — hi ha un `TODO` marcat a
   `app/[locale]/page.tsx` on afegir-la; no se n'ha fabricat cap de falsa.
2. **Banner de consentiment de cookies (RGPD/ePrivacy)**: si en el futur
   afegeixes Google Analytics o el píxel de conversió de Google Ads,
   **legalment necessites un mecanisme de consentiment abans** de carregar
   cap d'aquests scripts (posen cookies de tracking). No hi ha cap script
   d'analítica afegit encara — afegeix-lo només després de resoldre el
   consentiment, mai abans.

Un cop tinguis domini propi, actualitza `NEXT_PUBLIC_SITE_URL` a l'entorn
de Vercel — és el valor que fa servir tota la generació de metadades,
sitemap i canonical URLs.

## Abans de sortir de la fase de beta (pujar a producció real)

- Supabase Pro + Vercel Pro (~45$/mes, ja discutit).
- Restringir el registre lliure de rol "therapist" (ara mateix qualsevol
  es pot registrar com a logopeda).
- Consentiment RGPD complet per a dades reals de menors (l'actual és bàsic).
- Revisar bucket de Storage abans d'activar pujada de documents/vídeos reals.
