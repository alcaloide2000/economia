import Link from "next/link";
import { courseTitle, courseProfessor, courseSource, courseParts, courseMaterials } from "@/data/course";

export default function Home() {
  const totalLessons = courseParts.reduce((sum, part) => sum + part.lessons.length, 0);
  const mindMapLessons = courseParts
    .flatMap((part) => part.lessons)
    .filter((lesson) => lesson.mindMapUrl)
    .sort((a, b) => a.day - b.day);

  return (
    <main>
      <div className="hero">
        <p className="eyebrow">Universidad Rey Juan Carlos · Guía Docente al Curso por Internet</p>
        <h1>{courseTitle}</h1>
        <p className="dek">
          Profesor <strong>{courseProfessor}</strong> — {courseSource}
        </p>
        <div className="meta-pills">
          <span className="pill">{courseParts.length} partes</span>
          <span className="pill">{totalLessons} días de clase</span>
          <span className="pill">{courseMaterials.length} materiales en NotebookLM</span>
        </div>
        <Link href="/schedule" className="cta-link">Ver el temario completo →</Link>
      </div>

      <section className="mindmaps">
        <h2>Mapas mentales</h2>
        <p className="section-hint">
          Un mapa mental por clase, construido a partir de la transcripción íntegra de cada vídeo.
        </p>
        <div className="mindmap-grid">
          {mindMapLessons.map((lesson) => (
            <a
              key={lesson.day}
              href={lesson.mindMapUrl}
              target="_blank"
              rel="noreferrer"
              className="mindmap-card"
            >
              <span className="day-badge">Día {lesson.day}</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.topics}</p>
              <span className="card-cta">Ver mapa mental →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="materials">
        <h2>Materiales</h2>
        <ul className="materials-list">
          {courseMaterials.map((material) => (
            <li key={material.title}>
              {material.url ? (
                <a href={material.url} target="_blank" rel="noreferrer">
                  <strong>{material.title}</strong>
                </a>
              ) : (
                <strong>{material.title}</strong>
              )}{" "}
              — {material.note}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
