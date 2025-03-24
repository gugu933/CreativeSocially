const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

// Get all models
router.get('/', modelController.getModels);

// Get model by ID
router.get('/:id', modelController.getModel);

// Update model (admin only)
router.patch('/:id', modelController.updateModel);

// Delete model (admin only)
router.delete('/:id', modelController.deleteModel);

module.exports = router; 