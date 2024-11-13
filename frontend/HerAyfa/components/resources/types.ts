export type SupportType = "emotional" | "resources" | "guidance" | "companionship";

export type VerificationStatus = "unverified" | "pending" | "verified";

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  supportRequestId: string;
};

export type TabType = "all" | "user";

export type User = {
  id: string;
  displayName: string;
  verificationStatus: VerificationStatus;
  badges: string[];
  rating: number;
  helpCount: number;
  joinDate: Date;
};

export interface SupportRequestCard {
  id: string;
  title: string;
  description: string;
  type: SupportType;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  date: string;
  anonymous: boolean;
  userName?: string;
  userId: string;
  isEmergency: boolean;
  status: "open" | "in-progress" | "closed";
  distance?: number;
}