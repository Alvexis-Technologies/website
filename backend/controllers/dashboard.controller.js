const User = require('../models/User.model');
const Log = require('../models/Log.model');

/**
 * Dashboard Controller
 * Provides analytics and statistics for dashboard
 */

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    
    // New users today
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Log statistics
    const totalLogs = await Log.countDocuments();
    const logsToday = await Log.countDocuments({
      timestamp: { $gte: today }
    });
    
    // Failed logins today
    const failedLoginsToday = await Log.countDocuments({
      action: 'login_failed',
      timestamp: { $gte: today }
    });
    
    // Recent activities
    const recentActivities = await Log.find()
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .limit(10);
    
    // User growth (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Activity by hour today
    const hourlyActivity = await Log.aggregate([
      { $match: { timestamp: { $gte: today } } },
      { $group: {
        _id: { $hour: '$timestamp' },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Log view dashboard action
    await Log.createLog({
      action: 'view_dashboard',
      userId: req.user.userId,
      userEmail: req.user.email,
      userRole: req.user.role,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      details: { timestamp: new Date() },
      status: 'success'
    });
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          admins: adminUsers,
          regular: regularUsers,
          newToday: newUsersToday
        },
        logs: {
          total: totalLogs,
          today: logsToday,
          failedLoginsToday: failedLoginsToday
        },
        recentActivities,
        userGrowth,
        hourlyActivity
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get system health
// @route   GET /api/dashboard/health
// @access  Private/Admin
exports.getSystemHealth = async (req, res) => {
  try {
    const startTime = process.uptime();
    
    const healthData = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
      version: process.version
    };
    
    res.status(200).json({
      success: true,
      data: healthData
    });
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system health',
      error: error.message
    });
  }
};