import { addDays, startOfDay, differenceInDays } from "date-fns";
import * as Calendar from "expo-calendar";
import { ColorScheme, CycleData, FirestoreTimestamp, PeriodEvent } from "./types";
import { Colors } from "@/constants/Colors";

// Add type guard
const isValidColorScheme = (scheme: string): scheme is ColorScheme => {
  return scheme === 'light' || scheme === 'dark';
};

export const calculateCycleInsights = (cycleHistory: CycleData[]) => {
  const cycleLengths = cycleHistory.slice(1).map((cycle, index) => {
    return differenceInDays(cycle.startDate, cycleHistory[index].startDate);
  });

  const avg = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
  const averageCycleLength = Math.round(avg);

  const variance = cycleLengths.reduce((sum, length) => sum + Math.pow(length - avg, 2), 0) / cycleLengths.length;
  const cycleVariation = Math.round(Math.sqrt(variance));

  return { averageCycleLength, cycleVariation };
};

export const calculateAndCreateEvents = async (
  lastPeriodStart: Date,
  calendarId: string,
  getEventColor: (type: string) => string,
  getEventTitle: (type: string) => string,
  getEventNotes: (type: string) => string
): Promise<PeriodEvent[]> => {
  // Clear existing events
  const startDate = new Date();
  const endDate = addDays(startDate, 90); // 3 months
  const existingEvents = await Calendar.getEventsAsync(
    [calendarId],
    startDate,
    endDate
  );

  for (const event of existingEvents) {
    await Calendar.deleteEventAsync(event.id);
  }

  const cycleLength = 28;
  const periodLength = 5;
  let currentDate = startOfDay(lastPeriodStart);
  const events: PeriodEvent[] = [];

  // Create events for the next 3 cycles
  for (let cycle = 0; cycle < 3; cycle++) {
    // Period events
    const periodEvent: PeriodEvent = {
      startDate: currentDate,
      endDate: addDays(currentDate, periodLength),
      type: "period",
    };
    events.push(periodEvent);

    // Fertile window events (typically days 11-17 of cycle)
    const fertileStart = addDays(currentDate, 11);
    const fertileEvent: PeriodEvent = {
      startDate: fertileStart,
      endDate: addDays(fertileStart, 6),
      type: "fertile",
    };
    events.push(fertileEvent);

    // Ovulation event (typically day 14 of cycle)
    const ovulationDate = addDays(currentDate, 14);
    const ovulationEvent: PeriodEvent = {
      startDate: ovulationDate,
      endDate: addDays(ovulationDate, 1),
      type: "ovulation",
    };
    events.push(ovulationEvent);

    currentDate = addDays(currentDate, cycleLength);
  }

  // Create calendar events
  for (const event of events) {
    await Calendar.createEventAsync(calendarId, {
      title: getEventTitle(event.type),
      startDate: event.startDate,
      endDate: event.endDate,
      allDay: true,
      notes: `${getEventNotes(event.type)}\nColor Code: ${getEventColor(event.type)}`,
    });
  }

  return events;
};

// Helper functions for event formatting
export const getEventTitle = (type: string): string => {
  switch (type) {
    case "period":
      return "🩸 Period";
    case "fertile":
      return "✨ Fertile Window";
    case "ovulation":
      return "🥚 Ovulation Day";
    default:
      return "";
  }
};

export const getEventColor = (type: string, colorScheme: string = 'light'): string => {
    const scheme = isValidColorScheme(colorScheme) ? colorScheme : 'light';
    
    switch (type) {
      case "period":
        return "#FF6B6B";
      case "fertile":
        return "#4ECDC4";
      case "ovulation":
        return "#45B7D1";
      default:
        return Colors[scheme].text;
    }
  };

export const getEventNotes = (type: string): string => {
  switch (type) {
    case "period":
      return "Remember to track your symptoms and take care of yourself";
    case "fertile":
      return "Higher chance of pregnancy during this window";
    case "ovulation":
      return "Highest fertility day of your cycle";
    default:
      return "";
  }
};

// Helper function to safely convert Firestore timestamp to Date
export const convertTimestampToDate = (timestamp: FirestoreTimestamp | Date | null): Date | null => {
  if (!timestamp) return null;
  
  // Check if it's a Firestore timestamp (has _seconds property)
  if ('_seconds' in timestamp) {
    return new Date(timestamp._seconds * 1000);
  }
  
  // If it's already a Date, return it
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  return null;
};