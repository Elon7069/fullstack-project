const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/', auth, notificationController.getNotifications);
router.get('/unread-count', auth, notificationController.getUnreadCount);
router.patch('/:id/read', auth, notificationController.markAsRead);
router.patch('/mark-all-read', auth, notificationController.markAllAsRead);

module.exports = router; 