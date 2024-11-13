import { Ionicons } from "@expo/vector-icons";

export type Symptom = {
  id: string;
  name: string;
  category: "physical" | "emotional" | "other";
  severity?: 1 | 2 | 3;
};

export type MoodEntry = {
  id: string;
  mood: "happy" | "sad" | "anxious" | "energetic" | "tired" | "neutral";
  timestamp: Date;
  notes?: string;
};

export type PeriodLog = {
  id: string;
  date: Date;
  flow: "light" | "medium" | "heavy";
  symptoms: Symptom[];
  notes?: string;
};

export type FertilityLog = {
  id: string;
  date: Date;
  cervicalMucus?: "dry" | "sticky" | "creamy" | "watery" | "eggWhite";
  temperature?: number;
  ovulationTest?: "positive" | "negative";
  notes?: string;
};

export type HealthLog = {
  id: string;
  date: Date;
  type: "period" | "fertility" | "symptom" | "mood";
  data: PeriodLog | FertilityLog | Symptom[] | MoodEntry;
};

export type QuickAction = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    route: string;
  };
  