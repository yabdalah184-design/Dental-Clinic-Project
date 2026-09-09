const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      enum: {
        values: [
          'General', 'Surgery', 'Prosthetics', 'Radiology', 'Package',
          'Restorative', 'Pediatric', 'Cosmetic', 'Orthodontics', 'Endodontics', 'Periodontics'
        ],
        message: 'Service category is not valid'
      },
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: [0, 'Service price must be a positive number']
    },
    time: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      default: 'default-service.png'
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = typeof doc.id === 'number' ? doc.id : ret._id.toString();
        ret.name = ret.name || doc.title;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Service', serviceSchema);