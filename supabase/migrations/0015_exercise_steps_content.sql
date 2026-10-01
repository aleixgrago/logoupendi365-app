-- =========================================================
-- Contingut de materials i passos guiats per als 66 exercicis de la
-- biblioteca de referència sembrada a 0010_seed_exercises.sql.
--
-- IMPORTANT (es repeteix a propòsit): aquestes instruccions estan
-- escrites perquè un pare/tutor sense formació les pugui seguir SOL amb
-- el seu fill/a, però segueixen sent una plantilla de referència — revisa-les
-- i adapta-les al teu criteri clínic abans d'assignar-les. L'únic exercici
-- que porta un avís explícit de "no fer sense revisió prèvia" és el de
-- resistència amb depressor lingual (motricitat orofacial), per implicar
-- un objecte dins la boca del nen/a.
-- =========================================================

update exercises set
  materials = 'Targetes o dibuixos d''objectes agrupats per temes (roba, animals, menjar)',
  steps = '[{"instruction": "Mostra 4-5 targetes d''un mateix tema i digues-ne el nom en veu alta.", "tip": "Parla a poc a poc i assenyala l''objecte mentre el nomenes."}, {"instruction": "Demana al nen/a que repeteixi el nom de cada targeta.", "tip": "Si no ho diu bé del tot, no el corregeixis sec: torna a dir-ho tu bé i prou."}, {"instruction": "Barreja les targetes i demana-li que te''n doni una segons el nom que li dius.", "tip": "Si l''encerta 4 de 5 vegades seguides, ja pots provar-ho amb un tema nou."}]'::jsonb
where title = 'Ampliació de vocabulari amb targetes temàtiques' and language = 'ca';

update exercises set
  materials = '2-3 objectes quotidians (pilota, caixa, joguina)',
  steps = '[{"instruction": "Posa els objectes sobre la taula, ben visibles.", "tip": "Asseu-te al mateix nivell que el nen/a, cara a cara."}, {"instruction": "Dona una instrucció amb dues accions seguides: \"agafa la pilota i posa-la a la caixa\".", "tip": "Digues-ho una sola vegada i espera; no repeteixis de seguida."}, {"instruction": "Observa si fa les dues accions, en l''ordre correcte.", "tip": "Si només en fa una, torna-la a dir més a poc a poc, marcant bé les dues parts."}]'::jsonb
where title = 'Seguir instruccions de dos passos' and language = 'ca';

update exercises set
  materials = 'Una imatge o vinyeta amb una escena senzilla',
  steps = '[{"instruction": "Mostra la imatge i fes una pregunta senzilla: \"qui és?\", \"què fa?\", \"on és?\".", "tip": "Fes una sola pregunta cada vegada, no les tres seguides."}, {"instruction": "Deixa uns segons perquè respongui abans d''ajudar.", "tip": "Si es queda encallat, dona dues opcions per triar (\"és un gos o un gat?\")."}, {"instruction": "Celebra la resposta encara que sigui incompleta, i completa-la tu en veu alta.", "tip": "L''objectiu és que parli, no que ho digui perfecte a la primera."}]'::jsonb
where title = 'Joc de preguntes qui/què/on' and language = 'ca';

update exercises set
  materials = 'Cap material especial; val amb converses del dia a dia',
  steps = '[{"instruction": "Digues tu una frase model amb un connector: \"vull aigua perquè tinc set\".", "tip": "Exagera una mica el connector en dir-lo, perquè hi pari atenció."}, {"instruction": "Demana-li que en faci una de semblant amb un altre final.", "tip": "Si li costa, dona-li el començament fet (\"vull... perquè...\")."}, {"instruction": "Repeteix amb els connectors \"i\" i \"però\" en dies diferents.", "tip": "No barregis els tres connectors la mateixa sessió; un cada vegada."}]'::jsonb
where title = 'Construcció de frases amb connectors' and language = 'ca';

update exercises set
  materials = '3-4 vinyetes que formin una petita història, en ordre desordenat',
  steps = '[{"instruction": "Desordena les vinyetes i demana-li que les posi en l''ordre correcte.", "tip": "Si li costa ordenar-les, fes-li una pregunta guia: \"què passa primer?\""}, {"instruction": "Un cop ordenades, demana-li que expliqui la història en veu alta.", "tip": "No cal que sigui perfecte: l''objectiu és l''ordre lògic, no la gramàtica."}, {"instruction": "Fes-li una pregunta sobre el final de la història.", "tip": "Si no sap respondre, torneu a mirar l''última vinyeta junts."}]'::jsonb
where title = 'Explicar una seqüència d''imatges' and language = 'ca';

update exercises set
  materials = 'Cap material especial',
  steps = '[{"instruction": "Escolta una frase curta que digui el nen/a (2 paraules, p. ex. \"vol aigua\").", "tip": "No la corregeixis directament, escolta primer sencera."}, {"instruction": "Repeteix-la tu mateix ampliada (\"vull una mica d''aigua, sisplau\").", "tip": "Parla a ritme normal, sense exagerar-ho com si fos una lliçó."}, {"instruction": "Anima''l a repetir la versió ampliada.", "tip": "Si només en repeteix una part, ja és un avenç; no exigeixis la frase sencera."}]'::jsonb
where title = 'Ampliació de frases model' and language = 'ca';

update exercises set
  materials = 'Un mirall de mà o de paret',
  steps = '[{"instruction": "Assegueu-vos davant del mirall, tots dos visibles.", "tip": "Que vegi alhora la teva boca i la seva."}, {"instruction": "Fes tu el moviment (llengua amunt, avall, a un costat) i que t''imiti.", "tip": "Fes-ho lentament i mantén-lo 2-3 segons a cada posició."}, {"instruction": "Repetiu la sèrie 5-8 vegades, amb pauses curtes.", "tip": "Si es cansa o es frustra, atureu-vos: no ha de doldre ni fatigar."}]'::jsonb
