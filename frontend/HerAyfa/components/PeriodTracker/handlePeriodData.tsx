import { CycleData, Symptom } from './types';

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface RawPeriodData {
  cycleHistory?: Array<{
    endDate: FirestoreTimestamp | string | Date;
    startDate: FirestoreTimestamp | string | Date;
    length?: number;
    symptoms?: Array<{
      id: string;
      name: string;
      intensity: 1 | 2 | 3;
      date: FirestoreTimestamp | string | Date;
    }>;
  }>;
  insights?: {
    averageCycleLength: number;
    cycleVariation: number;
  };
  lastPeriodStart?: FirestoreTimestamp | string | Date;
  periodEndDate?: FirestoreTimestamp | string | Date;
  userId?: string;
  updatedAt?: FirestoreTimestamp;
}

interface ValidatedPeriodData {
  cycleHistory: Array<{
    endDate: Date;
    startDate: Date;
    length: number;
    symptoms: Array<{
      id: string;
      name: string;
      intensity: 1 | 2 | 3;
      date: Date;
    }>;
  }>;
  insights: {
    averageCycleLength: number;
    cycleVariation: number;
  };
  lastPeriodStart?: Date;
  periodEndDate?: Date;
  userId?: string;
}

function convertToDate(value: FirestoreTimestamp | string | Date | undefined): Date | undefined {
  if (!value) return undefined;
  
  try {
    // Handle Firestore timestamp
    if (typeof value === 'object' && '_seconds' in value) {
      const date = new Date(value._seconds * 1000 + value._nanoseconds / 1000000);
      return isNaN(date.getTime()) ? undefined : date;
    }
    
    // Handle string
    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }
    
    // Handle Date object
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? undefined : value;
    }
  } catch (error) {
    console.error('Error converting date:', error);
  }
  
  return undefined;
}

export function validatePeriodData(rawData: RawPeriodData): {
  isValid: boolean;
  data: ValidatedPeriodData | null;
  error: string | null;
} {
  try {
    if (!rawData) {
      return { isValid: false, data: null, error: 'No data provided' };
    }

    const validatedData: ValidatedPeriodData = {
      cycleHistory: [],
      insights: {
        averageCycleLength: 0,
        cycleVariation: 0
      }
    };

    // Convert dates - only set if valid
    const lastPeriodStart = convertToDate(rawData.lastPeriodStart);
    const periodEndDate = convertToDate(rawData.periodEndDate);
    
    if (lastPeriodStart) validatedData.lastPeriodStart = lastPeriodStart;
    if (periodEndDate) validatedData.periodEndDate = periodEndDate;

    // Validate insights
    if (rawData.insights) {
      validatedData.insights = {
        averageCycleLength: Number(rawData.insights.averageCycleLength) || 0,
        cycleVariation: Number(rawData.insights.cycleVariation) || 0
      };
    }

    // Validate cycle history
    if (Array.isArray(rawData.cycleHistory)) {
      const validCycles = rawData.cycleHistory
        .map(cycle => {
          const startDate = convertToDate(cycle.startDate);
          const endDate = convertToDate(cycle.endDate);
          
          if (!startDate || !endDate) {
            return null;
          }

          const validSymptoms = Array.isArray(cycle.symptoms) 
            ? cycle.symptoms
                .map(symptom => {
                  const symptomDate = convertToDate(symptom.date);
                  if (!symptomDate) return null;
                  
                  return {
                    id: String(symptom.id),
                    name: String(symptom.name),
                    intensity: Math.min(Math.max(Number(symptom.intensity), 1), 3) as 1 | 2 | 3,
                    date: symptomDate
                  };
                })
                .filter((s): s is NonNullable<typeof s> => s !== null)
            : [];

          return {
            startDate,
            endDate,
            length: cycle.length || Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
            symptoms: validSymptoms
          };
        })
        .filter((cycle): cycle is NonNullable<typeof cycle> => cycle !== null);

      validatedData.cycleHistory = validCycles;
    }

    if (rawData.userId) {
      validatedData.userId = String(rawData.userId);
    }

    return {
      isValid: true,
      data: validatedData,
      error: null
    };
  } catch (error) {
    return {
      isValid: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error during validation'
    };
  }
}

export function handlePeriodData(rawData: RawPeriodData): ValidatedPeriodData | null {
  const { isValid, data, error } = validatePeriodData(rawData);
  
  if (!isValid || !data) {
    console.error('Period data validation failed:', error);
    return null;
  }
  
  return data;
}
