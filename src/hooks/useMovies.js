'use client';

// Hook personalizado - Debe ser usado solo en Client Components
// - Accede al contexto global (GlobalContext)
// - Proporciona funciones y datos relacionados con películas y ciudades
// - Los datos ahora vienen de la API local (Route Handlers con cache y memoización)
// - API Base: /api/v1

import { useContext, useState, useEffect, useCallback } from 'react';
import { GlobalContext } from '@/context/GlobalContext';
import { getCinemas, getCinemaMoviesWithDetails, getMovieDetails } from '@/lib/api';

export const useMovies = () => {
  const { city, changeCity } = useContext(GlobalContext);
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar lista de cines (force-cache)
  useEffect(() => {
    const loadCinemas = async () => {
      try {
        const cinemasList = await getCinemas();
        setCinemas(cinemasList);
      } catch (err) {
        console.error('Error cargando cines:', err);
      }
    };
    loadCinemas();
  }, []);

  // Cargar películas cuando cambie la ciudad
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        // Obtiene sesiones + detalles de películas (con cache y memoización)
        const moviesData = await getCinemaMoviesWithDetails(city);
        setMovies(moviesData);
      } catch (err) {
        setError(err.message);
        console.error('Error cargando películas:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [city]);

  // Datos de ciudades (información estática del UI)
  const citiesData = {
    madrid: { name: 'Madrid' },
    barcelona: { name: 'Barcelona' },
    valencia: { name: 'Valencia' },
    sevilla: { name: 'Sevilla' }
  };

  const getCurrentCityName = () => {
    return citiesData[city]?.name || 'Madrid';
  };

  // Obtener película por ID (usa cache con revalidate hasta medianoche)
  const getMovieById = useCallback(async (id) => {
    try {
      const movie = await getMovieDetails(id);
      return movie;
    } catch (err) {
      console.error('Error obteniendo película:', err);
      return null;
    }
  }, []);

  // Buscar película en el array de películas cargadas (para uso síncrono)
  const findMovieInCache = useCallback((id) => {
    return movies.find(movie => movie.id === parseInt(id));
  }, [movies]);

  return {
    city,
    changeCity,
    movies,
    cinemas,
    citiesData,
    getCurrentCityName,
    getMovieById,
    findMovieInCache,
    loading,
    error
  };
};
