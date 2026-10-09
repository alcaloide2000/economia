import { bookSummaryUrl, courseParts, courseTitle, generalMindMapUrl } from "@/data/course";

export default function Home() {
  return (
    <main>
      <div className="schedule-header">
        <h1>{courseTitle}</h1>
        <p className="schedule-subtitle">Temario completo</p>
        <a href={generalMindMapUrl} target="_blank" rel="noreferrer" className="mindmap-link general-map-link">
          Mapa general del curso →
        </a>
        <a href={bookSummaryUrl} target="_blank" rel="noreferrer" className="mindmap-link general-map-link">
          Resumen de La acción humana (Mises, 1949) →
        </a>
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
