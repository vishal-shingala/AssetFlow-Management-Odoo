import { getDashboardStats } from '../services/dashboardService.js';
import logger from '../../../config/logger.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user?.user_id || null;
    const data = await getDashboardStats(userId);
    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data
    });
  } catch (error) {
    logger.error('Error in getDashboardData:', error);
    next(error);
  }
};
