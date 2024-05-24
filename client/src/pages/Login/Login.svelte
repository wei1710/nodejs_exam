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
          navigate("/user");
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

<div class="login-container">
  <div class="login-header">Login</div>
  <input type="text" name="username" placeholder="Username" required class="login-input" />
  <input type="password" name="password" placeholder="Password" required class="login-input" />
  <button class="login-button">Login</button>
  <div class="signup-link">
    <button on:click={goToSignup}>Not a user yet? Signup now</button>
  </div>
  <div class="reset-link">
    <button on:click={goToForgotPassword}>Forgot password?</button>
  </div>
</div>

<style>
  .login-container {
    background-color: #031926;
    max-width: 440px;
    padding: 20px;
    margin: 170px auto;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .login-header {
    color: #bdfffd;
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
  }

  .login-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #242424;
    color: #bdfffd;
  }

  .login-button {
    width: 100%;
    padding: 10px;
    background-color: #333;
    border: none;
    border-radius: 5px;
    color: #bdfffd;
    font-size: 16px;
    cursor: pointer;
  }

  .login-button:hover {
    background-color: #bdfffd;
    color: #242424;
  }

  .signup-link,
  .reset-link {
    color: #bdfffd;
    display: block;
    text-align: center;
    margin-top: 10px;
  }
  .signup-link:hover button,
  .reset-link:hover button {
    color: #bdfffd;
  }
</style>
