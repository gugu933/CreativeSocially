const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Model = require('../models/Model');

// Load environment variables
dotenv.config();

const dummyModels = [
  {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    phone: "+1234567890",
    dateOfBirth: new Date('1998-04-15'),
    gender: "female",
    height: 175,
    measurements: {
      bust: 86,
      waist: 61,
      hips: 89
    },
    experience: "5 years of experience in fashion and commercial modeling",
    portfolio: [
      "https://example.com/portfolio/sarah1.jpg",
      "https://example.com/portfolio/sarah2.jpg"
    ],
    socialMedia: {
      instagram: "@sarah_model",
      facebook: "sarahj.model",
      twitter: "@sarahjmodel"
    },
    status: "approved"
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.c@example.com",
    phone: "+1234567891",
    dateOfBirth: new Date('1996-08-23'),
    gender: "male",
    height: 183,
    measurements: {
      bust: 97,
      waist: 81,
      hips: 93
    },
    experience: "3 years of runway and print modeling experience",
    portfolio: [
      "https://example.com/portfolio/michael1.jpg",
      "https://example.com/portfolio/michael2.jpg"
    ],
    socialMedia: {
      instagram: "@michael_model",
      facebook: "michaelc.model",
      twitter: "@michaelcmodel"
    },
    status: "approved"
  },
  {
    firstName: "Emma",
    lastName: "Garcia",
    email: "emma.g@example.com",
    phone: "+1234567892",
    dateOfBirth: new Date('1999-12-05'),
    gender: "female",
    height: 170,
    measurements: {
      bust: 84,
      waist: 58,
      hips: 87
    },
    experience: "2 years of commercial and Instagram modeling",
    portfolio: [
      "https://example.com/portfolio/emma1.jpg",
      "https://example.com/portfolio/emma2.jpg"
    ],
    socialMedia: {
      instagram: "@emma_model",
      facebook: "emmag.model",
      twitter: "@emmagmodel"
    },
    status: "approved"
  }
];

const createDummyModels = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing models
    await Model.deleteMany({});
    console.log('Cleared existing models');

    // Insert dummy models
    await Model.insertMany(dummyModels);
    console.log('Dummy models created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating dummy models:', error);
    process.exit(1);
  }
};

createDummyModels(); 