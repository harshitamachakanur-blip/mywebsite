const Recommendation = require('../models/Recommendation');
const asyncHandler = require('express-async-handler');
const aiModel = require('../config/aiModel');

// @desc    Generate AI recommendation
// @route   POST /api/recommendations/generate
// @access  Private
const generateRecommendation = asyncHandler(async (req, res) => {
  const {
    nitrogen, phosphorus, potassium, temperature, humidity,
    soilMoisture, soilType, cropType, rainfall, phLevel
  } = req.body;

  // Validate input
  if (!nitrogen || !phosphorus || !potassium || !temperature || !humidity ||
      !soilMoisture || !soilType || !cropType || !rainfall || !phLevel) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Get AI recommendation
  const aiResult = aiModel.getRecommendation({
    nitrogen, phosphorus, potassium, temperature,
    humidity, soilMoisture, soilType, cropType, rainfall, phLevel
  });

  // Save recommendation to database
  const recommendation = await Recommendation.create({
    user: req.user._id,
    nitrogen, phosphorus, potassium, temperature, humidity,
    soilMoisture, soilType, cropType, rainfall, phLevel,
    fertilizerName: aiResult.fertilizer.name,
    fertilizerType: aiResult.fertilizer.type,
    confidence: aiResult.confidence,
    explanation: aiResult.explanation,
    applicationRate: aiResult.applicationRate,
    tips: aiResult.tips
  });

  res.status(200).json({
    success: true,
    data: {
      _id: recommendation._id,
      fertilizer: aiResult.fertilizer,
      confidence: aiResult.confidence,
      explanation: aiResult.explanation,
      applicationRate: aiResult.applicationRate,
      tips: aiResult.tips,
      inputData: { nitrogen, phosphorus, potassium, temperature, humidity, soilMoisture, phLevel }
    }
  });
});

// @desc    Get user's recommendations
// @route   GET /api/recommendations/user
// @access  Private
const getUserRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await Recommendation.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  
  res.status(200).json(recommendations);
});

// @desc    Get single recommendation
// @route   GET /api/recommendations/:id
// @access  Private
const getRecommendationById = asyncHandler(async (req, res) => {
  const recommendation = await Recommendation.findById(req.params.id);
  
  if (!recommendation) {
    res.status(404);
    throw new Error('Recommendation not found');
  }
  
  // Check if user owns the recommendation
  if (recommendation.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  res.status(200).json(recommendation);
});

// @desc    Delete recommendation
// @route   DELETE /api/recommendations/:id
// @access  Private
const deleteRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await Recommendation.findById(req.params.id);
  
  if (!recommendation) {
    res.status(404);
    throw new Error('Recommendation not found');
  }
  
  if (recommendation.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }
  
  await recommendation.deleteOne();
  res.status(200).json({ message: 'Recommendation removed' });
});

module.exports = {
  generateRecommendation,
  getUserRecommendations,
  getRecommendationById,
  deleteRecommendation
};