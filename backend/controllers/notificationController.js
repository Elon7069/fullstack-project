const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

const notificationController = {
  // Get user's notifications
  async getNotifications(req, res) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = req.query;
      const query = { recipient: req.user.id };
      
      if (unreadOnly === 'true') {
        query.read = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('taskId', 'title');

      const total = await Notification.countDocuments(query);

      res.json({
        notifications,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: Number(page)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
  },

  // Mark notification as read
  async markAsRead(req, res) {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id,
        req.user.id
      );
      
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Error marking notification as read', error: error.message });
    }
  },

  // Mark all notifications as read
  async markAllAsRead(req, res) {
    try {
      await notificationService.markAllAsRead(req.user.id);
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
    }
  },

  // Get unread count
  async getUnreadCount(req, res) {
    try {
      const count = await notificationService.getUnreadCount(req.user.id);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Error getting unread count', error: error.message });
    }
  }
};

module.exports = notificationController; 