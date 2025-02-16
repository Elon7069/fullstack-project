const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'NEW_INTEREST',
      'INTEREST_ACCEPTED',
      'INTEREST_REJECTED',
      'TASK_ASSIGNED',
      'TASK_COMPLETED',
      'NEW_MESSAGE',
      'PAYMENT_RECEIVED',
      'REVIEW_RECEIVED',
      'TASK_DEADLINE',
      'DISPUTE_UPDATE'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // Automatically delete after 30 days
  }
});

module.exports = mongoose.model('Notification', notificationSchema); 