const Investment = require("../models/Investment");

// Calculate SIP
exports.calculateSIP = async (req, res) => {
  const { amount, rate, years } = req.body;
  try {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const futureValue =
      amount *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate));

    const investment = new Investment({
      userId: req.user.id,
      amount,
      rate,
      years,
    });
    await investment.save();

    res.json({
      totalInvestment: amount * months,
      estimatedReturns: futureValue - amount * months,
      totalValue: futureValue,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};