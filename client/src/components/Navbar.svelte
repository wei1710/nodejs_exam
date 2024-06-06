<script>
  import { afterUpdate, onMount } from "svelte";
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import { toast, Toaster } from "svelte-french-toast";
  import Home from "../pages/Home/Home.svelte";
  import Login from "../pages/Login/Login.svelte";
  import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.svelte";
  import ResetPassword from "../pages/ResetPassword/ResetPassword.svelte";
  import Signup from "../pages/Signup/Signup.svelte";
  import User from "../pages/User/User.svelte";
  import Movies from "../pages/Movies/Movies.svelte";
  import MoviesAdmin from "../pages/MoviesAdmin/MoviesAdmin.svelte";
  import PrivateRoute from "../util/PrivateRoute.svelte";
  import { user, isAuthenticated } from "../stores/store.js";
  import Theme from "../pages/Theme/Theme.svelte";
  import { checkLoginStatus } from "../util/auth";
  import { initializeThemeSocket } from "../util/socketTheme.js";
  import { theme } from "../stores/themeStore.js";

  let socket;
  let isAdmin = false;

  $: {
    if ($user) {
      isAdmin = $user.is_admin;
    }
  }

  afterUpdate(() => {
    console.log("afterUpdate: storing current path", window.location.pathname);
    localStorage.setItem("currentPath", window.location.pathname);
  });

  onMount(async () => {
    console.log("onMount: checking login status");
    await checkLoginStatus();

    socket = initializeThemeSocket();

    const storedPath = localStorage.getItem("currentPath");
    console.log("onMount: stored path", storedPath);
    console.log("onMount: current path", window.location.pathname);

    if (storedPath && storedPath !== window.location.pathname && $isAuthenticated) {
      console.log("onMount: navigating to stored path", storedPath);
      navigate(storedPath, { replace: true });
    }
  });


  //-- *********************************** LOGOUT *********************** --//
  async function logOut() {
    try {
      const response = await fetch("/api/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");
        localStorage.removeItem("currentPath");
        user.set(null);
        isAuthenticated.set(false);
        toast.success("Sign out successful!");
        navigate("/");
        console.log("Sign out successful");
      } else {
        toast.error("Failed to sign out!");
        console.error("Sign out failed: ", response.statusText);
      }
    } catch (error) {
      toast.error("Error: cannot sign out!");
      console.error("Error signing out: ", error);
    }
  }
</script>

<Toaster />

<Router>
  <header>
    <!-- --*********************************** TOP LEFT LOGO ***********************-- -->
    <nav class={$theme}>
      <div id="left-side-nav">
        <img
          src="/images/logo2-2-removebg.png"
          alt="Logo"
          class="navbar-logo"
        />
        <!-- <h2>Movie Portal</h2> -->
        <Link to="/">Home</Link>
        {#if $user && $user.is_admin}
        <Theme {socket} isAdmin={true}/>
        {/if}
      </div>

      <!-- --*********************************** TOP RIGHT NAVIGATION ***********************-- -->
      <div id="right-side-nav">
        {#if $user === null}
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        {/if}

        {#if $user && $user.is_admin}
        <Link to="/users">Users</Link>
        {/if}

        {#if $user && $user.is_admin}
          <Link to="/movies_admin">Movies Admin</Link>
        {/if}

        {#if $user}
          <Link to="/movies">Movies</Link>
          <input
            type="button"
            class="logout-button"
            on:click={logOut}
            value="Logout"
          />
        {/if}
      </div>
    </nav>
  </header>
  <main>
    <Route path="/" primary={false}>
      <Home />
    </Route>

    <Route path="/login" primary={false}>
      <Login />
    </Route>

    <Route path="/forgot_password" primary={false}>
      <ForgotPassword />
    </Route>

    <Route path="/reset_password" primary={false}>
      <ResetPassword />
    </Route>

    <Route path="/signup" primary={false}>
      <Signup />
    </Route>

    <PrivateRoute path="/users" let:location primary={false}>
      <User />
    </PrivateRoute>

    <PrivateRoute path="/movies" let:location primary={false}>
      <Movies />
    </PrivateRoute>

    <PrivateRoute path="/movies_admin" let:location primary={false}>
      <MoviesAdmin />
    </PrivateRoute>
  </main>
</Router>
