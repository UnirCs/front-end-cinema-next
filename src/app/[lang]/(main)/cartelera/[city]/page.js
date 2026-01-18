// Server Component - Cartelera de cine por ciudad con i18n

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCinemasFromStore, getCinemaMoviesWithDetailsFromStoreWithLocale } from '@/lib/api-server';
import { getDictionary } from '@/lib/i18n/dictionaries';
import MoviesList from './MoviesList';
import CitySyncClient from './CitySyncClient';

export const runtime = "nodejs";

// Generar metadatos dinámicos con Open Graph
export async function generateMetadata({ params }) {
  const { city, lang } = await params;
  const dict = await getDictionary(lang);
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const title = `${cityName} - ${dict.metadata.billboard.title}`;
  const description = dict.metadata.billboard.description.replace('%city%', cityName);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale: lang,
      type: 'website',
      siteName: 'UNIR Cinema',
    },
  };
}

export default async function CarteleraPage({ params }) {
  const { city, lang } = await params;
  const dict = await getDictionary(lang);

  const cinemas = await getCinemasFromStore();
  const validCities = cinemas.map(c => c.toLowerCase());

  if (!validCities.includes(city.toLowerCase())) {
    notFound();
  }

  // Usar función con locale para obtener películas traducidas
  const movies = await getCinemaMoviesWithDetailsFromStoreWithLocale(city, lang);
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
      <CitySyncClient city={city} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-cinema-gold text-2xl font-bold">
          {dict.billboard.title} {cityName}
        </h1>

        <Link
          href={`/${lang}/cinema/${city}`}
          prefetch={false}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cinema-dark-elevated border border-cinema-border rounded-lg text-cinema-text-muted hover:text-cinema-gold hover:border-cinema-gold transition-all duration-300"
        >
          <span>ℹ️</span>
          <span>{dict.billboard.cinemaInfo}</span>
        </Link>
      </div>

      {movies.length === 0 ? (
        <div className="text-cinema-text-muted text-center py-10">
          {dict.billboard.noMovies}
        </div>
      ) : (
        <MoviesList movies={movies} city={city} lang={lang} dict={dict} />
      )}
    </div>
  );
}
