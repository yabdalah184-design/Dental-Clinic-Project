import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import '../assets/css/admin.css';

export default function AdminDashboard() {
  const location = useLocation();

  const getTabFromPath = (pathname) => {
    if (pathname.includes('service') || pathname.includes('pricing')) return 'services';
    if (pathname.includes('appointment') || pathname.includes('booking')) return 'appointments';
    if (pathname.includes('contact') || pathname.includes('message')) return 'contacts';
    return 'doctors';
  };

  const {
    doctors,
    loadingDoctors,
    addDoctor,
    editDoctor,
    removeDoctor,

    services,
    loadingServices,
    addService,
    editService,
    removeService,

    appointments,
    loadingAppointments,
    updateAppointmentStatus,
    removeAppointment,

    contactMessages,
    removeContactMessage,
  } = useData();

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  const [notification, setNotification] = useState(null);

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDanger: true,
    action: null,
  });

  const closeConfirmModal = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Doctor Modal State
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    role: 'DENTIST',
    specialty: '',
    bio: '',
    phone: '',
    email: '',
    address: 'Banha, Egypt',
    image: '/images/PhotoRoom-٢٠٢٢٠٨١٧_٠١٠٣١٤.png',
  });

  // Service Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    price: '',
    category: 'General',
    time: '8:00 am - 10:00 pm',
    description: '',
    image: '/images/007-dental-care-1.png',
  });

  // DOCTOR HANDLERS
  const openAddDoctor = () => {
    setEditingDoctor(null);
    setDoctorForm({
      name: '',
      role: 'DENTIST',
      specialty: '',
      bio: '',
      phone: '',
      email: '',
      address: 'Banha, Egypt',
      image: '/images/PhotoRoom-٢٠٢٢٠٨١٧_٠١٠٣١٤.png',
    });
    setDoctorModalOpen(true);
  };

  const openEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({
      name: doctor.name || '',
      role: doctor.role || 'DENTIST',
      specialty: doctor.specialty || '',
      bio: doctor.bio || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      address: doctor.address || 'Banha, Egypt',
      image: doctor.image || '/images/PhotoRoom-٢٠٢٢٠٨١٧_٠١٠٣١٤.png',
    });
    setDoctorModalOpen(true);
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await editDoctor(editingDoctor.id, doctorForm);
        setNotification({ type: 'success', message: `Doctor "${doctorForm.name}" updated successfully!` });
      } else {
        await addDoctor(doctorForm);
        setNotification({ type: 'success', message: `Doctor "${doctorForm.name}" added successfully!` });
      }
      setDoctorModalOpen(false);
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Error saving doctor.' });
    }
  };

  const promptDeleteDoctor = (doctor) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Remove Doctor?',
      message: `Are you sure you want to remove ${doctor.name} from the clinic directory?`,
      confirmText: 'Yes, Remove Doctor',
      cancelText: 'Keep Doctor',
      isDanger: true,
      action: async () => {
        try {
          await removeDoctor(doctor.id);
          setNotification({ type: 'success', message: `Doctor "${doctor.name}" removed successfully.` });
        } catch (err) {
          setNotification({ type: 'error', message: err.message || 'Failed to remove doctor.' });
        }
      },
    });
  };

  // SERVICE HANDLERS
  const openAddService = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      price: '',
      category: 'General',
      time: '8:00 am - 10:00 pm',
      description: '',
      image: '/images/007-dental-care-1.png',
    });
    setServiceModalOpen(true);
  };

  const openEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title || '',
      price: service.price || '',
      category: service.category || 'General',
      time: service.time || '8:00 am - 10:00 pm',
      description: service.description || '',
      image: service.image || '/images/007-dental-care-1.png',
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await editService(editingService.id, serviceForm);
        setNotification({ type: 'success', message: `Service "${serviceForm.title}" updated successfully!` });
      } else {
        await addService(serviceForm);
        setNotification({ type: 'success', message: `Service "${serviceForm.title}" added successfully!` });
      }
      setServiceModalOpen(false);
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Error saving service.' });
    }
  };

  const promptDeleteService = (service) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Remove Dental Service?',
      message: `Are you sure you want to remove "${service.title}"?`,
      confirmText: 'Yes, Remove Service',
      cancelText: 'Keep Service',
      isDanger: true,
      action: async () => {
        try {
          await removeService(service.id);
          setNotification({ type: 'success', message: `Service "${service.title}" removed.` });
        } catch (err) {
          setNotification({ type: 'error', message: err.message || 'Failed to remove service.' });
        }
      },
    });
  };

  // APPOINTMENT HANDLERS
  const promptCancelAppointment = (appt) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Cancel Appointment?',
      message: `Are you sure you want to change the status of appointment #${appt.id} for ${appt.name} to Cancelled?`,
      confirmText: 'Yes, Cancel Appointment',
      cancelText: 'Keep Status',
      isDanger: true,
      action: async () => {
        try {
          await updateAppointmentStatus(appt.id, 'Cancelled');
          setNotification({ type: 'success', message: `Appointment #${appt.id} marked as Cancelled.` });
        } catch (err) {
          setNotification({ type: 'error', message: err.message || 'Failed to cancel appointment.' });
        }
      },
    });
  };

  const promptDeleteAppointment = (appt) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Appointment Record?',
      message: `Are you sure you want to permanently delete appointment record #${appt.id} for ${appt.name}?`,
      confirmText: 'Yes, Delete Record',
      cancelText: 'Keep Record',
      isDanger: true,
      action: async () => {
        try {
          await removeAppointment(appt.id);
          setNotification({ type: 'success', message: `Appointment #${appt.id} deleted successfully.` });
        } catch (err) {
          setNotification({ type: 'error', message: err.message || 'Failed to delete appointment.' });
        }
      },
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setNotification({ type: 'success', message: `Appointment #${id} updated to ${newStatus}.` });
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to update status.' });
    }
  };

  // CONTACT INQUIRY HANDLERS
  const promptDeleteContact = (msg) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Inquiry?',
      message: `Delete message from ${msg.name}?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Keep Message',
      isDanger: true,
      action: () => {
        removeContactMessage(msg.id);
        setNotification({ type: 'success', message: 'Inquiry message removed.' });
      },
    });
  };

  return (
    <div className="page-admin">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>Administrative Management Dashboard</h1>
            <p>Live CRUD controls for doctors, services, appointments, and inquiries with LocalStorage persistence.</p>
          </div>
        </div>

        {notification && (
          <AlertMessage
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Tab Selection Navigation */}
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <i className="fa-solid fa-user-doctor"></i> Doctors Directory
            <span className="badge">{doctors.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <i className="fa-solid fa-tooth"></i> Dental Services
            <span className="badge">{services.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="fa-solid fa-calendar-check"></i> Patient Appointments
            <span className="badge">{appointments.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <i className="fa-solid fa-envelope"></i> Contact Inquiries
            <span className="badge">{contactMessages.length}</span>
          </button>
        </div>

        {/* TAB 1: DOCTORS CRUD */}
        {activeTab === 'doctors' && (
          <div className="table-card">
            <div className="table-toolbar">
              <h2 className="table-title">Doctor & Consultant Records</h2>
              <button type="button" className="insert-btn" onClick={openAddDoctor}>
                <i className="fa-solid fa-user-plus"></i> Insert Doctor
              </button>
            </div>

            {loadingDoctors ? (
              <LoadingSpinner text="Loading doctors records..." />
            ) : doctors.length === 0 ? (
              <EmptyState
                title="No Doctors Found"
                description="Click 'Insert Doctor' above to register a new doctor."
                icon="fa-user-doctor"
                actionText="Insert Doctor"
                onAction={openAddDoctor}
              />
            ) : (
              <div className="admin-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Photo</th>
                      <th>Doctor Name</th>
                      <th>Role</th>
                      <th>Specialty</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doc) => (
                      <tr key={doc.id}>
                        <td><strong>#{doc.id}</strong></td>
                        <td>
                          <img
                            src={doc.image || '/images/PhotoRoom-٢٠٢٢٠٨١٧_٠١٠٣١٤.png'}
                            alt={doc.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        </td>
                        <td><strong>{doc.name}</strong></td>
                        <td><span className="status-pill pending">{doc.role || 'Dentist'}</span></td>
                        <td>{doc.specialty}</td>
                        <td>{doc.phone || 'N/A'}</td>
                        <td>
                          <div className="action-btns">
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() => openEditDoctor(doc)}
                              title="Edit doctor details"
                            >
                              <i className="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => promptDeleteDoctor(doc)}
                              title="Delete doctor"
                            >
                              <i className="fa-solid fa-trash"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SERVICES CRUD */}
        {activeTab === 'services' && (
          <div className="table-card">
            <div className="table-toolbar">
              <h2 className="table-title">Dental Service Offerings & Pricing</h2>
              <button type="button" className="insert-btn" onClick={openAddService}>
                <i className="fa-solid fa-plus"></i> Insert Service
              </button>
            </div>

            {loadingServices ? (
              <LoadingSpinner text="Loading services records..." />
            ) : services.length === 0 ? (
              <EmptyState
                title="No Services Found"
                description="Click 'Insert Service' above to add a new dental procedure."
                icon="fa-tooth"
                actionText="Insert Service"
                onAction={openAddService}
              />
            ) : (
              <div className="admin-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Icon</th>
                      <th>Service Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Schedule Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((serv) => (
                      <tr key={serv.id}>
                        <td><strong>#{serv.id}</strong></td>
                        <td>
                          <img
                            src={serv.image || '/images/007-dental-care-1.png'}
                            alt={serv.title}
                            style={{ width: '35px', height: '35px', objectFit: 'contain' }}
                          />
                        </td>
                        <td><strong>{serv.title}</strong></td>
                        <td>
                          <span className="status-pill confirmed">{serv.category || 'General'}</span>
                        </td>
                        <td><strong>{serv.price} EG</strong></td>
                        <td>{serv.time || 'All Day'}</td>
                        <td>
                          <div className="action-btns">
                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() => openEditService(serv)}
                              title="Edit service"
                            >
                              <i className="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => promptDeleteService(serv)}
                              title="Delete service"
                            >
                              <i className="fa-solid fa-trash"></i> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPOINTMENTS CRUD */}
        {activeTab === 'appointments' && (
          <div className="table-card">
            <div className="table-toolbar">
              <h2 className="table-title">Patient Bookings & Consultations</h2>
            </div>

            {loadingAppointments ? (
              <LoadingSpinner text="Loading appointments records..." />
            ) : appointments.length === 0 ? (
              <EmptyState
                title="No Appointments Booked"
                description="Appointments booked through the patient booking form will appear here."
                icon="fa-calendar-xmark"
              />
            ) : (
              <div className="admin-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient Name</th>
                      <th>Contact</th>
                      <th>Doctor</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td><strong>#{appt.id}</strong></td>
                        <td>
                          <strong>{appt.name}</strong>
                          {appt.message && (
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                              <em>"{appt.message}"</em>
                            </div>
                          )}
                        </td>
                        <td>
                          <div>{appt.phone}</div>
                          <small style={{ color: '#64748b' }}>{appt.email}</small>
                        </td>
                        <td>{appt.doctorName || 'General Clinician'}</td>
                        <td>
                          <div>{appt.date}</div>
                          <small style={{ color: '#0cb4c0', fontWeight: 600 }}>{appt.time}</small>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              appt.status === 'Confirmed'
                                ? 'confirmed'
                                : appt.status === 'Cancelled'
                                ? 'cancelled'
                                : 'pending'
                            }`}
                          >
                            {appt.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            {appt.status !== 'Confirmed' && (
                              <button
                                type="button"
                                className="edit-btn"
                                style={{ backgroundColor: '#059669' }}
                                onClick={() => handleStatusChange(appt.id, 'Confirmed')}
                                title="Confirm Appointment"
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
                            {appt.status !== 'Cancelled' && (
                              <button
                                type="button"
                                className="edit-btn"
                                style={{ backgroundColor: '#d97706' }}
                                onClick={() => promptCancelAppointment(appt)}
                                title="Cancel Appointment"
                              >
                                <i className="fa-solid fa-ban"></i>
                              </button>
                            )}
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => promptDeleteAppointment(appt)}
                              title="Delete booking record"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTACT INQUIRIES */}
        {activeTab === 'contacts' && (
          <div className="table-card">
            <div className="table-toolbar">
              <h2 className="table-title">Contact Form Messages & Inquiries</h2>
            </div>

            {contactMessages.length === 0 ? (
              <EmptyState
                title="No Messages Received"
                description="Submissions from the Contact Us page will be displayed here."
                icon="fa-inbox"
              />
            ) : (
              <div className="admin-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Sender Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Received Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.map((msg) => (
                      <tr key={msg.id}>
                        <td><strong>#{msg.id}</strong></td>
                        <td><strong>{msg.name}</strong></td>
                        <td>{msg.phone}</td>
                        <td>{msg.email}</td>
                        <td style={{ maxWidth: '300px', lineHeight: '20px' }}>{msg.message}</td>
                        <td>
                          <small style={{ color: '#64748b' }}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'}
                          </small>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => promptDeleteContact(msg)}
                            title="Delete inquiry"
                          >
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        isDanger={confirmConfig.isDanger}
        onConfirm={async () => {
          if (confirmConfig.action) {
            await confirmConfig.action();
          }
          closeConfirmModal();
        }}
        onCancel={closeConfirmModal}
      />

      {/* DOCTOR INSERT / EDIT MODAL */}
      <Modal
        isOpen={doctorModalOpen}
        title={editingDoctor ? `Edit Doctor: ${editingDoctor.name}` : 'Insert New Doctor'}
        onClose={() => setDoctorModalOpen(false)}
      >
        <form onSubmit={handleSaveDoctor} className="admin-modal-form">
          <div className="form-group">
            <label>Doctor Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Dr/ Tamer Hosny"
              value={doctorForm.name}
              onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Role / Position *</label>
            <select
              value={doctorForm.role}
              onChange={(e) => setDoctorForm({ ...doctorForm, role: e.target.value })}
            >
              <option value="HEAD DENTIST">HEAD DENTIST</option>
              <option value="DENTIST">DENTIST</option>
              <option value="CONSULTANT">CONSULTANT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Specialty *</label>
            <input
              type="text"
              required
              placeholder="e.g. Orthodontics & Implants"
              value={doctorForm.specialty}
              onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="010xxxxxxxx"
              value={doctorForm.phone}
              onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="doctor@elhuda.com"
              value={doctorForm.email}
              onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Biography Summary</label>
            <textarea
              rows={3}
              placeholder="Consultant details and clinical specialties..."
              value={doctorForm.bio}
              onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-modal-btn" onClick={() => setDoctorModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="save-modal-btn">
              {editingDoctor ? 'Save Changes' : 'Insert Doctor'}
            </button>
          </div>
        </form>
      </Modal>

      {/* SERVICE INSERT / EDIT MODAL */}
      <Modal
        isOpen={serviceModalOpen}
        title={editingService ? `Edit Service: ${editingService.title}` : 'Insert New Service'}
        onClose={() => setServiceModalOpen(false)}
      >
        <form onSubmit={handleSaveService} className="admin-modal-form">
          <div className="form-group">
            <label>Service Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Zirconium Crown"
              value={serviceForm.title}
              onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Price (EG) *</label>
            <input
              type="number"
              required
              placeholder="e.g. 500"
              value={serviceForm.price}
              onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={serviceForm.category}
              onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Restorative">Restorative</option>
              <option value="Cosmetic">Cosmetic</option>
              <option value="Pediatric">Pediatric</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>

          <div className="form-group">
            <label>Schedule Availability</label>
            <input
              type="text"
              placeholder="e.g. 8:00 am - 10:00 pm"
              value={serviceForm.time}
              onChange={(e) => setServiceForm({ ...serviceForm, time: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              placeholder="Details on this procedure..."
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-modal-btn" onClick={() => setServiceModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="save-modal-btn">
              {editingService ? 'Save Changes' : 'Insert Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
