import { writable } from "svelte/store";
import { readable } from "svelte/store";

export const user = writable(null);
export const BASE_URL = readable("http://localhost:8080");
export const isAuthenticated = writable(false);