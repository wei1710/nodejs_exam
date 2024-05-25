<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import { toast, Toaster } from "svelte-french-toast";
  import Home from "../pages/Home/Home.svelte";
  import Login from "../pages/Login/Login.svelte";
  import ForgotPassword from "../pages/ForgotPassword/ForgotPassword.svelte";
  import ResetPassword from "../pages/ResetPassword/ResetPassword.svelte";
  import Signup from "../pages/Signup/Signup.svelte";
  import User from "../pages/User/User.svelte";
  import Movies from "../pages/Movies/Movies.svelte";
  import Admin from "../pages/Admin/Admin.svelte";
  import PrivateRoute from "../util/PrivateRoute.svelte";
  import { user, isAuthenticated, BASE_URL } from "../stores/store.js";
  
  async function logOut() {
    try {
      const response = await fetch(BASE_URL +"/api/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      if (response.ok) {
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");
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
    <nav>
      <div id="left-side-nav">
        <img src="/images/logo2-2-removebg.png" alt="Logo" class="navbar-logo" />
        <!-- <h2>Movie Portal</h2> -->
        <Link to="/">Home</Link>
      </div>

      <div id="right-side-nav">
        {#if $user === null}
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        {/if}

        {#if $user}
          <Link to="/movies">User</Link>
          <input type="button" class="logout-button" on:click={logOut} value="Logout" />
        {/if}
      </div>
    </nav>
  </header>
  <main>
    <Route path="/">
      <Home />
    </Route>

    <Route path="/login">
      <Login />
    </Route>

    <Route path="/forgot_password">
      <ForgotPassword />
    </Route>

    <Route path="/reset_password">
      <ResetPassword />
    </Route>

    <Route path="/signup">
      <Signup />
    </Route>

    <Route path="/users">
      <User />
    </Route>

    <!-- <PrivateRoute path="/users" let:location>
      <User />
    </PrivateRoute> -->

    <Route path="/movies">
      <Movies />
    </Route>

    <!-- <PrivateRoute path="/movies" let:location>
      <Movies />
    </PrivateRoute> -->

    <Route path="/admin">
      <Admin />
    </Route>
    
    <!-- <PrivateRoute path="/admin" let:location>
      <Admin />
    </PrivateRoute> -->
  </main>
</Router>

<style>

</style>
