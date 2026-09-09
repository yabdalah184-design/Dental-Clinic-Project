const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const { getNextId, buildIdFilter } = require('../utils/idHelper');

// 1. إنشاء حجز جديد
exports.createAppointment = async (req, res) => {
  try {
    const { 
      phone, 
      date, 
      time, 
      timeSlot, 
      doctorId, 
      doctorName, 
      serviceId, 
      message, 
      notes, 
      name, 
      email 
    } = req.body;
    const patientId = req.user._id || req.user.id;

    // استقبال المواعيد والرسائل أياً كان المسمى المبعوث من الفرونت إند
    const selectedTime = time || timeSlot;
    const selectedMessage = message || notes || '';

    // منع حجز بتاريخ سابق
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({ message: 'The appointment date is in the past.' });
    }

    // التأكد من وجود الطبيب (بحث مرن بالـ ID أو بالاسم)
    let doctorExists = null;
    if (doctorId) {
      doctorExists = await Doctor.findOne(buildIdFilter(doctorId));
    }
    if (!doctorExists && (doctorName || typeof doctorId === 'string')) {
      doctorExists = await Doctor.findOne({
        name: { $regex: new RegExp(`^${doctorName || doctorId}$`, 'i') }
      });
    }
    if (!doctorExists) {
      return res.status(404).json({ message: 'The doctor does not exist.' });
    }

    // التأكد من وجود الخدمة لو تم إرسالها
    let serviceExists = null;
    if (serviceId) {
      serviceExists = await Service.findOne(buildIdFilter(serviceId));
    }

    // منع تعارض الحجز لنفس الطبيب في نفس الموعد
    const existingAppointment = await Appointment.findOne({
      doctor: doctorExists._id,
      date: date,
      $or: [{ timeSlot: selectedTime }, { time: selectedTime }],
      status: { $ne: 'cancelled' }
    });
    if (existingAppointment) {
      return res.status(400).json({ message: 'The time slot is already booked for this doctor.' });
    }

    // تعيين ID رقمي تلقائي
    const nextId = await getNextId(Appointment);

    // إنشاء الحجز وتخزين المسميات المتوافقة
    const newAppointment = await Appointment.create({
      id: nextId,
      patient: patientId,
      doctor: doctorExists._id,
      service: serviceExists ? serviceExists._id : null,
      name: name || req.user.name,
      email: email || req.user.email,
      doctorName: doctorExists.name,
      phone: phone || req.user.phone || '',
      date,
      timeSlot: selectedTime,
      time: selectedTime,
      notes: selectedMessage,
      message: selectedMessage,
      status: req.body.status ? req.body.status.toLowerCase() : 'pending'
    });

    await newAppointment.populate([
      { path: 'doctor', select: 'name specialty image role' },
      { path: 'patient', select: 'name email phone' },
      { path: 'service', select: 'title price category' }
    ]);

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. عرض حجوزات المريض فقط (يرجع Array مباشرة)
exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const appointments = await Appointment.find({ patient: userId })
      .populate('doctor', 'name specialty image role')
      .populate('service', 'title price category')
      .populate('patient', 'name email phone')
      .sort({ id: -1, createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. عرض جميع الحجوزات (Admin/Receptionist - يرجع Array مباشرة)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctor', 'name specialty image role')
      .populate('service', 'title price category')
      .populate('patient', 'name email phone')
      .sort({ id: -1, createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. تحديث حالة الحجز (Admin/Receptionist أو إلغاء من قبل المريض صاحب الموعد)
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;

    let { status } = req.body;
    const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (status) {
      status = status.toLowerCase();
    }

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Value of status is invalid. The allowed values are: pending, confirmed, cancelled, completed' 
      });
    }

    const appointment = await Appointment.findOne(filter);

    if (!appointment) {
      return res.status(404).json({ message: 'The booking does not exist.' });
    }

    // السماح للإدارة بتعديل أي حالة، والسماح للمريض بإلغاء حجزه فقط
    const isOwner = appointment.patient && appointment.patient.toString() === userId.toString();
    const isAdmin = userRole === 'admin' || userRole === 'receptionist';

    if (!isAdmin) {
      if (!isOwner || status !== 'cancelled') {
        return res.status(403).json({ 
          message: 'Patients are only permitted to cancel their own appointments.' 
        });
      }
    }

    appointment.status = status;
    await appointment.save();

    await appointment.populate([
      { path: 'doctor', select: 'name specialty image role' },
      { path: 'patient', select: 'name email phone' },
      { path: 'service', select: 'title price category' }
    ]);

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. حذف حجز
exports.deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);
    const userId = req.user._id || req.user.id;

    const appointment = await Appointment.findOne(filter);

    if (!appointment) return res.status(404).json({ message: 'The booking does not exist.' });

    if (req.user.role !== 'admin' && appointment.patient.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this reservation.' });
    }

    await appointment.deleteOne();
    res.status(200).json({ message: 'The booking has been successfully cancelled.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};