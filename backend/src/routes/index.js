import { Router } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Server health check endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'SchoolERP Backend API is healthy and operational',
    data: {
      status: 'UP',
      service: 'schoolerp-backend',
      timestamp: new Date().toISOString(),
      uptime: `${process.uptime().toFixed(2)}s`,
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// Future Phase Routes will be mounted here:
// router.use('/auth', authRoutes);
// router.use('/classes', classRoutes);
// router.use('/parents', parentRoutes);
// router.use('/students', studentRoutes);
// router.use('/attendance', attendanceRoutes);
// router.use('/fees', feeRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/dashboard', dashboardRoutes);
// router.use('/reports', reportRoutes);
// router.use('/settings', settingRoutes);
// router.use('/audit-logs', auditLogRoutes);

export default router;
