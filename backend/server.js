const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));
app.use("/api/investments", require("./routes/investmentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
// Start Server
const PORT = process.env.PORT || 5000;
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
