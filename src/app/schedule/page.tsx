import Link from "next/link";
import { courseParts, closingLesson } from "@/data/course";

export default function Schedule() {
  return (
    <main>
      <p>
        <Link href="/">← Volver</Link>
      </p>
      <h1>Temario completo</h1>

      {courseParts.map((part) => {
        const lessons = part.lessons.filter((lesson) => lesson.notebookVideos && lesson.notebookVideos.length > 0);
        if (lessons.length === 0) return null;

        return (
          <section className="part" key={part.title}>
            <h2>{part.title}</h2>
            {lessons.map((lesson) => (
              <div className="lesson" key={lesson.day}>
                <h3>Día {lesson.day}: {lesson.title}</h3>
                <p>{lesson.topics}</p>
                {lesson.notebookVideos?.map((video) => (
                  <p key={video.title}>
                    {video.url ? (
                      <a href={video.url} target="_blank" rel="noreferrer">
                        ▶ {video.title}
                      </a>
                    ) : (
                      <>▶ {video.title} (enlace no verificado)</>
                    )}
                  </p>
                ))}
                {lesson.mindMapUrl && (
                  <a href={lesson.mindMapUrl} target="_blank" rel="noreferrer">
                    🧠 Mapa mental →
                  </a>
                )}
              </div>
            ))}
          </section>
        );
      })}
    </main>
  );
}
