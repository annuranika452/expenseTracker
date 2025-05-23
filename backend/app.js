// backend/app.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const expensesRoutes = require("./routes/expenses");
app.use("/api/expenses", expensesRoutes);

app.get("/", (req, res) => {
  res.send("Backend server is up!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

