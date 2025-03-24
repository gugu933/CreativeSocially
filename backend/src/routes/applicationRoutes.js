const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

// Submit new application
router.post('/', applicationController.submitApplication);

// Get all applications (admin only)
router.get('/', applicationController.getApplications);

// Get application by ID (admin only)
router.get('/:id', applicationController.getApplication);

// Update application status (admin only)
router.patch('/:id/status', applicationController.updateApplicationStatus);

module.exports = router; 