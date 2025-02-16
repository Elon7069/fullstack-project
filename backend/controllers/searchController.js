const Task = require('../models/Task');
const User = require('../models/User');

const searchController = {
  // Search tasks
  async searchTasks(req, res) {
    try {
      const {
        keyword,
        type,
        department,
        minBudget,
        maxBudget,
        status,
        sortBy,
        page = 1,
        limit = 10
      } = req.query;

      let query = {};

      // Keyword search in title and description
      if (keyword) {
        query.$or = [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } }
        ];
      }

      // Apply filters
      if (type) query.type = type;
      if (department) query.department = department;
      if (status) query.status = status;

      // Budget range
      if (minBudget || maxBudget) {
        query.budget = {};
        if (minBudget) query.budget.$gte = Number(minBudget);
        if (maxBudget) query.budget.$lte = Number(maxBudget);
      }

      // Sorting
      let sort = {};
      if (sortBy) {
        sort[sortBy] = -1;
      } else {
        sort.createdAt = -1;
      }

      const skip = (page - 1) * limit;

      const tasks = await Task.find(query)
        .populate('postedBy', 'name avatar rating')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

      const total = await Task.countDocuments(query);

      res.json({
        tasks,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: Number(page)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error searching tasks', error: error.message });
    }
  },

  // Search users/solvers
  async searchUsers(req, res) {
    try {
      const {
        keyword,
        department,
        skills,
        minRating,
        sortBy,
        page = 1,
        limit = 10
      } = req.query;

      let query = { role: 'TaskSolver' };

      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { bio: { $regex: keyword, $options: 'i' } }
        ];
      }

      if (department) query.department = department;
      if (skills) {
        query.skills = {
          $all: skills.split(',').map(skill => new RegExp(skill.trim(), 'i'))
        };
      }
      if (minRating) {
        query.averageRating = { $gte: Number(minRating) };
      }

      let sort = {};
      if (sortBy) {
        sort[sortBy] = -1;
      } else {
        sort.rating = -1;
      }

      const skip = (page - 1) * limit;

      const users = await User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

      const total = await User.countDocuments(query);

      res.json({
        users,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: Number(page)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error searching users', error: error.message });
    }
  }
};

module.exports = searchController; 