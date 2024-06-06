<style>
  :root[data-theme="light"] {
    --background-color: #ffffff;
    --text-color: #242424;
    --border-color: #242424;

    /* USER TABLE */
    --user-table-color: #ccc651;
    --user-table-header-color: #c2c2c2ce;

    /* USER ELEMENTS */
    --user-bg-color: #ffffff;
    --user-text-color: #242424;
    --user-border-color: #ccc651;
    --user-button-color: #f0f0f0;
    --user-button-hover-color: #242424;

    /* MOVIE ELEMENTS */
    --movie-bg-color: #ffffff;
    --movie-text-color: #242424;
    --movie-border-color: #ccc651;
    --movie-card-bg-color: #f0f0f0;
    --movie-card-hover-bg-color: #e0e0e0;

    /* MOVIE MODAL */
    --movie-modal-button-bg-color: #f0f0f0;
    --movie-modal-button-text-color: #242424;
    --movie-modal-button-hover-bg-color: #242424;
    --movie-modal-button-hover-text-color: #ffffff;

    /* ADMIN MOVIE ELEMENTS */
    --admin-movie-bg-color: #ffffff;
    --admin-movie-text-color: #242424;
    --admin-movie-border-color: #ccc651;
    --admin-movie-card-bg-color: #f0f0f0;
    --admin-movie-card-hover-bg-color: #e0e0e0;
  }

  :root[data-theme="dark"] {
    --background-color: #242424;
    --text-color: #bdfffd;
    --border-color: #bdfffd;

    /* USER TABLE */
    --user-table-color: #ccc651;
    --user-table-header-color: #333333;

    /* USER ELEMENTS */
    --user-bg-color: #333333;
    --user-text-color: #bdfffd;
    --user-border-color: #ccc651;
    --user-button-color: #333333;
    --user-button-hover-color: #bdfffd;

    /* MOVIE ELEMENTS */
    --movie-bg-color: #242424;
    --movie-text-color: #bdfffd;
    --movie-border-color: #ccc651;
    --movie-card-bg-color: #333333;
    --movie-card-hover-bg-color: #444444;

    /* MOVIE MODAL */
    --movie-modal-button-bg-color: #333333;
    --movie-modal-button-text-color: #bdfffd;
    --movie-modal-button-hover-bg-color: #bdfffd;
    --movie-modal-button-hover-text-color: #242424;

    /* ADMIN MOVIE ELEMENTS */
    --admin-movie-bg-color: #242424;
    --admin-movie-text-color: #bdfffd;
    --admin-movie-border-color: #ccc651;
    --admin-movie-card-bg-color: #333333;
    --admin-movie-card-hover-bg-color: #444444;
  }

  :global(body) {
    background-color: var(--background-color);
    color: var(--text-color);
  }
</style>