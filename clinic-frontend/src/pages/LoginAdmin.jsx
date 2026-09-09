import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import '../assets/css/loginadmin.css';

export default function LoginAdmin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const validateField = (name, value, allValues = formData) => {
    let err = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          err = 'Admin Name is required.';
        }
        break;
      case 'password':
        if (!value) {
          err = 'Password is required.';
        } else if (value.length < 6) {
          err = 'Password must be at least 6 characters.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          err = 'Please confirm your password.';
        } else if (value !== allValues.password) {
          err = 'Passwords do not match.';
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          err = 'Invalid email format.';
        }
        break;
      default:
        break;
    }
    return err;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((f) => {
      const err = validateField(f, formData[f], formData);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, updatedForm),
      }));
    }

    if (name === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', formData.confirmPassword, updatedForm),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    setTouched({
      name: true,
      password: true,
      confirmPassword: true,
      email: true,
    });

    if (!validateAll()) {
      setAlert({ type: 'error', message: 'Please correct all highlighted errors.' });
      return;
    }

    setSubmitting(true);
    try {
      await loginAdmin({
        name: formData.name,
        password: formData.password,
        email: formData.email,
      });

      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Admin authentication failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-loginadmin">
      <div className="loginadmin-box">
        <div className="admin-head">
          <h1>Admin Portal Authentication</h1>
          <p>Restricted access for clinic administration and staff management.</p>
        </div>

        {alert && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="admin-name">
                Admin Name <span>*</span>
              </label>
              <input
                type="text"
                name="name"
                id="admin-name"
                maxLength={50}
                placeholder="e.g. admin"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.name && errors.name ? 'has-error' : ''}
              />
              {touched.name && errors.name && (
                <div className="error-text">
                  <i className="fa-solid fa-circle-exclamation"></i> {errors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="admin-mail">E-mail (Optional)</label>
              <input
                type="email"
                id="admin-mail"
                name="email"
                placeholder="admin@elhuda.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.email && errors.email ? 'has-error' : ''}
              />
              {touched.email && errors.email && (
                <div className="error-text">
                  <i className="fa-solid fa-circle-exclamation"></i> {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="admin-pass">
                Password <span>*</span>
              </label>
              <input
                type="password"
                id="admin-pass"
                name="password"
                maxLength={20}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.password && errors.password ? 'has-error' : ''}
              />
              {touched.password && errors.password && (
                <div className="error-text">
                  <i className="fa-solid fa-circle-exclamation"></i> {errors.password}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="admin-confpass">
                Confirm Password <span>*</span>
              </label>
              <input
                type="password"
                id="admin-confpass"
                name="confirmPassword"
                maxLength={20}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.confirmPassword && errors.confirmPassword ? 'has-error' : ''}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="error-text">
                  <i className="fa-solid fa-circle-exclamation"></i> {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          <div className="send">
            <div style={{ display: 'flex', gap: '15px', marginRight: 'auto', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                to="/login"
                style={{
                  color: '#38b2ac',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}
              >
                &larr; Patient Login
              </Link>
              <Link
                to="/portal"
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}
              >
                Portal Chooser
              </Link>
            </div>
            <button type="submit" id="log" disabled={submitting}>
              {submitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Verifying...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shield-check"></i> Login As Admin
                </>
              )}
            </button>
          </div>
        </form>

        <div className="demo-info">
          <strong>Default Admin Credentials:</strong> Name: <code>admin</code> | Password:{' '}
          <code>admin123</code>
        </div>
      </div>
    </div>
  );
}
