const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

router.post('/add', auth, async (req, res) => {
  try {
    const { exercise, duration, caloriesBurned, date } = req.body;
    const newWorkout = new Workout({
      userId: req.user.id,
      exercise, duration, caloriesBurned, date
    });
    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ msg: 'Workout not found' });
    if (workout.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    workout = await Workout.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ msg: 'Workout not found' });
    if (workout.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Workout.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Workout removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
