import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
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
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { category, title, description } = req.body;
    const file = req.file;

    // Determine media type
    const isVideo = file.mimetype.startsWith('video/');
    const type = isVideo ? 'video' : 'image';

    // Upload to Cloudinary
    const uploadOptions = {
      resource_type: isVideo ? 'video' : 'image',
      folder: 'vaad-mevakshei-hashem',
    };

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    // Save to database
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

    res.status(201).json({
      success: true,
      data: media,
    });
  } catch (error) {
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

    res.json({
      success: true,
      data: media,
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
