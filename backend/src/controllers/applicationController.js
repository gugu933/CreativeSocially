const Application = require('../models/Application');
const Model = require('../models/Model');
const { sendApplicationConfirmation, sendStatusUpdateEmail } = require('../utils/emailService');

// Submit new application
exports.submitApplication = async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();

    // Send confirmation email
    await sendApplicationConfirmation(application.email, application.firstName);

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application._id
    });
  } catch (error) {
    res.status(400).json({ message: 'Error submitting application', error: error.message });
  }
};

// Get all applications (admin only)
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .select('-__v')
      .sort({ submittedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Get application by ID (admin only)
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).select('-__v');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error: error.message });
  }
};

// Update application status (admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    if (comments) {
      application.comments = comments;
    }
    await application.save();

    // Send status update email
    await sendStatusUpdateEmail(application.email, application.firstName, status);

    // If approved, create a new model
    if (status === 'approved') {
      const modelData = {
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        dateOfBirth: application.dateOfBirth,
        gender: application.gender,
        height: application.height,
        measurements: application.measurements,
        experience: application.experience,
        portfolio: application.photos,
        socialMedia: application.socialMedia,
        status: 'approved'
      };

      const model = new Model(modelData);
      await model.save();
    }

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
}; 