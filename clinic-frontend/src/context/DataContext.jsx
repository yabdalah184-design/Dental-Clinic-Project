import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doctorService } from '../services/doctorService';
import { serviceService } from '../services/serviceService';
import { appointmentService } from '../services/appointmentService';
import { contactService } from '../services/contactService';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [pricingSections, setPricingSections] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const [errorDoctors, setErrorDoctors] = useState(null);
  const [errorServices, setErrorServices] = useState(null);
  const [errorAppointments, setErrorAppointments] = useState(null);

  // Doctors
  const refreshDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    setErrorDoctors(null);
    try {
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (err) {
      setErrorDoctors(err.message || 'Failed to load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  const addDoctor = async (doctorData) => {
    const newDoc = await doctorService.createDoctor(doctorData);
    setDoctors((prev) => [...prev, newDoc]);
    return newDoc;
  };

  const editDoctor = async (id, doctorData) => {
    const updated = await doctorService.updateDoctor(id, doctorData);
    setDoctors((prev) => prev.map((d) => (d.id === id ? updated : d)));
    return updated;
  };

  const removeDoctor = async (id) => {
    await doctorService.deleteDoctor(id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  // Services & Pricing
  const refreshServices = useCallback(async () => {
    setLoadingServices(true);
    setErrorServices(null);
    try {
      const [servicesData, pricingData] = await Promise.all([
        serviceService.getServices(),
        serviceService.getPricingSections(),
      ]);
      setServices(servicesData);
      setPricingSections(pricingData);
    } catch (err) {
      setErrorServices(err.message || 'Failed to load dental services');
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const addService = async (serviceData) => {
    const newServ = await serviceService.createService(serviceData);
    setServices((prev) => [...prev, newServ]);
    return newServ;
  };

  const editService = async (id, serviceData) => {
    const updated = await serviceService.updateService(id, serviceData);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const removeService = async (id) => {
    await serviceService.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // Appointments
  const refreshAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    setErrorAppointments(null);
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      setErrorAppointments(err.message || 'Failed to load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  const bookAppointment = async (bookingData) => {
    const newAppt = await appointmentService.createAppointment(bookingData);
    setAppointments((prev) => [newAppt, ...prev]);
    return newAppt;
  };

  const updateAppointmentStatus = async (id, status) => {
    const updated = await appointmentService.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const removeAppointment = async (id) => {
    await appointmentService.deleteAppointment(id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Contact Messages
  const refreshContactMessages = useCallback(() => {
    const msgs = contactService.getMessages();
    setContactMessages(msgs);
  }, []);

  const submitContactMessage = (msgData) => {
    const newMsg = contactService.submitMessage(msgData);
    setContactMessages((prev) => [newMsg, ...prev]);
    return newMsg;
  };

  const removeContactMessage = (id) => {
    contactService.deleteMessage(id);
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    refreshDoctors();
    refreshServices();
    refreshAppointments();
    refreshContactMessages();
  }, [refreshDoctors, refreshServices, refreshAppointments, refreshContactMessages]);

  const value = {
    doctors,
    loadingDoctors,
    errorDoctors,
    refreshDoctors,
    addDoctor,
    editDoctor,
    removeDoctor,

    services,
    pricingSections,
    loadingServices,
    errorServices,
    refreshServices,
    addService,
    editService,
    removeService,

    appointments,
    loadingAppointments,
    errorAppointments,
    refreshAppointments,
    bookAppointment,
    updateAppointmentStatus,
    removeAppointment,

    contactMessages,
    submitContactMessage,
    removeContactMessage,
    refreshContactMessages,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
