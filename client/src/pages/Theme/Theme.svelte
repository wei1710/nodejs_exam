<script>
  import { onMount } from "svelte";
  import { theme } from "../../stores/themeStore.js";
  import { initializeTheme, toggleThemeMode } from "../../util/theme.js";
  import { get } from "svelte/store";

  export let isAdmin = false;

  let currentTheme = get(theme);

  onMount(() => {
    const cleanup = initializeTheme(isAdmin, currentTheme, (newTheme) => {
      currentTheme = newTheme;
    });

    return cleanup;
  });

  function toggleTheme() {
    currentTheme = toggleThemeMode(currentTheme, isAdmin);
  }
</script>

<input 
  type="button"
  class="toggle-theme"
  on:click={toggleTheme}
  value="Toggle Theme"
  disabled={!isAdmin}
  />