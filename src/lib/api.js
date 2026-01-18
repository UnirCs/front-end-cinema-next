/**
 * API Service con estrategias de cache de Next.js
 *
 * IMPORTANTE: Estas opciones de cache SOLO funcionan en Server Components.
 *
 * Estrategias de caching demostradas:
 * - force-cache: Cachea la respuesta indefinidamente (hasta rebuild)
 * - revalidate: Cachea con revalidacion por tiempo (ISR a nivel de fetch)
 * - tags: Permite invalidar cache selectivamente con revalidateTag()
 * - Memoizacion automatica: Next.js deduplica peticiones durante un render
 *
 * NOTA IMPORTANTE sobre ISR vs Cache de datos:
 * - ISR real: Se configura con `export const revalidate = X` en la pagina
 *   y regenera el HTML estatico completo.
 * - Cache de datos: Se configura en cada fetch con `next: { revalidate: X }`
 *   y solo cachea los datos de esa peticion especifica.
 *
 * NOTA: Para funciones que acceden directamente a la base de datos,
 * usar api-server.js (solo en Server Components).
 */

const API_BASE_URL = '/api/v1';

// Flag para habilitar/deshabilitar logs de depuracion
const DEBUG_CACHE = true;

function log(message) {
  if (DEBUG_CACHE) {
    console.log(`[API] ${message}`);
  }
}

/**
 * Obtiene metricas globales del cine
 *
 * Esta funcion se usa en paginas con ISR real (export const revalidate)
 * No necesita configuracion de cache propia porque la pagina controla la revalidacion
 */
export async function getMetrics() {
  const start = Date.now();

  const response = await fetch(`${API_BASE_URL}/metrics`);

  const duration = Date.now() - start;
  const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
  log(`GET /metrics - ${duration}ms [${cacheStatus}]`);

  if (!response.ok) {
    throw new Error('Error al obtener metricas');
  }

  return response.json();
}

/**
 * Obtiene las peliculas mejor valoradas
 *
 * Estrategia: Cache de datos con revalidate de 30 segundos
 * NOTA: Este es un ejemplo de cache a nivel de fetch, NO ISR real.
 * La diferencia es que solo se cachean estos datos especificos,
 * no se regenera toda la pagina.
 */
export async function getTopMovies() {
  const start = Date.now();

  try {
    const response = await fetch(`${API_BASE_URL}/movies?rating=top`, {
      next: {
        revalidate: 30, // Cache de datos: revalidar cada 30 segundos
        tags: ['top-movies']
      }
    });

    const duration = Date.now() - start;
    const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
    log(`GET /movies?rating=top - ${duration}ms [${cacheStatus}]`);

    if (!response.ok) {
      throw new Error('Error al obtener peliculas top');
    }

    return response.json();
  } catch (error) {
    log(`GET /movies?rating=top - ERROR: ${error.message}`);
    // Devolver valores por defecto si la API falla
    return [
      {
        id: 1,
        title: "Interstellar",
        genre: "Ciencia Ficcion",
        duration: "169 min",
        rating: 4.9,
        poster: "/film-poster.jpg"
      },
      {
        id: 2,
        title: "El Padrino",
        genre: "Drama",
        duration: "175 min",
        rating: 4.8,
        poster: "/film-poster.jpg"
      },
      {
        id: 3,
        title: "Pulp Fiction",
        genre: "Crimen",
        duration: "154 min",
        rating: 4.7,
        poster: "/film-poster.jpg"
      }
    ];
  }
}

/**
 * Obtiene la lista de cines disponibles
 *
 * Estrategia: force-cache (cache permanente)
 */
export async function getCinemas() {
  const start = Date.now();

  const response = await fetch(`${API_BASE_URL}/cinemas`, {
    cache: 'force-cache',
    next: {
      tags: ['cinemas']
    }
  });

  const duration = Date.now() - start;
  // Cache HIT: ~0-10ms | Cache MISS: ~100-500ms | Memoizado: ~0ms
  const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
  log(`GET /cinemas - ${duration}ms [${cacheStatus}]`);

  if (!response.ok) {
    throw new Error('Error al obtener la lista de cines');
  }

  return response.json();
}

