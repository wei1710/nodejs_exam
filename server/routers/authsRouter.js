import { Router } from "express";
import db from "../database/connection.js";
const router = Router();

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "validator";

//-- ********************************* Username requirements *********************** --//
const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_-]{5,13}$/;
  return regex.test(username);
};

//-- ********************************* Password requirements *********************** --//
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,13}$/;
  return regex.test(password);
};

//-- ********************************* Email requirements *********************** --//
const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Generate a unique identifier
const generateUniqueIdentifier = () => {
  return crypto.randomUUID();
};

//-- ******************************************** Signup ************************* --//
router.post("/api/signup", async (req, res) => {
  // console.log("Received signup request: ", req.body);
  const { username, password, email } = req.body;

  // Username requirements
  if (!validateUsername(username)) {
    return res.status(400).json({
      error: "Username must be between 5 - 13 characters"
        + " and can only contain letters, numbers, underscores, or hyphens!"
    });
  }

  // Password validation
  if (!validatePassword(password)) {
    return res.status(400).json({
      error: "Password must be 8-13 characters"
        + " and contain at least one uppercase letter, one number, and one special character!"
    });
  }

  // Email validation
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email address!" });
  }

  try {
    // Check for duplicates username or email in db 
    const existingUser = await db.get(`SELECT * FROM users WHERE username = ? OR email = ?`, [username, email]);
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already in use!" });
      } else {
        return res.status(400).json({ error: "Email address is already in use!" });
      }
    }

    // hash password and store user data
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = generateUniqueIdentifier();
    const verificationKey = `verify_${verificationToken}`; // unique key for verification token

    const expirationTimestamp = Date.now() + (10 * 60 * 1000);
    await db.run(`INSERT INTO users (
                  username, 
                  password, 
                  email,
                  is_signed_up,
                  verified,
                  verification_token, 
                  verification_key, 
                  expiration_timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, email, true, false, verificationToken, verificationKey, expirationTimestamp]);

    const verificationLink = `${process.env.BASE_URL}/api/verify?uid=${verificationToken}`;

    // Send email with verification link
    const fromEmail = process.env.EMAIL_FROM;
    resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verify Your Email",
      html: 
      `<h1>Verify Email!</h1>
      <p>Hello ${username}, welcome and thank you for signing up! 
      Please click the button below to verify your email address.</p>
      <a href="${verificationLink}" style="padding: 10px 20px; 
      background-color: #335E6E; color: white; text-decoration: none; 
      border-radius: 5px;">Verify Email</a>
      `});


    // new created user
    const newUser = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user: ", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- **************************************** Verify *********************** --//
router.get("/api/verify", async (req, res) => {
  const { uid } = req.query;

  try {
    // console.log("Received verification request. UID: ", uid);
    const user = await db.get(`SELECT * FROM users WHERE verification_token = ?`, [uid]);
    // console.log("User found:", user);

    if (!user) {
      // console.log("User not found. Invalid verification link.");
      return res.status(400).json({ error: "Invalid verification link!" });
    }

    const { verification_key, email, expiration_timestamp } = user;
    // console.log("Verification key: ", verification_key);
    // console.log("Email: ", email);
    // console.log("Expiration timestamp: ", expiration_timestamp);

    if (!verification_key || !email || !expiration_timestamp) {
      return res.status(400).json({ error: "Invalid verification link!" });
    }

    const currentTime = Date.now();
    // console.log("Current time: ", currentTime);

    // Verification Link expire after 10 minutes
    if (currentTime > expiration_timestamp) {
      // console.log("Verification link has expired.");
      return res.status(400).send(`
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
  `);
    }

    if (verification_key === `verify_${uid}`) {
      // console.log("Verification successful.");
      // Update user's verified status
      await db.run(`UPDATE users SET 
      verified = TRUE WHERE id = ?`,
        [user.id]);

      // response successful verification
      return res.status(200).send(`
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
            <button onclick="window.location.href='/'">Welcome</button>
          </div>
        </body>
      </html>
  `);
    } else {
      // console.log("Invalid token.");
      return res.status(400).json({ error: "Invalid token!" });
    }
  } catch (error) {
    console.error("Error verifying email: ", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- ******************************************* Login *********************** --//
router.post("/api/login", async (req, res) => {
  // console.log("Received login request:", req.body);
  const { username, password } = req.body;

  // find user by username
  const user = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password!" });
  }

  try {
    // compare password with hashed password
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // check if user's email is verified
      if (!user.verified) {
        // console.log("User's email is not verified");
        return res.status(402).json({ error: "Please verify your email!" });
      }

      const sessionId = generateUniqueIdentifier();

      req.session.session_id = sessionId;

      // console.log("Session ID set: ", req.session.session_id);

      try {
        // Saving sessionId to the user in the db
        await db.run(`UPDATE users SET session_id = ? WHERE id = ?`, [sessionId, user.id]);

        const updatedUser = await db.get(`SELECT * FROM users WHERE id = ?`, [user.id]);
        // console.log("User: ", updatedUser);   // updated user from db
      } catch (error) {
        console.error("Error updating user session: ", error);
        return res.status(500).json({ error: "Internal server error!" });
      }


      // Send email after successful login
      const fromEmail = process.env.EMAIL_FROM;

      // check and switch between new users and existing users
      const isFirstLogin = !user.hasLoggedIn;
      let message;

      if (isFirstLogin) {
        message = `Hello ${username}, welcome to our service! We are happy to have you!<br>
                   Explore our site to discover more features and information.`;
      } else {
        message = `Hello ${username}, welcome back and thank you for using our service again!<br>
                   Explore our site to discover more features and information.`;
      }

      resend.emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Successful Login",
        html: `
        <html>
          <head>
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
            <h1>Login Successfully!</h1>
            <p>${message}</p>
            <button onclick="window.location.href='/'">Welcome</button>
          </div>
        </body>
      </html>
  `});
      return res.status(200).json({ message: "Login successful!" });
    } else {
      return res.status(401).json({ error: "Invalid username or password!" });
    }
  } catch (error) {
    console.error("Error comparing passwords: ", error + " !");
    return res.status(500).json({ error: "Internal server error!" });
  }

});

//-- ********************************* Has Login *********************** --//
router.get("/api/has_login", async (req, res) => {
  const { session_id } = req.session;

  try {
    if (!session_id) {
      return res.status(401).json({ isLoggedIn: false });
    }

    const user = await db.get(`SELECT * FROM users WHERE session_id = ?`, [session_id]);

    if (user) {
      return res.status(200).json({ isLoggedIn: true, user });
    } else {
      return res.status(401).json({ isLoggedIn: false, });
    }
  } catch (error) {
    console.error("Error checking login status: ", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- ********************************* Forgot password *********************** --//
router.post("/api/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    // does email exists in db
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

    if (!user) {
      return res.status(404).json({ error: "Email not found!" });
    }
    const { username } = user;
    const resetToken = generateUniqueIdentifier();

    // save reset token and timestamp to db based on specific user
    await db.run(`UPDATE users SET 
                  reset_token = ?, 
                  reset_timestamp = ? 
                  WHERE id = ?`,
      [resetToken, Date.now(), user.id]);

    // Send email with reset link
    const resetLink = `${process.env.BASE_URL}/reset_password?token=${resetToken}`;
    const fromEmail = process.env.EMAIL_FROM;

    resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset Password",
      html: `<p>Hello ${username},
        if your forgot your password you can reset it! 
        Please click the button below to reset your password.</p>
        <a href="${resetLink}" style="padding: 10px 20px; 
        background-color: #4CAF50; color: white; text-decoration: none; 
        border-radius: 5px;">Reset Password</a>`
    });
    return res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- ********************************************* Reset Password *********************** --//
