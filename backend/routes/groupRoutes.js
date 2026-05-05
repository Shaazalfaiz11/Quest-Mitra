const express = require('express');
const { createGroup, joinGroup, getMyGroups } = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createGroup);
router.post('/join', protect, joinGroup);
router.get('/', protect, getMyGroups);

module.exports = router;
