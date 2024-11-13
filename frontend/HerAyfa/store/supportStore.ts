import { create } from "zustand";
import { SupportStore } from "./types/support";
import { getSupportRequests, getMessages, sendMessage, getChatPreviews } from "@/app/api/support/support";

export const useSupportStore = create<SupportStore>((set, get) => ({
  supportRequests: [],
  messages: [],
  loading: false,
  error: null,
  chatPreviews: [],

  fetchSupportRequests: async () => {
    set({ loading: true });
    try {
      const response = await getSupportRequests();
      set({ supportRequests: response.data.requests, loading: false });
    } catch (error: unknown) {
      set({ error: String(error), loading: false });
    }
  },

  fetchMessages: async (requestId, userId) => {
    set({ loading: true, error: null });
    try {
      const messages = (await getMessages(requestId, userId)).data.messages;
      set({ messages, loading: false });
    } catch (error: unknown) {
      set({ error: String(error), loading: false });
    }
  },

  sendMessage: async (messageContent, senderId, receiverId, supportRequestId) => {
    try {
      const newMessage = await sendMessage({
        content: messageContent,
        senderId,
        receiverId,
        supportRequestId,
      });
      set((state) => ({ messages: [...state.messages, newMessage] }));
    } catch (error: unknown) {
      set({ error: String(error) });
    }
  },
  fetchChatPreviews: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await getChatPreviews(userId);
      const previews = response.chatPreviews.map((preview: any) => ({
        ...preview,
        timestamp: new Date(preview.timestamp._seconds * 1000), // Convert Firestore timestamp
      }));
      set({ chatPreviews: previews, loading: false });
      return previews; // Return the previews
    } catch (error: unknown) {
      set({ error: String(error), loading: false });
      return []; // Return an empty array on error
    }
  },
  
}));
