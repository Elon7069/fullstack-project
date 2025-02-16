const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

router.post('/', auth, validateTask, taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/user', auth, taskController.getUserTasks);
router.get('/:id', taskController.getTask);

module.exports = router;

// Add these routes to your existing task routes

router.put('/:id', auth, validateTask, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);
router.patch('/:id/status', auth, taskController.updateTaskStatus);