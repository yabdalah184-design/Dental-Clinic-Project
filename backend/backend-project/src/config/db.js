const mongoose = require('mongoose');

// مزامنة المعرفات الرقمية للسجلات القديمة إن وُجدت لضمان التوافق مع الفرونت إند
const syncNumericIds = async () => {
  try {
    const models = [
      { model: require('../models/Doctor'), name: 'Doctor' },
      { model: require('../models/Service'), name: 'Service' },
      { model: require('../models/Appointment'), name: 'Appointment' },
      { model: require('../models/ContactMessage'), name: 'ContactMessage' }
    ];

    for (const { model, name } of models) {
      const unindexed = await model.find({
        $or: [
          { id: { $exists: false } },
          { id: null },
          { id: { $not: { $type: 'number' } } }
        ]
      }).sort({ createdAt: 1 });

      if (unindexed.length > 0) {
        const highest = await model.findOne({ id: { $type: 'number' } }).sort({ id: -1 });
        let currentId = highest && typeof highest.id === 'number' ? highest.id : 0;

        for (const doc of unindexed) {
          currentId += 1;
          doc.id = currentId;
          await doc.save({ validateBeforeSave: false });
        }
        console.log(`Synced ${unindexed.length} numeric IDs for ${name}.`);
      }
    }
  } catch (err) {
    console.error('Warning during numeric ID sync:', err.message);
  }
};

const connectDB = async () => {
  try {
   
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await syncNumericIds();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;