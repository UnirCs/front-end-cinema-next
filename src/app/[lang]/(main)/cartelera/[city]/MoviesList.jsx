// Server Component - Lista de películas con i18n

import Pelicula from '@/components/Pelicula';

export default function MoviesList({ movies, city, lang, dict }) {
  return (
    <div>
      {movies.map((movie, index) => (
        <Pelicula
          key={`${movie.id}-${index}`}
          movie={movie}
          city={city}
          lang={lang}
          dict={dict}
          priority={index < 2}
        />
      ))}
    </div>
  );
}
