const express = require('express');
const BlogPost = require('../models/BlogPost.js');
const { upload } = require('../middleware/upload.js');

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const newPost = new BlogPost({ title, description, imageUrl });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});
 
router.get('/', async (req, res) => {
  const posts = await BlogPost.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const updateData = { title, description };
  if (imageUrl) updateData.imageUrl = imageUrl;

  const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(post);
});

router.delete('/:id', async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
