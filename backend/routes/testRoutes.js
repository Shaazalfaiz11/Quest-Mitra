const express = require('express');
const { createTest, assignTest, getTestsForGroup, generateQuestionsWithAI } = require('../controllers/testController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, restrictTo('Teacher', 'Admin', 'Expert'), createTest);
router.post('/generate', protect, restrictTo('Teacher', 'Admin', 'Expert'), generateQuestionsWithAI);
router.post('/:id/assign', protect, restrictTo('Teacher', 'Admin', 'Expert'), assignTest);
router.get('/group/:groupId', protect, getTestsForGroup);

module.exports = router;
