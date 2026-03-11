import { createContext } from "react";

export type MessageTag = "success" | "error" | "info";

export interface Message {
  id: number;
  text: string;
  tag: MessageTag;
}

export interface MessagesContextType {
  addMessage: (text: string, tag?: MessageTag) => void;
}

export const MessagesContext = createContext<MessagesContextType | null>(null);
