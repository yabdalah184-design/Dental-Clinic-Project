const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);

router.post('/', protect, authorizeRoles('admin'), doctorController.createDoctor);
router.put('/:id', protect, authorizeRoles('admin'), doctorController.updateDoctor);
router.delete('/:id', protect, authorizeRoles('admin'), doctorController.deleteDoctor);

module.exports = router;