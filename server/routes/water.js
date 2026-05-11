const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Water = require('../models/Water');

router.post('/add', auth, async (req, res) => {
  try {
    const { amount, date } = req.body;
    const newWater = new Water({
      userId: req.user.id,
      amount, date
    });
    const water = await newWater.save();
    res.json(water);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const waterLogs = await Water.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(waterLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   DELETE /api/water/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    let water = await Water.findById(req.params.id);
    if (!water) return res.status(404).json({ msg: 'Water log not found' });
    if (water.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Water.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Water log removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Water log not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
