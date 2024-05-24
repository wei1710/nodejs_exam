<script>
  import { Router, Link, Route, navigate } from "svelte-navigator";
  import { toast, Toaster } from "svelte-french-toast";
  import Home from "../pages/Home/Home.svelte";
  import Login from "../pages/Login/Login.svelte";
  import Signup from "../pages/Signup/Signup.svelte";
  import User from "../pages/User/User.svelte";
  import PrivateRoute from "../util/PrivateRoute.svelte";
  import { user, isAuthenticated, BASE_URL } from "../stores/store.js";
</script>

<Toaster />
<Router>
  <header>
    <h1>Mandatory II</h1>

    <nav>
      
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

    <!-- <Route path="user">
    <User />
  </Route> -->
    <PrivateRoute path="/user" let:location>
      <User />
    </PrivateRoute>
  </main>
</Router>

<style>
</style>
