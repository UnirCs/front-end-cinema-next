import { NextResponse } from "next/server";
import { getMovieById } from "../../_store";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { idMovie } = await params;
  const movieId = parseInt(idMovie, 10);

  const movie = await getMovieById(movieId);

  if (!movie) {
    return NextResponse.json(
      { error: "Pelicula no encontrada" },
      { status: 404 }
    );
  }

  // Devolver pelicula completa con todos los campos
  return NextResponse.json({
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration_text,
    rating: movie.rating_text,
    synopsis: movie.synopsis,
    image: movie.image,
    director: movie.director,
    cast: movie.casts,
    year: movie.year
  });
}
