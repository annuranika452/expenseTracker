// backend/routes/expenses.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err.message);         // log to backend logs
    res.status(500).json({ error: err.message });     // show error to client
  }
});


router.post("/", async (req, res) => {
  const { title, amount, category, date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO expenses (title, amount, category, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, amount, category, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Error adding expense");
  }
});

module.exports = router;

