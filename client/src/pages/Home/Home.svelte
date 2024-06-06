<script>
  import { onMount } from "svelte";
  import ThemeStyle from "../../components/Theme/ThemeStyle.svelte";

  let currentPath;

  onMount(() => {
    currentPath = window.location.pathname;
  });
</script>

<ThemeStyle />

{#if currentPath === "/"}
<div class="home-container">
  <div class="welcome-section">
    <h1>Welcome to Movie Portal</h1>
    </div>
    
    <div class="introduction-section">
      <p>Find comprehensive information about movies</p><br>
      <p>
      At Movie Portal, you can explore detailed movie information including titles, year, genre, ratings, and plots. 
      Use the navigation above to get started.
    </p>
  </div>

  <div class="features-section">
    <h2 id="h2_title">Our Features</h2>
    <div class="features-grid">
      <div class="feature-item">
        <img src="/images/home/movie_icon.png" alt="Movie Cover Icon">
        <h3>Image Covers</h3>
        <p>View high quality cover images of your favorite movies.</p>
      </div>
      <div class="feature-item">
        <img src="/images/home/year_icon.png" alt="Year Icon">
        <h3>Release Year</h3>
        <p>Find out the release year of movies and track your favorite movies.</p>
      </div>
      <div class="feature-item">
        <img src="/images/home/title_icon.png" alt="Title Icon">
        <h3>Titles</h3>
        <p>Explore movies by different titles and find your favorite movies.</p>
      </div>
      <div class="feature-item">
        <img src="/images/home/rating_icon.png" alt="Rating Icon">
        <h3>Ratings</h3>
        <p>See ratings from IMDB to help you choose what to watch next.</p>
      </div>
      <div class="feature-item">
        <img src="/images/home/plot_icon.png" alt="Plot Icon">
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
    margin-top: 7%;
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
    margin-top: 5%;
    margin-bottom: 30px;
  }

  #h2_title {
    margin-bottom: 20px;
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
    border-radius: 10px;
    border: 2px solid var(--border-color);
    width: 70%;
    height: 70%;
    margin-bottom: 10px;
  }

  .cta-section {
    margin-top: 5%;
    margin-bottom: -4%;
  }
</style>