import apiClient from './apiClient';
import { INITIAL_APPOINTMENTS } from './mockData';

const STORAGE_KEY = 'clinic_appointments';

function getLocalAppointments() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
  return INITIAL_APPOINTMENTS;
}

function saveLocalAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

export const appointmentService = {
  async getAppointments() {
    try {
      const res = await apiClient.get('/appointments');
      if (res.data) {
        saveLocalAppointments(res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getLocalAppointments();
  },

  async createAppointment(bookingData) {
    try {
      const res = await apiClient.post('/appointments', bookingData);
      if (res.data) {
        const list = getLocalAppointments();
        list.push(res.data);
        saveLocalAppointments(list);
        return res.data;
      }
    } catch {
      // fallback
    }
    const list = getLocalAppointments();
    const newAppointment = {
      ...bookingData,
      id: list.length > 0 ? Math.max(...list.map((a) => a.id)) + 1 : 1,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    list.push(newAppointment);
    saveLocalAppointments(list);
    return newAppointment;
  },

  async updateAppointmentStatus(id, status) {
    const numericId = Number(id);
    try {
      const res = await apiClient.patch(`/appointments/${numericId}`, { status });
      if (res.data) {
        const list = getLocalAppointments().map((a) => (a.id === numericId ? res.data : a));
        saveLocalAppointments(list);
        return res.data;
      }
    } catch {
      // fallback
    }
    const list = getLocalAppointments();
    const index = list.findIndex((a) => a.id === numericId);
    if (index !== -1) {
      list[index] = { ...list[index], status };
      saveLocalAppointments(list);
      return list[index];
    }
    throw new Error('Appointment not found');
  },

  async deleteAppointment(id) {
    const numericId = Number(id);
    try {
      await apiClient.delete(`/appointments/${numericId}`);
    } catch {
      // fallback
    }
    const list = getLocalAppointments().filter((a) => a.id !== numericId);
    saveLocalAppointments(list);
    return true;
  },
};
