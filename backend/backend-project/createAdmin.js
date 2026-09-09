const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('FATAL ERROR: JWT_SECRET is required');
      process.exit(1);
    }

    if (!process.env.MONGO_URI) {
      console.error('FATAL ERROR: MONGO_URI is required');
      process.exit(1);
    }

    // منع القيم الافتراضية والتحقق الصارم من المتغيرات
    if (!process.env.ADMIN_NAME || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.error('FATAL ERROR: ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.ADMIN_EMAIL;
    const rawPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME;

    // تشفير الباسورد بـ bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // البحث بالأدمن إما بالإيميل أو بالاسم لتفادي التكرار والتعارض مع الـ Login
    let admin = await User.findOne({
      $or: [
        { email: adminEmail.toLowerCase() },
        { name: adminName }
      ]
    });

    if (admin) {
      // تعديل الحساب القائم بدلاً من إنشائه من جديد
      admin.name = adminName;
      admin.email = adminEmail;
      admin.password = hashedPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('Admin account updated successfully!');
    } else {
      // إنشاء حساب أدمن جديد
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin account created successfully!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error in createAdmin script:', error);
    process.exit(1);
  }
};

createAdmin();