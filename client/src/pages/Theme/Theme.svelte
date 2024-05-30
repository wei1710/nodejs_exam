<script>
  import { onMount } from "svelte";
  import { initializeThemeSocket, applyTheme, sendTheme, disconnectSocket } from "../../util/socketTheme.js";

  export let socket;
  export let isAdmin = false;

  let theme = "dark";

  onMount(() => {
    socket = initializeThemeSocket();

    socket.on("server-sends-theme", (data) => {
      console.log("Received theme from server:", data);
      theme = data.theme;
      applyTheme(theme);
    });

    sendTheme(theme);

    return () => {
      disconnectSocket();
    };
  });

  function toggleTheme() {
    if (isAdmin) {
      theme = theme === "dark" ? "light" : "dark";
      console.log("Toggling theme:", theme);
      sendTheme(theme);
  
      fetch("/api/theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ theme })
      });
  
      applyTheme(theme);
    }
  }
</script>

<input 
  type="button"
  class="toggle-theme"
  on:click={toggleTheme}
  value="Toggle Theme"
  disabled={!isAdmin}
  />

<style>
  :root[data-theme="light"] {
    --background-color: #bdfffd;
    --text-color: #242424;
  }

  :root[data-theme="dark"] {
    --background-color: #242424;
    --text-color: #bdfffd;
  }

  :global(body) {
    background-color: var(--background-color);
    color: var(--text-color);
  }
</style>