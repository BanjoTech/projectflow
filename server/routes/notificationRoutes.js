// server/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const protect = require('../middleware/auth');

router.use(protect);

// Get user's notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('fromUser', 'name')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unread count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark all as read
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear all notifications
router.delete('/clear-all', async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
