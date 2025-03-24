const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes (require authentication and admin role)
router.get('/profile', auth, isAdmin, adminController.getProfile);
router.patch('/password', auth, isAdmin, adminController.updatePassword);

module.exports = router; 