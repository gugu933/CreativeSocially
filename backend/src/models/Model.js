const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number,
    required: true
  },
  measurements: {
    bust: Number,
    waist: Number,
    hips: Number
  },
  experience: {
    type: String,
    required: true
  },
  portfolio: [{
    type: String // URLs to portfolio images
  }],
  socialMedia: {
    instagram: String,
    facebook: String,
    twitter: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Model', modelSchema); 