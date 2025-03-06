const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  rate: { type: Number, required: true },
  years: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Investment", investmentSchema);