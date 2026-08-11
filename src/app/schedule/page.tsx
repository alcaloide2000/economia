import Link from "next/link";
import { courseParts, closingLesson } from "@/data/course";

export default function Schedule() {
  return (
    <main>
      <div className="schedule-header">
        <Link href="/" className="cta-link">← Volver</Link>
        <h1>Temario completo</h1>
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
                  key={lesson.day}
                >
                  <span className="day-badge">Día {lesson.day}</span>
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
