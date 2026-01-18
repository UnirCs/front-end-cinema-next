// Sitemap dinámico para SEO
// Solo incluye landing page e idiomas y carteleras por ciudad

import { getLocales } from '@/lib/i18n/dictionaries';

const BASE_URL = 'https://unir-cinema.com';

// Ciudades disponibles
const cities = ['madrid', 'barcelona', 'valencia', 'sevilla'];

export default function sitemap() {
  const locales = getLocales();
  const urls = [];

  // Landing page para cada idioma
  locales.forEach((lang) => {
    urls.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}`])
        ),
      },
    });
  });

  // Carteleras por ciudad para cada idioma
  locales.forEach((lang) => {
    cities.forEach((city) => {
      urls.push({
        url: `${BASE_URL}/${lang}/cartelera/${city}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/cartelera/${city}`])
          ),
        },
      });
    });
  });

  return urls;
}
