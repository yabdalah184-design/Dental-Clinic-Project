import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import '../assets/css/makeappointment.css';

export default function Appointment() {
  const [searchParams] = useSearchParams();
  const { doctors, bookAppointment } = useData();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    doctorId: '',
    doctorName: '',
    message: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [formAlert, setFormAlert] = useState(null);

  // Pre-fill from query params or user session
  useEffect(() => {
    const docParam = searchParams.get('doctor');
    const serviceParam = searchParams.get('service');

    setFormData((prev) => {
      let matchedDoctor = null;
      if (docParam && doctors.length > 0) {
        matchedDoctor = doctors.find((d) => d.name.toLowerCase() === docParam.toLowerCase());
      }

      return {
        ...prev,
        name: prev.name || currentUser?.name || '',
        email: prev.email || currentUser?.email || '',
        phone: prev.phone || '',
        doctorId: matchedDoctor ? matchedDoctor.id : prev.doctorId,
        doctorName: matchedDoctor ? matchedDoctor.name : prev.doctorName,
        message: serviceParam ? `Inquiring about ${serviceParam} procedure.` : prev.message,
      };
    });
  }, [searchParams, doctors, currentUser]);

  // Validation function
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          error = 'Full name is required.';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters.';
        }
        break;

      case 'phone':
        if (!value || !value.trim()) {
          error = 'Phone number is required.';
        } else if (!/^[0-9]{11}$/.test(value.replace(/\D/g, ''))) {
          error = 'Please enter a valid 11-digit mobile number.';
        }
        break;

      case 'email':
        if (!value || !value.trim()) {
          error = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
        break;

      case 'date':
        if (!value) {
          error = 'Appointment date is required.';
        } else {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) {
            error = 'Appointment date cannot be in the past.';
          }
        }
        break;

      case 'time':
        if (!value) {
          error = 'Appointment time is required.';
        }
        break;

      case 'doctorId':
        if (!value || value === 'select doctor') {
          error = 'Please select a preferred doctor.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'doctorId') {
      const doc = doctors.find((d) => String(d.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        doctorId: value,
        doctorName: doc ? doc.name : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      doctorId: '',
      doctorName: '',
      message: '',
    });
    setTouched({});
    setErrors({});
    setFormAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormAlert(null);

    // Mark all as touched
    const allTouched = {
      name: true,
      phone: true,
      email: true,
      date: true,
      time: true,
      doctorId: true,
    };
    setTouched(allTouched);

    if (!validateAll()) {
      setFormAlert({ type: 'error', message: 'Please correct the highlighted errors in the form.' });
      return;
    }

    setSubmitting(true);
    try {
      const newBooking = await bookAppointment(formData);
      setSuccessInfo(newBooking);
      handleReset();
    } catch (err) {
      setFormAlert({ type: 'error', message: err.message || 'Failed to book appointment. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Min date helper (today's date in YYYY-MM-DD)
  const todayDateString = new Date().toISOString().split('T')[0];

  return (
    <div className="page-appointment">
      <div className="thefirstapp">
        <h2>Make An Appointment</h2>
        <p>Schedule your dental checkup or cosmetic consultation with ease.</p>
      </div>

      <div className="appointment">
        {formAlert && (
          <AlertMessage
            type={formAlert.type}
            message={formAlert.message}
            onClose={() => setFormAlert(null)}
          />
        )}

        {successInfo ? (
          <div className="booking-success-card">
            <div style={{ fontSize: '50px', color: '#10b981', marginBottom: '15px' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>Appointment Confirmed!</h2>
            <p style={{ color: '#475569', fontSize: '16px', marginBottom: '20px' }}>
              Thank you, <strong>{successInfo.name}</strong>! Your appointment with{' '}
              <strong>{successInfo.doctorName || 'our dental specialist'}</strong> has been registered.
            </p>
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '16px 20px',
                borderRadius: '8px',
                display: 'inline-block',
                textAlign: 'left',
                margin: '0 auto 25px',
                fontSize: '14px',
                lineHeight: '26px'
              }}
            >
              <div><strong>Date:</strong> {successInfo.date}</div>
              <div><strong>Time:</strong> {successInfo.time}</div>
              <div><strong>Phone:</strong> {successInfo.phone}</div>
              <div><strong>Status:</strong> <span style={{ color: '#f59e0b', fontWeight: 600 }}>{successInfo.status || 'Pending'}</span></div>
            </div>
            <div>
              <button
                onClick={() => setSuccessInfo(null)}
                style={{
                  backgroundColor: '#0cb4c0',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginRight: '12px',
                  marginBottom: '10px',
                }}
              >
                Book Another Appointment
              </button>
              <Link
                to="/my-appointments"
                style={{
                  backgroundColor: '#059669',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginRight: '12px',
                  marginBottom: '10px',
                }}
              >
                <i className="fa-solid fa-list-check"></i> View My Appointments
              </Link>
              <Link
                to="/"
                style={{
                  backgroundColor: '#1a202c',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '10px',
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <form id="form" onSubmit={handleSubmit} noValidate>
            <div id="head">
              <h1>Make An Appointment</h1>
            </div>

            <div className="colums">
              <div className="colum1">
                <div className="form-group">
                  <label htmlFor="name">
                    Your full name<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
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
                  <label htmlFor="phone">
                    Phone number<span>*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    maxLength={11}
                    placeholder="e.g. 01093163715"
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

                <div className="form-group">
                  <label htmlFor="time">
                    Appointment time<span>*</span>
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.time && errors.time ? 'has-error' : ''}
                  />
                  {touched.time && errors.time && (
                    <div className="error-text">
                      <i className="fa-solid fa-circle-exclamation"></i> {errors.time}
                    </div>
                  )}
                </div>
              </div>

              <div className="colum2">
                <div className="form-group">
                  <label htmlFor="email">
                    Email address<span>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="name@example.com"
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
                  <label htmlFor="date">
                    Appointment date<span>*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    min={todayDateString}
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.date && errors.date ? 'has-error' : ''}
                  />
                  {touched.date && errors.date && (
                    <div className="error-text">
                      <i className="fa-solid fa-circle-exclamation"></i> {errors.date}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="select-doctor">
                    Select A Doctor<span>*</span>
                  </label>
                  <select
                    name="doctorId"
                    id="select-doctor"
                    value={formData.doctorId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={touched.doctorId && errors.doctorId ? 'has-error' : ''}
                  >
                    <option value="">-- Choose Dental Specialist --</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.role || 'Dentist'} - {doc.specialty})
                      </option>
                    ))}
                  </select>
                  {touched.doctorId && errors.doctorId && (
                    <div className="error-text">
                      <i className="fa-solid fa-circle-exclamation"></i> {errors.doctorId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '10px' }}>
              <label htmlFor="message">Note or Message (Optional)</label>
              <textarea
                id="message"
                name="message"
                maxLength={150}
                placeholder="Describe your symptoms or specific dental requests..."
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="form-buttons">
              <button type="button" id="reset" onClick={handleReset}>
                <i className="fa-solid fa-rotate-left"></i> Reset
              </button>
              <button type="submit" id="book" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Booking...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-calendar-check"></i> Book Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
