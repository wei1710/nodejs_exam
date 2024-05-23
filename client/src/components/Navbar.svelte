<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import { toast, Toaster } from "svelte-french-toast";
  import Home from "../pages/Home/Home.svelte";
  import Login from "../pages/Login/Login.svelte";
  import Signup from "../pages/Signup/Signup.svelte";
  import User from "../pages/User/User.svelte";
  import PrivateRoute from "../util/PrivateRoute.svelte";
  import { user, isAuthenticated, BASE_URL } from "../stores/store.js";
  
  
  async function signOut() {
    try {
    const res = await fetch(BASE_URL + "/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("user");
      isAuthenticated.set(false);
      navigate("/", { state: { prevRoute: "/dashboard" } });

      toast.success("Logged out successfully");
      console.log("Sign out successful");
      $user = null;
    } else {
      toast.error("Failed to log out!");
      console.error("Sign out failed: ", res.statusText);
    } 
  } catch (error) {
      toast.error("Error: cannot log out!");
      console.error("Error logging out: ", error);
    }
  }

  // Check if reset token is present in the URL
  const resetToken = new URLSearchParams(window.location.search).get("token");
  const showResetPassword = !!resetToken;

  if (!showResetPassword) {
    navigate("/");
  }

  // check user already login
  async function checkAuthentication() {
    try {
      const response = await fetch(BASE_URL +"/api/has_login");
      if (response.ok) {
        const data = await response.json();
        isAuthenticated.set(data.isLoggedIn);
      } else {
        isAuthenticated.set(false);
      }
    } catch (error) {
      console.error("Error checking authentication status: ", error);
      isAuthenticated.set(false);
    }
  }

  checkAuthentication();
</script>

<Toaster />
<Router>
  <header>
    <h1>Mandatory II</h1>

    <nav>
      <Link to="/">Home</Link>

      {#if $user === null}
        <Link to="/login">Login</Link>

        <Link to="/signup">Signup</Link>
      {/if}

      {#if $user !== null}
        <Link to="/user">User</Link>
        <a href="/" on:click={signOut}>Logout</a>
      {/if}
    </nav>
  </header>
  <main>
    <Route path="/">
      <Home />
    </Route>

    <Route path="login">
      <Login />
    </Route>

    <Route path="signup">
      <Signup />
    </Route>

    <!-- <Route path="user">
    <User />
  </Route> -->
    <PrivateRoute path="user" let:location>
      <User />
    </PrivateRoute>
  </main>
</Router>

<style>
</style>
