const Task = require('../models/Task');

const taskController = {
  // Create new task
  async createTask(req, res) {
    try {
      const { title, description, type, deadline, budget, department } = req.body;
      const postedBy = req.user.id; // From auth middleware

      const task = new Task({
        title,
        description,
        type,
        deadline,
        budget,
        department,
        postedBy
      });

      await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task', error: error.message });
    }
  },

  // Get all tasks with filters
  async getTasks(req, res) {
    try {
      const { type, department, minBudget, maxBudget, status } = req.query;
      
      let query = {};
      
      // Apply filters if they exist
      if (type) query.type = type;
      if (department) query.department = department;
      if (status) query.status = status;
      if (minBudget || maxBudget) {
        query.budget = {};
        if (minBudget) query.budget.$gte = Number(minBudget);
        if (maxBudget) query.budget.$lte = Number(maxBudget);
      }

      const tasks = await Task.find(query)
        .populate('postedBy', 'name email')
        .sort({ createdAt: -1 });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  },

  // Get tasks by user
  async getUserTasks(req, res) {
    try {
      const tasks = await Task.find({ postedBy: req.user.id })
        .sort({ createdAt: -1 });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user tasks', error: error.message });
    }
  },

  // Get single task
  async getTask(req, res) {
    try {
      const task = await Task.findById(req.params.id)
        .populate('postedBy', 'name email')
        .populate('interests.solver', 'name email');

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
  }
};

module.exports = taskController;

// Add these methods to your existing taskController

const taskcontroller = {
    // ... existing methods ...
  
    // Update task
    async updateTask(req, res) {
      try {
        const { id } = req.params;
        const updates = req.body;
        
        // Find task and check ownership
        const task = await Task.findById(id);
        
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }
  
        if (task.postedBy.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Not authorized to edit this task' });
        }
  
        // Update task
        const updatedTask = await Task.findByIdAndUpdate(
          id,
          { ...updates },
          { new: true }
        ).populate('postedBy', 'name email');
  
        res.json(updatedTask);
      } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
      }
    },
  
    // Delete task
    async deleteTask(req, res) {
      try {
        const { id } = req.params;
        
        // Find task and check ownership
        const task = await Task.findById(id);
        
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }
  
        if (task.postedBy.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Not authorized to delete this task' });
        }
  
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
      }
    },
  
    // Update task status
    async updateTaskStatus(req, res) {
      try {
        const { id } = req.params;
        const { status } = req.body;
  
        if (!['open', 'assigned', 'completed'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status' });
        }
  
        const task = await Task.findById(id);
        
        if (!task) {
          return res.status(404).json({ message: 'Task not found' });
        }
  
        if (task.postedBy.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Not authorized to update this task' });
        }
  
        task.status = status;
        await task.save();
  
        res.json(task);
      } catch (error) {
        res.status(500).json({ message: 'Error updating task status', error: error.message });
      }
    }
  };

  // Update the getTasks method in your taskController

const task = {
    // Get all tasks with filters and sorting
    async getTasks(req, res) {
      try {
        const { 
          type, 
          department, 
          minBudget, 
          maxBudget, 
          status,
          sortBy,
          sortOrder,
          deadlineFrom,
          deadlineTo
        } = req.query;
        
        let query = {};
        
        // Apply filters
        if (type) query.type = type;
        if (department) query.department = department;
        if (status) query.status = status;
        
        // Budget range filter
        if (minBudget || maxBudget) {
          query.budget = {};
          if (minBudget) query.budget.$gte = Number(minBudget);
          if (maxBudget) query.budget.$lte = Number(maxBudget);
        }
  
        // Deadline range filter
        if (deadlineFrom || deadlineTo) {
          query.deadline = {};
          if (deadlineFrom) query.deadline.$gte = new Date(deadlineFrom);
          if (deadlineTo) query.deadline.$lte = new Date(deadlineTo);
        }
  
        // Create sort object
        let sort = {};
        if (sortBy) {
          sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
          // Default sort by creation date
          sort.createdAt = -1;
        }
  
        const tasks = await Task.find(query)
          .populate('postedBy', 'name email')
          .sort(sort);
  
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
      }
    }
  };

  const TaskController = {
    async getTasks(req, res) {
      try {
        const { 
          type, 
          department, 
          minBudget, 
          maxBudget, 
          status,
          sortBy,
          sortOrder,
          deadlineFrom,
          deadlineTo,
          difficulty,
          urgency,
          skills,
          page = 1,
          limit = 10
        } = req.query;
        
        let query = {};
        
        // Basic filters
        if (type) query.type = type;
        if (department) query.department = department;
        if (status) query.status = status;
        
        // Budget range filter
        if (minBudget || maxBudget) {
          query.budget = {};
          if (minBudget) query.budget.$gte = Number(minBudget);
          if (maxBudget) query.budget.$lte = Number(maxBudget);
        }
  
        // Deadline range filter
        if (deadlineFrom || deadlineTo) {
          query.deadline = {};
          if (deadlineFrom) query.deadline.$gte = new Date(deadlineFrom);
          if (deadlineTo) query.deadline.$lte = new Date(deadlineTo);
        }
  
        // Additional filters
        if (difficulty) query.difficulty = difficulty;
        if (urgency) query.urgency = urgency;
        if (skills) {
          query.requiredSkills = {
            $in: skills.split(',')
          };
        }
  
        // Create sort object
        let sort = {};
        if (sortBy) {
          sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
          sort.createdAt = -1;
        }
  
        // Calculate pagination
        const skip = (page - 1) * limit;
  
        // Execute query with pagination
        const tasks = await Task.find(query)
          .populate('postedBy', 'name email')
          .sort(sort)
          .skip(skip)
          .limit(Number(limit));
  
        // Get total count for pagination
        const total = await Task.countDocuments(query);
  
        res.json({
          tasks,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            limit: Number(limit)
          }
        });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
      }
    }
  };