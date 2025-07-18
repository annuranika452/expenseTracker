// backend/db.js
const path = require('path'); // Add this line
const dotenv = require('dotenv'); // Add this line

// Determine the path to the correct .env file
const envPath = process.env.NODE_ENV === "test"
  ? path.resolve(__dirname, ".env.test")
  : path.resolve(__dirname, ".env");

dotenv.config({ path: envPath }); // Use the resolved path

const { Pool } = require("pg");

console.log("Loading .env from:", envPath); // New debugging line
console.log("DB_USER:", process.env.DB_USER); // More debugging
console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // More debugging
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("NODE_ENV:", process.env.NODE_ENV);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;