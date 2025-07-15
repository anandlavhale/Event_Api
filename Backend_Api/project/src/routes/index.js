import express from 'express';
import userRoutes from './userRoutes.js';
import eventRoutes from './eventRoutes.js';
import registrationRoutes from './registrationRoutes.js';

const router = express.Router();

// API routes
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/registrations', registrationRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;