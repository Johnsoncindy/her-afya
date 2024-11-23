import client from "../client";

interface SupportRequest {
  id?: string;
  title: string;
  description: string;
  type: "emotional" | "resources" | "guidance" | "companionship";
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isEmergency: boolean;
  anonymous: boolean;
  userId: string;
}

interface Message {
  id?: string;
  supportRequestId: string;
  senderId: string;
  receiverId: string;
  content: string;
}

interface MessageData {
  supportRequestId: string;
  userId: string;
}

const endpoint = "support";

export const createSupportRequest = (supportData: SupportRequest) =>
  client.post(`/${endpoint}/support-requests`, supportData);
export const getSupportRequests = async () =>
  client.get(`/${endpoint}/support-requests`);

export const sendMessage = async (messageData: Message) => {
  const response = await client.post(`/${endpoint}/messages`, messageData);
  return response.data;
};
export const getMessages = (supportRequestId: string, userId: string) =>
  client.get(`/${endpoint}/messages/${supportRequestId}/${userId}`);
export const getChatPreviews = async (userId: string) => {
  try {
    const response = await client.get(`${endpoint}/chat-previews/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat previews:", error);
    throw new Error("Failed to fetch chat previews");
  }
};
export const markMessageAsRead = (messageData: MessageData) => client.post(`${endpoint}/mark-read`, messageData);

