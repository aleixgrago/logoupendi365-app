-- =========================================================
-- IMPORTANT: aquesta és una biblioteca INICIAL DE REFERÈNCIA, escrita a
-- partir de tècniques àmpliament conegudes en logopèdia, NO un protocol
-- clínic validat per cap professional col·legiat concret. Cada logopeda
-- que faci servir la plataforma ha de revisar, adaptar o descartar
-- aquests exercicis segons el seu propi criteri clínic abans
-- d'assignar-los a un pacient real. Serveixen com a punt de partida per
-- no començar la biblioteca de zero, no com a substitut del criteri
-- professional.
-- =========================================================

insert into disorder_categories
  (slug, group_key, name_ca, name_es, description_ca, description_es, typical_age_min, typical_age_max)
values
  ('tdl', 'llenguatge_oral',
   'Trastorn del Desenvolupament del Llenguatge (TDL)', 'Trastorno del Desarrollo del Lenguaje (TDL)',
   'Dificultats persistents en l''adquisició i ús del llenguatge (vocabulari, gramàtica, narrativa) sense causa sensorial, neurològica o intel·lectual que ho expliqui.',
   'Dificultades persistentes en la adquisición y uso del lenguaje (vocabulario, gramática, narrativa) sin causa sensorial, neurológica o intelectual que lo explique.',
   2, 12),
  ('dislalia', 'parla',
   'Dislàlia', 'Dislalia',
   'Dificultat per articular correctament un o més fonemes concrets, sense alteració orgànica de base.',
   'Dificultad para articular correctamente uno o más fonemas concretos, sin alteración orgánica de base.',
   3, 8),
  ('trastorn-fonologic', 'parla',
   'Trastorn fonològic', 'Trastorno fonológico',
   'Ús de processos de simplificació fonològica més enllà de l''edat esperada, que afecten la intel·ligibilitat de la parla.',
   'Uso de procesos de simplificación fonológica más allá de la edad esperada, que afectan la inteligibilidad del habla.',
   3, 7),
  ('disfemia', 'fluencia',
   'Disfèmia (quequeig)', 'Disfemia (tartamudez)',
   'Alteració de la fluïdesa de la parla amb repeticions, bloquejos o allargaments, sovint amb tensió associada.',
   'Alteración de la fluidez del habla con repeticiones, bloqueos o alargamientos, a menudo con tensión asociada.',
   3, 12),
  ('disfonia', 'veu',
   'Disfonia infantil', 'Disfonía infantil',
   'Alteració de la qualitat, intensitat o to de la veu, freqüentment per mal ús vocal (crits, forçament).',
   'Alteración de la calidad, intensidad o tono de la voz, frecuentemente por mal uso vocal (gritos, forzamiento).',
   4, 16),
  ('motricitat-orofacial', 'motricitat_orofacial',
   'Trastorn de motricitat orofacial', 'Trastorno de motricidad orofacial',
   'Dificultats de força, to o coordinació dels òrgans orofacials que poden afectar la parla, la deglució o la respiració.',
   'Dificultades de fuerza, tono o coordinación de los órganos orofaciales que pueden afectar el habla, la deglución o la respiración.',
   3, 12),
  ('dislexia', 'lectoescriptura',
   'Dislèxia', 'Dislexia',
   'Dificultat específica i persistent en la precisió i/o fluïdesa de la lectura, no explicada per dèficit intel·lectual o sensorial.',
   'Dificultad específica y persistente en la precisión y/o fluidez de la lectura, no explicada por déficit intelectual o sensorial.',
   6, 16),
  ('disgrafia', 'lectoescriptura',
   'Disgrafia', 'Disgrafía',
   'Dificultat en l''execució motriu de l''escriptura: traç, pressió, velocitat o llegibilitat.',
   'Dificultad en la ejecución motriz de la escritura: trazo, presión, velocidad o legibilidad.',
   6, 14),
  ('trastorn-pragmatic', 'comunicacio_social',
   'Trastorn pragmàtic del llenguatge / comunicació social', 'Trastorno pragmático del lenguaje / comunicación social',
   'Dificultats en l''ús social del llenguatge: torns de conversa, inferència, llenguatge no literal, adaptació al context.',
   'Dificultades en el uso social del lenguaje: turnos de conversación, inferencia, lenguaje no literal, adaptación al contexto.',
   4, 16),
  ('tdah-comunicacio', 'trastorns_associats',
   'TDAH — component comunicatiu', 'TDAH — componente comunicativo',
   'Dificultats comunicatives associades al TDAH: manteniment de l''atenció conversacional, organització narrativa, impulsivitat verbal.',
   'Dificultades comunicativas asociadas al TDAH: mantenimiento de la atención conversacional, organización narrativa, impulsividad verbal.',
   5, 16),
  ('estimulacio-0-3', 'estimulacio_primerenca',
   'Estimulació del llenguatge 0-3 anys', 'Estimulación del lenguaje 0-3 años',
   'Activitats per afavorir l''aparició i desenvolupament primerenc del llenguatge en infants de 0 a 3 anys.',
   'Actividades para favorecer la aparición y desarrollo temprano del lenguaje en niños de 0 a 3 años.',
   0, 3);

