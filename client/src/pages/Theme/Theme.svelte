<script>
  import io from "socket.io-client";
  import { onMount } from "svelte";

  let theme = "dark";
  let socket;

  onMount(() => {
    socket = io("http://localhost:8080");

    socket.on("server-sends-theme", (data) => {
      console.log("Received theme from server:", data);
      theme = data.theme;
      applyTheme(theme);
    });

    socket.emit("client-sends-theme", { theme });
    console.log("Initial theme sent to server:", theme);

    return () => {
      socket.disconnect();
    };
  });

  function applyTheme(theme) {
    console.log("Applying theme:", theme);
    document.documentElement.setAttribute("data-theme", theme);
    console.log("Theme applied:", document.documentElement.getAttribute("data-theme"));

    const rootStyles = getComputedStyle(document.documentElement);
    console.log("Computed background color:", rootStyles.getPropertyValue("--background-color"));
    console.log("Computed text color:", rootStyles.getPropertyValue("--text-color"));
  }

  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    console.log("Toggling theme:", theme);
    socket.emit("client-sends-theme", { theme });

    fetch("/api/theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ theme })
    });

    applyTheme(theme);
  }
</script>

<input 
  type="button"
  class="toggle-theme"
  on:click={toggleTheme}
  value="Toggle Theme"
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