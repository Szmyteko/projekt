const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image_url: String,
  vegetables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vegetable' }]
});

module.exports = mongoose.model('Category', CategorySchema);
