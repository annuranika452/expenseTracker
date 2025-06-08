// backend/db.js
const { Pool } = require("pg");
require("dotenv").config();


const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db",            // ✅ Must be "db"
  database: process.env.DB_NAME || "expenses",
  password: process.env.DB_PASSWORD || "yourpassword",
  port: process.env.DB_PORT || 5432,            // ✅ Inside container, not 5433
});

module.exports = pool;







