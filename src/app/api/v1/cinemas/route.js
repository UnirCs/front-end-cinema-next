import { NextResponse } from "next/server";
import { getCinemas } from "../_store";

export const runtime = "nodejs";

export async function GET() {
  const cinemas = await getCinemas();
  // Devolver solo los nombres de ciudad para mantener compatibilidad
  const cinemaNames = cinemas.map((c) => c.city);
  return NextResponse.json(cinemaNames);
}
