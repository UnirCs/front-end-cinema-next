import { NextResponse } from "next/server";
import { getCinemaMoviesToday } from "../../../_store";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { cinema } = await params;

  const movies = await getCinemaMoviesToday(cinema);

  if (movies === null) {
    return NextResponse.json(
      { error: "Cine no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(movies);
}
