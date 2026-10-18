import {
  bastiatMindMapUrl,
  bastiatSummaryUrl,
  bookMindMapUrl,
  bookSummaryUrl,
  courseParts,
  courseTitle,
  generalMindMapUrl,
  ricardoMindMapUrl,
  ricardoSummaryUrl,
  smithMindMapUrl,
  smithSummaryUrl,
} from "@/data/course";

export default function Home() {
  return (
    <main>
      <div className="schedule-header">
        <h1>{courseTitle}</h1>
        <p className="schedule-subtitle">Temario completo</p>
        <nav className="header-links">
          <a href={generalMindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Mapa general del curso →
          </a>
          <a href={bookSummaryUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Resumen de La acción humana (Mises, 1949) →
          </a>
          <a href={bookMindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Mapa mental del libro →
          </a>
          <a href={bastiatSummaryUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Resumen de Lo que se ve y lo que no se ve (Bastiat, 1850) →
          </a>
          <a href={bastiatMindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Mapa mental del ensayo →
          </a>
          <a href={ricardoSummaryUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Resumen de los Principios de economía política (Ricardo, 1817) →
          </a>
          <a href={ricardoMindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Mapa mental de los Principios →
          </a>
          <a href={smithSummaryUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Resumen de La riqueza de las naciones (Smith, 1776) →
          </a>
          <a href={smithMindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link">
            Mapa mental de La riqueza de las naciones →
          </a>
          <a href="/buscar" className="mindmap-link">
            Buscar en las clases →
          </a>
        </nav>
      </div>

      {courseParts.map((part) => {
        const lessons = part.lessons.filter((lesson) => lesson.notebookVideos && lesson.notebookVideos.length > 0);
        if (lessons.length === 0 && !part.alwaysShow) return null;

        return (
          <section className="part" key={part.title}>
            <h2>{part.title}</h2>
            <div className="lesson-list">
              {lessons.map((lesson) => (
                <article
                  className={`lesson-card${lesson.mindMapUrl ? " has-mindmap" : ""}`}
                  key={lesson.dayLabel ?? lesson.day}
                >
                  <span className="day-badge">Día {lesson.dayLabel ?? lesson.day}</span>
                  <h3>{lesson.title}</h3>
                  <p className="topics">{lesson.topics}</p>
                  <div className="lesson-links">
                    {lesson.notebookVideos?.map((video) => (
                      video.url ? (
                        <a key={video.title} href={video.url} target="_blank" rel="noreferrer" className="video-link">
                          ▶ {video.title}
                        </a>
                      ) : (
                        <span key={video.title} className="video-link">▶ {video.title} (enlace no verificado)</span>
                      )
                    ))}
                    {lesson.mindMapUrl && (
                      <a href={lesson.mindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link">
                        Mapa mental →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
