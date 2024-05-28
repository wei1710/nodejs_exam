<script>
  import { toast, Toaster } from "svelte-french-toast";
  import { navigate } from "svelte-navigator";
  
  async function resetPassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");
    const token = new URLSearchParams(window.location.search).get("token");

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    try {
      const response = await fetch("/api/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
      });
      
      if (response.ok) {
        toast.success("Password reset");
        setTimeout(() =>{
          navigate("/login");
        });
      } else {
        const responseData = await response.json();
        handleResetPasswordError(responseData);
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again!");
    }
  }

  function handleResetPasswordError(responseData) {
    const errorMessage = getErrorMessage(responseData.error);
    toast.error(errorMessage);
  }

  function getErrorMessage(errorType) {
    switch (errorType) {
      case "invalid_token":
        return "Invalid or expired reset token!";
      case "expired_token":
        return "Password reset link has expired!";
      default:
        return "Failed to reset password. Please try again!";
    }
  }
</script>

<!-- *********************************** RESET PASSWORD FORM *********************** -->
<div class="reset-password-container">
  <div class="reset-password-header">Reset Password</div>
    <form on:submit={resetPassword}>
      <input type="password" name="password" placeholder="New Password" required class="reset-password-input" />
      <input type="password" name="confirm-password" placeholder="Confirm Password" required class="reset-password-input" />
      <input type="submit" class="reset-password-button" value="Reset Password" />
    </form>
  </div>

<Toaster />