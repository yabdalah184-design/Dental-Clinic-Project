import apiClient from './apiClient';
import { INITIAL_SERVICES, INITIAL_PRICING_SECTIONS } from './mockData';

const SERVICES_KEY = 'clinic_services';
const PRICING_KEY = 'clinic_pricing_sections';

function getLocalServices() {
  const saved = localStorage.getItem(SERVICES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
  return INITIAL_SERVICES;
}

function saveLocalServices(services) {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

function getLocalPricing() {
  const saved = localStorage.getItem(PRICING_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 4) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  localStorage.setItem(PRICING_KEY, JSON.stringify(INITIAL_PRICING_SECTIONS));
  return INITIAL_PRICING_SECTIONS;
}

function saveLocalPricing(pricing) {
  localStorage.setItem(PRICING_KEY, JSON.stringify(pricing));
}

export const serviceService = {
  async getServices() {
    try {
      const res = await apiClient.get('/services');
      if (res.data) {
        saveLocalServices(res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getLocalServices();
  },

  async getPricingSections() {
    try {
      const res = await apiClient.get('/pricing');
      if (res.data) {
        saveLocalPricing(res.data);
        return res.data;
      }
    } catch {
      // fallback
    }
    return getLocalPricing();
  },

  async createService(serviceData) {
    try {
      const res = await apiClient.post('/services', serviceData);
      if (res.data) {
        const list = getLocalServices();
        list.push(res.data);
        saveLocalServices(list);
        return res.data;
      }
    } catch {
      // fallback
    }
    const list = getLocalServices();
    const newService = {
      ...serviceData,
      id: list.length > 0 ? Math.max(...list.map((s) => s.id)) + 1 : 1,
      image: serviceData.image || "/images/007-dental-care-1.png",
      time: serviceData.time || "8:00 am - 10:00 pm",
      category: serviceData.category || "General",
      price: Number(serviceData.price) || 100
    };
    list.push(newService);
    saveLocalServices(list);
    return newService;
  },

  async updateService(id, serviceData) {
    const numericId = Number(id);
    try {
      const res = await apiClient.put(`/services/${numericId}`, serviceData);
      if (res.data) {
        const list = getLocalServices().map((s) => (s.id === numericId ? res.data : s));
        saveLocalServices(list);
        return res.data;
      }
    } catch {
      // fallback
    }
    const list = getLocalServices();
    const index = list.findIndex((s) => s.id === numericId);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...serviceData,
        id: numericId,
        price: Number(serviceData.price) || list[index].price
      };
      saveLocalServices(list);
      return list[index];
    }
    throw new Error('Service not found');
  },

  async deleteService(id) {
    const numericId = Number(id);
    try {
      await apiClient.delete(`/services/${numericId}`);
    } catch {
      // fallback
    }
    const list = getLocalServices().filter((s) => s.id !== numericId);
    saveLocalServices(list);
    return true;
  },
};
