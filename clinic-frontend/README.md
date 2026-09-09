# 🦷 Elhuda Care — Modern React Frontend (SPA)

> High-performance, clean, and modular React 18 Single Page Application (SPA) powered by Vite for the **Elhuda Care Dental Clinic**.
> Built strictly with modern React standards, modular components, reactive state management, and 100% free of any legacy PHP or static HTML files.

---

## 🚀 Key Highlights & Architecture

- **React 18 + Vite**: Instant HMR, lightning-fast development, and optimized production bundle.
- **Modern Sleek Navbar**: Redesigned top navigation with crisp modern typography (`Poppins`), clinic branding (`Elhuda Care` with dental logo), active route indicators, contextual auth states, and a mobile drawer.
- **Strict Folder Structure**:
  - `src/components/`: Reusable UI elements (`Navbar`, `Footer`, `DoctorCard`, `ServiceCard`, `Modal`, `ConfirmModal`, `LoadingSpinner`, `AlertMessage`, `EmptyState`, `ProtectedRoute`).
  - `src/pages/`: 14 modular application views.
  - `src/context/`: Reactive state providers (`AuthContext`, `DataContext`).
  - `src/services/`: API clients (`apiClient`, `authService`, `doctorService`, `serviceService`, `appointmentService`) and mock data for offline mode.
  - `src/assets/`: Scoped CSS styles and clinic imagery.
- **Zero Legacy Clutter**: Completely decoupled from legacy code. Only modern React components and the Vite root `index.html`.

---

## 💻 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Open your browser at [http://localhost:3000/](http://localhost:3000/) or [http://localhost:3001/](http://localhost:3001/).

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔑 Demo & Evaluation Credentials

- **Admin Login**: Username `admin` / Password `admin123`
- **Patient Login**: Email `user@elhuda.com` / Password `user123`
- **Offline / Standalone**: The frontend seamlessly persists appointments and session states using `localStorage` when running without an active backend.
