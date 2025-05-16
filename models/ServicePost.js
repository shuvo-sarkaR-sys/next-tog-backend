const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  imagePublicId: {type: String},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ServicePost', serviceSchema);