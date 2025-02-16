const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/:id', profileController.getProfile);
router.put('/update', auth, upload.single('avatar'), profileController.updateProfile);
router.post('/:userId/review', auth, profileController.addReview);

module.exports = router; 