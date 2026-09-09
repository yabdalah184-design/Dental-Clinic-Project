const Doctor = require('../models/Doctor');
const { getNextId, buildIdFilter } = require('../utils/idHelper');

// 1. جلب جميع الأطباء (Public - يرجع Array مباشرة للفرونت)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ id: 1, createdAt: -1 });
    // إرجاع المصروفة مباشرة ليتوافق مع res.data.map() في الفرونت إند
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. جلب طبيب محدد بالـ ID (Public)
exports.getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);

    const doctor = await Doctor.findOne(filter);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. إضافة طبيب جديد (Admin/Protected)
exports.createDoctor = async (req, res) => {
  try {
    const doctorData = { ...req.body };
    if (!doctorData.id) {
      doctorData.id = await getNextId(Doctor);
    }
    const newDoctor = await Doctor.create(doctorData);
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. تعديل بيانات طبيب (Admin/Protected)
exports.updateDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);

    const updatedDoctor = await Doctor.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. حذف طبيب (Admin/Protected)
exports.deleteDoctor = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);

    const deleted = await Doctor.findOneAndDelete(filter);

    if (!deleted) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};