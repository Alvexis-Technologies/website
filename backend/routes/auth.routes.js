const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { 
  registerValidation, 
  loginValidation, 
  passwordChangeValidation 
} = require('../middleware/validation.middleware');

// Public routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.post('/change-password', authenticate, passwordChangeValidation, authController.changePassword);
router.post('/logout', authenticate, authController.logout);

module.exports = router;