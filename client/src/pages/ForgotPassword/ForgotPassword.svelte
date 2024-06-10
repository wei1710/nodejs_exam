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
</script>

<!-- *********************************** FORGOT PASSWORD FORM *********************** -->
<div class="forgot-password-container">
  <div class="forgot-password-header">Forgot Password</div>
    <form on:submit={forgotPassword}>
      <input type="email" name="email" placeholder="email" required class="forgot-password-input" />
      <input type="submit" class="forgot-password-button" value="Reset Password" />
    </form>
  </div>

<Toaster />