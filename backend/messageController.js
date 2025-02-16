const Message = require('../models/Message');
const Task = require('../models/Task');

const messageController = {
  // Send a message
  async sendMessage(req, res) {
    try {
      const { taskId, receiverId, content } = req.body;
      const senderId = req.user.id;

      const message = new Message({
        taskId,
        sender: senderId,
        receiver: receiverId,
        content
      });

      await message.save();

      // Populate sender and receiver details
      await message.populate('sender receiver', 'name email');

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message', error: error.message });
    }
  },

  // Get conversations for a user
  async getConversations(req, res) {
    try {
      const userId = req.user.id;

      // Get all messages where user is either sender or receiver
      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: mongoose.Types.ObjectId(userId) },
              { receiver: mongoose.Types.ObjectId(userId) }
            ]
          }
        },
        {
          $group: {
            _id: '$taskId',
            lastMessage: { $last: '$$ROOT' },
            unreadCount: {
              $sum: {
                $cond: [
                  { $and: [
                    { $eq: ['$receiver', mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$read', false] }
                  ]},
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $sort: { 'lastMessage.createdAt': -1 }
        }
      ]);

      // Populate task and user details
      await Task.populate(conversations, {
        path: '_id',
        select: 'title status'
      });

      await User.populate(conversations, [
        {
          path: 'lastMessage.sender',
          select: 'name email'
        },
        {
          path: 'lastMessage.receiver',
          select: 'name email'
        }
      ]);

      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching conversations', error: error.message });
    }
  },

  // Get messages for a specific task conversation
  async getMessages(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const messages = await Message.find({
        taskId,
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      })
      .populate('sender receiver', 'name email')
      .sort('createdAt');

      // Mark messages as read
      await Message.updateMany(
        {
          taskId,
          receiver: userId,
          read: false
        },
        { read: true }
      );

      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
  },

  // Update interest status
  async updateInterestStatus(req, res) {
    try {
      const { messageId } = req.params;
      const { status } = req.body;

      const message = await Message.findById(messageId);
      
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      // Verify that the user is the task poster
      const task = await Task.findById(message.taskId);
      if (task.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      message.interestStatus = status;
      await message.save();

      // If accepted, update task status
      if (status === 'accepted') {
        task.status = 'assigned';
        task.assignedTo = message.sender;
        await task.save();
      }

      res.json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error updating interest status', error: error.message });
    }
  }
};

module.exports = messageController;
