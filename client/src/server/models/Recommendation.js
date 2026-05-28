const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Input parameters
  nitrogen: {
    type: Number,
    required: true
  },
  phosphorus: {
    type: Number,
    required: true
  },
  potassium: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  soilMoisture: {
    type: Number,
    required: true
  },
  soilType: {
    type: String,
    required: true,
    enum: ['Loamy', 'Sandy', 'Clayey', 'Peaty', 'Saline', 'Chalky']
  },
  cropType: {
    type: String,
    required: true
  },
  rainfall: {
    type: Number,
    required: true
  },
  phLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  // AI Output
  fertilizerName: {
    type: String,
    required: true
  },
  fertilizerType: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  explanation: {
    type: String,
    required: true
  },
  applicationRate: {
    type: String,
    required: true
  },
  tips: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
recommendationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);