const Dispute = require('../models/Dispute');
const Task = require('../models/Task');
const notificationService = require('../services/notificationService');
const cloudinary = require('../utils/cloudinary');

const disputeController = {
  // Create a new dispute
  async createDispute(req, res) {
    try {
      const { taskId, againstUser, type, title, description } = req.body;
      const files = req.files;

      // Upload evidence files if any
      const evidence = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path);
          evidence.push(result.secure_url);
        }
      }

      const dispute = new Dispute({
        taskId,
        raisedBy: req.user.id,
        againstUser,
        type,
        title,
        description,
        evidence
      });

      await dispute.save();

      // Notify the other party
      await notificationService.createNotification({
        recipient: againstUser,
        type: 'DISPUTE_CREATED',
        title: 'New Dispute Filed',
        message: `A dispute has been filed regarding task: ${title}`,
        taskId,
        actionUrl: `/disputes/${dispute._id}`
      });

      // Notify admins
      const admins = await User.find({ role: 'ADMIN' });
      for (const admin of admins) {
        await notificationService.createNotification({
          recipient: admin._id,
          type: 'NEW_DISPUTE',
          title: 'New Dispute Requires Review',
          message: `A new dispute has been filed: ${title}`,
          actionUrl: `/admin/disputes/${dispute._id}`
        });
      }

      res.status(201).json(dispute);
    } catch (error) {
      res.status(500).json({ message: 'Error creating dispute', error: error.message });
    }
  },

  // Get disputes (with filters for admin)
  async getDisputes(req, res) {
    try {
      const { 
        status, 
        type, 
        page = 1, 
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      let query = {};
      
      // For regular users, show only their disputes
      if (req.user.role !== 'ADMIN') {
        query.$or = [
          { raisedBy: req.user.id },
          { againstUser: req.user.id }
        ];
      }

      if (status) query.status = status;
      if (type) query.type = type;

      const disputes = await Dispute.find(query)
        .populate('taskId', 'title budget')
        .populate('raisedBy', 'name email')
        .populate('againstUser', 'name email')
        .populate('resolution.resolvedBy', 'name')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Dispute.countDocuments(query);

      res.json({
        disputes,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: Number(page)
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching disputes', error: error.message });
    }
  },

  // Get single dispute
  async getDispute(req, res) {
    try {
      const dispute = await Dispute.findById(req.params.id)
        .populate('taskId', 'title budget status')
        .populate('raisedBy', 'name email avatar')
        .populate('againstUser', 'name email avatar')
        .populate('messages.sender', 'name avatar')
        .populate('resolution.resolvedBy', 'name');

      if (!dispute) {
        return res.status(404).json({ message: 'Dispute not found' });
      }

      // Check if user has access to this dispute
      if (req.user.role !== 'ADMIN' && 
          dispute.raisedBy._id.toString() !== req.user.id &&
          dispute.againstUser._id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.json(dispute);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dispute', error: error.message });
    }
  },

  // Add message to dispute
  async addMessage(req, res) {
    try {
      const { message } = req.body;
      const files = req.files;

      const dispute = await Dispute.findById(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: 'Dispute not found' });
      }

      // Upload attachments if any
      const attachments = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path);
          attachments.push(result.secure_url);
        }
      }

      dispute.messages.push({
        sender: req.user.id,
        message,
        attachments
      });

      await dispute.save();

      // Notify other parties
      const recipients = [dispute.raisedBy, dispute.againstUser];
      if (req.user.role === 'ADMIN') {
        recipients.push(dispute.raisedBy, dispute.againstUser);
      }

      for (const recipient of recipients) {
        if (recipient.toString() !== req.user.id) {
          await notificationService.createNotification({
            recipient,
            type: 'DISPUTE_MESSAGE',
            title: 'New Message in Dispute',
            message: `New message in dispute: ${dispute.title}`,
            actionUrl: `/disputes/${dispute._id}`
          });
        }
      }

      res.json(dispute);
    } catch (error) {
      res.status(500).json({ message: 'Error adding message', error: error.message });
    }
  },

  // Resolve dispute (admin only)
  async resolveDispute(req, res) {
    try {
      const { decision, action } = req.body;

      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only admins can resolve disputes' });
      }

      const dispute = await Dispute.findById(req.params.id);
      if (!dispute) {
        return res.status(404).json({ message: 'Dispute not found' });
      }

      dispute.status = 'RESOLVED';
      dispute.resolution = {
        decision,
        action,
        resolvedBy: req.user.id,
        resolvedAt: new Date()
      };

      await dispute.save();

      res.json(dispute);
    } catch (error) {
      res.status(500).json({ message: 'Error resolving dispute', error: error.message });
    }
  }
};

module.exports = disputeController; 