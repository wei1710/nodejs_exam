<script>
  import { onMount } from "svelte";
  import { initializeThemeSocket, applyTheme, sendTheme, disconnectSocket } from "../../util/socketTheme.js";
  import { theme } from "../../stores/themeStore.js";
  import { initializeTheme, toggleThemeMode } from "../../util/theme.js";
  import ThemeStyle from "../../components/Theme/ThemeStyle.svelte";
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