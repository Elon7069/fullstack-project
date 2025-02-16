const express = require('express');
const router = express.Router();
const taskHistoryController = require('../controllers/taskHistoryController');
const auth = require('../middleware/auth');

router.get('/', auth, taskHistoryController.getUserTaskHistory);

module.exports = router; 