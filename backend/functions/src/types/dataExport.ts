export interface WeightEntry {
  date: string;
  weight: number;
}

export interface Appointment {
  date: string;
  type: string;
  doctor: string;
  location: string;
  notes?: string;
}
export interface Symptom {
  date: string;
  type: string;
  severity: "mild" | "moderate" | "severe";
  notes?: string;
}

export interface KickCount {
  date: Date;
  startTime: Date;
  endTime: Date;
  count: number;
}

export interface PregnancyJourney {
  dueDate: string;
  currentWeek: number;
  weightEntries?: WeightEntry[];
  appointments?: Appointment[];
  symptoms?: Symptom[];
  lastPeriodDate: Date;
  kickCounts: KickCount[];
}

export interface CycleEntry {
  startDate: string;
  endDate: string;
  length: number;
  symptoms: string[];
}

export interface PeriodTracking {
  cycleHistory?: CycleEntry[];
}

export interface UserHealthData {
  periodTracking: PeriodTracking | null;
  pregnancyJourney: PregnancyJourney | null;
}
