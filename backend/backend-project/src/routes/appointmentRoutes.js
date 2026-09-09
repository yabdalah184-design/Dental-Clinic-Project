const express = require('express');
const router = express.Router();

// 1. تصحيح استدعاء الميدلوير
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// 2. تصحيح اسم الملف بالظبط كما هو في المجلد (C كابيتال)
const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateStatus,
  deleteAppointment
} = require('../controllers/appointmentController');

// 3. تطبيق الصلاحيات والمسارات الذكية
// مسار الحجوزات العام الذكي: يرجع مواعيد المشرف، أو مواعيد المريض، أو مصفوفة فارغة للزائر
router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(200).json([]);
  }

  protect(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'receptionist')) {
      return getAllAppointments(req, res, next);
    }
    return getMyAppointments(req, res, next);
  });
});

router.post('/', protect, authorizeRoles('patient', 'user', 'admin'), createAppointment);
router.get('/my-appointments', protect, getMyAppointments);

// دعم كلا المسارين لتحديث الحالة (المسار المباشر /:id ومسار /:id/status)
router.patch('/:id/status', protect, updateStatus);
router.patch('/:id', protect, updateStatus);

// الحذف متاح للمشرف أو للمريض صاحب الحجز نفسه
router.delete('/:id', protect, deleteAppointment);

module.exports = router;