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

<style>
  .container {
  max-width: 440px;
  padding: 0 20px;
  margin: 170px auto;
}

.auth-wrapper {
  width: 110%;
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

.auth-wrapper form .login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 17px;
}

.auth-wrapper form {
  color: #16a085;
  text-decoration: none;
}

</style>
