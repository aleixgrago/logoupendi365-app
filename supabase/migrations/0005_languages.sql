-- =========================================================
-- Idiomes — dues llistes independents a propòsit:
--   1. app_locales: idiomes en què es pot MOSTRAR la interfície.
--   2. clinical_languages: idiomes en què es pot TREBALLAR clínicament
--      (fonètica/fonologia d'un exercici). No tenen per què créixer igual:
--      es podria oferir contingut clínic en un idioma abans de traduir-hi
--      tota la interfície, o a l'inrevés.
--
-- S'implementen com a CHECK constraints (no taules de referència a part)
-- perquè només calen 2 valors ara i ampliar-los és un ALTER simple. Si mai
-- arribéssim a 8-10 idiomes amb metadades pròpies (bandera, nom natiu, RTL),
-- llavors sí que valdria la pena migrar-ho a una taula `languages`.
-- =========================================================

alter table profiles
  add column locale text not null default 'ca'
  check (locale in ('ca', 'es'));

alter table exercises
  add column language text not null default 'ca'
  check (language in ('ca', 'es'));

alter table goals
  add column language text not null default 'ca'
  check (language in ('ca', 'es'));

-- Idioma "de treball" preferit d'una família — merament informatiu/per
-- defecte als formularis (p. ex. preseleccionar l'idioma en crear un nou
-- objectiu). No restringeix res per si sol.
alter table patients
  add column preferred_language text
  check (preferred_language in ('ca', 'es'));

-- =========================================================
-- Preparació per contingut assistit per IA (v2): distingir origen manual
-- vs. suggerit per IA, sense que això afecti encara cap flux de v1.
-- =========================================================
alter table exercises
  add column source text not null default 'manual'
  check (source in ('manual', 'ai_suggested'));

alter table goals
  add column source text not null default 'manual'
  check (source in ('manual', 'ai_suggested'));

-- NOTA per quan s'afegeixi un tercer idioma (p. ex. anglès):
--   alter table profiles drop constraint profiles_locale_check;
--   alter table profiles add constraint profiles_locale_check
--     check (locale in ('ca','es','en'));
-- ...i el mateix per exercises_language_check / goals_language_check /
-- patients_preferred_language_check. Repetir per cada taula.
