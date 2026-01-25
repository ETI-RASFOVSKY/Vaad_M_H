import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Send email (admin only)
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

      const { to, subject, html, text } = req.body;

      const result = await sendEmail({
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      });

      if (result.success) {
        res.json({
          success: true,
          message: 'אימייל נשלח בהצלחה',
          data: result,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'שגיאה בשליחת אימייל',
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
      const result = await sendEmail({
        to: message.email,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''),
      });

      if (result.success) {
        // Mark message as handled
        await prisma.message.update({
          where: { id: messageId },
          data: { handled: true },
        });

        res.json({
          success: true,
          message: 'תגובה נשלחה בהצלחה',
          data: result,
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'שגיאה בשליחת אימייל',
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
