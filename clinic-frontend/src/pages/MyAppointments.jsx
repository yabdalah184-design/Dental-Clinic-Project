import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

export default function MyAppointments() {
  const { appointments, loadingAppointments, updateAppointmentStatus } = useData();
  const { currentUser } = useAuth();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [targetAppointment, setTargetAppointment] = useState(null);
  const [alert, setAlert] = useState(null);

  // Filter appointments relevant to current user, or all if evaluation user
  const myAppointments = useMemo(() => {
    if (!currentUser) return [];
    return appointments.filter(
      (a) =>
        a.email?.toLowerCase() === currentUser.email?.toLowerCase() ||
        a.name?.toLowerCase() === currentUser.name?.toLowerCase() ||
        currentUser.role === 'admin'
    );
  }, [appointments, currentUser]);

  const promptCancel = (appt) => {
    setTargetAppointment(appt);
    setConfirmModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetAppointment) return;
    try {
      await updateAppointmentStatus(targetAppointment.id, 'Cancelled');
      setAlert({
        type: 'success',
        message: `Appointment #${targetAppointment.id} with ${targetAppointment.doctorName || 'Doctor'} has been cancelled.`,
      });
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to cancel appointment.' });
    } finally {
      setConfirmModalOpen(false);
      setTargetAppointment(null);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto 80px', padding: '0 20px', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '32px', color: '#1a202c', fontFamily: "'Poppins', sans-serif", margin: 0 }}>
            My Clinical Appointments
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '6px' }}>
            Manage your consultations, scheduled dates, and treatment bookings.
          </p>
        </div>
        <Link
          to="/make-appointment"
          style={{
            backgroundColor: '#0cb4c0',
            color: '#fff',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(12, 180, 192, 0.25)',
          }}
        >
          <i className="fa-solid fa-plus"></i> Book New Appointment
        </Link>
      </div>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {loadingAppointments ? (
        <LoadingSpinner text="Retrieving your appointments..." size="large" />
      ) : myAppointments.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description="You haven't booked any dental appointments yet. Choose a specialist and book your visit in seconds."
          icon="fa-calendar-days"
          actionText="Make An Appointment"
          onAction={() => window.location.assign('/make-appointment')}
        />
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {myAppointments.map((appt) => (
            <div
              key={appt.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '18px', color: '#1e293b', margin: 0, fontWeight: '700' }}>
                    {appt.doctorName || 'Dental Specialist'}
                  </h3>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor:
                        appt.status === 'Confirmed'
                          ? '#d1fae5'
                          : appt.status === 'Cancelled'
                          ? '#fee2e2'
                          : '#fef3c7',
                      color:
                        appt.status === 'Confirmed'
                          ? '#065f46'
                          : appt.status === 'Cancelled'
                          ? '#991b1b'
                          : '#92400e',
                    }}
                  >
                    {appt.status || 'Pending'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#64748b', flexWrap: 'wrap' }}>
                  <span>
                    <i className="fa-solid fa-calendar-day" style={{ color: '#0cb4c0', marginRight: '6px' }}></i>
                    {appt.date}
                  </span>
                  <span>
                    <i className="fa-solid fa-clock" style={{ color: '#0cb4c0', marginRight: '6px' }}></i>
                    {appt.time}
                  </span>
                  <span>
                    <i className="fa-solid fa-phone" style={{ color: '#0cb4c0', marginRight: '6px' }}></i>
                    {appt.phone}
                  </span>
                </div>

                {appt.message && (
                  <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>
                    Note: "{appt.message}"
                  </p>
                )}
              </div>

              <div>
                {appt.status !== 'Cancelled' ? (
                  <button
                    type="button"
                    onClick={() => promptCancel(appt)}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <i className="fa-solid fa-ban"></i> Cancel Booking
                  </button>
                ) : (
                  <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                    Booking Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Cancellation */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Cancel Appointment?"
        message={`Are you sure you want to cancel appointment #${targetAppointment?.id} scheduled on ${targetAppointment?.date} at ${targetAppointment?.time}?`}
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        isDanger={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setConfirmModalOpen(false);
          setTargetAppointment(null);
        }}
      />
    </div>
  );
}
