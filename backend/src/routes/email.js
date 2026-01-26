import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { sendReplyToUser } from '../services/email.js';

const router = express.Router();
const prisma = new PrismaClient();

// Send email (admin only) - using sendReplyToUser for consistency
router.post(
  '/send',
  authenticateToken,
  [
    body('to').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('html').trim().notEmpty().withMessage('Email content is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { to, subject, html, name } = req.body;

      const result = await sendReplyToUser(
        to,
        name || 'לקוח',
        subject,
        html
      );

      if (result) {
        res.json({
          success: true,
          message: 'אימייל נשלח בהצלחה',
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'שגיאה בשליחת אימייל. בדוק את הגדרות האימייל.',
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// Send email to message sender (admin only)
router.post(
  '/reply/:messageId',
  authenticateToken,
  [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('html').trim().notEmpty().withMessage('Email content is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { messageId } = req.params;
      const { subject, html, text } = req.body;

      // Get message
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      // Send email
      const result = await sendReplyToUser(
        message.email,
        message.name,
        subject,
        html
      );

      if (result) {
        // Mark message as handled
        await prisma.message.update({
          where: { id: messageId },
          data: { handled: true },
        });

        res.json({
          success: true,
          message: 'תגובה נשלחה בהצלחה',
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'שגיאה בשליחת אימייל. בדוק את הגדרות האימייל.',
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
