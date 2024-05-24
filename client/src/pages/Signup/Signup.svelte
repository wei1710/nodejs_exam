<script>
  import { navigate } from "svelte-navigator";
  import { toast, Toaster } from "svelte-french-toast";

  async function signup(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        toast.success("Please verify your email!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const responseData = await response.json();
        handleSignupError(responseData);
      }
    } catch (error) {
      console.error("Error signing up: ", error);
      toast.error("Failed to signup. Please try again!");
    }
  }

  function handleSignupError(responseData) {
    if (responseData.errors) {
      responseData.errors.forEach((error) => {
        const errorMessage = getErrorMessage(error.type);
        toast.error(errorMessage);
      });
    } else {
      toast.error(
        responseData.error || "Failed to signup. Please try again!"
      );
    }
  }

  function getErrorMessage(errorType) {
    switch (errorType) {
      case "username_length":
        return (
          "Username must be between 5 - 13 characters" +
          " and can only contain letters, numbers, underscores, or hyphens!"
        );
      case "password_strength":
        return (
          "Password must be 8-13 characters" +
          " and contain at least one uppercase letter, one number, and one special character!"
        );
      case "invalid_email":
        return "Invalid email address!";
      case "username_exists":
        return "Username already exists!";
      case "email_exists":
        return "Email address is already in use!";
      default:
        return "Failed to signup. Please try again!";
    }
  }

  function goToLogin() {
    navigate("/login");
  }
</script>

<div class="container">
  <div class="auth-wrapper">
    <div class="title"><span>Signup</span></div>
    <form on:submit={signup}>
      <div class="row">
        <input type="email" name="email" placeholder="Email" required />
      </div>
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
        <input type="submit" value="Signup" />
      </div>
      <div class="login-link">
        Already an user <button on:click={goToLogin}>Login now</button>
      </div>
    </form>
  </div>
</div>
