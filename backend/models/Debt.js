const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personName: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['lent', 'borrowed'], required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  notes: { type: String, default: '' },
  paidAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Debt', DebtSchema);