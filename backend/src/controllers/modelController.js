const Model = require('../models/Model');

// Get all models
exports.getModels = async (req, res) => {
  try {
    const models = await Model.find({ status: 'approved' })
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching models', error: error.message });
  }
};

// Get model by ID
exports.getModel = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id).select('-__v');
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching model', error: error.message });
  }
};

// Create new model
exports.createModel = async (req, res) => {
  try {
    const model = new Model(req.body);
    await model.save();
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update model
exports.updateModel = async (req, res) => {
  try {
    const model = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: 'Error updating model', error: error.message });
  }
};

// Delete model
exports.deleteModel = async (req, res) => {
  try {
    const model = await Model.findByIdAndDelete(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting model', error: error.message });
  }
}; 