// Core Data Types
export interface PregnancyData {
  userId: string;
  dueDate: Date;
  lastPeriodDate: Date;
  currentWeek: number;
  symptoms: PregnancySymptom[];
  appointments: Appointment[];
  weightEntries: WeightEntry[];
  kickCounts: KickCount[];
  checklist: ChecklistItem[];
  memories: Memory[];
}

export interface PregnancySymptom {
  id: string;
  date: Date;
  type: PregnancySymptomType;
  severity: 1 | 2 | 3;
  notes?: string;
}

export interface Appointment {
  id: string;
  date: Date;
  type: AppointmentType;
  doctor: string;
  location: string;
  notes: string;
}

export interface WeightEntry {
  date: Date;
  weight: number;
}

export interface KickCount {
  date: Date;
  startTime: Date;
  endTime: Date;
  count: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  category: ChecklistCategory;
}

export interface Memory {
  id: string;
  date: Date;
  type: MemoryType;
  content: string;
  mediaUrl?: string;
}

// Type Definitions
export type MemoryType = "photo" | "note" | "milestone";

export type AppointmentType =
  | "checkup"
  | "ultrasound"
  | "blood_test"
  | "screening"
  | "other";

export type ChecklistCategory =
  | "health"
  | "shopping"
  | "preparation"
  | "documents";

// Enums
export enum PregnancySymptomType {
  Nausea = "Nausea",
  Fatigue = "Fatigue",
  Headache = "Headache",
  Cramps = "Cramps",
  Heartburn = "Heartburn",
  Bloating = "Bloating",
  BackPain = "Back Pain",
  LegCramps = "Leg Cramps",
  Insomnia = "Insomnia",
  MoodSwings = "Mood Swings",
}

// Development Tracking
export interface BabySize {
  week: number;
  fruit: string;
  length: string;
  weight: string;
}

export interface DevelopmentMilestone {
  week: number;
  title: string;
  description: string;
}

export const getWeeklyMilestones = (
  currentWeek: number
): DevelopmentMilestone[] => {
  const milestones: DevelopmentMilestone[] = [
    {
      week: 4,
      title: "Early Development",
      description:
        "The neural tube begins to form, which will develop into " +
        "the brain and spinal cord.",
    },
    {
      week: 8,
      title: "Major Organs Form",
      description:
        "All major organs and structures have begun to form. " +
        "Baby's heart beats at 150-160 times per minute.",
    },
    {
      week: 12,
      title: "Complete Fetus",
      description:
        "Baby is now fully formed. Organs are beginning to " +
        "function on their own.",
    },
    {
      week: 16,
      title: "Movement Begins",
      description:
        "Baby starts making sucking motions. You may begin to " +
        "feel movement.",
    },
    {
      week: 20,
      title: "Halfway Point",
      description:
        "Baby can hear sounds and is developing sleep patterns. " +
        "Gender may be visible on ultrasound.",
    },
    {
      week: 24,
      title: "Viability",
      description:
        "Baby's chances of survival outside the womb increase " +
        "significantly from this point.",
    },
    {
      week: 28,
      title: "Brain Development",
      description:
        "Baby's brain is developing rapidly. Eyes can open and close.",
    },
    {
      week: 32,
      title: "Preparing for Birth",
      description:
        "Baby is practicing breathing movements and typically " +
        "positions head-down.",
    },
    {
      week: 36,
      title: "Final Growth",
      description:
        "Baby's lungs are nearly mature. Gaining about an " + "ounce a day.",
    },
    {
      week: 40,
      title: "Full Term",
      description: "Baby is fully developed and could arrive any day now.",
    },
  ];

  return milestones.filter((milestone) => milestone.week <= currentWeek);
};
