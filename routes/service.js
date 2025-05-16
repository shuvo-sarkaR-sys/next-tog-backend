// const express = require('express');
// const Service = require('../models/ServicePost');
// const { upload } = require('../middleware/fileUpload.js');

// const router = express.Router();

// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
//     const newService = new Service({ title, description, imageUrl });
//     await newService.save();
//     res.status(201).json(newService);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create service' });
//   }
// });

// router.get('/', async (req, res) => {
//   const services = await Service.find().sort({ createdAt: -1 });
//   res.json(services);
// });

// router.put('/:id', upload.single('image'), async (req, res) => {
//   const { title, description } = req.body;
//   const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
//   const updateData = { title, description };
//   if (imageUrl) updateData.imageUrl = imageUrl;

//   const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
//   res.json(service);
// });

// router.delete('/:id', async (req, res) => {
//   await Service.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Service deleted successfully' });
// });

// module.exports = router;
const express = require('express');
const Service = require('../models/ServicePost');
const { upload } = require('../middleware/fileUpload.js'); // now using Cloudinary
const cloudinary = require('../middleware/cloudinary');

const router = express.Router();

// Create a service
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file?.path;
    const imagePublicId = req.file?.filename;

    const newService = new Service({
      title,
      description,
      imageUrl,
      imagePublicId
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.error('Error creating service:', err.message);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Update a service
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

    if (req.file) {
      const imageUrl = req.file.path;
      const imagePublicId = req.file.filename;
      updateData.imageUrl = imageUrl;
      updateData.imagePublicId = imagePublicId;
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedService);
  } catch (err) {
    console.error('Error updating service:', err.message);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    // Remove image from Cloudinary
    if (service.imagePublicId) {
      await cloudinary.uploader.destroy(service.imagePublicId);
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err.message);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;
