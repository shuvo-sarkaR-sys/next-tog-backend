// models/BlogPost.js
const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: {type: Date, default: Date.now},
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // URL or path
   
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
