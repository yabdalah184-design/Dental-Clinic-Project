const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const serviceController = require('./controllers/serviceController');

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

// مسار الأسعار لخدمة صفحة Pricing لترجيع هيكل الأقسام (sections / items)
app.get('/api/pricing', serviceController.getPricingSections);

app.use('/api/appointments', require('./routes/appointmentRoutes'));

// دعم المسارين للرسايل لضمان التوافق مع الفرونت إند والباك إند
app.use('/api/messages', require('./routes/contactRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});