const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Wallet = require('../models/Wallet');

const getWalletId = wallet => {
  if (!wallet) return null;
  return typeof wallet === 'string' ? wallet : wallet._id || wallet.id;
};

// GET all expenses for current user
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1, createdAt: -1 }).populate('wallet', 'name');
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST create expense
router.post('/', auth, async (req, res) => {
  try {
    const { amount, category, date, description, paymentMethod, wallet: walletId } = req.body;
    if (!walletId) return res.status(400).json({ msg: 'Wallet is required' });
    const wallet = await Wallet.findOne({ _id: walletId, user: req.user.id });
    if (!wallet) return res.status(400).json({ msg: 'Wallet not found' });

    wallet.balance -= amount;
    await wallet.save();

    const expense = new Expense({ user: req.user.id, amount, category, date, description, paymentMethod, wallet: walletId });
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    const { amount, category, date, description, paymentMethod, wallet: walletId } = req.body;
    if (!walletId) return res.status(400).json({ msg: 'Wallet is required' });

    const newWallet = await Wallet.findOne({ _id: walletId, user: req.user.id });
    if (!newWallet) return res.status(400).json({ msg: 'Wallet not found' });

    const oldAmount = expense.amount;
    const oldWalletId = getWalletId(expense.wallet);

    if (oldWalletId && oldWalletId.toString() !== walletId.toString()) {
      const oldWallet = await Wallet.findOne({ _id: oldWalletId, user: req.user.id });
      if (oldWallet) {
        oldWallet.balance += oldAmount;
        await oldWallet.save();
      }
      newWallet.balance -= amount;
      await newWallet.save();
    } else {
      const amountDiff = amount - oldAmount;
      newWallet.balance -= amountDiff;
      await newWallet.save();
    }

    Object.assign(expense, { amount, category, date, description, paymentMethod, wallet: walletId });
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    const walletId = getWalletId(expense.wallet);
    if (walletId) {
      const wallet = await Wallet.findOne({ _id: walletId, user: req.user.id });
      if (wallet) {
        wallet.balance += expense.amount;
        await wallet.save();
      }
    }

    await expense.remove();
    res.json({ msg: 'Expense deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;