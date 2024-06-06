import { writable } from "svelte/store";

export const theme = writable("dark");

export function setTheme(newTheme) {
  theme.set(newTheme);
  document.documentElement.setAttribute("dark-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}