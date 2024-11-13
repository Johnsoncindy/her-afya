import { User } from "@/components/resources/types";

export interface Message {
  createdAt: any;
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatPreview {
  id: string;
  supportRequestId: string;
  lastMessage: string;
  timestamp: Date;
  participantId: string;
  participantName: string;
  unreadCount: number;
}

export type SupportType =
  | "emotional"
  | "resources"
  | "guidance"
  | "companionship";

export interface SupportRequest {
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
  displayName?: string;
  user: User;
  userId: string;
  isEmergency: boolean;
  status: "open" | "in-progress" | "closed";
  distance?: number;
}

export interface SupportStore {
  supportRequests: SupportRequest[];
  messages: Message[];
  loading: boolean;
  error: string | null;

  fetchSupportRequests: () => Promise<void>;
  fetchMessages: (requestId: string, userId: string) => Promise<void>;
  sendMessage: (
    messageContent: string,
    senderId: string,
    receiverId: string,
    supportRequestId: string
  ) => Promise<void>;
  chatPreviews: ChatPreview[];
  fetchChatPreviews: (userId: string) => Promise<void>;
}
