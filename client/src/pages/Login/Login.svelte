<script>
  import { fetchGet, fetchPost } from "../../util/api";
  import { BASE_URL } from "../../stores/store.js";
  import { navigate } from "svelte-navigator";
  import { user, isAuthenticated } from "../../stores/store.js";
  import { toast, Toaster } from "svelte-french-toast";
  
  async function login(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Login successful!") {
          isAuthenticated.set(true);
          user.set(true);
          toast.success("Thank you for logging in!");
        } else {
          toast.error(data.error || "Failed to login. Please try again!");
        }
      } else {
        const responseData = await response.json();
        handleLoginError(responseData, response.status);
      }
    } catch (error) {
      toast.error("Failed to login. Please try again!");
    }
  }

  function handleLoginError(responseData, status) {
    switch (status) {
      case 401:
        toast.error(responseData.error || "Invalid username or password!");
        break;
      case 402:
        toast.error("Please verify your email!");
        break;
      case 429:
        toast.error("Too many login attempts! Please try again after 10 minutes!");
        break;
      default:
        toast.error("Failed to login. Please try again!");
        break;
    }
  }

  function goToSignup() {
    navigate("/signup");
  }

  function goToForgotPassword() {
    navigate("/forgot_password");
  }

  // check if already login
  async function checkLoginStatus() {
  try {
    const response = await fetch("/api/has_login");
    if (response.ok) {
      const data = await response.json();
      isAuthenticated.set(data.isLoggedIn);
      if (data.isLoggedIn) {
        user.set(true);
        navigate("/dashboard");
      }
    } else {
      isAuthenticated.set(false);
      user.set(false);
    }
  } catch (error) {
    console.error("Error checking login status: ", error);
    toast.error("Failed to check login status. Please try again later.");
  }
}

checkLoginStatus();
</script>

<div class="container">
  <div class="auth-wrapper">
    <div class="title"><span>Login</span></div>
    <form on:submit={login}>
      <div class="row">
        <input type="text" name="username" placeholder="Username" required />
      </div>
      <div class="row">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
      </div>
      <div class="row button">
        <input type="submit" value="Login" />
      </div>
      <div class="signup-link">
        Not an user yet? <button on:click={goToSignup}>Signup now</button>
      </div>
      <div class="forgot-password-link">
        Forgot Password <button on:click={goToForgotPassword}>Reset now</button>
      </div>
    </form>
  </div>
</div>

<Toaster />