// backend/app.js
const express = require("express");
const cors = require("cors");
const path = require("path"); // ⬅️ Add this line

const app = express();
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json());

// 🔧 Serve static frontend files from ../frontend
app.use(express.static(path.join(__dirname, "..", "frontend"))); // Adjust path if needed

const expensesRoutes = require("./routes/expenses");
app.use("/api/expenses", expensesRoutes); 

const ocrRoute = require('./routes/ocr');
app.use('/api/ocr', ocrRoute);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is up!");
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  module.exports = app;
}