where title = 'Praxias linguals davant del mirall' and language = 'ca';

update exercises set
  materials = 'Cap material (es pot fer amb targetes de síl·labes si n''hi ha)',
  steps = '[{"instruction": "Digues tu una síl·laba amb el so treballat (p. ex. \"ra\").", "tip": "Parla clar i una mica més lent del normal."}, {"instruction": "Demana-li que la repeteixi just després.", "tip": "Escolta bé si surt el so correcte, no només si \"sona semblant\"."}, {"instruction": "Repeteix amb ra-re-ri-ro-ru, una sèrie cada vegada.", "tip": "Si una síl·laba li costa molt més que les altres, queda''t-hi una estona més."}]'::jsonb
where title = 'Repetició de síl·labes amb el fonema diana' and language = 'ca';

update exercises set
  materials = 'Targetes o dibuixos de parelles de paraules (pato/pado)',
  steps = '[{"instruction": "Mostra les dues targetes i digues en veu alta cada paraula.", "tip": "Exagera lleugerament la diferència de so entre les dues."}, {"instruction": "Digues només una de les dues paraules i pregunta quina és.", "tip": "No li ensenyis quina és abans de preguntar."}, {"instruction": "Canvia de parella cada 4-5 rondes per no avorrir-lo.", "tip": "Si encerta gairebé sempre, la parella és massa fàcil: prova''n una altra."}]'::jsonb
where title = 'Parells mínims' and language = 'ca';

update exercises set
  materials = 'Una llista o fitxa de paraules amb el so treballat marcat en color',
  steps = '[{"instruction": "Assenyala la primera paraula i llegeix-la tu en veu alta.", "tip": "Marca bé el so diana en dir-la."}, {"instruction": "Demana-li que la llegeixi (o la repeteixi, si encara no llegeix).", "tip": "Si s''equivoca, digues tu la paraula sencera de nou i prova-ho un altre cop."}, {"instruction": "Continueu paraula per paraula, sense pressa.", "tip": "5-8 paraules per sessió és suficient; no cal fer la llista sencera de cop."}]'::jsonb
where title = 'Lectura de paraules amb el so diana subratllat' and language = 'ca';

update exercises set
  materials = 'Un joc de cartes o targetes amb paraules variades, algunes amb el so diana',
  steps = '[{"instruction": "Estén les cartes boca amunt sobre la taula.", "tip": "Deixa-les ben visibles, no amuntegades."}, {"instruction": "Demana-li que busqui i agafi totes les que tenen el so treballat.", "tip": "Si en dubta una, digueu-la juntes en veu alta per comprovar-ho."}, {"instruction": "Un cop triades, que les digui totes en veu alta seguides.", "tip": "Celebra cada encert amb un gest o un somriure, no només al final."}]'::jsonb
where title = 'Joc de cartes: troba la paraula' and language = 'ca';

update exercises set
  materials = 'Cap material; joc lliure habitual (nines, cotxes, cuineta...)',
  steps = '[{"instruction": "Jugueu com sempre, sense forçar cap exercici formal.", "tip": "L''objectiu és que el so surti \"de veritat\", no en mode exercici."}, {"instruction": "Quan digui una paraula amb el so diana, repeteix-la tu bé, de passada.", "tip": "No l''aturis a mig joc per corregir-lo; fes-ho amb naturalitat."}, {"instruction": "Si li surt bé espontàniament, remarca-ho amb un comentari curt i positiu.", "tip": "Un simple \"molt bé, quina R tan clara!\" ja fa l''efecte."}]'::jsonb
where title = 'Generalització en frases espontànies' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Digues una paraula coneguda a poc a poc, síl·laba a síl·laba.", "tip": "Pica de mans tu mateix a cada síl·laba, com a model."}, {"instruction": "Demana-li que ho repeteixi picant de mans alhora.", "tip": "Si es desincronitza, torna-ho a fer més lent."}, {"instruction": "Compteu juntes quantes síl·labes/cops de mans hi ha hagut.", "tip": "Comença amb paraules de 2 síl·labes abans de passar a 3."}]'::jsonb
where title = 'Consciència síl·làbica amb picada de mans' and language = 'ca';

update exercises set
  materials = 'Una cançó infantil coneguda amb rimes',
  steps = '[{"instruction": "Canteu la cançó junts un parell de vegades.", "tip": "Tria una cançó que ja conegui, per treure pressió de \"aprendre-la\"."}, {"instruction": "Atura''t just abans de la paraula que rima i deixa que la digui ell/a.", "tip": "Dona-li 2-3 segons abans d''ajudar."}, {"instruction": "Repetiu-ho remarcant el so final que rima.", "tip": "Exagera una mica el so final en cantar-lo tu."}]'::jsonb
where title = 'Cançons amb rimes senzilles' and language = 'ca';

update exercises set
  materials = 'Cap material, o targetes amb parelles de paraules semblants',
  steps = '[{"instruction": "Digues dues paraules molt semblants seguides (p. ex. \"cosa/cota\").", "tip": "Digues-les a un ritme normal, no exagerat."}, {"instruction": "Pregunta-li si sonen iguals o diferents.", "tip": "Deixa que respongui abans de donar-li cap pista."}, {"instruction": "Repeteix-les a poc a poc si no ho ha sentit clar.", "tip": "Si continua costant, torna-ho a fer un altre dia, no insisteixis massa."}]'::jsonb
where title = 'Discriminació auditiva de paraules semblants' and language = 'ca';

