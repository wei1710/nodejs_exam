<script>
  import { navigate } from "svelte-navigator";
  import { user, isAuthenticated } from "../../stores/store.js";
  import { toast } from "svelte-french-toast";
  import { onMount } from "svelte";
  import { checkLoginStatus } from "../../util/auth.js";

  async function login(event) {
    event.preventDefault();

    checkLoginStatus();

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Login successful!") {
          isAuthenticated.set(true);
          user.set(true);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("Thank you for logging in!");

          if (data.user.is_admin) {
            navigate("/admin_movies");
          } else {
            navigate("/movies");
          }
        } else {
          toast.error(data.error || "Failed to login. Please try again!");
        }
      } else {
        const responseData = await response.json();
        handleLoginError(responseData, response.status);
      }
    } catch (error) {
      console.error("Error during login:", error);
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

  function goToForgotPassword() {
    navigate("/forgot_password");
  }

  //-- *********************************** CHECK IF ALREADY LOGIN *********************** --//
  onMount(() => {
    checkLoginStatus();
  });

</script>

<!-- *********************************** LOGIN FORM *********************** --> 
<div class="login-container">
  <div class="login-header">Login</div>
  <form on:submit={login}>
  <input type="text" name="username" placeholder="Username" required class="login-input" />
  <input type="password" name="password" placeholder="Password" required class="login-input" />
  <input type="submit" class="login-button" value="Login" />
  <input type="button" class="forgot-password-button" on:click={goToForgotPassword} value="Forgot password?"/>
</form>
</div>
