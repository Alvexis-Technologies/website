const Log = require('../models/Log.model');

/**
 * Log Controller
 * Manages system activity and security logs
 */

// @desc    Get all logs with pagination and filters
// @route   GET /api/logs
// @access  Private/Admin
exports.getAllLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    // Filter by action
    if (req.query.action) {
      query.action = req.query.action;
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by user
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    
    // Date range filter
    if (req.query.startDate) {
      query.timestamp = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      query.timestamp = { ...query.timestamp, $lte: new Date(req.query.endDate) };
    }
    
    const logs = await Log.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Log.countDocuments(query);
    
    // Get statistics
    const stats = await Log.aggregate([
      { $group: {
        _id: null,
        totalLogs: { $sum: 1 },
        successCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
        failedCount: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
        warningCount: { $sum: { $cond: [{ $eq: ['$status', 'warning'] }, 1, 0] } }
      }}
    ]);
    
    // Group by action
    const actionStats = await Log.aggregate([
      { $group: {
        _id: '$action',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: logs,
      statistics: stats[0] || { totalLogs: 0, successCount: 0, failedCount: 0, warningCount: 0 },
      actionStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching logs',
      error: error.message
    });
  }
};

// @desc    Get recent logs
// @route   GET /api/logs/recent
// @access  Private/Admin
exports.getRecentLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const logs = await Log.find()
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Get recent logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent logs',
      error: error.message
    });
  }
};

// @desc    Get logs by user
// @route   GET /api/logs/user/:userId
// @access  Private/Admin
exports.getLogsByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const logs = await Log.find({ userId: req.params.userId })
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Log.countDocuments({ userId: req.params.userId });
    
    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user logs',
      error: error.message
    });
  }
};

// @desc    Get log statistics
// @route   GET /api/logs/statistics
// @access  Private/Admin
exports.getLogStatistics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    // Daily activity for last 7 days
    const dailyActivity = await Log.aggregate([
      { $match: { timestamp: { $gte: weekAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Action distribution
    const actionDistribution = await Log.aggregate([
      { $group: {
        _id: '$action',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    
    // Status distribution
    const statusDistribution = await Log.aggregate([
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        dailyActivity,
        actionDistribution,
        statusDistribution
      }
    });
  } catch (error) {
    console.error('Get log statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching log statistics',
      error: error.message
    });
  }
};