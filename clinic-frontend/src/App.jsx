import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Dentists from './pages/Dentists';
import DoctorCV from './pages/DoctorCV';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import Contact from './pages/Contact';
import Login from './pages/Login';
import LoginAdmin from './pages/LoginAdmin';
import LoginChoice from './pages/LoginChoice';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dentists" element={<Dentists />} />
          <Route path="/cv" element={<DoctorCV />} />
          <Route path="/cv/:doctorId" element={<DoctorCV />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/portal" element={<LoginChoice />} />
          <Route path="/login-choice" element={<LoginChoice />} />

          {/* Protected Patient Routes (Requires User Login) */}
          <Route
            path="/appointment"
            element={
              <ProtectedRoute adminOnly={false}>
                <Appointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/make-appointment"
            element={
              <ProtectedRoute adminOnly={false}>
                <Appointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute adminOnly={false}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes (Requires Admin Role) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/modify-doctor"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modify-doctor"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing-modify"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modfiy-dentist"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/modify-dentist"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/modfiy-dentist"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
