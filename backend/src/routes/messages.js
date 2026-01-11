import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Create message (public)
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('content').trim().notEmpty().withMessage('Message content is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, email, content } = req.body;

      const message = await prisma.message.create({
        data: {
          name,
          email,
          content,
        },
      });

      res.status(201).json({
        success: true,
        message: 'הפנייה התקבלה',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get all messages (admin only)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

// Mark message as handled (admin only)
router.patch('/:id/handle', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await prisma.message.update({
      where: { id },
      data: { handled: true },
    });

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
