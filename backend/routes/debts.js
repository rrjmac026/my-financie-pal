const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Debt = require('../models/Debt');

// GET all debts for current user
router.get('/', auth, async (req, res) => {
  try {
    const debts = await Debt.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(debts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST create debt
router.post('/', auth, async (req, res) => {
  try {
    const { personName, amount, type, dueDate, notes } = req.body;
    const debt = new Debt({ user: req.user.id, personName, amount, type, dueDate, notes });
    await debt.save();
    res.json(debt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT update debt (also used for recording payments)
router.put('/:id', auth, async (req, res) => {
  try {
    const debt = await Debt.findOne({ _id: req.params.id, user: req.user.id });
    if (!debt) return res.status(404).json({ msg: 'Debt not found' });
    const fields = ['personName', 'amount', 'type', 'dueDate', 'notes', 'status', 'paidAmount'];
    fields.forEach(f => { if (req.body[f] !== undefined) debt[f] = req.body[f]; });
    // Auto-update status based on paid amount
    if (req.body.paidAmount !== undefined) {
      if (debt.paidAmount >= debt.amount) debt.status = 'paid';
      else if (debt.paidAmount > 0) debt.status = 'partial';
      else debt.status = 'pending';
    }
    await debt.save();
    res.json(debt);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE debt
router.delete('/:id', auth, async (req, res) => {
  try {
    const debt = await Debt.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!debt) return res.status(404).json({ msg: 'Debt not found' });
    res.json({ msg: 'Debt deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;