"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import clsx from "clsx";

const languages = [
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
];

/**
 * Componente para cambiar el idioma de la aplicación.
 * Muestra banderas y permite navegar a la misma ruta en otro idioma.
 */
export default function LanguageSwitcher() {
  const { lang } = useParams();
  const pathname = usePathname();

  // Obtiene la ruta sin el prefijo del idioma actual
  const getPathWithoutLocale = () => {
    const segments = pathname.split("/");
    // Elimina el primer elemento vacío y el locale
    segments.splice(0, 2);
    return "/" + segments.join("/");
  };

  const pathWithoutLocale = getPathWithoutLocale();

  return (
    <div className="flex gap-1 items-center">
      {languages.map((language) => {
        const newPath =
          pathWithoutLocale === "/"
            ? `/${language.code}`
            : `/${language.code}${pathWithoutLocale}`;

        return (
          <Link
            key={language.code}
            href={newPath}
            prefetch={false}
            className={clsx(
              "flex items-center justify-center p-1.5 rounded-lg transition-all duration-200",
              "hover:scale-105",
              lang === language.code
                ? "bg-cinema-gold"
                : "bg-cinema-dark-elevated hover:bg-cinema-border"
            )}
            title={language.name}
          >
            <span className="text-xl leading-none">{language.flag}</span>
          </Link>
        );
      })}
    </div>
  );
}
