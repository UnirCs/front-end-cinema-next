import "server-only";

const locales = ["es", "en", "fr"];
const defaultLocale = "es";

const dictionaries = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
};

export function getLocales() {
  return locales;
}

export function getDefaultLocale() {
  return defaultLocale;
}

export function hasLocale(locale) {
  return Object.prototype.hasOwnProperty.call(dictionaries, locale);
}

export async function getDictionary(locale) {
  if (!hasLocale(locale)) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
}
