import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../database/connection.js";
import { generateUniqueIdentifier } from "../util/security/generator.js";
import { validateUsername, validatePassword, validateEmail } from "../util/security/regex.js";
import "dotenv/config";
import {
  verifyEmailTemplate,
  expiredVerifyEmailTemplate,
  emailVerifiedTemplate,
  resetPasswordEmailTemplate,
} from "../util/email/template.js";
const router = Router();

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

//-- *************************************** SIGNUP *********************** --//
router.post("/api/signup", async (req, res) => {
  const { username, password, email } = req.body;

  // Username requirements
  if (!validateUsername(username)) {
    return res.status(400).json({
      error:
        "Username must be between 5 - 13 characters" +
        " and can only contain letters, numbers, underscores, or hyphens!",
    });
  }

  // Password validation
  if (!validatePassword(password)) {
    return res.status(400).json({
      error:
        "Password must be 8-13 characters" +
        " and contain at least one uppercase letter, one number, and one special character!",
    });
  }

  // Email validation
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email address!" });
  }

  try {
    const existingUser = await db.users.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already in use!" });
      } else {
        return res.status(400).json({ error: "Email address is already in use!" });
      }
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = generateUniqueIdentifier();
    const verificationKey = `verify_${verificationToken}`; // unique key for verification token

    const expirationTimestamp = Date.now() + 10 * 60 * 1000;

    // Insert user into db
    await db.users.insertOne({
      username: username,
      password: hashedPassword,
      email: email,
      is_signed_up: true,
      verified: false,
      session_id: null,
      verification_token: verificationToken,
      verification_key: verificationKey,
      expiration_timestamp: expirationTimestamp,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false,
    });

    const verificationLink = `${process.env.BASE_URL}/api/verify?uid=${verificationToken}`;

    const verificationEmail = process.env.VERIFY_EMAIL;
    resend.emails.send({
      from: verificationEmail,
      to: email,
      subject: "Verify Your Email",
      html: verifyEmailTemplate(username, verificationLink),
    });

    const newUser = await db.users.findOne({ username: username });

    return res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    console.error("Error creating user: ", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- *************************************** VERIFY *********************** --//
router.get("/api/verify", async (req, res) => {
  const { uid } = req.query;

  try {
    const user = await db.users.findOne({ verification_token: uid });

    if (!user) {
      return res.status(400).json({ error: "Verification link is invalid!" });
    }

    const { verification_key, email, expiration_timestamp } = user;

    if (!verification_key || !email || !expiration_timestamp) {
      return res.status(400).json({ error: "Verification link is invalid!" });
    }

    const currentTime = Date.now();

    if (currentTime > expiration_timestamp) {
      return res.status(400).send(expiredVerifyEmailTemplate);
    }

    if (verification_key === `verify_${uid}`) {
      await db.users.updateOne({ verification_token: uid }, { $set: { verified: true } });

      return res.status(200).send(emailVerifiedTemplate);
    } else {
      return res.status(400).json({ error: "Invalid token!" });
    }
  } catch (error) {
    console.error("Error verifying email: ", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- *************************************** LOGIN *********************** --//
router.post("/api/login", async (req, res) => {
  // console.log("Received login request:", req.body);
  const { username, password } = req.body;

  // find user by username
  const user = await db.users.findOne({ username: username });

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

      try {
        // Saving sessionId to the user in the db
        await db.users.updateOne({ username: username }, { $set: { session_id: sessionId } });
      } catch (error) {
        console.error("Error updating user session: ", error);
        return res.status(500).json({ error: "Internal server error!" });
      }
      return res.status(200).json({ message: "Login successful!" });
    } else {
      return res.status(401).json({ error: "Invalid username or password!" });
    }
  } catch (error) {
    console.error("Error comparing passwords: ", error + " !");
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- *************************************** HAS LOGIN *********************** --//
router.get("/api/has_login", async (req, res) => {
  const sessionId = req.session.session_id;

  try {
    if (!sessionId) {
      return res.status(401).json({ isLoggedin: false });
    }

    const user = await db.users.findOne({ session_id: sessionId });

    if (user) {
      return res.status(200).json({ isLoggedin: true, user });
    } else {
      return res.status(401).json({ isLoggedin: false });
    }
  } catch (error) {
    console.error("Error checking login status: ", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- *************************************** HAS LOGIN *********************** --//
router.post("/api/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.users.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "Email not found!" });
    }
    const { username } = user;
    const resetToken = generateUniqueIdentifier();
    const resetTimestamp = Date.now();
    
    await db.users.updateOne({ email: email }, { $set: { reset_token: resetToken, reset_timestamp: resetTimestamp } });

    const resetLink = `${process.env.BASE_URL}/reset_password?token=${resetToken}`;
    const resetEmail = process.env.RESET_EMAIL;

    resend.emails.send({
      from: resetEmail,
      to: email,
      subject: "Reset Password",
      html: resetPasswordEmailTemplate(username, resetLink),
    });
    return res.status(200).json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- *************************************** RESET PASSWORD *********************** --//
router.post("/api/reset_password", async (req, res) => {
  const { password, token } = req.body;

  // Password validation
  if (!validatePassword(password)) {
    return res.status(400).json({
      error: `Password must be 8-13 characters and contain at least 
        one uppercase letter, one number, and one special character!`,
    });
  }
  try {
    const user = await db.users.findOne({ reset_token: token });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token!" });
    }

    // valid token until timestamp is over
    const resetTimestamp = user.reset_timestamp || 0;
    const expirationTimestamp = Date.now() + 10 * 60 * 1000;

    //token expire after 10 minutes
    if (resetTimestamp > expirationTimestamp) {
      return res.status(400).json({ error: "Password reset link has expired!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.users.updateOne(
      { reset_token: token },
      { $set: { password: hashedPassword, reset_token: null, reset_timestamp: null } }
    );

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (eror) {
    console.error("Error resetting password: ", eror);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- *************************************** LOGOUT *********************** --//
// Update session ID to null in the db for user with matching session ID
router.get("/api/logout", async (req, res) => {
  const sessionId = req.session.session_id;

  try {
    // Update session ID to null in the db for user with matching session ID
    await db.users.updateOne({ session_id: sessionId }, { $set: { session_id: null } });

    req.session.destroy((error) => {
      if (error) {
        console.error("Error destroying session: ", error);
        return res.status(500).send("Error logging out");
      } else {
        return res.status(200).json({ message: "log out successful!" });
      }
    });
  } catch (error) {
    console.error("Error logging out: ", error);
    return res.status(500).send("Error logging out");
  }
});

export default router;
