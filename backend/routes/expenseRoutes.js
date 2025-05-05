// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const { getExpenses } = require('../controllers/expensesController');

router.get('/', getExpenses);

module.exports = router;
