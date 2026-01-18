"use client";

import { createContext, useContext, useMemo } from "react";

const I18nContext = createContext(null);

/**
 * Provider de traducciones que expone el idioma y el diccionario
 * a todos los componentes cliente hijos.
 */
export function TranslationsProvider({ lang, dict, children }) {
  const value = useMemo(() => ({ lang, dict }), [lang, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Hook para acceder al contexto de internacionalización.
 * Debe usarse dentro de TranslationsProvider.
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n debe usarse dentro de TranslationsProvider");
  }
  return ctx;
}
