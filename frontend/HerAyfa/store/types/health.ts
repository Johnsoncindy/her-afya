export interface EmergencyContact {
  type: string;
  number: string;
  description: string;
}

export interface CountryEmergencyContacts {
  countryCode: string;
  contacts: EmergencyContact[];
}

export interface EmergencyContactsResponse {
  contacts: CountryEmergencyContacts[];
}

export interface HealthTip {
  category: string;
  title: string;
  description: string;
  image?: string;
  id: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface HealthArticle {
  category: string;
  title: string;
  description: string;
  image?: string;
  content: string;
  videoUrl: string;
  type: string;
  id: string;
}

export interface NearbyService {
  name: string;
  type: string;
  status: string;
  rating: number;
  isOpen?: boolean;
  totalRatings?: number;
  vicinity?: string;
  latitude?: number;
  longitude?: number;
}

// Interface for the raw service data returned from the API
export interface GooglePlaceService {
  name: string;
  types: string[];
  business_status: string;
  rating: number;
  opening_hours?: {
    open_now: boolean;
  };
  user_ratings_total?: number;
  vicinity?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GeminiResponse {
  botReply: {
    candidates: [{
      content: {
        parts: [{
          text: string;
        }];
      };
    }];
    usageMetadata: {
      totalTokenCount: number;
    };
  };
}

export interface MedicationReminder {
  id: string;
  userId: string;
  category: 'medication';
  title: string;
  date: string;
  time: string;
  description: string;
  medicationName: string;
  frequency: string;
  dosage: string;
  endDate: string;
  completed: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface AppointmentReminder {
  id: string;
  userId: string;
  type?: string;
  category: 'appointment';
  title: string;
  date: string;
  time: string;
  notes?: string;
  description: string;
  doctor: string;
  location: string;
  completed: boolean;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export type Reminder = MedicationReminder | AppointmentReminder;

export interface ReminderResponse {
  reminders: Reminder[];
}
export interface HealthStore {
  healthTips: { tips: HealthTip[] };
  healthArticles: HealthArticle[];
  nearbyServices: NearbyService[];
  reminders: ReminderResponse | null;
  loading: boolean;

  fetchHealthTips: (force?: boolean) => Promise<void>;
  fetchHealthArticles: (force?: boolean) => Promise<void>;
  fetchNearbyServices: (latitude: number, longitude: number) => Promise<void>;
  fetchEmergencyContacts: (force?: boolean) => Promise<void>;
  setSelectedCountry: (countryCode: string) => void;
  fetchReminders: () => Promise<void>;
 
  emergencyContacts: CountryEmergencyContacts[];
  selectedCountry: string;

}

