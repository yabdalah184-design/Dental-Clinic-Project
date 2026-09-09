const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// 1. المسارات العامة (Public)
router.get('/', serviceController.getAllServices);

// مسار هيكل الأسعار (يجب وضعه قبل /:id لمنع التعارض)
router.get('/sections', serviceController.getPricingSections);

router.get('/:id', serviceController.getServiceById);

// 2. المسارات المحمية للأدمن فقط (Admin Only)
router.post('/', protect, authorizeRoles('admin'), serviceController.createService);
router.put('/:id', protect, authorizeRoles('admin'), serviceController.updateService);
router.delete('/:id', protect, authorizeRoles('admin'), serviceController.deleteService);

module.exports = router;