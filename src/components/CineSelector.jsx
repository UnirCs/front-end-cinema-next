'use client';

// Client Component - Selector de ciudad/cine:
// - Usa el hook useMovies que obtiene la lista de cines de la API
// - Lista de cines cacheada con force-cache (casi nunca cambia)
// - API Endpoint: GET /api/v1/cinemas

import clsx from 'clsx';
import { useMovies } from '@/hooks/useMovies';

const CineSelector = () => {
  const { city, changeCity, cinemas } = useMovies();

  // Transformar array de nombres a opciones del select
  const cities = cinemas.length > 0
    ? cinemas.map(name => ({
        value: name.toLowerCase(),
        label: name
      }))
    : [
        { value: 'madrid', label: 'Madrid' },
        { value: 'barcelona', label: 'Barcelona' },
        { value: 'valencia', label: 'Valencia' },
        { value: 'sevilla', label: 'Sevilla' }
      ];

  return (
    <div className={clsx(
      'mb-10 bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
      'p-6 rounded-xl shadow-lg shadow-black/40',
      'border border-cinema-border',
      'flex flex-wrap items-center gap-4'
    )}>
      <label htmlFor="city-select" className="font-semibold text-cinema-gold text-lg">
        🎬 Selecciona tu ciudad:
      </label>
      <select
        id="city-select"
        value={city}
        onChange={(e) => changeCity(e.target.value)}
        className={clsx(
          'flex-1 min-w-[200px] max-w-xs p-3 rounded-lg',
          'border-2 border-cinema-border bg-cinema-dark-elevated text-cinema-text',
          'cursor-pointer transition-all duration-300',
          'hover:border-cinema-gold',
          'focus:border-cinema-gold focus:outline-none focus:ring-2 focus:ring-cinema-gold/20'
        )}
      >
        {cities.map((cityOption) => (
          <option key={cityOption.value} value={cityOption.value} className="bg-cinema-dark-elevated">
            {cityOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CineSelector;
