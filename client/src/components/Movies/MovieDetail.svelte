<script>
  import { selectedMovie } from "../../stores/store.js";
  import { onDestroy } from "svelte";

  let movie;

  const unsubscribe = selectedMovie.subscribe((value) => {
    movie = value;
  });

  onDestroy(() => {
    unsubscribe();
  });

  const closeModal = () => {
    selectedMovie.set(null);
  };
</script>

{#if movie}
  <div class="backdrop">
    <div class="modal-content">
      <button on:click={closeModal}>Close</button>

      <div class="movie-detail-left">
        <img src={movie.Poster} alt={`Poster of ${movie.Title}`} />
        <div class="movie-image-space"></div>
      </div>

      <div class="movie-detail-right">
        <p><strong>Title:</strong> {movie.Title}</p>
        <p><strong>Year:</strong> {movie.Year}</p>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Rating:</strong> {movie.imdbRating}</p>
        <p><strong>Plot:</strong></p>
        <p>{movie.Plot}</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
    margin-top: 5%;
  }

  .modal-content {
    background: #242424;
    color: #bdfffd;
    border: 2px solid #ccc651;
    padding: 5%;
    border-radius: 10px;
    max-width: 55%;
    max-height: 90%;
    position: relative;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    margin-bottom: 5%;
    overflow: hidden;
  }

  .modal-content img {
    max-width: 100%;
    border-radius: 15px;
  }

  .movie-image-space {
    padding: 5%;
  }

  .movie-detail-left {
    margin-right: 50%;
  }

  .movie-detail-right {
    margin-top: -45.2%;
    margin-left: 50%;
  }

  .modal-content p {
    margin-top: 5px;
    margin-bottom: 5px;
    text-align: left;
  }

  .modal-content button {
    margin-left: 92%;
    border-radius: 5px;
    background-color: #333;
    color: #bdfffd;
    box-sizing: border-box;
    padding: 10px;
    transition: background-color 0.2s;
  }

  .modal-content button:hover {
    background-color: #bdfffd;
    color: #242424;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleUp {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
