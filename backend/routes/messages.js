const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/', auth, messageController.sendMessage);
router.get('/conversations', auth, messageController.getConversations);
router.get('/:taskId', auth, messageController.getMessages);
router.patch('/:messageId/interest', auth, messageController.updateInterestStatus);

module.exports = router; 