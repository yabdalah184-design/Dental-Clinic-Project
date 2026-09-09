import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import '../assets/css/login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const { loginUser, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [redirectAlert, setRedirectAlert] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      setRedirectAlert(location.state.message);
    }
  }, [location.state]);

  const validateField = (name, value) => {
    let err = '';
    switch (name) {
      case 'name':
        if (isRegister && (!value || !value.trim())) {
          err = 'Name is required.';
        }
        break;
      case 'email':
        if (!value || !value.trim()) {
          err = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          err = 'Please enter a valid email address (e.g. user@elhuda.com).';
        }
        break;
      case 'password':
        if (!value) {
          err = 'Password is required.';
        } else if (value.length < 6) {
          err = 'Password must be at least 6 characters.';
        }
        break;
      case 'phone':
        if (isRegister && value && !/^[0-9]{11}$/.test(value.replace(/\D/g, ''))) {
          err = 'Mobile number must be exactly 11 digits.';
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
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setRedirectAlert(null);

    const allTouched = { email: true, password: true };
    if (isRegister) {
      allTouched.name = true;
      allTouched.phone = true;
    }
    setTouched(allTouched);

    if (!validateAll()) return;

    setLoading(true);
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await loginUser({ email: formData.email, password: formData.password });
      }

      // Navigate to where they were trying to go, or home
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-login">
      <div className="login-container">
        {redirectAlert && (
          <AlertMessage
            type="warning"
            message={redirectAlert}
            onClose={() => setRedirectAlert(null)}
          />
        )}

        {authError && (
          <AlertMessage
            type="error"
            message={authError}
            onClose={() => setAuthError(null)}
          />
        )}

        {/* Toggle between User Login and Register */}
        <div className="portal-toggle">
          <button
            type="button"
            className={`portal-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setAuthError(null);
            }}
          >
            <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '6px' }}></i> Patient Login
          </button>
          <button
            type="button"
            className={`portal-btn ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setAuthError(null);
            }}
          >
            <i className="fa-solid fa-user-plus" style={{ marginRight: '6px' }}></i> Register
          </button>
        </div>

        <div className="login-header">
          <h2>{isRegister ? 'Create Patient Account' : 'Patient Authentication'}</h2>
          <p>{isRegister ? 'Sign up to manage your clinical appointments' : 'Sign in to access your appointments & booking'}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="reg-name">Full Name *</label>
              <input
                type="text"
                id="reg-name"
                name="name"
                placeholder="e.g. Sarah Connor"
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
          )}

          <div className="form-group">
            <label htmlFor="login-email">Email Address *</label>
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="user@elhuda.com"
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

          {isRegister && (
            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number (11 Digits)</label>
              <input
                type="tel"
                id="reg-phone"
                name="phone"
                maxLength={11}
                placeholder="01012345678"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.phone && errors.phone ? 'has-error' : ''}
              />
              {touched.phone && errors.phone && (
                <div className="error-text">
                  <i className="fa-solid fa-circle-exclamation"></i> {errors.phone}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="login-password">Password *</label>
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="••••••••"
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Authenticating...
              </>
            ) : isRegister ? (
              <>
                <i className="fa-solid fa-user-plus"></i> Create Account
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
              </>
            )}
          </button>
        </form>

        <div className="demo-credentials">
          <strong>Quick Patient Evaluation Credentials:</strong>
          <br />
          Email: <code>user@elhuda.com</code> | Password: <code>user123</code>
        </div>

        <div className="admin-switch-banner" style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/loginadmin" className="admin-switch-btn">
            <i className="fa-solid fa-user-shield" style={{ marginRight: '6px' }}></i>
            Administrator Portal &rarr;
          </Link>
          <Link to="/portal" className="admin-switch-btn" style={{ color: '#94a3b8' }}>
            <i className="fa-solid fa-layer-group" style={{ marginRight: '6px' }}></i>
            Portal Chooser
          </Link>
        </div>
      </div>
    </div>
  );
}
