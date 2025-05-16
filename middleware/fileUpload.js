const multer = require('multer');
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary');
const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
  params: {
    folder: 'service_images', // your folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

  const upload = multer({ storage });
  module.exports = {upload}
