const mongoose = require('mongoose');

const SleepSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true },
  quality: { type: String, default: 'Good' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Sleep', SleepSchema);
