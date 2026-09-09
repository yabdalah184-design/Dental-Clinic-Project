const ContactMessage = require('../models/ContactMessage');
const { getNextId, buildIdFilter } = require('../utils/idHelper');

// 1. إرسال وحفظ رسالة تواصل
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // التحقق من البيانات الأساسية
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const nextId = await getNextId(ContactMessage);

    const newMessage = await ContactMessage.create({
      id: nextId,
      name,
      email,
      phone: phone || '',
      subject: subject || '',
      message,
      status: 'unread'
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. جلب جميع الرسائل (يرجع Array مباشرة)
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ id: -1, createdAt: -1 });
    // ترجيع المصفوفة مباشرة ليتوافق مع الفرونت إند
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. تعليم الرسالة كمقروءة / تحديث حالتها
exports.markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);
    const newStatus = req.body.status ? req.body.status.toLowerCase() : 'read';

    const message = await ContactMessage.findOneAndUpdate(
      filter,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. حذف رسالة من الداتابيز
exports.deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = buildIdFilter(id);

    const message = await ContactMessage.findOneAndDelete(filter);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};