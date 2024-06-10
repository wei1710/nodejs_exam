<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import Navbar from "../../components/Navbar.svelte";
  import MovieDetail from "../../components/Movies/MovieDetail.svelte";
  import { selectedMovie } from "../../stores/store.js";
  import ThemeStyle from "../../components/Theme/ThemeStyle.svelte";

  let movies = [];
  let searchQuery = writable(""); // bind search input

  //-- *********************************** GET ALL MOVIES *********************** --//
  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/movies");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.text}`);
      }

      const data = await response.json();
      movies = data;
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  const selectMovie = (movie) => {
    selectedMovie.set(movie);
  };

  $: {
    if ($selectedMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  onMount(fetchMovies);

  onDestroy(() => {
    document.body.style.overflow = "auto";
  });
</script>

<Navbar />
<ThemeStyle />

<!-- *********************************** SEARCH BAR *********************** --> 
<div>
  <input id="search-bar" type="text" placeholder="Search movies by title" bind:value={$searchQuery} />
</div>

<!-- *********************************** ALL MOVIES *********************** --> 
<div class="movies-list">
  <!-- *********************************** FILTER MOVIE ON SEARCH *********************** -->
  {#each movies.filter((movie) => movie.Title?.toLowerCase().includes($searchQuery.toLowerCase())) as movie}
    <div class="movie-card">
      <button class="overlay-button" on:click={() => selectMovie(movie)}></button>
      <div class="movie-title">
        <h2>{movie.Title}</h2>
      </div>

      <div class="image-container">
        <img src={movie.Poster} alt={`Poster of ${movie.Title}`} />
      </div>

      <div class="movie-info">
        <p><strong>Year:</strong> {movie.Year}</p>
        <p class="genre"><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Rating:</strong> {movie.imdbRating}</p>
      </div>
    </div>
  {/each}
</div>

<MovieDetail />

<style>
  /* --*********************************** SEARCH BAR *********************** --*/
  #search-bar {
    margin-top: 7%;
    width: 20%;
    margin-left: 99%;
    border: 2px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--background-color);
    color: var(--text-color);
    box-sizing: border-box;
    padding: 10px;
  }

  /*-- *********************************** MOVIE *********************** --*/
  .movies-list {
    margin-top: -3.3%;
    display: flex;
    flex-wrap: wrap;
    gap: 2%;
    justify-content: center;
  }

  .movie-card {
    position: relative;
    background-color: var(--background-color);
    border: 2px solid var(--border-color);
    border-radius: 10px;
    padding: 20px;
    width: 22%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 2%;
    transition: ease-in-out 0.2s;
    cursor: pointer;
  }

  .movie-card:hover {
    transform: scale(1.05);
  }

  .movie-card img {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
  }

  .movie-title {
    height: 3em;
    overflow: hidden;
  }

  .movie-title h2 {
    margin: 0;
    font-size: 1.2em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .movie-card p {
    margin: 0.5em 0;
  }

  .genre {
    height: 2.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .overlay-button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 1;
  }
</style>
