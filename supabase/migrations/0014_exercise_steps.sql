-- Cada pas és un objecte { instruction, tip } dins d'un array JSON:
--   instruction: què ha de fer el pare/nen en aquest pas.
--   tip: exemple concret i/o com saber si s'està fent correctament.
-- S'ha triat JSONB (no una taula a part) perquè és contingut de només
-- lectura per a l'app (el pare no interactua amb els passos un a un,
-- només els llegeix), sense necessitat de consultar-los ni ordenar-los
-- per separat — un array és la representació més simple possible.

alter table exercises add column materials text;
alter table exercises add column steps jsonb;
