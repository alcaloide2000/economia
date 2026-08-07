import Link from "next/link";
import { courseTitle, courseProfessor, courseSource, courseParts, courseMaterials } from "@/data/course";

export default function Home() {
  const totalLessons = courseParts.reduce((sum, part) => sum + part.lessons.length, 0);

  return (
    <main>
      <h1>{courseTitle}</h1>
      <p>
        Profesor <strong>{courseProfessor}</strong> — {courseSource}
      </p>
      <p>
        {courseParts.length} partes · {totalLessons} días de clase · {courseMaterials.length} materiales en NotebookLM
      </p>
      <p>
        <Link href="/schedule">Ver el temario completo →</Link>
      </p>

      <h2>Materiales</h2>
      <ul>
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
    </main>
  );
}