router.post("/api/reset_password", async (req, res) => {
  const { password, token } = req.body;

  // Password validation
  if (!validatePassword(password)) {
    return res.status(400).json({
      error: "Password must be 8-13 characters"
        + " and contain at least one uppercase letter, one number, and one special character!"
    });
  }

  try {
    // Find user by reset token
    const user = await db.get(`SELECT * FROM users WHERE reset_token = ?`, [token]);
    if (!user) {
      return res.status(404).json({ error: "Invalid or expired reset token!" });
    }
    // valid token until timestamp is over
    const resetTimestamp = user.reset_timestamp || 0;
    const currentTimestamp = Date.now();
    const expirationTime = 10 * 60 * 1000;

    // Token expire after 10 minutes
    if (currentTimestamp - resetTimestamp > expirationTime) {
      return res.status(400).json({ error: "Password reset link has expired!" });
    }

    // Reset user's password and remove reset token
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(`UPDATE users SET 
                  password = ?, 
                  reset_token = NULL, 
                  reset_timestamp = NULL 
                  WHERE id = ?`,
      [hashedPassword, user.id]);
    return res.status(200).json({ message: "Password reset successful!" });
  } catch (eror) {
    console.error("Error resetting password: ", eror);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- *************************************** Signout *********************** --//
router.post("/api/signout", async (req, res) => {
  const sessionId = req.sessionID;

  try {
    // Update session ID to null in the db for user with matching session ID
    await db.run(`UPDATE users SET session_id = NULL WHERE session_id = ?`, [sessionId]);

    req.session.destroy((error) => {
      if (error) {
        console.error("Error destroying session: ", error);
        return res.status(500).send("Error logging out");
      } else {
        return res.status(200).json({ message: "Sign out successful!" });
      }
    });
  } catch (error) {
    console.error("Error signing out: ", error);
    return res.status(500).send("Error logging out");
  }
});

export default router;