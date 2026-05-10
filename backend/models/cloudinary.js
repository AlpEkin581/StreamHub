const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Video storage
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'video',
    folder: 'streamhub/videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
    transformation: [{ quality: 'auto' }],
  },
});

// Image (thumbnail/avatar) storage
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: 'image',
    folder: 'streamhub/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1280, height: 720, crop: 'fill' }],
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { cloudinary, uploadVideo, uploadImage };
