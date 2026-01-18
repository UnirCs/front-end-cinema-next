// Server Component - Layout para el idioma
// Carga el diccionario y provee las traducciones a los componentes hijos

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, getLocales } from "@/lib/i18n/dictionaries";
import { TranslationsProvider } from "@/lib/i18n/TranslationsProvider";
import { Providers } from "../providers";

/**
 * Genera las rutas estáticas para cada locale en build time (SSG).
 */
export async function generateStaticParams() {
  const locales = getLocales();
  return locales.map((lang) => ({ lang }));
}

/**
 * Layout que envuelve todas las páginas con el idioma correspondiente.
 */
export default async function LangLayout({ children, params }) {
  const { lang } = await params;

  // Verificar que el locale sea válido
  if (!hasLocale(lang)) {
    notFound();
  }

  // Cargar el diccionario del idioma
  const dict = await getDictionary(lang);

  return (
    <Providers>
      <TranslationsProvider lang={lang} dict={dict}>
        {children}
      </TranslationsProvider>
    </Providers>
  );
}
