const User = require('../models/User');
const Task = require('../models/Task');
const cloudinary = require('../utils/cloudinary'); // For image upload

const profileController = {
  // Get user profile
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.params.id)
        .select('-password')
        .populate('ratings.reviewerId', 'name avatar')
        .populate('ratings.taskId', 'title');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get recent tasks
      const recentTasks = await Task.find({
        $or: [
          { postedBy: user._id },
          { assignedTo: user._id }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('postedBy', 'name');

      res.json({ user, recentTasks });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  },

  // Update profile
  async updateProfile(req, res) {
    try {
      const { name, department, year, bio, skills, socialLinks } = req.body;
      
      // Handle avatar upload if provided
      let avatarUrl;
      if (req.files && req.files.avatar) {
        const result = await cloudinary.uploader.upload(req.files.avatar.path);
        avatarUrl = result.secure_url;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          name,
          department,
          year,
          bio,
          skills,
          socialLinks,
          ...(avatarUrl && { avatar: avatarUrl })
        },
        { new: true }
      ).select('-password');

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  },

  // Add review and rating
  async addReview(req, res) {
    try {
      const { rating, review, taskId } = req.body;
      const { userId } = req.params;

      // Verify task completion
      const task = await Task.findById(taskId);
      if (!task || task.status !== 'completed') {
        return res.status(400).json({ message: 'Can only review completed tasks' });
      }

      // Verify reviewer's association with task
      if (task.postedBy.toString() !== req.user.id && 
          task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to review this task' });
      }

      const user = await User.findById(userId);
      user.ratings.push({
        rating,
        review,
        taskId,
        reviewerId: req.user.id
      });

      await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error adding review', error: error.message });
    }
  }
};

module.exports = profileController; 