<script>
  import { toast, Toaster } from "svelte-french-toast";
  import { navigate } from "svelte-navigator";

  async function forgotPassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get("email");
    
    try {
      const response = await fetch("/api/forgot_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        toast.success("Password reset email sent successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const responseData = await response.json();
        handleForgotPasswordError(responseData);
      }
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again!");
    }
  }

  function handleForgotPasswordError(responseData) {
    const errorMessage = getErrorMessage(responseData.error);
    toast.error(errorMessage);
  }

  function getErrorMessage(errorType) {
    switch (errorType) {
      case "email_not_found":
        return "Email not found!";
      default:
        return "Failed to send password reset email. Please try again!";
    }
  }

  function goToLogin() {
    navigate("/login");
  }
</script>

<div class="container">
  <div class="auth-wrapper">
    <div class="title"><span>Forgot Password</span></div>
    <form on:submit={forgotPassword}>
      <div class="row">
        <input type="email" name="email" placeholder="Email" required />
      </div>
      <div class="row button">
        <input type="submit" value="Send" />
      </div>
      <div class="login-link">
        Login <button on:click={goToLogin}>Login now</button>
      </div>
    </form>
  </div>
</div>

<Toaster />