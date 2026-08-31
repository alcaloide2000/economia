export type NotebookVideo = {
  title: string;
  /** YouTube URL, confirmed by title match. Omitted when no confident match was found. */
  url?: string;
};

export type Lesson = {
  day: number;
  title: string;
  topics: string;
  /** Companion video index page cited in the study guide (anarcocapitalista.com) */
  companionUrl?: string;
  /** Lecture videos for this day already saved in the NotebookLM notebook, if any (including "bis"/supplementary recordings) */
  notebookVideos?: NotebookVideo[];
  /** Mind map of the lesson's content, built from the lecture transcript */
  mindMapUrl?: string;
};

export type CoursePart = {
  title: string;
  lessons: Lesson[];
  /** Show this part's heading on the schedule page even if none of its lessons have a notebookVideos entry yet */
  alwaysShow?: boolean;
};

const companionUrl = (day: number) => `https://www.anarcocapitalista.com/JHSLecciones${day}.htm`;

export const courseTitle = "Introducción a la Economía";
export const courseProfessor = "Jesús Huerta de Soto";
export const courseSource = "Guía Docente al Curso por Internet (Unión Editorial, 2014), Universidad Rey Juan Carlos";

export const courseParts: CoursePart[] = [
  {
    title: "Introducción a la Microeconomía y Complementos",
    lessons: [
      { day: 1, title: "Presentación del primer semestre", topics: "Estudio preliminar. Introducción: Economía y Praxeología.", companionUrl: companionUrl(1) },
    ],
  },
  {
    title: "Primera Parte: La Acción Humana",
    lessons: [
      { day: 2, title: "La función empresarial", topics: "Definición. Elementos de la acción humana: fin, valor, medio, utilidad, escasez.", companionUrl: companionUrl(2), notebookVideos: [{ title: "Clase 2. ¿Qué es un Empresario Realmente? La Respuesta Cambiará Tu Vida por Jesús Huerta de Soto", url: "https://www.youtube.com/watch?v=LkojsrhXOJ4" }], mindMapUrl: "https://claude.ai/code/artifact/844ee1bd-6272-4c26-9eae-5869d1da111b" },
      { day: 3, title: "Elementos de la acción humana (II)", topics: "Plan de actuación, acto de voluntad, tiempo (expectativas, incertidumbre, instituciones, probabilidad de clase y de caso).", companionUrl: companionUrl(3), notebookVideos: [{ title: "Clase 3: Fundamentos de la Acción Humana y el Rol del Empresario en la Economía Moderna | JHS", url: "https://www.youtube.com/watch?v=dMyIwQQpheA" }], mindMapUrl: "https://claude.ai/code/artifact/3a30271f-6139-4f43-8baa-ca22ef6b2745" },
      { day: 4, title: "Elementos de la acción humana (y III)", topics: "Tiempo (sorpresa, serendipidad) y coste. Racionalidad. Acción humana como axioma.", companionUrl: companionUrl(4), notebookVideos: [{ title: "Clase 4: El Poder del Conocimiento Empresarial para Transformar Vidas | Jesús Huerta de Soto", url: "https://www.youtube.com/watch?v=ezpT9Zg3Dqo" }] },
      { day: 5, title: "El conocimiento empresarial", topics: "Características: subjetivo, práctico (no científico) y privativo.", companionUrl: companionUrl(5), notebookVideos: [{ title: "Clase 05. El Conocimiento Empresarial: Clave para el Éxito y la Innovación | Jesús Huerta de Soto", url: "https://www.youtube.com/watch?v=6q9r1OH3m0I" }] },
      { day: 6, title: "El conocimiento empresarial (continuación)", topics: "Privativo y disperso, tácito y no articulable. Funciones del acto empresarial: creación y transmisión de información y coordinación.", companionUrl: companionUrl(6), notebookVideos: [{ title: "Clase 06: Creatividad Empresarial y la Sociedad: Huerta de Soto Explica el Futuro de la Economía", url: "https://www.youtube.com/watch?v=j3y3WBQix3Q" }] },
      { day: 7, title: "Arbitraje y especulación", topics: "Derecho, dinero y cálculo económico. Ubicuidad y principio esencial de la función empresarial. Competencia. División del conocimiento y orden extensivo de cooperación social. Creatividad versus maximización. Concepto de sociedad.", companionUrl: companionUrl(7), notebookVideos: [{ title: "Clase 07: Dualismo Metodológico y Complejidad Social | Jesús Huerta de Soto Explica a Hayek", url: "https://www.youtube.com/watch?v=-T2LkoecdP8" }] },
      { day: 8, title: "Problemas epistemológicos de las ciencias de la acción humana", topics: "Clasificación de los fenómenos por complejidad. Hipótesis de Hayek. Crítica al determinismo. Diferencias metodológicas entre ciencias naturales y sociales. Teoría e historia.", companionUrl: companionUrl(8), notebookVideos: [{ title: "Clase 08 . El Método de la Economía Política. Teoría y Praxis Económica | Jesús Huerta de Soto", url: "https://www.youtube.com/watch?v=B8kgpEEGSQE" }] },
      { day: 9, title: "Teoría e Historia", topics: "Comprensión, crítica al historicismo, economía política. Método apriorístico-deductivo. Leyes universales e individualismo metodológico. Crítica al positivismo y al criterio de falsabilidad de Popper.", companionUrl: companionUrl(9), notebookVideos: [{ title: "Clase 09. Economía Austríaca y Metodología: Desmontando Mitos Económicos. Lecciones Clave de JHS", url: "https://www.youtube.com/watch?v=tAIbD9AOzUw" }] },
      { day: 10, title: "La economía y la rebelión contra la razón", topics: "Crítica al positivismo, estadísticas y matemáticas. Racionalismo exagerado vs. racionalismo correcto. Crítica al polilogismo.", companionUrl: companionUrl(10), notebookVideos: [{ title: "Clase 10. El peligro del racionalismo exagerado y el polilogismo: Reflexiones de J. Huerta de Soto", url: "https://www.youtube.com/watch?v=OX2v4yLZD_0" }] },
      { day: 11, title: "Un primer análisis de la categoría de acción", topics: "Medios y fines. La acción en el mundo. Ley de la utilidad marginal.", companionUrl: companionUrl(11), notebookVideos: [{ title: "Clase 11. La Manipulación del Racionalismo Moderno: ¿Estamos cayendo en una trampa?. Huerta de Soto", url: "https://www.youtube.com/watch?v=q-jpJLS8Mxs" }, { title: "Clase 11 bis Lecciones de Economía con Huerta de Soto (utilidad marginal)", url: "https://www.youtube.com/watch?v=zHqgcTIaOgM" }], mindMapUrl: "https://claude.ai/code/artifact/7ac6609a-7a67-4ac8-a609-6ed438ff820d" },
    ],
  },
  {
    title: "Segunda Parte: La Acción en el Marco de la Sociedad",
    lessons: [
      { day: 12, title: "Ley del rendimiento", topics: "Productividad marginal decreciente. La sociedad humana. Ley de la división del trabajo (conocimiento) y ley de asociación de Ricardo.", companionUrl: companionUrl(12), notebookVideos: [{ title: "Clase 12. Jesús Huerta de Soto: La Ley de la Utilidad Marginal y el Secreto del Mercado Libre", url: "https://www.youtube.com/watch?v=X1aDE_k1N6k" }], mindMapUrl: "https://claude.ai/code/artifact/255381c7-c92e-457b-a932-3963f12be42e" },
    ],
  },
  {
    title: "Tercera Parte: El Cálculo Económico",
    lessons: [
      { day: 13, title: "El intercambio en la sociedad", topics: "Cambio intrapersonal e interpersonal. Intercambios voluntarios (vínculos contractuales) y coactivos (vínculos hegemónicos). Evaluación sin cálculo. Cálculo económico.", companionUrl: companionUrl(13), notebookVideos: [{ title: "Clase 13. El ERROR que destruye las economías: Cálculo Económico, Huerta de Soto lo explica.", url: "https://www.youtube.com/watch?v=RDhzBCLfMUA" }] },
    ],
  },
  {
    title: "Cuarta Parte: La Catalática o la Teoría del Mercado",
    lessons: [
      { day: 14, title: "La contabilidad", topics: "El mercado. El capital y los bienes de capital. La propaganda comercial.", companionUrl: companionUrl(14), notebookVideos: [{ title: "Clase 14. Cálculo Económico y Contabilidad: Claves para No Fracasar en Economía por Huerta de Soto", url: "https://www.youtube.com/watch?v=shhkC4oD3iI" }] },
      { day: 15, title: "La ley básica de la determinación del precio", topics: "Intercambios aislados, competencia unilateral (compradores/vendedores) y competencia bilateral.", companionUrl: companionUrl(15), notebookVideos: [{ title: "Clase 15 Huerta de Soto. Los Precios NO Se Fijan Como Crees. ¿La Mentira de la Oferta y la Demanda?", url: "https://www.youtube.com/watch?v=-x0ZEMRV9fM" }, { title: "Lecciones de Economía con Huerta de Soto - 15", url: "https://www.youtube.com/watch?v=_TaPF5PA3ek" }], mindMapUrl: "https://claude.ai/code/artifact/a5c48189-3d91-48ce-82c0-e1948381a79e" },
      { day: 16, title: "Competencia bilateral (continuación)", topics: "Crítica a la explicación funcional (matemática). Determinantes individuales del precio. La ley del coste.", companionUrl: companionUrl(16), notebookVideos: [{ title: "Clase 16. El Gran Engaño del Monopolio y la Competencia: Huerta de Soto lo Explica", url: "https://www.youtube.com/watch?v=ePhBCa0liYo" }] },
      { day: 17, title: "Los precios", topics: "Valoración y tasación, cálculo de costes, principio general de costes. Competencia y monopolio.", companionUrl: companionUrl(17), notebookVideos: [{ title: "Clase 17. La Gran Farsa del Libre Mercado. Cómo el Estado Controla la Economía. Jesús Huerta de Soto", url: "https://www.youtube.com/watch?v=1xAt0b--W-E" }] },
      { day: 18, title: "Los precios de monopolio", topics: "La ilusión del precio de monopolio.", companionUrl: companionUrl(18), notebookVideos: [{ title: "Clase 18. Dinero, Inflación, Oro y Poder: Claves para Entender la Economía Actual. Huerta de Soto", url: "https://www.youtube.com/watch?v=4QtW0_OMgJI" }] },
      { day: 19, title: "Teoría del dinero", topics: "Naturaleza y origen. El dinero como institución social por excelencia. El oro. El cambio indirecto: características y precio del dinero. Inflación, deflación y sustitutos monetarios.", companionUrl: companionUrl(19), notebookVideos: [{ title: "Clase 19. ¿Por qué el Dinero Pierde Valor? La Verdad que NADIE Explica (Lo hace Huerta de Soto)", url: "https://www.youtube.com/watch?v=LevA8RcNL_c" }] },
      { day: 20, title: "Cierre de la teoría del dinero", topics: "Efecto Cantillon y vías de inyección del dinero. Reparto uniforme vs. redistribución (el símil de la miel). Interpretación inflacionista de la historia. Definiciones de Mises sobre dinero y sustitutos monetarios. Ventajas del patrón oro y su abandono.", companionUrl: companionUrl(20), notebookVideos: [{ title: "Clase 20. Huerta de Soto desmonta el Sistema Monetario actual en clase", url: "https://www.youtube.com/watch?v=bAy9g1wy_74" }], mindMapUrl: "https://claude.ai/code/artifact/3e9e85b8-6d42-45ee-add7-f2f850a0022f" },
    ],
  },
  {
    title: "Dinero y Ciclos Económicos",
    alwaysShow: true,
    lessons: [
      { day: 21, title: "Presentación del segundo semestre", topics: "Filosofía de la enseñanza: amor, entusiasmo, claridad y constancia. Orígenes de la escuela austríaca: Carl Menger y los escolásticos de Salamanca. El proceso de mercado dinámico frente al equilibrio neoclásico. Presentación del libro Dinero, Crédito Bancario y Ciclos Económicos y hoja de ruta del curso.", companionUrl: companionUrl(21), notebookVideos: [{ title: "Clase 21. Esta clase de Huerta de Soto, cambiará tu forma de entender la economía para siempre", url: "https://www.youtube.com/watch?v=fWbsrQJ0asY" }] },
      { day: 22, title: "El discurso de Milei en Davos", topics: "Comentario al discurso de Javier Milei en el Foro de Davos. Eficiencia dinámica frente al modelo neoclásico de equilibrio. Crítica austríaca al monopolio. Los cuatro motivos de la imposibilidad del cálculo socialista. Crítica al Estado del bienestar: pensiones, sanidad, educación y subsidio de desempleo.", companionUrl: companionUrl(22), notebookVideos: [{ title: "Clase 22. El Discurso de Milei en Davos explicado por Huerta de Soto. Una defensa del Capitalismo", url: "https://www.youtube.com/watch?v=vE9o4VSh87I" }] },
      { day: 23, title: "Naturaleza jurídica del contrato de depósito irregular de dinero", topics: "Contrato de préstamo (comodato y mutuo) frente a contrato de depósito. Bienes fungibles y el tantundem. Depósito regular e irregular. Coeficiente de caja del 100% y delito de apropiación indebida. Origen romano del derecho: Ulpiano, Papiniano y el Digesto.", companionUrl: companionUrl(23), notebookVideos: [{ title: "Clase 23. Depósitos vs Préstamos: ¿Tu dinero está a salvo? Huerta de Soto te cuenta la Verdad.", url: "https://www.youtube.com/watch?v=2gf2jXGGcbA" }], mindMapUrl: "https://claude.ai/code/artifact/9f0a69b1-21e5-4e56-b48a-6fbce5a5226e" },
      { day: 24, title: "Los bancos en la historia", topics: "Bancos en Sevilla. Escuela de Salamanca. Banco de Ámsterdam. Richard Cantillon.", companionUrl: companionUrl(24), notebookVideos: [{ title: "Clase 24. El Origen del Sistema Bancario: Historia, Crisis y Pensamiento Liberal. Por Huerta de Soto", url: "https://www.youtube.com/watch?v=3eZCR0Lkrhg" }], mindMapUrl: "https://claude.ai/code/artifact/5a224d8b-5eef-465d-8ab5-e81d4eb73b54" },
      { day: 25, title: "Los bancos en la historia (continuación)", topics: "Usos de Barcelona y la banca rota. Carlos V y los banqueros de Sevilla. Escuela de Salamanca: Saravia de la Calle, Azpilcueta, Tomás de Mercado, Molina y Lugo. El depósito confesado. Banco de Ámsterdam, Banco de Suecia y Banco de Inglaterra. John Law y Richard Cantillón. Introducción al capítulo 3: intentos de fundamentación jurídica de la banca con reserva fraccionaria.", companionUrl: companionUrl(25), notebookVideos: [{ title: "Clase 25. Los Bancos crean DINERO de la Nada Y NO pasa Nada. Jesús Huerta de Soto te lo cuenta", url: "https://www.youtube.com/watch?v=QqPus4-9Wgw" }], mindMapUrl: "https://claude.ai/code/artifact/cc1fca47-49df-40aa-8cd4-3f42b0870fc2" },
      { day: 26, title: "Fundamentación jurídica de la banca con reserva fraccionaria", topics: "Los dos intentos doctrinales: identificar depósito con préstamo (Lord Cottenham, common law vs. derecho continental, art. 180 del Código de Comercio) y redefinir la disponibilidad (el «seguro» del 10%, Basilea, el debate con Juan Ramón Rayo). El banco central como director de orquesta y prestamista de última instancia. Las siete calificaciones jurídicas del depósito bancario con reserva fraccionaria.", companionUrl: companionUrl(26), notebookVideos: [{ title: "Clase 26. EL PAPEL DE LOS BANCOS CENTRALES en la Creación de DINERO | Huerta de Soto lo EXPLICA", url: "https://www.youtube.com/watch?v=3i1M9nAxQ3Y" }], mindMapUrl: "https://claude.ai/code/artifact/2099092d-0c4f-4f37-a4d7-2b65e3873cb8" },
      { day: 27, title: "La teoría del capital", topics: "Ley de la preferencia temporal. Bienes de capital y ahorro. Coordinación intertemporal. Sociedades ricas y pobres.", companionUrl: companionUrl(27), notebookVideos: [{ title: "Clase 27. La Lección Económica que DESTRUYE A KEYNES (y a los monetaristas) | Jesús Huerta de Soto", url: "https://www.youtube.com/watch?v=TdpIA28x8H0" }], mindMapUrl: "https://claude.ai/code/artifact/3e5c9e2c-9698-4632-920b-5d197baeb255" },
      { day: 28, title: "La tasa o tipo de interés", topics: "El tipo de interés como precio de mercado de los bienes presentes en función de los bienes futuros: tipo de interés natural, prima de riesgo y prima de inflación esperada. El contrato de trabajo por cuenta ajena como el principal intercambio de bienes presentes por futuros y el beneficio empresarial. Esquema de la estructura productiva de Böhm-Bawerk y Hayek. Efectos de un aumento del ahorro (disparidad de beneficios, caída del tipo de interés, efecto Ricardo) y su reverso ante un aumento del consumo. Crítica a la contabilidad nacional (renta bruta y neta) y a la paradoja keynesiana del ahorro.", companionUrl: companionUrl(28), notebookVideos: [{ title: "Clase 28. El MAYOR ERROR de la Economía Moderna (explicado por Jesús Huerta de Soto) | Editado", url: "https://www.youtube.com/watch?v=96kk7BHl1cc" }], mindMapUrl: "https://claude.ai/code/artifact/245fe57f-c87c-40ef-9e75-6f991c85431b" },
      { day: 29, title: "La estructura productiva", topics: "Renta bruta y neta. Crítica a la Contabilidad Nacional. Teoría Austriaca del Ciclo Económico (TACE): la tentación del atajo (crecer sin ahorrar), la expansión crediticia con reserva fraccionaria como sustituto artificial del ahorro genuino, y los seis efectos microeconómicos del boom y la crisis (subida del precio de los factores originarios, subida del precio de los bienes de consumo y cuellos de botella, el «efecto botellón», el efecto Ricardo invertido sobre los salarios reales, la subida de los tipos de interés, y la crisis financiera y recesión con reestructuración de la estructura productiva). La banca con reserva fraccionaria y la ley de los grandes números: por qué el riesgo de corrida bancaria no es asegurable.", companionUrl: companionUrl(29), notebookVideos: [{ title: "Clase 29. La TRAMPA del Crédito: Cómo Te Engañan para Creer que Hay Crecimiento sin Ahorro", url: "https://www.youtube.com/watch?v=W2-oWMsW9AE" }], mindMapUrl: "https://claude.ai/code/artifact/ac7c7b4e-2969-449a-a17b-826d0148b93d" },
      { day: 30, title: "Consideraciones complementarias sobre el ciclo económico", topics: "La recesión inflacionaria (estanflación) y la hiperinflación como desenlaces de la huida hacia delante. El ahorro forzoso en sus dos sentidos. La causa directa (rigidez del mercado laboral) y mediata (expansión crediticia) del desempleo. La insuficiencia de la contabilidad nacional. Deflación sana frente a deflación mala y los efectos desestabilizadores de las políticas de estabilización. Qué hacer una vez estalla la crisis.", companionUrl: companionUrl(30), notebookVideos: [{ title: "Clase 30. El Ciclo Económico como Nunca Te Lo Contaron: Clase Magistral", url: "https://www.youtube.com/watch?v=mby2I-eeqP0" }], mindMapUrl: "https://claude.ai/code/artifact/27eebba3-77b3-41e4-b560-b2413cd7e3e6" },
      { day: 31, title: "Crítica de las teorías monetarista y keynesiana", topics: "Teoría de la banca central y la banca libre.", companionUrl: companionUrl(31), notebookVideos: [{ title: "Clase 31. Jesús Huerta de Soto lo explica: por qué el Sistema Financiero está roto", url: "https://www.youtube.com/watch?v=3NHhurcmnnM" }], mindMapUrl: "https://claude.ai/code/artifact/4a493059-81e6-4d95-b9bd-1524173611a7" },
      { day: 32, title: "El precio de los factores de producción: el factor trabajo", topics: "El valor descontado de la productividad marginal (VDPM) como ley general de determinación del precio de los factores de producción: factores aislables/no aislables y específicos/no específicos. Trabajo introversivo y extroversivo. Crítica al salario mínimo, la indemnización por despido y las llamadas «conquistas sociales» (pagas extra, vacaciones, cotización a la Seguridad Social) como coste que en realidad soporta el propio trabajador. Rigidez del mercado laboral español. Refutación del relato de la explotación capitalista en la Revolución Industrial (Hutt, Hayek, Bertrand de Jouvenel) y por qué los intelectuales odian el capitalismo. Introducción a la determinación del precio del factor tierra y crítica a la teoría de la renta de Ricardo. El dogma de Montaigne y la armonía de los intereses.", companionUrl: companionUrl(32), notebookVideos: [{ title: "Clase 32. ¿Por qué te pagan lo que te pagan? La verdad que nunca te contaron del Mercado Laboral", url: "https://www.youtube.com/watch?v=0bGYodtJ9hk" }], mindMapUrl: "https://claude.ai/code/artifact/1c66443d-0b3d-45f3-b484-b822a73af3ca" },
      { day: 33, title: "Externalidades y la ley frente al mandato", topics: "Las externalidades negativas y positivas como consecuencia de la ausencia de mercado (derechos de propiedad mal definidos o mal defendidos), no como un fallo del mercado mismo: la contaminación, la tragedia de los bienes comunales, los bienes públicos y el problema del free rider o «gorrón» (el faro, el alambre de espino en el Oeste americano, la defensa privada), resueltos mediante la extensión de la propiedad privada. La Ley en sentido material (norma abstracta y general aplicable a todos por igual) frente al mandato (legislación específica de contenido concreto): orden espontáneo frente a orden jerárquico, paz frente a conflicto, la justicia tradicional frente a la «justicia social», sociedad abierta frente a sociedad cerrada.", companionUrl: companionUrl(33), notebookVideos: [{ title: "Clase 33. ¿Fallo del Mercado o fallo del Estado? Propiedad PRIVADA y Función Empresarial", url: "https://www.youtube.com/watch?v=q5nyRR3-xWo" }], mindMapUrl: "https://claude.ai/code/artifact/1db47d9d-de97-4dde-88e6-674a372c1c67" },
      { day: 34, title: "Historia y política", topics: "Beneficios de la Revolución Industrial. El odio al capitalismo. Factor tierra y datos del mercado. Externalidades.", companionUrl: companionUrl(34) },
      { day: 35, title: "Las leyes, los mandatos y el orden social", topics: "Normas abstractas vs. impulsos tribales. Sociedad abierta vs. cerrada. Libertad económica y política.", companionUrl: companionUrl(35) },
    ],
  },
  {
    title: "Quinta Parte: La Cooperación Social en Ausencia del Mercado",
    lessons: [
      { day: 36, title: "El socialismo", topics: "Definición como error intelectual. Imposibilidad del cálculo económico. Consecuencias teóricas (desorden, corrupción).", companionUrl: companionUrl(36) },
    ],
  },
  {
    title: "Sexta Parte: El Mercado Intervenido",
    lessons: [
      { day: 37, title: "Diferentes clases de socialismo", topics: "Crítica de conceptos idílicos. El mercado intervenido y la coacción sobre el consumo.", companionUrl: companionUrl(37) },
      { day: 38, title: "Conferencia fuera del programa del curso", topics: "Sesión adicional no numerada dentro del temario oficial.", companionUrl: companionUrl(38) },
      { day: 39, title: "De la corrupción", topics: "Intervencionismo fiscal y restricción de la producción (aranceles). Intervención de precios (máximos y mínimos).", companionUrl: companionUrl(39) },
    ],
  },
  {
    title: "Séptima Parte: El Lugar de la Economía en la Sociedad",
    lessons: [
      { day: 40, title: "Sindicalismo y corporativismo", topics: "Relaciones internacionales. Economía de guerra. Public Choice. Crisis de la Seguridad Social y economía española.", companionUrl: companionUrl(40) },
      { day: 41, title: "Conferencia no incluida en el programa", topics: "Sesión adicional no numerada dentro del temario oficial.", companionUrl: companionUrl(41) },
      { day: 42, title: "La Unión Europea", topics: "Teoría económica del nacionalismo y la inmigración. Historia del pensamiento económico. Crítica de la teoría de la explotación.", companionUrl: companionUrl(42) },
      { day: 43, title: "Ética y Economía Política", topics: "La teoría de los tres niveles.", companionUrl: companionUrl(43) },
    ],
  },
];

export const closingLesson = {
  title: "Clase de Clausura",
  topics: "10 Consejos para tener éxito en la vida.",
};

export type Material = {
  title: string;
  type: "pdf" | "youtube";
  note: string;
  url?: string;
};

export const courseMaterials: Material[] = [
  { title: "Curso_Internet_JHS_ebook_pro.pdf", type: "pdf", note: "Guía docente completa del curso (fuente del temario)." },
  { title: "socialismo-calculo-economico-y-funcion-empresarial.pdf", type: "pdf", note: "Artículo de referencia para la función empresarial (Días 5-9) y el socialismo (Día 36)." },
  { title: "Clase Inaugural curso 2023-2024: Economía, Filosofía Educativa y Transformación Personal. | JHS", type: "youtube", note: "Presentación motivacional del curso.", url: "https://www.youtube.com/watch?v=1hIcEcXKMiU" },
];
