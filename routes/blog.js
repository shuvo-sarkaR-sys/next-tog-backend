 
const express = require('express');
const BlogPost = require('../models/BlogPost.js');
const { upload } = require('../middleware/upload.js'); // Cloudinary setup
const router = express.Router();

// Get a single blog post
router.get('/:id', async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new blog post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const imageUrl = req.file.path || req.file.secure_url || req.file.url; // Cloudinary URL

    const newPost = new BlogPost({
      title,
      date: date || Date.now(),
      description,
      imageUrl
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating blog:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Update a blog post
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const imageUrl = req.file?.path; // Cloudinary URL if new image uploaded

    const updateData = { title, date, description };
    if (imageUrl) updateData.imageUrl = imageUrl;

    const post = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(post);
  } catch (err) {
    console.error('Error updating blog:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Delete image from Cloudinary
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    // Delete blog post from DB
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


module.exports = router;
