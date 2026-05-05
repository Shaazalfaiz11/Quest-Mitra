const express = require('express');
const { submitTest, getMySubmissions, getTestSubmissions } = require('../controllers/submissionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, submitTest);
router.get('/me', protect, getMySubmissions);
router.get('/test/:testId', protect, restrictTo('Teacher', 'Admin', 'Expert'), getTestSubmissions);

module.exports = router;
