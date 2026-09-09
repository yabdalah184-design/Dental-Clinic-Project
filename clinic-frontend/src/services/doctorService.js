import apiClient from './apiClient';
import { INITIAL_DOCTORS } from './mockData';

const STORAGE_KEY = 'clinic_doctors';

function getLocalDoctors() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore parse error
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCTORS));
  return INITIAL_DOCTORS;
}

function saveLocalDoctors(doctors) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}

export const doctorService = {
  async getDoctors() {
    try {
      const res = await apiClient.get('/doctors');
      if (res.data) {
        saveLocalDoctors(res.data);
        return res.data;
      }
    } catch {
      // Backend not running, fallback to localStorage
    }
    return getLocalDoctors();
  },

  async getDoctorById(id) {
    const numericId = Number(id);
    try {
      const res = await apiClient.get(`/doctors/${numericId}`);
      if (res.data) return res.data;
    } catch {
      // fallback
    }
    const doctors = getLocalDoctors();
    return doctors.find((d) => d.id === numericId) || null;
  },

  async createDoctor(doctorData) {
    try {
      const res = await apiClient.post('/doctors', doctorData);
      if (res.data) {
        const doctors = getLocalDoctors();
        doctors.push(res.data);
        saveLocalDoctors(doctors);
        return res.data;
      }
    } catch {
      // fallback
    }
    const doctors = getLocalDoctors();
    const newDoctor = {
      ...doctorData,
      id: doctors.length > 0 ? Math.max(...doctors.map((d) => d.id)) + 1 : 1,
      languages: doctorData.languages || ["Arabic (Native)", "English (Fluent)"],
      experience: doctorData.experience || ["Specialist in modern dental treatments."]
    };
    doctors.push(newDoctor);
    saveLocalDoctors(doctors);
    return newDoctor;
  },

  async updateDoctor(id, doctorData) {
    const numericId = Number(id);
    try {
      const res = await apiClient.put(`/doctors/${numericId}`, doctorData);
      if (res.data) {
        const doctors = getLocalDoctors().map((d) => (d.id === numericId ? res.data : d));
        saveLocalDoctors(doctors);
        return res.data;
      }
    } catch {
      // fallback
    }
    const doctors = getLocalDoctors();
    const index = doctors.findIndex((d) => d.id === numericId);
    if (index !== -1) {
      doctors[index] = { ...doctors[index], ...doctorData, id: numericId };
      saveLocalDoctors(doctors);
      return doctors[index];
    }
    throw new Error('Doctor not found');
  },

  async deleteDoctor(id) {
    const numericId = Number(id);
    try {
      await apiClient.delete(`/doctors/${numericId}`);
    } catch {
      // fallback
    }
    const doctors = getLocalDoctors().filter((d) => d.id !== numericId);
    saveLocalDoctors(doctors);
    return true;
  },
};