/**
 * Obtiene los detalles de una pelicula especifica
 *
 * Estrategia: revalidate cada 30 segundos (ISR)
 *
 * IMPORTANTE: Usamos un valor FIJO para que la memoizacion funcione.
 * Si usaramos un valor dinamico (como secondsUntilMidnight), las opciones
 * del fetch serian diferentes en cada llamada y Next.js no podria memoizar.
 */
export async function getMovieDetails(movieId) {
  const start = Date.now();

  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    next: {
      revalidate: 10, // valor fijo para permitir memoizacion - juega con este valor para ver diferencias
      tags: ['movies', `movie-${movieId}`]
    }
  });

  const duration = Date.now() - start;
  const cacheStatus = duration < 15 ? 'HIT/MEMO' : 'MISS';

  // Parsear respuesta para ver cuando se genero
  const data = await response.json();

  // Si la API devuelve timestamp, lo mostramos. Si no, al menos vemos el tiempo.
  const now = new Date().toLocaleTimeString();
  log(`GET /movies/${movieId} - ${duration}ms [${cacheStatus}] @ ${now}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Error al obtener la pelicula ${movieId}`);
  }

  return data;
}

/**
 * Obtiene las sesiones de peliculas para un cine especifico
 *
 * Estrategia: revalidate cada 15 segundos
 */
export async function getCinemaMovieSessions(cinemaId) {
  const start = Date.now();

  const response = await fetch(`${API_BASE_URL}/cinemas/${cinemaId}/movies`, {
    next: {
      revalidate: 15, // ISR: revalidar cada 15 segundos
      tags: ['sessions', `cinema-${cinemaId}-sessions`]
    }
  });

  const duration = Date.now() - start;
  // Cache HIT: ~0-10ms | Cache MISS: ~100-500ms | Memoizado: ~0ms
  const cacheStatus = duration < 15 ? 'HIT' : 'MISS';
  log(`GET /cinemas/${cinemaId}/movies - ${duration}ms [${cacheStatus}]`);

  if (!response.ok) {
    throw new Error(`Error al obtener sesiones del cine ${cinemaId}`);
  }

  return response.json();
}

/**
 * Obtiene los datos completos de peliculas para un cine
 *
 * Combina datos de sesiones + detalles de cada pelicula.
 *
 * MEMOIZACION: Usamos un bucle secuencial (for...of) en lugar de Promise.all
 * para que Next.js pueda memoizar las llamadas duplicadas. Cuando la primera
 * llamada a getMovieDetails(4) termina, la segunda llamada con el mismo ID
 * sera servida desde la memoizacion (~0ms).
 *
 * NOTA: Esto es PEOR para performance (peticiones secuenciales vs paralelas),
 * pero permite demostrar como funciona la memoizacion de Next.js.
 */
export async function getCinemaMoviesWithDetails(cinemaId) {
  log(`getCinemaMoviesWithDetails("${cinemaId}")`);

  const sessions = await getCinemaMovieSessions(cinemaId);

  // Mostrar IDs para ver donde aplica memoizacion
  const ids = sessions.map(s => s.id);
  const uniqueIds = [...new Set(ids)];
  if (ids.length !== uniqueIds.length) {
    log(`MEMOIZACION ESPERADA: ${ids.length} sesiones, ${uniqueIds.length} IDs unicos - ${ids.length - uniqueIds.length} llamadas memoizadas`);
  }

  // Bucle secuencial para permitir memoizacion
  const moviesWithDetails = [];
  for (const session of sessions) {
    const movieDetails = await getMovieDetails(session.id);

    if (movieDetails) {
      moviesWithDetails.push({
        ...movieDetails,
        showtimes: session.showtimes,
        format: session.format
      });
    }
  }

  return moviesWithDetails;
}

