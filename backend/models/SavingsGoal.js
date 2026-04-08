const mongoose = require('mongoose');

const SavingsGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  target: { type: Number, required: true },
  saved: { type: Number, default: 0 },
  deadline: { type: String, required: true },
  icon: { type: String, default: '🎯' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavingsGoal', SavingsGoalSchema);