update exercises set
  materials = 'Targetes per parelles (joc de memòria) amb paraules treballades',
  steps = '[{"instruction": "Col·loca totes les targetes boca avall en files.", "tip": "Fes servir poques parelles (4-6) si és petit."}, {"instruction": "Per torns, gireu dues targetes i digueu en veu alta què hi ha.", "tip": "Anima''l a dir la paraula sencera, no només assenyalar."}, {"instruction": "Si coincideixen, us quedeu la parella; si no, es giren de nou.", "tip": "Celebra cada parella trobada, encerti o no la paraula perfectament."}]'::jsonb
where title = 'Joc de memòria amb paraules diana' and language = 'ca';

update exercises set
  materials = 'Dues targetes amb la parella de paraules contrastades (pilota/bola)',
  steps = '[{"instruction": "Mostra les dues paraules i digues-les ben diferenciades.", "tip": "Assenyala la targeta corresponent mentre la dius."}, {"instruction": "Digues-ne només una i pregunta quina és.", "tip": "Si s''equivoca, torna-ho a dir tu mateix abans de repetir la pregunta."}, {"instruction": "Intercanvieu papers: que sigui ell/a qui et digui una paraula i tu l''assenyalis.", "tip": "Aquest gir el motiva i et permet veure si distingeix bé el so."}]'::jsonb
where title = 'Contrast de processos fonològics' and language = 'ca';

update exercises set
  materials = 'Cap material; llista curta de paraules inventades preparada pel logopeda',
  steps = '[{"instruction": "Digues una paraula inventada breu (2 síl·labes).", "tip": "Parla clar, a ritme normal, sense fer-ne una festa estranya."}, {"instruction": "Demana-li que la repeteixi tal com l''ha sentit.", "tip": "No passa res si li surt diferent; és normal amb paraules inventades."}, {"instruction": "Continueu amb 5-6 paraules inventades diferents.", "tip": "Si sempre s''equivoca amb el mateix so, anota-ho per parlar-ne amb el logopeda."}]'::jsonb
where title = 'Repetició de pseudoparaules' and language = 'ca';

update exercises set
  materials = 'Cap material (opcional: un peluix petit sobre la panxa per veure el moviment)',
  steps = '[{"instruction": "Seieu còmodament i posa la mà sobre la panxa.", "tip": "Fes-ho tu primer com a model, respirant de forma visible."}, {"instruction": "Inspira per el nas notant com la panxa s''infla, expira lentament per la boca.", "tip": "Compta mentalment fins a 3 en inspirar i fins a 4 en expirar."}, {"instruction": "Repetiu 4-5 respiracions abans de començar a parlar.", "tip": "Si es marea o li costa, para i torneu-hi un altre moment."}]'::jsonb
where title = 'Respiració diafragmàtica abans de parlar' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Fes tu un badall exagerat i sonor, com a model.", "tip": "Que vegi que és un joc, no una cosa seriosa."}, {"instruction": "Anima''l a fer-ne un d''igual.", "tip": "Si no li surt de seguida, proveu junts diverses vegades amb calma."}, {"instruction": "Just després del badall, digueu una paraula curta en veu suau.", "tip": "L''objectiu és notar la gola relaxada, no la perfecció del so."}]'::jsonb
where title = 'Badalls sonors per relaxar la laringe' and language = 'ca';

update exercises set
  materials = 'Llista de 5-6 paraules que comencin per vocal',
  steps = '[{"instruction": "Diguès tu una paraula començant-la molt suaument, quasi com un sospir.", "tip": "Evita començar la paraula amb un cop de veu sec."}, {"instruction": "Demana-li que la digui igual, començant fluix i pujant el volum a poc a poc.", "tip": "Si torna a l''inici sec, torna-ho a modelar tu abans de repetir."}, {"instruction": "Repetiu amb cada paraula de la llista, sense presses.", "tip": "Val més fer-ne poques ben fetes que totes de pressa."}]'::jsonb
where title = 'Parla ralentida amb inici suau (easy onset)' and language = 'ca';

update exercises set
  materials = 'Un metrònom (app de mòbil gratuïta) i un text curt',
  steps = '[{"instruction": "Posa el metrònom a un ritme lent i còmode.", "tip": "Comença sempre més lent del que sembla necessari."}, {"instruction": "Llegiu una frase marcant una síl·laba a cada cop del metrònom.", "tip": "Si perd el ritme, atura el metrònom i torneu-hi des de l''inici de la frase."}, {"instruction": "Augmenta molt lleugerament el ritme només si va fluid diverses vegades seguides.", "tip": "No forcis a anar més ràpid si encara hi ha tensió."}]'::jsonb
where title = 'Lectura a ritme controlat amb metrònom' and language = 'ca';

update exercises set
  materials = 'Ninots, titelles o joguines que ja tingui a casa',
  steps = '[{"instruction": "Proposa un joc senzill de \"fer veure que som...\" amb els ninots.", "tip": "Tria un tema que li agradi (botiga, metge, restaurant)."}, {"instruction": "Parla tu primer en el joc, sense pressa, deixant silencis naturals.", "tip": "Mai l''interrompis ni acabis les seves frases per ell."}, {"instruction": "Deixa que participi quan vulgui, sense obligar-lo a dir res concret.", "tip": "L''objectiu és parlar relaxat jugant, no \"practicar parla\"."}]'::jsonb
where title = 'Joc de rols amb baixa pressió comunicativa' and language = 'ca';

