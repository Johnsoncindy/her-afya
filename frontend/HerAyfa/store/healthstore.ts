import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  getEmergencyContacts, 
  getHealthResources, 
  getHealthTips, 
  getNearbyHealthServices 
} from '@/app/api/health/health';
import { getReminders } from "@/app/api/reminder/reminder";
import { 
  GooglePlaceService, 
  HealthStore, 
  NearbyService,
  HealthTip,
  HealthArticle,
  CountryEmergencyContacts,
  EmergencyContactsResponse,
  ReminderResponse
} from './types/health';
import useUserStore from './userStore';

// Add timestamp for cache invalidation
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// Extended HealthStore interface to include new features
interface ExtendedHealthStore extends HealthStore {
  lastFetch: {
    healthTips: number;
    healthArticles: number;
    emergencyContacts: number;
  };
  isCacheValid: (lastFetchTime: number) => boolean;
  batchFetchData: (force?: boolean) => Promise<void>;
}

export const useHealthStore = create<ExtendedHealthStore>()(
  persist(
    (set, get) => ({
      healthTips: { tips: [] },
      healthArticles: [],
      nearbyServices: [],
      loading: false,
      emergencyContacts: [],
      reminders: null,
      selectedCountry: 'LR',
      lastFetch: {
        healthTips: 0,
        healthArticles: 0,
        emergencyContacts: 0,
      },

      isCacheValid: (lastFetchTime: number): boolean => {
        return Date.now() - lastFetchTime < CACHE_DURATION;
      },

      fetchHealthTips: async (force = false) => {
        const state = get();
        if (!force && state.isCacheValid(state.lastFetch.healthTips) && state.healthTips.tips.length > 0) {
          return;
        }

        set({ loading: true });
        try {
          const response = await getHealthTips();
          const tipsWithIds = response.data.tips.map((tip: Partial<HealthTip>, index: number) => ({
            ...tip,
            id: tip.id || `tip-${index}`,
            category: tip.category || 'General',
          } as HealthTip));
          
          set({ 
            healthTips: { tips: tipsWithIds }, 
            loading: false,
            lastFetch: {
              ...state.lastFetch,
              healthTips: Date.now()
            }
          });
        } catch (error) {
          console.error('Error fetching health tips:', error);
          set({ loading: false });
        }
      },

      fetchHealthArticles: async (force = false) => {
        const state = get();
        if (!force && state.isCacheValid(state.lastFetch.healthArticles) && state.healthArticles.length > 0) {
          return;
        }

        set({ loading: true });
        try {
          const response = await getHealthResources();
          const articlesWithIds = response.data.articles.map((article: Partial<HealthArticle>, index: number) => ({
            ...article,
            id: article.id || `article-${index}`,
            category: article.category || 'General',
            type: article.type || 'text',
            content: article.content || '',
            videoUrl: article.videoUrl || '',
          } as HealthArticle));
          
          set({ 
            healthArticles: articlesWithIds, 
            loading: false,
            lastFetch: {
              ...state.lastFetch,
              healthArticles: Date.now()
            }
          });
        } catch (error) {
          console.error('Error fetching health articles:', error);
          set({ loading: false });
        }
      },

      fetchReminders: async () => {
        set({ loading: true });
        const userId = useUserStore.getState().user?.id ?? "";
        try {
          const res = await getReminders(userId);
          set({ reminders: res.data as ReminderResponse, loading: false });
        } catch (error) {
          console.error('Error fetching reminders:', error);
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

      fetchEmergencyContacts: async (force = false) => {
        const state = get();
        if (!force && state.isCacheValid(state.lastFetch.emergencyContacts) && state.emergencyContacts.length > 0) {
          return;
        }

        try {
          const response = await getEmergencyContacts();
          const contactsData = response.data as EmergencyContactsResponse;
          
          set({ 
            emergencyContacts: contactsData.contacts,
            lastFetch: {
              ...state.lastFetch,
              emergencyContacts: Date.now()
            }
          });
        } catch (error) {
          console.error('Error fetching emergency contacts:', error);
        }
      },

      setSelectedCountry: (countryCode: string) => {
        set({ selectedCountry: countryCode });
      },

      batchFetchData: async (force = false) => {
        set({ loading: true });
        try {
          await Promise.all([
            get().fetchHealthTips(force),
            get().fetchHealthArticles(force),
            get().fetchEmergencyContacts(force),
            get().fetchReminders()
          ]);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'health-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        healthTips: state.healthTips,
        healthArticles: state.healthArticles,
        emergencyContacts: state.emergencyContacts,
        selectedCountry: state.selectedCountry,
        lastFetch: state.lastFetch,
        reminders: state.reminders,
      }),
    }
  )
);
