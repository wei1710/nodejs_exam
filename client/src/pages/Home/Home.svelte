<script>
  import { onMount } from "svelte";

  let currentPath;

  onMount(() => {
    currentPath = window.location.pathname;
  });
</script>

{#if currentPath === "/"}
<div class="home-container">
  <div class="welcome-section">
    <h1>Welcome to Movie Portal</h1>
    <p>Find comprehensive information about movies</p>
  </div>

  <div class="introduction-section">
    <p>
      At Movie Portal, you can explore detailed movie information including titles, year, genre, ratings, and plots. 
      Use the navigation above to get started.
    </p>
  </div>

  <div class="features-section">
    <h2>Our Features</h2>
    <div class="features-grid">
      <div class="feature-item">
        <img src="/icons/title-icon.png" alt="Title Icon">
        <h3>Movie Titles</h3>
        <p>Discover titles from various genres and eras.</p>
      </div>
      <div class="feature-item">
        <img src="/icons/cover-icon.png" alt="Image Cover Icon">
        <h3>Image Covers</h3>
        <p>View high-quality cover images of your favorite movies.</p>
      </div>
      <div class="feature-item">
        <img src="/icons/year-icon.png" alt="Year Icon">
        <h3>Release Year</h3>
        <p>Find out the release year of movies and track cinematic history.</p>
      </div>
      <div class="feature-item">
        <img src="/icons/genre-icon.png" alt="Genre Icon">
        <h3>Genres</h3>
        <p>Explore movies by different genres to suit your mood.</p>
      </div>
      <div class="feature-item">
        <img src="/icons/rating-icon.png" alt="Rating Icon">
        <h3>Ratings</h3>
        <p>See ratings from IMDb to help you choose what to watch next.</p>
      </div>
      <div class="feature-item">
        <img src="/icons/plot-icon.png" alt="Plot Icon">
        <h3>Plots</h3>
        <p>Read plot summaries to get a quick overview of movies.</p>
      </div>
    </div>
  </div>

  <div class="cta-section">
    <h2>Get Started</h2>
    <p>Sign up or log in to access more features and explore our extensive movie database.</p>
  </div>
</div>
{/if}

<style>
  .home-container {
    margin-top: 5%;
    text-align: center;
    padding: 50px;
  }

  .welcome-section {
    margin-bottom: 30px;
  }

  .introduction-section {
    margin-bottom: 30px;
  }

  .features-section {
    margin-bottom: 30px;
  }

  .features-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  .feature-item {
    width: 200px;
    text-align: center;
  }

  .feature-item img {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }

  .cta-section {
    margin-bottom: 30px;
  }
</style>