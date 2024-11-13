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

export interface HealthStore {
  healthTips: { tips: HealthTip[] };
  healthArticles: HealthArticle[];
  nearbyServices: NearbyService[];
  loading: boolean;
  fetchHealthTips: () => Promise<void>;
  fetchHealthArticles: () => Promise<void>;
  fetchNearbyServices: (latitude: number, longitude: number) => Promise<void>;
  emergencyContacts: CountryEmergencyContacts[];
  selectedCountry: string;
  setSelectedCountry: (countryCode: string) => void;
  fetchEmergencyContacts: () => Promise<void>;
}
