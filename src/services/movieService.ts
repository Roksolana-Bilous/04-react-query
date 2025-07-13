import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string): Promise<Movie[]> {
  const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

  const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  const response = await axios.get<MoviesHttpResponse>(BASE_URL, {
    params: { query },
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return response.data.results;
}