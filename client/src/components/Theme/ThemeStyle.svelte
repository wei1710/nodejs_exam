<style>
  :root[data-theme="light"] {
    --color-white: #ffffff;
    --color-off-white: #f0f0f0;
    --color-dark: #242424;
    --color-dark-grey: #333333; 
    --color-light-grey: #c2c2c2ce;
    --color-yellow: #ccc651;
    --color-cyan: #bdfffd;
    --color-red: #ff0000;
    --color-dark-red: #6e0101;

    --background-color: var(--color-white);
    --border-color: var(--color-yellow);

    --button-color: var(--color-yellow);
    --button-hover-color: var(--color-dark);
    --delete-button-color: var(--color-red);
    --delete-button-hover-color: var(--color-dark-red);

    --input-text-color: var(--color-cyan);
    --text-color: var(--color-dark);
    --light-text-color: var(--color-off-white);
    --text-color-mode: var(--color-yellow);
    
    --table-header-color: var(--color-light-grey);

    --navbar-color: var(--color-dark-grey);
    --navbar-hover-color: var(--color-white);
  }

  :global(body) {
    background-color: var(--background-color);
    color: var(--text-color);
  }

  :root[data-theme="dark"] {
    --color-dark: #242424;
    --color-dark-grey: #333333; 
    --color-light-grey: #c2c2c2ce;
    --color-grey: #444444;
    --color-yellow: #ccc651;
    --color-cyan: #bdfffd;
    --color-red: #ff0000;
    --color-dark-red: #8B0000;

    --background-color: var(--color-dark);
    --border-color: var(--color-yellow);

    --button-color: var(--color-dark-grey);
    --button-hover-color: var(--color-cyan);
    --delete-button-color: var(--color-red);
    --delete-button-hover-color: var(--color-dark-red);

    --input-text-color: var(--color-cyan);
    --text-color: var(--color-cyan);
    --text-color-mode: var(--color-dark);
    
    --table-header-color: var(--color-dark-grey);

    --navbar-color: var(--color-dark-grey);
    --navbar-hover-color: var(--color-white);
  }

  :global(body) {
    background-color: var(--background-color);
    color: var(--text-color);
  }
</style>