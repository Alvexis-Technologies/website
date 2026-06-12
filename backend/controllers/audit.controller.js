const AuditLog = require('../models/AuditLog.model');

/**
 * Audit Log Controller
 * Provides audit trail access for compliance
 */

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Private/Admin
exports.getAllAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.action) {
      query.action = req.query.action;
    }

    if (req.query.performedBy) {
      query.performedBy = req.query.performedBy;
    }

    if (req.query.targetResource) {
      query.targetResource = req.query.targetResource;
    }

    if (req.query.startDate) {
      query.createdAt = { $gte: new Date(req.query.startDate) };
    }

    if (req.query.endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(req.query.endDate) };
    }

    const logs = await AuditLog.find(query)
      .populate('performedBy', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(query);

    // Get summary statistics
    const summary = await AuditLog.aggregate([
      { $group: {
        _id: null,
        totalActions: { $sum: 1 },
        uniqueUsers: { $addToSet: '$performedBy' },
        byAction: { $push: '$action' }
      }}
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      summary: {
        total: summary[0]?.totalActions || 0,
        uniqueUsers: summary[0]?.uniqueUsers?.length || 0
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs',
      error: error.message
    });
  }
};

// @desc    Get audit log by ID
// @route   GET /api/audit-logs/:id
// @access  Private/Admin
exports.getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id)
      .populate('performedBy', 'firstName lastName email role');

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Audit log not found'
      });
    }

    res.status(200).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit log',
      error: error.message
    });
  }
};

// @desc    Get audit trail for specific resource
// @route   GET /api/audit-logs/resource/:resourceType/:resourceId
// @access  Private/Admin
exports.getResourceAuditTrail = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;

    const logs = await AuditLog.getResourceAuditTrail(resourceType, resourceId);

    res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Get resource audit trail error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource audit trail',
      error: error.message
    });
  }
};

// @desc    Get audit statistics
// @route   GET /api/audit-logs/statistics
// @access  Private/Admin
exports.getAuditStatistics = async (req, res) => {
  try {
    const actionStats = await AuditLog.aggregate([
      { $group: {
        _id: '$action',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);

    const dailyStats = await AuditLog.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': -1 } },
      { $limit: 30 }
    ]);

    const userStats = await AuditLog.aggregate([
      { $group: {
        _id: '$performedBy',
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Populate user details
    const populatedUserStats = await AuditLog.populate(userStats, {
      path: '_id',
      select: 'firstName lastName email'
    });

    res.status(200).json({
      success: true,
      data: {
        byAction: actionStats,
        byDay: dailyStats,
        topUsers: populatedUserStats
      }
    });
  } catch (error) {
    console.error('Audit statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit statistics',
      error: error.message
    });
  }
};