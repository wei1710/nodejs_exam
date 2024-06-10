import { initializeThemeSocket, applyTheme, sendTheme, disconnectSocket } from "./socketTheme.js";
import { setTheme } from "../stores/themeStore.js";

export function toggleTheme(currentTheme) {
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  sendTheme(newTheme);
  setTheme(newTheme);

  fetch("/api/themes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ theme: newTheme })
  });

  return newTheme;
}

export function initializeTheme(isAdmin, currentTheme, onThemeChange) {
  // ensure correct theme on initial load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
    currentTheme = savedTheme;
  } else {
    applyTheme("dark");
    currentTheme = "dark";
  }

  const socket = initializeThemeSocket();

  socket.on("server-sends-theme", (data) => {
    currentTheme = data.theme;
    applyTheme(currentTheme);
    if (onThemeChange) onThemeChange(currentTheme);
  });

  sendTheme(currentTheme);

  return () => {
    disconnectSocket();
  };
}

export function toggleThemeMode(currentTheme, isAdmin) {
  if (isAdmin) {
    currentTheme = toggleTheme(currentTheme);
  }
  return currentTheme;
}