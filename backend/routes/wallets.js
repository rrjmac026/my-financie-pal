const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wallet = require('../models/Wallet');

// GET all wallets for current user
router.get('/', auth, async (req, res) => {
  try {
    const wallets = await Wallet.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(wallets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST create wallet
router.post('/', auth, async (req, res) => {
  try {
    const { name, balance, icon, color } = req.body;
    const wallet = new Wallet({ user: req.user.id, name, balance, icon, color });
    await wallet.save();
    res.json(wallet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT update wallet
router.put('/:id', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ _id: req.params.id, user: req.user.id });
    if (!wallet) return res.status(404).json({ msg: 'Wallet not found' });
    const fields = ['name', 'balance', 'icon', 'color'];
    fields.forEach(f => { if (req.body[f] !== undefined) wallet[f] = req.body[f]; });
    await wallet.save();
    res.json(wallet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE wallet
router.delete('/:id', auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!wallet) return res.status(404).json({ msg: 'Wallet not found' });
    res.json({ msg: 'Wallet deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;