update exercises set
  materials = 'Un paper amb cares (content/neutre) o pegatines de colors',
  steps = '[{"instruction": "Al final del dia, recorda junts un moment en què ha parlat molt bé.", "tip": "Sigues tu qui ho recordi si a ell/a li costa identificar-ho."}, {"instruction": "Enganxa una pegatina o dibuixa una cara contenta en aquell moment.", "tip": "Fes-ne una festa petita, sense donar-hi massa transcendència."}, {"instruction": "Repeteix-ho cada dia, sense parlar dels moments \"dolents\".", "tip": "L''objectiu és que noti que SÍ que hi ha estones de parla fàcil."}]'::jsonb
where title = 'Autoregistre de moments de fluïdesa' and language = 'ca';

update exercises set
  materials = 'Cap material (opcional: dibuixos de situacions quotidianes)',
  steps = '[{"instruction": "Parleu junts de moments del dia en què crida molt (pati, piscina...).", "tip": "No ho facis com una regany, sinó com una conversa."}, {"instruction": "Proposeu junts una alternativa per a cada situació (xiulet, mans, apropar-se).", "tip": "Que sigui ell/a qui proposi alguna idea, encara que calgui ajudar-lo."}, {"instruction": "Trieu UNA sola alternativa per practicar aquesta setmana.", "tip": "Massa canvis de cop no es recorden; un de sol sí."}]'::jsonb
where title = 'Higiene vocal: identificar hàbits de risc' and language = 'ca';

update exercises set
  materials = 'Una ampolla d''aigua pròpia',
  steps = '[{"instruction": "Trieu 2-3 moments del dia per beure aigua (esmorzar, migdia, sortida escola).", "tip": "Lliga-ho a rutines que ja existeixin, no en creïs de noves."}, {"instruction": "En aquests moments, proposa també un minut sense parlar ni cridar.", "tip": "Pots fer-ho tu també, com a joc de \"silenci en equip\"."}, {"instruction": "Marca-ho en un calendari senzill cada dia que es compleixi.", "tip": "Una simple creu o pegatina diària ja és prou seguiment."}]'::jsonb
where title = 'Hidratació i pauses vocals programades' and language = 'ca';

update exercises set
  materials = 'Un got amb una mica d''aigua i una palleta',
  steps = '[{"instruction": "Posa la palleta dins l''aigua i bufa fent bombolles contínues.", "tip": "Que el bufit sigui constant, no cops curts."}, {"instruction": "Mentre bufa, demana-li que hi afegeixi un so suau de veu (\"mmm\").", "tip": "El so ha de sortir fluix i constant, sense esforç."}, {"instruction": "Repetiu 3-4 vegades de 10 segons, amb descans entremig.", "tip": "Si es marea bufant, allarga els descansos."}]'::jsonb
where title = 'Bombolles amb palleta (straw phonation)' and language = 'ca';

update exercises set
  materials = 'Cap material (opcional: un dial o regulador de volum dibuixat en paper)',
  steps = '[{"instruction": "Dibuixa o mostra un \"regulador\" amb tres nivells: fluix, normal, fort.", "tip": "Fes-ho visual, no només explicat amb paraules."}, {"instruction": "Digues una paraula a cada nivell i que ell/a l''imiti.", "tip": "Passa sempre per \"normal\" entre fluix i fort, mai d''un extrem a l''altre de cop."}, {"instruction": "Intercanvieu papers: que triï ell/a el nivell i tu l''endevinis.", "tip": "Reforça quan controla bé el volum, sobretot passar de fort a normal."}]'::jsonb
where title = 'Control d''intensitat amb joc de volums' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Fes un badall sonor ben obert, com a model.", "tip": "Exagera''l una mica, com un joc."}, {"instruction": "Just després, allarga un so vocàlic suau (\"aaaa\") sense forçar.", "tip": "El so ha de sortir relaxat, mai cridat."}, {"instruction": "Repetiu la seqüència badall+so 3-4 vegades.", "tip": "Si nota la gola tensa, atureu-vos i torneu-hi un altre moment."}]'::jsonb
where title = 'Badalls sonors combinats amb vocalitzacions' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Fes tu un \"lliscament\" de veu de greu a agut amb un so vocàlic (\"uuuu\").", "tip": "Que soni com una sirena suau, no com un crit."}, {"instruction": "Demana-li que t''imiti pujant i baixant el to amb veu relaxada.", "tip": "Si força el to agut, torna a baixar i comença de nou més suau."}, {"instruction": "Repetiu 4-5 vegades, alternant pujar i baixar.", "tip": "Ha de ser un joc, no un exercici de \"cantar bé\"."}]'::jsonb
where title = 'Vocalitzacions en glissando suau' and language = 'ca';

update exercises set
  materials = 'Un mirall',
  steps = '[{"instruction": "Davant del mirall, fes tu somriures amples i \"petons\" exagerats.", "tip": "Mantén cada posició 2-3 segons."}, {"instruction": "Demana-li que t''imiti mirant-se al mirall.", "tip": "Corregeix suaument amb les mans si cal, mai forçant."}, {"instruction": "Repetiu la sèrie 5-6 vegades.", "tip": "Si es cansa, reduïu repeticions abans que fer-ho malament."}]'::jsonb
where title = 'Praxias labials' and language = 'ca';

update exercises set
  materials = 'Un pot de bombolles de sabó',
  steps = '[{"instruction": "Bufa tu primer bombolles grosses i lentes, com a model.", "tip": "Bufa amb llavis arrodonits, no amb la boca oberta."}, {"instruction": "Passa-li el pot i que ho provi ell/a.", "tip": "Si li surten bombolles petites i ràpides, ensenya-li a bufar més fluix i llarg."}, {"instruction": "Feu-ne una petita competició de qui en fa una de més gran.", "tip": "L''objectiu és el control del bufit, no la quantitat."}]'::jsonb
where title = 'Bufar bombolles de sabó' and language = 'ca';

