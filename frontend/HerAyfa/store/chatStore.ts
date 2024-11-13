import { create } from "zustand";


interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isSaved?: boolean;
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, update: Partial<Message>) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, update) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, ...update } : message
      ),
    })),
}));
