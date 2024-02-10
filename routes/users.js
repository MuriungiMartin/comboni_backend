const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator"); // Assuming you installed express-validator for validation

// Define validation rules for each route
const validateCreate = [
  check("name").not().isEmpty(),
  check("email").isEmail(),
  check("password").isLength({ min: 8 }),
  check("phone").isMobilePhone("any", { strictMode: false }), // Optional validation
  check("role").isIn(["admin", "user"]), // Optional validation
];

const validateUpdate = [
  check("name").optional(), // Optional update
  check("email").optional().isEmail(),
  check("password").optional().isLength({ min: 8 }),
  check("phone").optional().isMobilePhone("any", { strictMode: false }), // Optional validation
  check("role").optional().isIn(["admin", "user"]), // Optional validation
];

// Create user (POST)
router.post("/", validateCreate, async (req, res) => {
  // Validate data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const securityCode = 'M2Y4ZTVkOTEtMWE5Yi00YzVlLTljNGYtOTFkNmM2N2ZiMmExOjI4ZjhjNjIzLWUwMjItNGU3Ny1hYWIzLWViM2I2ZmQyZjg5ZA==|2024-02-09T20:26:18Z';//Math.floor(1000 + Math.random() * 9000);

  try {
    const [result] = await db.query(
      "INSERT INTO Users (username, email, password,phone,role) VALUES (?, ?, ?,?,?)",
      [req.body.name, req.body.email, hashedPassword,req.body.phone,req.body.role]
    );

    // Generate JWT
    const token = jwt.sign({ userId: result.insertId }, securityCode /* process.env.SECRET_KEY */);

    res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error creating user: ${error.message}`);
  }
});

// Get all users (GET)
// router.get("/", async (req, res) => {
//   try {
//     const [users] = await db.query("SELECT * FROM users");
//     res.send(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error getting users");
//   }
// });

// Get user by ID (GET by ID)
router.get("/", async (req, res) => {
  try {
    const [user] = await db.query("SELECT * FROM Users WHERE username = ?", [
      req.body.name,
    ]);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting user");
  }
});

// Update user (PUT)
router.put("/:id", validateUpdate, async (req, res) => {
  // Validate data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Hash password if provided
  let hashedPassword = null;
  if (req.body.password) {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  }

  try {
    await db.query(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [req.body.name, req.body.email, hashedPassword, req.params.id]
    );
    res.send("User updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

// Delete user (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.send("User deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
});

module.exports = router;
