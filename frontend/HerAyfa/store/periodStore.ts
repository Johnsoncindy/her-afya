import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { convertFirestoreTimestamp, CycleData, Symptom } from "./types/period";
import {
  createOrUpdatePeriodData,
  getPeriodData,
  addCycleData,
  addSymptom,
  updateInsights,
} from "@/app/api/period-tracker/period-tracker";
import {
  calculateCycleInsights,
  convertTimestampToDate,
} from "@/components/PeriodTracker/utils";

interface PeriodStore {
  // State
  lastPeriodStart: Date | null;
  periodEndDate: Date | null;
  nextPeriodDate: Date | null;
  cycleHistory: CycleData[];
  selectedSymptoms: Symptom[];
  averageCycleLength: number | null;
  cycleVariation: number | null;
  loading: boolean;
  error: string | null;
  calendarId: string | null;
  hasCalendarPermission: boolean;

  // Actions
  fetchPeriodData: (userId: string) => Promise<void>;
  setPeriodStart: (userId: string, startDate: Date) => Promise<void>;
  setPeriodEnd: (userId: string, endDate: Date) => Promise<void>;
  addCycleToPeriodHistory: (
    userId: string,
    startDate: Date,
    endDate: Date
  ) => Promise<void>;
  addSymptomToCycle: (
    userId: string,
    symptom: Symptom,
    cycleIndex: number
  ) => Promise<void>;
  updateCycleInsights: (userId: string) => Promise<void>;
  setCalendarId: (id: string) => void;
  setCalendarPermission: (hasPermission: boolean) => void;
  setNextPeriodDate: (date: Date) => void;
  reset: () => void;
}