-- ---------------------------------------------------------
-- TDL
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 2, 12, 'manual', dc.id
from (values
  ('Ampliació de vocabulari amb targetes temàtiques', 'Classificar i anomenar objectes agrupats per temes (roba, animals, menjar).', 15, '2-3 cops/setmana', 'easy'),
  ('Seguir instruccions de dos passos', 'Donar instruccions amb dos objectes i dues accions ("agafa la pilota i posa-la a la caixa").', 10, '2-3 cops/setmana', 'easy'),
  ('Joc de preguntes qui/què/on', 'Respondre i formular preguntes bàsiques a partir d''imatges o situacions.', 15, '2 cops/setmana', 'medium'),
  ('Construcció de frases amb connectors', 'Unir dues frases simples amb "i", "però" o "perquè".', 15, '2 cops/setmana', 'medium'),
  ('Explicar una seqüència d''imatges', 'Ordenar 3-4 vinyetes i explicar-ne la història amb ordre lògic.', 20, '1-2 cops/setmana', 'hard'),
  ('Ampliació de frases model', 'Expandir una emissió de 2 paraules a 4-5 paraules amb modelatge del terapeuta.', 15, '2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'tdl') as dc;

-- ---------------------------------------------------------
-- Dislàlia
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 3, 8, 'manual', dc.id
from (values
  ('Praxias linguals davant del mirall', 'Moviments de llengua (amunt, avall, lateral) amb feedback visual al mirall.', 10, '3 cops/setmana', 'easy'),
  ('Repetició de síl·labes amb el fonema diana', 'Repetir síl·labes directes i inverses amb el so treballat (ra-re-ri-ro-ru).', 10, '3 cops/setmana', 'easy'),
  ('Parells mínims', 'Discriminar auditivament parelles de paraules que només difereixen en el so diana (pato/pado).', 15, '2-3 cops/setmana', 'medium'),
  ('Lectura de paraules amb el so diana subratllat', 'Llegir en veu alta paraules amb el fonema treballat destacat visualment.', 10, '2 cops/setmana', 'medium'),
  ('Joc de cartes: troba la paraula', 'Buscar entre cartes les paraules que contenen el so diana.', 15, '2 cops/setmana', 'hard'),
  ('Generalització en frases espontànies', 'Provocar l''ús del so diana dins de frases espontànies durant el joc lliure.', 15, '2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'dislalia') as dc;

-- ---------------------------------------------------------
-- Trastorn fonològic
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 3, 7, 'manual', dc.id
from (values
  ('Consciència síl·làbica amb picada de mans', 'Comptar síl·labes de paraules picant de mans a cada cop.', 10, '3 cops/setmana', 'easy'),
  ('Cançons amb rimes senzilles', 'Cantar cançons curtes centrades en paraules que rimen.', 15, '2-3 cops/setmana', 'easy'),
  ('Discriminació auditiva de paraules semblants', 'Distingir auditivament parelles de paraules molt semblants fonèticament.', 15, '2 cops/setmana', 'medium'),
  ('Joc de memòria amb paraules diana', 'Joc de memòria (parelles) amb targetes de paraules amb el procés fonològic treballat.', 15, '2 cops/setmana', 'medium'),
  ('Contrast de processos fonològics', 'Comparar parelles de paraules que contrasten el procés de simplificació treballat (pilota/bola).', 15, '2 cops/setmana', 'hard'),
  ('Repetició de pseudoparaules', 'Repetir paraules inventades que contenen l''estructura fonològica treballada.', 10, '2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'trastorn-fonologic') as dc;

-- ---------------------------------------------------------
-- Disfèmia (quequeig)
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 3, 12, 'manual', dc.id
from (values
  ('Respiració diafragmàtica abans de parlar', 'Practicar respiració abdominal relaxada com a preparació per parlar.', 10, '3-4 cops/setmana', 'easy'),
  ('Badalls sonors per relaxar la laringe', 'Fer badalls sonors seguits de frases curtes per reduir la tensió laríngia.', 10, '3 cops/setmana', 'easy'),
  ('Parla ralentida amb inici suau (easy onset)', 'Practicar l''inici suau de paraules que comencen per vocal.', 15, '3 cops/setmana', 'medium'),
  ('Lectura a ritme controlat amb metrònom', 'Llegir en veu alta seguint un ritme pautat per reduir la velocitat de parla.', 15, '2-3 cops/setmana', 'medium'),
  ('Joc de rols amb baixa pressió comunicativa', 'Practicar diàlegs senzills en un context de joc, sense pressa ni interrupcions.', 20, '2 cops/setmana', 'hard'),
  ('Autoregistre de moments de fluïdesa', 'Identificar i anotar (amb ajuda) moments de parla fluida durant el dia, adaptat a l''edat.', 10, '2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'disfemia') as dc;

-- ---------------------------------------------------------
-- Disfonia infantil
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 4, 16, 'manual', dc.id
from (values
  ('Higiene vocal: identificar hàbits de risc', 'Educar sobre hàbits que perjudiquen la veu (crits, aclarir la gola) i alternatives.', 10, '1 cop/setmana', 'easy'),
  ('Hidratació i pauses vocals programades', 'Establir rutines d''hidratació i descans vocal durant el dia.', 5, 'diari', 'easy'),
  ('Bombolles amb palleta (straw phonation)', 'Fonar dins d''un got d''aigua amb palleta per afavorir una veu més relaxada.', 10, '3 cops/setmana', 'medium'),
  ('Control d''intensitat amb joc de volums', 'Practicar parlar fluix/normal/fort de manera controlada amb un joc de senyals visuals.', 15, '2-3 cops/setmana', 'medium'),
  ('Badalls sonors combinats amb vocalitzacions', 'Badalls sonors seguits de vocalitzacions suaus per reduir tensió laríngia.', 10, '2-3 cops/setmana', 'hard'),
  ('Vocalitzacions en glissando suau', 'Fer glissandos vocals ascendents/descendents amb veu relaxada.', 10, '2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'disfonia') as dc;

-- ---------------------------------------------------------
-- Motricitat orofacial
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 3, 12, 'manual', dc.id
from (values
  ('Praxias labials', 'Exercicis de petons, somriure ampli i protrusió labial davant del mirall.', 10, '3 cops/setmana', 'easy'),
  ('Bufar bombolles de sabó', 'Treballar el control del bufit i la coordinació labial bufant bombolles.', 10, '3 cops/setmana', 'easy'),
  ('Moviments linguals amunt/avall/lateral', 'Praxias linguals dirigides per millorar la mobilitat de la llengua.', 10, '3 cops/setmana', 'medium'),
  ('Xuclar líquids espessos amb palleta', 'Exercici de succió amb líquids espessos (batut) per enfortir la musculatura oral.', 10, '2-3 cops/setmana', 'medium'),
  ('Massatge orofacial previ a la sessió', 'Massatge suau a galtes i llavis com a escalfament abans dels exercicis actius.', 5, 'cada sessió', 'hard'),
  ('Exercicis de resistència amb depressor lingual', 'Exercicis de resistència lingual amb depressor, sempre sota supervisió professional.', 10, '2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'motricitat-orofacial') as dc;

-- ---------------------------------------------------------
-- Dislèxia
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 6, 16, 'manual', dc.id
from (values
  ('Joc de rimes i al·literacions', 'Identificar i generar paraules que rimen o comencen pel mateix so.', 15, '2-3 cops/setmana', 'easy'),
  ('Reconeixement de síl·labes amb targetes', 'Combinar targetes de síl·labes per formar paraules conegudes.', 15, '2-3 cops/setmana', 'easy'),
  ('Segmentació fonèmica de paraules', 'Descompondre paraules en els seus fonemes individuals oralment.', 15, '2 cops/setmana', 'medium'),
  ('Lectura acompanyada en parella', 'Llegir un text conjuntament amb un adult que dona suport i corregeix.', 20, '2-3 cops/setmana', 'medium'),
  ('Lectura repetida de textos curts cronometrada', 'Rellegir el mateix text breu diverses vegades per guanyar fluïdesa, cronometrant el temps.', 15, '2 cops/setmana', 'hard'),
  ('Dictat de pseudoparaules', 'Escriure paraules inventades a partir del so, per treballar la correspondència so-grafia.', 15, '1-2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'dislexia') as dc;

-- ---------------------------------------------------------
-- Disgrafia
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 6, 14, 'manual', dc.id
from (values
  ('Relaxació de la mà abans d''escriure', 'Exercicis breus d''estirament i relaxació de la mà i el canell.', 5, 'cada sessió', 'easy'),
  ('Traç de lletres en sorra o plastilina', 'Repassar la forma de les lletres amb el dit sobre una safata de sorra o plastilina.', 15, '2-3 cops/setmana', 'easy'),
  ('Jocs de laberints i traços continus', 'Resseguir laberints i línies contínues per millorar el control del traç.', 15, '2-3 cops/setmana', 'medium'),
  ('Exercicis de pinça digital', 'Activitats amb pinces de roba o clips per enfortir la pinça digital.', 10, '2-3 cops/setmana', 'medium'),
  ('Còpia guiada amb pauta ampliada', 'Copiar frases curtes en un full amb pauta més ampla del que és habitual.', 15, '2 cops/setmana', 'hard'),
  ('Dictat lent amb autoavaluació', 'Dictat a ritme lent seguit d''una revisió conjunta del propi text.', 15, '1-2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'disgrafia') as dc;

-- ---------------------------------------------------------
-- Trastorn pragmàtic / comunicació social
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 4, 16, 'manual', dc.id
from (values
  ('Joc de torns amb targetes de conversa', 'Practicar iniciar, mantenir i tancar un torn de conversa amb suport de targetes.', 15, '2 cops/setmana', 'easy'),
  ('Pràctica d''atenció conjunta amb joc compartit', 'Activitats de joc compartit centrades a mantenir l''atenció conjunta amb l''adult.', 15, '2-3 cops/setmana', 'easy'),
  ('Interpretació d''expressions facials', 'Identificar emocions bàsiques a partir de fotografies o dibuixos de cares.', 15, '2 cops/setmana', 'medium'),
  ('Rol-play de situacions socials', 'Simular situacions quotidianes (demanar, saludar, disculpar-se) amb el terapeuta.', 20, '2 cops/setmana', 'medium'),
  ('Joc de "què penses que passarà?"', 'Predir el desenllaç d''una vinyeta o situació social a partir del context.', 15, '1-2 cops/setmana', 'hard'),
  ('Històries socials personalitzades', 'Treballar una situació social concreta del dia a dia de l''infant amb una historieta feta a mida.', 20, '1-2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'trastorn-pragmatic') as dc;

-- ---------------------------------------------------------
-- TDAH — component comunicatiu
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 5, 16, 'manual', dc.id
from (values
  ('Escolta activa amb senyal visual de torn', 'Utilitzar una targeta o objecte visual que indica de qui és el torn de parla.', 10, '2-3 cops/setmana', 'easy'),
  ('Joc de memòria seqüencial auditiva', 'Repetir seqüències d''instruccions o paraules cada cop més llargues.', 10, '2 cops/setmana', 'easy'),
  ('Pauses estructurades durant la conversa', 'Practicar aturar-se abans de respondre, comptant mentalment fins a tres.', 10, '2-3 cops/setmana', 'medium'),
  ('Seguiment d''instruccions creixents en complexitat', 'Donar instruccions d''1, 2 i 3 passos progressivament.', 15, '2 cops/setmana', 'medium'),
  ('Autoinstruccions verbals abans de respondre', 'Ensinistrar l''infant a verbalitzar mentalment un pas previ abans de contestar.', 15, '2 cops/setmana', 'hard'),
  ('Narració amb esquema visual (inici-nus-desenllaç)', 'Explicar una història seguint un suport visual amb les tres parts clàssiques.', 20, '1-2 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'tdah-comunicacio') as dc;

-- ---------------------------------------------------------
-- Estimulació del llenguatge 0-3 anys
-- ---------------------------------------------------------
insert into exercises (title, description, estimated_minutes, recommended_frequency, language, difficulty, min_age, max_age, source, disorder_category_id)
select v.title, v.description, v.minutes, v.frequency, 'ca', v.difficulty, 0, 3, 'manual', dc.id
from (values
  ('Joc d''imitació de sons i gestos', 'Imitar sons d''animals o gestos senzills per fomentar la imitació verbal.', 10, 'diari', 'easy'),
  ('Cançons amb gestos (cançons de falda)', 'Cantar cançons infantils tradicionals acompanyades de gestos repetitius.', 10, 'diari', 'easy'),
  ('Joc d''assenyalar i anomenar objectes quotidians', 'Assenyalar objectes de l''entorn immediat i dir-ne el nom en veu alta.', 10, 'diari', 'medium'),
  ('Rutines amb llenguatge repetitiu', 'Acompanyar rutines diàries (bany, àpats) amb frases sempre iguals per afavorir la predicció.', 10, 'diari', 'medium'),
  ('Lectura de contes amb onomatopeies', 'Explicar contes curts exagerant les onomatopeies i esperant la resposta de l''infant.', 15, '3-4 cops/setmana', 'hard'),
  ('Estimulació amb titelles', 'Utilitzar un titella per fomentar la imitació verbal i la iniciativa comunicativa.', 15, '2-3 cops/setmana', 'hard')
) as v(title, description, minutes, frequency, difficulty)
cross join (select id from disorder_categories where slug = 'estimulacio-0-3') as dc;
