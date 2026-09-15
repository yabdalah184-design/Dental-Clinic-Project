# 🦷 Elhuda Care — Dental Clinic Management System
### نظام إدارة عيادة الأسنان المتكامل (Elhuda Care)

مشروع متكامل لإدارة عيادة أسنان حديثة يربط بين المرضى وإدارة العيادة والأطباء، يتكون من واجهة أمامية عصرية مبنية بـ **React 18 + Vite**، وخلفية برمجية قوية مبنية بـ **Node.js + Express + MongoDB**.

---

## 🔗 روابط المشروع (Live Demo & API)

| الخدمة | الرابط (URL) | الحالة |
| :--- | :--- | :--- |
| **Frontend Live Demo** | [https://dental-clinic-1-hazel.vercel.app/]| 🟢 نشط |
| **Backend API Live** | [https://dental-clinic-project.onrender.com] | 🟢 نشط |
| **GitHub Repository** | [Dental-Clinic-Project](https://github.com/yabdalah184-design/Dental-Clinic-Project) | 🌐 كود المصدر |



---

## 🛠 التقنيات المستخدمة (Tech Stack)

### 🎨 الفرونت إند (Frontend)
- **React 18**: لبناء واجهة مستخدم تفاعلية بنظام Single Page Application (SPA).
- **Vite 6**: كأداة بناء فائقة السرعة مع دعم التحديث الفوري HMR.
- **React Router DOM (v6)**: لإدارة التوجيه والتنقل السلس بين الصفحات والمسارات المحمية.
- **Axios**: للتعامل مع طلبات الـ HTTP والتواصل مع الـ API.
- **FontAwesome Free**: للأيقونات الحديثة والطبية.
- **Modern Scoped CSS**: تصميم تفاعلي متجاوب 100% مع جميع أحجام الشاشات.

### ⚙ الباك إند (Backend)
- **Node.js**: بيئة تشغيل جافا سكريبت من جانب الخادم.
- **Express 5**: إطار عمل الويب لبناء الـ RESTful APIs.
- **MongoDB & Mongoose**: قاعدة بيانات NoSQL مع نمذجة وتخطيط مرن للبيانات.
- **JWT (JSON Web Tokens)**: للمصادقة وتأمين الجلسات (Authentication & Authorization).
- **Bcryptjs**: لتشفير كلمات المرور وحمايتها.
- **CORS & Dotenv**: لإدارة الاتصال بين النطاقات وإدارة المتغيرات البيئية بأمان.

---

## ✨ المميزات الرئيسية للمشروع (Features)

- **بوابة المرضى (Patient Portal)**:
  - استعراض خدمات العيادة والأسعار وقائمة الأطباء وتخصصاتهم وسيرهم الذاتية.
  - حجز المواعيد إلكترونياً واختيار الطبيب والوقت المناسب.
  - لوحة تحكم للمريض لمتابعة وإدارة مواعيده السابقة والقادمة.
- **لوحة تحكم الإدارة (Admin Dashboard)**:
  - إدارة كاملة للمواعيد (قبول، رفض، إلغاء، تحديث الحالة).
  - إدارة قائمة الأطباء، التخصصات، والخدمات وقوائم الأسعار.
  - استلام ومتابعة رسائل واستفسارات اتصل بنا (Contact Messages).
- **نظام مصادقة متقدم (Auth System)**:
  - تسجيل حساب جديد للمرضى وتسجيل الدخول.
  - حماية المسارات (Protected Routes) وصلاحيات مخصصة لكل من الأدمن والمستخدم العادي.
- **وضع عدم الاتصال (Offline Fallback Mode)**:
  - واجهة المستخدم مدعمة بالقدرة على العمل وعرض البيانات التجريبية والتخزين المحلي حتى بدون اتصال بالخادم.

---

## 💻 خطوات التشغيل محليًا (Setup Instructions)

### المتطلبات المسبقة (Prerequisites)
- تثبيت **Node.js** (إصدار 18 أو أحدث).
- تثبيت **Git**.
- توفر قاعدة بيانات **MongoDB** (حساب MongoDB Atlas سحابي أو خادم MongoDB محلي).

---

### 1️⃣ استنساخ المشروع (Clone Repository)

```bash
git clone https://github.com/yabdalah184-design/Dental-Clinic-Project.git
cd Dental-Clinic-Project
```

---

### 2️⃣ إعداد وتشغيل الباك إند (Backend Setup)

1. الانتقال إلى مجلد الباك إند:
```bash
cd backend/backend-project
```

2. تثبيت الحزم والمكتبات:
```bash
npm install
```

3. إنشاء ملف المتغيرات البيئية `.env` (يمكنك نسخه من `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dental-clinic?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_me
JWT_EXPIRE=30d

ADMIN_NAME=admin
ADMIN_EMAIL=admin@elhuda-care.com
ADMIN_PASSWORD=admin123
```

4. إنشاء حساب المسؤول الأول (Admin Seeding):
```bash
npm run create-admin
```

5. تشغيل خادم الباك إند:
```bash
# وضع التطوير (Development)
npm run dev

# أو وضع التشغيل العادي (Production)
npm start
```
> يعمل الخادم افتراضيًا على: `http://localhost:5000`

---

### 3️⃣ إعداد وتشغيل الفرونت إند (Frontend Setup)

1. فتح نافذة طرفية (Terminal) جديدة والانتقال لمجلد الفرونت إند:
```bash
cd clinic-frontend
```

2. تثبيت الحزم والمكتبات:
```bash
npm install
```

3. إنشاء ملف المتغيرات البيئية `.env` (اختياري، للقراءة من السيرفر المحلي):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. تشغيل خادم التطوير للواجهة:
```bash
npm run dev
```
> سيفتح التطبيق في المتصفح تلقائيًا على: `http://localhost:5173` أو `http://localhost:3000`

---

## 🔑 بيانات تسجيل الدخول التجريبية (Demo Credentials)

| الحساب | البريد الإلكتروني / اسم المستخدم | كلمة المرور | الصلاحية |
| :--- | :--- | :--- | :--- |
| **المسؤول (Admin)** | `admin@elhuda-care.com` أو `admin` | `admin123` | لوحة تحكم كاملة |
| **مريض تجريبي (Patient)** | `user@elhuda.com` | `user123` | حجز وإدارة مواعيد |

---

## 📡 نظرة عامة على مسارات الـ API (API Endpoints)

| المسار (Endpoint) | الطريقة (Method) | الوصف |
| :--- | :--- | :--- |
| `GET /` | `GET` | فحص حالة عمل الخادم (Health Check) |
| `/api/auth/register` | `POST` | إنشاء حساب مستخدم جديد |
| `/api/auth/login` | `POST` | تسجيل الدخول واستلام رمز JWT |
| `/api/doctors` | `GET, POST, PUT, DELETE` | إدارة وعرض قائمة الأطباء |
| `/api/services` | `GET, POST, PUT, DELETE` | إدارة وعرض الخدمات الطبية |
| `/api/pricing` | `GET` | عرض أقسام وباقات الأسعار |
| `/api/appointments` | `GET, POST, PUT, DELETE` | حجز وإدارة وتحديث المواعيد |
| `/api/contact` | `GET, POST` | إرسال واستعراض رسائل التواصل |

---

## 📁 هيكل المشروع (Project Directory Tree)

```text
Dental-Clinic-Project/
├── backend/
│   └── backend-project/
│       ├── src/
│       │   ├── config/          # إعدادات الاتصال بقاعدة البيانات
│       │   ├── controllers/     # منطق التحكم والمعالجة (Controllers)
│       │   ├── middlewares/     # وسائط التحقق من الصلاحيات والـ JWT
│       │   ├── models/          # نماذج بيانات Mongoose (Schemas)
│       │   ├── routes/          # مسارات وتوجيهات الـ API
│       │   └── app.js           # نقطة انطلاق سيرفر Express
│       ├── createAdmin.js       # سكربت إنشاء وتحديث بيانات الأدمن
│       ├── .env.example         # نموذج المتغيرات البيئية
│       └── package.json
│
├── clinic-frontend/
│   ├── public/                  # الملفات الثابتة والأيقونات
│   ├── src/
│   │   ├── assets/              # ملفات التنسيق CSS والصور
│   │   ├── components/          # المكونات القابلة لإعادة الاستخدام (Navbar, Footer, etc.)
│   │   ├── context/             # إدارة الحالة العامة (AuthContext, DataContext)
│   │   ├── pages/               # صفحات التطبيق (Home, Doctors, Booking, Dashboard, etc.)
│   │   ├── services/            # دوال الاتصال بـ API وسيرفر الباك إند
│   │   ├── App.jsx              # شجرة المسارات والتوجيه الأساسية
│   │   └── main.jsx             # نقطة انطلاق تطبيق React
│   ├── .env.example             # نموذج المتغيرات البيئية للفرونت إند
│   ├── vite.config.js
│   └── package.json
│
└── README.md                    # ملف توثيق المشروع الرئيسي
```

