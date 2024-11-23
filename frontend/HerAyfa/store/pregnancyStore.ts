import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PregnancyStore } from "./types/pregnancy";
import {
  getPregnancyData,
  createPregnancyData,
  updatePregnancyData,
  addSymptom,
  addAppointment,
  addWeight,
  addKickCount,
  updateChecklist,
  addMemory,
} from "@/app/api/pregnancy/pregnancy";

export const usePregnancyStore = create<PregnancyStore>()(
  persist(
    (set, get) => ({
      pregnancyData: null,
      symptoms: [],
      appointments: [],
      weightEntries: [],
      kickCounts: [],
      checklist: [],
      memories: [],
      loading: false,
      error: null,

      fetchPregnancyData: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await (await getPregnancyData(userId)).data
          set({ 
            pregnancyData: response.data,
            symptoms: response.data.symptoms || [],
            appointments: response.data.appointments || [],
            weightEntries: response.data.weightEntries || [],
            kickCounts: response.data.kickCounts || [],
            checklist: response.data.checklist || [],
            memories: response.data.memories || [],
            loading: false 
          });
        } catch (error: unknown) {
          if ((error as any).response?.status !== 404) {
            set({ error: String(error), loading: false });
          }
          set({ loading: false });
        }
      },

      createPregnancyData: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await createPregnancyData(data);
          set({ 
            pregnancyData: response.data,
            loading: false 
          });
        } catch (error: unknown) {
          set({ error: String(error), loading: false });
        }
      },

      updatePregnancyData: async (userId: string, data) => {
        set({ loading: true, error: null });
        try {
          const response = await updatePregnancyData(userId, data);
          set({ 
            pregnancyData: response.data,
            loading: false 
          });
        } catch (error: unknown) {
          set({ error: String(error), loading: false });
        }
      },

      addSymptom: async (userId: string, symptom) => {
        try {
          const response = await addSymptom(userId, symptom);
          set((state) => ({
            symptoms: [...state.symptoms, response.data]
          }));
        } catch (error: unknown) {
          set({ error: String(error) });
        }
      },

      addAppointment: async (userId: string, appointment) => {
        try {
          const response = await addAppointment(userId, appointment);
          set((state) => ({
            appointments: [...state.appointments, response.data].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
          }));
        } catch (error: unknown) {
          set({ error: String(error) });
        }
      },

      addWeight: async (userId: string, weight) => {
        try {
          const response = await addWeight(userId, weight);
          set((state) => ({
            weightEntries: [...state.weightEntries, response.data].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
          }));
        } catch (error: unknown) {
          set({ error: String(error) });
        }
      },

      addKickCount: async (userId: string, kickCount) => {
        try {
          const response = await addKickCount(userId, kickCount);
          set((state) => ({
            kickCounts: [...state.kickCounts, response.data]
          }));
        } catch (error: unknown) {
          set({ error: String(error) });
        }
      },

      updateChecklist: async (userId: string, checklist) => {
        try {
          await updateChecklist(userId, checklist);
          set({ checklist });
        } catch (error: unknown) {
          set({ error: String(error) });
        }
      },

      addMemory: async (userId: string, memory) => {
        try {
          const response = await addMemory(userId, {
            ...memory,
            date: new Date(),
          });
          set((state) => ({
            memories: [...state.memories, response.data]
          }));
        } catch (error: unknown) {
          set({ error: String(error) });
        }
      },
    }),
    {
      name: 'pregnancy-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pregnancyData: state.pregnancyData,
        symptoms: state.symptoms,
        appointments: state.appointments,
        weightEntries: state.weightEntries,
        kickCounts: state.kickCounts,
        checklist: state.checklist,
        memories: state.memories,
      }),
    }
  )
);
