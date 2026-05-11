const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Meal = require('../models/Meal');

// @route   POST /api/meals/add
router.post('/add', auth, async (req, res) => {
  try {
    const { mealName, calories, protein, carbs, fats, date } = req.body;
    const newMeal = new Meal({
      userId: req.user.id,
      mealName, calories, protein, carbs, fats, date
    });
    const meal = await newMeal.save();
    res.json(meal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/meals
router.get('/', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/meals/:id
router.put('/:id', auth, async (req, res) => {
  try {
    let meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ msg: 'Meal not found' });
    if (meal.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    meal = await Meal.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(meal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/meals/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    let meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ msg: 'Meal not found' });
    if (meal.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Meal.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Meal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
