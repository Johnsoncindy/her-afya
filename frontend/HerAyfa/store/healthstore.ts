import { getEmergencyContacts, getHealthResources, getHealthTips, getNearbyHealthServices } from '@/app/api/health/health';
import { create } from 'zustand';
import { GooglePlaceService, HealthStore, NearbyService } from './types/health';



export const useHealthStore = create<HealthStore>((set) => ({
  healthTips: { tips: [] },
  healthArticles: [],
  nearbyServices: [],
  loading: false,

  fetchHealthTips: async () => {
    set({ loading: true });
    try {
      const response = await getHealthTips();
      set({ healthTips: { tips: response.data.tips }, loading: false });
    } catch (error) {
      console.error('Error fetching health tips:', error);
      set({ loading: false });
    }
  },

  fetchHealthArticles: async () => {
    set({ loading: true });
    try {
      const response = await getHealthResources();
      
      set({ healthArticles: response.data.articles, loading: false });
    } catch (error) {
      console.error('Error fetching health articles:', error);
      set({ loading: false });
    }
  },

  fetchNearbyServices: async (latitude: number, longitude: number) => {
    set({ loading: true });
    try {
      const services = await getNearbyHealthServices(latitude, longitude);
      const formattedServices: NearbyService[] = services.map((service: GooglePlaceService) => ({
        name: service.name,
        type: service.types[0] || "Healthcare",
        status: service.business_status || "Out of service",
        rating: service.rating || 0,
        isOpen: service.opening_hours?.open_now,
        totalRatings: service.user_ratings_total,
        vicinity: service.vicinity,
        latitude: service.geometry?.location?.lat || 0,
        longitude: service.geometry?.location?.lng || 0,
      }));
      set({ nearbyServices: formattedServices });
    } catch (error) {
      console.error('Error fetching nearby services:', error);
    } finally {
      set({ loading: false });
    }
  },
  emergencyContacts: [],
  selectedCountry: 'LR', // Default to Liberia
  setSelectedCountry: (countryCode) => set({ selectedCountry: countryCode }),
  fetchEmergencyContacts: async () => {
    try {
      const response = await getEmergencyContacts();
      set({ emergencyContacts: response.data.contacts });
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    }
  },
}));
