<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import { toast, Toaster } from "svelte-french-toast";
  import Home from "../pages/Home/Home.svelte";
  import Login from "../pages/Login/Login.svelte";
  import Signup from "../pages/Signup/Signup.svelte";
  import User from "../pages/User/User.svelte";
  import PrivateRoute from "../util/PrivateRoute.svelte";
  import { user, isAuthenticated, BASE_URL } from "../stores/store.js";
  function logout() {
    console.log("logout");
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

        {#if $user !== null}
          <Link to="/user">User</Link>
          <a href="/" on:click|preventDefault={logout}>Logout</a>
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

    <Route path="/signup">
      <Signup />
    </Route>

    <PrivateRoute path="/user" let:location>
      <User />
    </PrivateRoute>
  </main>
</Router>

<style>

</style>
