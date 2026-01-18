// Server Component - Pagina de seleccion de asientos con i18n

import { notFound } from 'next/navigation';
import { getMovieDetailsFromStoreWithLocale, getScreeningFromStore } from '@/lib/api-server';
import { getDictionary } from '@/lib/i18n/dictionaries';
import SeatSelectionClient from './SeatSelectionClient';

export const runtime = "nodejs";

const DEFAULT_CITY = 'Madrid';

// Generar metadatos dinámicos con Open Graph
export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const title = dict.metadata.session.title;

  return {
    title,
    openGraph: {
      title,
      locale: lang,
      type: 'website',
      siteName: 'UNIR Cinema',
    },
  };
}


export default async function SessionPage({ params, searchParams }) {
  const { id, time, lang } = await params;
  const { city = DEFAULT_CITY } = await searchParams;
  const decodedTime = decodeURIComponent(time);
  const dict = await getDictionary(lang);

  // Usar función con locale para obtener película traducida
  const movie = await getMovieDetailsFromStoreWithLocale(id, lang);

  if (!movie) {
    notFound();
  }

  const screening = await getScreeningFromStore(id, city, decodedTime);

  return (
    <SeatSelectionClient
      movie={movie}
      time={time}
      screeningId={screening?.id || null}
      screeningPrice={screening?.basePrice || 12}
      lang={lang}
      dict={dict}
    />
  );
}
