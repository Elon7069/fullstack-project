const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['TaskPoster', 'TaskSolver'],
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    min: 1,
    max: 5
  },
  skills: [{
    type: String
  }],
  bio: {
    type: String,
    maxLength: 500
  },
  avatar: {
    type: String // URL to image
  },
  ratings: [{
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: String,
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedTasks: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  },
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating
userSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
  return (sum / this.ratings.length).toFixed(1);
});

module.exports = mongoose.model('User', userSchema); 