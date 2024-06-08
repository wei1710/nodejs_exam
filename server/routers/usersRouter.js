import { Router } from "express";
import db from "../database/connection.js";

const router = Router();

//-- *********************************** GET ALL USERS *********************** --//
router.get("/api/users", async (req, res) => {
  try {
    const users = await db.users.find().toArray();
    res.json(users);
  } catch(error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//-- *********************************** FIND USER BY EMAIL *********************** --//
router.get("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: "Email doesn't exist" });
  }
  try {
    const users = await db.users.find().toArray();
    const findUser = users.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
    res.json(findUser);
  } catch(error) {
    console.error("Error fetching users by email:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//-- *********************************** UPDATE USER *********************** --//
router.put("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  const { newEmail, newUsername } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!newEmail && !newUsername) {
    return res.status(400).json({ error: "New email or username is required"});
  }

  try {
    const updateFields = {};
    if (newEmail) updateFields.email = newEmail;
    if (newUsername) updateFields.username = newUsername;

    const updateUser = await db.users.updateOne({ email: email }, { $set: updateFields });
    if (updateUser.matchedCount === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch(error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//-- *********************************** DELETE USER *********************** --//
router.delete("/api/users/:email", async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ error: "Email doesn't exist" });
  }
  try {
    const deleteUser = await db.users.deleteOne({ email: email });
    if (deleteUser.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted succesfully" });
  } catch(error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;