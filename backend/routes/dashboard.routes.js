const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// All dashboard routes require authentication
router.use(authenticate);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/health', isAdmin, dashboardController.getSystemHealth);

module.exports = router;