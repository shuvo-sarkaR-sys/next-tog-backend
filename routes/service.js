const express = require('express');
const Service = require('../models/ServicePost');
const { upload } = require('../middleware/fileUpload.js');

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const newService = new Service({ title, description, imageUrl });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.get('/', async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const updateData = { title, description };
  if (imageUrl) updateData.imageUrl = imageUrl;

  const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
  res.json(service);
});

router.delete('/:id', async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Service deleted successfully' });
});

module.exports = router;