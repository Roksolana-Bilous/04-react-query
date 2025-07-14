import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import SearchBar from "../SearchBar/SearchBar";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import type { MoviesResponse } from "../../services/movieService";
import css from "./App.module.css";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const hasSearchQuery = query.trim() !== "";

  const { data, isPending, isError, isSuccess } = useQuery<MoviesResponse, Error>({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: hasSearchQuery,
    keepPreviousData: true,
  });

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setQuery(value);
    setPage(1);
  };

  useEffect(() => {
    if (
      hasSearchQuery &&
      data &&
      data.results.length === 0 &&
      !isPending &&
      !isError
    ) {
      toast("No movies found.");
    }
  }, [data, isPending, isError, hasSearchQuery]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      {hasSearchQuery && isPending && <Loader />}
      {hasSearchQuery && isError && <ErrorMessage />}

      {isSuccess && data.results.length > 0 && (
        <>
          <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      <Toaster position="top-right" />
    </>
  );
}
