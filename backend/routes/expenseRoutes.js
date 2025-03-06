const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const expenseController = require("../controllers/expenseController");

router.get("/", (req, res) => {
    res.json({ message: "expense API is working!" });
});
// Add Expense
router.post("/", authMiddleware, expenseController.addExpense);

// Get Expenses
router.get("/", authMiddleware, expenseController.getExpenses);

module.exports = router;