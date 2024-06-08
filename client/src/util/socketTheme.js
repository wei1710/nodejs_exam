import io from "socket.io-client";
import { setTheme } from "../stores/themeStore.js";

let socket;

function initializeThemeSocket() {
  if (!socket) {
    socket = io("http://localhost:8080");

    socket.on("server-sends-theme", (data) => {
      applyTheme(data.theme);
    });
  }
  return socket;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  setTheme(theme);
}

function sendTheme(theme) {
  if (socket) {
    socket.emit("client-sends-theme", { theme });
  }
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}

export { initializeThemeSocket, applyTheme, sendTheme, disconnectSocket };