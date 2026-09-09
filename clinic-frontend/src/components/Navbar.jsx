import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <header className="site-navbar">
      <div className="nav-container">
        {/* Brand Logo & Clinic Title */}
        <Link to="/" className="nav-brand" onClick={closeMobile}>
          <div className="brand-icon-wrapper">
            <i className="fa-solid fa-tooth"></i>
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-title">
              Elhuda<span className="brand-accent">Care</span>
            </span>
            <span className="brand-subtitle">Dental Clinic</span>
          </div>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className={`mobile-nav-toggle ${mobileOpen ? 'is-active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Main Navigation Links */}
        <nav className={`nav-menu ${mobileOpen ? 'nav-menu-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMobile}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dentists"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMobile}
              >
                Dentists
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMobile}
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pricing"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMobile}
              >
                Pricing
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMobile}
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                onClick={closeMobile}
              >
                Contact
              </NavLink>
            </li>

            {/* Authenticated Patient: My Appointments */}
            {isAuthenticated && !isAdmin && (
              <li>
                <NavLink
                  to="/my-appointments"
                  className={({ isActive }) => (isActive ? 'nav-link active patient-nav-link' : 'nav-link patient-nav-link')}
                  onClick={closeMobile}
                >
                  <i className="fa-solid fa-calendar-days"></i>
                  <span>My Appointments</span>
                </NavLink>
              </li>
            )}

            {/* Authenticated Administrator: Admin Dashboard */}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? 'nav-link active admin-nav-link' : 'nav-link admin-nav-link')}
                  onClick={closeMobile}
                >
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Admin Panel</span>
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action & Auth Area (Desktop & Mobile) */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <div className="nav-user-chip">
                <div className="user-avatar" title={currentUser?.email}>
                  <i className={`fa-solid ${isAdmin ? 'fa-user-shield' : 'fa-user'}`}></i>
                </div>
                <div className="user-details">
                  <span className="user-display-name">
                    {currentUser?.name || currentUser?.email?.split('@')[0]}
                  </span>
                  <span className={`user-role-badge ${isAdmin ? 'badge-admin' : 'badge-patient'}`}>
                    {isAdmin ? 'Admin' : 'Patient'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-logout-btn"
                  title="Sign Out"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <div className="nav-guest-actions">
                <NavLink
                  to="/login"
                  className="nav-login-btn"
                  onClick={closeMobile}
                >
                  <i className="fa-regular fa-user"></i>
                  <span>Sign In</span>
                </NavLink>
                <Link
                  to="/appointment"
                  className="nav-cta-btn"
                  onClick={closeMobile}
                >
                  <i className="fa-solid fa-calendar-plus"></i>
                  <span>Book Appointment</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
