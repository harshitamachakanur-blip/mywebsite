const express = require('express');
const router = express.Router();
const {
  generateRecommendation,
  getUserRecommendations,
  getRecommendationById,
  deleteRecommendation
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All routes require authentication

router.post('/generate', generateRecommendation);
router.get('/user', getUserRecommendations);
router.route('/:id')
  .get(getRecommendationById)
  .delete(deleteRecommendation);

module.exports = router;