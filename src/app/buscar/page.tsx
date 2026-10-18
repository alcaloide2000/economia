import type { Metadata } from "next";
import { courseTitle } from "@/data/course";
import SearchBox from "./SearchBox";

export const metadata: Metadata = {
  title: "Buscar en las clases — Acción Humana",
};

export default function SearchPage() {
  return (
    <main>
      <div className="schedule-header">
        <a href="/" className="mindmap-link">← Temario</a>
        <h1>{courseTitle}</h1>
        <p className="schedule-subtitle">
          Buscar en las clases: encuentra en qué clase y en qué minuto se dice una palabra o frase, y dónde aparece en los mapas mentales.
        </p>
      </div>
      <SearchBox />
    </main>
  );
}
