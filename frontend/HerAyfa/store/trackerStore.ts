import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../app/api/client';
import { CycleData, Insights, Symptom, TrackerActions, TrackerState } from './types/tracker';
import { convertTimestampToDate } from '@/components/PeriodTracker/utils';

type TrackerStore = TrackerState & TrackerActions;

const endpoint = "/period-tracking";

const initialState: TrackerState = {
  cycleHistory: [],
  lastPeriodStart: null,
  periodEndDate: null,
  nextPeriodDate: null,
  insights: {
    averageCycleLength: 0,
    cycleVariation: 0,
  },
  selectedSymptoms: [],
  fertileDays: [],
  ovulationDate: null,
  pregnancyStartDate: null,
  dueDate: null,
  isLoading: false,
  error: null,
};

// Custom storage object for handling Date objects
const customStorage = {
  getItem: async (name: string) => {
    const str = await AsyncStorage.getItem(name);
    const data = str ? JSON.parse(str) : null;
    if (data) {
      // Convert date strings back to Date objects
      if (data.lastPeriodStart) data.lastPeriodStart = convertTimestampToDate(data.lastPeriodStart);
      if (data.periodEndDate) data.periodEndDate = convertTimestampToDate(data.periodEndDate);
      if (data.nextPeriodDate) data.nextPeriodDate = convertTimestampToDate(data.nextPeriodDate);
      if (data.ovulationDate) data.ovulationDate = convertTimestampToDate(data.ovulationDate);
      if (data.pregnancyStartDate) data.pregnancyStartDate = convertTimestampToDate(data.pregnancyStartDate);
      if (data.dueDate) data.dueDate = convertTimestampToDate(data.dueDate);
      
      // Convert dates in cycleHistory
      if (data.cycleHistory) {
        data.cycleHistory = data.cycleHistory.map((cycle: CycleData) => ({
          ...cycle,
          startDate: convertTimestampToDate(cycle.startDate),
          endDate: convertTimestampToDate(cycle.endDate),
          symptoms: cycle.symptoms.map((symptom: Symptom) => ({
            ...symptom,
            date: convertTimestampToDate(symptom.date),
          })),
        }));
      }

      // Convert dates in selectedSymptoms
      if (data.selectedSymptoms) {
        data.selectedSymptoms = data.selectedSymptoms.map((symptom: Symptom) => ({
          ...symptom,
          date: convertTimestampToDate(symptom.date),
        }));
      }

      // Convert dates in fertileDays
      if (data.fertileDays) {
        data.fertileDays = data.fertileDays.map((date: Date) => convertTimestampToDate(date));
      }
    }
    return data;
  },
  setItem: async (name: string, value: any) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

const useTrackerStore = create<TrackerStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        // Get Period Data
        getPeriodData: async (userId: string) => {
            set({ isLoading: true, error: null });
            try {
              const response = await client.get(`${endpoint}/period-data/${userId}`);
              const data = response.data.data;
  
              if (data) {
                const startDate = convertTimestampToDate(data.lastPeriodStart);
                const endDate = data.periodEndDate ? convertTimestampToDate(data.periodEndDate) : null;
  
                // Update cycle history with converted dates
                const cycleHistory = data.cycleHistory?.map((cycle: CycleData) => ({
                  ...cycle,
                  startDate: convertTimestampToDate(cycle.startDate),
                  endDate: convertTimestampToDate(cycle.endDate),
                  symptoms: Array.isArray(cycle.symptoms)
                    ? cycle.symptoms.map((symptom: Symptom) => ({
                        ...symptom,
                        date: convertTimestampToDate(symptom.date),
                      }))
                    : [],
                })) || [];
  
                // Update symptoms with converted dates
                const allSymptoms = cycleHistory.flatMap((cycle: CycleData) => cycle.symptoms);
  
                set({
                  lastPeriodStart: startDate,
                  periodEndDate: endDate,
                  cycleHistory,
                  selectedSymptoms: allSymptoms,
                  insights: data.insights || initialState.insights,
                });
              }
            } catch (error: any) {
              if (error.response?.status !== 404) {
                set({ error: 'Failed to fetch period data' });
                console.error('Error fetching period data:', error);
              }
            } finally {
              set({ isLoading: false });
            }
          },

        // Period Tracking Actions
        createOrUpdatePeriodData: async (userId: string) => {
          set({ isLoading: true, error: null });
          try {
            const { lastPeriodStart, periodEndDate, cycleHistory, insights } = get();
            await client.put(`${endpoint}/period-data`, {
              userId,
              lastPeriodStart,
              periodEndDate,
              cycleHistory,
              insights,
            });
          } catch (error) {
            set({ error: 'Failed to update period data' });
            console.error('Error updating period data:', error);
          } finally {
            set({ isLoading: false });
          }
        },

        addCycleData: async (userId: string, cycleData: CycleData) => {
          set({ isLoading: true, error: null });
          try {
            await client.post(`${endpoint}/cycles`, { userId, cycleData });
            set((state) => ({
              cycleHistory: [...state.cycleHistory, cycleData],
            }));
          } catch (error) {
            set({ error: 'Failed to add cycle data' });
            console.error('Error adding cycle data:', error);
          } finally {
            set({ isLoading: false });
          }
        },

        addSymptom: async (userId: string, symptom: Symptom, cycleIndex: number) => {
          set({ isLoading: true, error: null });
          try {
            await client.post(`${endpoint}/symptoms`, { userId, symptom, cycleIndex });
            set((state) => ({
              selectedSymptoms: [...state.selectedSymptoms, symptom],
            }));
          } catch (error) {
            set({ error: 'Failed to add symptom' });
            console.error('Error adding symptom:', error);
          } finally {
            set({ isLoading: false });
          }
        },

        updateInsights: async (userId: string, insights: Insights) => {
          set({ isLoading: true, error: null });
          try {
            await client.put(`${endpoint}/insights`, { userId, insights });
            set({ insights });
          } catch (error) {
            set({ error: 'Failed to update insights' });
            console.error('Error updating insights:', error);
          } finally {
            set({ isLoading: false });
          }
        },

        setPeriodStartDate: (date: Date) => {
          set({ lastPeriodStart: date });
        },

        setPeriodEndDate: (date: Date) => {
          set({ periodEndDate: date });
        },

        setNextPeriodDate: (date: Date) => {
          set({ nextPeriodDate: date });
        },

        // Rest of the actions remain the same...
        updateFertileDays: (dates: Date[]) => {
          set({ fertileDays: dates });
        },

        setOvulationDate: (date: Date) => {
          set({ ovulationDate: date });
        },

        setPregnancyStartDate: (date: Date) => {
          set({ pregnancyStartDate: date });
          get().calculateDueDate();
        },

        calculateDueDate: () => {
          const { pregnancyStartDate } = get();
          if (pregnancyStartDate) {
            const dueDate = new Date(pregnancyStartDate);
            dueDate.setDate(dueDate.getDate() + 280);
            set({ dueDate });
          }
        },

        resetError: () => {
          set({ error: null });
        },

        clearStore: () => {
          set(initialState);
        },
      }),
      {
        name: 'tracker-storage',
        storage: createJSONStorage(() => customStorage),
        partialize: (state) => ({
          cycleHistory: state.cycleHistory,
          lastPeriodStart: state.lastPeriodStart,
          periodEndDate: state.periodEndDate,
          nextPeriodDate: state.nextPeriodDate,
          insights: state.insights,
          selectedSymptoms: state.selectedSymptoms,
          fertileDays: state.fertileDays,
          ovulationDate: state.ovulationDate,
          pregnancyStartDate: state.pregnancyStartDate,
          dueDate: state.dueDate,
        }),
      }
    )
  )
);

export default useTrackerStore;
