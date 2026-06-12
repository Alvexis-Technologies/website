/**
 * Role-based Access Control Middleware
 * Restricts routes based on user roles
 */

// Check if user has required role
exports.checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    next();
  };
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Check if user is accessing own resource or is admin
exports.isSelfOrAdmin = (req, res, next) => {
  const targetUserId = req.params.id;
  
  if (req.user.role === 'admin' || req.user.userId === targetUserId) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  }
};