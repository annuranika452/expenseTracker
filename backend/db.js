// backend/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "",         // Fill if you set one
  port: 5433,           // Match Docker's mapped port
});

module.exports = pool;