update exercises set
  materials = 'Un mirall (opcional)',
  steps = '[{"instruction": "Demana-li que tregui la llengua i la mogui cap amunt, tocant el nas (sense forçar).", "tip": "Fes-ho tu primer com a model clar."}, {"instruction": "Repetiu cap avall (tocant la barbeta) i a cada costat.", "tip": "Cada moviment, manté''l 2 segons abans de tornar al centre."}, {"instruction": "Feu 3 sèries completes amb un petit descans entre elles.", "tip": "Si es cansa la llengua, és normal: pareu i seguiu un altre dia."}]'::jsonb
where title = 'Moviments linguals amunt/avall/lateral' and language = 'ca';

update exercises set
  materials = 'Un batut o iogurt líquid i una palleta',
  steps = '[{"instruction": "Ensenya-li a xuclar el líquid espès a poc a poc amb la palleta.", "tip": "Que els llavis quedin ben tancats al voltant de la palleta."}, {"instruction": "Observa si li costa i necessita fer molta força.", "tip": "Si li costa molt, prova amb un líquid una mica menys espès."}, {"instruction": "Repetiu uns quants glops, amb pauses per respirar.", "tip": "No cal acabar tot el got d''un cop; unes quantes xuclades ja compten."}]'::jsonb
where title = 'Xuclar líquids espessos amb palleta' and language = 'ca';

update exercises set
  materials = 'Cap material (mans netes)',
  steps = '[{"instruction": "Amb les puntes dels dits, fes petits cercles suaus a les galtes.", "tip": "Pressió suau, mai que faci mal."}, {"instruction": "Continua amb un massatge suau als llavis, de fora cap al centre.", "tip": "Observa la seva reacció; si es posa tens, para."}, {"instruction": "Acaba amb uns segons de quietud abans de començar els altres exercicis.", "tip": "Aquest pas és per relaxar, no per estimular encara."}]'::jsonb
where title = 'Massatge orofacial previ a la sessió' and language = 'ca';

update exercises set
  materials = 'Un depressor lingual (baixallengües) net — NOMÉS SOTA INDICACIÓ DEL LOGOPEDA',
  steps = '[{"instruction": "Demana primer al logopeda que et mostri exactament com fer-ho abans d''intentar-ho a casa.", "tip": "Aquest exercici implica un objecte dins la boca: cal la tècnica exacta que indiqui el professional."}, {"instruction": "Segueix estrictament la posició i la força que t''hagi indicat el logopeda.", "tip": "Mai augmentis la resistència pel teu compte."}, {"instruction": "Si el nen/a mostra molèstia, arrufament o rebuig, atura''t i consulta el logopeda abans de repetir-ho.", "tip": "Aquest és l''únic exercici de tota la biblioteca que recomanem NO fer sense revisió prèvia directa del professional."}]'::jsonb
where title = 'Exercicis de resistència amb depressor lingual' and language = 'ca';

update exercises set
  materials = 'Cap material (opcional: llibre de poemes o cançons infantils)',
  steps = '[{"instruction": "Digues una paraula i demana-li''n una que rimi.", "tip": "Si li costa, dona-li dues opcions perquè triï la que rima."}, {"instruction": "Proveu també paraules que comencin igual (\"sol, sopa, sabata\").", "tip": "Exagera el so inicial en dir cada paraula."}, {"instruction": "Feu-ne un petit joc de ping-pong, alternant qui proposa la paraula.", "tip": "Celebra cada intent, encara que la rima no sigui exacta."}]'::jsonb
where title = 'Joc de rimes i al·literacions' and language = 'ca';

update exercises set
  materials = 'Targetes amb síl·labes soltes',
  steps = '[{"instruction": "Col·loca 3-4 targetes de síl·labes sobre la taula.", "tip": "Tria síl·labes que puguin formar una paraula coneguda."}, {"instruction": "Demana-li que les ordeni per formar una paraula.", "tip": "Si li costa, digues tu la paraula sencera perquè hi busqui l''ordre."}, {"instruction": "Un cop formada, que la llegeixi en veu alta sencera.", "tip": "Reforça quan la llegeix d''una tirada, sense aturar-se síl·laba a síl·laba."}]'::jsonb
where title = 'Reconeixement de síl·labes amb targetes' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Digues una paraula curta (3-4 lletres) a ritme normal.", "tip": "Tria paraules senzilles, sense grups consonàntics complicats."}, {"instruction": "Demana-li que la digui so per so, ben separats (\"s-o-l\").", "tip": "Fes-ho tu primer com a model exagerant la separació."}, {"instruction": "Repetiu amb 4-5 paraules diferents.", "tip": "Si li costa molt, torneu a la consciència síl·làbica abans de seguir amb sons."}]'::jsonb
where title = 'Segmentació fonèmica de paraules' and language = 'ca';

update exercises set
  materials = 'Un text curt adequat a la seva edat',
  steps = '[{"instruction": "Llegiu el text a veus alternes, frase per frase.", "tip": "Tu llegeixes una frase model, ell/a la següent."}, {"instruction": "Si s''encalla en una paraula, dona-li uns segons abans d''ajudar.", "tip": "Digues la paraula sencera, no lletra per lletra, si cal ajudar."}, {"instruction": "Acabeu preguntant de què anava el text, amb les vostres paraules.", "tip": "L''objectiu final és entendre-ho, no només llegir-ho bé."}]'::jsonb
where title = 'Lectura acompanyada en parella' and language = 'ca';

update exercises set
  materials = 'Un text curt (3-5 línies) i un rellotge o mòbil',
  steps = '[{"instruction": "Cronometra una primera lectura del text, sense avisar-lo abans.", "tip": "Anota el temps, sense comentar-lo encara."}, {"instruction": "Torna a llegir el mateix text 2-3 vegades més durant la setmana.", "tip": "Sempre el mateix text: la repetició és la clau, no un text nou cada dia."}, {"instruction": "Compareu junts el temps de la primera i l''última lectura.", "tip": "Celebra la millora de temps, encara que sigui petita."}]'::jsonb
