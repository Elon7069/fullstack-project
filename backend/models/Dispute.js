const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  againstUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'PAYMENT_ISSUE',
      'QUALITY_ISSUE',
      'COMMUNICATION_ISSUE',
      'DEADLINE_BREACH',
      'INAPPROPRIATE_BEHAVIOR',
      'OTHER'
    ],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'],
    default: 'PENDING'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  evidence: [{
    type: String, // URLs to uploaded files
    required: false
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    attachments: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    decision: String,
    action: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

disputeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Dispute', disputeSchema); 