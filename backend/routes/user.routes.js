const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isAdmin, isSelfOrAdmin } = require('../middleware/role.middleware');
const { userUpdateValidation } = require('../middleware/validation.middleware');

// All user routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', isAdmin, userController.getAllUsers);
router.post('/', isAdmin, userController.createUser);
router.get('/:id', isAdmin, userController.getUserById);
router.put('/:id', isAdmin, userUpdateValidation, userController.updateUser);
router.delete('/:id', isAdmin, userController.deleteUser);

module.exports = router;