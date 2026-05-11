const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Sleep = require('../models/Sleep');

router.post('/add', auth, async (req, res) => {
  try {
    const { duration, quality, date } = req.body;
    const newSleep = new Sleep({
      userId: req.user.id,
      duration, quality, date
    });
    const sleep = await newSleep.save();
    res.json(sleep);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const sleepLogs = await Sleep.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(sleepLogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   DELETE /api/sleep/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    let sleep = await Sleep.findById(req.params.id);
    if (!sleep) return res.status(404).json({ msg: 'Sleep log not found' });
    if (sleep.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Sleep.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Sleep log removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Sleep log not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
