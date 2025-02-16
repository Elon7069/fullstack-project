const Task = require('../models/Task');
const mongoose = require('mongoose');

const taskHistoryController = {
  // Get user's task history
  async getUserTaskHistory(req, res) {
    try {
      const userId = req.user.id;
      const {
        role = 'all', // 'poster', 'solver', 'all'
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
        startDate,
        endDate
      } = req.query;

      let query = {};

      // Filter by role
      if (role === 'poster') {
        query.postedBy = userId;
      } else if (role === 'solver') {
        query.assignedTo = userId;
      } else {
        query.$or = [
          { postedBy: userId },
          { assignedTo: userId }
        ];
      }

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Filter by date range
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get tasks with populated references
      const tasks = await Task.find(query)
        .populate('postedBy', 'name email avatar')
        .populate('assignedTo', 'name email avatar')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(Number(limit));

      // Get total count for pagination
      const total = await Task.countDocuments(query);

      // Calculate task statistics
      const stats = await Task.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalEarnings: {
              $sum: {
                $cond: [
                  { $eq: ['$assignedTo', mongoose.Types.ObjectId(userId)] },
                  '$budget',
                  0
                ]
              }
            },
            totalSpent: {
              $sum: {
                $cond: [
                  { $eq: ['$postedBy', mongoose.Types.ObjectId(userId)] },
                  '$budget',
                  0
                ]
              }
            },
            completedTasks: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            }
          }
        }
      ]);

      res.json({
        tasks,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: Number(page),
          limit: Number(limit)
        },
        statistics: stats[0] || {
          totalEarnings: 0,
          totalSpent: 0,
          completedTasks: 0
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task history', error: error.message });
    }
  }
};

module.exports = taskHistoryController; 