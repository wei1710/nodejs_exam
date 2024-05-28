<script>
  import io from "socket.io-client";
  import { onMount } from "svelte";

  let theme = "dark";
  let socket;

    socket = io("localhost:8080");

    // Listen for the theme update from the server
    socket.on('server-sends-theme', (data) => {
      const theme = data;
      applyTheme(theme);
    });

    // Send the initial theme request to the server
    socket.emit('client-sends-theme', { theme });

  // Function to apply the theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Function to toggle the theme and notify the server
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    socket.emit('client-sends-theme', { theme });
  }
</script>

<button on:click={toggleTheme}>
  Toggle Theme
</button>

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
