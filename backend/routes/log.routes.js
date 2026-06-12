const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// All log routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', isAdmin, logController.getAllLogs);
router.get('/recent', isAdmin, logController.getRecentLogs);
router.get('/statistics', isAdmin, logController.getLogStatistics);
router.get('/user/:userId', isAdmin, logController.getLogsByUser);

module.exports = router;