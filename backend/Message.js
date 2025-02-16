const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  interestStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', null],
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);