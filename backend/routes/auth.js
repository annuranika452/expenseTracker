const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashed]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "User already exists or invalid" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (!userRes.rows.length) return res.status(401).json({ error: "Invalid email" });

  const user = userRes.rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
