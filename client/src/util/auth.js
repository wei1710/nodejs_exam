import { user, isAuthenticated } from "../stores/store.js";
import { toast } from "svelte-french-toast";

export async function checkLoginStatus() {
  try {
    const response = await fetch("/api/has_login", {
      method: "GET",
      credentials: "include"
    });
    if (response.ok) {
      const data = await response.json();
      if (data.isLoggedin) {
        isAuthenticated.set(true);
        user.set(data.user);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        isAuthenticated.set(false);
        user.set(null);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
      }
    } else {
      isAuthenticated.set(false);
      user.set(null);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Error checking login status: ", error);
    toast.error("Failed to check login status. Please try again later.");
    isAuthenticated.set(false);
    user.set(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
  }
}