export const usePeriodStore = create<PeriodStore>()(
  persist(
    (set, get) => ({
      // Initial state
      lastPeriodStart: null,
      periodEndDate: null,
      nextPeriodDate: null,
      cycleHistory: [],
      selectedSymptoms: [],
      averageCycleLength: null,
      cycleVariation: null,
      loading: false,
      error: null,
      calendarId: null,
      hasCalendarPermission: false,

      // Actions
      fetchPeriodData: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await getPeriodData(userId);
      
          if (response?.data?.data) {
            const data = response.data.data;
            
            // Convert Firestore timestamps to Dates using the utility function
            const startDate = convertTimestampToDate(data.lastPeriodStart);
            const endDate = convertTimestampToDate(data.periodEndDate);
      
            // Process cycle history with proper type checking
            let processedCycleHistory: CycleData[] = [];
      
            if (Array.isArray(data.cycleHistory)) {
              processedCycleHistory = data.cycleHistory
                .map((cycle: any) => {
                  // If cycle is invalid, skip it
                  if (!cycle || !cycle.startDate || !cycle.endDate) {
                    console.log('Invalid cycle data:', cycle);
                    return null;
                  }
      
                  try {
                    const cycleStartDate = convertTimestampToDate(cycle.startDate);
                    const cycleEndDate = convertTimestampToDate(cycle.endDate);
      
                    // Validate converted dates
                    if (!cycleStartDate || !cycleEndDate || isNaN(cycleStartDate.getTime()) || isNaN(cycleEndDate.getTime())) {
                      console.log('Invalid dates in cycle:', cycle);
                      return null;
                    }
      
                    // Process symptoms if they exist
                    const symptoms = Array.isArray(cycle.symptoms)
                      ? cycle.symptoms
                          .map((symptom: any) => {
                            if (!symptom?.date) return null;
      
                            const symptomDate = convertTimestampToDate(symptom.date);
                            if (!symptomDate || isNaN(symptomDate.getTime())) return null;
      
                            return {
                              id: symptom.id || '',
                              name: symptom.name || '',
                              intensity: symptom.intensity || 1,
                              date: symptomDate,
                            };
                          })
                          .filter(Boolean)
                      : [];
      
                    return {
                      startDate: cycleStartDate,
                      endDate: cycleEndDate,
                      length: cycle.length || Math.ceil((cycleEndDate.getTime() - cycleStartDate.getTime()) / (1000 * 60 * 60 * 24)),
                      symptoms,
                    };
                  } catch (error) {
                    console.log('Error processing cycle:', cycle, error);
                    return null;
                  }
                })
                .filter(Boolean) as CycleData[];
            }
      
            // Process symptoms
            const processedSymptoms = processedCycleHistory.flatMap((cycle) => cycle.symptoms || []);
      
            // Set state with processed data
            set({
              lastPeriodStart: startDate,
              periodEndDate: endDate,
              cycleHistory: processedCycleHistory,
              selectedSymptoms: processedSymptoms,
              averageCycleLength: data.insights?.averageCycleLength || null,
              cycleVariation: data.insights?.cycleVariation || null,
              loading: false,
            });
      
            // Log the processed data for verification
            console.log('Processed cycle history:', processedCycleHistory);
            
            return;
          }
      
          console.log("No valid data structure found in response:", response);
          set({ loading: false });
      
        } catch (error: any) {
          console.error("Error fetching period data:", error);
          set({
            loading: false,
            error: error.response?.status === 404 
              ? "No data found" 
              : "Failed to fetch period data",
          });
        }
      },
      setPeriodStart: async (userId: string, startDate: Date) => {
        set({ loading: true, error: null });
        try {
          await createOrUpdatePeriodData({
            userId,
            lastPeriodStart: startDate,
            periodEndDate: get().periodEndDate,
            cycleHistory: get().cycleHistory,
            insights: {
              averageCycleLength: get().averageCycleLength || 0,
              cycleVariation: get().cycleVariation || 0,
            },
          });
          set({ lastPeriodStart: startDate });
        } catch (error) {
          set({ error: "Failed to set period start date" });
          console.error("Error setting period start:", error);
          Alert.alert("Error", "Failed to set period start date");
        } finally {
          set({ loading: false });
        }
      },

      setPeriodEnd: async (userId: string, endDate: Date) => {
        set({ loading: true, error: null });
        try {
          await createOrUpdatePeriodData({
            userId,
            lastPeriodStart: get().lastPeriodStart!,
            periodEndDate: endDate,
            cycleHistory: get().cycleHistory,
            insights: {
              averageCycleLength: get().averageCycleLength || 0,
              cycleVariation: get().cycleVariation || 0,
            },
          });
          set({ periodEndDate: endDate });
        } catch (error) {
          set({ error: "Failed to set period end date" });
          console.error("Error setting period end:", error);
          Alert.alert("Error", "Failed to set period end date");
        } finally {
          set({ loading: false });
        }
      },

      addCycleToPeriodHistory: async (
        userId: string,
        startDate: Date,
        endDate: Date
      ) => {
        const newCycle: CycleData = {
          startDate,
          endDate,
          length: Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          ),
          symptoms: get().selectedSymptoms.filter(
            (symptom) => symptom.date >= startDate && symptom.date <= endDate
          ),
        };

        set({ loading: true, error: null });
        try {
          await addCycleData({ userId, cycleData: newCycle });
          set((state) => ({
            cycleHistory: [...state.cycleHistory, newCycle],
          }));
        } catch (error) {
          set({ error: "Failed to add cycle to history" });
          console.error("Error adding cycle:", error);
          Alert.alert("Error", "Failed to add cycle data");
        } finally {
          set({ loading: false });
        }
      },

      addSymptomToCycle: async (
        userId: string,
        symptom: Symptom,
        cycleIndex: number
      ) => {
        set({ loading: true, error: null });
        try {
          await addSymptom({
            userId,
            symptom,
            cycleIndex,
          });
          set((state) => ({
            selectedSymptoms: [...state.selectedSymptoms, symptom],
          }));
        } catch (error) {
          set({ error: "Failed to add symptom" });
          console.error("Error adding symptom:", error);
          Alert.alert("Error", "Failed to add symptom");
        } finally {
          set({ loading: false });
        }
      },

      updateCycleInsights: async (userId: string) => {
        const cycleHistory = get().cycleHistory;
        if (cycleHistory.length >= 2) {
          const { averageCycleLength, cycleVariation } =
            calculateCycleInsights(cycleHistory);
          set({ loading: true, error: null });
          try {
            await updateInsights({
              userId,
              insights: {
                averageCycleLength,
                cycleVariation,
              },
            });
            set({
              averageCycleLength,
              cycleVariation,
            });
          } catch (error) {
            set({ error: "Failed to update insights" });
            console.error("Error updating insights:", error);
          } finally {
            set({ loading: false });
          }
        }
      },

      setCalendarId: (id: string) => set({ calendarId: id }),
      setCalendarPermission: (hasPermission: boolean) =>
        set({ hasCalendarPermission: hasPermission }),
      setNextPeriodDate: (date: Date) => set({ nextPeriodDate: date }),
      reset: () =>
        set({
          lastPeriodStart: null,
          periodEndDate: null,
          nextPeriodDate: null,
          cycleHistory: [],
          selectedSymptoms: [],
          averageCycleLength: null,
          cycleVariation: null,
          error: null,
        }),
    }),
    {
      name: "period-tracker-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastPeriodStart: state.lastPeriodStart,
        periodEndDate: state.periodEndDate,
        cycleHistory: state.cycleHistory,
        selectedSymptoms: state.selectedSymptoms,
        averageCycleLength: state.averageCycleLength,
        cycleVariation: state.cycleVariation,
        // Don't persist loading, error states, or calendar-related data
      }),
    }
  )
);
