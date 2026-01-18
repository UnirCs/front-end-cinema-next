// Server Component - Layout raíz de la aplicación
// Este layout solo configura html y body con la fuente
// Los Providers y TranslationsProvider se configuran en [lang]/layout.js

import "./globals.css";
import { Nunito } from "next/font/google";

// Fuente principal de la aplicación - Nunito (no convencional, moderna y legible)
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata = {
  title: "UNIR Cinema - App Router",
  description: "Aplicación de cine desarrollada con Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html className={nunito.variable}>
      <body className={nunito.className}>
        {children}
      </body>
    </html>
  );
}
