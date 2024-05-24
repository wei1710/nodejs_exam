<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import { toast, Toaster } from "svelte-french-toast";
  import Home from "../pages/Home/Home.svelte";
  import Login from "../pages/Login/Login.svelte";
  import Signup from "../pages/Signup/Signup.svelte";
  import User from "../pages/User/User.svelte";
  import PrivateRoute from "../util/PrivateRoute.svelte";
  import { user, isAuthenticated, BASE_URL } from "../stores/store.js";
  
  async function logOut() {
    try {
      const response = await fetch(BASE_URL +"/api/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Sign out successful!");
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");
        user.set(null);
        isAuthenticated.set(false);
        console.log("Sign out successful");
        setTimeout(() => {
        navigate("/");
      }, 1000)
        // navigate("/");
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
          <Link to="/user">User</Link>
          <button on:click={logOut} >Logout</button>
          <!-- <a on:click|preventDefault={logOut}>Logout</a> -->
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
