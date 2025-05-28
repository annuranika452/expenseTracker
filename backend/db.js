// backend/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "db",        // ← use Docker service name
  database: process.env.DB_NAME || "expenses",
  password: process.env.DB_PASSWORD || "yourpassword",
  port: parseInt(process.env.DB_PORT || "5432", 10),  // Container listens on 5432
});

module.exports = pool;




