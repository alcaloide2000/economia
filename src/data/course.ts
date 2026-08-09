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
      { day: 21, title: "Naturaleza jurídica del contrato de depósito irregular de dinero", topics: "Diferencia entre préstamo y depósito. Cosas fungibles.", companionUrl: companionUrl(21) },
      { day: 22, title: "El depósito irregular y el préstamo", topics: "Diferencias esenciales entre depósito irregular y préstamo. Derecho de propiedad y disponibilidad.", companionUrl: companionUrl(22) },
      { day: 23, title: "El depósito irregular a lo largo de la historia", topics: "Grecia, Roma, Templarios, Médicis.", companionUrl: companionUrl(23) },
      { day: 24, title: "Los bancos en la historia", topics: "Bancos en Sevilla. Escuela de Salamanca. Banco de Ámsterdam. Richard Cantillon.", companionUrl: companionUrl(24) },
      { day: 25, title: "Fundamentación jurídica de la banca con reserva fraccionaria", topics: "Intentos de fundamentación. Redefinición de disponibilidad. Hayek vs. Keynes.", companionUrl: companionUrl(25) },
      { day: 26, title: "El proceso bancario de expansión crediticia", topics: "Sistemas de contabilización. Multiplicador bancario y contracción crediticia.", companionUrl: companionUrl(26) },
      { day: 27, title: "La teoría del capital", topics: "Ley de la preferencia temporal. Bienes de capital y ahorro. Coordinación intertemporal. Sociedades ricas y pobres.", companionUrl: companionUrl(27) },
      { day: 28, title: "La tasa o tipo de interés", topics: "Contrato de trabajo y beneficio contable. Coordinación intertemporal.", companionUrl: companionUrl(28) },
      { day: 29, title: "La estructura productiva", topics: "Renta bruta y neta. Crítica a la Contabilidad Nacional. Teoría Austriaca del Ciclo Económico (TACE).", companionUrl: companionUrl(29) },
      { day: 30, title: "Consideraciones complementarias sobre el ciclo económico", topics: "Estanflación e hiperinflación. Ahorro forzoso y desempleo masivo.", companionUrl: companionUrl(30) },
      { day: 31, title: "Crítica de las teorías monetarista y keynesiana", topics: "Teoría de la banca central y la banca libre.", companionUrl: companionUrl(31) },
      { day: 32, title: "Propuesta de reforma bancaria", topics: "Coeficiente de caja del 100%.", companionUrl: companionUrl(32) },
      { day: 33, title: "El precio de los factores de producción", topics: "Imputación (VDPM). Trabajo y salarios. Crítica a la legislación laboral y \"conquistas sociales\".", companionUrl: companionUrl(33) },
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
