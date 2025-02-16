const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('evidence'), disputeController.createDispute);
router.get('/', auth, disputeController.getDisputes);
router.get('/:id', auth, disputeController.getDispute);
router.post('/:id/messages', auth, upload.array('attachments'), disputeController.addMessage);
router.patch('/:id/resolve', auth, disputeController.resolveDispute);

module.exports = router; 