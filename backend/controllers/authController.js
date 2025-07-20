// backend/controllers/authController.js
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hashedPassword]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser };
