// backend/app.js
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const expensesRoutes = require("./routes/expenses");
app.use("/api/expenses", expensesRoutes); 

const ocrRoute = require('./routes/ocr');
app.use('/api/ocr', ocrRoute);

app.get("/", (req, res) => {
  res.send("Backend is up!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
