// backend/routes/expenses.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: err.message });
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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Delete request for ID:", id);

  try {
    const result = await pool.query("DELETE FROM expenses WHERE id = $1", [id]);
    console.log("Rows deleted:", result.rowCount);
    res.status(204).send();
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