where title = 'Lectura repetida de textos curts cronometrada' and language = 'ca';

update exercises set
  materials = 'Llapis i paper',
  steps = '[{"instruction": "Digues una paraula inventada breu, a ritme normal.", "tip": "Repeteix-la un cop més si cal, sense trossejar-la."}, {"instruction": "Demana-li que l''escrigui tal com la sent.", "tip": "No hi ha \"resposta correcta\" fixa: és sobre el so-grafia, no l''ortografia real."}, {"instruction": "Repassa junts què ha escrit, dient-ho en veu alta.", "tip": "Si el so i el que ha escrit no coincideixen, torneu-ho a dir junts a poc a poc."}]'::jsonb
where title = 'Dictat de pseudoparaules' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Fes junts uns quants cercles amb el canell, amunt i avall.", "tip": "Que els moviments siguin suaus, no bruscos."}, {"instruction": "Obre i tanca la mà en puny 5-6 vegades.", "tip": "Fes-ho tu alhora, com a escalfament compartit."}, {"instruction": "Sacseja suaument la mà uns segons abans d''agafar el llapis.", "tip": "Aquest pas és curt (menys d''un minut): no cal allargar-lo."}]'::jsonb
where title = 'Relaxació de la mà abans d''escriure' and language = 'ca';

update exercises set
  materials = 'Una safata amb sorra fina o una capa de plastilina estesa',
  steps = '[{"instruction": "Dibuixa tu una lletra gran a la sorra amb el dit, a poc a poc.", "tip": "Verbalitza el traç mentre el fas (\"amunt, avall, i cap aquí\")."}, {"instruction": "Esborra-la i demana-li que la repeteixi amb el dit.", "tip": "Guia-li la mà suaument si li costa començar."}, {"instruction": "Repetiu amb 3-4 lletres diferents, les que estigui treballant a l''escola.", "tip": "Prioritza qualitat del traç per sobre de velocitat."}]'::jsonb
where title = 'Traç de lletres en sorra o plastilina' and language = 'ca';

update exercises set
  materials = 'Una fitxa de laberint imprès o dibuixat a mà',
  steps = '[{"instruction": "Explica el punt de sortida i el d''arribada del laberint.", "tip": "Assegura''t que entén cap on ha d''anar abans de començar."}, {"instruction": "Que ressegueixi el camí amb el llapis sense aixecar-lo del paper.", "tip": "Si s''atura molt sovint, no passa res: l''objectiu és no sortir-se del camí."}, {"instruction": "Comenteu junts el resultat quan acabi.", "tip": "Si es surt del traç sovint, prova un laberint més ample la propera vegada."}]'::jsonb
where title = 'Jocs de laberints i traços continus' and language = 'ca';

update exercises set
  materials = 'Pinces de roba i un tros de cartró o capsa',
  steps = '[{"instruction": "Ensenya-li a obrir la pinça amb dos dits (polze i índex) i enganxar-la al cartró.", "tip": "Fes-ho tu primer ben a poc a poc perquè vegi el moviment."}, {"instruction": "Que enganxi 6-8 pinces al voltant del cartró.", "tip": "Si li costa obrir-la, tria pinces més toves per començar."}, {"instruction": "Repetiu traient-les totes una a una.", "tip": "Aquest exercici es pot repetir sovint, és molt segur i sense riscos."}]'::jsonb
where title = 'Exercicis de pinça digital' and language = 'ca';

update exercises set
  materials = 'Full amb línies més amples del que és habitual',
  steps = '[{"instruction": "Escriu tu una frase curta i senzilla a la part de dalt del full.", "tip": "Escriu-la ben clara, com a model a copiar."}, {"instruction": "Demana-li que la copiï a sota, línia per línia.", "tip": "No corregeixis cada lletra; deixa que acabi la frase sencera primer."}, {"instruction": "Repasseu junts el resultat, comentant què ha sortit més bé.", "tip": "Busca UNA cosa concreta a felicitar, no una llista de correccions."}]'::jsonb
where title = 'Còpia guiada amb pauta ampliada' and language = 'ca';

update exercises set
  materials = 'Llapis, paper i el text original per comparar',
  steps = '[{"instruction": "Dicta una frase curta a ritme lent, repetint-la un cop si cal.", "tip": "Parla clar, fent petites pauses entre paraules."}, {"instruction": "Deixa que l''escrigui sencera abans de continuar.", "tip": "No la dictis paraula a paraula; la frase sencera primer."}, {"instruction": "Ensenya-li el text original perquè comprovi ell/a mateix què hi falta.", "tip": "Que sigui ell/a qui trobi les diferències, amb la teva ajuda si cal."}]'::jsonb
where title = 'Dictat lent amb autoavaluació' and language = 'ca';

update exercises set
  materials = 'Targetes amb preguntes senzilles ("quin és el teu color preferit?")',
  steps = '[{"instruction": "Poseu les targetes en un munt i agafeu-ne una per torns.", "tip": "Comença tu per mostrar com es respon i després es passa el torn."}, {"instruction": "Qui té el torn respon, i després pregunta el mateix a l''altre.", "tip": "Si oblida preguntar-ho de tornada, recorda-li-ho suaument."}, {"instruction": "Repetiu 4-5 targetes per sessió.", "tip": "L''objectiu és el ritme de torns, no el contingut de les respostes."}]'::jsonb
where title = 'Joc de torns amb targetes de conversa' and language = 'ca';

