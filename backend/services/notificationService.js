const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const WebSocket = require('ws');

class NotificationService {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Store WebSocket clients
  }

  initializeWebSocket(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws, req) => {
      const userId = req.url.split('=')[1]; // Get userId from URL
      if (userId) {
        this.clients.set(userId, ws);

        ws.on('close', () => {
          this.clients.delete(userId);
        });
      }
    });
  }

  async createNotification(data) {
    try {
      const notification = new Notification(data);
      await notification.save();

      // Send real-time notification via WebSocket
      this.sendWebSocketNotification(data.recipient, notification);

      // Send email notification
      await this.sendEmailNotification(notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  sendWebSocketNotification(userId, notification) {
    const client = this.clients.get(userId.toString());
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  }

  async sendEmailNotification(notification) {
    try {
      const user = await User.findById(notification.recipient);
      if (!user || !user.email) return;

      const transporter = nodemailer.createTransport({
        // Configure your email service here
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: '"Task Platform" <noreply@taskplatform.com>',
        to: user.email,
        subject: notification.title,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            ${notification.actionUrl ? 
              `<a href="${notification.actionUrl}" 
                style="background: #2874f0; color: white; padding: 10px 20px; 
                text-decoration: none; border-radius: 5px; display: inline-block; 
                margin-top: 15px;">
                View Details
              </a>` : ''
            }
          </div>
        `
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  async getUnreadCount(userId) {
    return await Notification.countDocuments({
      recipient: userId,
      read: false
    });
  }

  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
  }
}

module.exports = new NotificationService(); 