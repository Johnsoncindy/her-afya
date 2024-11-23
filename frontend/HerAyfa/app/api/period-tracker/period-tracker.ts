import client from "../client";
interface UserPeriodData {
  userId: string;
  cycleHistory: CycleData[];
  lastPeriodStart: Date;
  periodEndDate: Date | null;
  insights: {
    averageCycleLength: number;
    cycleVariation: number;
  };
}
interface UserCycleData {
  cycleData: CycleData;
  userId: string;
}

export const SYMPTOMS = [
  { id: "cramps", name: "Cramps" },
  { id: "headache", name: "Headache" },
  { id: "mood", name: "Mood Changes" },
  { id: "fatigue", name: "Fatigue" },
  { id: "bloating", name: "Bloating" },
  { id: "acne", name: "Acne" },
] as const;

export type SymptomType = (typeof SYMPTOMS)[number];
export type SymptomId = SymptomType["id"];
export type SymptomName = SymptomType["name"];

export interface Symptom {
  id: SymptomId;
  name: SymptomName;
  intensity: 1 | 2 | 3;
  date: Date;
}

export interface SelectedSymptomTemp {
  id: string;
  name: string;
}

export interface PeriodEvent {
  startDate: Date;
  endDate: Date;
  type: "period" | "fertile" | "ovulation";
}

export interface CycleData {
  startDate: Date;
  endDate: Date;
  length: number;
  symptoms: Symptom[];
}

export type ColorScheme = "light" | "dark";
export type EventType = "period" | "fertile" | "ovulation";

export interface EventHandlers {
  getEventColor: (type: EventType, colorScheme?: ColorScheme) => string;
  getEventTitle: (type: EventType) => string;
  getEventNotes: (type: EventType) => string;
}

export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}


const endpoint = "/period-tracking";

export const createOrUpdatePeriodData = async (periodData: UserPeriodData) =>
  client.put(`${endpoint}/period-data`, periodData);
export const getPeriodData = async (userId: string) =>
  client.get(`${endpoint}/period-data/${userId}`);
export const addCycleData = async (userCycleData: UserCycleData) =>
  client.post(`${endpoint}/cycles`, userCycleData);
export const addSymptom = async (symptomData: any) =>
  client.post(`${endpoint}/symptoms`, symptomData);
export const updateInsights = async (insightsData: any) =>
  client.put(`${endpoint}/insights`, insightsData);

