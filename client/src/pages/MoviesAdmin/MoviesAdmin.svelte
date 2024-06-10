<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Navbar from "../../components/Navbar.svelte";
  import toast from "svelte-french-toast";
  import ThemeStyle from "../../components/Theme/ThemeStyle.svelte";

  let movies = [];
  let searchQuery = writable(""); // bind search input
  let newMovieId = writable("");
  let editingMovie = writable(null); // store movie being edited
  let newTitle = writable("");
  let newYear = writable("");
  let newGenre = writable("");

  //-- *********************************** GET MOVIES *********************** --//
  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/movies");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      movies = data;
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  //-- *********************************** ADD NEW MOVIE *********************** --//
  const addMovie = async () => {
    const imdbId = $newMovieId;
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imdbId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("Movie added successfully!");
      newMovieId.set(""); // clear input field
      fetchMovies(); // refresh movie list
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  //-- *********************************** UPDATE MOVIES *********************** --//
  const updateMovie = async () => {
    try {
      const title = $editingMovie.Title;
      const response = await fetch(`/api/movies/${title}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newTitle: $newTitle,
          newYear: $newYear,
          newGenre: $newGenre,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      editingMovie.set(null);  // reset editing movie
      fetchMovies(); // refresh movies list
    } catch(error) {
      console.error("Error updating movie:", error);
    }
  };

  //-- *********************************** EDIT MOVIES *********************** --//
  const editMovie = (movie) => {
    editingMovie.set(movie);
    newTitle.set(movie.Title);
    newYear.set(movie.Year);
    newGenre.set(movie.Genre);
  };

  //-- *********************************** CANCEL EDIT MOVIES *********************** --//
  const cancelEdit = () => {
    editingMovie.set(null);
    newTitle.set("");
    newYear.set("");
    newGenre.set("");
  };

  //-- *********************************** DELETE MOVIES *********************** --//
  const deleteMovie = async (title) => {
    try {
      const response = await fetch(`/api/movies/${encodeURIComponent(title)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchMovies(); // Refresh movie list
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  onMount(fetchMovies);
</script>

<Navbar />
<ThemeStyle />

<!-- *********************************** SEARCH BAR *********************** -->
<div>
  <input
    id="search-bar"
    type="text"
    placeholder="Search movies by title"
    bind:value={$searchQuery}
  />
</div>

<!-- *********************************** ADD MOVIE *********************** -->
<div>
  <input
    id="add-movie-input"
    type="text"
    placeholder="Enter IMDB ID"
    bind:value={$newMovieId}
  />
  <button id="add-movie-button" on:click={addMovie}>Add Movie</button>
</div>

<!-- *********************************** ALL MOVIES *********************** -->
<div class="movies-list">
  <!-- *********************************** FILTER MOVIE ON SEARCH *********************** -->
  {#each movies.filter( (movie) => movie.Title?.toLowerCase().includes($searchQuery.toLowerCase())) as movie}
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
        <p class="rate"><strong>Rating:</strong> {movie.imdbRating}</p>
      </div>

      <!-- *********************************** EDIT MOVIE FORM *********************** -->
      {#if $editingMovie && $editingMovie.Title === movie.Title}
        <div class="edit-form">
          <input type="text" bind:value={$newTitle} placeholder="Title" />
          <input type="text" bind:value={$newYear} placeholder="Year" />
          <input type="text" bind:value={$newGenre} placeholder="Genre" />
          <div class="button-container">
            <button class="cancel-button" on:click={cancelEdit}>Cancel</button>
            <button class="save-button" on:click={updateMovie}>Save</button>
          </div>
        </div>
      {:else}
        <div class="actions">
          <!-- *********************************** EDIT MOVIE BUTTON *********************** -->
          <button class="edit-button" on:click={() => editMovie(movie)}>Edit</button>
          <!-- *********************************** DELETE MOVIE BUTTON *********************** -->
          <button class="delete-button" on:click={() => deleteMovie(movie.Title)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
            >
              <path
                d="M3 6l3 16.125A2.978 2.978 0 0 0 8.963 24h6.074a2.978 2.978 0 0 0 2.963-1.875L21 6H3zM14 3V2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v1H5v2h14V3h-5zM10 2h4v1h-4V2zm1 7h2v10h-2V9zm-4 0h2v10H7V9zm10 0h-2v10h2V9z"
              />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  /*-- *********************************** SEARCH BAR, ADD MOVIE INPUT + BUTTON *********************** --*/
  #search-bar,
  #add-movie-input {
    margin-left: 99%;
    border: 2px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--background-color);
    color: var(--text-color);
    box-sizing: border-box;
    padding: 10px;
  }

  #add-movie-button {
    margin-left: 99%;
    border: 2px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--button-color);
    color: var(--text-color);
    box-sizing: border-box;
    padding: 10px;
  }

  #add-movie-input,
  #add-movie-button {
    margin-top: 1%;
  }
  
  #search-bar {
    margin-top: 7%;
    width: 20%;
  }

  #add-movie-input {
    width: 15%;
  }

  #add-movie-button {
    width: 10%;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  #add-movie-button:hover {
    background-color: var(--button-hover-color);
    color: var(--text-color-mode);
  }

  /*-- *********************************** MOVIE *********************** --*/
  .movies-list {
    margin-top: -11.7%;
    display: flex;
    flex-wrap: wrap;
    gap: 2%;
    justify-content: center;
  }

  .movie-card {
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

  .actions {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .edit-button,
  .save-button,
  .cancel-button {
    width: 30%;
    padding: 10px;
    background-color: var(--button-color);
    border: none;
    border-radius: 5px;
    color: var(--text-color);
    font-size: 16px;
    cursor: pointer; 
  }

  .edit-button:hover,
  .save-button:hover,
  .cancel-button:hover {
    background-color: var(--button-hover-color);
    color: var(--text-color-mode);
  }

  .delete-button {
    background-color: var(--delete-button-color);
    border: none;
    padding: 7px 15px;
    cursor: pointer;
    border-radius: 4px;
  }

  .delete-button:hover {
    background-color: var(--delete-button-hover-color);
  }

  /*-- *********************************** EDIT FORM *********************** --*/
  .edit-form {
    display: flex;
    flex-direction: column;
  }

  .edit-form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 2px solid var(--border-color);
    border-radius: 5px;
    background-color: var(--background-color);
    color: var(--text-color);
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 5px;
    gap: 2%;
    
  }

  .actions {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 2%;
  }
</style>
