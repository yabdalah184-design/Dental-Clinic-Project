const Service = require('../models/Service');
const { getNextId, buildIdFilter } = require('../utils/idHelper');

// 1. جلب جميع الخدمات (Public - يرجع Array مباشرة)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ id: 1, createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. جلب الأقسام مجمعة لصفحة الأسعار (ترجع Array مباشرة لمنع crash في Pricing.jsx)
exports.getPricingSections = async (req, res) => {
  try {
    const services = await Service.find().sort({ id: 1, createdAt: -1 });

    // تجميع الخدمات حسب الـ Category
    const grouped = services.reduce((acc, service) => {
      const category = service.category || 'General';
      if (!acc[category]) acc[category] = [];
      const serviceId = typeof service.id === 'number' ? service.id : service._id.toString();
      acc[category].push({
        id: serviceId,
        _id: service._id.toString(),
        title: service.title,
        name: service.title,
        price: service.price,
        time: service.time || '8:00 am - 10:00 pm',
        description: service.description || '',
        category: category,
        image: service.image || '/images/007-dental-care-1.png'
      });
      return acc;
    }, {});

    // تحويل الكائن لمصفوفة sections مباشرة
    const sections = Object.keys(grouped).map(cat => ({
      title: `${cat} Dentistry`,
      category: cat,
      items: grouped[cat]
    }));

    // إرجاع مصفوفة الأقسام مباشرة لتتوافق مع pricingSections.map في الفرونت إند
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. جلب خدمة محددة بالـ ID (Public)
exports.getServiceById = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);
    const service = await Service.findOne(filter);

    if (!service) {
      return res.status(404).json({ message: 'Service not available' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4. إنشاء خدمة جديدة (Admin/Protected)
exports.createService = async (req, res) => {
  try {
    const serviceData = { ...req.body };
    if (!serviceData.id) {
      serviceData.id = await getNextId(Service);
    }
    const newService = await Service.create(serviceData);
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. تعديل بيانات خدمة (Admin/Protected)
exports.updateService = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);

    const updatedService = await Service.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not available' });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 6. حذف خدمة (Admin/Protected)
exports.deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);

    const deleted = await Service.findOneAndDelete(filter);

    if (!deleted) {
      return res.status(404).json({ message: 'Service not available' });
    }

    res.status(200).json({ message: 'Service has been successfully deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};