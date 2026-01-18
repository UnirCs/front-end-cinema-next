'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/app/api/v1/_db';

/**
 * Server Action para invalidar toda la cache de la aplicacion
 *
 * revalidatePath('/') con el segundo parametro 'layout' invalida
 * toda la cache desde la raiz, incluyendo todos los datos cacheados.
 */
export async function invalidateAllCache() {
  console.log('[SERVER ACTION] Invalidando toda la cache...');

  // Invalida toda la cache desde la raiz
  revalidatePath('/', 'layout');

  console.log('[SERVER ACTION] Cache invalidada correctamente');

  return { success: true, timestamp: new Date().toISOString() };
}

/**
 * Server Action para actualizar todas las fechas de screenings al dia actual
 *
 * Util cuando los datos seed tienen fechas antiguas y queremos que
 * las sesiones aparezcan en la cartelera de hoy.
 */
export async function updateScreeningsToToday() {
  console.log('[SERVER ACTION] Actualizando fechas de screenings...');

  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  try {
    const result = await query(
      `UPDATE screenings SET show_date = $1`,
      [today]
    );

    console.log(`[SERVER ACTION] ${result.rowCount} screenings actualizados a ${today}`);

    // Invalidar cache para que se reflejen los cambios
    revalidatePath('/', 'layout');

    return {
      success: true,
      updatedCount: result.rowCount,
      newDate: today,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('[SERVER ACTION] Error al actualizar screenings:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

