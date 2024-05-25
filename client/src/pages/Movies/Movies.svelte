<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Navbar from "../../components/Navbar.svelte";

  let movies = [];
  let searchQuery = writable(""); // bind search input

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

  onMount(fetchMovies);
</script>

<Navbar />
<div>
  <input id="search-bar" type="text" placeholder="Search movies by title" bind:value={$searchQuery} />
</div>
<div class="movies-list">
  {#each movies.filter((movie) => movie.Title.toLowerCase().includes($searchQuery.toLowerCase())) as movie}
    <div class="movie-card">
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

<style>
  #search-bar {
    margin-top: 5%;
    width: 20%;
    margin-left: 99%;
    border: 2px solid #ccc651;
    border-radius: 5px;
    background-color: #333;
    color: #bdfffd;
    box-sizing: border-box;
    padding: 10px;
  }

  .movies-list {
    margin-top: -3%;
    display: flex;
    flex-wrap: wrap;
    gap: 2%;
    justify-content: center;
  }

  .movie-card {
    background-color: #333;
    border: 2px solid #CCC651;
    border-radius: 10px;
    padding: 20px;
    width: 22%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 2%;
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
</style>
