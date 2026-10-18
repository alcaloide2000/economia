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
          Buscar en las clases: encuentra la clase y el minuto en que se dice una palabra o frase.
        </p>
      </div>
      <SearchBox />
    </main>
  );
}
