import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { sendContactEmailToAdmin, sendContactConfirmationToUser } from '../services/email.js';

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

      // Send emails to admin (wait for it to complete to ensure it's sent)
      console.log('📧 Sending contact email to admin...');
      const emailSent = await sendContactEmailToAdmin({ name, email, content });
      if (emailSent) {
        console.log('✅ Contact email sent to admin successfully');
      } else {
        console.warn('⚠️  Contact email to admin was not sent (check email configuration)');
      }
      
      // Wait a bit to avoid rate limiting (Resend allows 2 requests per second)
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Send confirmation to user (don't wait, but with delay to avoid rate limit)
      sendContactConfirmationToUser(email, name).catch(err => {
        if (err.message?.includes('rate limit') || err.message?.includes('Too many requests')) {
          console.warn('⚠️  Rate limit reached for user confirmation email. Will retry later.');
        } else {
          console.error('Failed to send confirmation email to user:', err);
        }
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
