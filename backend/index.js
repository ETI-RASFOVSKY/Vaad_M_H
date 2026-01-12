import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import mediaRoutes from './routes/media.js';
import messageRoutes from './routes/messages.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CSP Middleware - Allow browser extensions and necessary resources
app.use((req, res, next) => {
  // Set Content Security Policy that allows browser extensions
  // 'unsafe-inline' and 'unsafe-eval' are needed for some browser extensions
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https: http:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; " +
    "style-src 'self' 'unsafe-inline' https: http: data:; " +
    "img-src 'self' data: https: http: blob:; " +
    "font-src 'self' data: https: http:; " +
    "connect-src 'self' https: http: ws: wss:; " +
    "frame-src 'self' https: http:; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
  );
  next();
});

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development, can be restricted in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - handle direct backend access
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vaad Backend API', 
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      media: '/api/media',
      messages: '/api/messages'
    },
    docs: 'This is the backend API. Use the frontend application to interact with this API.'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Error handling
app.use(errorHandler);

// Start server for local development
// Note: For Vercel, use api/index.js instead
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
