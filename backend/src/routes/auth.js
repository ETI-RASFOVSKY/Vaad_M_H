import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';

const router = express.Router();
const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return res.status(403).json({ 
          success: false, 
          error: 'האימייל לא אומת. אנא אמתו את האימייל שלכם תחילה דרך דף ההרשמה.',
          requiresVerification: true
        });
      }

      // Check if user has password (not Google-only user)
      if (!user.passwordHash) {
        return res.status(401).json({ 
          success: false, 
          error: 'Please use Google sign-in for this account.' 
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify token
router.get('/verify', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, error: 'Invalid token' });
      }
      res.json({ success: true, user: decoded });
    });
  } catch (error) {
    next(error);
  }
});

// Register new admin
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'User with this email already exists' 
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Generate verification code
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user (not verified yet)
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          emailVerified: false,
          verificationCode,
          verificationCodeExpires,
        },
      });

      // Send verification email
      await sendVerificationEmail(email, verificationCode);

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for verification code.',
        userId: user.id,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify email with code
router.post(
  '/verify-email',
  [
    body('email').isEmail().normalizeEmail(),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, code } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ success: false, error: 'Email already verified' });
      }

      if (user.verificationCode !== code) {
        return res.status(400).json({ success: false, error: 'Invalid verification code' });
      }

      if (!user.verificationCodeExpires || user.verificationCodeExpires < new Date()) {
        return res.status(400).json({ success: false, error: 'Verification code expired' });
      }

      // Verify email
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationCode: null,
          verificationCodeExpires: null,
        },
      });

      res.json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Resend verification code
router.post(
  '/resend-verification',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      if (user.emailVerified) {
        return res.status(400).json({ success: false, error: 'Email already verified' });
      }

      // Generate new verification code
      const verificationCode = generateVerificationCode();
      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCode,
          verificationCodeExpires,
        },
      });

      await sendVerificationEmail(email, verificationCode);

      res.json({
        success: true,
        message: 'Verification code sent to your email',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Google OAuth login/register
router.post(
  '/google',
  [
    body('token').notEmpty().withMessage('Google token is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { token } = req.body;

      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ success: false, error: 'Invalid Google token' });
      }

      const { email, sub: googleId, name } = payload;

      if (!email) {
        return res.status(400).json({ success: false, error: 'Email not provided by Google' });
      }

      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        // Update Google ID if not set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId },
          });
        }

        // Verify email automatically for Google users
        if (!user.emailVerified) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: true },
          });
        }
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            email,
            googleId,
            emailVerified: true, // Google emails are pre-verified
            passwordHash: null, // No password for Google users
          },
        });
      }

      // Generate JWT token
      const jwtToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token: jwtToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Request password reset
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Don't reveal if user exists or not (security best practice)
      if (!user || !user.passwordHash) {
        return res.json({
          success: true,
          message: 'If the email exists, a reset code has been sent',
        });
      }

      // Generate reset code
      const resetCode = generateVerificationCode();
      const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordCode: resetCode,
          resetPasswordCodeExpires: resetCodeExpires,
        },
      });

      const emailSent = await sendPasswordResetEmail(email, resetCode);
      
      if (!emailSent) {
        console.warn(`⚠️  Password reset code for ${email}: ${resetCode}`);
        console.warn('⚠️  Email was not sent. Check email configuration or verify domain in Resend.');
        console.warn('⚠️  For Resend: You need to verify a domain or use your account email address.');
      }

      res.json({
        success: true,
        message: 'If the email exists, a reset code has been sent',
        // In development, return code if email failed (for testing)
        ...(process.env.NODE_ENV === 'development' && !emailSent && { 
          debugCode: resetCode,
          debugMessage: 'Email not sent - Resend requires verified domain. Code: ' + resetCode
        }),
      });
    } catch (error) {
      next(error);
    }
  }
);

// Reset password with code
router.post(
  '/reset-password',
  [
    body('email').isEmail().normalizeEmail(),
    body('code').isString().trim().notEmpty().withMessage('Code is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, code, newPassword } = req.body;
      
      // Normalize code - remove spaces and convert to string
      const normalizedCode = String(code).trim().replace(/\s/g, '');

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      if (!user.resetPasswordCode) {
        return res.status(400).json({ success: false, error: 'No reset code found. Please request a new one.' });
      }

      if (user.resetPasswordCode !== normalizedCode) {
        return res.status(400).json({ success: false, error: 'קוד איפוס שגוי. אנא בדקו את הקוד שקיבלתם במייל.' });
      }

      if (!user.resetPasswordCodeExpires || user.resetPasswordCodeExpires < new Date()) {
        return res.status(400).json({ success: false, error: 'קוד איפוס פג תוקף. אנא בקשו קוד חדש.' });
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Update password and clear reset code
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetPasswordCode: null,
          resetPasswordCodeExpires: null,
        },
      });

      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
