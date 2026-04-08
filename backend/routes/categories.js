const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  next();
};

// @route GET /api/categories
// @desc Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('name').lean();
    res.json(categories.map(({ _id, ...rest }) => ({ id: _id, ...rest })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/categories
// @desc Create category
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const category = new Category({ name, icon, color });
    await category.save();
    res.json({ id: category._id, name: category.name, icon: category.icon, color: category.color });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route PUT /api/categories/:id
// @desc Update category
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, icon, color }, { new: true, runValidators: true }).lean();
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json({ id: category._id, name: category.name, icon: category.icon, color: category.color });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route DELETE /api/categories/:id
// @desc Delete category
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json({ msg: 'Category deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
