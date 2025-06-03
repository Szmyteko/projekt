const mongoose = require('mongoose');

const StarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  imageUrl: String,
  constellations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Constellation' }]
});

module.exports = mongoose.model('Star', StarSchema);
