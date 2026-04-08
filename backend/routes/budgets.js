const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// GET budgets with spent amounts for current month
router.get('/', auth, async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const budgets = await Budget.find({ user: req.user.id, month });

    // Calculate spent per category for the month
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $regex: `^${month}` }
    });

    const spentByCategory = {};
    expenses.forEach(e => {
      spentByCategory[e.category] = (spentByCategory[e.category] || 0) + e.amount;
    });

    const result = budgets.map(b => ({
      ...b.toObject(),
      spent: spentByCategory[b.category] || 0
    }));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST create or update budget
router.post('/', auth, async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    let budget = await Budget.findOne({ user: req.user.id, category, month });
    if (budget) {
      budget.limit = limit;
    } else {
      budget = new Budget({ user: req.user.id, category, limit, month });
    }
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ msg: 'Budget not found' });
    budget.limit = req.body.limit;
    await budget.save();
    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ msg: 'Budget not found' });
    res.json({ msg: 'Budget deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;