update exercises set
  materials = 'Una joguina que ja li agradi (cotxes, nines, blocs)',
  steps = '[{"instruction": "Asseieu-vos junts al terra amb la joguina entre tots dos.", "tip": "Poseu-vos al mateix nivell visual que el nen/a."}, {"instruction": "Segueix el que ell/a fa amb la joguina i comenta-ho en veu alta.", "tip": "Deixa que ell/a lideri el joc; tu hi vas afegint comentaris."}, {"instruction": "De tant en tant, assenyala alguna cosa i mira si hi mira ell/a també.", "tip": "Si et segueix la mirada i torna a mirar-te, és un bon senyal."}]'::jsonb
where title = 'Pràctica d''atenció conjunta amb joc compartit' and language = 'ca';

update exercises set
  materials = 'Fotografies o dibuixos de cares amb emocions clares',
  steps = '[{"instruction": "Mostra una cara i pregunta quina emoció mostra.", "tip": "Comença amb emocions bàsiques: content, trist, enfadat."}, {"instruction": "Demana-li que faci ell/a mateix aquesta cara.", "tip": "Fes-la tu també, com a joc de miralls."}, {"instruction": "Parleu d''un moment en què ell/a s''ha sentit així.", "tip": "No forcis records difícils; si no en vol parlar, no insisteixis."}]'::jsonb
where title = 'Interpretació d''expressions facials' and language = 'ca';

update exercises set
  materials = 'Cap material especial (opcional: ninots o disfresses senzilles)',
  steps = '[{"instruction": "Trieu junts una situació senzilla (demanar alguna cosa a una botiga).", "tip": "Explica primer breument què passarà a l''escena."}, {"instruction": "Feu l''escena tu fent un paper i ell/a un altre.", "tip": "Si s''encalla, dona-li una frase senzilla per continuar."}, {"instruction": "Repetiu l''escena canviant els papers.", "tip": "Que provi els dos rols ajuda a entendre les dues perspectives."}]'::jsonb
where title = 'Rol-play de situacions socials' and language = 'ca';

update exercises set
  materials = 'Una vinyeta o imatge amb una situació a mig resoldre',
  steps = '[{"instruction": "Mostra la imatge i atura''t just abans del desenllaç.", "tip": "Tapa la part final si és un còmic de diverses vinyetes."}, {"instruction": "Pregunta què creu que passarà després.", "tip": "Accepta qualsevol resposta raonable, no busquis \"la correcta\"."}, {"instruction": "Ensenya el final real i comenteu junts si s''hi assemblava.", "tip": "Si s''ha equivocat, no ho tractis com un error, sinó com una sorpresa."}]'::jsonb
where title = 'Joc de "què penses que passarà?"' and language = 'ca';

update exercises set
  materials = 'Un full i bolígraf, o fotos de situacions reals del nen/a',
  steps = '[{"instruction": "Escriviu junts una historieta curta sobre una situació real seva (anar al metge, un aniversari).", "tip": "Fes servir frases curtes i en primera persona (\"quan jo...\")."}, {"instruction": "Llegiu-la junts diverses vegades durant la setmana.", "tip": "Sempre abans que passi de veritat aquella situació, si es pot preveure."}, {"instruction": "Després de viure la situació real, parleu de com ha anat comparat amb la historieta.", "tip": "Reforça el que ha anat bé abans de parlar del que es pot millorar."}]'::jsonb
where title = 'Històries socials personalitzades' and language = 'ca';

update exercises set
  materials = 'Un objecte petit (pilota, peluix) que indiqui qui parla',
  steps = '[{"instruction": "Expliqueu la regla: només parla qui té l''objecte a la mà.", "tip": "Practiqueu-ho primer amb un tema fàcil i curt."}, {"instruction": "Passeu-vos l''objecte per torns mentre conversa.", "tip": "Si parla sense tenir-lo, recorda-li la regla sense renyar."}, {"instruction": "Feu una conversa curta (2-3 minuts) seguint la regla.", "tip": "Allarga-ho a poc a poc en properes sessions, no de cop."}]'::jsonb
where title = 'Escolta activa amb senyal visual de torn' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Digues 2 paraules seguides i demana-li que les repeteixi en el mateix ordre.", "tip": "Parla clar i a ritme normal, sense pauses estranyes."}, {"instruction": "Si ho fa bé, afegeix una paraula més (passa a 3).", "tip": "Si falla, torna a 2 paraules abans de tornar-ho a intentar amb 3."}, {"instruction": "Acabeu quan comenci a costar-li, sense forçar més enllà.", "tip": "Uns 5-6 intents per sessió és suficient."}]'::jsonb
where title = 'Joc de memòria seqüencial auditiva' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Explica el joc: abans de respondre, cal comptar mentalment fins a 3.", "tip": "Fes-ho tu primer en veu alta un parell de vegades com a model."}, {"instruction": "Fes-li una pregunta senzilla i espera que compti abans de respondre.", "tip": "No el pressionis si triga una mica més del compte."}, {"instruction": "Repetiu amb 4-5 preguntes diferents.", "tip": "Celebra quan s''ha esperat, independentment de la resposta."}]'::jsonb
where title = 'Pauses estructurades durant la conversa' and language = 'ca';

update exercises set
  materials = '2-3 objectes quotidians',
  steps = '[{"instruction": "Comença amb una instrucció d''un sol pas (\"porta''m el got\").", "tip": "Espera que la completi abans de donar-ne una altra."}, {"instruction": "Si li surt bé, passa a instruccions de 2 passos.", "tip": "Dona la instrucció sencera d''un cop, no a trossos."}, {"instruction": "Si continua bé, prova amb 3 passos.", "tip": "Si falla a un nivell, torna a l''anterior abans de tornar-hi a provar."}]'::jsonb
