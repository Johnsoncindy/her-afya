// store/types/tracker.ts

export type SymptomId = 'cramps' | 'headache' | 'mood' | 'fatigue' | 'bloating' | 'acne';
export type SymptomName = 'Cramps' | 'Headache' | 'Mood Changes' | 'Fatigue' | 'Bloating' | 'Acne';

export interface Symptom {
  id: SymptomId;
  name: SymptomName;
  intensity: 1 | 2 | 3;
  date: Date;
}

export interface UserPeriodData {
    userId: string;
    cycleHistory: CycleData[];
    lastPeriodStart: Date;
    periodEndDate: Date | null;
    insights: Insights;
  }

export interface CycleData {
  startDate: Date;
  endDate: Date;
  length: number;
  symptoms: Symptom[];
}

export interface Insights {
  averageCycleLength: number;
  cycleVariation: number;
}

export interface TrackerState {
  // Period Tracking
  cycleHistory: CycleData[];
  lastPeriodStart: Date | null;
  periodEndDate: Date | null;
  nextPeriodDate: Date | null;
  insights: Insights;
  selectedSymptoms: Symptom[];
  
  // Fertility Tracking
  fertileDays: Date[];
  ovulationDate: Date | null;
  
  // Pregnancy Tracking
  pregnancyStartDate: Date | null;
  dueDate: Date | null;
  
  // Loading and Error States
  isLoading: boolean;
  error: string | null;
}

export interface TrackerActions {
  // Period Tracking Actions
  createOrUpdatePeriodData: (userId: string) => Promise<void>;
  addCycleData: (userId: string, cycleData: CycleData) => Promise<void>;
  addSymptom: (userId: string, symptom: Symptom, cycleIndex: number) => Promise<void>;
  updateInsights: (userId: string, insights: Insights) => Promise<void>;
  getPeriodData: (userId: string) => Promise<void>;
  setPeriodStartDate: (date: Date) => void;
  setPeriodEndDate: (date: Date) => void;
  setNextPeriodDate: (date: Date) => void;
  
  // Fertility Tracking Actions
  updateFertileDays: (dates: Date[]) => void;
  setOvulationDate: (date: Date) => void;
  
  // Pregnancy Tracking Actions
  setPregnancyStartDate: (date: Date) => void;
  calculateDueDate: () => void;
  
  // Utility Actions
  resetError: () => void;
  clearStore: () => void;
}

// Define constants
export const SYMPTOMS: { id: SymptomId; name: SymptomName }[] = [
  { id: 'cramps', name: 'Cramps' },
  { id: 'headache', name: 'Headache' },
  { id: 'mood', name: 'Mood Changes' },
  { id: 'fatigue', name: 'Fatigue' },
  { id: 'bloating', name: 'Bloating' },
  { id: 'acne', name: 'Acne' },
];

export type SymptomType = typeof SYMPTOMS[number];
export type EventType = 'period' | 'fertile' | 'ovulation';
export type ColorScheme = 'light' | 'dark';
