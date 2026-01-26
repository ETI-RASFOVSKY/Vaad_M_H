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
      console.log('📧 Reply email request received:', {
        messageId: req.params.messageId,
        subject: req.body.subject,
        hasHtml: !!req.body.html,
      });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('❌ Validation errors:', errors.array());
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { messageId } = req.params;
      const { subject, html } = req.body;

      // Get message
      console.log('🔍 Fetching message:', messageId);
      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        console.error('❌ Message not found:', messageId);
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      console.log('✅ Message found:', {
        email: message.email,
        name: message.name,
      });

      // Send email
      console.log('📤 Sending email to:', message.email);
      const result = await sendReplyToUser(
        message.email,
        message.name,
        subject,
        html
      );

      console.log('📧 Email send result:', result);

      if (result) {
        // Mark message as handled
        await prisma.message.update({
          where: { id: messageId },
          data: { handled: true },
        });

        console.log('✅ Email sent successfully and message marked as handled');
        res.json({
          success: true,
          message: 'תגובה נשלחה בהצלחה',
        });
      } else {
        console.error('❌ Email send failed - result is false');
        res.status(500).json({
          success: false,
          error: 'שגיאה בשליחת אימייל. בדוק את הגדרות האימייל.',
        });
      }
    } catch (error) {
      console.error('❌ Error in reply email route:', error);
      console.error('Error stack:', error.stack);
      next(error);
    }
  }
);

export default router;
