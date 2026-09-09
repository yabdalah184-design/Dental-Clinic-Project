const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Public: Send Message
router.post('/', contactController.sendMessage);

// Admin & Receptionist Only: Get All Messages & Mark Read
router.get('/', protect, authorizeRoles('admin', 'receptionist'), contactController.getMessages);
router.patch('/:id/read', protect, authorizeRoles('admin', 'receptionist'), contactController.markAsRead);
router.patch('/:id', protect, authorizeRoles('admin', 'receptionist'), contactController.markAsRead);

// Admin Only: Delete Message
router.delete('/:id', protect, authorizeRoles('admin'), contactController.deleteMessage);

module.exports = router;