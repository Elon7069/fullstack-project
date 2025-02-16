const validateRegistration = (req, res, next) => {
    const { name, email, password, role } = req.body;
  
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
  
    if (!['TaskPoster', 'TaskSolver'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    next();
  };
  
  const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    next();
  };
  
  module.exports = { validateRegistration, validateLogin };

  // Add this to your existing validation.js file

const validateTask = (req, res, next) => {
    const { title, description, type, deadline, budget } = req.body;
  
    if (!title || !description || !type || !deadline || !budget) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Validate deadline is in the future
    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ message: 'Deadline must be in the future' });
    }
  
    // Validate budget is a positive number
    if (budget <= 0) {
      return res.status(400).json({ message: 'Budget must be greater than 0' });
    }
  
    next();
  };
  
  module.exports = { validateTask };