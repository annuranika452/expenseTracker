/// backend/app.js

const express = require("express");
const cors = require("cors");

const app = express();

// CORS + middleware setup
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
const expensesRoutes = require("./routes/expenses");
app.use("/api/expenses", expensesRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Backend server is up!");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
