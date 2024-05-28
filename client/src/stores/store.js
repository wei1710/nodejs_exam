import { writable } from "svelte/store";
import { readable } from "svelte/store";

export const user = writable(null);
export const isAuthenticated = writable(false);