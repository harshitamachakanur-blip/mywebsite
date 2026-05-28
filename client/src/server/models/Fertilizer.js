const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Nitrogenous', 'Phosphatic', 'Potassic', 'Complex', 'Organic']
  },
  nContent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pContent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  kContent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  description: {
    type: String,
    required: true
  },
  applicationRate: {
    type: String,
    required: true
  },
  benefits: [{
    type: String
  }],
  precautions: [{
    type: String
  }],
  suitableCrops: [{
    type: String
  }],
  suitableSoilTypes: [{
    type: String
  }],
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fertilizer', fertilizerSchema);