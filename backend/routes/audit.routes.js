const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

// All audit routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get('/', auditController.getAllAuditLogs);
router.get('/statistics', auditController.getAuditStatistics);
router.get('/:id', auditController.getAuditLogById);
router.get('/resource/:resourceType/:resourceId', auditController.getResourceAuditTrail);

module.exports = router;