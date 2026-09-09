const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      index: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
      default: null
    },
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    doctorName: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    timeSlot: {
      type: String
    },
    time: {
      type: String
    },
    notes: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      set: (v) => v ? v.toLowerCase() : v
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = typeof doc.id === 'number' ? doc.id : ret._id.toString();
        if (ret.patient && typeof ret.patient === 'object') {
          ret.name = ret.name || ret.patient.name;
          ret.email = ret.email || ret.patient.email;
          ret.phone = ret.phone || ret.patient.phone;
        }
        if (ret.doctor && typeof ret.doctor === 'object') {
          ret.doctorName = ret.doctorName || ret.doctor.name;
        }
        if (ret.date && ret.date instanceof Date) {
          ret.date = ret.date.toISOString().split('T')[0];
        }
        ret.time = ret.time || ret.timeSlot;
        ret.timeSlot = ret.timeSlot || ret.time;
        ret.message = ret.message || ret.notes;
        ret.notes = ret.notes || ret.message;
        if (ret.status && typeof ret.status === 'string') {
          ret.status = ret.status.charAt(0).toUpperCase() + ret.status.slice(1).toLowerCase();
        }
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);