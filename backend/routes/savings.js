const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavingsGoal = require('../models/SavingsGoal');

// GET all savings goals for current user
router.get('/', auth, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST create goal
router.post('/', auth, async (req, res) => {
  try {
    const { name, target, saved, deadline, icon } = req.body;
    const goal = new SavingsGoal({ user: req.user.id, name, target, saved: saved || 0, deadline, icon });
    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT update goal
router.put('/:id', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    const fields = ['name', 'target', 'saved', 'deadline', 'icon'];
    fields.forEach(f => { if (req.body[f] !== undefined) goal[f] = req.body[f]; });
    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ msg: 'Goal not found' });
    res.json({ msg: 'Goal deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;