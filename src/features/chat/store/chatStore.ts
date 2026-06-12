import { create } from "zustand";
import type { ConnectionStatus, Message, MessageStatus } from "../model/types";

interface ChatState {
  connectionStatus: ConnectionStatus;
  messages: Message[];

  hydrateMessages: (messages: Message[]) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;

  addPendingMessage: (message: Message) => void;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  addIncomingMessage: (message: Message) => void;

  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  connectionStatus: "disconnected",
  messages: [],

  hydrateMessages: (messages) => set({ messages }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  addPendingMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessageStatus: (id, status) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id && m.type === "text" ? { ...m, status } : m,
      ),
    })),

  addIncomingMessage: (message) =>
    set((state) => {
      if (state.messages.some((m) => m.id === message.id)) return state;
      return { messages: [...state.messages, message] };
    }),

  reset: () => set({ connectionStatus: "disconnected", messages: [] }),
}));
