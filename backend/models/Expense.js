const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);