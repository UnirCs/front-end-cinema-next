import { NextResponse } from "next/server";
import { listMovies } from "../_store";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rating = searchParams.get("rating");

  const movies = await listMovies();

  if (rating === "top") {
    // Devolver peliculas ordenadas por rating (formato resumido)
    const topMovies = movies
      .map((movie) => ({
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        duration: movie.duration_text,
        rating: Number(movie.rating_value),
        poster: movie.image,
        director: movie.director,
        year: movie.year
      }))
      .sort((a, b) => b.rating - a.rating);

    //Return only top 3 movies

    return NextResponse.json(topMovies.splice(0, 3));
  }

  // Sin filtro, devolver todas las peliculas en formato resumido
  const allMovies = movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration_text,
    rating: Number(movie.rating_value),
    poster: movie.image,
    director: movie.director,
    year: movie.year
  }));

  return NextResponse.json(allMovies);
}