where title = 'Seguiment d''instruccions creixents en complexitat' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Ensenya-li una frase curta per dir-se a si mateix abans de respondre (\"penso abans de parlar\").", "tip": "Digues-la tu en veu alta com a model unes quantes vegades."}, {"instruction": "Fes-li una pregunta i recorda-li que digui la frase abans de respondre.", "tip": "Al principi pot dir-la en veu alta; més endavant, mentalment."}, {"instruction": "Repetiu amb diverses preguntes al llarg del dia, no només en \"sessió\".", "tip": "Com més natural i quotidià, més fàcil que s''hi acostumi."}]'::jsonb
where title = 'Autoinstruccions verbals abans de respondre' and language = 'ca';

update exercises set
  materials = 'Un full amb 3 caselles dibuixades (inici / nus / final)',
  steps = '[{"instruction": "Explica que tota història té un principi, un problema i un final.", "tip": "Posa un exemple curt i conegut (un conte que ja sàpiga)."}, {"instruction": "Demana-li que expliqui alguna cosa que li hagi passat seguint les 3 caselles.", "tip": "Assenyala cada casella mentre en parla, per ajudar-lo a situar-se."}, {"instruction": "Si es desvia del tema, torna''l suaument a la casella on era.", "tip": "No cal una història llarga: 3 frases, una per casella, ja compleix l''objectiu."}]'::jsonb
where title = 'Narració amb esquema visual (inici-nus-desenllaç)' and language = 'ca';

update exercises set
  materials = 'Cap material (opcional: dibuixos d''animals)',
  steps = '[{"instruction": "Fes un so d''animal senzill (\"mu\", \"guau\") amb el gest corresponent.", "tip": "Fes-ho amb entusiasme i cara expressiva."}, {"instruction": "Espera un moment a veure si t''imita, sense pressionar.", "tip": "Si no ho fa, repeteix-ho una altra vegada amb la mateixa alegria."}, {"instruction": "Canvia d''animal cada 3-4 repeticions per mantenir l''interès.", "tip": "Si es mostra content i atent, és senyal que continueu bé."}]'::jsonb
where title = 'Joc d''imitació de sons i gestos' and language = 'ca';

update exercises set
  materials = 'Cap material',
  steps = '[{"instruction": "Canta una cançó tradicional curta fent els gestos que l''acompanyen.", "tip": "Assegura''t que et veu bé la cara i les mans."}, {"instruction": "Repeteix-la diverses vegades seguides, sempre igual.", "tip": "La repetició exacta és clau a aquesta edat: no la canviïs cada dia."}, {"instruction": "Deixa pauses als moments clau perquè intenti fer el gest sol.", "tip": "Si comença a avançar-se al gest, és un molt bon senyal d''anticipació."}]'::jsonb
where title = 'Cançons amb gestos (cançons de falda)' and language = 'ca';

update exercises set
  materials = 'Cap material; objectes de la casa',
  steps = '[{"instruction": "Assenyala un objecte conegut (\"taula\", \"pilota\") i digues-ne el nom.", "tip": "Assenyala amb el dit ben clar, a prop de l''objecte."}, {"instruction": "Espera a veure si assenyala o mira l''objecte també.", "tip": "Si ho fa, torna a dir el nom en veu alta com a reforç."}, {"instruction": "Repetiu amb 4-5 objectes diferents de l''habitació.", "tip": "No cal que ho digui ell/a: assenyalar i mirar ja és comunicació valuosa."}]'::jsonb
where title = 'Joc d''assenyalar i anomenar objectes quotidians' and language = 'ca';

update exercises set
  materials = 'Cap material; rutines diàries (bany, àpats)',
  steps = '[{"instruction": "Tria una frase fixa per a un moment del dia (\"ara toca banyar-se!\").", "tip": "Digues-la sempre amb el mateix to i les mateixes paraules."}, {"instruction": "Repeteix la mateixa frase cada dia en aquell moment exacte.", "tip": "La previsibilitat l''ajuda a anticipar i entendre el llenguatge."}, {"instruction": "Observa si amb el temps anticipa la rutina en sentir la frase.", "tip": "Si es gira cap a la banyera en sentir-la, ja està entenent-la."}]'::jsonb
where title = 'Rutines amb llenguatge repetitiu' and language = 'ca';

update exercises set
  materials = 'Un conte curt i senzill amb sons d''animals o objectes',
  steps = '[{"instruction": "Llegeix el conte exagerant molt les onomatopeies (\"muuu\", \"bum\").", "tip": "Fes-ho amb veu diferent per a cada so, com un joc."}, {"instruction": "Atura''t abans de dir l''onomatopeia i mira si la vol dir ell/a.", "tip": "Dona-li 2-3 segons abans de dir-la tu."}, {"instruction": "Repetiu el mateix conte diverses vegades durant la setmana.", "tip": "Com més el coneix, més fàcil que s''avanci a dir els sons."}]'::jsonb
where title = 'Lectura de contes amb onomatopeies' and language = 'ca';

update exercises set
  materials = 'Un titella de mà o un simple mitjó amb ulls dibuixats',
  steps = '[{"instruction": "Fes parlar el titella amb veu diferent, saludant el nen/a.", "tip": "Que el titella \"miri\" directament el nen/a als ulls."}, {"instruction": "Fes que el titella faci una pregunta molt senzilla (\"vols jugar?\").", "tip": "Deixa una pausa clara esperant qualsevol resposta (so, gest, mirada)."}, {"instruction": "Anima''l a agafar el titella i fer-lo \"parlar\" ell/a mateix.", "tip": "Qualsevol so o gest que faci amb el titella compta com a participació."}]'::jsonb
where title = 'Estimulació amb titelles' and language = 'ca';
