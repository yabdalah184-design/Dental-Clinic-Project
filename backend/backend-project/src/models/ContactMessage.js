const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  id: { type: Number, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['unread', 'read', 'replied'], 
    default: 'unread',
    set: (v) => v ? v.toLowerCase() : v // تحويل الحالة لحروف صغيرة تلقائياً
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = typeof doc.id === 'number' ? doc.id : ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('ContactMessage', contactSchema);