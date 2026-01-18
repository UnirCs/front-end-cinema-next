'use client';

// Client Component - Detalles de película con i18n

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

export default function MovieDetailsClient({ movie, city, lang, dict }) {
  const router = useRouter();

  const infoCardClasses = clsx(
    'bg-cinema-dark-elevated p-3 rounded-lg text-center',
    'border border-cinema-border',
    'hover:border-cinema-gold transition-colors'
  );

  const backButtonClasses = clsx(
    'mb-6 bg-gradient-to-r from-cinema-gold to-cinema-gold-dark',
    'text-cinema-dark px-5 py-2 rounded-lg font-bold',
    'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50',
    'transition-all duration-300'
  );

  const sessionLinkClasses = clsx(
    'px-5 py-2 bg-gradient-to-r from-cinema-red to-cinema-red-dark',
    'text-white rounded-full font-semibold',
    'shadow-lg shadow-cinema-red/30',
    'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cinema-red/50 hover:brightness-110',
    'transition-all duration-300'
  );

  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className={clsx(
      'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
      'p-6 md:p-8 rounded-2xl shadow-lg border border-cinema-border',
      'max-w-5xl mx-auto my-8'
    )}>
      <button onClick={() => router.back()} className={backButtonClasses}>
        {dict.movie.back}
      </button>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className={clsx(
          'relative w-full md:w-[300px] md:min-w-[300px] h-[400px] md:h-[450px]',
          'rounded-xl overflow-hidden shadow-lg',
          'border-2 border-cinema-border flex-shrink-0'
        )}>
          <Image
            src="/film-poster.jpg"
            alt={`Poster de ${movie.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            priority
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-cinema-gold text-3xl md:text-4xl font-bold mb-4 pb-4 border-b-4 border-cinema-red">
            {movie.title}
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              { label: dict.movie.genre, value: movie.genre },
              { label: dict.movie.duration, value: movie.duration },
              { label: dict.movie.rating, value: `⭐ ${movie.rating}` },
              { label: dict.movie.year, value: movie.year },
              { label: dict.movie.director, value: movie.director },
            ].map((item) => (
              <div key={item.label} className={infoCardClasses}>
                <strong className="text-cinema-gold text-sm block mb-1">{item.label}</strong>
                <span className="text-cinema-text-muted text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mb-6">
        <h3 className="text-cinema-gold text-xl font-bold mb-2">{dict.movie.cast}:</h3>
        <p className="text-cinema-text-muted leading-relaxed">{movie.cast?.join(', ')}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-cinema-gold text-xl font-bold mb-2">{dict.movie.synopsis}:</h3>
        <p className="text-cinema-text-muted leading-relaxed">{movie.synopsis}</p>
      </section>

      <section className="pt-6 border-t border-cinema-border">
        <h3 className="text-cinema-gold text-xl font-bold mb-4">
          {dict.movie.showtimes} {cityName}:
        </h3>
        {movie.showtimes?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {movie.showtimes.map((time, index) => (
              <Link
                key={index}
                href={`/${lang}/movie/${movie.id}/session/${time}?city=${city}`}
                prefetch={false}
                className={sessionLinkClasses}
              >
                {time}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-cinema-text-muted">{dict.movie.noShowtimes} {cityName}</p>
        )}
      </section>
    </div>
  );
}
