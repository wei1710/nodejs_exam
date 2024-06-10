//-- --*********************************** VERIFY EMAIL *********************** --//
const verifyEmailTemplate = (username, verificationLink) => `
<h1>Verify Email!</h1>
<p>Hello ${username}, welcome and thank you for signing up! 
Please click the button below to verify your email address.</p>
<a href="${verificationLink}" style="padding: 10px 20px; 
background-color: #335E6E; color: white; text-decoration: none; 
border-radius: 5px;">Verify Email</a>
`;

//-- --*********************************** EXPIRED VERIFY EMAIL *********************** --//
const expiredVerifyEmailTemplate = `
<html>
<head>
  <title>Email Verification Link</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      background-color: #2E6D8D;
    }

    .container { 
      text-align: center; 
      margin-top: 50px; 
    }

    button { 
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      color: white;
      cursor: pointer;
      transition: border-color 0.25s;
    }

    button:hover {
      border-width: 2px;
      border-color: #C62B6C;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email Verification Link</h1>
    <p>Your email verification link has expired!</p>
    <button onclick="window.location.href='/signup'">Sign Up</button>
  </div>
</body>
</html>
`;

//-- --*********************************** VERIFIED EMAIL *********************** --//
const emailVerifiedTemplate = `
<html>
  <head>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔐</text></svg>">
    <title>Email Verification Link</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        background-color: #2E6D8D;
      }

      .container { 
        text-align: center; 
        margin-top: 50px; 
      }

      button { 
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        color: white;
        cursor: pointer;
        transition: border-color 0.25s;
      }

      button:hover {
        border-width: 2px;
        border-color: #C62B6C;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Email Verified Successfully!</h1>
      <p>Your email has been successfully verified!</p>
      <button onclick="window.location.href='/login'">Welcome</button>
    </div>
  </body>
</html>
`;

//-- --*********************************** RESET PASSWORD EMAIL *********************** --//
const resetPasswordEmailTemplate = (username, resetLink) => `
<p>Hello ${username},
if your forgot your password you can reset it! 
Please click the button below to reset your password.</p>
<a href="${resetLink}" style="padding: 10px 20px; 
background-color: #4CAF50; color: white; text-decoration: none; 
border-radius: 5px;">Reset Password</a>`;

export { verifyEmailTemplate, expiredVerifyEmailTemplate, emailVerifiedTemplate, resetPasswordEmailTemplate };
