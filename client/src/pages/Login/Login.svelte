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
      const response = await fetch(BASE_URL + "/api/login", {
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
          navigate("/dashboard");
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



<style>

.container {
  max-width: 440px;
  padding: 0 20px;
  margin: 170px auto;
}

.auth-wrapper {
  width: 100%;
  background-color: rgba(19, 116, 195, 0.188);
  border-radius: 5px;
}

.auth-wrapper .title {
  line-height: 90px;
  background: #16a085;
  text-align: center;
  border-radius: 5px 5px 0 0;
  color: #fff;
  font-size: 30px;
  font-weight: 600;
}

.auth-wrapper form {
  padding: 30px 25px 25px 25px;
}

.auth-wrapper form .row {
  position: relative;
  height: 45px;
  margin-bottom: 15px;
}

.auth-wrapper form .row input {
  height: 100%;
  width: 85%;
  outline: none;
  padding-left: 20px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  font-size: 16px;
  transition: all 0.3s ease;
}

form .row input:focus {
  border-color: #16a085;
  box-shadow: inset 0px 0px 2px 2px rgba(26, 188, 156, 0.25);
}

.auth-wrapper form .button input {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  padding-left: 0px;
  background-color: #16a085;
  border: 1px solid #16a085;
  cursor: pointer;
}

form .button input:hover {
  background: #12876f;
}

.auth-wrapper form .signup-link, .forgot-password-link {
  text-align: center;
  margin-top: 20px;
  font-size: 17px;
}

.auth-wrapper form {
  color: #16a085;
  text-decoration: none;
}
</style>