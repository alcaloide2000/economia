import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Economía — Curso de Jesús Huerta de Soto",
  description: "Organizador del curso de Introducción a la Economía",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
