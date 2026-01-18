'use client';

// SessionButton - Botón de sesión con variantes por formato de película
// Usa clsx para definir variantes de color según el formato (3D, HDFR, IMAX, Standard)

import Link from 'next/link';
import clsx from 'clsx';
import styles from './Pelicula.module.css';

// Clases base del botón
const base = clsx(
  'px-4 py-2 rounded-full font-semibold text-sm',
  'shadow-lg transition-all duration-300',
  'hover:-translate-y-0.5 hover:brightness-110'
);

// Variantes de color según el formato de película
const variants = {
  standard: clsx(
    'bg-gradient-to-r from-cinema-red to-cinema-red-dark',
    'text-white',
    'shadow-cinema-red/30',
    'hover:shadow-xl hover:shadow-cinema-red/50'
  ),
  '3d': clsx(
    'bg-gradient-to-r from-emerald-500 to-emerald-700',
    'text-white',
    'shadow-emerald-500/30',
    'hover:shadow-xl hover:shadow-emerald-500/50'
  ),
  hdfr: clsx(
    'bg-gradient-to-r from-violet-500 to-violet-700',
    'text-white',
    'shadow-violet-500/30',
    'hover:shadow-xl hover:shadow-violet-500/50'
  ),
  imax: clsx(
    'bg-gradient-to-r from-cyan-500 to-cyan-700',
    'text-white',
    'shadow-cyan-500/30',
    'hover:shadow-xl hover:shadow-cyan-500/50'
  ),
};

// Etiquetas de formato para mostrar junto al horario
const formatLabels = {
  standard: null,
  '3d': '3D',
  hdfr: 'HDFR',
  imax: 'IMAX',
};

/**
 * SessionButton - Botón para seleccionar una sesión de película
 *
 * @param {string} movieId - ID de la película
 * @param {string} time - Horario de la sesión
 * @param {string} format - Formato de la película: 'standard' | '3d' | 'hdfr' | 'imax'
 * @param {string} lang - Código de idioma para la URL
 * @param {string} className - Clases adicionales opcionales
 */
const SessionButton = ({
  movieId,
  time,
  format = 'standard',
  lang = 'es',
  className
}) => {
  // Normalizar el formato a minúsculas para acceder a las variantes
  const normalizedFormat = format?.toLowerCase() || 'standard';
  const variant = variants[normalizedFormat] || variants.standard;
  const label = formatLabels[normalizedFormat];

  return (
    <Link
      href={`/${lang}/movie/${movieId}/session/${time}`}
      prefetch={false}
      className={clsx(
        styles.sessionLink,
        base,
        variant,
        className
      )}
    >
      {time}
      {label && (
        <span className="ml-1.5 text-xs opacity-90 font-bold">
          {label}
        </span>
      )}
    </Link>
  );
};

// Exportar variantes para uso externo si es necesario
export const sessionVariants = variants;
export const sessionFormatLabels = formatLabels;

export default SessionButton;

