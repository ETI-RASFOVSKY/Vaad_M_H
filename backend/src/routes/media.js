import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Fix SSL certificate issues in development (for Cloudinary)
// This is needed when there's a proxy or firewall interfering with SSL
if (process.env.NODE_ENV === 'development') {
  // Disable SSL verification for all HTTPS requests in development
  // This fixes "self-signed certificate in certificate chain" error
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('⚠️  SSL verification disabled for development (Cloudinary)');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB (increased for larger video files)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

// Upload media (admin only)
router.post('/upload', authenticateToken, upload.single('file'), async (req, res, next) => {
  try {
    console.log('📤 Upload request received');
    console.log('File:', req.file ? { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : 'No file');
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { category, title, description } = req.body;
    const file = req.file;

    // Determine media type
    const isVideo = file.mimetype.startsWith('video/');
    const type = isVideo ? 'video' : 'image';
    console.log(`📹 Media type: ${type}`);

    // Check Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary credentials missing');
      return res.status(500).json({ 
        success: false, 
        error: 'Cloudinary configuration missing. Please check your .env file.' 
      });
    }

    // Upload to Cloudinary
    console.log('☁️ Uploading to Cloudinary...');
    const uploadOptions = {
      resource_type: isVideo ? 'video' : 'image',
      folder: 'vaad-mevakshei-hashem',
    };

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result.public_id);
            resolve(result);
          }
        }
      );
      uploadStream.end(file.buffer);
    });

    // Save to database
    console.log('💾 Saving to database...');
    const media = await prisma.media.create({
      data: {
        url: result.secure_url,
        cloudinaryId: result.public_id,
        type,
        category: category || null,
        title: title || null,
        description: description || null,
      },
    });
    console.log('✅ Media saved:', media.id);

    // Ensure consistent response format
    const formattedMedia = {
      id: media.id,
      url: media.url,
      cloudinaryId: media.cloudinaryId || null,
      type: media.type,
      category: media.category || null,
      title: media.title || null,
      description: media.description || null,
      createdAt: media.createdAt,
    };

    res.status(201).json({
      success: true,
      data: formattedMedia,
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    next(error);
  }
});

// Get all media (public, with optional filters)
router.get('/', async (req, res, next) => {
  try {
    const { type, category } = req.query;

    const where = {};
    if (type) where.type = type;
    if (category) where.category = category;

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Ensure consistent response format - map to ensure all fields are present
    const formattedMedia = media.map(item => ({
      id: item.id,
      url: item.url,
      cloudinaryId: item.cloudinaryId || null,
      type: item.type,
      category: item.category || null,
      title: item.title || null,
      description: item.description || null,
      createdAt: item.createdAt,
    }));

    res.json({
      success: true,
      data: formattedMedia,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    // Provide more helpful error messages
    if (error.code === 'P1001') {
      return res.status(500).json({
        success: false,
        error: 'Database connection error. Please check your DATABASE_URL in .env file.',
      });
    }
    if (error.code === 'P2025' || error.message?.includes('does not exist')) {
      return res.status(500).json({
        success: false,
        error: 'Database tables not found. Please run: npx prisma migrate dev',
      });
    }
    next(error);
  }
});

// Delete media (admin only)
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return res.status(404).json({ success: false, error: 'Media not found' });
    }

    // Delete from Cloudinary
    if (media.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(media.cloudinaryId, {
          resource_type: media.type === 'video' ? 'video' : 'image',
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
      }
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
