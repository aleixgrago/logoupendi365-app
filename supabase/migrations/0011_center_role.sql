-- Postgres exigeix que un nou valor d'ENUM es confirmi (commit) abans de
-- poder-se fer servir en qualsevol altra sentència de la mateixa migració.
-- Per això aquest ALTER TYPE va totalment sol en el seu propi fitxer.

alter type user_role add value 'center_admin';
