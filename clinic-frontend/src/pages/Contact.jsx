import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import AlertMessage from '../components/AlertMessage';
import '../assets/css/contact.css';

export default function Contact() {
  const { submitContactMessage } = useData();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required.';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters.';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required.';
        } else if (!/^[0-9]{11}$/.test(value.replace(/\D/g, ''))) {
          error = 'Please enter an 11-digit phone number.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'Message cannot be empty.';
        } else if (value.trim().length < 10) {
          error = 'Message should be at least 10 characters.';
        }
        break;
      default:
        break;
    }
    return error;
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

  const handleReset = () => {
    setFormData({ name: '', phone: '', email: '', message: '' });
    setTouched({});
    setErrors({});
    setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true, message: true });

    if (!validateAll()) {
      setAlert({ type: 'error', message: 'Please correct all highlighted fields.' });
      return;
    }

    setSending(true);
    setAlert(null);

    try {
      submitContactMessage(formData);
      setTimeout(() => {
        setSending(false);
        setAlert({
          type: 'success',
          message: 'Your message has been received! Our clinic coordinators will contact you shortly.',
        });
        handleReset();
      }, 500);
    } catch (err) {
      setSending(false);
      setAlert({
        type: 'error',
        message: err.message || 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <div className="page-contact">
      <div className="thefirst">
        <div className="contact">
          <h1>Contact Us</h1>
          <p>Have questions about treatments or schedules? Reach out to us anytime.</p>
        </div>
      </div>

      <div className="thesecond">
        <div className="contact-card">
          <i className="fa-solid fa-phone"></i>
          <h2>Phone</h2>
          <h3>01093163715</h3>
        </div>

        <div className="contact-card">
          <i className="fa-solid fa-envelope"></i>
          <h2>E-mail</h2>
          <h3>mrefaay271@gamil.com</h3>
        </div>

        <div className="contact-card">
          <i className="fa-solid fa-location-dot"></i>
          <h2>Location</h2>
          <h3>Banha, Qalyubia, Egypt</h3>
        </div>
      </div>

      <div className="thethird">
        {alert && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form id="form" onSubmit={handleSubmit} noValidate>
          <div id="head">
            <h1>Send Us A Message</h1>
          </div>

          <div className="colums">
            <div className="colum1">
              <div className="form-group">
                <label htmlFor="contact-name">
                  Full Name<span>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="contact-name"
                  maxLength={50}
                  placeholder="Enter your full name"
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
                <label htmlFor="contact-phone">
                  Phone Number<span>*</span>
                </label>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  maxLength={11}
                  placeholder="Your 11-digit mobile number"
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
            </div>

            <div className="colum2">
              <div className="form-group">
                <label htmlFor="contact-email">
                  Email Address<span>*</span>
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  placeholder="mrefaay271@gamil.com"
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
                <label htmlFor="contact-message">
                  Message<span>*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  maxLength={150}
                  placeholder="How can our dental specialists assist you?"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={touched.message && errors.message ? 'has-error' : ''}
                />
                {touched.message && errors.message && (
                  <div className="error-text">
                    <i className="fa-solid fa-circle-exclamation"></i> {errors.message}
                  </div>
                )}
              </div>

              <div className="send">
                <button type="button" id="delete" onClick={handleReset}>
                  Clear
                </button>
                <button type="submit" id="send" disabled={sending}>
                  {sending ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i> Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
