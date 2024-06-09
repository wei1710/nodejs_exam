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

//-- *************************************** HAS LOGIN *********************** --//
router.get("/api/has_login", async (req, res) => {

  const sessionId = req.session.session_id;

  if (!sessionId) {
    return res.status(401).json({ isLoggedin: false });
  }

  try {
    const user = await db.users.findOne({ session_id: sessionId });

    if (user) {
      return res.status(200).json({
        isLoggedin: true, 
        user: { 
          username: user.username, 
          email: user.email, 
          is_admin: user.is_admin 
        } 
      });
    } else {
      return res.status(401).json({ isLoggedin: false });
    }
  } catch (error) {
    console.error("Error checking login status: ", error);
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

//-- *************************************** LOGOUT *********************** --//
router.get("/api/logout", async (req, res) => {
  const sessionId = req.session.session_id;

  try {
    const result = await db.users.updateOne({ session_id: sessionId }, { $set: { session_id: null } });

    if (result.modifiedCount === 0) {
      console.error("No user found with the given session ID");
      return res.status(404).send("No user found with the given session ID");
    }

    req.session.destroy((error) => {
      if (error) {
        console.error("Error destroying session: ", error);
        return res.status(500).send("Error logging out");
      } else {
        res.clearCookie("connect.sid"); // Clear the session cookie
        return res.status(200).json({ message: "Log out successful!" });
      }
    });
  } catch (error) {
    console.error("Error logging out: ", error);
    return res.status(500).send("Error logging out");
  }
});

//-- *************************************** SIGNUP *********************** --//
router.post("/api/signup", async (req, res) => {
  const { username, password, email } = req.body;

  //-- *************************************** USERNAME REQUIREMENTS *********************** --//
  if (!validateUsername(username)) {
    return res.status(400).json({
      error:
        "Username must be between 5 - 13 characters" +
        " and can only contain letters, numbers, underscores, or hyphens!",
    });
  }

  //-- *************************************** PASSWORD VALIDATION *********************** --//
  if (!validatePassword(password)) {
    return res.status(400).json({
      error:
        "Password must be 8-13 characters" +
        " and contain at least one uppercase letter, one number, and one special character!",
    });
  }

  //-- *************************************** EMAIL VALIDATION *********************** --//
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
    //-- *************************************** HASH PASSWORD *********************** --//
    const hashedPassword = await bcrypt.hash(password, 10);

    //-- *************************************** GENERATE VERIFICATION TOKEN *********************** --//
    const verificationToken = generateUniqueIdentifier();

    const verificationKey = `verify_${verificationToken}`; // unique key for verification token

    const expirationTimestamp = Date.now() + 10 * 60 * 1000;

    //-- *************************************** INSERT USER INTO DB *********************** --//
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

    //-- *************************************** VERIFICATION EMAIL *********************** --//
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

//-- *************************************** LOGIN *********************** --//
router.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  //-- *************************************** FIND USER BY USERNAME *********************** --//
  const user = await db.users.findOne({ username: username });

  if (!user) {
    return res.status(401).json({ error: "Invalid username or password!" });
  }

  try {
    //-- ************************ COMPARE PASSWORD WITH HASHED PASSWORD *********************** --//
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      // check if user's email is verified
      if (!user.verified) {
        return res.status(402).json({ error: "Please verify your email!" });
      }

      const sessionId = generateUniqueIdentifier();
      req.session.session_id = sessionId;
      req.session.is_admin = user.is_admin;

      try {
        //-- ********************* SAVE SESSION ID TO THE USER IN THE DB *********************** --//
        await db.users.updateOne({ username: username }, { $set: { session_id: sessionId } });

        req.session.save((error) => {
          if (error) {
            console.error("Error saving session: ", error);
            return res.status(500).json({ error: "Internal server error!" });
          }
          return res.status(200).json({
            message: "Login successful!",
            user: {
              username: user.username,
              email: user.email,
              is_admin: user.is_admin
            }
          });
        });

      } catch (error) {
        console.error("Error updating user session: ", error);
        return res.status(500).json({ error: "Internal server error!" });
      }
    } else {
      return res.status(401).json({ error: "Invalid username or password!" });
    }
  } catch (error) {
    console.error("Error comparing passwords: ", error + " !");
    return res.status(500).json({ error: "Internal server error!" });
  }
});

//-- *************************************** FORGOT PASSWORD *********************** --//
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

  //-- *************************************** PASSWORD VALIDATION *********************** --//
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

    //-- ********************** VALID TOKEN UNTIL TIMESTAMP IS OVER *********************** --//
    const resetTimestamp = user.reset_timestamp || 0;
    const expirationTimestamp = Date.now() + 10 * 60 * 1000;

    //-- ********************** TOKEN EXPIRE AFTER 10 MINUTES *********************** --//
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

export default router;
