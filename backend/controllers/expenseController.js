// backend/controllers/expensesController.js
const pool = require('../db');

exports.getExpenses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
