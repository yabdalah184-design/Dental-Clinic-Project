const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true
    },
    role: {
      type: String,
      default: 'DENTIST',
      trim: true
    },
    specialty: {
      type: String,
      required: [true, 'Doctor specialty is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true,
      default: 'Banha, Egypt'
    },
    age: {
      type: Number
    },
    bio: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      default: 'default-doctor.png'
    },
    languages: {
      type: [String],
      default: ['Arabic (Native)', 'English (Fluent)']
    },
    education: {
      type: String,
      trim: true
    },
    experience: {
      type: [String],
      default: []
    },
    cv: {
      languages: { type: [String], default: ['Arabic (Native)', 'English (Fluent)'] },
      education: { type: String, trim: true },
      experience: { type: mongoose.Schema.Types.Mixed, default: [] }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = typeof doc.id === 'number' ? doc.id : ret._id.toString();
        ret.education = doc.education || doc.cv?.education || 'Faculty of Oral and Dental Medicine, Cairo University.';
        
        let expList = [];
        if (doc.experience && doc.experience.length > 0) {
          expList = Array.isArray(doc.experience) ? doc.experience : [doc.experience];
        } else if (doc.cv?.experience) {
          expList = Array.isArray(doc.cv.experience) ? doc.cv.experience : [doc.cv.experience];
        } else {
          expList = [
            'Over 5+ years of active clinical practice in modern restorative dentistry.',
            'Trained in painless root canal treatments and emergency dental interventions.',
            'Specialized aesthetic veneer design and dental implantology.'
          ];
        }
        ret.experience = expList;

        if (!ret.languages || ret.languages.length === 0) {
          ret.languages = doc.cv?.languages || ['Arabic (Native)', 'English (Fluent)'];
        }
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);