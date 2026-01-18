// Configuración de robots.txt para SEO
// Bloquea páginas internas como api, admin, login, etc.

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/*/admin',
          '/*/admin/',
          '/*/profile',
          '/*/profile/',
          '/*/auth-callback',
          '/*/auth-callback/',
          '/*/movie/*/session/',
        ],
      },
    ],
    sitemap: 'https://unir-cinema.com/sitemap.xml',
  };
}
