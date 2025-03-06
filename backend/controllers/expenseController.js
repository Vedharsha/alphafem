const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
  const { category, amount, notes } = req.body;
  try {
    const expense = new Expense({ userId: req.user.id, category, amount, notes });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};