const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
 imageUrl: { type: String, required: true }, // URL or path
  imagePublicId: {type: String, require: true},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ServicePost', serviceSchema);